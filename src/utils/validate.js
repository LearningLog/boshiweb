/**
* @Author: YanHuaKang
* @Date: 2019/10/14
* @Description: 表单校验函数
* @remarks:
*/

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}
/**
 * @param {string} param
 * @returns {Boolean}
 */
export function regPhone(param) {
  const phone_pattern = /0?(13|14|15|17|18|19)[0-9]{9}/
  if (phone_pattern.test(param)) {
    return true
  } else {
    return false
  }
}
/**
 * @param {string} param
 * @returns {Boolean}
 */
export function regPwd(param) {
  const pwd_pattern = /^(?!(?:\d+|[a-zA-Z]+)$)[\da-zA-Z]{6,50}$/
  if (pwd_pattern.test(param)) {
    return true
  } else {
    return false
  }
}
/**
 * @str {string} str
 * @param {number} minLenth maxLength
 * @returns {Boolean}
 */
export function strLength(str, minLenth, maxLength) {
  if ((str.length > minLenth || str.length === minLenth) && (str.length < maxLength || str.length === maxLength)) {
    return true
  } else {
    return false
  }
}
/**
 * 租户管理员 2 到 64 位字母和数字的组合，不能连续11位数字
 * @param {string} param
 * @returns {Boolean}
 */
export function regUName(param) {
  const uName_phone = /\d{11}|\d{13}/
  const uName_pattern1 = /^[a-zA-Z0-9]{2,64}$/
  const uName_pattern2 = /^.*[a-zA-Z].*$/
  if (!uName_phone.test(param) && uName_pattern1.test(param) && uName_pattern2.test(param)) {
    return true
  } else {
    return false
  }
}

// input键入小数限制
export function onKeyValid(val, num) {
  val = val === undefined ? '' : val
  val = val.toString()
  if (num === 2) {
    const reg = /^0\.{1}\d{0,2}|\.{1}\d{0,2}$/
    if (!reg.test(val)) {
      return (val * 1).toFixed(2)
    }
  } else if (num === 3) {
    const reg = /^0\.{1}\d{0,2}|\.{1}\d{0,3}/
    if (!reg.test(val)) {
      return ''
    }
  } else if (num === 4) {
    const reg = /^0\.{1}\d{0,2}|\.{1}\d{0,4}/
    if (!reg.test(val)) {
      return ''
    }
  }
  return val
}

/**
 * 校验正整数
 * @param val
 * @returns {string | *}
 */
export function validIntNum(val) {
  val = val === undefined ? '' : val
  val = val.toString()
  const reg = /^\d+$/
  if (!reg.test(val)) {
    val = val.replace(/[^\d]/g, '') // 清除数字以外的
    return val
  } else {
    return val
  }
}

/**
 * input & keyup 校验输入数字（含小数）
 * @param val
 * @returns {string | *}
 */
export function validNum(val) {
  val = val === undefined ? '' : val
  val = val.toString()
  const reg = /^\d+$/
  if (!reg.test(val)) {
    val = val.replace(/[^\d.]/g, '') // 清除数字以外的
    return val
  } else {
    return val
  }
}
