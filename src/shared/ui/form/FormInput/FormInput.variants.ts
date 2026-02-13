import {tv} from "tailwind-variants";

export const formInputVariants = tv({
  base: 'placeholder-gray-500 duration-250 text-gray-600 px-6 py-3 rounded-lg outline outline-1 outline-blue-400 hover:outline-2 hover:outline-blue-300 focus:outline-2 focus:outline-blue-600 focus:caret-blue-600',
  variants: {
    error: {
      true: 'outline outline-1 outline-red-400',
    },
  },
})
