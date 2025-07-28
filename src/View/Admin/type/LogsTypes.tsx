
export type log = {
    id: number,
    timestamp: string,
    type: string,
    user: string,
    action: string,
    details: string,
    ip: string
}

export interface Logs {
    logs: log[]
}