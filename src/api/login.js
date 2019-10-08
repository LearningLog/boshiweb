import request from '@/utils/request'

export function firstLogin_sendsms(data) {
  return request({
    url: '/api/userApi/sendPhoneValidateSmsCode',
    method: 'post',
    data
  })
}
export function forget_sendsms(data) {
  return request({
    url: '/api/sms/sendSmsByPhone',
    method: 'post',
    data
  })
}
