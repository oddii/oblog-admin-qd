import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('@/views/login/index')
  },
  {
    path: '/admin',
    component: () => import('@/layout/index'),
    redirect: '/index',
    children: [
      {
        path: '/index',
        component: () => import('@/views/index/index'),
        meta: { title: '首页', icon: 'el-icon-s-platform' }
      },
      {
        path: '/blog',
        component: () => import('@/views/blog/index'),
        redirect: '/blog/list',
        meta: { title: '博文管理', icon: 'el-icon-s-shop' },
        children: [
          {
            path: '/blog/list',
            component: () => import('@/views/blog/components/list'),
            meta: { title: '博文列表', icon: 'el-icon-s-order' }
          },
          {
            path: '/blog/edit/:id',
            component: () => import('@/views/blog/components/edit'),
            meta: { title: '发布/编辑', icon: 'el-icon-s-open' }
          }
        ]
      },
      {
        path: '/types',
        component: () => import('@/views/types/index'),
        redirect: '/type/list',
        meta: { title: '分类/标签', icon: 'el-icon-s-flag' },
        children: [
          {
            path: '/type/list',
            component: () => import('@/views/types/components/type'),
            meta: { title: '分类列表', icon: 'el-icon-s-ticket' }
          },
          {
            path: '/tag/list',
            component: () => import('@/views/types/components/tag'),
            meta: { title: '标签列表', icon: 'el-icon-s-check' }
          }
        ]
      },
      {
        path: '/comments',
        component: () => import('@/views/comments/index'),
        redirect: '/comment/list',
        meta: { title: '评论/留言', icon: 'el-icon-s-comment' },
        children: [
          {
            path: '/comment/list',
            component: () => import('@/views/comments/components/comment'),
            meta: { title: '评论列表', icon: 'el-icon-s-help' }
          },
          {
            path: '/message/list',
            component: () => import('@/views/comments/components/message'),
            meta: { title: '留言列表', icon: 'el-icon-message-solid' }
          }
        ]
      },
      {
        path: '/user',
        component: () => import('@/views/user/index'),
        redirect: '/user/list',
        meta: { title: '用户管理', icon: 'el-icon-s-custom' },
        children: [
          {
            path: '/user/list',
            component: () => import('@/views/user/components/list'),
            meta: { title: '用户列表', icon: 'el-icon-user-solid' }
          }
        ]
      },
      {
        path: '/setting',
        component: () => import('@/views/setting/index'),
        redirect: '/setting/syssetting',
        meta: { title: '系统管理', icon: 'el-icon-s-tools' },
        children: [
          {
            path: '/setting/list',
            component: () => import('@/views/setting/components/list'),
            meta: { title: '系统设置', icon: 'el-icon-s-operation' }
          },
          {
            path: '/setting/link',
            component: () => import('@/views/setting/components/link'),
            meta: { title: '友情链接', icon: 'el-icon-s-promotion' }
          },
          {
            path: '/setting/record',
            component: () => import('@/views/setting/components/record'),
            meta: { title: '个人记录', icon: 'el-icon-s-opportunity' }
          }
        ]
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
