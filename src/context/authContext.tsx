import { createContext, ReactNode, useEffect, useState } from "react"
import { api } from "../services/api";

type User = {
    id: string,
    name: string,
    avatar_url: string,
    login: string
}

type AuthContextData = {
    user: User | null,
    signInUrl: string,
    signOut: () => void;
}


type AuthProvider = {
    children: ReactNode;
}

type AuthResponse = {
    token: string,
    user: {
        id: string,
        avatar_url: string
        name: string,
        login: string
    }
}

export const AuthContext = createContext({} as AuthContextData);


export function AuthProvider(properties: AuthProvider) {
    const [user, setUser] = useState<User | null>(null);
    const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=4f67e97253da898122db`;

    async function signIn(githubCode: string) {
        const response = await api.post<AuthResponse>('authenticate', { code: githubCode })
        const { token, user } = response.data;

        localStorage.setItem('token', token);
        api.defaults.headers.common.authorization = `Bearer ${token}`;
        
        setUser(user);
    }

    function signOut() {
        setUser(null);
        localStorage.clear();
    }


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.defaults.headers.common.authorization = `Bearer ${token}`;
            api.get<User | null>('profile').then(
                (response) => {
                    setUser(response.data);
                }
            );
        }
    },
        []
    )

    useEffect(() => {
        const url = window.location.href;
        const hasGithubCode = url.includes('?code=');
        if (hasGithubCode) {
            const [urlWithoutCode, githubCode] = url.split('?code=');
            console.log(githubCode);

            window.history.pushState({}, '', urlWithoutCode);

            signIn(githubCode);
        }
    },
        []
    )

    return (
        <AuthContext.Provider value={{ signInUrl, user , signOut}}>
            {properties.children}
        </AuthContext.Provider>
    )
}