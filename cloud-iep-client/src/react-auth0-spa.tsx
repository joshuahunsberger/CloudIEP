import createAuth0Client from "@auth0/auth0-spa-js";
import Auth0Client from "@auth0/auth0-spa-js/dist/typings/Auth0Client";
import React, { useContext, useEffect, useState } from "react";

const DEFAULT_REDIRECT_CALLBACK = (result: RedirectLoginResult) =>
    window.history.replaceState({}, document.title, window.location.pathname);

interface Auth0ContextState {
    isAuthenticated: boolean;
    user: any;
    loading: boolean;
    popupOpen: boolean;
    loginWithPopup: (option: PopupLoginOptions, config: PopupConfigOptions) => Promise<void>;
    handleRedirectCallback: () => Promise<RedirectLoginResult>;
    getIdTokenClaims: (options?: getIdTokenClaimsOptions | undefined) => Promise<IdToken>;
    loginWithRedirect: (options?: RedirectLoginOptions) => Promise<void>;
    getTokenSilently: (options?: GetTokenSilentlyOptions) => Promise<any>;
    getTokenWithPopup: (options?: GetTokenWithPopupOptions | undefined, config?: PopupConfigOptions | undefined) => Promise<string>;
    logout: (options?: LogoutOptions) => void;
}

export const Auth0Context = React.createContext({} as Auth0ContextState);
export const useAuth0 = () => useContext(Auth0Context);

interface Auth0ProviderProps {
    children: React.ReactNode;
    onRedirectCallback: (result: RedirectLoginResult) => void;
    initOptions: Auth0ClientOptions;
}
export const Auth0Provider = ({
    children,
    onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
    initOptions
}: Auth0ProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState();
    const [auth0Client, setAuth0] = useState<Auth0Client>();
    const [loading, setLoading] = useState(true);
    const [popupOpen, setPopupOpen] = useState(false);

    useEffect(() => {
        const initAuth0 = async () => {
            const auth0FromHook = await createAuth0Client(initOptions);
            setAuth0(auth0FromHook);

            if (window.location.search.includes("code=") &&
                window.location.search.includes("state=")) {
                const { appState } = await auth0FromHook.handleRedirectCallback();
                onRedirectCallback(appState);
            }

            const isAuthenticated = await auth0FromHook.isAuthenticated();

            setIsAuthenticated(isAuthenticated);

            if (isAuthenticated) {
                const user = await auth0FromHook.getUser();
                setUser(user);
            }

            setLoading(false);
        };
        initAuth0();
    }, [initOptions, onRedirectCallback]);

    const loginWithPopup = async (params = {}) => {
        setPopupOpen(true);
        try {
            await auth0Client!.loginWithPopup(params);
        } catch (error) {
            console.error(error);
        } finally {
            setPopupOpen(false);
        }
        const user = await auth0Client!.getUser();
        setUser(user);
        setIsAuthenticated(true);
    };

    const handleRedirectCallback = async () => {
        setLoading(true);
        var result = await auth0Client!.handleRedirectCallback();
        const user = await auth0Client!.getUser();
        setLoading(false);
        setIsAuthenticated(true);
        setUser(user);
        return result;
    };

    return (
        <Auth0Context.Provider
            value={{
                isAuthenticated,
                user,
                loading,
                popupOpen,
                loginWithPopup,
                handleRedirectCallback,
                getIdTokenClaims: (p) => auth0Client!.getIdTokenClaims(p),
                loginWithRedirect: (p) => auth0Client!.loginWithRedirect(p),
                getTokenSilently: (p) => auth0Client!.getTokenSilently(p),
                getTokenWithPopup: (...p) => auth0Client!.getTokenWithPopup(...p),
                logout: (p) => auth0Client!.logout(p)
            }}
        >
            {children}
        </Auth0Context.Provider>
    );
};
