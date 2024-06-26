import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, ButtonComponent, Setting, debounce, normalizePath } from 'obsidian';
import { Locals } from "./src/i18n/i18n";
import { addDonationElement } from 'src/settings/donation';

const css_filename = "metadata-icon-auto-gen"
export interface IconAttrSetting {
	entry: string;
	image: string;
}

export interface cssAfterConfiguration {
	top: string;
	left: string;
	opacity: number;
}

interface MetadataIconSettings {
	IconAttrList: Array<IconAttrSetting>;
	cssAfterConfig: cssAfterConfiguration;
}

const DEFAULT_SETTINGS: MetadataIconSettings = {
	IconAttrList: [],
	cssAfterConfig: { top: "6px", left: "3px", opacity: 0.5 }
}

const EMPTY_PNG_DATA_URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="

export default class MetadataIcon extends Plugin {
	settings: MetadataIconSettings;
	resourceBase: string;

	async onload() {
		let resourcePath = this.app.vault.adapter.getResourcePath("");
		this.resourceBase = resourcePath.match(/(app:\/\/\w*?)\//)?.[1] as string;

		await this.loadSettings();
		this.addSettingTab(new MetadataHiderSettingTab(this.app, this));
		await this.genSnippetCSS(this);
	}

	onunload() {
		// @ts-ignore
		const customCss = this.app.customCss;
		customCss.enabledSnippets.delete(css_filename);
		customCss.requestLoadSnippets();
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	getResourcePath(path: string): string {
		if (/^(https?:\/\/|data:)/.test(path)) {
			return path;
		}
		const adapter = this.app.vault.adapter;

		if (path.startsWith("/") ) {
			return this.resourceBase + path;
		} else if (/^[C-Z]:[\/\\]/.test(path)) { 
			return normalizePath(this.resourceBase + "/" + path.replace(/\\/g, "/"));
		} else {
			return adapter.getResourcePath(path);
		}
	}

	genEntryCSS(s: IconAttrSetting, c: cssAfterConfiguration): string {
		const selector = `data-property-key="${s.entry}"`;
		const url = this.getResourcePath(s.image);
		let body: string[] = [
			`.metadata-property[${selector}] .metadata-property-key::after {`,
			`	content: "";`,
			`	background-image: url("${url}");`,
			`	background-size: 20px;`,
			`	width: 20px;`,
			`	height: 20px;`,
			`	position: absolute;`,
			`	left: ${c.left};`,
			`	top: ${c.top};`,
			`	z-index: -100;`,
			`	opacity: ${c.opacity};`,
			`	background-repeat: no-repeat;`,
			`}`,
			`.metadata-property[${selector}] .metadata-property-icon svg {`,
			`	visibility: hidden;`,
			`}`,
			``,
		]
		return body.join('\n');
	}

	async genSnippetCSS(plugin: MetadataIcon) {
		const content: string[] = [
			"/* * WARNING: This file will be overwritten by plugin `Metadata Icon`.",
			"   * DO NOT EDIT THIS FILE DIRECTLY!!!",
			"   * Do not edit this file directly!!!",
			"*/",
			"",
			".setting-item-description:has(.metadata-icon-preview) {",
			"	display: flex;",
			"	align-items: center;",
			"	justify-content: space-around;",
			"}",
			"",
		];

		plugin.settings.IconAttrList.forEach((iconSetting, index) => {
			content.push(this.genEntryCSS(iconSetting, plugin.settings.cssAfterConfig));
		})


		const vault = plugin.app.vault;
		const ob_config_path = vault.configDir;
		const snippets_path = ob_config_path + "/snippets";

		const path = `${snippets_path}/${css_filename}.css`;
		if (!(await vault.adapter.exists(snippets_path))) { await vault.adapter.mkdir(snippets_path); }
		if (await vault.adapter.exists(path)) { await vault.adapter.remove(path) }
		await plugin.app.vault.create(path, content.join('\n'));
		// Activate snippet
		// @ts-ignore
		const customCss = plugin.app.customCss;
		customCss.enabledSnippets.add(css_filename);
		customCss.requestLoadSnippets();
	}
}


class MetadataHiderSettingTab extends PluginSettingTab {
	plugin: MetadataIcon;
	debouncedGenerate: Function;

	constructor(app: App, plugin: MetadataIcon) {
		super(app, plugin);
		this.plugin = plugin;
		this.debouncedGenerate = debounce(this.generateSnippet, 1000, true);
	}

	async generateSnippet() {
		await this.plugin.genSnippetCSS(this.plugin);
	}

	display(): void {
		const { containerEl } = this;
		const t = Locals.get();

		containerEl.empty();

		new Setting(containerEl)
			.setName(t.settingAddIconName)
			.setDesc(t.settingAddIconDesc)
			.addButton((button: ButtonComponent) => {
				button.setTooltip("Add new icon")
					.setButtonText("+")
					.setCta().onClick(async () => {
						this.plugin.settings.IconAttrList.unshift({
							entry: "",
							image: "",
						});
						await this.plugin.saveSettings();
						this.display();
					});
			})
		this.plugin.settings.IconAttrList.forEach((iconSetting, index) => {
			const s = new Setting(this.containerEl);
			let span = s.descEl.createEl("span", { text: t.settingAddIconDescElSpan });
			span.setAttribute("style", `margin-right: 2px; `);
			let img = s.descEl.createEl("img", { cls: "metadata-icon-preview" });
			img.setAttribute("src", this.plugin.getResourcePath(iconSetting.image.trim() || EMPTY_PNG_DATA_URL));


			img.setAttribute("width", `20px`);
			img.setAttribute("style", `background-color: transparent;`);
			s.addText((cb) => {
				cb.setPlaceholder(t.settingAddIconPlaceholderEntry)
					.setValue(iconSetting.entry)
					.onChange(async (newValue) => {
						this.plugin.settings.IconAttrList[index].entry = newValue;
						await this.plugin.saveSettings();
						this.debouncedGenerate();
					});
			})
			s.addText((cb) => {
				cb.setPlaceholder(t.settingAddIconPlaceholderImage)
					.setValue(iconSetting.image)
					.onChange(async (newValue) => {
						img.setAttribute("src", this.plugin.getResourcePath(newValue || EMPTY_PNG_DATA_URL));
						this.plugin.settings.IconAttrList[index].image = newValue;
						await this.plugin.saveSettings();
						this.debouncedGenerate();
					});
			});
			s.addExtraButton((cb) => {
				cb.setIcon("cross")
					.setTooltip(t.settingRemoveIconTooltip)
					.onClick(async () => {
						this.plugin.settings.IconAttrList.splice(index, 1);
						await this.plugin.saveSettings();
						this.display();
						this.debouncedGenerate();
					});
			});
		});

		containerEl.createEl("h3", { text: "Advanced" });

		new Setting(containerEl)
			.setName("top offset")
			.setDesc("")
			.addText((cb) => {
				cb.setPlaceholder(t.settingAddIconPlaceholderImage)
					.setValue(this.plugin.settings.cssAfterConfig.top)
					.onChange(async (newValue) => {
						this.plugin.settings.cssAfterConfig.top = newValue;
						await this.plugin.saveSettings();
						this.debouncedGenerate();
					});
			})
		new Setting(containerEl)
			.setName("left offset")
			.setDesc("")
			.addText((cb) => {
				cb.setPlaceholder(t.settingAddIconPlaceholderImage)
					.setValue(this.plugin.settings.cssAfterConfig.left)
					.onChange(async (newValue) => {
						this.plugin.settings.cssAfterConfig.left = newValue;
						await this.plugin.saveSettings();
						this.debouncedGenerate();
					});
			})
		new Setting(containerEl)
			.setName("opacity")
			.setDesc("")
			.addText((cb) => {
				cb.setPlaceholder(t.settingAddIconPlaceholderImage)
					.setValue(this.plugin.settings.cssAfterConfig.opacity.toString())
					.onChange(async (newValue) => {
						try {
							let v = parseFloat(newValue);
							if (v < 0 || v > 1) {
								throw new Error();
							}
							this.plugin.settings.cssAfterConfig.opacity = v;
							await this.plugin.saveSettings();
							this.debouncedGenerate();
						} catch (e) {
							new Notice("Invalid opacity value, please enter a number between 0 and 1");
						}
					});
			})

		const pluginDescEl = containerEl.createEl("div");
		pluginDescEl.setAttribute("style", "color: gray; font-size: 12px; margin-top: 30px;");
		pluginDescEl.innerHTML = t.settings.readmeHTML;


		addDonationElement(containerEl);
	}
}
