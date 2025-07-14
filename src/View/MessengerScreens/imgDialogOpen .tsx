import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    IconButton,
    Box,

} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const MessageFileDisplay: React.FC<{ msg: any }> = ({ msg }) => {
    const [imgDialogOpen, setImgDialogOpen] = useState(false);

    const handleImageOpen = () => setImgDialogOpen(true);
    const handleImageClose = () => setImgDialogOpen(false);

    return (
        <>
            {msg.fileUrl && (
                <Box mt={1}>
                    {msg.fileUrl.endsWith(".pdf") ? (
                        <a
                            href={msg.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: "none", fontWeight: 500 }}
                        >
                            📎 {msg.fileName || msg.fileUrl.split("/").pop()} (PDF)
                        </a>
                    ) : (
                        <>
                            <img
                                src={msg.fileUrl}
                                alt={msg.fileName || msg.fileUrl.split("/").pop()}
                                style={{
                                    maxWidth: 180,
                                    borderRadius: 8,
                                    marginTop: 4,
                                    cursor: "pointer",
                                    boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
                                }}
                                onClick={handleImageOpen}
                            />

                            <Dialog
                                open={imgDialogOpen}
                                onClose={handleImageClose}
                                maxWidth="md"
                                fullWidth
                                PaperProps={{
                                    sx: {
                                        backgroundColor: "#000",
                                        boxShadow: "none",
                                    },
                                }}
                            >
                                <DialogContent
                                    sx={{
                                        position: "relative",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        p: 0,
                                    }}
                                >
                                    <IconButton
                                        onClick={handleImageClose}
                                        sx={{
                                            position: "absolute",
                                            top: 8,
                                            right: 8,
                                            color: "#fff",
                                            backgroundColor: "rgba(0,0,0,0.4)",
                                            "&:hover": { backgroundColor: "rgba(0,0,0,0.6)" },
                                        }}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                    <img
                                        src={msg.fileUrl}
                                        alt="Gönderilen Görsel"
                                        style={{
                                            maxWidth: "100%",
                                            maxHeight: "80vh",
                                            borderRadius: 12,
                                        }}
                                    />
                                </DialogContent>
                            </Dialog>
                        </>
                    )}
                </Box>
            )}
        </>
    );
};

export default MessageFileDisplay;
