<script setup lang="ts">
  import {appHeaderVariants} from "@/widgets/layout/header/ui/AppHeader.variants.ts";
  import {useAuth} from "@/shared";
  import {useLogout} from "@/entities";

  const { root, title, nav, link, activeLink } = appHeaderVariants();
  const { isAuth } = useAuth()
  const { mutate } = useLogout()
</script>

<template>
  <header :class="root()">
    <h1 :class="title()">Просто купить</h1>
    <nav :class="nav()">
      <RouterLink to="/" v-slot="{ isActive }">
        <p :class="link() + ' ' + (isActive ? activeLink() : '')">Каталог</p>
      </RouterLink>
      <RouterLink to="/auth/register" v-slot="{ isActive }" v-if="!isAuth">
        <p :class="link() + ' ' + (isActive ? activeLink() : '')">Регистрация</p>
      </RouterLink>
      <RouterLink to="/auth/login" v-slot="{ isActive }" v-if="!isAuth">
        <p :class="link() + ' ' + (isActive ? activeLink() : '')">Вход</p>
      </RouterLink>
      <RouterLink to="/user/orders" v-slot="{ isActive }" v-if="isAuth">
        <p :class="link() + ' ' + (isActive ? activeLink() : '')">Заказы</p>
      </RouterLink>
      <RouterLink to="/user/cart" v-slot="{ isActive }" v-if="isAuth">
        <p :class="link() + ' ' + (isActive ? activeLink() : '')">Корзина</p>
      </RouterLink>
      <button v-if="isAuth" :class="link()" @click="mutate()">
        Выход
      </button>
    </nav>
  </header>
</template>

<style scoped>

</style>
