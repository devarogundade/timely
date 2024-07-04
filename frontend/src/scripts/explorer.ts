import axios from 'axios';
import type { Paged, TimePayload, TimePayloadEvent } from '@/types';

const BASE_URL: string = 'https://timelyblock.azurewebsites.net/';

export async function allTimePayloads(page: number = 1, sender?: string): Promise<Paged<TimePayload[]> | null> {
    try {
        const response = await axios.get(`${BASE_URL}/timepayloads/all?page=${page}&sender=${sender}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(response);

        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function allTimePayloadEvents(page: number, identifier?: string): Promise<Paged<TimePayloadEvent[]> | null> {
    try {
        const response = await axios.get(`${BASE_URL}/timepayloadevents/all?page${page}&identifier=${identifier}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export function fineHash(hash: string) {
    if (!hash || hash.length < 40) return hash;
    return hash.substring(0, 20) + '...';
}

export function fineId(id: string) {
    if (!id || id.length < 16) return id;
    return id.substring(0, 16) + '...' + id.substring(id.length - 2, id.length);
}