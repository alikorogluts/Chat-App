// src/components/UserProfileDialog.tsx
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Box,
    DialogActions,
    Button,
} from "@mui/material";

interface UserProfileDialogProps {
    open: boolean;
    onClose: () => void;
    user: {
        id: number;
        username: string;
        password?: string;
    };
}

export const UserProfileDialog = ({ open, onClose, user }: UserProfileDialogProps) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Kullanıcı Bilgileri</DialogTitle>
            <DialogContent>
                <Box mb={1}>
                    <Typography variant="subtitle2">ID:</Typography>
                    <Typography>{user.id}</Typography>
                </Box>
                <Box mb={1}>
                    <Typography variant="subtitle2">Kullanıcı Adı:</Typography>
                    <Typography>{user.username}</Typography>
                </Box>
                {user.password && (
                    <Box mb={1}>
                        <Typography variant="subtitle2">Şifre:</Typography>
                        <Typography>{"*".repeat(user.password.length)}</Typography>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Kapat</Button>
            </DialogActions>
        </Dialog>
    );
};
