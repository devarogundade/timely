<template>
    <section>
        <div class="app_width">
            <header>
                <RouterLink to="/">
                    <div class="logo">
                        <img src="/images/logo.png" alt="logo">
                    </div>
                </RouterLink>

                <div class="tabs">
                    <a href="/#token">
                        <button class="tab">$TML</button>
                    </a>
                    <RouterLink to="/explorer">
                        <button
                            :class="$route.name == 'explorer' || $route.name == 'explorer-identifier' ? 'tab active' : 'tab'">Explorer</button>
                    </RouterLink>
                    <a target="_blank" href="https://docs.timelyblock.xyz">
                        <button class="tab">
                            Docs
                            <OutIcon />
                        </button>
                    </a>
                    <a target="_blank" href="https://github.com/devarogundade/timely">
                        <button class="tab">
                            GitHub
                            <OutIcon />
                        </button>
                    </a>
                </div>

                <div class="action">
                    <a target="_blank" href="https://docs.timelyblock.xyz">
                        <button class="explorer">Start Building</button>
                    </a>
                </div>
            </header>
        </div>
    </section>
</template>

<script setup lang="ts">
import OutIcon from './icons/OutIcon.vue';
import TimelyIcon from './icons/TimelyIcon.vue';
</script>

<style scoped>
section {
    position: sticky;
    top: 0;
    z-index: 10;
    backdrop-filter: blur(8px);
    background: rgba(0, 0, 0, 0.2);
}

header {
    width: 100%;
    height: 80px;
    display: grid;
    grid-template-columns: 2fr 2fr 2fr;
    align-items: center;
}

.logo {
    display: flex;
    align-items: center;
    gap: 10px;
    user-select: none;
}

.logo img {
    height: 40px;
}

.logo,
.action {
    min-width: 200px;
}

.tabs {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
}

.tab {
    text-wrap: nowrap;
    padding: 0 10px;
    font-size: 16px;
    height: 24px;
    font-weight: 500;
    border-radius: 4px;
    color: var(--tx-dimmed);
    display: flex;
    align-items: center;
    gap: 8px;
}

.tab svg {
    margin-top: 2px;
}

.tab.active {
    color: var(--tx-normal);
}

.action {
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

.action button {
    height: 45px;
    min-width: 160px;
    border-radius: 16px;
    background: var(--primary);
    font-size: 18px;
    font-weight: 500;
    padding: 0 16px;
    color: var(--tx-normal);
}

.faucet {
    font-size: 18px;
}
</style>