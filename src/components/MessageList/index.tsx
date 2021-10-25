import styles from "./styles.module.scss";
import logoImg from "../../assets/logo.svg";
import { api } from "../../services/api"
import { useEffect, useState } from "react";
import io from "socket.io-client"

type Message = {
    id: string,
    message: string,
    user: {
        name: string,
        avatar_url: string
    }
}

const messagesQueue: Message[] = [];

const socket = io("http://localhost:4000");
socket.on('new_message', (newMessage: Message) => {
    messagesQueue.push(newMessage);
    console.log(newMessage);
    console.log(messagesQueue);
});

export function MessageList() {
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        const timer = setInterval(() => {
            if (messagesQueue.length > 0) {
                setMessages(
                    (previousState) => [
                        messagesQueue[0],
                        previousState[0],
                        previousState[1],
                    ].filter(Boolean)
                );
                messagesQueue.shift();
            }
        }, 3000)
    }, []);

    useEffect(
        () => {
            api.get<Message[]>('messages/last3').then(
                (response) => {
                    console.log(response);
                    setMessages(response.data);
                }
            )
        },
        []
    );

    return (
        <div className={styles.messageListWrapper}>
            <img src={logoImg} alt="Logo" />

            <ul className={styles.messageList}>
                {messages.map(message => {
                    return (
                        <li key={message.id} className={styles.message}>
                            <p className={styles.messageContent}>{message.message}</p>
                            <div className={styles.messageUser}>
                                <div className={styles.userImage}>
                                    <img src={message.user.avatar_url} alt={message.user.name} />
                                </div>
                                <span>{message.user.name}</span>
                            </div>
                        </li>
                    );
                })}

            </ul>
        </div>
    )
}