/**
* @Author: JiMei
* @Date: 2019/11/4
* @Description: 系统设置路由表
* @remarks:
*/

import Layout from '@/layout/layout2'

const systemSetting = {
  path: '/system-setting',
  component: Layout,
  redirect: 'noRedirect',
  name: 'systemSetting',
  meta: {
    title: '系统设置',
    icon: 'iconxitong'
  },
  children: [
    {
      path: 'tenant-setting',
      name: 'tenant-setting',
      component: () => import('@/views/system-setting/tenant-setting/index'),
      redirect: '/system-setting/tenant-setting/list',
      meta: { title: '个性化设置', icon: '', activeMenu: '/system-setting/tenant-setting' },
      children: [
        {
          path: 'list',
          name: 'tenant-list',
          hidden: true,
          component: () => import('@/views/system-setting/tenant-setting/child/list'),
          meta: { title: '个性化设置', icon: '', activeMenu: '/system-setting/tenant-setting' }
        }
      ]
    }
  ]
}

export default systemSetting
