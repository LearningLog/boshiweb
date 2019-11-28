/**
* @Author: GaoShun
* @Date: 2019/11/27
* @Description: 通过流下载文件
* @remarks:
*/

export function downloadFileByStream(options) {
  const reader = new FileReader()
  try {
    reader.readAsDataURL(options.file)
    reader.onload = function(e) {
      const a = document.createElement('a')
      a.href = e.target.result
      a.download = options.fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  } catch (e) {
    console.log(e)
  }
}
