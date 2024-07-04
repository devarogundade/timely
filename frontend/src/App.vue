<script setup lang="ts">
import { RouterView } from 'vue-router';
import AppHeader from '@/components/AppHeader.vue';
import SnackbarPop from '@/pops/SnackbarPop.vue';
</script>

<template>
  <main>
    <AppHeader />
    <RouterView />
    <SnackbarPop />
  </main>
</template>
