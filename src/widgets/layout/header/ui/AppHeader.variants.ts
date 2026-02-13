import {tv} from "tailwind-variants";

export const appHeaderVariants = tv({
  slots: {
    root: 'sticky top-0 w-full flex justify-between items-center py-8 px-16 bg-blue-400',
    title: 'text-3xl text-white font-bold',
    nav: 'flex justify-between items-center gap-6',
    link: 'text-lg text-blue-200 font-regular transition duration-250 hover:text-blue-100 cursor-pointer',
    activeLink: 'text-white',
  },
})
