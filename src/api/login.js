/**
 * @Author: WangLiMei
 * @Date: 2019/10/15
 * @Description: 登录页面所有接口
 *               手机号第一次登录需要验证码验证ps用户名不用
 * @remarks:
 */import request from '@/utils/request'
// 第一次登录发送验证码
export function firstLogin_sendsms(data) {
  return request({
    url: '/api/userApi/sendPhoneValidateSmsCode',
    method: 'post',
    data
  })
}
// 验证第一次登录验证码
export function validate_first_sms(data) {
  return request({
    url: '/api/userApi/validatePhoneValidateSmsCode',
    method: 'post',
    data
  })
}
// 忘记密码发送验证码
export function forget_sendsms(data) {
  return request({
    url: '/api/sms/sendSmsByPhone',
    method: 'post',
    data
  })
}
// 验证忘记密码发送的验证码
export function validate_forget_sms(data) {
  return request({
    url: '/api/sms/validate',
    method: 'post',
    data
  })
}
// 忘记密码设置密码
export function forget_updatepwd(data) {
  return request({
    url: '/api/sms/updatepwd',
    method: 'post',
    data
  })
}
