// types/ComplaintTypes.ts

export type ComplaintStatus = "Pending" | "InProgress" | "Resolved";

export const complaintStatusText: Record<ComplaintStatus, string> = {
    Pending: "Beklemede",
    InProgress: "İşlemde",
    Resolved: "Çözüldü",
};

export interface Complaint {
    id: number;
    userId: string;
    title: string;
    description: string;
    image?: string | null;
    date: string;
    status: ComplaintStatus;
}

export interface ApiComplaintsResponse {
    complaints: Complaint[];
}
