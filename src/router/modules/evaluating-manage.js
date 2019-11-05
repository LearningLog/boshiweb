/**
* @Author: JiMei
* @Date: 2019/11/4
* @Description: 评测管理路由表
* @remarks:
*/

import Layout from '@/layout/layout2'

const evaluatingManage = {
  path: '/evaluating-manage',
  component: Layout,
  redirect: 'noRedirect',
  name: 'evaluating-manage',
  meta: {
    title: '评测管理',
    icon: 'iconshouquan'
  },
  children: [
    {
      path: 'question-bank-manage',
      name: 'question-bank-manage',
      component: () => import('@/views/evaluating-manage/question-bank-manage/index'),
      redirect: '/evaluating-manage/question-bank-manage/list',
      meta: { title: '题库管理', icon: '', activeMenu: '/evaluating-manage/question-bank-manage' },
      children: [
        {
          path: 'list',
          name: 'question-bank-list',
          hidden: true,
          component: () => import('@/views/evaluating-manage/question-bank-manage/child/list.vue'),
          meta: { title: '题库列表', icon: '', activeMenu: '/evaluating-manage/question-bank-manage' }
        },
        {
          path: 'add',
          component: () => import('@/views/evaluating-manage/question-bank-manage/child/add.vue'),
          name: 'question-bank-add',
          hidden: true,
          meta: { title: '新增试题', icon: '', activeMenu: '/evaluating-manage/question-bank-manage' }
        },
        {
          path: 'edit',
          name: 'question-bank-edit',
          hidden: true,
          component: () => import('@/views/evaluating-manage/question-bank-manage/child/edit'),
          meta: { title: '修改试题', icon: '', activeMenu: '/evaluating-manage/question-bank-manage' }
        },
        {
          path: 'detail',
          name: 'question-bank-detail',
          hidden: true,
          component: () => import('@/views/evaluating-manage/question-bank-manage/child/detail'),
          meta: { title: '试题详情', icon: '', activeMenu: '/evaluating-manage/question-bank-manage' }
        }
      ]
    },
    {
      path: 'skill-manage',
      component: () => import('@/views/evaluating-manage/skill-manage/index'),
      redirect: '/evaluating-manage/skill-manage/list',
      name: 'skill-manage',
      meta: { title: '技能管理', icon: '', activeMenu: '/evaluating-manage/skill-manage' },
      children: [
        {
          path: 'list',
          name: 'skillList',
          hidden: true,
          component: () => import('@/views/evaluating-manage/skill-manage/child/list'),
          meta: { title: '技能管理列表', icon: '', activeMenu: '/evaluating-manage/skill-manage' }
        }
      ]
    },
    {
      path: 'label-manage',
      name: 'label-manage',
      component: () => import('@/views/evaluating-manage/label-manage/index'),
      redirect: '/evaluating-manage/label-manage/list',
      meta: { title: '标签管理', icon: '', activeMenu: '/evaluating-manage/label-manage' },
      children: [
        {
          path: 'add',
          name: 'label-add',
          hidden: true,
          component: () => import('@/views/evaluating-manage/label-manage/child/add'),
          meta: { title: '新增标签', icon: '', activeMenu: '/evaluating-manage/label-manage' }
        },
        {
          path: 'edit',
          name: 'label-edit',
          hidden: true,
          component: () => import('@/views/evaluating-manage/label-manage/child/edit'),
          meta: { title: '修改标签', icon: '', activeMenu: '/evaluating-manage/label-manage' }
        },
        {
          path: 'detail',
          name: 'label-detail',
          hidden: true,
          component: () => import('@/views/evaluating-manage/label-manage/child/detail'),
          meta: { title: '标签详情', icon: '', activeMenu: '/evaluating-manage/label-manage' }
        },
        {
          path: 'list',
          name: 'label-list',
          hidden: true,
          component: () => import('@/views/evaluating-manage/label-manage/child/list'),
          meta: { title: '标签列表', icon: '', activeMenu: '/evaluating-manage/label-manage' }
        },
      ]
    }
  ]
}

export default evaluatingManage
