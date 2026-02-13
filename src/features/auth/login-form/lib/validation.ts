import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

const loginSchemaRaw = z.object({
  email: z.string().email().min(1, 'Почта обязательна'),
  password: z.string().min(1, 'Пароль обязателен'),
})

export const loginSchema = toTypedSchema(loginSchemaRaw)
export type LoginFormValues = z.infer<typeof loginSchemaRaw>
