import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, ButtonComponent, Setting, debounce } from 'obsidian';

export interface IconAttrSetting {
	entry: string;
	image: string;
}

interface MetadataIconSettings {
	IconAttrList: Array<IconAttrSetting>;
}

const DEFAULT_SETTINGS: MetadataIconSettings = {
	IconAttrList: [{ entry: 'github', image: 'https://icones.pro/wp-content/uploads/2021/06/icone-github-violet.png' }],
}

export default class MetadataIcon extends Plugin {
	settings: MetadataIconSettings;
	styleTag: HTMLStyleElement;

	debounceUpdateCSS = debounce(this.updateCSS, 1000, true);


	async onload() {
		await this.loadSettings();
		this.addSettingTab(new MetadataHiderSettingTab(this.app, this));

		this.updateCSS();
	}

	onunload() {
	}

	updateCSS() {
		this.styleTag = document.createElement('style');
		this.styleTag.id = 'css-metadata-icon';
		console.log(document.getElementsByTagName('head'))
		let headElement: HTMLElement = document.getElementsByTagName('head')[0];
		const existingStyleTag = headElement.querySelector('#css-metadata-icon') as HTMLStyleElement | null;

		if (existingStyleTag) {
			existingStyleTag.parentNode?.removeChild(existingStyleTag);
		}

		headElement.appendChild(this.styleTag);
		this.styleTag.innerText = genSnippetCSS(this);
	}


	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

function genEntryCSS(s: IconAttrSetting): string {
	const selector = `data-property-key="${s.entry}"`;
	let body: string[] = [
		`.metadata-property[${selector}] .metadata-property-key::after {`,
		`	content: "";`,
		`	background-image: url("${s.image}");`,
		`	background-size: 20px;`,
		`	width: 20px;`,
		`	height: 20px;`,
		`	position: absolute;`,
		`	left: 3px;`,
		`	top: 6px;`,
		`	z-index: -100;`,
		`	opacity: 0.5;`,
		`	background-repeat: no-repeat;`,
		`}`,
		`.metadata-property[${selector}] svg {`,
		`	visibility: hidden;`,
		`}`,
		``,
	]
	return body.join(' ');
}

function genSnippetCSS(plugin: MetadataIcon): string {
	const content: string[] = [
		".setting-item-description:has(.metadata-icon-preview) {",
		"	display: flex;",
		"	align-items: center;",
		"	justify-content: space-around;",
		"}",
		"",
	];

	plugin.settings.IconAttrList.forEach((iconSetting, index) => {
		content.push(genEntryCSS(iconSetting));
	})

	return content.join(' ');
}


class MetadataHiderSettingTab extends PluginSettingTab {
	plugin: MetadataIcon;
	debouncedGenerate: Function;

	constructor(app: App, plugin: MetadataIcon) {
		super(app, plugin);
		this.plugin = plugin;
	}

	getLang(): string {
		let lang = window.localStorage.getItem('language');
		if (lang == null || ["en", "zh", "zh-TW"].indexOf(lang) == -1) { lang = "en"; }
		return lang;
	}


	display(): void {
		const { containerEl } = this;

		const lang = this.getLang();

		containerEl.empty();

		new Setting(containerEl)
			.setName({ en: "Add custom entry icon", zh: "添加自定义图标", "zh-TW": "新增自定義圖示" }[lang] as string)
			.setDesc({
				"en": "Input entry name and icon url. The image will be automatically loaded on the left side. If there is no image shown on the left side, please check the image url or network connection.",
				"zh": "输入文档属性名称和图标链接。图标将在左侧自动预览，如果左侧没有显示图片，请检查图片链接是否正确或网络连接。输入示例：「豆瓣，https://img1.doubanio.com/favicon.ico」",
				"zh-TW": "輸入文件屬性名稱和圖示鏈接。圖示將在左側自動預覽，如果左側沒有顯示圖片，請檢查圖片鏈接是否正確或網絡連線。輸入範例：「facebook，https://www.facebook.com/favicon.ico」"
			}[lang] as string)
			.addButton((button: ButtonComponent) => {
				button.setTooltip("Add new icon")
					.setButtonText("+")
					.setCta().onClick(async () => {
						this.plugin.settings.IconAttrList.push({
							entry: "",
							image: "",
						});
						await this.plugin.saveSettings();
						this.display();
					});
			})
		this.plugin.settings.IconAttrList.forEach((iconSetting, index) => {
			const s = new Setting(this.containerEl);
			let span = s.descEl.createEl("span", { text: { en: "icon preview:", zh: "图标预览:", "zh-TW": "圖示預覽:" }[lang] as string });
			span.setAttribute("style", `margin-right: 2px; `);
			let img = s.descEl.createEl("img", { cls: "metadata-icon-preview" });
			img.setAttribute("src", iconSetting.image);
			img.setAttribute("width", `20px`);
			img.setAttribute("style", `background-color: transparent;`);
			s.addSearch((cb) => {
				cb.setPlaceholder({ en: "entry name", zh: "文档属性名称", "zh-TW": "文件屬性名稱", }[lang] as string)
					.setValue(iconSetting.entry)
					.onChange(async (newValue) => {
						this.plugin.settings.IconAttrList[index].entry = newValue;
						await this.plugin.saveSettings();
						this.plugin.debounceUpdateCSS();
					});
			})
			s.addSearch((cb) => {
				cb.setPlaceholder({ en: "image url", zh: "图标链接", "zh-TW": "圖示鏈接", }[lang] as string)
					.setValue(iconSetting.image)
					.onChange(async (newValue) => {
						img.setAttribute("src", newValue);
						this.plugin.settings.IconAttrList[index].image = newValue;
						await this.plugin.saveSettings();
						this.plugin.debounceUpdateCSS();
					});
			});
			s.addExtraButton((cb) => {
				cb.setIcon("cross")
					.setTooltip("Delete")
					.onClick(async () => {
						this.plugin.settings.IconAttrList.splice(index, 1);
						await this.plugin.saveSettings();
						this.display();
						this.plugin.debounceUpdateCSS();
					});
			});
		});
	}
}
