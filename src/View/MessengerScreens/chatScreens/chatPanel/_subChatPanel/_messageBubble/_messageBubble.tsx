import { Paper, styled } from "@mui/material";

export const MessageBubble = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'isMine',
})<{ isMine: boolean }>(({ theme, isMine }) => {
  const isDark = theme.palette.mode === 'dark';

  return {
    padding: theme.spacing(1.5, 2),
    marginBottom: theme.spacing(1),
    maxWidth: '75%',
    wordBreak: 'break-word',
    alignSelf: isMine ? 'flex-end' : 'flex-start',
    marginLeft: isMine ? 'auto' : 0,
    marginRight: isMine ? 0 : 'auto',
    backgroundColor: isMine
      ? theme.palette.primary.main
      : isDark
        ? theme.palette.grey[800]
        : theme.palette.grey[100],
    color: isMine
      ? theme.palette.primary.contrastText
      : isDark
        ? theme.palette.common.white
        : theme.palette.text.primary,
    borderRadius: isMine
      ? '18px 18px 0 18px'
      : '18px 18px 18px 0',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    transition: 'background-color 0.3s ease, color 0.3s ease',
  };
});