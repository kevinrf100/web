import { FormEvent, useContext, useEffect, useState } from "react";
import { VscGithubInverted, VscSignOut } from "react-icons/vsc";
import { AuthContext } from "../../context/authContext";
import { api } from "../../services/api";
import styles from "./styles.module.scss";

export function SendMessageForm() {
    const { user, signOut } = useContext(AuthContext);

    const [message, setMessage] = useState('');

    async function handleSendMessage(event : FormEvent) {
        event.preventDefault();
        if(!message.trim()) {
            return;
        }  

        const teste = await api.post('/messages', {message});
        setMessage('');
        
    }

    return (
        <div className={styles.sendMessageWrapper}>
            <button onClick={signOut} className={styles.signOutButton}>
                <VscSignOut size="32" />
            </button>

            <header className={styles.userInformation}>
                <div className={styles.userImage}>
                    <img src={user?.avatar_url} alt={user?.name} />
                </div>
                <strong className={styles.userName}>{user?.name}</strong>
                <span className={styles.github}>
                    <VscGithubInverted size="16" />
                    {user?.login}
                </span>
            </header>

            <form onSubmit={handleSendMessage} className={styles.sendMessageForm} action="">
                <label htmlFor="message">Message</label>
                <textarea id="message" onChange={(event) => setMessage(event.target.value)} name="message" placeholder="What do you want to send?"></textarea>
                <button type="submit">Send message</button>
            </form>
        </div>
    )

}