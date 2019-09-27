# CDV CLOUD 3.0+

## 地址

- 项目华为云[远程地址]()

- [3.0+ 测试环境]()
- [3.0+ 正式环境]()
- [视频云2.0+测试环境](https://testhwzb.yunshicloud.com/login.html)
- [视频云2.0+正式环境](https://onair.yunshicloud.com/login.html)

## 简介

视频云的基础目标就是将公司的一些工具进行可视化，形成一整套操作媒体资源的SaaS，此外还有志衍生其他价值

## 项目目标（价值）

- 实现工具可视化
- 实现更加高级的产品设计，以及自定义页面设置，提供更好的用户体验
- 开发低耦合、高容错、高复用的公用组件、公用方法，设定规范并在此过程中逐步修改并形成合理统一的前端开发规范及各种相关技术文档
- 推动公司自己的UI框架开发
- 推动公司自己的项目模板开发

## 项目架构

- 项目是基于 [Vue](https://cn.vuejs.org/index.html) 的单页面应用，严格遵守了MVVM的框架原理
- 因为倾向于使用 [Element](https://element.eleme.cn/2.7/#/zh-CN/component/installation) 作为UI框架，因此
- 选择了基于 [vue-element-admin v4.0+](https://github.com/PanJiaChen/vue-element-admin) / [访问](https://panjiachen.github.io/vue-element-admin) / [使用文档](https://panjiachen.github.io/vue-element-admin-site/zh/) 的 基础模板: [vue-admin-template v4.2.1](https://github.com/PanJiaChen/vue-admin-template) / [访问](https://panjiachen.gitee.io/vue-admin-template) 作为模板进行二次开发
- 这样选择的优势就是，你可以把 vue-element-admin 当做工具箱或者集成方案仓库，在 vue-admin-template 的基础上进行二次开发，想要什么功能或者组件就去 vue-element-admin 那里复制过来。
- 有任何修改和建议都可以该项目 [issue](https://github.com/PanJiaChen/vue-element-admin/issues/new) 或 [pr](https://github.com/PanJiaChen/vue-element-admin/pulls)
- 当然有一些问题已经提出并有了很多好的解决方案，你可以查看 [issue](https://github.com/PanJiaChen/vue-element-admin/issues) 获取一些好的解决方案
- 因为本项目是基于 Vue、element、vue-element-admin 进行开发，因此后期的开发与维护还是围绕这三个进行展开

## 目录结构

```
├── build                      	# 构建相关
├── mock                       	# 项目mock 模拟数据
├── public                     	# 静态资源
│   │── favicon.ico            	# favicon图标
│   └── index.html             	# html模板
├── src                        	# 源代码
│   ├── api                    	# 所有请求
│   ├── assets                 	# image fonts等静态资源
│   ├── components             	# 全局公用组件
│   ├── directive              	# 全局指令
│   ├── filters                	# 全局 filter
│   ├── lang                   	# 国际化 language
│   ├── layout                 	# 全局 layout
│   ├── router                 	# 路由
│   ├── store                  	# 全局 store管理
│   ├── styles                 	# 全局样式
│   │   ├── btn.scss                 # 按钮样式
│   │   ├── element-ui.scss          # 全局自定义 element-ui 样式
│   │   ├── index.scss               # 全局通用样式
│   │   ├── mixin.scss               # 全局mixin
│   │   ├── sidebar.scss             # sidebar css
│   │   ├── transition.scss          # vue transition 动画
│   │   └── variables.scss           # 全局变量
│   ├── utils                  	# 全局公用方法
│   ├── vendor                 	# 公用vendor
│   ├── views                  	# views 所有页面
│   ├── App.vue                	# 入口页面
│   ├── main.js                	# 入口文件 加载组件 初始化等
│   └── permission.js          	# 权限管理
├── tests                      	# 测试
│   └── vue-cropper-example     # 图片剪裁技术文档及示例
├── .editorconfig			          # 给编辑器看的
├── .env.xxx                   	# 环境变量配置
├── .eslintignore			          # eslint的忽略文件
├── .eslintrc.js               	# eslint 配置项
├── .gitignore				          # git 忽略文件
├── .babelrc                   	# babel-loader 配置（es6转es5）
├── .travis.yml                	# 自动化CI配置
├── vue.config.js              	# vue-cli 配置
├── postcss.config.js          	# postcss 配置
├── package.json               	# package.json
├── package-lock.json			      # package.json 锁定版本文件
├── postcss.config.js			      # postcss 配置
└── README.md			              # 项目说明文档
```

## 技术栈
#### 注意：相关功能的设计和相关插件的使用文档及demo在后面会给出

- 使用 [Vue](https://cn.vuejs.org/index.html) v2.6.10 作为JavaScript框架，实现单页面应用；
- 使用 [vue-cli3](https://cli.vuejs.org/zh/guide/) 脚手架快速初始化项目
- 使用 [Vue Router](https://router.vuejs.org/zh/) 实现路由管理
- 使用 [Vuex](https://vuex.vuejs.org/zh/) 官方状态管理
- 使用 [webpack](https://www.webpackjs.com/) 模块化打包工具
- 使用 [element](https://element.eleme.cn/2.7/#/zh-CN/component/installation)  UI框架
- 使用 [axios](http://www.axios-js.com/) http库
- 使用 [babel-polyfill](https://www.babeljs.cn/docs/babel-polyfill) 处理IE低版本兼容
- 使用 [ESLint](https://cn.eslint.org/) 代码规范校验工具
- [ECMAScript 6](http://es6.ruanyifeng.com/)
- 使用 [js-cookie]() 处理cookie
- normalize.css格式化css
- 播放器使用公司自己封装的基于jquery的video.js + videojs-flash.js + videojs-contrib-hls.js + flv.js + videojs-flvjs.js
- 使用 [Tinymce](https://www.tiny.cloud/docs/) 作为富文本编辑器
- 使用 [vue-qriously](https://github.com/theomessin/vue-qriously) 二维码生成工具
- 读vue-qriously源码可以发现，他是基于 [qrious](https://github.com/neocotic/qrious) 进行的二次封装
- 使用 [Clipboard.js](https://clipboardjs.com/) 实现点击复制
- 使用 [vue-cropper](https://github.com/xyxiao001/vue-cropper) 图片裁剪插件
- 使用 [Mock.js](https://github.com/nuysoft/Mock) 进行模拟请求数据
- 使用 [nprogress](http://ricostacruz.com/nprogress/) 轻量的全局进度条控制
- 使用 [vue-i18n](http://kazupon.github.io/vue-i18n/zh/) 实现国际化

## Build Setup

- 注意：你需要在本地安装 [node](https://nodejs.org/en/) 和 [git](https://git-scm.com/)

```bash
# 克隆项目
git clone https://github.com/PanJiaChen/vue-admin-template.git

# 进入项目目录
cd cdv-cloud-web

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装以来，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

浏览器访问 [http://localhost:9528](http://localhost:9528)

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```

## 命名规范
> 其实刚开始我写 vue 文件的时候也不注意，各种驼峰啊、大写开头 (PascalCase)还是横线连接 (kebab-case)混着来，谁叫 vue 都可以，在 [风格指南](https://cn.vuejs.org/v2/style-guide/) 中也没有定论。不过基于本项目我还是整理了一套文件的命名规则。

### Component
所有的Component文件都是以大写开头 (PascalCase)，这也是官方所 [推荐的](https://cn.vuejs.org/v2/style-guide/index.html#%E5%8D%95%E6%96%87%E4%BB%B6%E7%BB%84%E4%BB%B6%E6%96%87%E4%BB%B6%E7%9A%84%E5%A4%A7%E5%B0%8F%E5%86%99-%E5%BC%BA%E7%83%88%E6%8E%A8%E8%8D%90)。
但除了 index.vue。
例子：

```
@/src/components/BackToTop/index.vue
@/src/components/Charts/Line.vue
@/src/views/example/components/Button.vue
```

### JS 文件
所有的.js文件都遵循横线连接 (kebab-case)。
例子：

```
@/src/utils/open-window.js
@/src/views/svg-icons/require-icons.js
@/src/components/MarkdownEditor/default-options.js
```

### Views
在views文件下，代表路由的.vue文件都使用横线连接 (kebab-case)，代表路由的文件夹也是使用同样的规则。
例子：

```
@/src/views/svg-icons/index.vue
@/src/views/svg-icons/require-icons.js
```

使用横线连接 (kebab-case)来命名views主要是出于以下几个考虑。

- 横线连接 (kebab-case) 也是官方推荐的命名规范之一 [文档](https://cn.vuejs.org/v2/style-guide/index.html#%E5%8D%95%E6%96%87%E4%BB%B6%E7%BB%84%E4%BB%B6%E6%96%87%E4%BB%B6%E7%9A%84%E5%A4%A7%E5%B0%8F%E5%86%99-%E5%BC%BA%E7%83%88%E6%8E%A8%E8%8D%90)
- views下的.vue文件代表的是一个路由，所以它需要和component进行区分(component 都是大写开头)
- 页面的url 也都是横线连接的，比如https://www.xxx.admin/export-excel，所以路由对应的view应该要保持统一
- 没有大小写敏感问题

## 代码注释规范

我们约定:
- 写在语句的后面或者进行简单的描述用 单行注释 // 
- 对于字段的描述，用单行注释 // 
- 复杂的描述，用多行注释 /**/
- 函数功能描述，用多行注释 /**/

目的和原则

- 提高可读性和可维护性
- 如无必要，勿增注释；如有必要，尽量详尽

语法和快捷键

- 单行注释：//　快捷键： ctrl+/
- 多行注释：/**/ 快捷键： ctrl+shift+/

规范

> 注释符与注释内容之间加一个空格<br>
> 注释行与上方代码间加一个空行

- 顶部文档注释
```javascript
 /**
 * @Author: YanHuaKang 必填
 * @Date: 2019/7/25 创建日期 必填
 * @Description: 这是一个描述，可选
 * @remarks: 这是一个备注，可选
 */
```
或者

```javascript
/* 模块：xxxxxx by 张三 */
```

- css
```
/* content */
内容
/* end content */
```

- js function
```javascript
/**
 * 函数功能描述
 * @param str           入参描述
 * @returns {boolean}   返回值描述
 */
```

## 相关文档

- [vue-element-admin官方文档](https://panjiachen.github.io/vue-element-admin-site/zh/)

vue-element-admin 配套了系列教程文章，如何从零构建后一个完整的后台项目，建议大家先看完这些文章再来实践本项目

- [手摸手，带你用 vue 撸后台 系列一(基础篇)](https://juejin.im/post/59097cd7a22b9d0065fb61d2)
- [手摸手，带你用 vue 撸后台 系列二(登录权限篇)](https://juejin.im/post/591aa14f570c35006961acac)
- [手摸手，带你用 vue 撸后台 系列三 (实战篇)](https://juejin.im/post/593121aa0ce4630057f70d35)
- [手摸手，带你用 vue 撸后台 系列四(vueAdmin 一个极简的后台基础模板)](https://juejin.im/post/595b4d776fb9a06bbe7dba56)
- [手摸手，带你用vue撸后台 系列五(v4.0新版本)](https://juejin.im/post/5c92ff94f265da6128275a85)
- [手摸手，带你封装一个 vue component](https://segmentfault.com/a/1190000009090836)
- [手摸手，带你优雅的使用 icon](https://juejin.im/post/59bb864b5188257e7a427c09)
- [手摸手，带你用合理的姿势使用 webpack4（上）](https://juejin.im/post/5b56909a518825195f499806)
- [手摸手，带你用合理的姿势使用 webpack4（下）](https://juejin.im/post/5b5d6d6f6fb9a04fea58aabc)

**如有问题请先看上述使用文档和文章，若不能满足，请 [issue](https://github.com/PanJiaChen/vue-element-admin/issues/new) 和 [pr](https://github.com/PanJiaChen/vue-element-admin/pulls)**

- 另外，一些公用的组件如富文本、文本复制、播放器、二维码生成、图片剪切等等，请在 `tests` 目录下查看

## Browsers support

Modern browsers and Internet Explorer 10+.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| --------- | --------- | --------- | --------- |
| IE9, IE10, IE11, Edge| last 2 versions| last 2 versions| last 2 versions

## License

[MIT](https://github.com/PanJiaChen/vue-admin-template/blob/master/LICENSE) license.

Copyright (c) 2017-present PanJiaChen
