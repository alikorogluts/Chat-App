export type userRoles = 0 | 1;

export interface _user {
    userId: number;
    userName: string;
    email: string;
    userRole: userRoles;
    isSuspended: boolean;
}

export interface ApiUsersResponse {
    users: _user[];
}

export const userRoleText: Record<userRoles, string> = {
    1: "Admin",
    0: "Kullanıcı",
};

export const isSuspendedText: { [key in 'true' | 'false']: string } = {
    true: "Pasif",
    false: "Aktif",
};

