<template>
  <div class="login-box">
    <div class="login-bg">
      <img src="@/assets/images/login-bg-pic.png">
    </div>
    <div class="login-cont">
      <div class="fir-title">
        <img src="@/assets/images/logo.png">
        <h1 class="">欢迎登录博识知识库</h1>
      </div>
      <div v-if="!forget_pwd_flag" class="normal-box">
        <p class="sub-title">用户登录</p>
        <p class="posire">
          <span class="iconfont iconyonghuming" />
          <el-input v-model.trim="username" placeholder="请输入用户名或手机号" />
        </p>
        <p class="posire">
          <span class="iconfont iconziyuanxhdpi" />
          <el-input v-model.trim="password" type="password" placeholder="请输入密码" />
        </p>
        <p v-if="is_first" class="posire sms-box">
          <span class="iconfont iconduanxin" />
          <el-input v-model.trim="first_sms" placeholder="请输入短信验证码" />
          <el-button class="sendsms-btn" :disabled="first_dis" @click="first_sendsms_fn">{{ first_down }}</el-button>
        </p>
        <div class="clearfix">
          <p class="fl"><el-checkbox v-model="agree_check">阅读并同意以下协议《服务协议》</el-checkbox></p>
          <p class="fr forget-word" @click="foget_pwd_fn">忘记密码</p>
        </div>
        <div>
          <el-button type="primary" class="log-big-btn" @click="login_fn">立即登录</el-button>
        </div>
      </div>
      <div v-if="forget_pwd_flag" class="normal-box forget-pass-box">
        <div>
          <p class="sub-title">重置密码</p>
          <p class="posire">
            <span class="iconfont iconyonghuming" />
            <el-input v-model.trim="forget_phone" placeholder="请输入手机号" />
          </p>
          <p class="posire sms-box">
            <span class="iconfont iconduanxin" />
            <el-input v-model.trim="forget_sms" placeholder="请输入短信验证码" />
            <el-button class="sendsms-btn" :disabled="forget_dis" @click="forget_sendsms_fn">{{ forget_down }}</el-button>
          </p>
          <p class="posire">
            <span class="iconfont iconziyuanxhdpi" />
            <el-input v-model.trim="new_pwd" type="password" placeholder="请输入新密码(最少六位,数字+字母)" />
          </p>
          <p class="posire">
            <span class="iconfont iconziyuanxhdpi" />
            <el-input v-model.trim="confirm_pwd" type="password" placeholder="请再次确认密码(最少六位,数字+字母)" />
          </p>
        </div>
        <div>
          <el-button type="primary"class="log-big-btn" @click="forget_log_fn">重置后登录</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { firstLogin_sendsms, forget_sendsms } from '@/api/login'
import { regPhone, regPwd } from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      logintype: 1,
      agree_check: true,
      loading: false,
      is_first: true,
      YZ_id: '', // 第一次登录
      first_down: '60s',
      first_sms: '',
      first_dis: false,
      YZMDT: {},
      passwordType: 'password',
      forget_pwd_flag: false,
      forget_phone: '',
      forget_sms: '',
      forget_down: '发送',
      forget_dis: false,
      new_pwd: '',
      confirm_pwd: '',
      reset_pwd_sms: {},
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    foget_pwd_fn() {
      this.forget_pwd_flag = true
    },
    login_fn() {
      const that = this
      const uname = that.username
      const pwd = that.password
      if (uname === '') {
        that.$message.error('请输入用户名或手机号')
      }
      if (pwd === '') {
        that.$message.error('请输入密码')
      }
      const param = {}
      param.username = uname
      param.password = pwd
      that.$store.dispatch('user/login', param).then((res) => {
        if (res.code === 0) {
          that.$router.push({ path: this.redirect || '/' })
          that.loading = false
        }
        if (res.code === 5001) {
          that.loading = false
          that.YZ_id = res.data
        }
      }).catch(() => {
        that.loading = false
      })
    },
    show_first_fn() {
      const that = this
      that.$confirm('该手机号首次登录系统，需进行安全校验，是否发送验证码至该手机？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.first_sendsms_fn()
      }).catch(() => {
        console.log('取消激活')
      })
    },
    first_sendsms_fn() {
      const that = this
      const param = {}
      param._id = that.YZ_id
      firstLogin_sendsms(param).then(res => {
        if (res.data.needValidate == false) {
          that.$router.push({ path: this.redirect || '/' })
        } else if (res.data.needValidate == true) {
          that.is_first = true
          that.YZMDT.sms_token = res.data.sms_token
          that.YZMDT._id = res.data._id
        }
      }).catch(error => {
        console.log(error)
      })
    },
    first_countdown_fn() {
      const that = this
      if (that.first_down === '重新发送') {
        that.first_down = '60s'
      } else {
        let count = 59
        const countDown = setInterval(() => {
          if (count === 0) {
            that.first_down = '重新发送'
            that.first_dis = false
            clearInterval(countDown)
          } else {
            that.first_down = count + 's'
            that.first_dis = true
          }
          count--
        }, 1000)
      }
    },
    forget_sendsms_fn() {
      const that = this
      const forget_phone = that.forget_phone
      if (!regPhone(forget_phone)) {
        that.$message.error('请输入正确的手机号')
        return
      }
      const param = {}
      param.phone = forget_phone
      param.type = 4
      forget_sendsms(param).then(res => {
        if (res.code === 10001) {
          that.$message.error('该手机号不存在')
        } else {
          that.forget_countdown()
          that.reset_pwd_sms.send_id = res.data._id
          that.reset_pwd_sms.send_sms_token = res.data.sms_token
        }
      }).catch(error => {
        console.log(error)
      })
    },
    forget_countdown() {
      const that = this
      let count = 59
      const countDown = setInterval(() => {
        if (count === 0) {
          that.forget_down = '重新发送'
          that.forget_dis = false
          clearInterval(countDown)
        } else {
          that.forget_dis = true
          that.forget_down = count + 's'
        }
        count--
      }, 1000)
      console.log(that.forget_down)
    },
    forget_log_fn() {
      const that = this
      const forget_phone = that.forget_phone
      const new_pwd = that.new_pwd
      const confirm_pwd = that.confirm_pwd
      const forget_sms = that.forget_sms
      const verifyparam = {}
      if (!regPhone(forget_phone)) {
        that.$message.error('请输入正确的手机号')
        return
      }
      if (forget_sms === '') {
        that.$message.error('验证码不能为空')
        return
      }
      if (new_pwd === '' || confirm_pwd === '') {
        that.$message.error('密码不能为空')
        return
      }
      if (new_pwd !== confirm_pwd) {
        that.$message.error('两次密码不一致')
        return
      }
      if (!regPwd(new_pwd) || !regPwd(confirm_pwd)) {
        that.$message.error('密码6-50位,数字+字母')
        return
      }
      verifyparam.sms_token = that.reset_pwd_sms.send_sms_token
      verifyparam._id = that.reset_pwd_sms.send_id // 短信id
      verifyparam.sms_code = forget_sms
    },

    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
    @import "~@/styles/element-variables.scss";
    @import "~@/styles/variables.scss";
    /* 修复input 背景不协调 和光标变色 */
    /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
    $fff: #fff;
    @supports (-webkit-mask: none) and (not (cater-color: $fff)) {
        .el-input input {
            color: $fff;
        }
    }
    .posire{
        position: relative;
    }
    .iconfont{
        font-size: 16px;
        position: absolute;
        top: 50%;
        left: 5px;
        margin-top: -8px;
        z-index: 10;
    }
    .iconduanxin{
        font-size: 12px;
        margin-top: -6px;
    }
    .login-box {
        display: flex;
        height: 100%;
        width: 100%;
        background-color: $fff;
        color: $fontColor;
        /*align-items: center;*/
        overflow: hidden;
        .login-bg{
            flex: 1;
            img{
                display: block;
                height: 100%;
            }
        }
        .login-cont{
            padding-top: 100px;
            flex: 1;
            .fir-title{
                text-align: center;
                margin-bottom: 50px;
                img{
                    width: 10%;
                }
                h1{
                    margin: 0;
                    font-size: 26px;
                    font-weight: normal;
                    margin-top: 2%;
                }
            }
            .sub-title{
                text-align: center;
                font-size: 20px;
                margin-bottom: 15px;
            }
            .normal-box{
                width: 50%;
                margin: 0 auto;
                .forget-word{
                    color: $actColor;
                    font-size: 14px;
                    cursor: pointer;
                }
                .log-normal-inp{
                    height: 45px;
                    line-height: 45px;
                    padding: 0 5px;
                }
                .log-big-btn{
                    width: 100%;
                    height: 45px;
                    line-height: 45px;
                    color: $fff;
                    font-size: 18px;
                    padding: 0;
                }
            }

            .sms-box{
                .sendsms-btn{
                    color: $actColor;
                    width: 80px;
                    height: 100%;
                    position: absolute;
                    top: 0;
                    right: 0;
                    text-align: center;
                    cursor: pointer;
                    border: none;
                    background: rgba(0,0,0,0);
                    z-index: 10;
                }
            }

        }
    }
    .login-box  .normal-box /deep/  .el-input--small .el-input__inner{
        height: 45px;
        line-height: 45px;
        padding: 0 10px 0 25px;
    }
    .login-box   .sms-box /deep/  .el-input--small .el-input__inner{
        padding-right: 100px;
    }
</style>
