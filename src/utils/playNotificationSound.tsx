import incoming from "../assets/sounds/incoming.mp3";
import send from "../assets/sounds/send.mp3";

type MessageStatus = "send" | "coming";

const getAudioSource = (_status: MessageStatus): string => {
    switch (_status) {
        case "send":
            return send;
        case "coming":
            return incoming;
        default:
            return send; // fallback
    }
};

const playNotificationSound = (_status: MessageStatus) => {
    const audio = new Audio(getAudioSource(_status));
    audio.volume = 0.5;
    audio.play().catch((error) => {
        console.error("Ses çalma hatası:", error);
    });
};

export default playNotificationSound;
