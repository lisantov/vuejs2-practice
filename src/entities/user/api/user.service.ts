import type {LoginBody, RegisterBody, LoginResponse} from "../types/user.types.ts";
import {api} from "@/shared";

export const UserService = {
  login: (data: LoginBody) => api.post<LoginResponse>('login', data).then((res) => res.data),
  register: (data: RegisterBody) => api.post<LoginResponse>('signup', data).then((res) => res.data),
  logout: () => api.post('logout').then((res) => res.data),
}
