<script setup lang="ts">
import { useForm } from 'vee-validate'
import { AppButton, FormField } from '@/shared/ui'
import { useLogin } from '@/entities'
import { loginSchema } from '../lib/validation'
import { loginFormVariants } from '../lib/LoginForm.variants'
import type { LoginFormValues } from '../lib/validation'
import { AxiosError } from "axios";

const { mutateAsync, state, isLoading } = useLogin()
const { defineField, handleSubmit, values, errors } = useForm<LoginFormValues>({
  validationSchema: loginSchema,
})

const [email, emailAttr] = defineField('email')
const [password, passwordAttr] = defineField('password')

const onSubmit = handleSubmit((values) => {
  mutateAsync(values)
})

const { form, root, formFields, title } = loginFormVariants()
</script>

<template>
  <section :class="root()">
    <h2 :class="title()">Вход в аккаунт</h2>
    <form :class="form()" @submit.prevent="onSubmit">
      <div :class="formFields()">
        <form-field
          v-model="email"
          placeholder="E-mail"
          type="email"
          :error="errors.email"
          :disabled="isLoading"
          v-bind="emailAttr"
          show-error-message
        />
        <form-field
          v-model="password"
          placeholder="Пароль"
          type="password"
          :error="errors.password"
          v-bind="passwordAttr"
          :disabled="isLoading"
          show-error-message
        />
      </div>
      <div class="flex flex-col">
        <app-button :disabled="isLoading || Object.keys(errors).length">Войти</app-button>
        <p class="text-red-400">
          {{
            state.status === 'error' ?
              state.error instanceof AxiosError && state.error.response
                ? state.error.response.data.error.message
                : 'Ошибка при авторизации'
              : ''
          }}
        </p>
      </div>
    </form>
  </section>
</template>
