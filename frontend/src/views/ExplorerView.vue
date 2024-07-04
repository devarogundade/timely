<template>
    <section>
        <div class="app_width">
            <div class="explore">
                <div class="explore_title">
                    <h3 id="intro_anim">Explore Timely TimePayloads</h3>
                    <p id="intro_anim">Track all payloads, payloads on timely network.</p>
                </div>

                <div class="explore_stat">
                    <div class="explore_stat_title">
                        <p id="intro_anim">Latest TimePayloads</p>
                        <p id="intro_anim">
                            Total time payloads: <span>{{ total.valueOf() }}</span>
                        </p>
                    </div>

                    <div class="search" id="intro_anim">
                        <input type="text" v-model="search" placeholder="Search by Sender address.">
                        <div @click="goSearch" class="search_action">
                            <SearchIcon />
                        </div>
                    </div>
                </div>

                <LoadingBox v-show="loading" id="intro_anim" />

                <div class="explore_table" v-show="!loading" id="table_anim">
                    <table>
                        <div class="thead">
                            <thead>
                                <tr>
                                    <td>Identifier</td>
                                    <td>Status</td>
                                    <td>Sender</td>
                                    <td>Event Index</td>
                                    <td>Schedule</td>
                                </tr>
                            </thead>
                        </div>
                        <RouterLink v-for="timePayload, index in timePayloads" :key="index"
                            :to="`/explorer/${timePayload.identifier}`">
                            <div class="tbody">
                                <tbody>
                                    <tr>
                                        <td>
                                            <p class="payload_id">{{ fineId(timePayload.identifier) }}</p>
                                        </td>
                                        <td>
                                            <div class="payload_status"
                                                v-if="timePayload.status == TimePayloadStatus.ACTIVE">
                                                <SuccessfulIcon />
                                                <p>Active</p>
                                            </div>
                                            <div class="payload_status"
                                                v-if="timePayload.status == TimePayloadStatus.CANCELLED">
                                                <FailedfulIcon />
                                                <p>Cancelled</p>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="payload_hash">
                                                <a target="_blank"
                                                    :href="`https://fraxscan.com/address/${timePayload.sender}`">
                                                    <p>{{ fineHash(timePayload.sender) }}</p>
                                                    <OutIcon />
                                                </a>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="payload_hash">
                                                <a>
                                                    <p>{{ timePayload.eventsIndex }}</p>
                                                </a>

                                            </div>
                                        </td>
                                        <td>
                                            <p v-if="timePayload.schedule == Schedule.ONCE" class="payload_time">
                                                One-Time
                                            </p>
                                            <p v-if="timePayload.schedule == Schedule.REPEAT" class="payload_time">
                                                Repeatable
                                            </p>
                                        </td>
                                    </tr>
                                </tbody>
                            </div>
                        </RouterLink>
                    </table>

                    <div class="transaction_navigation">
                        <div class="back" @click="back" :style="{ opacity: currentPage == 1 ? '0.3' : '1' }">
                            <ArrowLeftIcon />
                            <p>Back</p>
                        </div>

                        <div class="pages">
                            <div v-for="index in lastPage" @click="getPayloads(index)"
                                :class="currentPage == index ? 'page page_active' : 'page'" :key="index">
                                {{ index }}
                            </div>
                        </div>

                        <div class="next" @click="next" :style="{ opacity: currentPage == lastPage ? '0.3' : '1' }">
                            <p>Next</p>
                            <ArrowRightIcon />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import LoadingBox from '../components/LoadingBox.vue';
import SearchIcon from '../components/icons/SearchIcon.vue';
import FailedfulIcon from '../components/icons/FailedfulIcon.vue';
import SuccessfulIcon from '../components/icons/SuccessfulIcon.vue';
import ArrowRightIcon from '../components/icons/ArrowRightIcon.vue';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon.vue';

import { allTimePayloads, fineHash, fineId } from '../scripts/explorer';
import { notify } from '../reactives/notify';
import gsap from 'gsap';

import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { type TimePayload, TimePayloadStatus, Schedule } from '@/types';
import OutIcon from '@/components/icons/OutIcon.vue';

const search = ref<String | undefined>(undefined);
const loading = ref<Boolean | undefined>(undefined);
const timePayloads = ref<TimePayload[] | undefined>(undefined);
const total = ref<number>(0);
const lastPage = ref<number>(0);
const currentPage = ref<number>(1);

const router = useRouter();

const back = () => {
    if (currentPage.value > 1) {
        getPayloads(currentPage.value - 1);
    }
};

const next = () => {
    if (currentPage.value < lastPage.value) {
        getPayloads(currentPage.value + 1);
    }
};

const getPayloads = async (page: number, refresh: boolean = false) => {
    loading.value = refresh;

    const response = await allTimePayloads(page);

    if (response) {
        total.value = response.total;
        lastPage.value = response.lastPage;
        timePayloads.value = response.data;
        currentPage.value = page;
    }

    loading.value = false;

    gsap.fromTo('#table_anim',
        { scale: .95, opacity: 0 },
        { scale: 1, opacity: 1, duration: .4, ease: 'sine.inOut', delay: 0.2 }
    );
};

const goSearch = () => {
    if (!search.value || search.value == '') {
        notify.push({
            title: 'Enter a valid sender address.',
            description: 'Field is required!',
            category: 'error'
        });
        return;
    }

    router.push(`/${search.value}`);
    search.value = '';
};

onMounted(() => {
    gsap.fromTo('#intro_anim',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: .4, stagger: 0.1, ease: 'sine.inOut' }
    );

    getPayloads(currentPage.value, true);
});
</script>

<style scoped>
#intro_anim {
    opacity: 0;
    transform: translateY(50px);
}

.explore {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 100px 0;
}

.explore_title {
    text-align: center;
    width: 560px;
}

.explore_title h3 {
    color: var(--tx-normal, #EEF1F8);
    font-size: 34px;
}

.explore_title p {
    margin-top: 26px;
    color: var(--tx-dimmed, #8B909E);
    text-align: center;
    font-size: 16px;
}

.explore_stat {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-top: 60px;
}

.explore_stat_title p:first-child {
    color: var(--tx-normal);
    font-size: 20px;
    font-weight: 600;
}

.explore_stat_title p:last-child {
    margin-top: 8px;
    color: var(--tx-dimmed);
    font-size: 14px;
}

.explore_stat_title p:last-child span {
    color: var(--primary);
}

.search {
    display: flex;
    align-items: center;
    border-radius: 4px;
    border: 1px solid var(--background-lighter);
    background: var(--background-light);
    overflow: hidden;
}

.search input {
    background: none;
    border: none;
    width: 320px;
    height: 40px;
    padding: 0 16px;
    align-items: center;
    flex-shrink: 0;
    outline: none;
    color: var(--tx-normal);
    font-size: 14px;
    font-weight: 500;
}

.search_action {
    background: var(--background-lighter);
    height: 40px;
    width: 40px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
}

.explore_table {
    width: 100%;
    margin-top: 30px;
    scale: .9;
    opacity: 0;
}

.thead {
    height: 70px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--background-lighter);
}

td:first-child {
    width: 200px;
}

td:nth-child(2) {
    width: 300px;
    text-align: right;
}

td:nth-child(3) {
    width: 300px;
    text-align: right;
}

td:nth-child(4) {
    width: 300px;
    text-align: right;
}

td:nth-child(5) {
    width: 200px;
    text-align: right;
}

table {
    width: 100%;
}

thead td {
    color: var(--tx-dimmed);
    font-size: 14px;
}

.tbody {
    display: flex;
    align-items: center;
    height: 86px;
    border-bottom: 1px solid var(--background-lighter);
}

.payload_hash {
    display: flex;
    align-items: center;
    gap: 10px;
}

.payload_hash a {
    display: flex;
    align-items: center;
    gap: 8px;
}

.payload_id {
    color: var(--tx-normal);
    font-size: 14px;
    font-weight: 500;
}

.payload_status {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
}

.payload_status p {
    color: var(--tx-normal);
    font-size: 14px;
}

.payload_time {
    color: var(--tx-normal);
    font-size: 14px;
    font-weight: 500;
}

.payload_hash p {
    color: var(--tx-dimmed);
    font-size: 14px;
}

.payload_hash {
    justify-content: flex-end;
}

.transaction_navigation {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 40px;
}

.transaction_navigation .pages {
    gap: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.transaction_navigation .page {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--tx-dimmed);
    text-align: center;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
}


.transaction_navigation .page_active {
    border-radius: 2px;
    background: var(--background-light);
    border-bottom: 1px solid var(--background-lighter);
}

.transaction_navigation .next,
.transaction_navigation .back {
    display: flex;
    align-items: center;
    color: var(--tx-dimmed);
    font-size: 14px;
    font-weight: 500;
    gap: 10px;
    cursor: pointer;
}
</style>