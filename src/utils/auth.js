/**
* @Author: YanHuaKang
* @Date: 2019/10/14
* @Description: 登录信息
* @remarks:
*/

import Cookies from 'js-cookie'

const TokenKey = 'boshi_token'

export function getToken() {
<<<<<<< HEAD
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
=======
  return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return localStorage.removeItem(TokenKey)
>>>>>>> 2afc71c771473be3a468877704086cf05c888afa
}
