import { useState, useEffect, useMemo } from "react";
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    useMediaQuery,
    ThemeProvider,
    createTheme,
    CssBaseline,
    Fab,

} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";

import { UserList } from "./InBox";
import { ChatPanel } from "./ChatPanel";
import { SearchUserModal } from "./SearchUserModal";

import { type User, type Message } from "../../Models/types";
import { getMessages } from "../../services/getMessagesApi";
import { sendMessageApi } from "../../services/sendMessageApi";
import { useSignalR } from "../../hook/chatSignalIR";
import { fetchInbox } from "../../services/inBoxApi";

import { useNavigate } from "react-router-dom";
import type { PaletteMode } from "@mui/material";
import type { InboxItem } from "../../Models/ApiResponse";

interface MessengerProps {
    user: { id: number; username: string };
    onLogout: () => void;
}

const getDesignTokens = (mode: PaletteMode) => ({
    palette: {
        mode,
        ...(mode === "light"
            ? {
                primary: { main: "#4f46e5" },
                secondary: { main: "#ec4899" },
                background: {
                    default: "#f8fafc",
                    paper: "#ffffff",
                    chat: "#f1f5f9",
                },
                text: {
                    primary: "#1e293b",
                    secondary: "#64748b",
                },
                divider: "#e2e8f0",
                appBar: {
                    main: "#ffffff",
                    text: "#1e293b",
                },
            }
            : {
                primary: { main: "#818cf8" },
                secondary: { main: "#f472b6" },
                background: {
                    default: "#0f172a",
                    paper: "#1e293b",
                    chat: "#1e293b",
                },
                text: {
                    primary: "#f1f5f9",
                    secondary: "#cbd5e1",
                },
                divider: "#334155",
                appBar: {
                    main: "#1e293b",
                    text: "#f1f5f9",
                },
            }),
    },
    typography: {
        fontFamily: "'Inter', sans-serif",
        h6: {
            fontWeight: 700,
            fontSize: "1.25rem",
        },
        body1: {
            fontSize: "0.875rem",
        },
    },
    shape: {
        borderRadius: 12,
    },
});

export function Messenger({ onLogout }: MessengerProps) {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [darkMode, setDarkMode] = useState<PaletteMode>("light");
    const systemPrefersDark = useMediaQuery("(prefers-color-scheme: dark)");
    const isTablet = useMediaQuery("(min-width:768px) and (max-width:1024px)");
    const isDesktop = useMediaQuery("(min-width:1025px)");

    const theme = useMemo(() => createTheme(getDesignTokens(darkMode)), [darkMode]);

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [inboxItems, setInboxItems] = useState<InboxItem[]>([]);



    // localStorage
    const savedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
    const currentUser = savedUser ? JSON.parse(savedUser) : null;
    const currentUserId: number | undefined = currentUser?.id;

    const { messages, fetchMessages } = getMessages();
    const [localMessages, setLocalMessages] = useState<Message[]>(messages);

    const navigate = useNavigate();

    const toggleDarkMode = () => {
        setDarkMode((prev) => (prev === "light" ? "dark" : "light"));
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            setDarkMode(savedTheme as PaletteMode);
        } else {
            setDarkMode(systemPrefersDark ? "dark" : "light");
        }
    }, [systemPrefersDark]);

    useEffect(() => {
        localStorage.setItem("theme", darkMode);
    }, [darkMode]);

    useSignalR(currentUserId?.toString() || "", (message: any) => {
        const fixedMessage: Message = {
            id: message.messageId,
            senderId: message.senderId,
            receiverId: message.receiverId,
            content: message.text,
            timestamp: message.sendTime || new Date().toISOString(),
            isRead: message.isRead,
        };

        if (
            selectedUser &&
            (fixedMessage.senderId === selectedUser.id ||
                fixedMessage.receiverId === selectedUser.id)
        ) {
            setLocalMessages((prev) => [...prev, fixedMessage]);
        }

        const contactId =
            fixedMessage.senderId === currentUserId
                ? fixedMessage.receiverId
                : fixedMessage.senderId;

        setInboxItems((prevInbox) => {
            const updated = [...prevInbox];
            const index = updated.findIndex((item) => item.senderId === contactId);
            if (index !== -1) {
                updated[index] = {
                    ...updated[index],
                    lastMessage: fixedMessage.content,
                    sendTime: fixedMessage.timestamp,
                    isRead: false,
                    unreadCount:
                        fixedMessage.senderId === currentUserId
                            ? 0
                            : updated[index].unreadCount + 1,
                };
            } else {
                updated.unshift({
                    senderId: contactId,
                    senderUsername: "Bilinmeyen",
                    senderOnline: true,
                    lastMessage: fixedMessage.content,
                    sendTime: fixedMessage.timestamp,
                    isRead: false,
                    unreadCount: fixedMessage.senderId === currentUserId ? 0 : 1,
                });
            }
            return updated;
        });
    });

    useEffect(() => {
        setLocalMessages(messages);
    }, [messages]);

    useEffect(() => {
        if (selectedUser && currentUserId) {
            fetchMessages(currentUserId, selectedUser.id);
        }
    }, [selectedUser, fetchMessages, currentUserId]);

    useEffect(() => {
        const loadInbox = async () => {
            if (!currentUserId) return;
            const data = await fetchInbox(currentUserId);
            setInboxItems(data);
        };
        loadInbox();
    }, [currentUserId]);

    const handleSelectUser = (user: User) => {
        setSelectedUser(user);
    };

    const handleAddUserToChat = (user: User) => {

        setSelectedUser({
            ...user,

        });
    };

    const handleClearUnread = (senderId: number) => {
        setInboxItems((prev) =>
            prev.map((item) =>
                item.senderId === senderId
                    ? { ...item, unreadCount: 0, isRead: true }
                    : item
            )
        );
    };

    const handleLogout = () => {
        onLogout();
        navigate("/login");
    };


    const handleSendMessage = async (content: string) => {

        if (!currentUserId || !selectedUser || !selectedUser.id) {
            console.warn("Seçili kullanıcı yok, mesaj gönderilemez!");
            return;
        }
        try {
            const newMessage = await sendMessageApi(
                content,
                currentUserId,
                selectedUser.id
            );

            const fixedMessage: Message = {
                id: newMessage.messageId,
                senderId: newMessage.senderId,
                receiverId: newMessage.receiverId,
                content: newMessage.text,
                timestamp: newMessage.sendTime || new Date().toISOString(),
                isRead: newMessage.isRead,
            };

            setLocalMessages((prev) => [...prev, fixedMessage]);

            const contactId = selectedUser.id;
            setInboxItems((prevInbox) => {
                const updated = [...prevInbox];
                const index = updated.findIndex((item) => item.senderId === contactId);
                if (index !== -1) {
                    updated[index] = {
                        ...updated[index],
                        lastMessage: fixedMessage.content,
                        sendTime: fixedMessage.timestamp,
                        isRead: true,
                        unreadCount: 0,
                    };
                } else {
                    updated.unshift({
                        senderId: contactId,
                        senderUsername: selectedUser.username,
                        senderOnline: selectedUser.isOnline,
                        lastMessage: fixedMessage.content,
                        sendTime: fixedMessage.timestamp,
                        isRead: true,
                        unreadCount: 0,
                    });
                }
                return updated;
            });
        } catch (error) {
            console.error("Mesaj gönderirken hata:", error);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
                height="100vh"
                display="flex"
                bgcolor={theme.palette.background.default}
                sx={{
                    "& ::-webkit-scrollbar": { width: "6px" },
                    "& ::-webkit-scrollbar-thumb": {
                        backgroundColor: theme.palette.mode === "light" ? "#c5c5c5" : "#4a5568",
                        borderRadius: "3px",
                    },
                }}
            >
                {(isDesktop || isTablet || !selectedUser) && (
                    <Box
                        width={{ xs: "100%", sm: "40%", md: isTablet ? "35%" : "30%" }}
                        display="flex"
                        flexDirection="column"
                        bgcolor={theme.palette.background.paper}
                        sx={{
                            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                            zIndex: 10,
                            borderRight: `1px solid ${theme.palette.divider}`,
                        }}
                    >
                        {/* HEADER */}
                        <AppBar
                            position="static"
                            sx={{
                                bgcolor: theme.palette.background.paper,
                                color: theme.palette.text.primary,
                                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                                borderBottom: `1px solid ${theme.palette.divider}`,
                            }}
                        >

                            <Toolbar sx={{ minHeight: "72px!important", px: 2 }}>
                                {/* Sol: Başlık */}
                                <Typography variant="h6" fontWeight="700" sx={{ flexGrow: 1 }}>
                                    Mesajlar
                                </Typography>

                                {/* Kullanıcı bilgileri butonu */}


                                {/* Tema geçiş */}
                                <IconButton onClick={toggleDarkMode} color="inherit" size="large" sx={{ mr: 1 }}>
                                    {theme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
                                </IconButton>

                                {/* Çıkış */}
                                <IconButton color="inherit" onClick={handleLogout} size="large">
                                    <ExitToAppIcon />
                                </IconButton>
                            </Toolbar>

                        </AppBar>

                        {/* KULLANICI LİSTESİ */}
                        <Box sx={{ overflowY: "auto", flex: 1 }}>
                            <UserList
                                selectedUser={selectedUser}
                                onSelectUser={handleSelectUser}
                                onClearUnread={handleClearUnread}
                                inboxItems={inboxItems}
                            />
                        </Box>

                        {/* KULLANICI EKLEME BUTONLARI */}
                        {!isDesktop && !selectedUser && (
                            <Fab
                                color="primary"
                                aria-label="search-user"
                                onClick={() => setIsSearchOpen(true)}
                                sx={{
                                    position: "fixed",
                                    bottom: 24,
                                    right: 24,
                                    zIndex: 1000,
                                    boxShadow: 3,
                                }}
                            >
                                <PersonSearchIcon />
                            </Fab>
                        )}

                        {isDesktop && (
                            <Box px={2} py={1} display="flex" justifyContent="center" borderTop={`1px solid ${theme.palette.divider}`}>
                                <IconButton
                                    onClick={() => setIsSearchOpen(true)}
                                    color="primary"
                                    size="large"
                                    sx={{
                                        bgcolor: theme.palette.mode === "dark" ? "#334155" : "#e0e7ff",
                                        borderRadius: 2,
                                        p: 1.2,
                                        transition: "all 0.3s",
                                        "&:hover": {
                                            bgcolor: theme.palette.mode === "dark" ? "#475569" : "#c7d2fe",
                                        },
                                    }}
                                >
                                    <PersonSearchIcon />
                                </IconButton>
                            </Box>
                        )}

                        {/* MODAL */}
                        <SearchUserModal
                            open={isSearchOpen}
                            onClose={() => setIsSearchOpen(false)}
                            onSelectUser={handleAddUserToChat}
                        />
                    </Box>

                )}
                {selectedUser && (
                    <ChatPanel
                        user={selectedUser}
                        messages={localMessages}
                        onBack={() => setSelectedUser(null)}
                        showBackButton={!isDesktop && !isTablet}
                        onSendMessage={handleSendMessage}
                    />
                )}
            </Box>
        </ThemeProvider>
    );
}
