import toast from "react-hot-toast";
import { logoutUser } from "../services/logoutUser";


export async function handleLogout(
    setUser?: React.Dispatch<React.SetStateAction<any>>,
    setIsAdmin?: React.Dispatch<React.SetStateAction<boolean>>,
    navigate?: (path: string) => void
) {
    const result = await logoutUser();
    debugger;

    if (result.success === false) {
        toast.error("Çıkış sırasında hata: " + result.message);
    } else {
        toast.success("Çıkış başarılı: " + result.message);

        if (setUser) setUser(null);
        if (setIsAdmin) setIsAdmin(false);

        sessionStorage.clear();
        localStorage.clear();

        if (navigate) navigate("/login");
    }
}
