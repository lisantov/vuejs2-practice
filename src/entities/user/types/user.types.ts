export interface LoginBody {
  email: string;
  password: string;
}

export interface RegisterBody {
  fio: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  data: {
    user_token: string;
  }
}
