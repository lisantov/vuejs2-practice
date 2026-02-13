import { defineMutation, useMutation, useQueryCache } from '@pinia/colada'
import { useRouter } from 'vue-router'
import { useAuth } from '@/shared/composables'
import { Routes } from '@/shared/lib'
import { USER_QUERY_KEYS } from "./user.keys.ts";
import {UserService} from "../api";

export const useLogin = defineMutation(() => {
  const { setToken } = useAuth()
  const queryCache = useQueryCache()
  const router = useRouter()

  return useMutation({
    mutation: UserService.login,
    onSuccess(data) {
      setToken(data.data.user_token)
      queryCache.invalidateQueries({ key: USER_QUERY_KEYS.all })
      router.push(Routes.catalog)
    },
  })
})

export const useRegister = defineMutation(() => {
  const { setToken } = useAuth()
  const queryCache = useQueryCache()
  const router = useRouter()

  return useMutation({
    mutation: UserService.register,
    onSuccess(data) {
      setToken(data.data.user_token)
      queryCache.invalidateQueries({ key: USER_QUERY_KEYS.all })
      router.push(Routes.catalog)
    },
  })
})

export const useLogout = defineMutation(() => {
  const { clearToken } = useAuth()
  const queryCache = useQueryCache()
  const router = useRouter()

  return useMutation({
    mutation: UserService.logout,
    onSuccess() {
      clearToken()
      queryCache.invalidateQueries({ key: USER_QUERY_KEYS.all })
      router.push(Routes.login)
    },
  })
})
