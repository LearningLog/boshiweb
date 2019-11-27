/**
* @Author: LiuYouyu
* @Date: 2019/11/01
* @Description: 用户中心路由表
* @remarks:
*/

import Layout from '@/layout/layout2'

const knowledgeBase = {
  path: '/knowledge-base',
  component: Layout,
  redirect: 'noRedirect',
  name: 'knowledge-base',
  meta: {
    title: '知识库',
    icon: 'iconxitongshezhi'
  },
  children: [
    {
      path: 'company-base',
      component: () => import('@/views/knowledge-base/user-manage/index'),
      redirect: '/knowledge-base/company-base/list',
      name: 'company-base',
      meta: { title: '企业知识库', icon: '', activeMenu: '/knowledge-base/user-manage' },
      children: [
        {
          path: 'list',
          name: 'skilllist',
          hidden: true,
          component: () => import('@/views/knowledge-base/skill-manager/child/list.vue'),
          meta: { title: '技能管理列表', icon: '', activeMenu: '/knowledge-base/skill-manager' }
        },
        {
          path: 'edit',
          name: 'skilledit',
          hidden: true,
          component: () => import('@/views/knowledge-base/skill-manager/child/edit'),
          meta: { title: '修改技能', icon: '', activeMenu: '/knowledge-base/skill-manager' }
        },
        {
          path: 'add',
          component: () => import('@/views/knowledge-base/skill-manager/child/add.vue'),
          name: 'skilladd',
          hidden: true,
          meta: { title: '新增技能', icon: '', activeMenu: '/knowledge-base/skill-manager' }
        },

        {
          path: 'detail',
          name: 'skilldetail',
          hidden: true,
          component: () => import('@/views/knowledge-base/skill-manager/child/detail'),
          meta: { title: '技能详情', icon: '', activeMenu: '/knowledge-base/skill-manager' }
        }

      ]
    },
    {
      path: 'group-base',
      component: () => import('@/views/knowledge-base/skill-manager/index'),
      redirect: '/knowledge-base/group-base/list',
      name: 'group-base',
      meta: { title: '分组知识库', icon: '', activeMenu: '/knowledge-base/skill-manager' },
      children: [
        {
          path: 'list',
          name: 'skilllist',
          hidden: true,
          component: () => import('@/views/knowledge-base/skill-manager/child/list.vue'),
          meta: { title: '分组知识库列表', icon: '', activeMenu: '/knowledge-base/skill-manager' }
        }
      ]
    }
  ]
}

export default knowledgeBase
