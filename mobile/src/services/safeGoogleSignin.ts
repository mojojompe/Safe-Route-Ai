import { Alert } from 'react-native';

let GoogleSignin: any;

try {
    // Use require to load the module dynamically. 
    // If the native module is missing (Expo Go), this might throw or the module itself might throw on access.
    const googleSigninModule = require('@react-native-google-signin/google-signin');
    GoogleSignin = googleSigninModule.GoogleSignin;
} catch (error) {
    console.warn('Google Signin Native Module not found. Using Mock. Use a Development Build for real functionality.');

    // Create a mock object that matches the API used
    GoogleSignin = {
        configure: (options: any) => {
            console.log('Mock GoogleSignin.configure called with:', options);
        },
        hasPlayServices: async () => {
            return true;
        },
        signIn: async () => {
            Alert.alert(
                "Google Sign-In Unavailable",
                "Google Sign-In is not supported in the Expo Go app. Please use a Custom Development Build or an Emulator with Play Services.",
                [{ text: "OK" }]
            );
            throw new Error("Google Sign-In not supported in Expo Go");
        },
        signOut: async () => {
            console.log('Mock GoogleSignin.signOut called');
        },
        // Add other methods if you use them
    };
}

export { GoogleSignin };
