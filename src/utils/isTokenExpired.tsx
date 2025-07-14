export const isTokenExpired = (token: string): boolean => {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const exp = payload.exp;
        const now = Math.floor(Date.now() / 1000); // saniye cinsinden

        return exp < now;
    } catch {
        return true; // Token çözümlenemiyorsa geçersiz say
    }
};
