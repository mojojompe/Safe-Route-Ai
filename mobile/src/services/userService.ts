import api from './api';
import { User } from 'firebase/auth';

export const userService = {
    syncUser: async (user: User) => {
        try {
            const token = await user.getIdToken();
            const userData = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
            };

            // Assuming your backend has an endpoint to create/update users
            // We verify the token in the backend usually, but here we send data + token auth header
            const response = await api.post('/auth/login', userData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error syncing user to backend:", error);
            // Don't block the app if sync fails, but maybe log it
            return null;
        }
    }
};
