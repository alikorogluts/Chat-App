import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useState } from 'react';
import changeUserName from '../../../../../services/changeUserName';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getCurrentUser } from '../../../../../utils/getLocalUser';

type ModeType = "menu" | "email" | "password" | "logout" | "changeUserName" | "emailChange";

interface _changeUserNameProps {
    setMode: (mode: ModeType) => void;
    onClose: () => void;
}

function _changeUserName({ setMode, onClose }: _changeUserNameProps) {
    const [errorMessage, setErrorMessage] = useState("");
    const [newUserName, setNewUserName] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const user = getCurrentUser();

    const handleUserNameChange = async () => {
        if (!newUserName) {
            setErrorMessage("Kullanıcı adı kısmı boş olamaz");
            return;
        }
        if (newUserName.length < 3) {
            setErrorMessage("Kullanıcı adı en az 3 karakter almalıdır");
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await changeUserName(newUserName, password, navigate);
            if (result?.success) {
                toast.success(result.message || "Kullanıcı adı değiştirildi");
                if (user) {
                    user.username = newUserName;
                    localStorage.setItem("user", JSON.stringify(user));
                }
                onClose();
            } else {
                toast.error(result.message);
            }
        } catch (err: any) {


        } finally {
            setIsSubmitting(false);
        }
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
                <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">
                    Kullanıcı Adı Değiştir
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                    <div className="my-2 p-4 rounded-md border border-green-300 bg-green-50 shadow-sm">
                        <h3 className="text-lg font-semibold text-green-800 mb-1">👤 Mevcut Kullanıcı Adınız</h3>
                        <p className="text-green-900 text-shadow-sm text-base font-medium">
                            {user?.username}
                        </p>
                    </div>



                    <br />

                    <input
                        type="text"
                        placeholder="Yeni kullanıcı adınızı girin"
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                        className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Şifre
                    </label>
                    <input
                        type="password"
                        placeholder="Şifrenizi girin"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                </div>

                {errorMessage && (
                    <div className="md:col-span-2 text-red-500 text-sm py-2 px-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
                        {errorMessage}
                    </div>
                )}

                <div className="md:col-span-2 flex justify-end mt-3">
                    <button
                        onClick={handleUserNameChange}
                        disabled={isSubmitting}
                        className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity shadow-md flex items-center disabled:opacity-50"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        {isSubmitting ? "Güncelleniyor..." : "Güncelle"}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

export default _changeUserName;
