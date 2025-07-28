import { useState, useEffect, type KeyboardEvent, type ChangeEvent } from "react";
import {
    Box,
    CircularProgress,
    IconButton,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";

import { ChatHeader } from "../chatHeader/ChatHeader";
import type { Message, User } from "../../../../Models/types";
import getBackgrounds from "../../../../services/getBackgrounds";
import { useNavigate } from "react-router-dom";
import _messages from "./_subChatPanel/_messages";


interface ChatPanelProps {
    user: User;
    messages: Message[];
    onBack: () => void;
    showBackButton: boolean;
    onSendMessage: (content: string, file?: File | null) => void;  // Dosya parametresi eklendi
    isSubmitting: boolean;
    updateOrDeleteMessage: (messageId: number, newText?: string) => void;

}

export const ChatPanel = ({
    user,
    messages,
    onBack,
    showBackButton,
    onSendMessage,
    isSubmitting,
    updateOrDeleteMessage
}: ChatPanelProps) => {
    const theme = useTheme();
    const [input, setInput] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const navigate = useNavigate();

    const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
    const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf", "image/gif"]; // Genişletilebilir
    const [backgrounds, setBackgrounds] = useState<{ mobileModeBackground?: string; webModeBackground?: string }>({});
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [showBackground, setShowBackground] = useState(() => {
        const stored = localStorage.getItem("showBackground");
        return stored ? stored === "true" : true;
    });
    const [backgroundImage, setBackgroundImage] = useState<string | undefined>(undefined);

    useEffect(() => {
        const handleResize = () => {
            const newIsMobile = window.innerWidth < 768;
            setIsMobile(newIsMobile);

            const updatedBackground = showBackground
                ? (newIsMobile ? backgrounds.mobileModeBackground : backgrounds.webModeBackground)
                : undefined;

            setBackgroundImage(updatedBackground); // ✅ Doğru şekilde ayrı backgroundImage state'ine atıyoruz
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // ilk yüklemede tetikle
        return () => window.removeEventListener("resize", handleResize);
    }, [showBackground, backgrounds]);

    useEffect(() => {
        const fetchBackgrounds = async () => {
            const data = await getBackgrounds(navigate);
            if (data) {
                setBackgrounds(data);

                // API'den veri geldiğinde backgroundImage'ı da güncelle
                const updatedBackground = showBackground
                    ? (isMobile ? data.mobileModeBackground : data.webModeBackground)
                    : undefined;

                setBackgroundImage(updatedBackground);
            }
        };
        fetchBackgrounds();
    }, [navigate, showBackground, isMobile]);

    const toggleBackground = () => {
        setShowBackground((prev) => {
            localStorage.setItem("showBackground", String(!prev));
            return !prev;
        });
    };



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

            <_messages
                updateOrDeleteMessage={updateOrDeleteMessage}
                messages={messages}
                backgroundImage={backgroundImage}
            />

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
