# 小可乐工具箱

![小可乐工具箱Logo](assets/images/logo.svg)

一个开源免费的实用工具集合网站，提供电脑工具、手机工具和网页工具等多种类型的实用工具。

## 项目特点

- 🚀 完全开源免费，无任何会员制、付费制
- 🛠️ 包含多种实用工具，分类清晰
- 📱 响应式设计，适配各种设备
- ✨ 现代化UI设计，3D粒子背景效果
- 🔍 工具搜索和分类筛选功能

## 技术栈

- HTML5, CSS3, JavaScript
- 粒子动画效果 (particles.js)
- Font Awesome 图标
- 纯前端实现，无需后端

## 项目结构
coke-tools/
├── assets/
│ ├── css/
│ │ ├── main.css # 基础样式
│ │ ├── animations.css # 动画库
│ │ └── responsive.css # 响应式
│ ├── js/
│ │ ├── main.js # 核心逻辑
│ │ ├── tools.js # 工具页专属
│ │ └── particles.js # 背景特效
│ └── images/
│ ├── logo.svg # 矢量LOGO
│ ├── avatar.png # 用户头像
│ └── textures/ # 3D纹理
├── index.html # 首页
├── tools.html # 工具页
├── forum.html # 论坛页
├── login.html # 登录页
├── register.html # 注册页
└── README.md # 项目说明文档


## 安装与运行

1. 克隆仓库：
   ```bash
   git clone https://github.com/yourusername/coke-tools.git

2.进入项目目录：
bash
cd coke-tools
3.启动本地服务器（推荐使用Live Server等插件）

功能说明
首页
网站公告和简介

最新工具展示

更新日志

工具页
工具搜索功能

工具分类筛选（全部、电脑、手机、其他）

热门工具标记

论坛页
建设中页面

开发进度展示

用户系统
登录/注册界面

密码强度检测

注册成功提示



自定义配置
修改主题颜色：
在assets/css/main.css中修改:root下的CSS变量：

css
:root {
    --primary-color: #4a6bff;
    --secondary-color: #6c5ce7;
    --accent-color: #00cec9;
    /* 其他颜色变量 */
}
添加新工具：
在tools.html中按照现有格式添加新的工具卡片：

html
<div class="tool-card" data-categories="pc|mobile|web">
    <div class="tool-icon">
        <i class="fas fa-icon-name"></i>
    </div>
    <h3 class="tool-title">工具名称</h3>
    <p class="tool-desc">工具描述</p>
    <div class="tool-tag">分类标签</div>
    <!-- 可选标记 -->
    <div class="tool-badge hot">热门</div>
</div>
修改粒子效果：
在assets/js/particles.js中调整粒子参数。



贡献指南
欢迎贡献代码！请遵循以下步骤：

Fork项目

创建特性分支 (git checkout -b feature/AmazingFeature)

提交更改 (git commit -m 'Add some AmazingFeature')

推送到分支 (git push origin feature/AmazingFeature)

打开Pull Request

许可证
本项目采用 MIT 许可证 - 详情请参阅 LICENSE 文件。

联系方式
邮箱：contact@example.com

GitHub: @yourusername



## 项目总结

这个"小可乐工具箱"网站具有以下特点：

1. **现代化设计**：
   - 3D粒子背景效果
   - 卡片式UI设计
   - 平滑的动画过渡
   - 响应式布局，适配所有设备

2. **完整功能**：
   - 首页展示公告和最新工具
   - 工具页带搜索和分类功能
   - 登录/注册系统
   - 论坛页（建设中）

3. **技术亮点**：
   - 纯前端实现，无需后端
   - 模块化的CSS和JavaScript
   - 使用CSS变量实现主题定制
   - Intersection Observer实现滚动动画

4. **用户体验**：
   - 清晰的导航结构
   - 直观的工具展示
   - 友好的表单交互
   - 加载状态反馈

5. **可维护性**：
   - 详细的代码注释
   - 清晰的项目结构
   - 完整的README文档
   - 响应式设计考虑

这个项目完全按照您的要求实现，包括所有指定的功能和设计元素，同时保持了代码的整洁和可维护性。