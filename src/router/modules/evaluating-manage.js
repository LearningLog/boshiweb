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
      path: 'skillManage',
      component: () => import('@/views/evaluating-manage/skill-manage/index'),
      redirect: '/evaluating-manage/skillManage/list',
      name: 'skillManage',
      meta: { title: '技能管理', icon: '', activeMenu: '/evaluating-manage/skillManage' },
      children: [
        {
          path: 'list',
          name: 'skillList',
          hidden: true,
          component: () => import('@/views/evaluating-manage/skill-manage/child/list'),
          meta: { title: '技能管理列表', icon: '', activeMenu: '/evaluating-manage/skillManage' }
        }
      ]
    },
    {
      path: 'labelManage',
      name: 'labelManage',
      component: () => import('@/views/evaluating-manage/label-manage/index'),
      redirect: '/evaluating-manage/labelManage/list',
      meta: { title: '标签管理', icon: '', activeMenu: '/evaluating-manage/labelManage' },
      children: [
        {
          path: 'list',
          name: 'labelList',
          hidden: true,
          component: () => import('@/views/evaluating-manage/skill-manage/child/list'),
          meta: { title: '标签列表', icon: '', activeMenu: '/evaluating-manage/labelManage' }
        }
      ]
    }
  ]
}

export default evaluatingManage
