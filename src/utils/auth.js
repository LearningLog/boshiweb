/**
* @Author: YanHuaKang
* @Date: 2019/10/14
* @Description: 登录信息
* @remarks:
*/

const TokenKey = 'boshi_token'

export function getToken() {
  return sessionStorage.getItem(TokenKey)
}

export function setToken(token) {
  return sessionStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return sessionStorage.removeItem(TokenKey)
}
