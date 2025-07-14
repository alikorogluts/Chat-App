import type { NavigateFunction } from "react-router-dom";

export const logout = (navigate: NavigateFunction) => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
};
