import { Box, Paper, useTheme, useMediaQuery } from "@mui/material";
import { RegisterForm } from "./RegisterForm";
import { useEffect, useState } from "react";
import Confetti from 'react-confetti';

import { useWindowSize } from 'react-use';


export function Register() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [showConfetti, setShowConfetti] = useState(false);

    const { width, height } = useWindowSize();
    useEffect(() => {
        if (showConfetti) {
            setTimeout(() => setShowConfetti(false), 8000); // 5 saniye göster
        }
    }, [showConfetti]);

    return (
        <Box
            display="flex"
            height="100vh"
            width="100vw"
            justifyContent="center"
            alignItems="center"
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
            {showConfetti && <Confetti width={width} height={height} />}
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
                    '&:hover': { transform: 'translateY(-5px)' }
                }}
            >


                <RegisterForm setShowConfetti={setShowConfetti} />

            </Paper>
        </Box>
    );
}