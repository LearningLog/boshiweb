/**
* @Author: YanHuaKang
* @Date: 2019/11/19
* @Description: 课堂详情
* @remarks:
*/

const client = {
  path: '/client',
  component: () => import('@/views/client/index'),
  hidden: true,
  redirect: 'noRedirect',
  name: 'client',
  meta: {
    title: '课堂详情',
    icon: ''
  },
  children: [
    {
      path: 'teacher-live-demand',
      name: 'teacher-live-demand',
      component: () => import('@/views/client/teacher-live-demand'),
      meta: { title: '课堂详情', icon: '' }
    },
    {
      path: 'teacher-thematic',
      name: 'teacher-thematic',
      component: () => import('@/views/client/teacher-thematic'),
      meta: { title: '课堂详情', icon: '' }
    },
    {
      path: 'student-live-demand',
      name: 'student-live-demand',
      component: () => import('@/views/client/student-live-demand'),
      meta: { title: '课堂详情', icon: '' }
    },
    {
      path: 'student-thematic',
      name: 'student-thematic',
      component: () => import('@/views/client/student-thematic'),
      meta: { title: '课堂详情', icon: '' }
    }
  ]
}

export default client
