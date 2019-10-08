/**
 * Created by PanJiaChen on 16/11/18.
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
