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
    }
  ]
}

export default userCenter
