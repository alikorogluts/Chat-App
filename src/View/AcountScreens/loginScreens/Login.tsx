import { useState, useEffect } from 'react';
import {
    Box, TextField, Button, Typography, Paper,
    Checkbox, FormControlLabel, useMediaQuery, Alert,
    IconButton, InputAdornment, Divider
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import login from '../../../services/loginApi';
import ForgetPassword from './ForgetPassword';

interface Props {
    onLogin: (user: { id: number; username: string; }) => void;
}

export default function Login({ onLogin }: Props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const navigate = useNavigate();

    useEffect(() => {
        const saved = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (saved) {
            const parsed = JSON.parse(saved);
            onLogin(parsed);
        }
    }, [onLogin]);

    const handleRegister = () => {
        navigate("/register");
    };

    const handleLogin = async () => {
        setErrorMessage("");
        if (!email.trim() || !password.trim()) {
            setErrorMessage("Lütfen eposta ve şifre girin.");
            return;
        }

        try {
            const result = await login({ email, password });
            const user = result.user;

            if (!user || !user.id || !user.username) {
                throw new Error("Geçersiz kullanıcı verisi.");
            }



            // Kullanıcı bilgilerini sakla
            const safeUser = {
                id: user.id,
                username: user.username,
                email: user.email,
            };

            if (remember) {
                localStorage.setItem("user", JSON.stringify(safeUser));
            } else {
                sessionStorage.setItem("user", JSON.stringify(safeUser));
                localStorage.removeItem("user");
            }

            onLogin(safeUser);
            setPassword("");
        } catch (error) {
            setErrorMessage(
                "Giriş başarısız oldu — kullanıcı adı veya şifre yanlış olabilir."
            );
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
            sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                overflow: 'hidden',
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    width: '200%',
                    height: '200%',
                    top: '-50%',
                    left: '-50%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
                    transform: 'rotate(30deg)',
                }
            }}
        >
            <Paper
                elevation={10}
                sx={{
                    p: 4,
                    width: isMobile ? '90%' : 400,
                    maxWidth: '100%',
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
                    zIndex: 1,
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-5px)',
                    }
                }}
            >
                <Box textAlign="center" mb={3}>
                    <Box
                        sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px',
                            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
                        }}
                    >
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                            <path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM8.9 6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2H8.9V6z" />
                        </svg>
                    </Box>
                    <Typography
                        variant="h5"
                        textAlign="center"
                        gutterBottom
                        sx={{
                            fontWeight: 700,
                            color: '#764ba2',
                            letterSpacing: '0.5px',
                            mb: 1
                        }}
                    >
                        Hesabınıza Giriş Yapın
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Lütfen kullanıcı bilgilerinizi girin
                    </Typography>
                </Box>

                {errorMessage && (
                    <Alert severity="error" sx={{
                        mb: 2,
                        borderRadius: 2,
                        fontWeight: 500,
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
                    }}>
                        {errorMessage}
                    </Alert>
                )}

                <TextField
                    label="Eposta"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    InputProps={{
                        sx: {
                            borderRadius: 2,
                            '& fieldset': {
                                borderWidth: '2px',
                            },
                        }
                    }}
                />

                <TextField
                    label="Şifre"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                    sx={{ color: '#764ba2' }}
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                        sx: {
                            borderRadius: 2,
                            '& fieldset': {
                                borderWidth: '2px',
                            },
                        }
                    }}
                />

                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mt: 1
                }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                                sx={{
                                    color: '#764ba2',
                                    '&.Mui-checked': {
                                        color: '#764ba2',
                                    },
                                }}
                            />
                        }
                        label="Beni hatırla"
                        sx={{ color: 'text.secondary' }}
                    />

                    <ForgetPassword />
                </Box>

                <Button
                    fullWidth
                    variant="contained"
                    sx={{
                        mt: 3,
                        mb: 2,
                        py: 1.5,
                        borderRadius: 2,
                        background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '1rem',
                        letterSpacing: '0.5px',
                        boxShadow: '0 4px 15px rgba(118, 75, 162, 0.4)',
                        '&:hover': {
                            boxShadow: '0 6px 20px rgba(118, 75, 162, 0.6)',
                            transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                    }}
                    onClick={handleLogin}
                >
                    Giriş Yap
                </Button>

                <Divider sx={{ my: 2, '&::before, &::after': { borderColor: '#e0e0e0' } }}>
                    <Typography variant="body2" color="textSecondary">veya</Typography>
                </Divider>

                <Button
                    fullWidth
                    variant="outlined"
                    sx={{
                        mt: 1,
                        py: 1.5,
                        borderRadius: 2,
                        fontWeight: 700,
                        fontSize: '1rem',
                        letterSpacing: '0.5px',
                        borderWidth: '2px',
                        borderColor: '#764ba2',
                        color: '#764ba2',
                        '&:hover': {
                            borderWidth: '2px',
                            background: 'rgba(118, 75, 162, 0.05)',
                        }
                    }}
                    onClick={handleRegister}
                >
                    Kayıt Ol
                </Button>
            </Paper>
        </Box>
    );
}