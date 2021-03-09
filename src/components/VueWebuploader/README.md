# 文件分片断点续传底层组件逻辑

1. 基于 WebUploader，实例化 WebUploader，参数见文中注释
````js
this.uploader = WebUploader.create({
  ...
})
````

2. 注册 WebUploader
````js
new WebUploader.Uploader.register({
  beforeSend: (block) => {
    /**
     * 上传前，进行分片，分片后每一个片都有主键，然后接口验证是否已传过
     * 若上传过则不再上传，若没有上传过则续传。
     */
  },
  afterSendFile: () => {
    /**
     * 上传文件完成触发
     * 上传完成，发送合并请求，将分片的文件根据 chunkIndex 合并成完整的文件
     * 上传完成并且合并后，将上传的数据通过 $emit 发布出去
     */
  }
})
````

3. 组件监听
````js
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

this.uploader.on('uploadSuccess', (file, response) => {
  // this.$emit('success', file, response)
  // 最初的时候是在此处发布的成功事件，后来发现有时取不到返回的file.path，因此换到了在merge文件碎片回调中发布上传成功事件
})

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
````
