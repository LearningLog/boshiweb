/**
* @Author: JiMei
* @Date: 2019/11/5
* @Description: 在线路由表
* @remarks:
*/

import Layout from '@/layout/layout2'

const onlineClass = {
  path: '/online-class',
  component: Layout,
  redirect: 'noRedirect',
  name: 'online-class',
  meta: {
    title: '在线课堂',
    icon: 'iconboshizhishiguanliicon'
  },
  children: [
    {
      path: 'label-manage',
      name: 'label-manage',
      component: () => import('@/views/online-class/label-manage/index'),
      redirect: '/online-class/label-manage/list',
      meta: { title: '标签管理', icon: '', activeMenu: '/online-class/label-manage' },
      children: [
        {
          path: 'add',
          name: 'label-add',
          hidden: true,
          component: () => import('@/views/online-class/label-manage/child/add'),
          meta: { title: '新增标签', icon: '', activeMenu: '/online-class/label-manage' }
        },
        {
          path: 'edit',
          name: 'label-edit',
          hidden: true,
          component: () => import('@/views/online-class/label-manage/child/edit'),
          meta: { title: '修改标签', icon: '', activeMenu: '/online-class/label-manage' }
        },
        {
          path: 'detail',
          name: 'label-detail',
          hidden: true,
          component: () => import('@/views/online-class/label-manage/child/detail'),
          meta: { title: '标签详情', icon: '', activeMenu: '/online-class/label-manage' }
        },
        {
          path: 'list',
          name: 'label-list',
          hidden: true,
          component: () => import('@/views/online-class/label-manage/child/list'),
          meta: { title: '标签列表', icon: '', activeMenu: '/online-class/label-manage' }
        },
      ]
    },
    {
      path: 'direct-manage',
      name: 'direct-manage',
      component: () => import('@/views/online-class/direct-manage/index'),
      redirect: '/online-class/direct-manage/list',
      meta: { title: '直播课堂', icon: '', activeMenu: '/online-class/direct-manage' },
      children: [
        {
          path: 'add',
          name: 'direct-add',
          hidden: true,
          component: () => import('@/views/online-class/direct-manage/child/add'),
          meta: { title: '新增课堂', icon: '', activeMenu: '/online-class/direct-manage' }
        },
        {
          path: 'edit',
          name: 'direct-edit',
          hidden: true,
          component: () => import('@/views/online-class/direct-manage/child/edit'),
          meta: { title: '修改课堂', icon: '', activeMenu: '/online-class/direct-manage' }
        },
        {
          path: 'detail',
          name: 'direct-detail',
          hidden: true,
          component: () => import('@/views/online-class/direct-manage/child/detail'),
          meta: { title: '课堂详情', icon: '', activeMenu: '/online-class/direct-manage' }
        },
        {
          path: 'list',
          name: 'direct-list',
          hidden: true,
          component: () => import('@/views/online-class/direct-manage/child/list'),
          meta: { title: '课堂列表', icon: '', activeMenu: '/online-class/direct-manage' }
        },
      ]
    }
  ]
}

export default onlineClass
