import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

import _sendSuppertRequest from "./subAccountDialog/_sendSuppertRequest";
import _passwordChange from "./subAccountDialog/_passwordChange";
import _safeLogout from "./subAccountDialog/_safeLogout";
import _emailChange from "./subAccountDialog/_emailChange";
import _changeUserName from "./subAccountDialog/_userNameChange";


interface AccountDialogProps {
    open: boolean;
    onClose: () => void;
    onSendEmail: (subject: string, text: string, file?: File) => void;
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

    const [mode, setMode] = useState<"menu" | "email" | "password" | "logout" | "changeUserName" | "emailChange">("menu");




    // Reset state when dialog opens
    useEffect(() => {
        if (open) {
            // reset + inputa odaklan
            setTimeout(() => {
                setMode("menu");

            }, 100); // küçük gecikme, DOM hazır olsun
        }
    }, [open]);






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
                                        {mode === "changeUserName" && "Kullanıcı Adınızı değiştirin"}
                                        {mode === "emailChange" && "Epostanızı güncelleyin"}
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
                                    {mode === "changeUserName" && "Kullanıcı Adınızı değiştirin"}
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
                                        {/* Şifre Güncelle */}
                                        <button
                                            onClick={() => setMode("password")}
                                            className="flex flex-col items-center p-5 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-200 hover:bg-indigo-100 dark:hover:bg-indigo-800/50 transition-all group hover:scale-[1.02]"
                                        >
                                            <div className="w-14 h-14 rounded-full bg-indigo-100 dark:bg-indigo-800 shadow-md flex items-center justify-center mb-3 group-hover:rotate-1 transition-all">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-indigo-500">
                                                    <path fillRule="evenodd" d="M15.75 1.5a6.75 6.75 0 00-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 00-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 00.75-.75v-1.5h1.5A.75.75 0 009 19.5V18h1.5a.75.75 0 00.53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1015.75 1.5zm0 3a.75.75 0 000 1.5A2.25 2.25 0 0118 8.25a.75.75 0 001.5 0 3.75 3.75 0 00-3.75-3.75z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <span className="font-medium">Şifrenizi Güncelleyin</span>
                                            <p className="text-xs text-center mt-1 text-indigo-600 dark:text-indigo-300 opacity-80">
                                                Hesabınızı korumak için yeni bir şifre belirleyin
                                            </p>
                                        </button>

                                        {/* E-posta Güncelle */}
                                        <button
                                            onClick={() => setMode("emailChange")}
                                            className="flex flex-col items-center p-5 rounded-xl bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-200 hover:bg-green-100 dark:hover:bg-green-800/50 transition-all group hover:scale-[1.02]"
                                        >
                                            <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-800 shadow-md flex items-center justify-center mb-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-green-600">
                                                    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                                                    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                                                </svg>
                                            </div>
                                            <span className="font-medium">E-posta Bilginizi Güncelleyin</span>
                                            <p className="text-xs text-center mt-1 text-green-600 dark:text-green-300 opacity-80">
                                                Güncel iletişim bilgilerinizle devam edin
                                            </p>
                                        </button>

                                        {/* Kullanıcı Adı Güncelle */}
                                        <button
                                            onClick={() => setMode("changeUserName")}
                                            className="flex flex-col items-center p-5 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-800/50 transition-all group hover:scale-[1.02]"
                                        >
                                            <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-800 shadow-md flex items-center justify-center mb-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-amber-600">
                                                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <span className="font-medium">Kullanıcı Adını Güncelle</span>
                                            <p className="text-xs text-center mt-1 text-amber-600 dark:text-amber-300 opacity-80">
                                                Yeni bir kullanıcı adı belirleyin
                                            </p>
                                        </button>

                                        {/* Destek Talebi */}
                                        <button
                                            onClick={() => setMode("email")}
                                            className="flex flex-col items-center p-5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-all group hover:scale-[1.02]"
                                        >
                                            <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-800 shadow-md flex items-center justify-center mb-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-blue-500">
                                                    <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <span className="font-medium">Destek Talebi Oluştur</span>
                                            <p className="text-xs text-center mt-1 text-blue-600 dark:text-blue-300 opacity-80">
                                                Karşılaştığınız sorunu bize iletin
                                            </p>
                                        </button>

                                        {/* Güvenli Çıkış */}
                                        <button
                                            onClick={() => setMode("logout")}
                                            className="flex flex-col items-center p-5 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-200 hover:bg-red-100 dark:hover:bg-red-800/50 transition-all group hover:scale-[1.02]"
                                        >
                                            <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-800 shadow-md flex items-center justify-center mb-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-red-500">
                                                    <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm5.03 4.72a.75.75 0 010 1.06l-1.72 1.72h10.94a.75.75 0 010 1.5H10.81l1.72 1.72a.75.75 0 11-1.06 1.06l-3-3a.75.75 0 010-1.06l3-3a.75.75 0 011.06 0z" clipRule="evenodd" />
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
                                    <_sendSuppertRequest
                                        setMode={setMode}
                                        onClose={onClose}
                                        onSendEmail={onSendEmail}

                                    />

                                )}

                                {/* Password Change Form */}
                                {mode === "password" && (
                                    <_passwordChange
                                        setMode={setMode}
                                        onClose={onClose}
                                        onPasswordChange={onPasswordChange} />
                                )}

                                {/* Logout Confirmation */}
                                {mode === "logout" && (
                                    <_safeLogout
                                        setMode={setMode}
                                        onClose={onClose}
                                        onSecureLogout={onSecureLogout} />
                                )}

                                {mode === "changeUserName" && (
                                    <_changeUserName
                                        onClose={onClose}
                                        setMode={setMode} />

                                )}

                                {mode === "emailChange" && (


                                    <_emailChange
                                        setMode={setMode} />

                                )}




                            </div>
                        </motion.div>
                    </div>
                </Dialog >
            )
            }

        </AnimatePresence >


    );
}