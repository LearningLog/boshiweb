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
          <span class="iconfont iconmima" />
          <el-input v-model.trim="password" type="password" placeholder="请输入密码" autocomplete="off" @keyup.enter.native="login_fn" />
        </p>
        <p v-if="is_first" class="posire sms-box">
          <span class="iconfont iconduanxin" />
          <el-input v-model.trim="first_sms" v-input-filter:int placeholder="请输入短信验证码" autocomplete="off" @keyup.native="first_sms_vali_fn" />
          <el-button class="sendsms-btn" :disabled="first_dis" @click="first_sendsms_fn">{{ first_down }}</el-button>
        </p>
        <div class="clearfix">
          <p class="fl"><el-checkbox v-model="agree_check" /><span class="agreement-tip" @click="show_agreement_fn">阅读并同意以下协议《服务协议》</span></p>
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
            <el-input v-model.trim="forget_phone" v-input-filter:int placeholder="请输入手机号" maxlength="11" autocomplete="off" />
          </p>
          <p class="posire sms-box">
            <span class="iconfont iconduanxin" />
            <el-input v-model.trim="forget_sms" v-input-filter:int placeholder="请输入短信验证码" autocomplete="off" />
            <el-button class="sendsms-btn" :disabled="forget_dis" @click="forget_sendsms_fn">{{ forget_down }}</el-button>
          </p>
          <p class="posire">
            <span class="iconfont iconmima" />
            <el-input v-model.trim="new_pwd" type="password" placeholder="请输入新密码(最少六位,数字+字母)" autocomplete="new-password" />
          </p>
          <p class="posire">
            <span class="iconfont iconmima" />
            <el-input v-model.trim="confirm_pwd" type="password" placeholder="请再次确认密码(最少六位,数字+字母)" autocomplete="new-password" />
          </p>
        </div>
        <div>
          <el-button type="primary" class="log-big-btn" @click="forget_log_fn">重置后登录</el-button>
        </div>
      </div>
    </div>
    <div />
    <el-dialog
      v-el-drag-dialog
      title="服务协议"
      :visible.sync="show_agreement"
      width="55%"
    >
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <div class="agreement-box">
          <p class="no_indent">
            <span class="bold_w">导言</span>
            <br>
          </p>
          <p class="no_indent">
            <span>
              <span>尊敬的用户：</span>
            </span>
          </p>
          <p>
            <span>
              <span>非常感谢您使用</span>
              <span>博识</span>
              <span>产品，为让您更好地使用</span>
              <span>博识</span>
              <span>提供的产品和服务，请您务必审慎阅读、充分理解《</span>
              <span>博识</span>
              <span>用户协议》（以下称「用户协议」或</span>
              <span>「本协议」）各条款内容，特别是免除或者限制责任的条款，并选择接受或不接受。本协议中限制、免责条款可能以加粗形式提醒您注意。</span>
            </span>
          </p>
          <p>
            <span>
              <span>除非您已阅读并接受本协议所有条款，否则您无权下载、安装或使用</span>
              <span>博识</span>
              <span>提供相关产品和服务。您的下载、安装、使用、登陆等行为即视为您已阅读并同意本协议的约束。</span>
            </span>
          </p>
          <p>
            <span>
              <span class="bold_w">一、总则</span>
            </span>
          </p>
          <p>
            <span>
              <span>博识小程序</span>
              <span>及</span> www.bs.yunshicloud.com（以下统称「 博识 产品」）是由北京阳光云视科技有限公司提供的互联网产品和服务。本服务协议具有合同效力；</span>
          </p>
          <p>
            <span>1) 您在使用博识提供的各项服务之前，应仔细阅读本服务协议。如果您不同意本服务协议以及本公司随时对其可能做出的修改，您可以主动取消博识为您提供的服务；一经注册为用户，即表示您已了解并完全同意本服务协议各项内容及博识对服务协议随时所做的任何修改；</span>
          </p>
          <p>
            <span>2) 本公司有权在必要时单方修改或变更本服务协议之内容，并将通过本公司网站公布最新的服务协议，无需另行单独通知您；</span>
          </p>
          <p>
            <span>3) 本网站的注册使用用户必须是具有法律规定的完全民事权利能力和民事行为能力，能够独立承担民事责任的企事业代表或其他机构组织；本协议内容不受您所属国家或地区的排斥；</span>
          </p>
          <p>
            <span>4）本协议主要针对博识试用以及正式用户提供了双方的约定。</span>
          </p>
          <p>
            <span>
              <span class="bold_w">二、服务内容</span>
            </span>
          </p>
          <p>
            <span>
              <span>博识为正式用户提供下列服务：</span>
            </span>
          </p>
          <p>
            <span>1）免费提供以“bs.yunshicloudcom”为主的二级域名企业服务站点；</span>
          </p>
          <p>
            <span>2）免费提供有限的资源存储空间（限定在7天）；</span>
          </p>
          <p>
            <span>3）免费获得博识的定期升级服务；</span>
          </p>
          <p>
            <span>4）为用户提供产品使用问题的在线解答服务；</span>
          </p>
          <p>
            <span>5）提供产品的使用技巧推送服务（需关注博识隶属机构阳光云视ONAIR视频云服务号）；</span>
          </p>
          <p>
            <span>6）提供全国范围的内容加速华为云(CDN)服务及视频资源加密服务；</span>
          </p>
          <p>
            <span>7）免费的服务退出时的数据获取服务。</span>
          </p>
          <p>
            <span>
              <span class="bold_w">三、佣金收取协议及限制</span>
            </span>
          </p>
          <p>
            <span>1) 博识企业服务正式用户只能使用博识的公共交易支付账户；</span>
          </p>
          <p>
            <span>2) 正式用户需接受开通的站点采用博识提供的公共交易支付账户平台（包括但不限于支付宝、财付通、微信支付、银联）并同意按照网络支付平台规定扣除交易手续费，交易手续费费率按照1%记收；</span>
          </p>
          <p>
            <span>3) 博识企业服务正式用户按照3元/小时/来核算记收；单一学员账号自注册之日起，年度（从注册日期起壹年）在线学时长费用封顶金额为150元人民币；</span>
          </p>
          <p>
            <span>4) 博识每月12号之前提供对应的服务费用对账单。</span>
          </p>
          <p>
            <span>
              <span class="bold_w">四、使用规则</span>
            </span>
          </p>
          <p>
            <span>
              <span>用户在使用博识所提供的各项服务时，必须遵守中华人民共和国相关法律法规的规定，用户应同意将不会利用本服务进行任何违法或不正当的活动，包括但不限于下列行为：</span>
            </span>
          </p>
          <p>
            <span>1) 上传、传播或以其它方式传送含有反动，色情，及种族歧视等内容的信息；</span>
          </p>
          <p>
            <span>2) 从事非法交易活动，如洗钱，提供赌博咨询，提供色情服务等；</span>
          </p>
          <p>
            <span>3) 非法使用他人银行账户或无效的银行账号进行交易；</span>
          </p>
          <p>
            <span>4) 违反与网络服务有关的网络协议、规定和程序；</span>
          </p>
          <p>
            <span>5) 不得利用博识网络服务系统进行任何不利于博识的行为，或为任何非法目的而使用本网络服务系统；</span>
          </p>
          <p>
            <span>6) 不得利用博识网络服务系统进行任何可能对互联网正常运转造成不利影响的行为；</span>
          </p>
          <p>
            <span>7) 不得侵犯他人专利权、著作权、名誉权或其他任何合法权益及知识产权，否则将承担所有相关法律责任；</span>
          </p>
          <p>
            <span>8) 如发现任何非法使用用户帐号或帐号出现安全漏洞的情况，应立即通告博识；</span>
          </p>
          <p>
            <span>9) 用户可以有</span>
            <span>7</span>
            <span>
              <span>天的体验期，体验期完成后，可以根据自己的使用需求选择转为收费用户；</span>
            </span>
          </p>
          <p>
            <span>10) 用户需按照博识转正用户的要求提供对应的审核材料，提交审核后会在3-5个工作日进行审核通过；在提交正式使用申请时，客服会验证您提交的信息是否正确，以决定是否批准您的正式申请。若因您未及时更新资料，导致本服务无法提供或提供时发生任何错误，您将承担因此产生的一切后果，本公司不承担任何责任；</span>
          </p>
          <p>
            <span>11) 您必须对您的账户负责，该账户不可转让、不可赠与、不可继承。在您决定不再使用该账户时，您应将该账户下所对应的可用款项全部提现或者向本公司发出其它支付指令，并向本公司申请注销该账户；</span>
          </p>
          <p>
            <span>12) 本公司在发现异常操作或有违法行为时，有权不经通知先行暂停或终止该用户对本网络服务系统部分或全部功能的使用。</span>
          </p>
          <p>
            <span>
              <span class="bold_w">五、注册信息及隐私保护</span>
            </span>
          </p>
          <p>
            <span>1) 您注册为博识用户时应向本公司提供真实的电话号码和电子邮件地址，及（或）相关附加信息。您同意本公司通过您所提供的联系方式有针对性地向您提供新的服务和机会；</span>
          </p>
          <p>
            <span>2) 本公司所提供的支付服务将需要您提供您的银行账户信息，本公司将严格履行相关保密约定；</span>
          </p>
          <p>
            <span>3) 您了解并同意本公司使用cookie来使博识网站对用户更友好，它可以帮您省去为使用我们的服务而重复输入注册信息和跟踪您的浏览器的状态；</span>
          </p>
          <p>
            <span>4) 为保障网络服务的安全性及服务质量的改进，本公司将记录并保存您登录和交易活动的相关信息，并承诺不将此类信息提供给任何第三方（除双方另有约定或法律法规另有规定外）；</span>
          </p>
          <p>
            <span>5) 博识网站含有到其他网站的链接，但本公司对其他网站的隐私保护措施不负任何责任。本公司可能在任何需要的时候增加商业伙伴或共用品牌的网站；</span>
          </p>
          <p>
            <span>6) 本公司仅按现有技术向用户提供相应的安全措施来使本公司掌握的信息不丢失，不被滥用或更改，但本公司不保证这些信息的绝对安全。</span>
          </p>
          <p>
            <span>
              <span class="bold_w">六、协议双方权利和义务</span>
            </span>
          </p>
          <p>
            <span>
              <span>（一）</span>
              <span>博识的权利和义务</span>
            </span>
          </p>
          <p>
            <span>1) 博识负责网络交易平台的建设、运行和维护，保证为客户提供安全有效的网络服务和操作环境；</span>
          </p>
          <p>
            <span>2) 博识负责解答用户在使用网络交易平台进行操作的过程中遇到的各种疑问；</span>
          </p>
          <p>
            <span>3) 对于用户在博识平台上的不当行为或其它任何博识认为应当终止服务的情况，博识有权根据不同情况选择保留或删除相关信息或停止对该用户提供服务，并追究相关法律责任；</span>
          </p>
          <p>
            <span>4) 博识会在用户的计算机上设定或取用博识 cookies。博识在用户登录时获取数据，使用cookies可为用户用户提供个性化服务。 如果用户拒绝所有 cookies，将不能使用需要登录的博识服务内容。</span>
          </p>
          <p>
            <span>
              <span>（二）</span>
              <span>用户权利和义务</span>
            </span>
          </p>
          <p>
            <span>1) 用户须严格遵守博识的管理和运行规定,并享有博识为用户提供的服务和优惠条件；</span>
          </p>
          <p>
            <span>2) 用户必须保证其向博识提供有关资料的真实性，如基本信息说明，邮箱，联系电话等。用户须独立承担因其资料不准确、不真实而引发的一切责任；</span>
          </p>
          <p>
            <span>3) 用户不得将本网络服务系统用于非本公司许可的其他用途；</span>
          </p>
          <p>
            <span>4) 用户在网上发布的所有信息和从事的交易活动必须严格遵守现行法律法规及有关国家规定，并承担与此相应的责任。</span>
          </p>
          <p>
            <span>
              <span class="bold_w">七、禁止与限制发布知识产品</span>
            </span>
          </p>
          <p>
            <span>
              <span>由于发布以下知识产品或服务所引起的法律责任由相关用户完全承担，与博识无关。一旦博识发现有任何违反本规则的服务信息，博识有权立即予以删除，并保留给予相关用户警告、冻结直至终止其帐户的权力。请各位用户自觉遵守</span>
            </span>
          </p>
          <p>
            <span>
              <span>禁止发布的知识产品和服务：</span>
            </span>
          </p>
          <p>
            <span>1) 含有反动、淫秽、种族或者宗教歧视以及其它法律禁止内容的知识产品和服务；</span>
          </p>
          <p>
            <span>2) 涉及恐怖活动、邪教组织等反社会的产品和服务信息；</span>
          </p>
          <p>
            <span>3) 涉及国家秘密的信息等；</span>
          </p>
          <p>
            <span>4) 伪造的服务信息；</span>
          </p>
          <p>
            <span>5) 黄色淫秽产品、色情服务；</span>
          </p>
          <p>
            <span>6) 侵犯他人知识产权或违反国家法律法规条例的服务信息；</span>
          </p>
          <p>
            <span>7) 其它可能危害他人安全和利益的服务信息。</span>
          </p>
          <p>
            <span>
              <span class="bold_w">八、知识产权的保护</span>
            </span>
          </p>
          <p>
            <span>1) 博识网站上的所有内容，包括但不限于档案、图片、资料、资讯、网站架构、网页设计，均由本公司或本公司相关企业依法拥有其知识产权，包括但不限于商标权、专利权、著作权、商业秘密等；</span>
          </p>
          <p>
            <span>2) 非经本公司或其他权利人书面同意，任何人不得擅自使用、修改、复制、公开传播、改变、散布、发行或公开发表本网站程序或内容；</span>
          </p>
          <p>
            <span>3) 尊重知识产权是您应尽的义务，如有违反，您须承担相应的损害赔偿责任。</span>
          </p>
          <p>
            <span>
              <span class="bold_w">九、服务变更、中断或终止</span>
            </span>
          </p>
          <p>
            <span>1) 鉴于网络服务的特殊性，用户同意博识有权随时变更、中断或终止部分或全部的网络服务。博识无需将变更，中断或终止内容通知用户，也无需对任何用户或任何第三方承担任何责任；</span>
          </p>
          <p>
            <span>2) 博识有权在必要时修改服务条款，并将在重要页面上提示修改内容。如果不同意所改动的内容，用户可以主动取消获得的网络服务。如果用户继续享用网络服务，则视为接受服务条款的变动；</span>
          </p>
          <p>
            <span>3) 如用户向博识提出注销注册用户身份时，经审核同意，由博识注销该注册用户，并解除与之服务协议关系；</span>
          </p>
          <p>
            <span>4) 如用户提供的个人资料不实或违反本协议中规定的使用规则，博识有权随时中断或终止向用户提供本协议项下的网络服务，并无需对用户或任何第三方承担任何责任。</span>
          </p>
          <p>
            <span>
              <span class="bold_w">十、免责声明</span>
            </span>
          </p>
          <p>
            <span>1) 用户同意自行承担对使用博识网络服务所产生的风险，博识对用户不承担任何责任；</span>
          </p>
          <p>
            <span>2) 对所提供的网络服务，博识不担保一定能满足用户的要求，对网络服务的及时性、安全性、准确性不作担保；</span>
          </p>
          <p>
            <span>3) 对于因不可抗力或博识不能控制的原因造成的网络服务中断或其它缺陷，博识不承担任何责任，但将尽力减少因此而给用户造成的损失和影响；</span>
          </p>
          <p>
            <span>4) 博识保留在不事先通知用户的情况下随时中断或终止部分或全部网络服务的权利，对于</span>
            <span>
              <span>所有服务的中断或终止而造成的任何损失，无需对用户或任何第三方承担任何责任；</span>
            </span>
          </p>
          <p>
            <span>5) 如因系统维护或升级的需要，博识有权暂停网络服务。</span>
          </p>
          <p>
            <span>
              <span class="bold_w">十一、违约责任</span>
            </span>
          </p>
          <p>
            <span>1) 如因用户违反有关法律、法规或本协议项下的任何条款而给博识或其他用户造成损失，用户同意承担由此造成的损害赔偿责任；</span>
          </p>
          <p>
            <span>2) 如因博识违反有关法律、法规或本协议项下的任何条款而给用户造成损失，博识同意承担由此造成的损害赔偿责任。</span>
          </p>
          <p>
            <span>
              <span class="bold_w">十二、法律适用与争议解决</span>
            </span>
          </p>
          <p>
            <span>1) 协议双方应以友好协商方式解决协议履行过程中产生的争议与纠纷；</span>
          </p>
          <p>
            <span>2) 协商无效时，应提交当地法院通过诉讼解决；</span>
          </p>
          <p>
            <span>3) 本协议之效力、解释、执行、争议解决等均适用中华人民共和国和用户所在国家相关法律法规，没有相关法律规定的内容，参照通用国际商业惯例和（或）行业惯例。</span>
          </p>
          <p>
            <span>
              <span class="bold_w">十三、本协议自</span>2019年8月1日起实行，解释权归北京阳光云视科技有限公司。</span>
          </p>
        </div>
      </el-scrollbar>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="agree_fn">同意</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { firstLogin_sendsms, validate_first_sms, forget_sendsms, validate_forget_sms, forget_updatepwd } from '@/api/login'
import { regPhone, regPwd } from '@/utils/validate'
import inputFilter from '@/directive/input-filter'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import {createFullUrl} from '@/utils/index'

export default {
  name: 'Login',
  directives: { inputFilter, elDragDialog },
  data() {
    return {
      username: '', // 用户名
      password: '', // 密码
      logintype: 1, // 登录平台 pc端
      agree_check: true, // 同意协议否
      is_first: false, // 是否是手机号第一次登录
      YZ_id: '', // 手机号第一次登录返回的需验证数据
      first_down: '60s', // 倒计时
      first_sms: '', // 手机号第一次登录的验证码
      first_dis: false, // 发送手机号第一次登录的验证码按钮是否可用
      YZMDT: {}, // 手机号第一次登录的验证码信息
      passwordType: 'password', // inputtype
      forget_pwd_flag: false, // 是否忘记密码
      forget_phone: '', // 发送忘记密码的验证码的手机号
      forget_sms: '', // 忘记密码的验证码
      forget_down: '发送', // 发送忘记密码的btn的txt
      forget_dis: false, // 发送忘记密码的btn是否可用
      new_pwd: '', // 新密码
      confirm_pwd: '', // 确认密码
      reset_pwd_sms: {}, // 忘记密码的验证码信息
      show_agreement: false, // 是否显示协议
      redirect: undefined // 重置路径
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
    // 显示协议
    show_agreement_fn() {
      this.show_agreement = true
    },
    // 协议统一否
    agree_fn() {
      this.agree_check = true
      this.show_agreement = false
    },
    // 是否忘记密码
    foget_pwd_fn() {
      this.forget_pwd_flag = true
    },
    // 登录
    login_fn() {
      const that = this
      const uname = that.username
      const pwd = that.password
      const agree_check = that.agree_check
      if (!agree_check) {
        that.$message.error('请阅读并同意服务协议！')
        return
      }
      if (uname === '') {
        that.$message.error('请输入用户名或手机号！')
        return
      }
      if (pwd === '') {
        that.$message.error('请输入密码！')
        return
      }
      const param = {}
      param.username = uname
      param.password = pwd
      that.$store.dispatch('user/login', param).then((res) => {
        if (res.code === 0) {
          let toPath = ('#' + (this.redirect || ' '))
          toPath = createFullUrl(toPath)
          window.location.href = toPath
        }
        if (res.code === 5001) {
          that.YZ_id = res.data
          that.show_first_fn()
        }
      }).catch((res) => {
        console.log(res)
      })
    },
    // 手机号第一次登录的弹窗
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
    // 手机号第一次登录的发送验证码
    first_sendsms_fn() {
      const that = this
      const param = {}
      param._id = that.YZ_id
      firstLogin_sendsms(param).then(res => {
        if (res.data.needValidate === false) {
          that.login_fn()
          // that.$router.push({ path: this.redirect || '/' })
        } else if (res.data.needValidate === true) {
          that.first_countdown_fn()
          that.is_first = true
          that.YZMDT.sms_token = res.data.sms_token
          that.YZMDT._id = res.data._id
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // 手机号第一次登录的倒计时
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
    // 验证手机号第一次登录的验证码
    first_sms_vali_fn() {
      const that = this
      const first_sms = that.first_sms
      const param = {}
      if (first_sms.length === 6) {
        param._id = that.YZMDT._id
        param.sms_token = that.YZMDT.sms_token
        param.sms_code = that.first_sms
        validate_first_sms(param).then(res => {
          console.log('验证成功！')
          that.login_fn()
          // that.$router.push({ path: this.redirect || '/' })
        }).catch(error => {
          console.log(error)
        })
      }
    },
    // 忘记密码发送验证码
    forget_sendsms_fn() {
      const that = this
      const forget_phone = that.forget_phone
      if (!regPhone(forget_phone)) {
        that.$message.error('请输入正确的手机号！')
        return
      }
      const param = {}
      param.phone = forget_phone
      param.type = 4
      forget_sendsms(param).then(res => {
        if (res.code === 10001) {
          that.$message.error('该手机号不存在！')
        } else {
          that.forget_countdown()
          that.reset_pwd_sms.send_id = res.data._id
          that.reset_pwd_sms.send_sms_token = res.data.sms_token
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // 忘记密码倒计时
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
    // 重置密码登录
    forget_log_fn() {
      const that = this
      const forget_phone = that.forget_phone
      const new_pwd = that.new_pwd
      const confirm_pwd = that.confirm_pwd
      const forget_sms = that.forget_sms
      const verifyparam = {}
      const verifiedDt = {}
      if (!regPhone(forget_phone)) {
        that.$message.error('请输入正确的手机号！')
        return
      }
      if (forget_sms === '') {
        that.$message.error('验证码不能为空！')
        return
      }
      if (new_pwd === '' || confirm_pwd === '') {
        that.$message.error('密码不能为空！')
        return
      }
      if (new_pwd !== confirm_pwd) {
        that.$message.error('两次密码不一致！')
        return
      }
      if (!regPwd(new_pwd) || !regPwd(confirm_pwd)) {
        that.$message.error('密码6-50位,数字+字母！')
        return
      }
      verifyparam.sms_token = that.reset_pwd_sms.send_sms_token
      verifyparam._id = that.reset_pwd_sms.send_id // 短信id
      verifyparam.sms_code = forget_sms
      // 验证验证码
      validate_forget_sms(verifyparam).then(res => {
        verifiedDt.userId = res.data.userid
        verifiedDt.token = res.data.token
        const reset_pwd_param = {}
        reset_pwd_param.confirmpassword = confirm_pwd
        reset_pwd_param.password = new_pwd
        reset_pwd_param.token = verifiedDt.token
        reset_pwd_param._id = verifiedDt.userId
        // 修改密码
        forget_updatepwd(reset_pwd_param).then(res => {
          that.$message({
            message: '重置成功！',
            type: 'success'
          })
          that.forget_pwd_flag = false
        }).catch(error => {
          console.log(error)
        })
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
    @import "~@/styles/element-variables.scss";
    @import "~@/styles/variables.scss";
    @import "~@/styles/theme.scss";
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
              max-width: 100%;
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
                    margin: 18px 0;
                    color: $themeColor;
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
            .agreement-tip{
              cursor: pointer;
              color: $themeColor;
              font-size: 14px;
            }
            .sms-box{
                .sendsms-btn{
                    color: $themeColor;
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
    .login-box /deep/ .el-checkbox{
      margin-right: 5px;
    }
    .el-scrollbar {
      height: 58vh;
      width: 100%;
    }
    .agreement-box{
      /*height: 60vh;*/
      /*overflow-y: auto;*/
        p {
          line-height: 30px;
          text-indent: 28px;
          font-size: 14px;
          padding: 0 15px;
          margin: 0;
        }
        .no_indent {
          text-indent: 0;
        }
        .bold_w {
          color: #000;
          font-weight: bold;
        }
        .tc {
          text-align: center;
        }
    }
</style>
