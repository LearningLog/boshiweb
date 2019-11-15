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
      path: 'live-telecast-manage',
      name: 'live-telecast-manage',
      component: () =>
        import('@/views/online-class/live-telecast-manage/index'),
      redirect: '/online-class/live-telecast-manage/list',
      meta: {
        title: '直播课堂',
        icon: '',
        activeMenu: '/online-class/live-telecast-manage'
      },
      children: [
        {
          path: 'list',
          name: 'live-telecast-list',
          hidden: true,
          component: () =>
            import('@/views/online-class/live-telecast-manage/child/list'),
          meta: {
            title: '课堂列表',
            icon: '',
            activeMenu: '/online-class/live-telecast-manage'
          }
        },
        {
          path: 'add',
          name: 'live-telecast-add',
          hidden: true,
          component: () =>
            import('@/views/online-class/live-telecast-manage/child/add'),
          meta: {
            title: '新增课堂',
            icon: '',
            activeMenu: '/online-class/live-telecast-manage'
          }
        },
        {
          path: 'edit',
          name: 'live-telecast-edit',
          hidden: true,
          component: () =>
            import('@/views/online-class/live-telecast-manage/child/edit'),
          meta: {
            title: '修改课堂',
            icon: '',
            activeMenu: '/online-class/live-telecast-manage'
          }
        },
        {
          path: 'detail',
          name: 'live-telecast-detail',
          hidden: true,
          component: () =>
            import('@/views/online-class/live-telecast-manage/child/detail'),
          meta: {
            title: '课堂详情',
            icon: '',
            activeMenu: '/online-class/live-telecast-manage'
          }
        }
      ]
    },
    {
      path: 'label-manage',
      name: 'online-class-label-manage',
      component: () => import('@/views/online-class/label-manage/index'),
      redirect: '/online-class/label-manage/list',
      meta: {
        title: '标签管理',
        icon: '',
        activeMenu: '/online-class/label-manage'
      },
      children: [
        {
          path: 'list',
          name: 'online-class-label-list',
          hidden: true,
          component: () =>
            import('@/views/online-class/label-manage/child/list'),
          meta: {
            title: '标签列表',
            icon: '',
            activeMenu: '/online-class/label-manage'
          }
        },
        {
          path: 'add',
          name: 'online-class-label-add',
          hidden: true,
          component: () =>
            import('@/views/online-class/label-manage/child/add'),
          meta: {
            title: '新增标签',
            icon: '',
            activeMenu: '/online-class/label-manage'
          }
        },
        {
          path: 'edit',
          name: 'online-class-label-edit',
          hidden: true,
          component: () =>
            import('@/views/online-class/label-manage/child/edit'),
          meta: {
            title: '修改标签',
            icon: '',
            activeMenu: '/online-class/label-manage'
          }
        },
        {
          path: 'detail',
          name: 'online-class-label-detail',
          hidden: true,
          component: () =>
            import('@/views/online-class/label-manage/child/detail'),
          meta: {
            title: '标签详情',
            icon: '',
            activeMenu: '/online-class/label-manage'
          }
        }
      ]
    }
  ]
}

export default onlineClass
