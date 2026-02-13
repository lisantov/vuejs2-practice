import { tv } from 'tailwind-variants'

export const loginFormVariants = tv({
  slots: {
    root: 'flex flex-col flex-1 w-full justify-center items-center px-20 py-24 gap-8',
    title: 'text-5xl text-gray-600',
    form: 'flex flex-col w-full gap-[6.5rem] max-w-180',
    formFields: 'flex flex-col gap-[26px]',
  },
})
