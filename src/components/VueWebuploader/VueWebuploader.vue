<!--/**-->
<!--* @Author: YanHuaKang-->
<!--* @Date: 2019/11/21-->
<!--* @Description: 文件分片断点续传底层组件-->
<!--* @remarks:-->
<!--*/-->
<template>
  <div class="upload" />
</template>

<script>
import { fileUpload } from '@/api/upload-file'
const qs = require('querystring')
const md5 = window.md5
const $ = window.$

export default {
  name: 'VueWebuploader',
  props: {
    // 上传文件类型
    accept: {
      type: String,
      default: null
    },
    // 上传地址
    url: {
      required: true,
      type: String
    },
    // 上传文件总大小, 默认为100G
    fileSizeLimit: {
      type: Number,
      default: 100 * 1024 * 1024 * 1024
    },
    // 上传最大数量 默认为100个
    fileNumLimit: {
      type: Number,
      default: 100
    },
    // 大小限制 默认为100G
    fileSingleSizeLimit: {
      type: Number,
      default: 100 * 1024 * 1024 * 1024
    },
    // 上传时传给后端的参数，一般为token，key等
    formData: {
      required: true,
      type: Object
    },
    // 生成formData中文件的key，下面只是个例子，具体哪种形式和后端商议
    keyGenerator: {
      type: Function,
      default(file) {
        const currentTime = new Date().getTime()
        const key = `${currentTime}.${file.name}`
        return key
      }
    },
    multiple: {
      type: Boolean,
      default: false
    },
    // 上传按钮{Seletor|dom}
    uploadButton: {
      required: true,
      type: String
    },
    // 拖拽的容器{Selector}
    uploadDndButton: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      uploader: null,
      publicOption: {},
      uploadContCommon: {
        onUploadFileErr: null,
        onUploadFileSuccess: null,
        callbackDate: null
      },
      chunkSize: 5 * 1024 * 1024, // 分块大小
      fileMd5MarkMap: new Map(),
      uniqueFileNameMap: new Map()
    }
  },
  mounted() {
    this.initWebUpload()
  },
  methods: {
    initWebUpload() {
      const that = this
      new WebUploader.Uploader.register(
        {
          'before-send-file': 'beforeSendFile',
          'before-send': 'beforeSend',
          'after-send-file': 'afterSendFile'
        },
        {
          // // 上传文件开始触发
          // beforeSendFile: function(file) {
          //   if (that.publicOption.uploadProgress) {
          //     that.publicOption.beforeSendFile(file)
          //   }
          //   console.log('上传文件前触发')
          //   // return false
          //   // 秒传验证
          //   // const task = new $.Deferred()
          //   that.uploader.md5File(file).progress(percentage => {
          //     // 及时显示进度
          //     console.log('percentage', percentage)
          //   }).then(function(val) {
          //     // 完成
          //     console.log('上传文件前触发完成', val)
          //     // $('#' + file.id + ' .operate .del_btn').show()
          //     // $("#" + file.id + " .operate .pause_btn").show();
          //     // console.log("总耗时: "+ ((new Date().getTime()) - start)/ 1E3);
          //     // md5Mark = val
          //     that.fileMd5MarkMap.set(file.id, val)
          //     fileUpload(qs.stringify({ status: 'md5Check', md5: val }), that.url).then(res => {
          //       const { data } = res
          //       if (data.ifExist) {
          //         that.uploader.skipFile(file)
          //         file.path = res.path
          //         that.UploadComlate(file, this.fileMd5MarkMap.get(file.id))
          //       }
          //     })
          //   })
          // },
          // 开始上传分片触发
          beforeSend: function(block) {
            // 分片验证是否已传过，用于断点续传
            var task = new $.Deferred()
            var file = block.file
            var id = file.id

            that.uploader.md5File(file, block.start, block.end).then(val => {
              var params = {
                status: 'chunkCheck',
                name: that.uniqueFileNameMap.get(id),
                chunkIndex: block.chunk,
                size: block.end - block.start,
                userId: that.formData.userId,
                companyId: that.formData.companyId,
                appCode: that.formData.appCode,
                blockmd5: val
              }

              fileUpload(qs.stringify(params), that.url).then(res => {
                const { data } = res
                if (data.ifExist === 1) { // 若存在，返回失败给WebUploader，表明该分块不需要上传
                  task.reject()
                } else {
                  task.resolve()
                }
              }, function(jqXHR, textStatus, errorThrown) { // 任何形式的验证失败，都触发重新上传
                task.reject()
              })
            })
            return $.when(task)
          },
          // 上传文件完成触发
          afterSendFile: function(file) {
            var chunksTotal = Math.ceil(file.size / that.chunkSize)
            // 合并请求
            var task = new $.Deferred()
            var params = {
              status: 'chunksMerge',
              name: that.uniqueFileNameMap.get(file.id),
              chunks: chunksTotal,
              ext: file.ext,
              md5: that.fileMd5MarkMap.get(file.id),
              userId: that.formData.userId,
              companyId: that.formData.companyId,
              appCode: that.formData.appCode
            }

            fileUpload(qs.stringify(params), that.url).then(res => {
              const { data } = res
              if (data.path) {
                file.path = data.path
                that.$emit('success', file, res)
              }
              task.resolve()
              that.uniqueFileNameMap.delete(file.id)
              that.fileMd5MarkMap.delete(file.id)
            }).catch(err => {
              console.info(err)
            })
            return $.when(task)
          }
        })

      this.uploader = WebUploader.create({
        auto: true, // {Boolean} [可选] [默认值：false] 设置为 true 后，不需要手动调用上传，有文件选择即开始上传（选完文件后，是否自动上传）
        swf: '/public/webUploader/js/Uploader.swf', // swf文件路径
        server: this.url + 'fileUpload', // 文件接收服务端
        pick: { // 指定选择文件的按钮容器，不指定则不创建按钮
          id: this.uploadButton, // {Seletor|dom} 指定选择文件的按钮容器，不指定则不创建按钮。注意 这里虽然写的是 id, 但是不是只支持 id, 还支持 class, 或者 dom 节点。
          multiple: this.multiple, // {Boolean} 是否开启同时选择多个文件能力。
          label: '', // {String} 请采用 innerHTML 代替
          innerHTML: '' // {String} 指定按钮文字。不指定时优先从指定的容器中看是否自带文字
        },
        dnd: this.uploadDndButton, // {Selector} [可选] [默认值：undefined] 指定Drag And Drop拖拽的容器，如果不指定，则不启动。
        disableWidgets: 'log', // {String, Array} [可选] [默认值：undefined] 默认所有 Uploader.register 了的 widget 都会被加载，如果禁用某一部分，请通过此 option 指定黑名单。
        paste: document.body, // {Selector} [可选] [默认值：undefined] 指定监听paste事件的容器，如果不指定，不启用此功能。此功能为通过粘贴来添加截屏的图片。建议设置为document.body.
        disableGlobalDnd: true, // {Selector} [可选] [默认值：false] 是否禁掉整个页面的拖拽功能，如果不禁用，图片拖进来的时候会默认被浏览器打开。
        thumb: { // {Object} [可选] 配置生成缩略图的选项。
          width: 100,
          height: 100,
          quality: 100, // // 图片质量，只有type为`image/jpeg`的时候才有效。
          allowMagnify: false, // // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
          crop: true // 是否允许裁剪。
          // type: 'image/jpeg' // 为空的话则保留原有图片格式，否则强制转换成指定的类型。
        },
        compress: false, // {Object} [可选] 配置压缩的图片的选项。如果此选项为false, 则图片在上传前不进行压缩。
        prepareNextFile: true, // {Boolean} [可选] [默认值：false] 是否允许在文件传输时提前把下一个文件准备好。 对于一个文件的准备工作比较耗时，比如图片压缩，md5序列化。 如果能提前在当前文件传输期处理，可以节省总体耗时。
        chunked: true, // {Boolean} [可选] [默认值：false] 是否要分片处理大文件上传。
        chunkSize: this.chunkSize, // {Boolean} [可选] [默认值：5242880] 如果要分片，分多大一片？ 默认大小为5M.
        threads: 5, // {Boolean} [可选] [默认值：3] 上传并发数。允许同时最大上传进程数。
        formData: this.formData, // {Object} [可选] [默认值：{}] 文件上传请求的参数表，每次发送都会发送此对象中的参数。
        fileSizeLimit: this.fileSizeLimit, // {int} [可选] [默认值：undefined] 验证文件总大小是否超出限制, 超出则不允许加入队列。
        fileSingleSizeLimit: this.fileSingleSizeLimit, // {int} [可选] [默认值：undefined] 验证单个文件大小是否超出限制, 超出则不允许加入队列。
        fileNumLimit: this.fileNumLimit, // {int} [可选] [默认值：undefined] 限制上传个数，验证文件总数量, 超出则不允许加入队列。
        resize: false, // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
        accept: this.getAccept(this.accept), // {Arroy} [可选] [默认值：null] 指定接受哪些类型的文件。 由于目前还有ext转mimeType表，所以这里需要分开指定。
        duplicate: true // {Boolean} [可选] [默认值：undefined] 去重， 根据文件名字、文件大小和最后修改时间来生成hash Key.
      })

      // 当有文件被添加进队列的时候，添加到页面预览
      this.uploader.on('fileQueued', (file) => {
        const that = this
        // 将事件绑定到文件，保证在发生页面切换时之前已经开始上传的文件的回调事件不会发生变化
        file.onUploadFileErr = that.uploadContCommon.onUploadFileErr
        file.onUploadFileSuccess = that.uploadContCommon.onUploadFileSuccess
        file.callbackDate = that.uploadContCommon.callbackDate

        that.uploader.sort(function(a, b) { return a.size - b.size })// 多文件同时加入时小文件优先上传
        var uniqueFileName = md5(file.name + file.size + file.type + that.formData.userId)// 文件唯一标识
        that.uniqueFileNameMap.set(file.id, uniqueFileName)
        that.uploader.makeThumb(file, function(error, ret) {
          if (error) {
            // console.log('预览错误，上传的不是图片吧？')
          } else {
            // console.log('预览成功 base64')
          }
        })
        that.$emit('fileChange', file)
      })

      this.uploader.on('uploadStart', (file) => {
        // 在这里可以准备好formData的数据
        // this.uploader.options.formData.key = this.keyGenerator(file);
      })

      // 文件上传过程中创建进度条实时显示。
      this.uploader.on('uploadProgress', (file, percentage) => {
        this.$emit('progress', file, percentage)
      })

      this.uploader.on('uploadSuccess', (file, response) => {})

      this.uploader.on('uploadError', (file, reason) => {
        this.$emit('uploadError', file, reason)
      })

      this.uploader.on('error', (type) => {
        let errorMessage = ''
        if (type === 'F_EXCEED_SIZE') {
          errorMessage = `文件大小不能超过${this.fileSingleSizeLimit / (1024 * 1000)}M`
        } else if (type === 'Q_EXCEED_NUM_LIMIT') {
          errorMessage = '文件上传已达到最大上限数'
        } else {
          errorMessage = `上传出错！请检查后重新上传！错误代码${type}`
        }
        this.$emit('error', errorMessage)
      })

      this.uploader.on('uploadComplete', (file, response) => {
        this.$emit('complete', file, response)
      })
    },

    // UploadComlate(file, md5) {
    //   var path = file.path
    //   var fileId = path.split('ZmlsZUlk=')[1]
    //   file.fileId = fileId
    //   if (typeof (file.onUploadFileSuccess) !== 'function') {
    //     console.error('上传成功, 回调方法执行异常')
    //   } else {
    //     file.onUploadFileSuccess(file.callbackDate, file, md5)
    //   }
    // },
    //
    // UploadFail(file) {
    //   if (typeof (file.onUploadFileErr) !== 'function') {
    //     console.error('上传失败, 回调方法执行异常')
    //   } else {
    //     file.onUploadFileErr(file.callbackDate, file)
    //   }
    // },

    upload(file) {
      this.uploader.upload(file)
    },
    stop(file) {
      this.uploader.stop(file)
    },
    // 取消并中断文件上传
    cancelFile(file) {
      this.uploader.cancelFile(file)
    },
    // 在队列中移除文件
    removeFile(file, bool) {
      this.uploader.removeFile(file, bool)
    },

    // 获取上传文件类型
    getAccept(accept) {
      switch (accept) {
        case 'text':
          return {
            title: 'Texts',
            exteensions: 'doc,docx,xls,xlsx,ppt,pptx,pdf,txt', // {String} 允许的文件后缀，不带点，多个用逗号分割。
            mimeTypes: '.doc,docx,.xls,.xlsx,.ppt,.pptx,.pdf,.txt' // {String} 多个用逗号分割。
          }
        case 'video':
          return {
            title: 'Videos',
            exteensions: 'mp4',
            mimeTypes: '.mp4'
          }
        case 'image':
          return {
            title: 'Images',
            exteensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: '.gif,.jpg,.jpeg,.bmp,.png'
          }
        default: return accept
      }
    }
  }
}
</script>

<style lang="scss">
  .webuploader-container {
    position: relative;
  }
  .webuploader-element-invisible {
    position: absolute !important;
    clip: rect(1px 1px 1px 1px); /* IE6, IE7 */
    clip: rect(1px,1px,1px,1px);
  }
  .webuploader-pick {
    position: relative;
    display: inline-block;
    cursor: pointer;
    background: #00b7ee;
    padding: 10px 15px;
    text-align: center;
    border-radius: 3px;
    overflow: hidden;
  }
  .webuploader-pick-hover {
    background: #00a2d4;
  }

  .webuploader-pick-disable {
    opacity: 0.6;
    pointer-events:none;
  }
</style>
