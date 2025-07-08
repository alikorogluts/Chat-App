import { useState, useEffect } from 'react';
import {
    Box, TextField, Button, Typography, Paper,
    Checkbox, FormControlLabel, useMediaQuery, Alert
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";   // <-- buraya ekle
import login from '../../services/loginApi';

interface Props {
    onLogin: (user: { id: number; username: string }) => void;
}

export default function Login({ onLogin }: Props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const navigate = useNavigate();  // <-- navigate hook

    useEffect(() => {
        const saved = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (saved) {
            const parsed = JSON.parse(saved);
            onLogin(parsed);
        }
    }, [onLogin]);

    const handleRegister = () => {
        navigate("/register");  // SPA içinde register sayfasına yönlendirme
    };

    const handleLogin = async () => {
        setErrorMessage('');
        if (!username.trim() || !password.trim()) {
            setErrorMessage('Lütfen kullanıcı adı ve şifre girin.');
            return;
        }

        try {
            const result = await login({
                userName: username,
                password: password
            });

            const user = result.user;

            if (!user || !user.id || !user.username) {
                throw new Error('Geçersiz kullanıcı verisi.');
            }

            const safeUser = {
                id: user.id,
                username: user.username,
                token: user.token
            };

            if (remember) {
                localStorage.setItem('user', JSON.stringify(safeUser));
            } else {
                sessionStorage.setItem('user', JSON.stringify(safeUser));
                localStorage.removeItem('user');
            }

            onLogin(safeUser);
            setPassword('');
        } catch (error) {
            setErrorMessage('Giriş başarısız oldu — kullanıcı adı veya şifre yanlış olabilir.');
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
            <Paper
                elevation={4}
                sx={{
                    p: 4,
                    width: isMobile ? '90%' : 360,
                    maxWidth: '100%',
                }}
            >
                <Typography variant="h5" textAlign="center" gutterBottom>
                    🔐 Giriş Yap
                </Typography>

                {errorMessage && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {errorMessage}
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
                    autoComplete="current-password"
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                        />
                    }
                    label="Beni hatırla"
                />

                <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={handleLogin}
                >
                    Giriş Yap
                </Button>
                <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={handleRegister}
                >
                    Kayıt Ol
                </Button>
            </Paper>
        </Box>
    );
}
