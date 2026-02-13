<script setup lang="ts">
import { useForm } from 'vee-validate'
import { AppButton, FormField } from '@/shared/ui'
import { registerSchema } from '../lib/validation'
import { registerFormVariants } from '../lib/RegisterForm.variants.ts'
import type { RegisterFormValues } from '../lib/validation'
import {AxiosError} from "axios";
import {useRegister} from "@/entities/user/queries/user.queries.ts";
import {computed} from "vue";

const { mutateAsync, state, isLoading } = useRegister()
const { defineField, handleSubmit, values, errors } = useForm<RegisterFormValues>({
  validationSchema: registerSchema,
})

const [fio, fioAttr] = defineField('fio')
const [email, emailAttr] = defineField('email')
const [password, passwordAttr] = defineField('password')

const onSubmit = handleSubmit((values) => {
  mutateAsync(values)
})

const responseErrors = computed(() => {
  const errors = {fio: [], email: [], password: []}
  if (state.value.status === 'error') {
    if (state.value.error instanceof AxiosError && state.value.error.response) {
      Object.assign(errors, {
        fio: [...state.value.error.response.data.errors[0].fio],
        email: [...state.value.error.response.data.errors[0].email],
        password: [...state.value.error.response.data.errors[0].password],
      })
    }
  }
  return errors
})

const { form, root, formFields, title } = registerFormVariants()
</script>

<template>
  <section :class="root()">
    <h2 :class="title()">Создание аккаунта</h2>
    <form :class="form()" @submit.prevent="onSubmit">
      <div :class="formFields()">
        <div class="flex flex-col">
          <form-field
            v-model="fio"
            placeholder="ФИО"
            type="text"
            :error="errors.fio"
            v-bind="fioAttr"
            show-error-message
          />
          <p class="text-red-400">
            {{
              state.status === 'error' ?
                !errors.fio
                  ? responseErrors.fio[0]
                  : ''
                : ''
            }}
          </p>
        </div>
        <div class="flex flex-col">
          <form-field
            v-model="email"
            placeholder="E-mail"
            type="email"
            :error="errors.email"
            v-bind="emailAttr"
            show-error-message
          />
          <p class="text-red-400">
            {{
              state.status === 'error' ?
                !errors.email
                  ? responseErrors.email[0]
                  : ''
                : ''
            }}
          </p>
        </div>
        <div class="flex flex-col">
          <form-field
            v-model="password"
            placeholder="Пароль"
            type="password"
            :error="errors.password"
            v-bind="passwordAttr"
            show-error-message
          />
          <p class="text-red-400">
            {{
              state.status === 'error' ?
                !errors.password
                  ? responseErrors.password[0]
                  : ''
                : ''
            }}
          </p>
        </div>
      </div>
      <div class="flex flex-col">
        <app-button :disabled="isLoading || Object.keys(errors).length">Регистрация</app-button>
        <p class="text-red-400">
          {{
            state.status === 'error' ?
              state.error instanceof AxiosError && state.error.response
                ? state.error.response.data.message
                : 'Ошибка при авторизации'
              : ''
          }}
        </p>
      </div>
    </form>
  </section>
</template>
