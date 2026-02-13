import type {LoginBody, LoginResponse} from "../types/user.types.ts";
import {api} from "@/shared";

export const UserService = {
  login: (data: LoginBody) => api.post<LoginResponse>('login', data).then((res) => res.data),
}
