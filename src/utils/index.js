/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}

// 翻页序号
export function getSerialNum(index, currentPage, pageSize) {
  return ((index + 1) + (currentPage - 1)) * pageSize
}

/** 获取存储空间大小
 * @param fileSize
 */
export function getFileShowSize(fileSize) {
  if (fileSize) {
    var KLength = 1024
    var MLength = KLength * 1024
    var GLength = MLength * 1024
    var TLength = GLength * 1024

    var showStr = ''
    var T = 0
    var G = 0
    var M = 0
    var K = 0
    T = fileSize / TLength
    G = fileSize / GLength
    M = fileSize / MLength

    T = parseInt(T.toFixed(2))
    G = parseInt(G.toFixed(2))
    M = parseInt(M.toFixed(2))

    if (T > 0) {
      // 如果大于1T则显示为2.34TB样式
      T = fileSize / TLength
      showStr = T.toFixed(2) + 'TB'
    } else if (G > 0) {
      // 如果大于1G则显示为2.34GB样式
      G = fileSize / GLength
      showStr = G.toFixed(2) + 'GB'
    } else if (M > 0) {
      // 如果大于1M则显示为2.34MB样式
      M = fileSize / MLength
      showStr = M.toFixed(2) + 'MB'
    } else {
      // 显示为44KB
      K = fileSize / KLength
      if (parseInt(K)) {
        showStr = parseInt(K) + 'KB'
      } else {
        showStr = '--'
      }
    }
    return showStr
  } else {
    return '--'
  }
}

// 获取存储空间大小，G
export function getFileShowSizeToG(fileSize) {
  if (fileSize) {
    var KLength = 1024
    var MLength = KLength * 1024
    var GLength = MLength * 1024

    var showStr = ''
    var G = 0
    G = fileSize / GLength

    G = parseInt(G.toFixed(2))
    G = fileSize / GLength
    showStr = G.toFixed(2) * 1

    return showStr
  } else {
    return 0
  }
}

// 获取存储空间大小，bt
export function getFileShowSizeToBT(fileSize) {
  fileSize = Math.ceil(fileSize * 1 * Math.pow(1024, 3))
  return fileSize
}

// 根据选项在数组中位置获取选项序号
export function getOptionOrderByIndex(index) {
  // 选项序号
  var option_order = ['A. ', 'B. ', 'C. ', 'D. ', 'E. ', 'F. ', 'G. ', 'H. ', 'I. ', 'J. ', 'K. ', 'L. ', 'M. ', 'N. ', 'O. ', 'P. ', 'Q. ', 'R. ', 'S. ', 'T. ', 'U. ', 'V. ', 'W. ', 'X. ', 'Y. ', 'Z. ']
  index = parseInt(index)
  if (index < 0 || index > (option_order.length - 1)) {
    return 'Z. '
  }
  return option_order[index]
}
