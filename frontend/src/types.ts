export type Notification = {
    title: string;
    description: string;
    category: string;
    linkTitle?: string;
    linkUrl?: string;
};

export type ReadableDate = {
    month: string;
    day: number;
    hour: number;
    min: number;
    year: number;
};

export enum TimePayloadStatus {
    ACTIVE,
    CANCELLED
}

export enum TimePayloadEventStatus {
    SUCCESSFUL,
    FAILED
}

export enum Minutes {
    ONE_MINUTES,
    TWO_MINUTES,
    FIVE_MINUTES,
    TEN_MINUTES,
    FIFTEEN_MINUTES,
    TWENTY_MINUTES,
    TWENTY_FIVE_MINUTES,
    THIRTY_MINUTES,
    THIRTY_FIVE_MINUTES,
    FORTY_MINUTES,
    FORTY_FIVE_MINUTES,
    FIFTY_MINUTES,
    FIFTY_FIVE_MINUTES,
    SIXTY_MINUTES,
    INGORE
}

export enum Hours {
    ZERO_HOUR,
    ONE_HOUR,
    TWO_HOUR,
    THREE_HOUR,
    FOUR_HOUR,
    FIVE_HOUR,
    SIX_HOUR,
    SEVEN_HOUR,
    EIGHT_HOUR,
    NINE_HOUR,
    TEN_HOUR,
    ELEVEN_HOUR,
    TWELVE_HOUR,
    THIRTEEN_HOUR,
    FOURTEEN_HOUR,
    FIFTEEN_HOUR,
    SIXTEEN_HOUR,
    SEVENTEEN_HOUR,
    EIGHTEEN_HOUR,
    NINETEEN_HOUR,
    TWENTY_HOUR,
    TWENTY_ONE_HOUR,
    TWENTY_TWO_HOUR,
    TWENTY_THREE_HOUR,
    INGORE
}

export enum Schedule {
    ONCE,
    REPEAT
}

export type TimePayload = {
    nonce: number;
    identifier: string;
    sender: string;
    delay: number;
    schedule: Schedule;
    minutes: Minutes;
    hours: Hours;
    eventsIndex?: number;
    status: TimePayloadStatus;
};

export type TimePayloadEvent = {
    identifier: string;
    timestamp: number;
    hash?: string;
    status: TimePayloadEventStatus;
};

export type Paged<T> = {
    total: number,
    lastPage: number;
    data?: T;
};
