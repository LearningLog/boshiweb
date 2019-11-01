import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout1 from '@/layout/layout1'
import Layout from '@/layout/layout2'

/* Router Modules */
import systemManage from './modules/systemManage'

/**
 * 注意: 菜单项sub-menu 仅在 route children.length >= 1 时显示
 * 详情请看此地址: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   如果设置为true，则不显示在左侧菜单栏，默认false，如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式
 *                                只有一个时，会将那个子路由当做根路由显示在侧边栏
 *                                若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           如果设置为noRedirect，则在面包屑中不可以重定向（点击无效）
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               设置该路由在侧边栏和面包屑中展示的名字
    icon: 'iconfont'             设置该路由的图标
    breadcrumb: false            如果设置为false，则不会在breadcrumb面包屑中显示(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

// 所有权限通用路由表
// 如首页和登录页和一些不用权限（404、401）的公用页面
export const constantRoutes = [
  // 需求： 点击侧边菜单栏 刷新当前路由
  /**
   * 1，用户点击当前高亮的路由并不会刷新view，因为vue-router会拦截你的路由，它判断你的url并没有任何变化，所以它不会触发任何钩子或者是view的变化
   * 2，因此创建一个空的Redirect页面，通过判断当前点击的菜单路由和当前的路由是否一致
   * 一致的时候，会先跳转到专门 Redirect 的页面，然后将路由重定向到我想去的页面，这样就起到了刷新的效果了。
   */
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },

  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/',
    component: Layout1,
    hidden: true,
    redirect: '/',
    children: [{
      path: '/',
      name: '主页',
      component: () => import('@/views/door/index'),
      meta: { title: '主页' }
    }]
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  }
]

// 异步挂载的路由
// 动态需要根据权限加载的路由表
export const asyncRoutes = [

  /** when your routing map is too long, you can split it into small modules **/
  systemManage,

  {
    path: '/enterpriseData',
    component: Layout,
    redirect: '/enterpriseData/list',
    name: 'enterpriseData',
    meta: { title: '企业数据', icon: 'iconshuju' },
    children: [
      {
        path: 'edit',
        name: 'enterpriseDataEdit',
        hidden: true,
        component: () => import('@/views/enterpriseData/edit'),
        meta: { title: '修改企业数据', icon: '', activeMenu: '/enterpriseData' }
      },
      {
        path: 'detail',
        name: 'enterpriseDataDetail',
        hidden: true,
        component: () => import('@/views/enterpriseData/detail'),
        meta: { title: '查看企业数据', icon: '', activeMenu: '/enterpriseData' }
      },
      {
        path: 'list',
        name: 'enterpriseDataList',
        hidden: true,
        component: () => import('@/views/enterpriseData/list.vue'),
        meta: { title: '企业数据列表', icon: '', activeMenu: '/enterpriseData' }
      }
    ]
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: 'Example', icon: 'iconqiye' },
    children: [
      {
        path: 'hello-world',
        name: 'Hello-world',
        component: () => import('@/views/examples/hello-world'),
        meta: { title: 'Hello World', icon: 'hello-world', btnPermissionId: 'example' }
      },
      {
        path: 'vue-cropper',
        name: 'Vue-cropper',
        component: () => import('@/views/examples/vue-cropper'),
        meta: { title: 'Vue Cropper', icon: 'vue-cropper', btnPermissionId: 'example' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

// 实例化vue的时候只挂载constantRouter
const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
