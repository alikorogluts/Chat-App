import React, { useState, useRef, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, Box, Typography, CircularProgress,
    Alert, useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import sendCode from '../../services/sendCode';
import ResetPassword from '../../services/ResetPassword';

import axios from 'axios';
import VerificationCodeStep from './VerifyCode';

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: 16,
        padding: theme.spacing(3),
        maxWidth: 450,
        background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
        boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.15)',
        border: '1px solid rgba(0, 0, 0, 0.05)',
    },
}));


const ActionButton = styled(Button)(({ theme }) => ({
    borderRadius: 14,
    padding: '12px 28px',
    fontWeight: 700,
    fontSize: '1rem',
    textTransform: 'none',
    transition: 'all 0.3s ease',
    letterSpacing: '0.5px',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: `0 4px 12px ${theme.palette.primary.light}`,
    },
}));

const GradientButton = styled(ActionButton)(({ theme }) => ({
    background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
    color: 'white',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
}));

const ForgotPassword: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState<string[]>(Array(6).fill(''));
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendTime, setResendTime] = useState(0);
    const [successMessage, setSuccessMessage] = useState('');
    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
    const theme = useTheme();

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (resendTime > 0) {
            timer = setTimeout(() => setResendTime(resendTime - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [resendTime]);

    const handleCodeChange = (value: string, idx: number) => {
        if (!/^\d?$/.test(value)) return;
        const updated = [...code];
        updated[idx] = value;
        setCode(updated);
        if (value && idx < 5) inputsRef.current[idx + 1]?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
        if (e.key === 'Backspace' && !code[idx] && idx > 0) {
            inputsRef.current[idx - 1]?.focus();
        }
    };


    const handleSendCode = async () => {
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            setError("Lütfen geçerli bir e-posta adresi girin.");
            return;
        }

        setLoading(true);
        setError("");
        setSuccessMessage("");

        try {
            const result = await sendCode(email, 1);
            // ⬅️ Konsolda görmek istersen

            if (result.success) {
                setSuccessMessage(result.message || "Doğrulama kodu başarıyla gönderildi.");
                setStep(2);
                setResendTime(100);
            } else {
                // Eğer success false gelirse hata mesajını göster
                setError(result.message || "Sunucudan beklenmeyen bir hata alındı.");
            }
        } catch (err: any) {

            // Eğer sunucu hatası varsa detaylı göster
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("Kod gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
            }
        } finally {
            setLoading(false);
        }
    };


    const handleVerifyCode = async () => {
        const joinedCode = code.join('');
        if (joinedCode.length !== 6) {
            setError('Lütfen 6 haneli kodu girin');
            return;
        }

        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const result = await ResetPassword(email, joinedCode);

            if (result.success) {
                setSuccessMessage(result.message || 'Şifreniz başarıyla sıfırlandı.');
                setStep(3);
            } else {
                setError(result.message || result.message);
            }
        } catch (err: any) {

            if (axios.isAxiosError(err) && err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Şifre sıfırlama sırasında bir hata oluştu. Lütfen tekrar deneyin.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            setError("Lütfen geçerli bir e-posta adresi girin.");
            return;
        }

        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const result = await sendCode(email, 1);

            if (result.success) {
                setSuccessMessage(result.message || 'Doğrulama kodu başarıyla tekrar gönderildi.');
                setResendTime(60);
                setCode(Array(6).fill(''));
                inputsRef.current[0]?.focus();
            } else {
                setError(result.message || result.message);
            }
        } catch (err: any) {

            if (axios.isAxiosError(err) && err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Kod gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setTimeout(() => {
            setStep(1);
            setEmail('');
            setCode(Array(6).fill(''));
            setError('');
            setResendTime(0);
            setSuccessMessage('');
        }, 300);
    };

    return (
        <>
            <Button
                variant="text"
                sx={{
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    '&:hover': {
                        color: theme.palette.primary.dark,
                        textDecoration: 'underline',
                        background: 'transparent',
                    }
                }}
                onClick={() => setOpen(true)}
            >
                Şifremi Unuttum
            </Button>

            <StyledDialog
                open={open}
                onClose={handleClose}
                BackdropProps={{ style: { background: 'rgba(0, 0, 0, 0.5)' } }}
            >
                <Box textAlign="center" mb={2}>
                    <Box
                        sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px',
                        }}
                    >
                        {step === 1 ? (
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                            </svg>
                        ) : step === 2 ? (
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                                <path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM8.9 6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2H8.9V6z" />
                            </svg>
                        ) : (
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                            </svg>
                        )}
                    </Box>
                    <DialogTitle sx={{
                        fontWeight: 800,
                        fontSize: '1.8rem',
                        color: theme.palette.primary.dark,
                        p: 0,
                        mb: 1
                    }}>
                        {step === 1 ? 'Şifre Sıfırlama' :
                            step === 2 ? 'Doğrulama Kodu' :
                                'Başarılı!'}
                    </DialogTitle>
                    <Typography variant="subtitle1" color="textSecondary">
                        {step === 1 ? 'Hesabınıza erişmek için' :
                            step === 2 ? 'Güvenlik doğrulaması' :
                                'Şifreniz başarıyla sıfırlandı'}
                    </Typography>
                </Box>

                <DialogContent>
                    {error && (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: 12, fontWeight: 500 }}>
                            {error}
                        </Alert>
                    )}

                    {successMessage && (
                        <Alert severity="success" sx={{ mb: 3, borderRadius: 12, fontWeight: 500 }}>
                            {successMessage}
                        </Alert>
                    )}

                    <Box display="flex" flexDirection="column" gap={3}>
                        {step === 1 && (
                            <>
                                <Typography variant="body1" color="textSecondary" textAlign="center">
                                    Şifrenizi sıfırlamak için lütfen e-posta adresinizi girin. Size bir doğrulama kodu göndereceğiz.
                                </Typography>

                                <TextField
                                    label="E-posta Adresiniz"
                                    type="email"
                                    value={email}
                                    margin="normal"
                                    onChange={(e) => setEmail(e.target.value)}
                                    fullWidth
                                    required
                                    variant="outlined"
                                    size="medium"
                                    InputProps={{
                                        sx: { borderRadius: 14, padding: '8px 16px' }
                                    }}
                                    sx={{
                                        '& label': {
                                            fontWeight: 500,
                                            transform: 'translate(14px, 16px) scale(1)'
                                        },
                                        '& label.Mui-focused': {
                                            transform: 'translate(14px, -9px) scale(0.75)'
                                        }
                                    }}
                                />
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <VerificationCodeStep
                                    email={email}
                                    code={code}
                                    onCodeChange={handleCodeChange}
                                    onKeyDown={handleKeyDown}
                                    resendTime={resendTime}
                                    onResendCode={handleResendCode}
                                    loading={loading}
                                    inputsRef={inputsRef}
                                />



                            </>
                        )}

                        {step === 3 && (
                            <Box textAlign="center" py={2}>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                                    Şifreniz Sıfırlandı!
                                </Typography>
                                <Typography variant="body1" color="textSecondary">
                                    Yeni şifreniz e-posta adresinize gönderildi. Giriş yapmak için kullanabilirsiniz.
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </DialogContent>

                <DialogActions sx={{
                    justifyContent: step === 2 ? 'space-between' : 'flex-end',
                    px: 3,
                    pt: 0,
                    pb: 2
                }}>
                    {step === 2 && (
                        <ActionButton
                            onClick={() => setStep(1)}
                            color="inherit"
                            variant="outlined"
                            disabled={loading}
                            sx={{
                                borderWidth: 2,
                                '&:hover': { borderWidth: 2 }
                            }}
                        >
                            Geri
                        </ActionButton>
                    )}

                    <Box display="flex" gap={1.5}>
                        <ActionButton
                            onClick={handleClose}
                            color="inherit"
                            variant="outlined"
                            disabled={loading}
                            sx={{
                                borderWidth: 2,
                                '&:hover': { borderWidth: 2 }
                            }}
                        >
                            {step === 3 ? 'Tamam' : 'Vazgeç'}
                        </ActionButton>

                        {step !== 3 && (
                            <GradientButton
                                onClick={step === 1 ? handleSendCode : handleVerifyCode}
                                variant="contained"
                                disabled={loading}
                                endIcon={loading && <CircularProgress size={24} color="inherit" />}
                            >
                                {loading ? (
                                    <span>İşleniyor...</span>
                                ) : step === 1 ? (
                                    'Kodu Gönder'
                                ) : (
                                    'Doğrula'
                                )}
                            </GradientButton>
                        )}
                    </Box>
                </DialogActions>
            </StyledDialog >
        </>
    );
};

export default ForgotPassword;


