import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Main',
      component: () => import('../views/MainView.vue')
    },
    {
      path: '/matchTable/mode',
      name: 'MatchTableModeSelect',
      component: () => import('../views/MatchTable/ModeSelectView.vue')
    },
    {
      path: '/matchTable/create',
      name: 'MatchTableCreate',
      component: () => import('../views/MatchTable/CreateView.vue')
    },
    {
      path: '/matchTable/login',
      name: 'MatchTableLogin',
      component: () => import('../views/MatchTable/LoginView.vue')
    },
    {
      path: '/matchTable',
      name: 'MatchTable',
      component: () => import('../views/MatchTable/MainView.vue')
    },
    // {
    //   path: '/excelToJson',
    //   name: 'ExcelToJson',
    //   component: () => import('../views/ExcelToJson/MainView.vue')
    // },
    {
      path: '/human',
      name: 'Human',
      component: () => import('../views/Human/MainView.vue')
    },
    {
      path: '/restaurant',
      name: 'Restaurant',
      component: () => import('../views/Restaurant/MainView.vue')
    },
    {
      path: '/restaurant/cart',
      name: 'RestaurantCart',
      component: () => import('../views/Restaurant/CartView.vue')
    },
    {
      path: '/restaurant/history',
      name: 'RestaurantHistory',
      component: () => import('../views/Restaurant/HistoryView.vue')
    },
    {
      path: '/restaurant/end',
      name: 'RestaurantEnd',
      component: () => import('../views/Restaurant/EndView.vue')
    },
    {
      path: '/blog',
      name: 'Blog',
      component: () => import('../views/Blog/Main.vue')
    },
    {
      path: '/blog/technology/1',
      name: 'technology_1',
      component: () => import('../views/Blog/Technology/index1.vue')
    },
    {
      path: '/blog/technology/2',
      name: 'technology_2',
      component: () => import('../views/Blog/Technology/index2.vue')
    },
    {
      path: '/blog/technology/3',
      name: 'technology_3',
      component: () => import('../views/Blog/Technology/index3.vue')
    },
    {
      path: '/game',
      name: 'Game',
      component: () => import('../views/Game/MainView.vue')
    },
    // {
    //   path: '/nengajou',
    //   name: 'Nengajou',
    //   component: () => import('../views/Nengajou/MainView.vue')
    // },
    {
      path: '/:catchAll(.*)',
      name: 'NotFound',
      component: () => import('../views/NotFoundView.vue')
    }
  ]
})

export default router
