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
    icon: 'iconpingceguanli'
  },
  children: [
    {
      path: 'question-bank-manage',
      name: 'question-bank-manage-list',
      component: () => import('@/views/evaluating-manage/question-bank-manage/index'),
      redirect: '/evaluating-manage/question-bank-manage/list',
      meta: { title: '题库管理', icon: '', activeMenu: '/evaluating-manage/question-bank-manage' },
      children: [
        {
          path: 'list',
          name: 'question-bank-list',
          hidden: true,
          component: () => import('@/views/evaluating-manage/question-bank-manage/child/list.vue'),
          meta: { title: '题库列表', icon: '', activeMenu: '/evaluating-manage/question-bank-manage', keepAlive: true }
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
      path: 'test-paper-manage',
      name: 'test-paper-manage',
      component: () => import('@/views/evaluating-manage/test-paper-manage/index'),
      redirect: '/evaluating-manage/test-paper-manage/list',
      meta: { title: '试卷管理', icon: '', activeMenu: '/evaluating-manage/test-paper-manage' },
      children: [
        {
          path: 'detail',
          name: 'test-paper-detail',
          hidden: true,
          component: () => import('@/views/evaluating-manage/test-paper-manage/child/detail'),
          meta: { title: '试卷详情', icon: '', activeMenu: '/evaluating-manage/test-paper-manage' }
        },
        {
          path: 'list',
          name: 'test-paper-list',
          hidden: true,
          component: () => import('@/views/evaluating-manage/test-paper-manage/child/list.vue'),
          meta: { title: '试卷列表', icon: '', activeMenu: '/evaluating-manage/test-paper-manage', keepAlive: true }
        },
        {
          path: 'intelligent-add',
          component: () => import('@/views/evaluating-manage/test-paper-manage/child/intelligent-add.vue'),
          name: 'intelligent-add',
          hidden: true,
          meta: { title: '智能添加', icon: '', activeMenu: '/evaluating-manage/test-paper-manage' }
        },
        {
          path: 'paper-question-bank-add',
          component: () => import('@/views/evaluating-manage/test-paper-manage/child/question-bank-add.vue'),
          name: 'paper-question-bank-add',
          hidden: true,
          meta: { title: '题库中添加', icon: '', activeMenu: '/evaluating-manage/test-paper-manage' }
        },
        {
          path: 'add',
          component: () => import('@/views/evaluating-manage/test-paper-manage/child/add.vue'),
          name: 'test-paper-add',
          hidden: true,
          meta: { title: '新增试卷', icon: '', activeMenu: '/evaluating-manage/test-paper-manage' }
        },
        {
          path: 'edit',
          name: 'test-paper-edit',
          hidden: true,
          component: () => import('@/views/evaluating-manage/test-paper-manage/child/edit'),
          meta: { title: '修改试卷', icon: '', activeMenu: '/evaluating-manage/test-paper-manage' }
        }
      ]
    },
    {
      path: 'examination-manage',
      name: 'examination-manage',
      component: () => import('@/views/evaluating-manage/examination-manage/index'),
      redirect: '/evaluating-manage/examination-manage/list',
      meta: { title: '考试管理', icon: '', activeMenu: '/evaluating-manage/examination-manage' },
      children: [
        {
          path: 'list',
          name: 'examination-list',
          hidden: true,
          component: () => import('@/views/evaluating-manage/examination-manage/child/list.vue'),
          meta: { title: '考试列表', icon: '', activeMenu: '/evaluating-manage/examination-manage', keepAlive: true }
        },
        {
          path: 'detail',
          name: 'examination-detail',
          hidden: true,
          component: () => import('@/views/evaluating-manage/examination-manage/child/detail'),
          meta: { title: '考试统计', icon: '', activeMenu: '/evaluating-manage/examination-manage' }
        },
        {
          path: 'add',
          component: () => import('@/views/evaluating-manage/examination-manage/child/add.vue'),
          name: 'examination-add',
          hidden: true,
          meta: { title: '新增考试', icon: '', activeMenu: '/evaluating-manage/examination-manage' }
        },
        {
          path: 'select-exam-paper',
          component: () => import('@/views/evaluating-manage/examination-manage/child/select-exam-paper.vue'),
          name: 'select-exam-paper',
          hidden: true,
          meta: { title: '选择试卷', icon: '', activeMenu: '/evaluating-manage/examination-manage' }
        },
        {
          path: 'question-bank-add',
          component: () => import('@/views/evaluating-manage/examination-manage/child/question-bank-add.vue'),
          name: 'exam-question-bank-add',
          hidden: true,
          meta: { title: '题库中添加', icon: '', activeMenu: '/evaluating-manage/examination-manage' }
        }
      ]
    },
    {
      path: 'automatic-release-manage',
      name: 'automatic-release-manage',
      component: () => import('@/views/evaluating-manage/automatic-release-manage/index'),
      redirect: '/evaluating-manage/automatic-release-manage/list',
      meta: { title: '自动发布管理', icon: '', activeMenu: '/evaluating-manage/automatic-release-manage' },
      children: [
        {
          path: 'list',
          name: 'automatic-release-list',
          hidden: true,
          component: () => import('@/views/evaluating-manage/automatic-release-manage/child/list.vue'),
          meta: { title: '自动发布列表', icon: '', activeMenu: '/evaluating-manage/automatic-release-manage', keepAlive: true }
        },
        {
          path: 'add',
          component: () => import('@/views/evaluating-manage/automatic-release-manage/child/add.vue'),
          name: 'automatic-release-add',
          hidden: true,
          meta: { title: '新增发布', icon: '', activeMenu: '/evaluating-manage/automatic-release-manage' }
        },
        {
          path: 'edit',
          name: 'automatic-release-edit',
          hidden: true,
          component: () => import('@/views/evaluating-manage/automatic-release-manage/child/edit'),
          meta: { title: '修改考试', icon: '', activeMenu: '/evaluating-manage/automatic-release-manage' }
        },
        {
          path: 'detail',
          name: 'automatic-release-detail',
          hidden: true,
          component: () => import('@/views/evaluating-manage/automatic-release-manage/child/detail'),
          meta: { title: '已发布考试', icon: '', activeMenu: '/evaluating-manage/automatic-release-manage' }
        },
        {
          path: 'statistics',
          name: 'automatic-release-statistics',
          hidden: true,
          component: () => import('@/views/evaluating-manage/automatic-release-manage/child/statistics'),
          meta: { title: '考试统计', icon: '', activeMenu: '/evaluating-manage/automatic-release-manage' }
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
          meta: { title: '技能管理列表', icon: '', activeMenu: '/evaluating-manage/skill-manage', keepAlive: true }
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
        }
      ]
    }
  ]
}

export default evaluatingManage
