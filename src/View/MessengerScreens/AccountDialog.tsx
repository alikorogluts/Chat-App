import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

interface AccountDialogProps {
    open: boolean;
    onClose: () => void;
    onSendEmail: (subject: string, text: string) => void;
    onSecureLogout: () => void;
    onPasswordChange: (oldPass: string, newPass: string) => void;
}

export function AccountDialog({
    open,
    onClose,
    onSendEmail,
    onSecureLogout,
    onPasswordChange,
}: AccountDialogProps) {
    const [mode, setMode] = useState<"menu" | "email" | "password" | "logout">("menu");
    const [emailSubject, setEmailSubject] = useState("");
    const [emailText, setEmailText] = useState("");
    const [oldPass, setOldPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordError, setPasswordError] = useState("");



    // Reset state when dialog opens
    useEffect(() => {
        if (open) {
            // reset + inputa odaklan
            setTimeout(() => {
                setMode("menu");
                setEmailText("");
                setOldPass("");
                setNewPass("");
                setConfirmPass("");
                setPasswordError("");
            }, 100); // küçük gecikme, DOM hazır olsun
        }
    }, [open]);


    // Focus on relevant input when mode changes


    // Calculate password strength
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

    const handleSendEmail = () => {
        if (emailSubject.trim() === "") {
            setPasswordError("Lütfen bir konu girin");
            return;
        }
        if (emailText.trim() === "") {
            setPasswordError("Lütfen bir mesaj yazın");
            return;
        }
        onSendEmail(emailSubject, emailText);
        onClose();
    };

    const handlePasswordChange = () => {
        setPasswordError("");
        if (!oldPass || !newPass || !confirmPass) {
            setPasswordError("Tüm alanları doldurun");
            return;
        }
        if (newPass !== confirmPass) {
            setPasswordError("Şifreler eşleşmiyor");
            return;
        }
        if (passwordStrength < 3) {
            setPasswordError("Şifre yeterince güçlü değil");
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
        <AnimatePresence>
            {open && (
                <Dialog
                    static
                    as={motion.div}
                    open={open}
                    onClose={onClose}
                    className="fixed inset-0 z-50 overflow-y-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden"
                        >
                            {/* Header */}
                            <div className="p-5 border-b border-zinc-200 dark:border-zinc-700 bg-gradient-to-r from-indigo-500 to-purple-600">
                                <div className="flex justify-between items-center">
                                    <Dialog.Title className="text-xl font-semibold text-white">
                                        {mode === "menu" && "Hesap İşlemleri"}
                                        {mode === "email" && "Şikayet Bildir"}
                                        {mode === "password" && "Şifre Değiştir"}
                                        {mode === "logout" && "Güvenli Çıkış"}
                                    </Dialog.Title>
                                    <button
                                        onClick={onClose}
                                        className="text-white/80 hover:text-white transition-colors"
                                    >
                                        <XMarkIcon className="w-7 h-7" />
                                    </button>
                                </div>
                                <p className="text-white/80 text-sm mt-1">
                                    {mode === "menu" && "Lütfen yapmak istediğiniz işlemi seçin"}
                                    {mode === "email" && "Şikayetinizi detaylı şekilde açıklayın"}
                                    {mode === "password" && "Yeni şifrenizi belirleyin"}
                                    {mode === "logout" && "Hesabınızdan çıkmak istediğinize emin misiniz?"}
                                </p>
                            </div>

                            <div className="p-6">
                                {/* Menu View */}
                                {mode === "menu" && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                    >
                                        <button
                                            onClick={() => setMode("password")}
                                            className="flex flex-col items-center p-5 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-200 hover:bg-indigo-100 dark:hover:bg-indigo-800/50 transition-all group"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center mb-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <span className="font-medium">Şifre Değiştir</span>
                                            <p className="text-xs text-center mt-1 text-indigo-600 dark:text-indigo-300 opacity-80">
                                                Hesap güvenliğinizi güncelleyin
                                            </p>
                                        </button>

                                        <button
                                            onClick={() => setMode("email")}
                                            className="flex flex-col items-center p-5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-all group"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center mb-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                                </svg>
                                            </div>
                                            <span className="font-medium">Şikayet Bildir</span>
                                            <p className="text-xs text-center mt-1 text-blue-600 dark:text-blue-300 opacity-80">
                                                Sorunlarınızı bize iletin
                                            </p>
                                        </button>

                                        <button
                                            onClick={() => setMode("logout")}
                                            className="flex flex-col items-center p-5 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-200 hover:bg-red-100 dark:hover:bg-red-800/50 transition-all group"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-800 flex items-center justify-center mb-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <span className="font-medium">Güvenli Çıkış</span>
                                            <p className="text-xs text-center mt-1 text-red-600 dark:text-red-300 opacity-80">
                                                Tüm oturumları sonlandır
                                            </p>
                                        </button>
                                    </motion.div>
                                )}

                                {/* Complaint Form */}
                                {mode === "email" && (
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
                                            <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">Şikayet Formu</h3>
                                        </div>

                                        <div className="space-y-5">
                                            <div>
                                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                                    Konu Başlığı
                                                </label>
                                                <input

                                                    type="text"
                                                    value={emailSubject}
                                                    onChange={(e) => setEmailSubject(e.target.value)}
                                                    placeholder="Şikayet konunuzu belirtin..."
                                                    className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                                    Şikayet Detayları
                                                </label>
                                                <textarea
                                                    value={emailText}
                                                    onChange={(e) => setEmailText(e.target.value)}
                                                    placeholder="Lütfen şikayetinizi detaylı şekilde açıklayın..."
                                                    rows={5}
                                                    className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                />
                                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                                                    En az 50 karakter olmalıdır
                                                </p>
                                            </div>

                                            {passwordError && (
                                                <div className="text-red-500 text-sm py-2 px-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
                                                    {passwordError}
                                                </div>
                                            )}

                                            <div className="flex justify-end gap-3 mt-6">
                                                <button
                                                    onClick={() => setMode("menu")}
                                                    className="px-5 py-2.5 border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                                >
                                                    İptal
                                                </button>
                                                <button
                                                    onClick={handleSendEmail}
                                                    className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:opacity-90 transition-opacity shadow-md flex items-center"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                                    </svg>
                                                    Gönder
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Password Change Form */}
                                {mode === "password" && (
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

                                            {passwordError && (
                                                <div className="md:col-span-2 text-red-500 text-sm py-2 px-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
                                                    {passwordError}
                                                </div>
                                            )}

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
                                    </motion.div>
                                )}

                                {/* Logout Confirmation */}
                                {mode === "logout" && (
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
                                )}
                            </div>
                        </motion.div>
                    </div>
                </Dialog>
            )}
        </AnimatePresence>
    );
}