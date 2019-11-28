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
          name: 'companylist',
          hidden: true,
          component: () => import('@/views/knowledge-base/company-base/child/list.vue'),
          meta: { title: '企业知识库列表', icon: '', activeMenu: '/knowledge-base/company-base' }
        }
      ]
    },
    {
      path: 'group-base',
      component: () => import('@/views/knowledge-base/group-base/index'),
      redirect: '/knowledge-base/group-base/list',
      name: 'group-base',
      meta: { title: '分组知识库', icon: '', activeMenu: '/knowledge-base/group-base' },
      children: [
        {
          path: 'list',
          name: 'grouplist',
          hidden: true,
          component: () => import('@/views/knowledge-base/group-base/child/list.vue'),
          meta: { title: '分组知识库列表', icon: '', activeMenu: '/knowledge-base/group-base' }
        }
      ]
    }
  ]
}

export default knowledgeBase
