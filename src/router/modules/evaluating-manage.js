/**
* @Author: JiMei
* @Date: 2019/11/4
* @Description: 评测管理路由表
* @remarks:
*/

import Layout from '@/layout/layout2'

const evaludatingManage = {
  path: '/evaludatingManage',
  component: Layout,
  redirect: 'noRedirect',
  name: 'evaludatingManage',
  meta: {
    title: '评测管理',
    icon: 'iconshouquan'
  },
  children: [
    {
      path: 'skillManage',
      component: () => import('@/views/evaludatingManage/skillManage/index'),
      redirect: '/evaludatingManage/skillManage/list',
      name: 'skillManage',
      meta: { title: '技能管理', icon: '', activeMenu: '/evaludatingManage/skillManage' },
      children: [
        {
          path: 'list',
          name: 'skillList',
          hidden: true,
          component: () => import('@/views/evaludatingManage/skillManage/child/list.vue'),
          meta: { title: '技能管理列表', icon: '', activeMenu: '/evaludatingManage/skillManage' }
        }
      ]
    }
  ]
}

export default evaludatingManage
