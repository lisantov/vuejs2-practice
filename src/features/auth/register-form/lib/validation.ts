import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
// .regex(/^[А-яЁёA-z\-]+\s[А-яЁёA-z\-]+.*$/)
// .email('Введите корректную почту').min(1, 'Почта обязательна')
const registerSchemaRaw = z.object({
  fio: z.string({required_error: 'ФИО обязательно'}).min(1, 'ФИО обязательно').optional(),
  email: z.string({required_error: 'Почта обязательна'}).optional(),
  password: z.string({required_error: 'Пароль обязателен'}).min(1, 'Пароль обязателен'),
})

export const registerSchema = toTypedSchema(registerSchemaRaw)
export type RegisterFormValues = z.infer<typeof registerSchemaRaw>
