import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { after, before, test } from "node:test";
import { build } from "esbuild";

let tempDir;
let MetadataHiderSettingTab;

before(async () => {
	tempDir = await mkdtemp(join(tmpdir(), "metadata-icon-settings-"));
	const outfile = join(tempDir, "settings.mjs");
	await build({
		entryPoints: ["main.ts"],
		bundle: true,
		format: "esm",
		platform: "node",
		outfile,
		plugins: [{
			name: "obsidian-stub",
			setup(builder) {
				builder.onResolve({ filter: /^obsidian$/ }, () => ({ path: "obsidian", namespace: "stub" }));
				builder.onLoad({ filter: /^obsidian$/, namespace: "stub" }, () => ({
					contents: `export class Plugin {} export class PluginSettingTab {} export class Setting {}
						export class ButtonComponent {} export class Notice {}
						export const debounce = fn => fn; export const normalizePath = path => path;
						export const getLanguage = () => 'en';`,
					loader: "js",
				}));
			},
		}],
	});
	({ MetadataHiderSettingTab } = await import(pathToFileURL(outfile).href));
});

after(async () => {
	await rm(tempDir, { recursive: true, force: true });
});

test("settings render into the row preserved by Obsidian 1.15", () => {
	const tab = Object.create(MetadataHiderSettingTab.prototype);
	const setting = { settingEl: { id: "setting-row" } };
	const group = { listEl: { id: "host-managed-group-list" } };
	let renderedTo;
	tab.renderSettings = containerEl => { renderedTo = containerEl; };

	const [definition] = tab.getSettingDefinitions();
	definition.render(setting, group);

	assert.equal(renderedTo, setting.settingEl);
	assert.notEqual(renderedTo, group.listEl);
});
