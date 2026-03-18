import { Redirect } from 'expo-router'
import { useAuthStore } from '@/stores/authStore'
import { View, ActivityIndicator } from 'react-native'
import { Colors } from '@/constants/Colors'

export default function Index() {
    const { user, isLoading } = useAuthStore()

    if (isLoading) {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.dark.bg, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator color={Colors.brand.primary} size="large" />
            </View>
        )
    }

    return user ? <Redirect href="/(tabs)/plan" /> : <Redirect href="/(auth)/splash" />
}
