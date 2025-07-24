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
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


import { UserList } from "./inboxScreens/InBox";
import { ChatPanel } from "./chatScreens/chatPanel/ChatPanel";
import { SearchUserModal } from "./inboxScreens/SearchUserModal";

import { type User, type Message } from "../../Models/types";
import { getMessages } from "../../services/getMessagesApi";
import { sendMessageApi } from "../../services/sendMessageApi";
import { useSignalR } from "../../signalR/chatSignalIR";
import { fetchInbox } from "../../services/inBoxApi";

import { useNavigate } from "react-router-dom";
import type { PaletteMode } from "@mui/material";
import type { InboxItem } from "../../Models/ApiResponse";
import { apiConfig } from "../../connection";
import { AccountDialog } from "./inboxScreens/accountDialog/AccountDialog";
import sendMail from "../../services/sendMail";
import changePassword from "../../services/changePassword";
import toast, { Toaster } from "react-hot-toast";

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
    const navigate = useNavigate();
    const [accountDialogOpen, setAccountDialogOpen] = useState(false);

    const openAccountDialog = () => setAccountDialogOpen(true);
    const closeAccountDialog = () => setAccountDialogOpen(false); const savedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
    const currentUser = savedUser ? JSON.parse(savedUser) : null;

    const [isSubmitting, setIsSubmitting] = useState(false);



    const handlePasswordChange = async (newPassword: string, oldPassword: string) => {
        closeAccountDialog();
        const result = await changePassword(newPassword, oldPassword, navigate);

        if (result) {
            showResult(result);
        } else {
            toast.error(result);
        }

    };

    const handleSendEmail = async (subject: string, body: string) => {
        closeAccountDialog();
        const result = await sendMail(subject, body, navigate);

        if (result) {
            showResult(result);
        } else {
            toast.error("Mail gönderimi başarısız oldu.");
        }
    };
    const showResult = (result: { success: boolean; message: string }) => {
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
    };



    const handleSecureLogout = () => {
        closeAccountDialog();
        handleLogout();
    };

    const handleLogout = () => {
        onLogout();
        navigate("/login");
    };
    const updateOrDeleteMessage = (messageId: number, newText?: string) => {
        console.log(localMessages);
        setLocalMessages((prev) =>
            newText === undefined
                ? prev.filter((msg) => msg.id !== messageId) // Silme
                : prev.map((msg) =>
                    msg.id === messageId ? { ...msg, text: newText } : msg // Güncelleme
                )
        );
    };

    // localStorage

    useSignalR(currentUser?.id?.toString() || "", (message) => {


        const fixedMessage: Message = {
            id: message.messageId || 0, // ID alanı doğrudan eşleşti
            senderId: message.senderId,
            receiverId: message.receiverId,
            text: message.text,
            fileUrl:
                typeof message.fileUrl === "string" && message.fileUrl.trim() !== ""
                    ? message.fileUrl.startsWith("http")
                        ? message.fileUrl
                        : apiConfig.connectionString + message.fileUrl
                    : "",
            senderName: message.senderName,
            fileName: message.fileUrl?.split("/").pop() || "", // daha önce message.text olabilir diye kontrol vardı, artık sabit
            timestamp: message.timestamp ?? new Date().toISOString(),
            isRead: message.isRead ?? false,
        };


        // Mesaj açık konuşma penceresine aitse listeye ekle
        if (
            selectedUser &&
            (fixedMessage.senderId === selectedUser.id ||
                fixedMessage.receiverId === selectedUser.id)
        ) {
            setLocalMessages((prev) => [...prev, fixedMessage]);
        }

        const contactId =
            fixedMessage.senderId === currentUser?.id
                ? fixedMessage.receiverId
                : fixedMessage.senderId;


        setInboxItems((prevInbox) => {
            const updated = [...prevInbox];
            const index = updated.findIndex((item) => item.senderId === contactId);

            if (index !== -1) {
                updated[index] = {
                    ...updated[index],
                    lastMessage: fixedMessage.text || fixedMessage.fileUrl || "Yeni bir mesajınız var", sendTime: fixedMessage.timestamp,
                    isRead: false,
                    fileUrl: fixedMessage.fileUrl,
                    fileName: fixedMessage.fileName,
                    unreadCount:
                        fixedMessage.senderId === currentUser?.id ? 0 : updated[index].unreadCount + 1,
                };
            } else {
                updated.unshift({
                    senderId: contactId,
                    senderUsername: fixedMessage.senderName || fixedMessage.receiverId.toString() + " Idli kullanıcı", // İstersen mesaj.senderUsername kullan
                    senderOnline: true, // Başlangıçta true, SignalR’dan değişecek
                    lastMessage: fixedMessage.text || fixedMessage.fileUrl || "Yeni bir mesajınız var",


                    sendTime: fixedMessage.timestamp,
                    isRead: false,
                    unreadCount: fixedMessage.senderId === currentUser?.id ? 0 : 1,
                    fileUrl: fixedMessage.fileUrl,
                    fileName: fixedMessage.fileName,

                });
            }
            console.log(localMessages);




            return updated;
        });
    }, setInboxItems, navigate, updateOrDeleteMessage);
    const { messages, fetchMessages } = getMessages(navigate);
    const [localMessages, setLocalMessages] = useState<Message[]>(messages);


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





    useEffect(() => {
        setLocalMessages(messages);
    }, [messages]);

    useEffect(() => {
        if (selectedUser && currentUser?.id) {
            fetchMessages(currentUser?.id, selectedUser.id);
        }
    }, [selectedUser, fetchMessages, (currentUser?.id)]);

    useEffect(() => {
        const loadInbox = async () => {
            if (!currentUser?.id) return;
            const data = await fetchInbox(currentUser?.id, navigate);
            setInboxItems(data);
        };
        loadInbox();
    }, [(currentUser?.id)]);

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




    const handleSendMessage = async (content: string, file?: File | null) => {
        setIsSubmitting(true);
        if (!currentUser?.id || !selectedUser?.id) {
            return;
        }

        try {
            const newMessage = await sendMessageApi(
                content,
                currentUser?.id,
                selectedUser.id,
                navigate,
                file || undefined,

                // File varsa gönder, yoksa undefined
            );

            if (newMessage) {

                const fixedMessage: Message = {
                    id: newMessage.messageId,
                    senderId: newMessage.senderId,
                    receiverId: newMessage.receiverId,
                    text: newMessage.text,
                    timestamp: (() => {
                        const now = new Date();
                        now.setHours(now.getHours() - 3);
                        return now.toISOString();
                    })(),
                    isRead: newMessage.isRead,
                    fileName: newMessage.fileName,
                    fileUrl: newMessage.fileUrl
                };


                setLocalMessages((prev) => [...prev, fixedMessage]);
                const lastMessageText =
                    fixedMessage.text ||
                    fixedMessage.fileName ||
                    fixedMessage.fileUrl ||
                    "Yeni bir mesajınız var";

                const contactId = selectedUser.id;
                setInboxItems((prevInbox) => {
                    const updated = [...prevInbox];
                    const index = updated.findIndex((item) => item.senderId === contactId);
                    if (index !== -1) {
                        updated[index] = {
                            ...updated[index],
                            lastMessage: lastMessageText,
                            sendTime: fixedMessage.timestamp,
                            isRead: true,
                            unreadCount: 0,
                        };
                    } else {
                        updated.unshift({
                            senderId: contactId,
                            senderUsername: selectedUser.username,
                            senderOnline: selectedUser.isOnline,
                            lastMessage: lastMessageText,
                            sendTime: fixedMessage.timestamp,
                            isRead: true,
                            unreadCount: 0,
                            fileUrl: fixedMessage.fileUrl,
                            fileName: fixedMessage.fileName
                        });

                    }
                    return updated;
                });
            }
        }
        catch (error) {
        }
        finally {
            setIsSubmitting(false);
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
                <Toaster
                    position="top-right"
                    gutter={12} // toasts arası boşluk
                    containerStyle={{
                        top: 20,
                        right: 20,
                        left: 20,
                        maxWidth: "100vw",
                        padding: "0 16px",
                    }}
                    toastOptions={{
                        style: {
                            fontSize: "clamp(16px, 2.5vw, 18px)", // mobilde büyür, desktopta dengeli
                            padding: "clamp(12px, 3vw, 20px)",
                            borderRadius: "8px",
                            background: "#1f2937", // zinc-800 gibi koyu arka plan
                            color: "#fff",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                        },
                        success: {
                            iconTheme: {
                                primary: "#22c55e", // yeşil
                                secondary: "#fff",
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: "#ef4444", // kırmızı
                                secondary: "#fff",
                            },
                        },
                    }}
                />
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




                                {/* Tema geçiş */}
                                <IconButton onClick={toggleDarkMode} color="inherit" size="large" sx={{ mr: 1 }}>
                                    {theme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
                                </IconButton>

                                {/* Kullanıcı bilgileri butonu */}

                                <IconButton color="inherit" onClick={openAccountDialog} size="large">
                                    <AccountCircleIcon />
                                </IconButton>

                                <AccountDialog
                                    open={accountDialogOpen}
                                    onClose={closeAccountDialog}
                                    onPasswordChange={handlePasswordChange}
                                    onSendEmail={handleSendEmail}
                                    onSecureLogout={handleSecureLogout}
                                />
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
                        isSubmitting={isSubmitting}
                        updateOrDeleteMessage={updateOrDeleteMessage}
                    />
                )}
            </Box>
        </ThemeProvider>
    );
}
