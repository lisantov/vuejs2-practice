import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

const loginSchemaRaw = z.object({
  email: z.string({required_error: 'Почта обязательна'}).email('Введите корректную почту').min(1, 'Почта обязательна'),
  password: z.string({required_error: 'Пароль обязателен'}).min(1, 'Пароль обязателен'),
})

export const loginSchema = toTypedSchema(loginSchemaRaw)
export type LoginFormValues = z.infer<typeof loginSchemaRaw>
