import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";

type ModeType = "menu" | "email" | "password" | "logout" | "changeUserName" | "emailChange";
interface _safeLogoutProps {
    setMode: (mode: ModeType) => void;
    onSecureLogout: () => void;
    onClose: () => void;

}
function _safeLogout({ setMode, onSecureLogout, onClose }: _safeLogoutProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-8 text-center"
        >
            <div className="mx-auto w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
            </div>

            <Dialog.Description className="text-zinc-600 dark:text-zinc-400 mb-8 text-lg">
                Hesabınızdan çıkmak istediğinize emin misiniz?<br />
                <span className="text-sm block mt-2">Tüm oturumlarınız sonlandırılacaktır.</span>
            </Dialog.Description>

            <div className="flex justify-center gap-4">
                <button
                    onClick={() => setMode("menu")}
                    className="px-6 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors font-medium"
                >
                    Vazgeç
                </button>
                <button
                    onClick={() => {
                        onSecureLogout();
                        onClose();
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:opacity-90 transition-opacity shadow-md font-medium flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                    </svg>
                    Çıkış Yap
                </button>
            </div>
        </motion.div>
    )
}

export default _safeLogout