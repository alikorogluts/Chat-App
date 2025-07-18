import { useState, useRef, useEffect } from "react";
import {
    Box, TextField, Button, Typography,
    Alert, IconButton, InputAdornment, Fade,
    CircularProgress, Link
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { registerApi } from "../../services/registerApi";
import VerificationCodeStep from "./VerifyCode";
import sendCode from "../../services/sendCode";



interface RegisterFormProps {
    onSuccess?: () => void;
    onError?: (message: string) => void;
    setShowConfetti: (value: boolean) => void;
}




export function RegisterForm({ onError, setShowConfetti }: RegisterFormProps) {
    const [step, setStep] = useState<'register' | 'verify'>('register');
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
    const [code, setCode] = useState<string[]>(Array(6).fill(''));
    const [resendTime, setResendTime] = useState(0);
    const [verificationLoading, setVerificationLoading] = useState(false);
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);


    const navigate = useNavigate();

    const allowedDomains = ["gmail.com", "outlook.com", "hotmail.com", "yahoo.com", "icloud.com", "live.com", "aol.com", "mail.com", "protonmail.com", "msn.com", "tutanota.com", "zoho.com", "gmx.com", "yandex.com", "yandex.com.tr", "hushmail.com", "outlook.com.tr", "windowslive.com", "t-online.de", "ogrenci.artvin.edu.tr"];

    function isValidEmailDomain(email: string) {
        const parts = email.split("@");
        if (parts.length !== 2) return false;
        const domain = parts[1].toLowerCase();
        return allowedDomains.includes(domain);
    }

    const handleCodeChange = (value: string, idx: number) => {
        const newCode = [...code];
        newCode[idx] = value;
        setCode(newCode);
        if (value && idx < 5 && inputsRef.current[idx + 1]) {
            inputsRef.current[idx + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
        if (e.key === 'Backspace' && !code[idx] && idx > 0 && inputsRef.current[idx - 1]) {
            inputsRef.current[idx - 1]?.focus();
        }
    };

    const handleRegister = async () => {
        setIsSubmitting(true);
        setErrorMessage("");
        setSuccessMessage("");

        if (!username.trim() || !password.trim() || !passwordConfirm.trim()) {
            setErrorMessage("Lütfen tüm alanları doldurun.");
            setIsSubmitting(false);
            if (onError) onError("Lütfen tüm alanları doldurun.");
            return;
        }

        if (!isValidEmailDomain(email)) {
            setEmailError("Desteklenmeyen e-posta uzantısı.");
            setIsSubmitting(false);
            return;
        } else {
            setEmailError("");
        }

        if (username.length < 3) {
            setErrorMessage("Kullanıcı adı en az 3 karakter olmalıdır.");
            setIsSubmitting(false);
            return;
        }

        const isStrongPassword = (password: string) => {
            const minLength = 8;
            const hasUppercase = /[A-Z]/.test(password);
            const hasLowercase = /[a-z]/.test(password);
            const hasDigit = /\d/.test(password);
            const hasSpecialChar = /[@$!%*?&]/.test(password);

            return password.length >= minLength && hasUppercase && hasLowercase && hasDigit && hasSpecialChar;
        };

        if (!isStrongPassword(password)) {
            setErrorMessage("Şifre en az 8 karakter olmalı, büyük/küçük harf, sayı ve özel karakter içermelidir.");
            setIsSubmitting(false);
            return;
        }

        if (password !== passwordConfirm) {
            setErrorMessage("Şifreler eşleşmiyor.");
            setIsSubmitting(false);
            return;
        }


        try {
            const result = await sendCode(email, 0);
            if (result?.success) {
                setSuccessMessage(result.message || "Doğrulama kodu gönderildi.");
                setStep("verify");
                setResendTime(60);
                setCode(Array(6).fill(''));
                if (inputsRef.current[0]) {
                    inputsRef.current[0].focus();
                }
            } else {
                throw new Error(result?.message || "Kod gönderilemedi");
            }
        } catch (err: any) {
            let errorMsg = "Bu email zaten kayıtlı.";
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                errorMsg = err.response.data.message;
            }
            setErrorMessage(errorMsg);
            if (onError) onError(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVerify = async () => {
        const joinedCode = code.join('');
        if (!joinedCode || joinedCode.length !== 6) {
            setErrorMessage("Lütfen 6 haneli kodu girin");
            return;
        }

        setVerificationLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            const result = await registerApi(password, username, email, code.join(""));

            if (result?.success) {
                setSuccessMessage("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz.");
                setShowConfetti(true); // 🎉 konfeti patlat! 
                setTimeout(() => navigate("/login"), 8000);
            } else {
                throw new Error(result?.message || "Kayıt başarısız.");
            }
        } catch (err: any) {
            let errorMsg = "Kayıt başarısız.";
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                errorMsg = err.response.data.message;
            }
            setErrorMessage(errorMsg);
        } finally {
            setVerificationLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            setErrorMessage("Lütfen geçerli bir e-posta adresi girin.");
            return;
        }

        setVerificationLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            const result = await sendCode(email, 0);
            if (result?.success) {
                setSuccessMessage(result.message || "Doğrulama kodu tekrar gönderildi.");
                setResendTime(60);
                setCode(Array(6).fill(''));
                if (inputsRef.current[0]) {
                    inputsRef.current[0].focus();
                }
            } else {
                throw new Error(result?.message || "Kod gönderilemedi");
            }
        } catch (err: any) {
            let errorMsg = "Kod gönderilirken bir hata oluştu.";
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                errorMsg = err.response.data.message;
            }
            setErrorMessage(errorMsg);
        } finally {
            setVerificationLoading(false);
        }
    };


    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (resendTime > 0) {
            timer = setTimeout(() => setResendTime(resendTime - 1), 1000);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [resendTime]);
    return (
        <Box>
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
                    {step === 'register' ? 'Hesap Oluşturun' : 'E-posta Doğrulama'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    {step === 'register'
                        ? 'Yeni hesabınızı oluşturmak için bilgilerinizi girin'
                        : 'E-posta adresinize gönderilen doğrulama kodunu girin'}
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
            <>
                {successMessage && (
                    <>
                        <Fade in={true}>
                            <Alert
                                severity="success"
                                sx={{
                                    mb: 2,
                                    borderRadius: 2,
                                    fontWeight: 500,
                                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                                    position: 'relative',
                                    zIndex: 1,
                                }}
                            >
                                {successMessage}
                            </Alert>
                        </Fade>


                    </>
                )}
            </>



            {step === 'register' ? (
                <>
                    <TextField
                        label="E-posta"
                        fullWidth
                        margin="normal"
                        size="small"
                        value={email}
                        onChange={(e) => {
                            const val = e.target.value;
                            setEmail(val);
                            setEmailError(!isValidEmailDomain(val) ? "Desteklenmeyen e-posta uzantısı." : "");
                        }}
                        error={!!emailError}
                        InputProps={{
                            sx: {
                                borderRadius: 2,
                                '& fieldset': { borderWidth: '2px' },
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
                                '& fieldset': { borderWidth: '2px' },
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
                                '& fieldset': { borderWidth: '2px' },
                            }
                        }}
                        helperText="En az 8 karakter, büyük/küçük harf, sayı ve özel karakter içermeli"
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
                                '& fieldset': { borderWidth: '2px' },
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
                </>
            ) : (
                <>
                    <VerificationCodeStep
                        email={email}
                        code={code}
                        onCodeChange={handleCodeChange}
                        onKeyDown={handleKeyDown}
                        resendTime={resendTime}
                        onResendCode={handleResendCode}
                        loading={verificationLoading}
                        inputsRef={inputsRef}
                    // error={verificationError}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        disabled={verificationLoading || code.join('').length !== 6}
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
                        onClick={handleVerify}
                    >
                        {verificationLoading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            "Doğrulamayı Tamamla"
                        )}
                    </Button>
                </>
            )}

            <Box textAlign="center" mt={2}>
                <Typography variant="body2" color="textSecondary">
                    {step === 'register'
                        ? "Zaten bir hesabınız var mı? "
                        : "Hesabınızı zaten doğruladınız mı? "}

                    <Link
                        component="button"
                        onClick={() => navigate("/login")}
                        sx={{
                            color: '#764ba2',
                            fontWeight: 600,
                            cursor: 'pointer',
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' }
                        }}
                    >
                        {step === 'register' ? "Giriş Yapın" : "Giriş Yap"}
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
}