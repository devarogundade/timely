<template>
  <main>
    <section class="hero_section">
      <img class="bg" src="/images/hero.gif" />
      <div class="app_width">
        <div class="hero" id="intro_anim">
          <h3>Unlock the potential of automated, time-based execution on Fraxtal.</h3>
          <p>Schedule and Execute Blockchain Operations Seamlessly with Fraxtal's Leading Time-Based Infra.</p>

          <a target="_blank" href="https://docs.timelyblock.xyz">
            <button>Start Building</button>
          </a>
        </div>
      </div>
    </section>
    <section>
      <div class="app_width">
        <div class="timepayloads" id="intro_anim">
          <div class="schedules">
            <div class="schedule">
              <img src="/images/one_time.png" alt="">
              <h4>One-Time</h4>
              <p>Schedule your smart contract to execute at a specific date and time, ensuring crucial tasks are
                completed precisely when needed.</p>
            </div>

            <div class="schedule">
              <img src="/images/repeatable.png" alt="">
              <h4>Repeatable</h4>
              <p>Define your intervals and let our system handle the rest, maintaining your smart contract's operations
                smoothly and reliably.</p>
            </div>
          </div>

          <a target="_blank" href="https://docs.timelyblock.xyz">
            <button>Go to Docs</button>
          </a>
        </div>
      </div>
    </section>
    <section id="token">
      <div class="app_width">
        <div class="token">
          <h3>Timely Token ($TML)</h3>
          <p>$TML is the native token of the Timely platform, serving as the essential currency for scheduling and
            executing time-based smart contract operations.
          </p>
          <a href="https://magentadex.xyz/airdrop" target="_blank" rel="noopener noreferrer">
            <button>Claim free $TML</button>
          </a>
        </div>
      </div>
    </section>
    <section>
      <div class="app_width">
        <div class="explorer_container">
          <div class="explorer">
            <img src="/images/search.png" alt="">
            <h3>Timely Explorer</h3>
            <p>$TML is the native token of the Timely platform, serving as the essential currency.</p>
            <RouterLink to="/explorer">
              <button>Explore
                <ArrowRightIcon />
              </button>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import ArrowRightIcon from '@/components/icons/ArrowRightIcon.vue';
import gsap from 'gsap';
import { onMounted } from 'vue';

onMounted(() => {
  gsap.fromTo('#intro_anim',
    { y: 50, opacity: 0 },
    { y: 0, opacity: 1, duration: .4, stagger: 0.1, ease: 'sine.inOut' }
  );
});
</script>

<style scoped>
#intro_anim {
  opacity: 0;
  transform: translateY(50px);
}

.hero_section {
  position: relative;
}

.hero_section .bg {
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-image: url(/images/hero.gif);
  object-fit: cover;
  opacity: 0.08;
}

.hero {
  padding: 100px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.hero h3 {
  color: var(--tx-normal);
  font-size: 45px;
  line-height: 70px;
}

.hero p {
  color: var(--tx-dimmed);
  font-size: 20px;
  margin-top: 20px;
}

.hero button {
  height: 45px;
  min-width: 160px;
  border-radius: 16px;
  background: var(--primary);
  font-size: 18px;
  font-weight: 500;
  padding: 0 16px;
  color: var(--tx-normal);
  margin-top: 80px;
}

.timepayloads {
  padding: 100px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.schedules {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
}

.schedule {
  width: 340px;
  max-width: 100%;
  min-height: 460px;
  padding: 30px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: flex-end;
  gap: 20px;
  background: var(--background-light);
  border: 1px solid var(--background-lighter);
  border-radius: 16px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.1) 0px 3px 6px;
  cursor: pointer;
}

.schedule:hover {
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 26px, rgba(0, 0, 0, 0.1) 0px 3px 26px;
}

.schedule img {
  width: 50px;
  height: 50px;
}

.schedule h4 {
  color: var(--tx-normal);
  font-size: 20px;
}

.schedule p {
  color: var(--tx-dimmed);
  font-size: 16px;
  line-height: 24px;
}

.timepayloads button {
  height: 45px;
  min-width: 160px;
  border-radius: 16px;
  background: var(--background-lighter);
  font-size: 18px;
  font-weight: 500;
  padding: 0 16px;
  color: var(--primary);
  margin-top: 60px;
}

.token {
  padding-bottom: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.token h3 {
  color: var(--tx-normal);
  font-size: 24px;
}

.token p {
  color: var(--tx-dimmed);
  font-size: 18px;
  line-height: 30px;
  margin-top: 20px;
  max-width: 800px;
}

.token button {
  height: 45px;
  min-width: 160px;
  border-radius: 16px;
  background: var(--background-lighter);
  font-size: 18px;
  font-weight: 500;
  padding: 0 16px;
  color: var(--primary);
  margin-top: 60px;
}

.explorer_container {
  display: flex;
  justify-content: center;
  padding-bottom: 100px;
}

.explorer {
  width: 620px;
  max-width: 100%;
  padding: 40px;
  display: flex;
  align-items: center;
  flex-direction: column;
  background: var(--background-light);
  border: 1px solid var(--background-lighter);
  border-radius: 16px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.1) 0px 3px 6px;
  cursor: pointer;
  text-align: center;
}

.explorer img {
  width: 50px;
  height: 50px;
}

.explorer h3 {
  color: var(--tx-normal);
  font-size: 24px;
  margin-top: 30px;
}

.explorer p {
  color: var(--tx-dimmed);
  font-size: 18px;
  line-height: 30px;
  margin-top: 20px;
  max-width: 800px;
}

.explorer button {
  font-size: 18px;
  font-weight: 500;
  color: var(--primary);
  margin-top: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.explorer button svg {
  margin-top: 2px;
}
</style>
