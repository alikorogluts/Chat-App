import { Box, Dialog, DialogContent, IconButton, Typography } from '@mui/material';
import { MessageBubble } from './_messageBubble/_messageBubble';
import { useEffect, useRef, useState } from 'react';
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CloseIcon from "@mui/icons-material/Close";
import { apiConfig } from '../../../../../connection';
import type { Message } from '../../../../../Models/types';
import { getCurrentUser } from '../../../../../utils/getLocalUser';
import _messageActions from './_messageBubble/_messageActions';


interface messagesProps {

    messages: Message[];
    backgroundImage?: string;
    updateOrDeleteMessage: (messageId: number, newText?: string) => void;
}

function messages({ messages, backgroundImage, updateOrDeleteMessage }: messagesProps) {
    const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

    const conn = apiConfig.connectionString;
    const currentUser = getCurrentUser();
    const messageEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);




    const getFileUrl = (
        fileUrl: string | { path?: string } | null | undefined
    ): string => {
        if (!fileUrl) return "";

        let rawPath = "";

        if (typeof fileUrl === "string") {
            // '[object Object]' metni varsa her yerde temizle
            rawPath = fileUrl.replace("[object Object]", "").trim();
        } else if (
            typeof fileUrl === "object" &&
            fileUrl !== null &&
            typeof fileUrl.path === "string"
        ) {
            rawPath = fileUrl.path.replace("[object Object]", "").trim();
        }

        if (!rawPath) return "";

        // Tam URL oluştur
        return rawPath.startsWith("http") ? rawPath : conn + rawPath;
    };

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return "Bugün";
        if (date.toDateString() === yesterday.toDateString()) return "Dün";

        return date.toLocaleDateString([], {
            month: "short",
            day: "numeric",
            year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
        });
    };
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


    return (
        <Box
            flex={1}
            p={2}
            display="flex"
            flexDirection="column"
            overflow="auto"
            sx={{
                ...(backgroundImage && {
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundAttachment: "fixed",
                    backgroundPosition: "center",
                }),
            }}
        >
            {messages.map((msg, index, arr) => {
                const isMine = msg.senderId === currentUser?.id;
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
                                sx={{ position: "sticky", top: 0, zIndex: 1 }}
                            >
                                <Typography
                                    variant="caption"
                                    sx={{
                                        px: 2,
                                        py: 1,
                                        borderRadius: "20px",
                                        bgcolor: "background.paper",
                                        color: "text.secondary",
                                        display: "inline-block",
                                        boxShadow: 1,
                                        fontWeight: "medium",
                                        backdropFilter: "blur(4px)",
                                    }}
                                >
                                    {formatDate(msg.timestamp)}
                                </Typography>
                            </Box>
                        )}

                        <MessageBubble isMine={isMine}>




                            {
                                typeof msg.fileUrl === "string" &&
                                msg.fileUrl.trim() !== "" &&
                                msg.fileUrl !== "[object Object]" && (
                                    <Box mt={1}>
                                        {msg.fileUrl.endsWith(".pdf") ? (
                                            <a
                                                href={msg.fileUrl.startsWith("http") ? msg.fileUrl : getFileUrl(msg.fileUrl)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group inline-flex items-center gap-2 transition-all duration-200"
                                            >
                                                <PictureAsPdfIcon className="text-red-500" />
                                                <span className="relative after:absolute after:left-0 after:-bottom-0.5 after:w-0 after:h-[2px] after:bg-red-400 after:transition-all after:duration-300 group-hover:after:w-full">
                                                    {msg.fileName || msg.fileUrl.split("/").pop()}
                                                </span>
                                            </a>


                                        ) : (
                                            <>
                                                <img
                                                    src={getFileUrl(msg.fileUrl)}
                                                    alt="Gönderilen görsel"
                                                    style={{
                                                        maxWidth: 180,
                                                        borderRadius: 8,
                                                        marginTop: 4,
                                                        cursor: "pointer",
                                                        boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
                                                    }}
                                                    onClick={() => setSelectedImageUrl(getFileUrl(msg.fileUrl))}
                                                />

                                                <Dialog
                                                    open={Boolean(selectedImageUrl)}
                                                    onClose={() => setSelectedImageUrl(null)}
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
                                                            onClick={() => setSelectedImageUrl(null)}
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
                                                            src={selectedImageUrl ?? ""}
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
                            {/* Metin mesajı */}
                            {msg.text && (
                                <Typography
                                    component="div"
                                    sx={{
                                        whiteSpace: "pre-wrap",
                                        wordBreak: "break-word",
                                        lineHeight: 1.4,
                                        fontSize: "0.9999rem",
                                        marginTop: 1,
                                    }}
                                >
                                    {msg.text}
                                </Typography>


                            )}




                            {/* Saat ve okundu durumu */}
                            <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                mt={0.5}
                                sx={{ opacity: 0.8 }}
                            >
                                {/* Sol taraf: zaman */}
                                <Typography variant="caption" sx={{ fontSize: "0.65rem" }}>
                                    {formatTime(msg.timestamp)}
                                </Typography>

                                {/* Sağ taraf: okundu simgesi + üç nokta menü */}
                                {isMine && (
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        gap={0.5}
                                        sx={{ fontSize: "0.75rem", color: msg.isRead ? "success.main" : "inherit" }}
                                    >
                                        {/*msg.isRead ? "✓✓" : "✓"*/}
                                        <_messageActions
                                            updateOrDeleteMessage={updateOrDeleteMessage}

                                            messageId={msg.id}
                                            messageContent={msg.text}
                                        />


                                    </Box>
                                )}
                            </Box>



                        </MessageBubble>
                    </Box>
                );
            })}


            <div ref={messageEndRef}></div>
        </Box>
    )
}

export default messages