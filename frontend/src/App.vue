<script setup lang="ts">
import { RouterView } from 'vue-router';
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';
import SnackbarPop from '@/pops/SnackbarPop.vue';
import { onMounted } from 'vue';

const isDesktop = (): boolean => {
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileDevices = [
    'android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'
  ];

  for (const device of mobileDevices) {
    if (userAgent.includes(device)) {
      return false;
    }
  }
  return true;
};

onMounted(() => {
  if (!isDesktop()) {
    alert('Switch to desktop for better user experience. Mobile view is in progress.');
  }
});
</script>

<template>
  <main>
    <AppHeader />
    <RouterView style="padding-bottom: 50px;" />
    <SnackbarPop />
    <AppFooter />
  </main>
</template>
