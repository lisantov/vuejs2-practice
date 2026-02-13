import { computed, ref } from 'vue'

const token = ref<string | null>(localStorage.getItem('token'))

export const useAuth = () => {
  const isAuth = computed(() => !!token.value)

  const setToken = (value: string) => {
    token.value = value
    localStorage.setItem('token', value)
  }

  const clearToken = () => {
    token.value = null
    localStorage.removeItem('token')
  }

  return {
    token,
    isAuth,
    setToken,
    clearToken,
  }
}
