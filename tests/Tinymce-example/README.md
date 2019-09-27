## 富文本编辑器[Tinymce](https://github.com/tinymce/tinymce)

- 由于目前使用 npm 安装 Tinymce 方法比较复杂而且还有一些问题(日后可能会采用该模式

  )且会大大增加编译的时间所以暂时不准备采用
  
- 目前使用异步加载 CDN 的引入方式，如果想修改 cdn 地址或者 tinymce 的版本只需在 
  
  src/components/Tinymce 中找到 tinymce 的 cdn 地址进行修改就可以了。它会通过dynamicLoadScript自动注入的 
  
  index.html 中。
  
- 使用: 由于富文本不适合双向数据流，所以只会 watch 传入富文本的内容一次变化，之后
  
  传入内容的变化就不会再监听了，如果之后还有改变富文本内容的需求。
  
  可以通过 **this.refs.xxx.setContent()** 手动来设置。
  
  源码也很简单，有任何别的需求都可以在 src/components/Tinymce 中自行修改。
  
### 属性

| 属性 | 描述 | 类型 | 默认值 | 可选值 | 是否必填（默认false） |
| --- | --- | --- | --- | --- | ------------- |
| id | 富文本唯一标识 | String | onair-tinymce-时间戳 |  |  |
| value | 文本内容 | String | 只监视一次更改，可以通过 this.refs.xxx.setContent()<br>手动来设置富文本内容 |  |  |
| toolbar | 工具栏 | Array | [] | src/components/Tinymce/toolbar.js |  |
| menubar | 顶部菜单栏 | String | 'file edit insert view format table' | file ，edit，insert，view，format，table |  |
| plugins | 菜单栏配置项 | Array | [] | src/components/Tinymce/plugins.js |  |
| height | 富文本高度 | Number, Stringr | 360 |  |  |
| width | 富文本宽度 | Number, String | auto~~~~ |  |  |

### 图片上传

- 采用elementUI 上传组件

### API

- this.refs.xxx.setContent() // 设置富文本内容