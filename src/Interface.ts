export interface AccountInfo {
    account: string;
    password: string;
    nickname: string;
    id: number;
}

export interface MeetingInfo {
    purpose: string;
    host: AccountInfo;
    members: AccountInfo[];
    detail: string;
    room: number;
    timePeriod: number;
    date: string;
    id: number;
}

export interface SelfMeetingInfo {
    purpose: string;
    detail: string;
    date: string;
    id: number;
    room: number;
    timePeriod: number;
}
