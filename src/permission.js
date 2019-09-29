import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // 免登录白名单

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()



  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // determine whether the user has obtained his permission routes through getInfo
      const hasPermission = store.getters.permission_routes && store.getters.permission_routes.length > 0
      console.log('hasPermission', hasPermission)
      if (hasPermission) { // 当有用户权限的时候，说明所有可访问路由已生成 如访问没权限的页面会自动进入404页面
        const currentButtonPermission = JSON.parse(store.getters.allButtonPermission)[to.meta.btnPermissionId]
        await store.dispatch('permission/setCurrentBtnMermission', currentButtonPermission)
        next()
      } else {
        try {
          // get user info
          // note: responseRoutes must be a object array! such as:
          // [
          //   {
          //     path: '/nested', // 组件路径
          //     children: [ // 子菜单
          //       {
          //         path: 'menu1',
          //         children: [
          //           {
          //             path: 'menu1-1'
          //           },
          //           {
          //             path: 'menu1-2',
          //             children: [
          //               {
          //                 path: 'menu1-2-1'
          //               },
          //               {
          //                 path: 'menu1-2-2'
          //               }
          //             ]
          //           },
          //           {
          //             path: 'menu1-3'
          //           }
          //         ]
          //       }
          //     ]
          //   }
          // ]
          const { responseRoutes, allButtonPermission } = await store.dispatch('user/getInfo')
          // 设置全部按钮权限
          await store.dispatch('permission/setAllCurrentBtnMermission', allButtonPermission)
          const currentButtonPermission = JSON.parse(store.getters.allButtonPermission)[to.meta.btnPermissionId]
          // 设置当前菜单下按钮权限
          await store.dispatch('permission/setCurrentBtnMermission', currentButtonPermission)
          // generate accessible routes map based on responseRoutes
          const accessRoutes = await store.dispatch('permission/generateRoutes', responseRoutes)

          // dynamically add accessible routes
          router.addRoutes(accessRoutes)

          /**
           * 这里还有一个小hack的地方，就是router.addRoutes之后的next()可能会失效，因为可能next()的时候路由并没有完全add完成，好在查阅文档发现
           * "next('/') or next({ path: '/' }): redirect to a different location. The current navigation will be aborted and a new one will be started."
           * hack方法 确保addRoutes已完成
           * set the replace: true, so the navigation will not leave a history record
           */
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
