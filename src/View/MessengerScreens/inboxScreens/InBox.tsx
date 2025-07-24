// src/components/UserList/UserList.tsx
import { useState } from "react";
import {
    List,
    ListItemButton,
    ListItemAvatar,
    Avatar,
    Badge,
    Box,
    TextField,
    Typography,
    useTheme,
    Skeleton
} from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import SearchIcon from "@mui/icons-material/Search";
import type { User } from "../../../Models/types";
import type { InboxItem } from "../../../Models/ApiResponse";

interface UserListProps {
    onSelectUser: (user: User) => void;
    selectedUser: User | null;
    onClearUnread: (senderId: number) => void;
    inboxItems: InboxItem[];
    loading?: boolean;
}

export const UserList = ({
    onSelectUser,
    selectedUser,
    inboxItems,
    onClearUnread,
    loading = false
}: UserListProps) => {
    const [search, setSearch] = useState("");
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === "dark";

    const filteredUsers = [...inboxItems]
        .filter((u) => u.senderUsername.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => new Date(b.sendTime).getTime() - new Date(a.sendTime).getTime());

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
    const getFileMessage = (fileUrl: string): string => {
        const parts = fileUrl.split(".");
        const ext = parts.length > 1 ? parts.pop()?.toLowerCase() : null;

        const imageTypes = ["jpg", "jpeg", "png", "gif", "webp"];
        const pdfTypes = ["pdf"];
        const docTypes = ["doc", "docx"];
        const excelTypes = ["xls", "xlsx"];
        const zipTypes = ["zip", "rar", "7z"];

        if (!ext) return ` ${fileUrl}`;

        if (imageTypes.includes(ext)) return "📷 Resim gönderdi";
        if (pdfTypes.includes(ext)) return "📄 PDF dosyası gönderdi";
        if (docTypes.includes(ext)) return "📝 Word belgesi gönderdi";
        if (excelTypes.includes(ext)) return "📊 Excel dosyası gönderdi";
        if (zipTypes.includes(ext)) return "🗜️ Arşiv dosyası gönderdi";

        return `📎 ${ext.toUpperCase()} dosyası gönderdi`;
    };



    const bgColor = isDarkMode ? theme.palette.background.paper : "#ffffff";
    const hoverColor = isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)";
    const selectedColor = isDarkMode ? "rgba(66, 153, 225, 0.2)" : "rgba(66, 153, 225, 0.1)";
    const textColor = isDarkMode ? theme.palette.text.primary : "#2d3748";
    const secondaryTextColor = isDarkMode ? theme.palette.text.secondary : "#718096";
    const borderColor = isDarkMode ? theme.palette.divider : "#e2e8f0";
    const unreadBg = theme.palette.primary.main;
    const onlineColor = isDarkMode ? "#4ade80" : "#22c55e";

    return (
        <Box
            width="100%"
            display="flex"
            flexDirection="column"
            bgcolor={bgColor}
            height="100%"
        >
            <Box p={2} sx={{ position: "relative" }}>
                <TextField
                    fullWidth
                    placeholder="Kişi ara..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    size="small"
                    sx={{
                        bgcolor: isDarkMode ? "rgba(255,255,255,0.08)" : "#f1f5f9",
                        borderRadius: "20px",
                        "& fieldset": { border: "none" },
                        "& input": {
                            padding: "10px 14px",
                            color: textColor,
                            "::placeholder": {
                                color: secondaryTextColor
                            }
                        },
                    }}
                    InputProps={{
                        startAdornment: <SearchIcon sx={{ color: secondaryTextColor, mr: 1 }} />,
                    }}
                />
            </Box>

            {loading ? (
                <Box p={2}>
                    {[...Array(5)].map((_, index) => (
                        <Box key={index} display="flex" alignItems="center" mb={2}>
                            <Skeleton variant="circular" width={48} height={48} sx={{ mr: 2 }} />
                            <Box flex={1}>
                                <Skeleton width="60%" height={24} />
                                <Skeleton width="80%" height={20} />
                            </Box>
                            <Skeleton variant="circular" width={24} height={24} />
                        </Box>
                    ))}
                </Box>
            ) : filteredUsers.length === 0 ? (
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    height="100%"
                    p={3}
                    textAlign="center"
                >
                    <Box
                        component="video"
                        src="Notfound.mp4"

                        sx={{ width: 120, height: 120, mb: 2, filter: isDarkMode ? "invert(0.8)" : "none" }}
                    />
                    <Typography variant="h6" sx={{ color: textColor, mb: 1 }}>
                        Sohbet bulunamadı
                    </Typography>
                    <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                        Aradığınız kişi listede yok veya henüz sohbet başlatmadınız
                    </Typography>
                </Box>
            ) : (
                <List sx={{
                    overflowY: "auto",
                    flexGrow: 1,
                    "&::-webkit-scrollbar": { width: "6px" },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: isDarkMode ? "#4a5568" : "#cbd5e1",
                        borderRadius: "3px",
                    },
                }}>
                    {filteredUsers.map((u) => (
                        <ListItemButton
                            key={u.senderId}
                            onClick={() => {
                                onSelectUser({ id: u.senderId, username: u.senderUsername, isOnline: u.senderOnline, token: '' });
                                onClearUnread(u.senderId);
                            }}
                            selected={selectedUser?.id === u.senderId}
                            sx={{
                                py: 1.5,
                                px: 2,
                                borderBottom: `1px solid ${borderColor}`,
                                "&.Mui-selected": {
                                    backgroundColor: selectedColor,
                                    "&:hover": { backgroundColor: selectedColor }
                                },
                                "&:hover": { backgroundColor: hoverColor, cursor: "pointer" },
                                transition: "background-color 0.2s ease",
                            }}
                        >
                            {u.senderUsername?.[0] ? (<ListItemAvatar>
                                <Badge
                                    overlap="circular"
                                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                                    badgeContent={u.senderOnline ? (
                                        <FiberManualRecordIcon
                                            sx={{ color: onlineColor, fontSize: "14px", bgcolor: bgColor, borderRadius: "50%" }}
                                        />
                                    ) : null}
                                >
                                    <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 48, height: 48, fontSize: "1.2rem", fontWeight: 600 }}>
                                        {u.senderUsername[0]}
                                    </Avatar>
                                </Badge>
                            </ListItemAvatar>) : null}


                            <Box sx={{ flex: 1, minWidth: 0, mr: 1 }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography fontWeight={u.unreadCount > 0 ? 700 : 600} sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: textColor, fontSize: "0.95rem" }}>
                                        {u.senderUsername}
                                    </Typography>
                                    <Typography variant="caption" sx={{ whiteSpace: "nowrap", fontWeight: u.unreadCount > 0 ? 700 : 500, color: u.unreadCount > 0 ? theme.palette.primary.main : secondaryTextColor, fontSize: "0.75rem" }}>
                                        {formatTime(u.sendTime)}
                                    </Typography>
                                </Box>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        fontWeight: u.unreadCount > 0 ? 600 : 500,
                                        color: u.unreadCount > 0 ? textColor : secondaryTextColor,
                                        fontSize: "0.85rem",
                                        mt: 0.5
                                    }}
                                >
                                    {(() => {
                                        return u.lastMessage?.trim()

                                            ? getFileMessage(u.lastMessage)
                                            : "Yeni bir mesajınız var";
                                    })()}
                                </Typography>



                            </Box>

                            {u.unreadCount > 0 && (
                                <Box sx={{ bgcolor: unreadBg, borderRadius: "50%", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Typography variant="caption" sx={{ color: "white", fontSize: "0.7rem", fontWeight: 700 }}>
                                        {u.unreadCount}
                                    </Typography>
                                </Box>
                            )}
                        </ListItemButton>
                    ))}
                </List>
            )}
        </Box>
    );
};
