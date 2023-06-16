import { useState, useEffect, useContext } from 'react';
import AppDataContext from '../common/AppContext';

//... This hook governs the access rights of the application based on the logged in user's roles.

const useUserPermission = () => {

    const {
        userPermissions
    } = useContext(AppDataContext);

    const [hasAppAccess, setHasAppAccess] = useState(false);

    //... Check if the user has access to the application.
    useEffect(() => {
        let result = (!userPermissions || userPermissions.filter(p => p.key === "Auth" && p.value === "HasAccess").length > 0);
        setHasAppAccess(result);
    }, [hasAppAccess]);

    //... NOTE - Add more checks to this hook based on the application requirements.

    return { hasAppAccess };
}

export default useUserPermission;