# Metadata Icon

<div style="text-align:center">

![Obsidian Downloads](https://img.shields.io/badge/dynamic/json?logo=obsidian&color=%23483699&label=downloads&query=%24%5B%22metadata-icon%22%5D.downloads&url=https%3A%2F%2Fraw.githubusercontent.com%2Fobsidianmd%2Fobsidian-releases%2Fmaster%2Fcommunity-plugin-stats.json) ![GitHub stars](https://img.shields.io/github/stars/Benature/obsidian-metadata-icon?style=flat) ![latest download](https://img.shields.io/github/downloads/Benature/obsidian-metadata-icon/latest/total?style=plastic)

[click to install](https://obsidian.md/plugins?id=metadata-icon)

</div>

Customize metadata (property) entries icon.



<center>
<img src="https://s2.loli.net/2024/01/24/cuvJPSjtZpaFmyk.png" >
<!-- <img width="655" alt="image" src="https://github.com/Benature/obsidian-metadata-icon/assets/35028647/3006defa-16dc-47c6-99e2-8019d738eb5a"> -->
</center>


Links support online URLs, local file paths, and base64-encoded images.
- Online URLs: Must start with `http://` or `https://`. 
  - e.g. `https://www.facebook.com/favicon.ico`.
- Local files: Can be a relative file path within the Obsidian vault, or a relative file path from the root directory of the computer. 
  - e.g. `.obsidian/svg/Benature.svg`, `D:/Figures/Benature.png`, `/Users/Benature/Pictures/Benature.jpg`.
- Base64-encoded images: Must start with `data:`.

<!-- "链接支持在线网址、本地文件路径、base64编码图片等。",
"在线网址：需以 `http://` 或 `https://` 开头。如 `https://mp.weixin.qq.com/favicon.ico`。",
"本地文件：可以是相对 Obsidian 库的文件路径，或者相对电脑根目录的文件路径。如 `.obsidian/svg/木一.svg`、`D:/图片/木一.png`",
"base64编码图片：需以 `data:` 开头。" -->

> Chinese simple introduction: [小红书](http://xhslink.com/Uix9iF)、[公众号](https://mp.weixin.qq.com/s/F2ixCiDU-yP6PKAyOcDhjw) 
> 如有汉化需要请联系作者

## Support

If you find this plugin useful and would like to support its development, you can sponsor me via [Buy Me a Coffee ☕️](https://www.buymeacoffee.com/benature), WeChat, Alipay or [AiFaDian](https://afdian.net/a/Benature-K). Any amount is welcome, thank you!

<p align="center">
<img src="https://s2.loli.net/2024/04/01/VtX3vYLobdF6MBc.png" width="500px">
</p>


## Install

### Install from plugin community

[click to install](https://obsidian.md/plugins?id=metadata-icon), or:

- Open Obsidian and go to Settings > Community Plugins
- Search for `Metadata Icon`
- Click `Install`

### Install by [BRAT Plugin](https://obsidian.md/plugins?id=obsidian42-brat)

- First install [BRAT Plugin](https://obsidian.md/plugins?id=obsidian42-brat):
- In BRAT Plugin, click `Add Beta plugin`
- Enter https://github.com/Benature/obsidian-metadata-icon
- Enable `Metadata Icon` in `Community plugins`

### Manually install

- Download latest version in [Releases](https://github.com/Benature/obsidian-metadata-icon/releases/latest)
- Copy over `main.js`, `manifest.json` to your vault `VaultFolder/.obsidian/plugins/metadata-icon/`
- Reload plugins in `Community plugins` and enable `Metadata Icon`

## How to build

- `git clone https://github.com/Benature/obsidian-metadata-icon` clone this repo.
- `npm i`  install dependencies
- `npm run dev` to start compilation in watch mode.
- `npm run build`  to build production.


