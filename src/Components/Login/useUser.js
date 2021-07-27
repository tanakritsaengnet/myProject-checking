import { useState } from 'react';

function useUser() {

    function getUser() {
        const userString = localStorage.getItem('user');
        const user = JSON.parse(userString);
        console.log(user);
        return user
    }
    const [user, setUser] = useState(getUser());

    const saveUser = useUser => {
        localStorage.setItem('user', JSON.stringify(useUser));
        setUser(useUser);
    };

    const clearUser = () => {
        localStorage.removeItem('user');
        setUser("");
    };

    return {
        clearUser, clearUser,
        setUser: saveUser,
        user
    }
}


export default useUser;