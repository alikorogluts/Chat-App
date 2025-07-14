import { useState } from "react";
import {
    Box, TextField, Button, Typography, Paper,
    Alert, IconButton, InputAdornment, useTheme,
    Fade, useMediaQuery,
    CircularProgress,
    Link
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { registerApi } from "../../services/registerApi";

export function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();
    const allowedDomains = [
        "gmail.com",
        "outlook.com",
        "hotmail.com",
        "yahoo.com",
        "icloud.com",
        "live.com",
        "aol.com",
        "mail.com",
        "protonmail.com",
        "msn.com",
        "tutanota.com",
        "zoho.com",
        "gmx.com",
        "yandex.com",
        "yandex.com.tr",
        "hushmail.com",
        "outlook.com.tr",
        "windowslive.com",
        "t-online.de",
        "ogrenci.artvin.edu.tr"
    ];
    function isValidEmailDomain(email: string) {
        const parts = email.split("@");
        if (parts.length !== 2) return false;
        const domain = parts[1].toLowerCase();
        return allowedDomains.includes(domain);
    }

    const handleRegister = async () => {
        setIsSubmitting(true);
        setErrorMessage("");
        setSuccessMessage("");


        if (!username.trim() || !password.trim() || !passwordConfirm.trim()) {
            setErrorMessage("Lütfen tüm alanları doldurun.");
            setIsSubmitting(false);
            return;
        }
        if (!isValidEmailDomain(email)) {
            setEmailError("Desteklenmeyen e-posta uzantısı.");
        } else {
            setEmailError(""); // geçerli
        }

        if (username.length < 3) {
            setErrorMessage("Kullanıcı adı en az 3 karakter olmalıdır.");
            setIsSubmitting(false);
            return;
        }

        if (password.length < 6) {
            setErrorMessage("Şifre en az 6 karakter olmalıdır.");
            setIsSubmitting(false);
            return;
        }

        if (password !== passwordConfirm) {
            setErrorMessage("Şifreler eşleşmiyor.");
            setIsSubmitting(false);
            return;
        }

        try {
            const result = await registerApi(password, username, email);

            if (result?.message === "Kayıt işlemi başarılı" && result.userId && result.userName) {
                setSuccessMessage("Kayıt başarılı! Giriş yapabilirsiniz.");
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            } else {
                throw new Error("Kayıt başarısız.");
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 409) {
                    setErrorMessage("Eposta zaten mevcut.");
                    setIsSubmitting(false);
                    return;
                }
            }
            setErrorMessage("Kayıt sırasında hata oluştu.");
        } finally {
            setIsSubmitting(false);
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
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
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
                        Hesap Oluşturun
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Yeni hesabınızı oluşturmak için bilgilerinizi girin
                    </Typography>
                </Box>

                {errorMessage && (
                    <Fade in={!!errorMessage}>
                        <Alert severity="error" sx={{
                            mb: 2,
                            borderRadius: 2,
                            fontWeight: 500,
                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
                        }}>
                            {errorMessage}
                        </Alert>
                    </Fade>
                )}

                {successMessage && (
                    <Fade in={!!successMessage}>
                        <Alert severity="success" sx={{
                            mb: 2,
                            borderRadius: 2,
                            fontWeight: 500,
                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',

                        }}>
                            {successMessage}
                        </Alert>
                    </Fade>
                )}

                <TextField
                    label="E-posta"
                    fullWidth
                    margin="normal"
                    size="small"
                    value={email}
                    onChange={(e) => {
                        const val = e.target.value;
                        setEmail(val);

                        if (!isValidEmailDomain(val)) {
                            setEmailError("Desteklenmeyen e-posta uzantısı.");
                        } else {
                            setEmailError("");
                        }
                    }}
                    error={!!emailError}
                    InputProps={{
                        sx: {
                            borderRadius: 2,
                            '& fieldset': {
                                borderWidth: '2px',
                            },
                        }
                    }}
                    helperText={emailError}
                />


                <TextField
                    label="Kullanıcı Adı"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    size="small"
                    InputProps={{
                        sx: {
                            borderRadius: 2,
                            '& fieldset': {
                                borderWidth: '2px',
                            },
                        }
                    }}
                    helperText="En az 3 karakter"
                />

                <TextField
                    label="Şifre"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    size="small"
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
                    helperText="En az 6 karakter"
                />

                <TextField
                    label="Şifre Tekrar"
                    type={showConfirmPassword ? "text" : "password"}
                    fullWidth
                    margin="normal"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    autoComplete="new-password"
                    size="small"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    edge="end"
                                    sx={{ color: '#764ba2' }}
                                >
                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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

                <Button
                    fullWidth
                    variant="contained"
                    disabled={isSubmitting}
                    size="small"
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
                    onClick={handleRegister}
                >
                    {isSubmitting ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        "Hesap Oluştur"
                    )}
                </Button>

                <Box textAlign="center" mt={2}>
                    <Typography variant="body2" color="textSecondary">
                        Zaten bir hesabınız var mı?{' '}
                        <Link
                            component="button"
                            onClick={() => navigate("/login")}
                            sx={{
                                color: '#764ba2',
                                fontWeight: 600,
                                cursor: 'pointer',
                                textDecoration: 'none',
                                '&:hover': {
                                    textDecoration: 'underline',
                                }
                            }}
                        >
                            Giriş Yapın
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
}