import {tv} from "tailwind-variants";

export const orderItemVariants = tv({
  slots: {
    root: 'py-4 px-4 rounded-xl border border-gray-200 flex flex-col justify-between shadow-lg gap-12',
    title: 'text-xl font-bold',
    body: 'flex flex-col gap-4',
  },
})
