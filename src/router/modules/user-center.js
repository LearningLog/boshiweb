/**
* @Author: LiuYouyu
* @Date: 2019/11/01
* @Description: 用户中心路由表
* @remarks:
*/

import Layout from '@/layout/layout2'

const userCenter = {
  path: '/user-center',
  component: Layout,
  redirect: 'noRedirect',
  name: 'user-center',
  meta: {
    title: '用户中心',
    icon: 'iconxitong'
  },
  children: [
    {
      path: 'user-manage',
      component: () => import('@/views/user-center/user-manage/index'),
      redirect: '/user-center/user-manage/list',
      name: 'user-manage',
      meta: { title: '用户管理', icon: '', activeMenu: '/user-center/user-manage' },
      children: [
        {
          path: 'list',
          name: 'user-list',
          hidden: true,
          component: () => import('@/views/user-center/user-manage/child/list.vue'),
          meta: { title: '用户列表', icon: '', activeMenu: '/user-center/user-manage' }
        },
        {
          path: 'add',
          component: () => import('@/views/user-center/user-manage/child/add.vue'),
          name: 'user-add',
          hidden: true,
          meta: { title: '新增用户', icon: '', activeMenu: '/user-center/user-manage' }
        },
        {
          path: 'edit',
          name: 'user-eait',
          hidden: true,
          component: () => import('@/views/user-center/user-manage/child/edit'),
          meta: { title: '修改用户', icon: '', activeMenu: '/user-center/user-manage' }
        },
        {
          path: 'detail',
          name: 'user-detail',
          hidden: true,
          component: () => import('@/views/user-center/user-manage/child/detail'),
          meta: { title: '用户详情', icon: '', activeMenu: '/user-center/user-manage' }
        }
      ]
    },
    {
      path: 'skill-manager',
      component: () => import('@/views/user-center/skill-manager/index'),
      redirect: '/user-center/skill-manager/list',
      name: 'skill-manager',
      meta: { title: '技能管理', icon: '', activeMenu: '/user-center/skill-manager' },
      children: [
        {
          path: 'list',
          name: 'roleList',
          hidden: true,
          component: () => import('@/views/user-center/skill-manager/child/list.vue'),
          meta: { title: '技能管理列表', icon: '', activeMenu: '/user-center/skill-manager' }
        },
        {
          path: 'edit',
          name: 'roleEdit',
          hidden: true,
          component: () => import('@/views/user-center/skill-manager/child/edit'),
          meta: { title: '修改技能', icon: '', activeMenu: '/user-center/skill-manager' }
        },
        {
          path: 'add',
          component: () => import('@/views/user-center/skill-manager/child/add.vue'),
          name: 'roleAdd',
          hidden: true,
          meta: { title: '新增技能', icon: '', activeMenu: '/user-center/skill-manager' }
        },

        {
          path: 'detail',
          name: 'roleDetail',
          hidden: true,
          component: () => import('@/views/user-center/skill-manager/child/detail'),
          meta: { title: '技能详情', icon: '', activeMenu: '/user-center/skill-manager' }
        }

      ]
    },
    {
      path: 'group-manage',
      component: () => import('@/views/user-center/group-manage/index'),
      redirect: '/user-center/group-manage/list',
      name: 'group-manage',
      meta: { title: '分组管理', icon: '', activeMenu: '/user-center/group-manage' },
      children: [
        {
          path: 'list',
          name: 'roleList',
          hidden: true,
          component: () => import('@/views/user-center/group-manage/child/list.vue'),
          meta: { title: '分组管理列表', icon: '', activeMenu: '/user-center/group-manage' }
        },
        {
          path: 'edit',
          name: 'roleEdit',
          hidden: true,
          component: () => import('@/views/user-center/group-manage/child/edit'),
          meta: { title: '修改分组', icon: '', activeMenu: '/user-center/group-manage' }
        },
        {
          path: 'add',
          component: () => import('@/views/user-center/group-manage/child/add.vue'),
          name: 'roleAdd',
          hidden: true,
          meta: { title: '新增分组', icon: '', activeMenu: '/user-center/group-manage' }
        },

        {
          path: 'detail',
          name: 'roleDetail',
          hidden: true,
          component: () => import('@/views/user-center/group-manage/child/detail'),
          meta: { title: '分组详情', icon: '', activeMenu: '/user-center/group-manage' }
        }

      ]
    }
  ]
}

export default userCenter
