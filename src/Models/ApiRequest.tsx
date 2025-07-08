export interface loginRequest {
    userName: string;
    password: string;

}

export interface regisretRequest {
    message: string;
    userId: number;
    userName: string;
}

export interface getInboxRequest {
    reciverId: number
}