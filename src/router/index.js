import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/home',
    role: 'adminuser',
    children: [{
      path: 'home',
      name: 'Home',
      component: () => import('@/views/home/index'),
      meta: { title: '主页', icon: 'nested' }
    }]
  },

  {
    path: '/data',
    component: Layout,
    redirect: '/data/overview',
    name: 'DataServe',
    role: 'user',
    meta: { title: '数据服务', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'overview',
        name: 'Overview',
        component: () => import('@/views/data/overview/index'),
        meta: { title: '数据总览', icon: 'table' }
      },
      {
        path: 'library',
        name: 'Library',
        component: () => import('@/views/data/LabelManage/index'),
        meta: { title: '标签库管理', icon: 'tree' }
      }
    ]
  },

  {
    path: '/classify',
    component: Layout,
    role: 'user',
    children: [
      {
        path: 'classify',
        name: 'classify',
        component: () => import('@/views/classify/index'),
        meta: { title: '在线分类', icon: 'form' }
      }
    ]
  },
  {
    path: '/userInfo',
    component: Layout,
    role: 'admin',
    children: [
      {
        path: 'userInfo',
        name: 'userInfo',
        component: () => import('@/views/user/index'),
        meta: { title: '用户信息', icon: 'form' }
      }
    ]
  },
  {
    path: '/checkClass',
    component: Layout,
    role: 'admin',
    children: [
      {
        path: 'checkClass',
        name: 'checkClass',
        component: () => import('@/views/admin/checkClass/index'),
        meta: { title: '分类审核', icon: 'form' }
      }
    ]
  },
  {
    path: '/labelManage',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'LabelManage',
        component: () => import('@/views/data/LabelManage/index'),
        meta: { title: '标签管理', icon: 'form' }
      }
    ]
  },
  {
    path: '/checkText',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'CheckText',
        component: () => import('@/views/checkText/index'),
        meta: { title: '查看文本', icon: 'form' }
      }
    ]
  },
  {
    path: '/classifyDetail',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'classifyDetail',
        component: () => import('@/views/classifyDetail/index'),
        meta: { title: '分类', icon: 'form' }
      }
    ]
  },

  {
    path: '/classifyResult',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'classifyResult',
        component: () => import('@/views/classResult/index'),
        meta: { title: '分类结果', icon: 'form' }
      }
    ]
  },
  {
    path: '/classifyResultCheck',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'classifyResultCheck',
        component: () => import('@/views/admin/checkClassResult/index'),
        meta: { title: '分类结果审核', icon: 'form' }
      }
    ]
  },
  {
    path: '/createDataSet',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'createDataSet',
        component: () => import('@/views/data/createDataSet/index'),
        meta: { title: '创建数据集', icon: 'form' }
      }
    ]
  },
  {
    path: '/editPassword',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'editPassword',
        component: () => import('@/views/editPassword/index'),
        meta: { title: '修改密码', icon: 'form' }
      }
    ]
  },
  {
    path: '/importData',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'importData',
        component: () => import('@/views/data/importData/index'),
        meta: { title: '数据导入', icon: 'form' }
      }
    ]
  },
  {
    path: '/checkDataDetail',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'checkDataDetail',
        component: () => import('@/views/data/dataSetDetail/index'),
        meta: { title: '数据集详情', icon: 'form' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
