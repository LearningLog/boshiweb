/**
* @Author: YanHuaKang
* @Date: 2019/10/14
* @Description: 登录信息
* @remarks:
*/

import Cookies from 'js-cookie'

const TokenKey = 'boshi_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
