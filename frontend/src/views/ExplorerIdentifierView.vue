<template>
    <section>
        <div class="app_width">
            <div class="explore">
                <div class="explore_title">
                    <h3 id="intro_anim">Identifier: {{ fineId($route.params.id as string) }}</h3>
                    <p id="intro_anim">Track all identifier payloads on timely network.</p>
                </div>

                <div class="explore_stat">
                    <div class="explore_stat_title">
                        <p id="intro_anim">Latest TimePayloadEvents</p>
                        <p id="intro_anim">
                            Total time payloads evnets: <span>{{ total.valueOf() }}</span>
                        </p>
                    </div>

                    <div class="search" id="intro_anim">
                        <input type="text" v-model="search" placeholder="Search by Event Index.">
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
                                    <td>Event Index</td>
                                    <td>Status</td>
                                    <td>Trx Hash</td>
                                    <td>Timestamp</td>
                                </tr>
                            </thead>
                        </div>
                        <div v-for="timePayloadEvent, index in timePayloadEvents" :key="index">
                            <div class="tbody">
                                <tbody>
                                    <tr>
                                        <td>
                                            <div class="payload_id">
                                                <a>
                                                    <p>{{ fineId(timePayloadEvent.identifier) }}</p>
                                                </a>
                                            </div>
                                        </td>
                                        <td>
                                            <p class="payload_id">{{
                                                total.valueOf() - ((index) + (15 * (currentPage.valueOf() - 1)))
                                            }}</p>
                                        </td>
                                        <td>
                                            <div class="payload_status"
                                                v-if="timePayloadEvent.status == TimePayloadEventStatus.SUCCESSFUL && indexCount > 0">
                                                <SuccessfulIcon />
                                                <p>Successful</p>
                                            </div>
                                            <div class="payload_status"
                                                v-if="timePayloadEvent.status == TimePayloadEventStatus.FAILED && indexCount > 0">
                                                <FailedfulIcon />
                                                <p>Failed</p>
                                            </div>
                                            <div class="payload_status" v-else-if="indexCount == 0">
                                                <SuccessfulIcon />
                                                <p>Condition not met.</p>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="payload_hash">
                                                <a v-if="timePayloadEvent.hash" target="_blank"
                                                    :href="`https://fraxscan.com/tx/${timePayloadEvent.hash}`">
                                                    <p>{{ fineHash(timePayloadEvent.hash) }}</p>
                                                    <OutIcon />
                                                </a>

                                                <a v-else>
                                                    <p>-----------</p>
                                                </a>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="payload_time">
                                                <a>
                                                    <p>{{ format(timePayloadEvent.timestamp) }}</p>
                                                </a>

                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </div>
                        </div>
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

import { allTimePayloadEvents, fineHash, fineId } from '../scripts/explorer';
import { notify } from '../reactives/notify';
import { format } from 'timeago.js';
import gsap from 'gsap';

import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { TimePayloadEventStatus, type TimePayloadEvent, type TimePayload } from '@/types';
import OutIcon from '@/components/icons/OutIcon.vue';

const search = ref<String | undefined>(undefined);
const loading = ref<Boolean | undefined>(undefined);
const timePayloadEvents = ref<TimePayloadEvent[] | undefined>(undefined);
const total = ref<number>(0);
const lastPage = ref<number>(0);
const currentPage = ref<number>(1);
const indexCount = ref<number>(0);

const route = useRoute();

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

    const response = await allTimePayloadEvents(page, route.params.id as string);

    if (response) {
        total.value = response.total;
        lastPage.value = response.lastPage;
        timePayloadEvents.value = response.data;
        currentPage.value = page;
        indexCount.value = ((JSON.parse(response.extra!) as TimePayload).eventsIndex) || 0;
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
            title: 'Enter a valid event index.',
            description: 'Field is required!',
            category: 'error'
        });
        return;
    }
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