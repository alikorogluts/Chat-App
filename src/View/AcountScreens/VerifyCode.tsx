import React from 'react';
import { Box, Typography, Link, TextField, styled, useTheme } from '@mui/material';

const CodeInput = styled(TextField)(({ theme }) => ({
    width: 50,
    height: 60,
    '& input': {
        textAlign: 'center',
        fontSize: '1.8rem',
        fontWeight: 700,
        color: theme.palette.primary.main,
        padding: theme.spacing(1.5),
    },
    '& .MuiOutlinedInput-root': {
        borderRadius: 14,
        '& fieldset': {
            borderWidth: 2,
            borderColor: theme.palette.divider,
        },
        '&:hover fieldset': {
            borderColor: theme.palette.primary.light,
        },
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
            borderWidth: 3,
            boxShadow: `0 0 0 3px ${theme.palette.primary.light}`,
        },
    },
}));

interface VerificationCodeStepProps {
    email: string;
    code: string[];
    onCodeChange: (value: string, idx: number) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => void;
    resendTime: number;
    onResendCode: () => void;
    loading: boolean;
    inputsRef: React.MutableRefObject<Array<HTMLInputElement | null>>;
}

const VerificationCodeStep: React.FC<VerificationCodeStepProps> = ({
    email,
    code,
    onCodeChange,
    onKeyDown,
    resendTime,
    onResendCode,
    loading,
    inputsRef
}) => {
    const theme = useTheme();

    return (
        <>
            <Typography variant="body1" color="textSecondary" textAlign="center">
                <span style={{ fontWeight: 700, color: theme.palette.primary.dark }}>{email}</span> adresine bir doğrulama kodu gönderdik. Lütfen aşağıya girin.
            </Typography>

            <Box display="flex" justifyContent="center" gap={1.5} mt={2}>
                {code.map((digit, idx) => (
                    <CodeInput
                        key={idx}
                        inputProps={{ maxLength: 1, inputMode: 'numeric' }}
                        value={digit}
                        onChange={(e) => onCodeChange(e.target.value, idx)}
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => onKeyDown(e, idx)}
                        inputRef={(el) => (inputsRef.current[idx] = el)}
                        disabled={loading}
                    />
                ))}
            </Box>

            <Box textAlign="center" mt={2}>
                <Typography variant="body2" color="textSecondary">
                    {resendTime > 0 ? (
                        `Kodu tekrar göndermek için ${resendTime} saniye bekleyin`
                    ) : (
                        <Link
                            component="button"
                            onClick={onResendCode}
                            disabled={loading}
                            color="primary"
                            underline="hover"
                            sx={{
                                cursor: 'pointer',
                                fontWeight: 600,
                                fontSize: '0.95rem'
                            }}
                        >
                            Kodu Tekrar Gönder
                        </Link>
                    )}
                </Typography>
            </Box>
        </>
    );
};

export default VerificationCodeStep;