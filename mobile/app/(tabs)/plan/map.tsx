import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors, Fonts, Spacing } from '@/constants/Colors'
import { Icon } from '@/components/ui/Icon'

export default function MapScreen() {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.absoluteHeader}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Icon name="arrow-left" size={24} color={Colors.dark.text} strokeWidth={2} />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <Icon name="route" size={64} color={Colors.brand.primary} strokeWidth={1.5} />
                <Text style={styles.title}>Map View (Mock)</Text>
                <Text style={styles.placeholder}>
                    Mapbox native integration is paused. We will build the actual interactive map during the final build phase.
                </Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.dark.bg },
    absoluteHeader: {
        position: 'absolute', top: 50, left: 20, zIndex: 10
    },
    backBtn: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: Colors.dark.card,
        borderWidth: 1, borderColor: Colors.dark.border,
        alignItems: 'center', justifyContent: 'center',
    },
    content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl, gap: 16 },
    title: { fontFamily: Fonts.black, fontSize: 24, color: Colors.dark.text },
    placeholder: { fontFamily: Fonts.regular, fontSize: 16, color: Colors.dark.textMuted, textAlign: 'center', lineHeight: 24 }
})
