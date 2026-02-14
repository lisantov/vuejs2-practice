import { createRouter, createWebHistory } from 'vue-router'
import { useAuth, Routes } from '@/shared'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { name: 'catalog', path: Routes.catalog, component: () => import('@/pages/catalog/CatalogPage.vue') },
    { name: 'login', path: Routes.login, component: () => import('@/pages/auth/LoginPage.vue') },
    { name: 'register', path: Routes.register, component: () => import('@/pages/auth/RegisterPage.vue') },
    { name: 'cart', path: Routes.cart, component: () => import('@/pages/cart/CartPage.vue') },
    { name: 'orders', path: Routes.orders, component: () => import('@/pages/orders/OrderPage.vue') },
  ],
})

export default router
