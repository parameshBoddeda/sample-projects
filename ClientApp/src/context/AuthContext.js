/* eslint-disable prettier/prettier */
import React, { useMemo } from 'react';
export const AuthContext = React.createContext();

export const AuthProvider = (props) => {

    const providerValue = useMemo(() => {
        return {
            signIn: async () => { },
            restoreToken: async () => { },
            signInMock: async (mockUserId) => { },
            signOut: () => { },
        };
    }, []);

    return (
        <AuthContext.Provider value={providerValue}>
            {props.children}
        </AuthContext.Provider>
    );
};

export const AuthConsumer = AuthContext.Consumer;

export default AuthContext;
