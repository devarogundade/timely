<template>
    <section>
        <div class="app_width">
            <footer>
                <p>Built on Fraxtal.</p>

                <div class="links">
                    <a target="_blank" href="https://t.me/timelyblock">Telegram Chat</a>
                    <a target="_blank" href="https://x.com/timelyblock">Follow us on X</a>
                </div>
            </footer>
        </div>
    </section>
</template>

<style scoped>
section {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
}

footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    font-size: 16px;
    font-weight: 500;
    color: var(--tx-dimmed);
}

.links {
    display: flex;
    align-items: center;
    gap: 20px;
}

footer a {
    color: var(--primary);
}
</style>