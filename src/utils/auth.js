/**
* @Author: YanHuaKang
* @Date: 2019/10/14
* @Description: 登录信息
* @remarks:
*/

const TokenKey = 'boshi_token'

export function getToken() {
  return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return localStorage.removeItem(TokenKey)
}
