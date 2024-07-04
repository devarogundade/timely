<script setup lang="ts">
import { RouterView } from 'vue-router';
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';
import SnackbarPop from '@/pops/SnackbarPop.vue';
</script>

<template>
  <main>
    <AppHeader />
    <RouterView style="padding-bottom: 50px;" />
    <SnackbarPop />
    <AppFooter />
  </main>
</template>
