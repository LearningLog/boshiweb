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
      meta: { title: '个性化设置', icon: '', activeMenu: '/system-setting/tenant-setting' }
    },
    {
      path: 'knowledge-classification',
      name: 'knowledge-classification',
      component: () => import('@/views/system-setting/knowledge-classification/index'),
      meta: { title: '知识分类', icon: '', activeMenu: '/system-setting/knowledge-classification' }
    }
  ]
}

export default systemSetting
