export type Stat = {
    title: string;
    value: number;
    change: string;
    icon: string;
};

export type MonthlyComplaint = {
    month: string;
    count: number;
};

export interface ApiDashboardResponse {
    stats: Stat[];
    monthlyComplaints: MonthlyComplaint[];
}
