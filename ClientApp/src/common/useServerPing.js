import { useState, useEffect } from 'react';
import APIHelper from './ApiHelper';
import APIURLConstants from './ApiURLConstants';

//... This custom hook sends a ping to the server and listens for the response.
//... If the ping returns "undefined", it is assumed that the network/vpn is not available.

//... If the ping returns "401", it means the the user's session is timed out and needs to redirected to login page.

const useServerPing = () => {
    const [pingSuccess, setPingSuccess] = useState(true);
    const [isUserSessionValid, setIsUserSessionValid] = useState(false);

    useEffect(() => {
        setInterval(() => {
            APIHelper.get(APIURLConstants.PING)
                .then(data => {
                    setPingSuccess(true);
                }).catch(err => {
                    if (err && err.response === undefined)
                        setPingSuccess(false);
                    else if (err.response && err.response.status === 401) {
                        setIsUserSessionValid(true);
                    }
                });
        }, 6000);
    }, []);

    return { pingSuccess, isUserSessionValid };
}

export default useServerPing;