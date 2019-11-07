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
      path: 'chapter-manage',
      name: 'chapter-manage',
      component: () => import('@/views/online-class/chapter-manage/index'),
      redirect: '/online-class/chapter-manage/list',
      meta: { title: '标签管理', icon: '', activeMenu: '/online-class/chapter-manage' },
      children: [
        {
          path: 'add',
          name: 'chapter-add',
          hidden: true,
          component: () => import('@/views/online-class/chapter-manage/child/add'),
          meta: { title: '新增标签', icon: '', activeMenu: '/online-class/chapter-manage' }
        },
        {
          path: 'edit',
          name: 'chapter-edit',
          hidden: true,
          component: () => import('@/views/online-class/chapter-manage/child/edit'),
          meta: { title: '修改标签', icon: '', activeMenu: '/online-class/chapter-manage' }
        },
        {
          path: 'detail',
          name: 'chapter-detail',
          hidden: true,
          component: () => import('@/views/online-class/chapter-manage/child/detail'),
          meta: { title: '标签详情', icon: '', activeMenu: '/online-class/chapter-manage' }
        },
        {
          path: 'list',
          name: 'chapter-list',
          hidden: true,
          component: () => import('@/views/online-class/chapter-manage/child/list'),
          meta: { title: '标签列表', icon: '', activeMenu: '/online-class/chapter-manage' }
        }
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
        }
      ]
    }
  ]
}

export default onlineClass
