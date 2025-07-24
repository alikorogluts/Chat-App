import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type ModeType = "menu" | "email" | "password" | "logout" | "changeUserName" | "emailChange";

interface _passwordChangeProps {
    setMode: (mode: ModeType) => void;
    onClose: () => void;
    onPasswordChange: (oldPass: string, newPass: string) => void;
}


function _passwordChange({ setMode, onClose, onPasswordChange }: _passwordChangeProps) {
    const [newPass, setNewPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [oldPass, setOldPass] = useState("");


    useEffect(() => {
        if (newPass.length === 0) {
            setPasswordStrength(0);
            return;
        }

        let strength = 0;
        if (newPass.length >= 8) strength++;
        if (/[A-Z]/.test(newPass)) strength++;
        if (/[0-9]/.test(newPass)) strength++;
        if (/[^A-Za-z0-9]/.test(newPass)) strength++;
        setPasswordStrength(strength);
    }, [newPass]);
    const handlePasswordChange = () => {

        if (!oldPass || !newPass || !confirmPass) {
            toast.error("Tüm alanları doldurun");
            return;
        }
        if (newPass !== confirmPass) {
            toast.error("Şifreler eşleşmiyor");
            return;
        }
        if (passwordStrength < 3) {
            toast.error("Şifre yeterince güçlü değil");
            return;
        }
        onPasswordChange(oldPass, newPass);
        onClose();
    };


    const renderPasswordStrength = () => {
        if (newPass.length === 0) return null;

        const strengthTexts = ["Çok zayıf", "Zayıf", "Orta", "Güçlü", "Çok güçlü"];
        const strengthColors = [
            "bg-red-500",
            "bg-orange-500",
            "bg-yellow-500",
            "bg-green-400",
            "bg-green-600"
        ];

        return (
            <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-zinc-600 dark:text-zinc-400">
                        Şifre gücü:
                    </span>
                    <span className={`text-xs font-medium ${passwordStrength < 2 ? "text-red-500" :
                        passwordStrength < 3 ? "text-yellow-500" : "text-green-500"
                        }`}>
                        {strengthTexts[passwordStrength]}
                    </span>
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-1.5">
                    <div
                        className={`h-1.5 rounded-full ${strengthColors[passwordStrength]}`}
                        style={{ width: `${(passwordStrength + 1) * 20}%` }}
                    ></div>
                </div>
            </div>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mt-2"
        >
            <div className="flex items-center mb-5">
                <button
                    onClick={() => setMode("menu")}
                    className="flex items-center text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 mr-2"
                >
                    <ArrowLeftIcon className="w-5 h-5 mr-1" />
                    Geri
                </button>
                <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">Şifre Değiştir</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Eski Şifreniz
                    </label>
                    <input

                        type="password"
                        placeholder="Eski şifrenizi girin"
                        value={oldPass}
                        onChange={(e) => setOldPass(e.target.value)}
                        className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Yeni Şifre
                    </label>
                    <input
                        type="password"
                        placeholder="Yeni şifrenizi girin"
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                    {renderPasswordStrength()}
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Şifre Doğrulama
                    </label>
                    <input
                        type="password"
                        placeholder="Yeni şifrenizi tekrar girin"
                        value={confirmPass}
                        onChange={(e) => setConfirmPass(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handlePasswordChange();
                            }
                        }}
                        className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        Şifreniz en az 8 karakter olmalı
                    </p>
                </div>


                <div className="md:col-span-2 flex justify-end mt-3">
                    <button
                        onClick={handlePasswordChange}
                        className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity shadow-md flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        Şifreyi Güncelle
                    </button>
                </div>
            </div>
        </motion.div>)
}

export default _passwordChange