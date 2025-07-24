import React, { useState } from "react";
import {
    Box,
    Modal,
    Typography,
    TextField,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    IconButton,
    useTheme,
    CircularProgress,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import getUser from "../../../services/addUser";
import type { User } from "../../../Models/types";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../../utils/getLocalUser";

interface SearchUserModalProps {
    open: boolean;
    onClose: () => void;
    onSelectUser: (user: User) => void;
}

export function SearchUserModal({
    open,
    onClose,
    onSelectUser,
}: SearchUserModalProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [result, setResult] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const theme = useTheme();
    const currentUser = getCurrentUser();
    const navigate = useNavigate();
    const handleSearch = async () => {
        if (!searchTerm.trim()) return;

        setLoading(true);
        try {
            const user = await getUser(searchTerm.trim(), navigate);
            setResult(user); // null gelirse zaten aşağıda gösterilmeyecek
        } catch (error) {
            setResult(null);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSearch();
    };

    const handleSelect = (user: User) => {
        onSelectUser(user);
        setSearchTerm("");
        setResult(null);
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    bgcolor: theme.palette.background.paper,
                    borderRadius: 3,
                    boxShadow: 24,
                    p: 3,
                    width: { xs: "90%", sm: 420 },
                }}
            >
                {/* Header */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" fontWeight={600}>
                        Kullanıcı Ara
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Current User Card */}
                <Accordion elevation={1} sx={{ mb: 2 }}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="account-info-content"
                        id="account-info-header"

                    >
                        <Typography variant="h6" fontWeight={600}
                        >👤 Hesap Bilgileri</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box
                            p={2}
                            border={`1px solid ${theme.palette.divider}`}
                            borderRadius={2}
                            bgcolor={theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "#f9fafb"}
                        >
                            <Typography variant="body1" color="text.secondary" gutterBottom>
                                <strong>Kullanıcı Adı:</strong> {currentUser?.username}
                            </Typography>
                            <Typography variant="body1" color="text.secondary" gutterBottom>
                                <strong>Kullanıcı ID:</strong> {currentUser?.id}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                <strong>Kullanıcı E-posta:</strong> {currentUser?.email}
                            </Typography>
                        </Box>
                    </AccordionDetails>
                </Accordion>

                {/* Search Field */}
                <TextField
                    fullWidth
                    placeholder="Kullanıcı ID ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    size="small"
                    variant="outlined"
                    InputProps={{
                        endAdornment: (
                            <IconButton onClick={handleSearch}>
                                <SearchIcon />
                            </IconButton>
                        ),
                    }}
                    sx={{ mb: 2 }}
                />

                {/* Arama Sonucu */}
                {loading ? (
                    <Box display="flex" justifyContent="center" mt={3}>
                        <CircularProgress size={24} />
                    </Box>
                ) : result ? (
                    <List dense>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => handleSelect(result)}>
                                <ListItemText
                                    primary={`${result.username} (ID: ${result.id})`}
                                />
                            </ListItemButton>
                        </ListItem>
                    </List>
                ) : (
                    <Typography mt={2} textAlign="center" color="text.secondary">
                        Kullanıcı bulunamadı.
                    </Typography>
                )}
            </Box>
        </Modal>

    );
}
