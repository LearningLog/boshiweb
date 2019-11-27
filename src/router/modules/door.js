/**
 * @Author: YanHuaKang
 * @Date: 2019/11/19
 * @Description: 门户
 * @remarks:
 */

import Layout from '@/layout/layout1'
const door = {
  path: '/',
  component: Layout,
  hidden: true,
  redirect: '/',
  name: 'home',
  children: [{
    path: '/',
    name: '主页',
    component: () => import('@/views/door/index'),
    meta: { title: '主页' }
  },
  {
    path: 'exam',
    name: 'exam',
    component: () => import('@/views/door/exam'),
    meta: { title: '小测试' }
  },
  {
    path: 'exam-detail',
    name: 'exam-detail',
    component: () => import('@/views/door/exam-detail'),
    meta: { title: '考试结果' }
  }
  ]
}

export default door
