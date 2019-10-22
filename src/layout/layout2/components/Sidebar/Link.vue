
<template>
  <!-- eslint-disable vue/require-component-is -->
  <component v-bind="linkProps(to)" @click.native="refreshView(to)">
  <!--<component v-bind="linkProps(to)">-->
    <slot />
  </component>
</template>

<script>
import { isExternal } from '@/utils/validate'

export default {
  props: {
    to: {
      type: String,
      required: true
    }
  },
  methods: {
    refreshView(url) {
      const defaultActive = JSON.parse(sessionStorage.getItem('defaultActive'))
      // 点击侧边栏 刷新当前路由，vue-element-admin官网解释
      // https://panjiachen.gitee.io/vue-element-admin-site/zh/guide/essentials/router-and-nav.html#%E7%82%B9%E5%87%BB%E4%BE%A7%E8%BE%B9%E6%A0%8F-%E5%88%B7%E6%96%B0%E5%BD%93%E5%89%8D%E8%B7%AF%E7%94%B1
      // 中心思想：通过重定向空白路由页面，然后再重定向到想去的页面，中间让路由url变化以实现当前页面刷新
      if (defaultActive === url + '/list' || defaultActive === url) {
        // 点击的是当前路由 手动重定向页面到 '/redirect' 页面
        sessionStorage.setItem('defaultActive', JSON.stringify(url))
        const { fullPath } = this.$route
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + fullPath
          })
        })
      } else {
        sessionStorage.setItem('defaultActive', JSON.stringify(url))
        // 正常跳转
        // this.$router.push({
        //   path: url
        // })
      }
    },
    linkProps(url) {
      if (isExternal(url)) {
        return {
          is: 'a',
          href: url,
          target: '_blank',
          rel: 'noopener'
        }
      }
      return {
        is: 'router-link',
        to: url
      }
    }
  }
}
</script>
