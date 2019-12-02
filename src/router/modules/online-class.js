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
    icon: 'iconzaixianketang'
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
          path: 'evaluate',
          name: 'live-telecast-evaluate',
          hidden: true,
          component: () =>
                  import('@/views/online-class/live-telecast-manage/child/evaluate'),
          meta: {
            title: '课堂评价',
            icon: '',
            activeMenu: '/online-class/live-telecast-manage'
          }
        }
      ]
    },
    {
      path: 'on-demand',
      name: 'on-demand',
      component: () =>
        import('@/views/online-class/on-demand/index'),
      redirect: '/online-class/on-demand/list',
      meta: {
        title: '点播课堂',
        icon: '',
        activeMenu: '/online-class/on-demand'
      },
      children: [
        {
          path: 'list',
          name: 'on-demand-list',
          hidden: true,
          component: () =>
            import('@/views/online-class/on-demand/child/list'),
          meta: {
            title: '课堂列表',
            icon: '',
            activeMenu: '/online-class/on-demand'
          }
        },
        {
          path: 'add',
          name: 'on-demand-add',
          hidden: true,
          component: () =>
            import('@/views/online-class/on-demand/child/add'),
          meta: {
            title: '新增课堂',
            icon: '',
            activeMenu: '/online-class/on-demand'
          }
        },
        {
          path: 'edit',
          name: 'on-demand-edit',
          hidden: true,
          component: () =>
            import('@/views/online-class/on-demand/child/edit'),
          meta: {
            title: '修改课堂',
            icon: '',
            activeMenu: '/online-class/on-demand'
          }
        },
        {
          path: 'evaluate',
          name: 'on-demand-evaluate',
          hidden: true,
          component: () =>
                  import('@/views/online-class/on-demand/child/evaluate'),
          meta: {
            title: '课堂评论',
            icon: '',
            activeMenu: '/online-class/on-demand'
          }
        }
      ]
    },
    {
      path: 'thematic-class',
      name: 'thematic-class',
      component: () =>
        import('@/views/online-class/thematic-class/index'),
      redirect: '/online-class/thematic-class/list',
      meta: {
        title: '专题课程',
        icon: '',
        activeMenu: '/online-class/thematic-class'
      },
      children: [
        {
          path: 'list',
          name: 'thematic-class-list',
          hidden: true,
          component: () =>
            import('@/views/online-class/thematic-class/child/list'),
          meta: {
            title: '专题列表',
            icon: '',
            activeMenu: '/online-class/thematic-class'
          }
        },
        {
          path: 'thematic-manage',
          name: 'thematic-manage',
          hidden: true,
          component: () =>
            import('@/views/online-class/thematic-class/child/thematic-manage'),
          meta: {
            title: '课堂管理',
            icon: '',
            activeMenu: '/online-class/thematic-class'
          }
        },
        {
          path: 'add',
          name: 'thematic-class-add',
          hidden: true,
          component: () =>
            import('@/views/online-class/thematic-class/child/add'),
          meta: {
            title: '新增专题',
            icon: '',
            activeMenu: '/online-class/thematic-class'
          }
        },
        {
          path: 'edit',
          name: 'thematic-class-edit',
          hidden: true,
          component: () =>
            import('@/views/online-class/thematic-class/child/edit'),
          meta: {
            title: '修改专题',
            icon: '',
            activeMenu: '/online-class/thematic-class'
          }
        },
        {
          path: 'evaluate',
          name: 'thematic-class-evaluate',
          hidden: true,
          component: () =>
                  import('@/views/online-class/thematic-class/child/evaluate'),
          meta: {
            title: '专题评价',
            icon: '',
            activeMenu: '/online-class/thematic-class'
          }
        },
        {
          path: 'live-telecast-add',
          name: 'thematic-live-telecast-add',
          hidden: true,
          component: () =>
            import('@/views/online-class/thematic-class/child/live-telecast-add'),
          meta: {
            title: '新增直播课堂',
            icon: '',
            activeMenu: '/online-class/thematic-class'
          }
        },
        {
          path: 'live-telecast-edit',
          name: 'thematic-live-telecast-edit',
          hidden: true,
          component: () =>
            import('@/views/online-class/thematic-class/child/live-telecast-edit'),
          meta: {
            title: '新增直播课堂',
            icon: '',
            activeMenu: '/online-class/thematic-class'
          }
        },
        {
          path: 'on-demand-add',
          name: 'thematic-on-demand-add',
          hidden: true,
          component: () =>
            import('@/views/online-class/thematic-class/child/on-demand-add'),
          meta: {
            title: '修改点播课堂',
            icon: '',
            activeMenu: '/online-class/thematic-class'
          }
        },
        {
          path: 'on-demand-edit',
          name: 'thematic-on-demand-edit',
          hidden: true,
          component: () =>
            import('@/views/online-class/thematic-class/child/on-demand-edit'),
          meta: {
            title: '修改点播课堂',
            icon: '',
            activeMenu: '/online-class/thematic-class'
          }
        },
        {
          path: 'select-lesson',
          name: 'select-lesson',
          hidden: true,
          component: () => import('@/views/online-class/thematic-class/child/select-lesson'),
          meta: {
            title: '选择课堂',
            icon: '',
            activeMenu: '/online-class/thematic-class'
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
        title: '课堂标签',
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
