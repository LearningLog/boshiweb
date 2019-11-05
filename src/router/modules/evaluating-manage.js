/**
* @Author: JiMei
* @Date: 2019/11/4
* @Description: 评测管理路由表
* @remarks:
*/

import Layout from '@/layout/layout2'

const evaluatingManage = {
  path: '/evaluatingManage',
  component: Layout,
  redirect: 'noRedirect',
  name: 'evaluatingManage',
  meta: {
    title: '评测管理',
    icon: 'iconshouquan'
  },
  children: [
    {
      path: 'skillManage',
      component: () => import('@/views/evaluating-manage/skill-manage/index'),
      redirect: '/evaluatingManage/skillManage/list',
      name: 'skillManage',
      meta: { title: '技能管理', icon: '', activeMenu: '/evaluatingManage/skillManage' },
      children: [
        {
          path: 'list',
          name: 'skillList',
          hidden: true,
          component: () => import('@/views/evaluating-manage/skill-manage/child/list'),
          meta: { title: '技能管理列表', icon: '', activeMenu: '/evaluatingManage/skillManage' }
        }
      ]
    },
    {
      path: 'labelManage',
      name: 'labelManage',
      component: () => import('@/views/evaluating-manage/label-manage/index'),
      redirect: '/evaluatingManage/labelManage/list',
      meta: { title: '标签管理', icon: '', activeMenu: '/evaluatingManage/labelManage' },
      children: [
        {
          path: 'list',
          name: 'labelList',
          hidden: true,
          component: () => import('@/views/evaluating-manage/skill-manage/child/list'),
          meta: { title: '标签列表', icon: '', activeMenu: '/evaluatingManage/labelManage' }
        }
      ]
    },
  ]
}

export default evaluatingManage
