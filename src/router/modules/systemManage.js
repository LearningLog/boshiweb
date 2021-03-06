/**
* @Author: YanHuaKang
* @Date: 2019/10/14
* @Description: 租户配置路由表
* @remarks:
*/

import Layout from '@/layout/layout2'

const systemManage = {
  path: '/systemManage',
  component: Layout,
  redirect: 'noRedirect',
  name: 'systemManage',
  meta: {
    title: '租户配置',
    icon: 'iconxiaozuguanli1'
  },
  children: [
    {
      path: 'menuManage',
      component: () => import('@/views/systemManage/menuManage/index'),
      redirect: '/systemManage/menuManage/list',
      name: 'menuManage',
      meta: { title: '菜单管理', icon: '', activeMenu: '/systemManage/menuManage' },
      children: [
        {
          path: 'add',
          component: () => import('@/views/systemManage/menuManage/child/add.vue'),
          name: 'menuAdd',
          hidden: true,
          meta: { title: '新增菜单', icon: '', activeMenu: '/systemManage/menuManage' }
        },
        {
          path: 'edit',
          name: 'menuEdit',
          hidden: true,
          component: () => import('@/views/systemManage/menuManage/child/edit'),
          meta: { title: '编辑菜单', icon: '', activeMenu: '/systemManage/menuManage' }
        },
        {
          path: 'detail',
          name: 'menuDetail',
          hidden: true,
          component: () => import('@/views/systemManage/menuManage/child/detail'),
          meta: { title: '菜单详情', icon: '', activeMenu: '/systemManage/menuManage' }
        },
        {
          path: 'list',
          name: 'menuList',
          hidden: true,
          component: () => import('@/views/systemManage/menuManage/child/list.vue'),
          meta: { title: '菜单列表', icon: '', activeMenu: '/systemManage/menuManage', keepAlive: true }
        }
      ]
    },
    {
      path: 'tenantManage',
      name: 'tenantManage',
      component: () => import('@/views/systemManage/tenantManage/index'),
      redirect: '/systemManage/tenantManage/list',
      meta: { title: '租户管理', icon: '', activeMenu: '/systemManage/tenantManage' },
      children: [
        {
          path: 'add',
          component: () => import('@/views/systemManage/tenantManage/child/add.vue'),
          name: 'tenantEditAdd',
          hidden: true,
          meta: { title: '新增租户', icon: '', activeMenu: '/systemManage/tenantManage' }
        },
        {
          path: 'edit',
          name: 'tenantEdit',
          hidden: true,
          component: () => import('@/views/systemManage/tenantManage/child/edit'),
          meta: { title: '修改租户', icon: '', activeMenu: '/systemManage/tenantManage' }
        },
        {
          path: 'detail',
          name: 'tenantDetail',
          hidden: true,
          component: () => import('@/views/systemManage/tenantManage/child/detail'),
          meta: { title: '租户详情', icon: '', activeMenu: '/systemManage/tenantManage' }
        },
        {
          path: 'list',
          name: 'tenantList',
          hidden: true,
          component: () => import('@/views/systemManage/tenantManage/child/list.vue'),
          meta: { title: '租户列表', icon: '', activeMenu: '/systemManage/tenantManage', keepAlive: true }
        }
      ]
    },
    {
      path: 'sourceFile',
      component: () => import('@/views/systemManage/sourceFile/index'),
      redirect: '/systemManage/sourceFile/list',
      name: 'sourceFile',
      meta: { title: '文件来源', icon: '', activeMenu: '/systemManage/sourceFile' },
      children: [
        {
          path: 'add',
          component: () => import('@/views/systemManage/sourceFile/child/add.vue'),
          name: 'sourceAdd',
          hidden: true,
          meta: { title: '新增文件来源', icon: '', activeMenu: '/systemManage/sourceFile' }
        },
        {
          path: 'edit',
          name: 'sourceEdit',
          hidden: true,
          component: () => import('@/views/systemManage/sourceFile/child/edit'),
          meta: { title: '修改文件来源', icon: '', activeMenu: '/systemManage/sourceFile' }
        },
        {
          path: 'list',
          name: 'sourceList',
          hidden: true,
          component: () => import('@/views/systemManage/sourceFile/child/list.vue'),
          meta: { title: '文件来源列表', icon: '', activeMenu: '/systemManage/sourceFile', keepAlive: true }
        }
      ]
    },
    {
      path: 'permissionManage',
      component: () => import('@/views/systemManage/permissionManage/index'),
      redirect: '/systemManage/permissionManage/list',
      name: 'permissionFile',
      meta: { title: '权限管理', icon: '', activeMenu: '/systemManage/permissionManage' },
      children: [
        {
          path: 'add',
          component: () => import('@/views/systemManage/permissionManage/child/add.vue'),
          name: 'permissionAdd',
          hidden: true,
          meta: { title: '新增权限', icon: '', activeMenu: '/systemManage/permissionManage' }
        },
        {
          path: 'edit',
          name: 'permissionEdit',
          hidden: true,
          component: () => import('@/views/systemManage/permissionManage/child/edit'),
          meta: { title: '修改权限', icon: '', activeMenu: '/systemManage/permissionManage' }
        },
        {
          path: 'detail',
          name: 'permissionDetail',
          hidden: true,
          component: () => import('@/views/systemManage/permissionManage/child/detail'),
          meta: { title: '权限详情', icon: '', activeMenu: '/systemManage/permissionManage' }
        },
        {
          path: 'list',
          name: 'permissionList',
          hidden: true,
          component: () => import('@/views/systemManage/permissionManage/child/list.vue'),
          meta: { title: '权限管理列表', icon: '', activeMenu: '/systemManage/permissionManage', keepAlive: true }
        }
      ]
    },
    {
      path: 'newsCategory',
      component: () => import('@/views/systemManage/newsCategory/index'),
      redirect: '/systemManage/newsCategory/list',
      name: 'newsCategory',
      meta: { title: '资讯类别', icon: '', activeMenu: '/systemManage/newsCategory' },
      children: [
        {
          path: 'add',
          component: () => import('@/views/systemManage/newsCategory/child/add.vue'),
          name: 'newsCategoryAdd',
          hidden: true,
          meta: { title: '新增资讯类别', icon: '', activeMenu: '/systemManage/newsCategory' }
        },
        {
          path: 'detail',
          name: 'newsCategoryDet',
          hidden: true,
          component: () => import('@/views/systemManage/newsCategory/child/detail'),
          meta: { title: '查看资讯类别', icon: '', activeMenu: '/systemManage/newsCategory' }
        },
        {
          path: 'edit',
          name: 'newsCategoryEdit',
          hidden: true,
          component: () => import('@/views/systemManage/newsCategory/child/edit'),
          meta: { title: '修改资讯类别', icon: '', activeMenu: '/systemManage/newsCategory' }
        },
        {
          path: 'netList',
          name: 'netList',
          hidden: true,
          component: () => import('@/views/systemManage/newsCategory/child/net-list'),
          meta: { title: '网站管理', icon: '', activeMenu: '/systemManage/newsCategory' }
        },
        {
          path: 'list',
          name: 'newsCategoryList',
          hidden: true,
          component: () => import('@/views/systemManage/newsCategory/child/list.vue'),
          meta: { title: '资讯类别列表', icon: '', activeMenu: '/systemManage/newsCategory', keepAlive: true }
        }
      ]
    }
  ]
}

export default systemManage
