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
        <p>
          <span>
            <i class="iconyonghuming" />
          </span>
          <el-input v-model="username" placeholder="请输入用户名或手机号" />
        </p>
        <p>
          <span>
            <i class="iconziyuanxhdpi" />
          </span>
          <el-input v-model="password" placeholder="请输入密码" />
        </p>
        <div class="clearfix">
          <p class="fl"><el-checkbox v-model="agree_check">阅读并同意以下协议《服务协议》</el-checkbox></p>
          <p class="fr forget-word" @click="foget_pwd_fn">忘记密码</p>
        </div>
        <div>
          <el-button type="primary" class="log-big-btn">立即登录</el-button>
        </div>
      </div>
      <div v-if="forget_pwd_flag" class="normal-box forget-pass-box">
        <div>
          <p class="sub-title">重置密码</p>
          <p>
            <el-input v-model="forget_phone" placeholder="请输入手机号" />
          </p>
          <p class="sms-box">
            <el-input v-model="forget_sms" placeholder="请输入短信验证码" />
            <el-button class="forget-sendsms-btn">发送</el-button>
          </p>
          <p>
            <el-input v-model="new_pwd" placeholder="请输入新密码(最少六位,数字+字母)" />
          </p>
          <p>
            <el-input v-model="confirm_pwd" placeholder="请再次确认密码(最少六位,数字+字母)" />
          </p>
        </div>
        <div>
          <el-button type="primary"class="log-big-btn">重置后登录</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      logintype: 1,
      agree_check: true,
      loading: false,
      passwordType: 'password',
      forget_pwd_flag: false,
      forget_phone: '',
      forget_sms: '',
      new_pwd: '',
      confirm_pwd: '',
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
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
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
                width: 100%;
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
            .forget-pass-box{
                .sms-box{
                    position: relative;
                    .forget-sendsms-btn{
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
    }
    .login-box  .normal-box /deep/  .el-input--small .el-input__inner{
        height: 45px;
        line-height: 45px;
        padding: 0 5px;
    }
    .login-box  .forget-pass-box .sms-box /deep/  .el-input--small .el-input__inner{
        padding-right: 100px;
    }
</style>
