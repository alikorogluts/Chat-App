import React, { useRef, useState, useEffect } from 'react';
import { getCurrentUser } from '../../../../../utils/getLocalUser';
import toast from 'react-hot-toast';
import sendCode from '../../../../../services/sendCode';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import VerificationCodeStep from '../../../../AcountScreens/registerScreens/VerifyCode';
import { Button, CircularProgress } from '@mui/material';
import changeEmail from '../../../../../services/changeEmail';
import { useNavigate } from 'react-router-dom';

type ModeType = "menu" | "email" | "password" | "logout" | "changeUserName" | "emailChange";

interface _emailChangeProps {
    setMode: (mode: ModeType) => void;
}

function _emailChange({ setMode }: _emailChangeProps) {
    const [approval, setApproval] = useState(false);
    const [step, setStep] = useState<'wait' | 'verify'>('wait');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [code, setCode] = useState<string[]>(Array(6).fill(''));
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
    const [verificationLoading] = useState(false);
    const [resendTime, setResendTime] = useState(0);
    const [newEmail, setNewEmail] = useState('');
    const [password, setPassword] = useState('');
    const user = getCurrentUser();

    useEffect(() => {
        if (resendTime > 0) {
            const interval = setInterval(() => {
                setResendTime((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [resendTime]);

    const handleCodeChange = (value: string, idx: number) => {
        const newCode = [...code];
        newCode[idx] = value;
        setCode(newCode);
        if (value && idx < 5 && inputsRef.current[idx + 1]) {
            inputsRef.current[idx + 1]?.focus();
        }
    };
    const navigate = useNavigate();

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
        if (e.key === 'Backspace' && !code[idx] && idx > 0 && inputsRef.current[idx - 1]) {
            inputsRef.current[idx - 1]?.focus();
        }
    };

    const handleSendCode = async () => {
        if (!newEmail.trim() || !password.trim()) {
            toast.error("Lütfen tüm alanları doldurun.");

            return;
        }

        setIsSubmitting(true);
        try {

            const result = await sendCode(newEmail, 2);
            if (result?.success) {
                toast.success("Doğrulama kodu gönderildi.");
                setStep("verify");
                setResendTime(60);
                setCode(Array(6).fill(''));
                if (inputsRef.current[0]) inputsRef.current[0].focus();
                localStorage.getItem
            } else {
                toast.error(result.message);
            }
        } catch (err: any) {

        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResendCode = () => {
        handleSendCode();
    };

    const handleVerify = async () => {
        const joinedCode = code.join('');
        if (joinedCode.length !== 6) {
            toast.error("Lütfen 6 haneli kodu girin");
            return;
        }

        try {
            const result = await changeEmail(password, newEmail, navigate, joinedCode);

            if (result?.success) {
                toast.success(result.message || "Doğrulama kodu gönderildi.");
                setStep("verify");
                setResendTime(60);
                setCode(Array(6).fill(''));
                if (user) {
                    user.email = newEmail
                    localStorage.setItem("user", JSON.stringify(user));
                }
                toast.success("Kod doğrulandı ve e-posta güncellendi!");
                setMode("menu");
                if (inputsRef.current[0]) {
                    inputsRef.current[0].focus();
                }
            }
            else {
                toast.error(result.message || "hata");
            }
        } catch (err: any) {


        } finally {
            setIsSubmitting(false);
        }

    };

    if (!user?.email) {
        return <div className="text-lg text-red-800 text-center">Kullanıcı bilgileri alınamadı. Lütfen tekrar giriş yapınız.</div>;
    }

    if (!approval) {
        return (
            <div className="flex flex-col items-center justify-center p-6 max-w-md mx-auto bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-200 rounded-xl shadow-lg text-center border border-green-200 dark:border-green-800 transition-all animate-fadeIn hover:scale-[1.01]">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-800 shadow flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8 text-green-600 dark:text-green-300">
                        <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                        <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                    </svg>
                </div>
                <h2 className="text-lg md:text-xl font-semibold mb-2">E-Posta Güncelleme Uyarısı</h2>
                <p className="text-sm md:text-base mb-4 opacity-90">
                    Yeni e-posta adresinizi onaylamanız için <strong>doğrulama kodu</strong> gönderilecektir. İşleme devam etmek için "Anladım" butonuna tıklayın.
                </p>
                <button
                    onClick={() => setApproval(true)}
                    className="px-5 py-2 mt-2 rounded-md bg-green-600 text-white font-medium hover:bg-green-500 transition-colors shadow-md"
                >
                    Anladım
                </button>
            </div>
        );
    }

    if (step === "verify") {
        return (
            <div className="max-w-md mx-auto">
                <VerificationCodeStep
                    email={newEmail}
                    code={code}
                    onCodeChange={handleCodeChange}
                    onKeyDown={handleKeyDown}
                    resendTime={resendTime}
                    onResendCode={handleResendCode}
                    loading={verificationLoading}
                    inputsRef={inputsRef}
                />
                <Button
                    fullWidth
                    variant="contained"
                    disabled={verificationLoading || code.join('').length !== 6}
                    onClick={handleVerify}
                    sx={{
                        mt: 3,
                        py: 1.5,
                        borderRadius: 2,
                        background: 'linear-gradient(45deg, #22c55e, #16a34a)',
                        color: 'white',
                        fontWeight: 700,
                        '&:hover': {
                            background: '#15803d',
                        },
                    }}
                >
                    {verificationLoading ? <CircularProgress size={24} color="inherit" /> : "E-Postayı Doğrula"}
                </Button>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-md mx-auto px-4"
        >
            {/* Geri Butonu ve Başlık */}
            <div className="mb-6">
                <button
                    onClick={() => setMode("menu")}
                    className="text-sm text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white flex items-center"
                >
                    <ArrowLeftIcon className="w-4 h-4 mr-1" /> Geri
                </button>
                <h2 className="text-xl font-bold text-zinc-800 dark:text-white mt-2">
                    Yeni E-posta Girin
                </h2>

                {/* Mevcut E-posta Kutusu */}
                <div className="my-3 p-4 rounded-md border border-emerald-400 bg-emerald-50 dark:bg-emerald-900/10 shadow-sm">
                    <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-300 mb-1">
                        📧 Mevcut E-posta Hesabınız
                    </h3>
                    <p className="text-base font-medium text-emerald-900 dark:text-emerald-100">
                        {user.email}
                    </p>
                </div>
            </div>

            {/* Form Alanları */}
            <div className="space-y-4">
                {/* Yeni E-posta */}
                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-1">
                        Yeni E-posta
                    </label>
                    <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-white focus:ring-2 focus:ring-green-500"
                        placeholder="example@site.com"
                    />
                </div>

                {/* Şifre */}
                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-1">
                        Şifreniz
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-white focus:ring-2 focus:ring-green-500"
                        placeholder="Şifrenizi girin"
                    />
                </div>

                {/* Gönder Butonu */}
                <Button
                    fullWidth
                    variant="contained"
                    disabled={isSubmitting}
                    onClick={handleSendCode}
                    sx={{
                        mt: 2,
                        py: 1.5,
                        borderRadius: 2,
                        background: 'linear-gradient(to right, #22c55e, #16a34a)',
                        color: 'white',
                        fontWeight: 700,
                        '&:hover': {
                            background: '#15803d',
                        },
                    }}
                >
                    {isSubmitting ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        "Kodu Gönder"
                    )}
                </Button>
            </div>
        </motion.div>
    );
}

export default _emailChange;
