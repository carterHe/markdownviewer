This is a project for online previewing of Markdown documents. It allows us to view Markdown content in a visually enhanced format and easily copy it for publishing on social media platforms.

# MarkdownViewer · 在线 Markdown 预览工具

[English Version Below ⬇](#markdownviewer--markdown-preview-tool)

## 项目简介

**MarkdownViewer** 是一个轻量、简洁的在线 Markdown 实时预览工具。支持本地编写、实时渲染预览，适合快速撰写笔记、博客或技术文档。

项目地址：[https://github.com/carterHe/markdownviewer](https://github.com/carterHe/markdownviewer)

## ✨ 功能特点

- 📄 实时 Markdown 渲染预览
- 🧩 支持基本语法：标题、列表、链接、图片、代码块等
- 💻 纯前端实现，开箱即用，无需后端依赖
- 🌙 支持浅色/深色主题切换（如有实现）
- 📦 可自行部署到本地或服务器

## 🚀 使用方式

1. 克隆项目：
   ```bash
   git clone https://github.com/carterHe/markdownviewer.git
   ```

2. 安装依赖并运行（若使用构建工具）：
   ```bash
   npm install
   npm run dev
   ```

3. 打开浏览器访问：
   ```
   http://localhost:3000
   ```


## 🛠 技术栈

- HTML / CSS / JavaScript
- [marked](https://github.com/markedjs/marked)

## docker布署

例如，将文档放到 `/home/Books`

```
docker build  -t md-book .

docker run -d -p 3000:3000 -v /home/Books:/app/Books --name mybooks md-book
```


---

# MarkdownViewer · Markdown Preview Tool

## Overview

**MarkdownViewer** is a lightweight and clean online Markdown preview tool. It allows users to write and preview Markdown documents in real time. Perfect for quick note-taking, blogging, and writing documentation.

GitHub Repo: [https://github.com/carterHe/markdownviewer](https://github.com/carterHe/markdownviewer)

## ✨ Features

- 📄 Live Markdown rendering
- 🧩 Supports basic syntax: headers, lists, links, images, code blocks, etc.
- 💻 Fully frontend-based, no backend required
- 🌙 Light/Dark theme toggle (if implemented)
- 📦 Easy to deploy locally or online

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/carterHe/markdownviewer.git
   ```

2. Install dependencies & run locally (if using a bundler/toolchain):
   ```bash
   npm install
   npm run dev
   ```

3. Open in browser:
   ```
   http://localhost:3000
   ```


## 🛠 Tech Stack

- HTML / CSS / JavaScript
- [marked](https://github.com/markedjs/marked) (if used)

## Deploy with docker

put your books at `/home/Books`

```
docker build  -t md-book .

docker run -d -p 3000:3000 -v /home/Books:/app/Books --name mybooks md-book
```
