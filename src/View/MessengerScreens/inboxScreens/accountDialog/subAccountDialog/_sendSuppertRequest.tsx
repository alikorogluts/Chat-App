import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

type ModeType = "menu" | "email" | "password" | "logout" | "changeUserName" | "emailChange";

interface _sendSuppertRequestProps {
    setMode: (mode: ModeType) => void;
    onSendEmail: (emailSubject: string, emailText: string, file?: File) => void;
    onClose: () => void;
}


function _sendSuppertRequest({ setMode, onSendEmail, onClose }: _sendSuppertRequestProps) {

    const [emailText, setEmailText] = useState("");
    const [emailSubject, setEmailSubject] = useState("");
    const [isDisabled, setIsDisabled] = useState(true);
    // State'lere şunları ekleyin:
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Görsel yükleme fonksiyonu
    const MAX_FILE_SIZE_MB = 10;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];

        // 🔍 Dosya tipi kontrolü
        if (!validImageTypes.includes(file.type)) {
            alert("Lütfen sadece resim dosyası seçiniz (jpg, png, webp, gif).");
            return;
        }

        // 📏 Boyut kontrolü (MB cinsinden)
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > MAX_FILE_SIZE_MB) {
            alert(`Resim dosyası ${MAX_FILE_SIZE_MB} MB'tan büyük olamaz.`);
            return;
        }

        // ✅ Uygunsa yükle
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };


    // Görsel kaldırma
    const handleImageRemove = () => {
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
        setImageFile(null);
        setImagePreview(null);
    };




    const handleSendEmail = () => {
        if (emailSubject.trim() === "") {
            toast.error("Lütfen bir konu girin");
            return;
        }
        if (emailText.trim() === "") {
            toast.error("Lütfen bir mesaj yazın");
            return;
        }
        onSendEmail(emailSubject, emailText, imageFile ?? undefined);
        onClose();
    };
    useEffect(() => {

        const maxLength = 1000;
        const rawLength = emailText.trim().length;

        // Buton, karakter 5’ten azsa veya maksimuma ulaşmışsa devre dışı olur
        setIsDisabled(rawLength < 100 || rawLength >= maxLength);
    }, [emailText]);

    const lengthText = () => {
        const maxLength = 100;
        const extremeLength = 300;
        const length = emailText.trim().length;

        if (length === 0) return null;

        const strengthTexts = [
            "Çok kısa (0–25%)",
            "Yetersiz (25–50%)",
            "Orta seviye (50–75%)",
            "İyi (75–100%)",
            "Tamamlandı ✅",
            "⚠️ Karakter sınırı aşıldı"
        ];

        const strengthColors = [
            "bg-red-500",
            "bg-orange-500",
            "bg-yellow-500",
            "bg-green-400",
            "bg-green-600",
            "bg-red-600"
        ];

        // Seviye hesaplama
        let strengthLevel = 0;
        if (length > 20) strengthLevel++;
        if (length > 40) strengthLevel++;
        if (length > 60) strengthLevel++;
        if (length >= maxLength) strengthLevel++;
        if (length > extremeLength) strengthLevel++;

        const progressWidth = `${Math.min((strengthLevel + 1) * 20, 100)}%`;
        const colorClass = strengthColors[strengthLevel] ?? "bg-red-600";
        const textClass = (() => {
            if (strengthLevel <= 1) return "text-red-500";
            if (strengthLevel === 2) return "text-yellow-500";
            if (strengthLevel === 3) return "text-green-500";
            if (strengthLevel === 4) return "text-green-600";
            return "text-red-600";
        })();

        return (
            <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-zinc-600 dark:text-zinc-400">Yazı Seviyesi:</span>
                    <span className={`text-xs font-medium ${textClass}`}>
                        {strengthTexts[strengthLevel]}
                    </span>
                    {length < maxLength ? (
                        <span className="text-xs text-zinc-600 dark:text-zinc-400">
                            Kalan karakter: <strong>{maxLength - length}</strong>
                        </span>
                    ) : (
                        <span className="text-xs text-red-600 dark:text-red-400 font-semibold">
                            {length > extremeLength ? "Çok fazla karakter girdiniz!" : "Limiti aştınız!"}
                        </span>
                    )}
                </div>

                <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-1.5 overflow-hidden">
                    <div
                        className={`h-1.5 transition-all duration-300 ease-in-out rounded-full ${colorClass}`}
                        style={{ width: progressWidth }}
                    />
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

                    {lengthText()}

                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Destekleyici Görsel (isteğe bağlı)
                    </label>

                    <div className="flex items-center gap-4">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="block text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-lg file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 dark:file:bg-zinc-800
                       file:text-blue-700 dark:file:text-zinc-200
                       hover:file:bg-blue-100 dark:hover:file:bg-zinc-700"
                        />
                        {imagePreview && (
                            <div className="relative">
                                <img
                                    src={imagePreview}
                                    alt="Önizleme"
                                    className="w-20 h-20 object-cover rounded-lg shadow-md border border-zinc-300 dark:border-zinc-600"
                                />
                                <button
                                    type="button"
                                    onClick={handleImageRemove}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center shadow-lg hover:bg-red-600"
                                    title="Kaldır"
                                >
                                    ×
                                </button>
                            </div>
                        )}
                    </div>
                </div>





                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={() => setMode("menu")}
                        className="px-5 py-2.5 border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                        İptal
                    </button>
                    <button
                        onClick={handleSendEmail}
                        disabled={isDisabled}
                        className={`px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg transition-opacity shadow-md flex items-center ${isDisabled
                            ? "opacity-50 cursor-not-allowed grayscale"
                            : "hover:opacity-90"
                            }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                        Gönder
                    </button>

                </div>
            </div>
        </motion.div>
    )
}

export default _sendSuppertRequest