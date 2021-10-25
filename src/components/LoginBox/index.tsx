import styles from "./styles.module.scss";
import { VscGithubInverted } from "react-icons/vsc";
import { useContext, useEffect } from "react";
import { api } from "../../services/api";
import { AuthContext } from "../../context/authContext";



export function LoginBox() {
   const  { signInUrl } = useContext(AuthContext);
    return (
        <div className={styles.loginBoxWrapper}>
            <strong>Sign in and share your message</strong>
            <a href={signInUrl} className={styles.signInWithGithub}><VscGithubInverted className={styles.githubIcon} size="24" /> Enter with Github</a>
        </div>
    )
}