import { useState, useRef, useEffect, type KeyboardEvent, type ChangeEvent } from "react";
import {
    Box,
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

interface ChatPanelProps {
    user: User;
    messages: Message[];
    onBack: () => void;
    showBackButton: boolean;
    onSendMessage: (content: string, file?: File | null) => void;  // Dosya parametresi eklendi
}

export const ChatPanel = ({
    user,
    messages,
    onBack,
    showBackButton,
    onSendMessage,
}: ChatPanelProps) => {
    const theme = useTheme();
    const [input, setInput] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

    const formatTime = (timestamp: string) =>
        new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

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

                                {/* Dosya varsa göster */}
                                {msg.fileUrl && (
                                    <Box mt={1}>
                                        {msg.fileUrl.endsWith(".pdf") ? (
                                            <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">
                                                📎 {msg.fileName || msg.fileUrl.split("/").pop()} (PDF)
                                            </a>
                                        ) : (
                                            <img
                                                src={msg.fileUrl}
                                                alt={msg.fileName || msg.fileUrl.split("/").pop()}
                                                style={{ maxWidth: 180, borderRadius: 8, marginTop: 4 }}
                                            />
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
                    disabled={!input.trim() && !selectedFile}
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
                >
                    <SendIcon fontSize="small" />
                </IconButton>
            </Box>
        </Box>
    );
};
