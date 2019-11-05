/**
* @Author: JiMei
* @Date: 2019/11/4
* @Description: 系统设置路由表
* @remarks:
*/

import Layout from '@/layout/layout2'

const systemSetting = {
  path: '/systemSetting',
  component: Layout,
  redirect: 'noRedirect',
  name: 'systemSetting',
  meta: {
    title: '系统设置',
    icon: 'iconxitong'
  },
  children: [
    {
      path: 'tenantSetting',
      name: 'tenantSetting',
      component: () => import('@/views/system-setting/tenant-setting/index'),
      redirect: '/systemSetting/tenantSetting/list',
      meta: { title: '个性化设置', icon: '', activeMenu: '/systemSetting/tenantSetting' },
      children: [
        {
          path: 'list',
          name: 'tenantList',
          hidden: true,
          component: () => import('@/views/system-setting/tenant-setting/child/list'),
          meta: { title: '个性化设置', icon: '', activeMenu: '/systemSetting/tenantSetting' }
        }
      ]
    },
  ]
}

export default systemSetting
