// types/PriorNotice.ts

export interface PriorNotice {
    id: string;
    uid: string;
    aircraft: string;
    pic_name: string;
    dep_time?: string;
    arr_time?: string;
    dof: string;
    mtow: number;
    status: string;
    created_at: string;
    updated_at: string;
    ifr_arrival: boolean; 
    billable: string;
}