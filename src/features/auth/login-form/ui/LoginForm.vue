<script setup lang="ts">
import { useForm } from 'vee-validate'
import { watch } from 'vue'
import { AppButton, FormField } from '@/shared/ui'
import { useLogin } from '@/entities'
import { loginSchema } from '../lib/validation'
import { loginFormVariants } from '../lib/LoginForm.variants'
import type { LoginFormValues } from '../lib/validation'

const { mutateAsync, state, isLoading } = useLogin()
const { defineField, handleSubmit, values, errors } = useForm<LoginFormValues>({
  validationSchema: loginSchema,
})

const [email, emailAttr] = defineField('email')
const [password, passwordAttr] = defineField('password')

const onSubmit = handleSubmit((values) => {
  mutateAsync(values)
})

watch(values, () => {
  if (state.value.error) state.value.error = new Error(undefined)
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
        />
      </div>
      <app-button :disabled="isLoading">Войти</app-button>
    </form>
  </section>
</template>
