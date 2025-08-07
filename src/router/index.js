import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/login/loginPage.vue') },
    {
      path: '/',
      component: () => import('@/views/layout/layoutPage.vue'),
      redirect: '/home',
      children: [
        { path: '/home', component: () => import('@/views/home/homePage.vue') },
        { path: '/me', component: () => import('@/views/me/myPage.vue') },
      ],
    },
    { path: '/playlist/:id', component: () => import('@/views/list/playList.vue') },
    { path: '/musiclist', component: () => import('@/views/list/musicList.vue') },
    { path: '/search', component: () => import('@/views/search/searchPage.vue') },
    { path: '/results/:keywords', component: () => import('@/views/search/searchResults.vue') },
  ],
})

export default router
