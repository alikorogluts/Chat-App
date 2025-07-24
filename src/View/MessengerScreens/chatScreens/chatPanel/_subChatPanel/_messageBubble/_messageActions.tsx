import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
    IconButton,
    Menu,
    MenuItem,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField
} from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";
import deleteMessage from "../../../../../../services/deleteMessage";
import { useNavigate } from "react-router-dom";
import updateMessage from "../../../../../../services/updateMessage";

interface MessageActionsProps {
    messageId: number;
    messageContent: string;
    updateOrDeleteMessage: (messageId: number, newText?: string) => void;

}

function MessageActions({
    messageId,
    messageContent,
    updateOrDeleteMessage
}: MessageActionsProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [updatedContent, setUpdatedContent] = useState(messageContent);
    const [isUpdating, setIsUpdating] = useState(false);
    const navigate = useNavigate();
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = async () => {
        try {
            const result = await deleteMessage(messageId, navigate);
            console.log(result);
            if (result?.success) {
                updateOrDeleteMessage(messageId);
                toast.success(result.message || "Mesaj başarıyla silindi");
            } else {
                toast.error(result?.message || "Mesaj silinemedi");
            }
        } catch {
            toast.error("Beklenmeyen bir hata oluştu");
        }
        setDeleteConfirmOpen(false);
        handleClose();
    };

    const handleUpdate = async () => {
        if (!updatedContent.trim()) {
            toast.error("Mesaj boş olamaz");
            return;
        }

        if (updatedContent === messageContent) {
            toast("Değişiklik yapılmadı");
            setUpdateDialogOpen(false);
            return;
        }

        setIsUpdating(true);
        try {
            const result = await updateMessage(messageId, updatedContent, navigate);
            if (result?.success) {
                updateOrDeleteMessage(messageId, updatedContent);
                toast.success(result.message || "Mesaj güncellendi");
            } else {
                toast.error(result?.message || "Güncelleme başarısız");
            }
        } catch {
            toast.error("Güncelleme sırasında hata oluştu");
        } finally {
            setIsUpdating(false);
            setUpdateDialogOpen(false);
        }
        handleClose();
    };

    return (
        <>
            {/* Actions Menu */}
            <IconButton size="small" onClick={handleClick}>
                <MoreVertIcon fontSize="small" />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <MenuItem
                    onClick={() => setDeleteConfirmOpen(true)}
                    className="text-red-600 hover:bg-red-50"
                >
                    Sil
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        setUpdateDialogOpen(true);
                        setUpdatedContent(messageContent);
                    }}
                    className="text-blue-600 hover:bg-blue-50"
                >
                    Düzenle
                </MenuItem>
            </Menu>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
                className="backdrop-blur-sm"
            >
                <div className="bg-white p-6 rounded-lg">
                    <DialogTitle className="font-bold text-gray-800 p-0">
                        Mesajı Sil
                    </DialogTitle>
                    <DialogContent className="py-4 px-0">
                        <p className="text-gray-600">
                            Bu mesajı silmek istediğinize emin misiniz?
                            <br />
                            <span className="font-medium">Bu işlem geri alınamaz.</span>
                        </p>
                    </DialogContent>
                    <DialogActions className="flex justify-end space-x-3 pt-2">
                        <Button
                            onClick={() => setDeleteConfirmOpen(false)}
                            className="text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg"
                        >
                            İptal
                        </Button>
                        <Button
                            onClick={handleDelete}
                            className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
                            variant="contained"
                        >
                            Sil
                        </Button>
                    </DialogActions>
                </div>
            </Dialog>

            {/* Update Message Dialog */}
            <Dialog
                open={updateDialogOpen}
                onClose={() => !isUpdating && setUpdateDialogOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <div className="bg-white p-6 rounded-lg">
                    <DialogTitle className="font-bold text-gray-800 p-0">
                        Mesajı Düzenle
                    </DialogTitle>
                    <DialogContent className="py-4 px-0">
                        <TextField
                            autoFocus
                            fullWidth
                            multiline
                            minRows={3}
                            maxRows={6}
                            value={updatedContent}
                            onChange={(e) => setUpdatedContent(e.target.value)}
                            variant="outlined"
                            className="rounded-lg"
                        />
                    </DialogContent>
                    <DialogActions className="flex justify-end space-x-3 pt-2">
                        <Button
                            onClick={() => setUpdateDialogOpen(false)}
                            disabled={isUpdating}
                            className="text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg"
                        >
                            İptal
                        </Button>
                        <Button
                            onClick={handleUpdate}
                            disabled={isUpdating}
                            className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                            variant="contained"
                        >
                            {isUpdating ? "Güncelleniyor..." : "Güncelle"}
                        </Button>
                    </DialogActions>
                </div>
            </Dialog>
        </>
    );
}

export default MessageActions;