import { useState, useRef, useEffect, type KeyboardEvent, type ChangeEvent } from "react";
import {
    Box,
    CircularProgress,
    Dialog,
    DialogContent,
    IconButton,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";

import { MessageBubble } from "./MessageBubble";
import { ChatHeader } from "./ChatHeader";
import type { Message, User } from "../../Models/types";
import getBackgrounds from "../../services/getBackgrounds";
import { useNavigate } from "react-router-dom";
import { apiConfig } from "../../connection";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";


interface ChatPanelProps {
    user: User;
    messages: Message[];
    onBack: () => void;
    showBackButton: boolean;
    onSendMessage: (content: string, file?: File | null) => void;  // Dosya parametresi eklendi
    isSubmitting: boolean
}

export const ChatPanel = ({
    user,
    messages,
    onBack,
    showBackButton,
    onSendMessage,
    isSubmitting
}: ChatPanelProps) => {
    const theme = useTheme();
    const [input, setInput] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
    const conn = apiConfig.connectionString;


    const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
    const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf", "image/gif"]; // Genişletilebilir

    // API'den arka plan resimleri için state
    const [backgrounds, setBackgrounds] = useState<{ lightModeBackground?: string; darkModeBackground?: string }>({});

    // Arka plan aç/kapa durumu, localStorage ile kalıcı
    const [showBackground, setShowBackground] = useState(() => {
        const stored = localStorage.getItem("showBackground");
        return stored ? stored === "true" : true;
    });
    const navigate = useNavigate();

    // API'den arka planları çek
    useEffect(() => {
        const fetchBackgrounds = async () => {
            const data = await getBackgrounds(navigate);
            if (data) {
                setBackgrounds(data);
            }
        };
        fetchBackgrounds();
    }, []);

    const toggleBackground = () => {
        setShowBackground((prev) => {
            localStorage.setItem("showBackground", String(!prev));
            return !prev;
        });
    };

    const messageEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Dosya seçildiğinde
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;

        if (!file) return;

        if (!ALLOWED_TYPES.includes(file.type)) {
            alert("Sadece JPG, PNG, GIF veya PDF dosyaları yüklenebilir.");
            e.target.value = "";
            setSelectedFile(null);
            setPreviewUrl(null);
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            alert("Dosya boyutu 100MB'dan büyük olamaz.");
            e.target.value = "";
            setSelectedFile(null);
            setPreviewUrl(null);
            return;
        }

        setSelectedFile(file);

        if (file.type.startsWith("image/")) {
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setPreviewUrl(null);
        }
    };

    // Dosya iptal etme
    const clearSelectedFile = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
    };

    const handleSend = () => {
        if (!input.trim() && !selectedFile) return;
        onSendMessage(input.trim(), selectedFile);
        setInput("");
        clearSelectedFile();
    };

    const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);

        // UTC zamanını al
        const utcHours = date.getUTCHours();

        // +3 saat ekle
        const adjustedDate = new Date(date);
        adjustedDate.setUTCHours(utcHours + 3);

        return adjustedDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false // İstersen true yapıp AM/PM ekleyebilirsin
        });
    };


    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return "Bugün";
        if (date.toDateString() === yesterday.toDateString()) return "Dün";

        return date.toLocaleDateString([], {
            month: "short",
            day: "numeric",
            year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
        });
    };

    const getCurrentUserId = () => {
        const storage = localStorage.getItem("user") || sessionStorage.getItem("user");
        return storage ? JSON.parse(storage)?.id : null;
    };

    const currentUserId = getCurrentUserId();

    // Arka plan resmi seçimi
    const backgroundImage = showBackground
        ? (theme.palette.mode === "light" ? backgrounds.lightModeBackground : backgrounds.darkModeBackground)
        : undefined;


    const getFileUrl = (
        fileUrl: string | { path?: string } | null | undefined
    ): string => {
        if (!fileUrl) return "";

        let rawPath = "";

        if (typeof fileUrl === "string") {
            // '[object Object]' metni varsa her yerde temizle
            rawPath = fileUrl.replace("[object Object]", "").trim();
        } else if (
            typeof fileUrl === "object" &&
            fileUrl !== null &&
            typeof fileUrl.path === "string"
        ) {
            rawPath = fileUrl.path.replace("[object Object]", "").trim();
        }

        if (!rawPath) return "";

        // Tam URL oluştur
        return rawPath.startsWith("http") ? rawPath : conn + rawPath;
    };


    return (
        <Box
            flex={1}
            display="flex"
            flexDirection="column"
            height="100%"
            sx={{
                bgcolor: "background.default",
                color: "text.primary",
            }}
        >
            {/* ChatHeader + Switch */}
            <Box display="flex" alignItems="center">
                <ChatHeader
                    user={user}
                    onBack={onBack}
                    showBackButton={showBackButton}
                    showBackground={showBackground}
                    onToggleBackground={toggleBackground}
                />
            </Box>

            {/* Message Area */}
            <Box
                flex={1}
                p={2}
                display="flex"
                flexDirection="column"
                overflow="auto"
                sx={{
                    ...(backgroundImage && {
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundSize: "cover",
                        backgroundAttachment: "fixed",
                        backgroundPosition: "center",
                    }),
                }}
            >
                {messages.map((msg, index, arr) => {
                    const isMine = msg.senderId === currentUserId;
                    const showDate =
                        index === 0 ||
                        formatDate(msg.timestamp) !== formatDate(arr[index - 1]?.timestamp);

                    return (
                        <Box
                            key={`${msg.id}-${index}`}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: isMine ? "flex-end" : "flex-start",
                                mb: 1.5,
                                mt: showDate ? 2 : 0,
                            }}
                        >
                            {showDate && (
                                <Box
                                    textAlign="center"
                                    width="100%"
                                    my={1}
                                    sx={{ position: "sticky", top: 0, zIndex: 1 }}
                                >
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            px: 2,
                                            py: 1,
                                            borderRadius: "20px",
                                            bgcolor: "background.paper",
                                            color: "text.secondary",
                                            display: "inline-block",
                                            boxShadow: 1,
                                            fontWeight: "medium",
                                            backdropFilter: "blur(4px)",
                                        }}
                                    >
                                        {formatDate(msg.timestamp)}
                                    </Typography>
                                </Box>
                            )}

                            <MessageBubble isMine={isMine}>
                                {/* Metin mesajı */}
                                {msg.text && (
                                    <Typography
                                        component="div"
                                        sx={{
                                            whiteSpace: "pre-wrap",
                                            wordBreak: "break-word",
                                            lineHeight: 1.4,
                                            fontSize: "0.95rem",
                                        }}
                                    >
                                        {msg.text}
                                    </Typography>
                                )}


                                {
                                    typeof msg.fileUrl === "string" &&
                                    msg.fileUrl.trim() !== "" &&
                                    msg.fileUrl !== "[object Object]" && (
                                        <Box mt={1}>
                                            {msg.fileUrl.endsWith(".pdf") ? (
                                                <a
                                                    href={msg.fileUrl.startsWith("http") ? msg.fileUrl : getFileUrl(msg.fileUrl)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group inline-flex items-center gap-2 transition-all duration-200"
                                                >
                                                    <PictureAsPdfIcon className="text-red-500" />
                                                    <span className="relative after:absolute after:left-0 after:-bottom-0.5 after:w-0 after:h-[2px] after:bg-red-400 after:transition-all after:duration-300 group-hover:after:w-full">
                                                        {msg.fileName || msg.fileUrl.split("/").pop()}
                                                    </span>
                                                </a>


                                            ) : (
                                                <>
                                                    <img
                                                        src={getFileUrl(msg.fileUrl)}
                                                        alt="Gönderilen görsel"
                                                        style={{
                                                            maxWidth: 180,
                                                            borderRadius: 8,
                                                            marginTop: 4,
                                                            cursor: "pointer",
                                                            boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
                                                        }}
                                                        onClick={() => setSelectedImageUrl(getFileUrl(msg.fileUrl))}
                                                    />

                                                    <Dialog
                                                        open={Boolean(selectedImageUrl)}
                                                        onClose={() => setSelectedImageUrl(null)}
                                                        maxWidth="md"
                                                        fullWidth
                                                        PaperProps={{
                                                            sx: {
                                                                backgroundColor: "#000",
                                                                boxShadow: "none",
                                                            },
                                                        }}
                                                    >
                                                        <DialogContent
                                                            sx={{
                                                                position: "relative",
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                                p: 0,
                                                            }}
                                                        >
                                                            <IconButton
                                                                onClick={() => setSelectedImageUrl(null)}
                                                                sx={{
                                                                    position: "absolute",
                                                                    top: 8,
                                                                    right: 8,
                                                                    color: "#fff",
                                                                    backgroundColor: "rgba(0,0,0,0.4)",
                                                                    "&:hover": { backgroundColor: "rgba(0,0,0,0.6)" },
                                                                }}
                                                            >
                                                                <CloseIcon />
                                                            </IconButton>
                                                            <img
                                                                src={selectedImageUrl ?? ""}
                                                                alt="Gönderilen Görsel"
                                                                style={{
                                                                    maxWidth: "100%",
                                                                    maxHeight: "80vh",
                                                                    borderRadius: 12,
                                                                }}
                                                            />
                                                        </DialogContent>
                                                    </Dialog>

                                                </>
                                            )}
                                        </Box>
                                    )}



                                {/* Saat ve okundu durumu */}
                                <Box display="flex" alignItems="center" gap={0.5} mt={0.5} sx={{ alignSelf: "flex-end", opacity: 0.8 }}>
                                    <Typography variant="caption" sx={{ fontSize: "0.65rem" }}>
                                        {formatTime(msg.timestamp)}
                                    </Typography>
                                    {isMine && (
                                        <Box sx={{ color: msg.isRead ? "success.main" : "inherit", fontSize: "0.75rem" }}>
                                            {msg.isRead ? "✓✓" : "✓"}
                                        </Box>
                                    )}
                                </Box>
                            </MessageBubble>
                        </Box>
                    );
                })}
                <div ref={messageEndRef}></div>
            </Box>

            {/* Message Input Area with file upload */}
            <Box
                display="flex"
                p={1.5}
                sx={{
                    bgcolor: "background.paper",
                    boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.05)",
                    borderTop: "1px solid",
                    borderColor: "divider",
                }}
            >
                {/* Dosya önizleme */}
                {selectedFile && (
                    <Box
                        mr={1}
                        display="flex"
                        alignItems="center"
                        gap={1}
                        sx={{
                            bgcolor: "action.hover",
                            borderRadius: "12px",
                            px: 2,
                            py: 1,
                            maxWidth: 200,
                            overflow: "hidden",
                        }}
                    >
                        {previewUrl ? (
                            <img
                                src={previewUrl}
                                alt="preview"
                                style={{ height: 40, borderRadius: 8, objectFit: "cover" }}
                            />
                        ) : (
                            <Typography
                                noWrap
                                sx={{
                                    maxWidth: 120,
                                }}
                            >
                                {selectedFile.name}
                            </Typography>
                        )}
                        <IconButton size="small" onClick={clearSelectedFile}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                )}

                {/* Dosya seçme butonu */}
                <input
                    type="file"
                    id="file-input"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                />
                <label htmlFor="file-input">
                    <IconButton
                        component="span"
                        size="large"
                        sx={{
                            mr: 1,
                            color: theme.palette.text.primary,
                        }}
                        aria-label="Dosya ekle"
                    >
                        <AttachFileIcon />
                    </IconButton>
                </label>

                {/* Mesaj input */}
                <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    placeholder="Mesaj yazın..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleInputKeyDown}
                    size="small"
                    sx={{
                        bgcolor: "action.hover",
                        borderRadius: "24px",
                        mr: 1,
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "24px",
                            padding: "8px 16px",
                            "& fieldset": {
                                border: "none",
                            },
                        },
                    }}
                    InputProps={{
                        sx: {
                            fontSize: "0.95rem",
                        },
                    }}
                />

                {/* Gönder butonu */}
                <IconButton
                    onClick={handleSend}
                    disabled={isSubmitting || (!input.trim() && !selectedFile)}
                    aria-label="Mesaj gönder"

                    sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        transition: "all 0.2s",
                        "&:hover": {
                            bgcolor: "primary.dark",
                        },
                        "&:disabled": {
                            bgcolor: "action.disabledBackground",
                            color: "action.disabled",
                        },
                    }}
                >                    {isSubmitting ? <CircularProgress size={24} color="inherit" /> : <SendIcon fontSize="small" />}

                </IconButton>
            </Box>
        </Box>
    );
};
