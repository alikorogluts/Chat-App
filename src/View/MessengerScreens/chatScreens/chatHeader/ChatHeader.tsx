// ChatHeader.tsx
import { Box, AppBar, Toolbar, IconButton, Typography, Badge, Avatar, Menu, MenuItem, Switch } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { useState } from "react";
import type { User } from "../../../../Models/types";
import _videoCall from "./_videoCall";

interface ChatHeaderProps {
    user: User;
    onBack?: () => void;
    showBackButton?: boolean;
    showBackground: boolean;
    onToggleBackground: () => void;
}

export const ChatHeader = ({
    user,
    onBack,
    showBackButton,
    showBackground,
    onToggleBackground,
}: ChatHeaderProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const formatLastSeen = (lastSeen?: string) => {
        if (!lastSeen) return "";//çevrimdışı
        const date = new Date(lastSeen);
        return `Son görülme ${date.toLocaleString("tr-TR", {
            hour: "2-digit",
            minute: "2-digit",
            day: "numeric",
            month: "short",
        })}`;
    };

    return (
        <>

            <AppBar
                position="static"
                sx={{
                    bgcolor: "transparent",
                    boxShadow: "none",
                    backdropFilter: "blur(12px)",
                    background: "rgba(255, 255, 255, 0.1)",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                }}
            >
                <Toolbar sx={{ px: { xs: 1, sm: 2 }, minHeight: "72px !important" }}>
                    {showBackButton && (
                        <IconButton
                            edge="start"
                            onClick={onBack}
                            sx={{
                                mr: 1,
                                backgroundColor: "rgba(255, 255, 255, 0.15)",
                                "&:hover": {
                                    backgroundColor: "rgba(255, 255, 255, 0.25)",
                                },
                                transition: "background-color 0.2s ease",
                                color: (theme) => theme.palette.mode === "light" ? "rgba(0, 0, 0, 0.7)" : "inherit",
                            }}
                        >
                            <ArrowBackIcon sx={{ fontSize: "1.25rem" }} />
                        </IconButton>

                    )}

                    <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        badgeContent={user.isOnline ? (
                            <FiberManualRecordIcon
                                sx={{
                                    color: "#44b700",
                                    fontSize: "14px",
                                    bgcolor: "white",
                                    borderRadius: "50%",
                                    boxShadow: "0 0 0 2px rgba(255,255,255,0.8)",
                                }} />
                        ) : null}
                    >
                        <Avatar
                            sx={{
                                bgcolor: "#818cf8",
                                width: 44,
                                height: 44,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                            }}
                        >
                            <Typography variant="h6" fontWeight={600}>
                                {user.username?.charAt(0).toUpperCase()}
                            </Typography>
                        </Avatar>
                    </Badge>

                    <Box sx={{ flexGrow: 1, ml: 2, overflow: "hidden" }}>
                        <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            sx={{
                                lineHeight: 1.3,
                                letterSpacing: "0.01em",
                                color: "text.primary",
                            }}
                        >
                            {user.username}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                display: "block",
                                color: "text.secondary",
                                fontWeight: 500,
                                fontSize: "0.75rem",
                            }}
                        >
                            {user.isOnline ? (
                                <Box component="span" sx={{ display: "flex", alignItems: "center" }}>
                                    <FiberManualRecordIcon sx={{
                                        color: "#44b700",
                                        fontSize: "0.8rem",
                                        mr: 0.5
                                    }} />
                                    {/* Çevrimiçi*/}
                                </Box>
                            ) : formatLastSeen(user.lastSeen)}
                        </Typography>
                    </Box>




                    <IconButton
                        color="inherit"
                        onClick={handleMenuOpen}
                        sx={{
                            ml: 1,
                            p: 1,
                            zIndex: 10,
                            backgroundColor: "rgba(255, 255, 255, 0.15)",
                            "&:hover": {
                                backgroundColor: "rgba(255, 255, 255, 0.25)",
                            },
                            transition: "background-color 0.2s ease"
                        }}
                    >
                        <MoreVertIcon sx={{ color: theme => theme.palette.text.primary }} />
                    </IconButton>




                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleMenuClose}
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        transformOrigin={{ vertical: "top", horizontal: "right" }}
                        PaperProps={{
                            sx: {
                                borderRadius: "12px",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                                backdropFilter: "blur(20px)",
                                background: "rgba(255, 255, 255, 0.85)",
                                minWidth: "200px",
                                overflow: "hidden",
                                "& .MuiMenuItem-root": {
                                    py: 1.5,
                                    px: 2,
                                    transition: "background-color 0.2s ease",
                                    "&:hover": {
                                        backgroundColor: "rgba(0, 0, 0, 0.05)",
                                    }
                                }
                            }
                        }}

                    >


                        <MenuItem>
                            <Typography variant="body2" mr={2} fontWeight={500} color="black">
                                Arka Plan Göster
                            </Typography>
                            <Switch
                                checked={showBackground}
                                onChange={onToggleBackground}
                                size="small"
                                color="primary" />
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar></>
    );
};