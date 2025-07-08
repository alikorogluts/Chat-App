import { useState } from "react";
import {
    Box, TextField, Button, Typography, Paper,
    Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { registerApi } from "../../services/registerApi";

interface Props {
    onRegisterSuccess: (user: { id: number; username: string }) => void;
}

export function Register({ onRegisterSuccess }: Props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    const handleRegister = async () => {
        setErrorMessage("");
        setSuccessMessage("");

        if (!username.trim() || !password.trim() || !passwordConfirm.trim()) {
            setErrorMessage("Lütfen tüm alanları doldurun.");
            return;
        }

        if (password !== passwordConfirm) {
            setErrorMessage("Şifreler eşleşmiyor.");
            return;
        }

        try {
            // Yeni çağrı şekli: (password, username)
            const result = await registerApi(password, username);

            if (result?.message === "Kayıt işlemi başarılı" && result.userId && result.userName) {
                setSuccessMessage("Kayıt başarılı! Giriş yapabilirsiniz.");
                // userId string, number'a çeviriyoruz
                onRegisterSuccess({ id: Number(result.userId), username: result.userName });
            } else {
                throw new Error("Kayıt başarısız.");
            }
        } catch (err) {
            setErrorMessage("Kayıt sırasında hata oluştu.");
        }
    };

    return (
        <Box
            display="flex"
            height="100vh"
            width="100vw"
            justifyContent="center"
            alignItems="center"
            p={0}
            m={0}
        >
            <Paper elevation={4} sx={{ p: 4, width: 360, maxWidth: "100%" }}>
                <Typography variant="h5" textAlign="center" gutterBottom>
                    📝 Kayıt Ol
                </Typography>

                {errorMessage && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {errorMessage}
                    </Alert>
                )}

                {successMessage && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {successMessage}
                    </Alert>
                )}

                <TextField
                    label="Kullanıcı Adı"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                />

                <TextField
                    label="Şifre"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                />

                <TextField
                    label="Şifre Tekrar"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    autoComplete="new-password"
                />

                <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleRegister}>
                    Kayıt Ol
                </Button>
                <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={() => navigate("/login")}>
                    Zaten Kayıtlı Hesabım Var
                </Button>
            </Paper>
        </Box>
    );
}
