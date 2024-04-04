export interface LocalProperty {
	settingAddIconName: string;
	settingAddIconDesc: string;
	settingAddIconTooltip: string;
	settingAddIconDescElSpan: string;
	settingAddIconPlaceholderEntry: string;
	settingAddIconPlaceholderImage: string;
	settingRemoveIconTooltip: string;
	settings: {
		readmeHTML: string;
	}
}


const EN: LocalProperty = {
	settingAddIconName: "Add custom entry icon",
	settingAddIconDesc: "Input entry name and icon url. The image will be automatically loaded on the left side. If there is no image shown on the left side, please check the image link.",
	settingAddIconTooltip: "Add new icon",
	settingAddIconDescElSpan: "icon preview:",
	settingAddIconPlaceholderEntry: "entry name",
	settingAddIconPlaceholderImage: "image link",
	settingRemoveIconTooltip: "Delete",
	settings: {
		readmeHTML:
			`<h5>Usage</h5>
			<div>Links support online URLs, local file paths, and base64-encoded images.</div>
			<ul>
			<li><b>Online URLs</b>: Must start with <code>http://</code> or <code>https://</code>. For example, <code>https://www.facebook.com/favicon.ico</code>.</li>
			<li><b>Local files</b>: Can be a relative file path within the Obsidian vault, or a relative file path from the root directory of the computer. For example, <code>.obsidian/svg/Benature.svg</code> or <code>D:/Figures/Benature.png</code>.</li>
			<li><b>Base64-encoded images</b>: Must start with <code>data:</code>.</li>
			</ul>`,
	}
}

const ZH: LocalProperty = {
	settingAddIconName: "添加自定义图标",
	settingAddIconDesc: "输入文档属性名称和图标链接。图标将在左侧自动预览，如果左侧没有显示图片，请检查图片链接是否正确。",
	settingAddIconTooltip: "添加新图标",
	settingAddIconDescElSpan: "图标预览：",
	settingAddIconPlaceholderEntry: "文档属性名称",
	settingAddIconPlaceholderImage: "图标链接",
	settingRemoveIconTooltip: "删除",
	settings: {
		readmeHTML: `
			<h5>使用说明</h5>
			<div>链接支持在线网址、本地文件路径、base64编码图片等。</div>
			<ul>
			<li><b>在线网址</b>：需以 <code>http://</code> 或 <code>https://</code> 开头。如 <code>https://mp.weixin.qq.com/favicon.ico</code>。</li>
			<li><b>本地文件</b>：可以是相对 Obsidian 库的文件路径，或者相对电脑根目录的文件路径。如 <code>.obsidian/svg/木一.svg</code> 或 <code>D:/图片/木一.png</code>。</li>
			<li><b>base64编码图片</b>：需以 <code>data:</code> 开头。</li>
			</ul>
		`,
	}
}


const ZHtw = {
	settingAddIconName: "新增自定義圖示",
	settingAddIconDesc: "輸入文件屬性名稱和圖示鏈接。圖示將在左側自動預覽，如果左側沒有顯示圖片，請檢查圖片鏈接是否正確。",
	settingAddIconTooltip: "新增圖示",
	settingAddIconDescElSpan: "圖示預覽：",
	settingAddIconPlaceholderEntry: "文件屬性名稱",
	settingAddIconPlaceholderImage: "圖示鏈接",
	settingRemoveIconTooltip: "删除",
}



export class Locals {

	static get(): LocalProperty {
		const lang = window.localStorage.getItem("language");
		switch (lang?.toLowerCase()) {
			case "zh":
				return ZH;
			case "zh-tw":
				return ZH;
			default:
				return EN;
		}
	}
}
