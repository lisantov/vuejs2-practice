import { createRouter, createWebHistory } from 'vue-router'
import { useAuth, Routes } from '@/shared'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { name: 'catalog', path: Routes.catalog, component: () => import('@/pages/catalog/CatalogPage.vue') },
    { name: 'login', path: Routes.login, component: () => import('@/pages/auth/LoginPage.vue') },
    { name: 'register', path: Routes.register, component: () => import('@/pages/auth/RegisterPage.vue') },
  ],
})

router.beforeEach((to, from, next) => {
  const { isAuth } = useAuth()

  const authRoutes = ['catalog']
  const guestRoutes = ['login', 'register']

  if (authRoutes.includes(to.name as string) && !isAuth.value) {
    return next(Routes.login)
  }

  if (guestRoutes.includes(to.name as string) && isAuth.value) {
    return next(Routes.catalog)
  }

  next()
})

export default router
