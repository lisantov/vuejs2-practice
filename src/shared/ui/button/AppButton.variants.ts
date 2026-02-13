import { tv } from 'tailwind-variants'

export const appButtonVariants = tv({
  base: 'duration-250 border border-transparent font-semibold py-2.5 px-3 rounded-lg bg-blue-400 cursor-pointer text-white hover:bg-blue-300 active:bg-blue-600 disabled:border-gray-500 disabled:bg-gray-400 disabled:cursor-not-allowed',
})
