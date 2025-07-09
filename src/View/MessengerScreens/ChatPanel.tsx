import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import {
    Box,
    IconButton,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { MessageBubble } from "./MessageBubble";
import { ChatHeader } from "./ChatHeader";
import type { Message, User } from "../../Models/types";
import getBackgrounds from "../../services/getBackgrounds"; // Servis dosyanın doğru yolu

interface ChatPanelProps {
    user: User;
    messages: Message[];
    onBack: () => void;
    showBackButton: boolean;
    onSendMessage: (content: string) => void;
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

    // API'den arka plan resimleri için state
    const [backgrounds, setBackgrounds] = useState<{ lightModeBackground?: string; darkModeBackground?: string }>({});

    // Arka plan aç/kapa durumu, localStorage ile kalıcı
    const [showBackground, setShowBackground] = useState(() => {
        const stored = localStorage.getItem("showBackground");
        return stored ? stored === "true" : true;
    });

    // API'den arka planları çek
    useEffect(() => {
        const fetchBackgrounds = async () => {
            const data = await getBackgrounds();
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

    const handleSend = () => {
        if (!input.trim()) return;
        onSendMessage(input.trim());
        setInput("");
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

        if (date.toDateString() === today.toDateString()) return "Today";
        if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

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
                bgcolor: 'background.default',
                color: 'text.primary',
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
                        backgroundSize: 'cover',
                        backgroundAttachment: 'fixed',
                        backgroundPosition: 'center',
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
                                    sx={{ position: 'sticky', top: 0, zIndex: 1 }}
                                >
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            px: 2,
                                            py: 1,
                                            borderRadius: "20px",
                                            bgcolor: 'background.paper',
                                            color: 'text.secondary',
                                            display: "inline-block",
                                            boxShadow: 1,
                                            fontWeight: 'medium',
                                            backdropFilter: 'blur(4px)',
                                        }}
                                    >
                                        {formatDate(msg.timestamp)}
                                    </Typography>
                                </Box>
                            )}

                            <MessageBubble isMine={isMine}>
                                <Typography
                                    component="div"
                                    sx={{
                                        whiteSpace: "pre-wrap",
                                        wordBreak: "break-word",
                                        lineHeight: 1.4,
                                        fontSize: '0.95rem',
                                    }}
                                >
                                    {msg.content}
                                </Typography>

                                <Box
                                    display="flex"
                                    alignItems="center"
                                    gap={0.5}
                                    mt={0.5}
                                    sx={{
                                        alignSelf: "flex-end",
                                        opacity: 0.8,
                                        transition: 'opacity 0.2s',
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            fontSize: "0.65rem",
                                        }}
                                    >
                                        {formatTime(msg.timestamp)}
                                    </Typography>
                                    {isMine && (
                                        <Box
                                            sx={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                color: msg.isRead ? "success.main" : "inherit",
                                                fontSize: '0.75rem',
                                            }}
                                        >
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

            {/* Message Input Area */}
            <Box
                display="flex"
                p={1.5}
                sx={{
                    bgcolor: 'background.paper',
                    boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)',
                    borderTop: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleInputKeyDown}
                    size="small"
                    sx={{
                        bgcolor: 'action.hover',
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
                <IconButton
                    onClick={handleSend}
                    disabled={!input.trim()}
                    aria-label="Send message"
                    sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        transition: "all 0.2s",
                        "&:hover": {
                            bgcolor: 'primary.dark',
                        },
                        "&:disabled": {
                            bgcolor: 'action.disabledBackground',
                            color: 'action.disabled',
                        },
                    }}
                >
                    <SendIcon fontSize="small" />
                </IconButton>
            </Box>
        </Box>
    );
};