import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { Colors, Fonts, Spacing, Radius } from '@/constants/Colors'
import { Icon } from '@/components/ui/Icon'
import { reportApi } from '@/services/api'

const HAZARD_TYPES = [
    { id: 'robbery', label: 'Armed Robbery', icon: 'user-x' },
    { id: 'accident', label: 'Road Accident', icon: 'car' },
    { id: 'flood', label: 'Flash Flood', icon: 'droplets' },
    { id: 'pothole', label: 'Potholes', icon: 'alert-circle' },
    { id: 'protest', label: 'Protest', icon: 'users' },
    { id: 'other', label: 'Other Hazard', icon: 'alert-triangle' },
]

export default function ReportHazardScreen() {
    const [selectedType, setSelectedType] = useState('')
    const [description, setDescription] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        if (!selectedType || loading) return
        setLoading(true)
        try {
            await reportApi.create({
                type: selectedType,
                description: description.trim(),
                // Auto-location fallback coordinates for Lagos
                location: { type: 'Point', coordinates: [3.3792, 6.5244] },
                risk: 'high'
            })
            setSubmitted(true)
        } catch {
            Alert.alert('Submission Failed', 'Could not submit report. Please check your connection and try again.')
        } finally {
            setLoading(false)
        }
    }

    if (submitted) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.successContainer}>
                    <View style={styles.successIcon}>
                        <Icon name="shield-check" size={48} color={Colors.brand.primary} />
                    </View>
                    <Text style={styles.successTitle}>Report Submitted!</Text>
                    <Text style={styles.successSub}>
                        Thank you for keeping the community safe. Your report will be reviewed and published shortly.
                    </Text>
                    <TouchableOpacity style={styles.doneBtn} onPress={() => router.back()}>
                        <Text style={styles.doneBtnText}>Back to Emergency</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Icon name="arrow-left" size={24} color={Colors.dark.text} strokeWidth={2.5} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Report a Hazard</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

                {/* Hazard type selection */}
                <Animated.View entering={FadeInDown.duration(400)}>
                    <Text style={styles.sectionLabel}>What type of hazard?</Text>
                    <View style={styles.typeGrid}>
                        {HAZARD_TYPES.map(type => (
                            <TouchableOpacity
                                key={type.id}
                                style={[styles.typeCard, selectedType === type.id && styles.typeCardActive]}
                                onPress={() => setSelectedType(type.id)}
                                activeOpacity={0.7}
                            >
                                <Icon
                                    name={type.icon as any}
                                    size={24}
                                    color={selectedType === type.id ? Colors.tabs.emergency : Colors.dark.textMuted}
                                    strokeWidth={2}
                                />
                                <Text style={[styles.typeLabel, selectedType === type.id && styles.typeLabelActive]}>
                                    {type.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Animated.View>

                {/* Location */}
                <Animated.View entering={FadeInDown.delay(100).duration(400)}>
                    <Text style={styles.sectionLabel}>Location</Text>
                    <TouchableOpacity style={styles.locationCard}>
                        <Icon name="map-pin" size={20} color={Colors.brand.primary} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.locationTitle}>Use Current Location</Text>
                            <Text style={styles.locationSub}>Lagos, Nigeria (auto-detected)</Text>
                        </View>
                        <Icon name="check-circle" size={20} color={Colors.brand.primary} />
                    </TouchableOpacity>
                </Animated.View>

                {/* Camera */}
                <Animated.View entering={FadeInDown.delay(200).duration(400)}>
                    <Text style={styles.sectionLabel}>Attach Photo (optional)</Text>
                    <TouchableOpacity style={styles.cameraCard}>
                        <Icon name="camera" size={32} color={Colors.dark.textMuted} />
                        <Text style={styles.cameraText}>Tap to take a photo</Text>
                        <Text style={styles.cameraSub}>Helps verify the report</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Description */}
                <Animated.View entering={FadeInDown.delay(300).duration(400)}>
                    <Text style={styles.sectionLabel}>Add a description</Text>
                    <TextInput
                        style={styles.textArea}
                        placeholder="Describe what you saw..."
                        placeholderTextColor={Colors.dark.textMuted}
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                        maxLength={400}
                    />
                    <Text style={styles.charCount}>{description.length}/400</Text>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(400).duration(400)}>
                    <TouchableOpacity
                        style={[styles.submitBtn, !selectedType && styles.submitBtnDisabled]}
                        onPress={handleSubmit}
                        disabled={!selectedType}
                    >
                        <Icon name="send" size={20} color={selectedType ? '#000' : Colors.dark.textMuted} />
                        <Text style={[styles.submitText, !selectedType && { color: Colors.dark.textMuted }]}>Submit Report</Text>
                    </TouchableOpacity>
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.dark.bg },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
        borderBottomWidth: 1, borderBottomColor: Colors.dark.border
    },
    backBtn: { padding: 8, marginLeft: -8 },
    headerTitle: { fontFamily: Fonts.bold, fontSize: 18, color: Colors.dark.text },
    scroll: { padding: Spacing.lg, gap: Spacing.xl },

    sectionLabel: { fontFamily: Fonts.bold, fontSize: 15, color: Colors.dark.text, marginBottom: Spacing.md },
    typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
    typeCard: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        paddingVertical: 12, paddingHorizontal: Spacing.md,
        borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.dark.border,
        backgroundColor: Colors.dark.card, minWidth: '45%', flex: 1
    },
    typeCardActive: {
        borderColor: Colors.tabs.emergency,
        backgroundColor: `${Colors.tabs.emergency}15`
    },
    typeLabel: { fontFamily: Fonts.semibold, fontSize: 13, color: Colors.dark.textMuted, flex: 1 },
    typeLabelActive: { color: Colors.tabs.emergency },

    locationCard: {
        flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
        padding: Spacing.md, borderRadius: Radius.md,
        backgroundColor: `${Colors.brand.primary}10`,
        borderWidth: 1, borderColor: `${Colors.brand.primary}30`
    },
    locationTitle: { fontFamily: Fonts.semibold, fontSize: 14, color: Colors.dark.text, marginBottom: 2 },
    locationSub: { fontFamily: Fonts.regular, fontSize: 12, color: Colors.dark.textMuted },

    cameraCard: {
        height: 130, backgroundColor: Colors.dark.card, borderRadius: Radius.md,
        borderWidth: 2, borderColor: Colors.dark.border, borderStyle: 'dashed',
        alignItems: 'center', justifyContent: 'center', gap: 8
    },
    cameraText: { fontFamily: Fonts.semibold, fontSize: 14, color: Colors.dark.textMuted },
    cameraSub: { fontFamily: Fonts.regular, fontSize: 12, color: Colors.dark.border },

    textArea: {
        backgroundColor: Colors.dark.card, borderRadius: Radius.md,
        borderWidth: 1, borderColor: Colors.dark.border,
        padding: Spacing.md, fontFamily: Fonts.regular, fontSize: 15,
        color: Colors.dark.text, minHeight: 110, textAlignVertical: 'top'
    },
    charCount: { fontFamily: Fonts.regular, fontSize: 12, color: Colors.dark.textMuted, textAlign: 'right', marginTop: 6 },

    submitBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
        backgroundColor: Colors.tabs.emergency, paddingVertical: 18, borderRadius: Radius.full,
        shadowColor: Colors.tabs.emergency, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10
    },
    submitBtnDisabled: { backgroundColor: Colors.dark.card },
    submitText: { fontFamily: Fonts.bold, fontSize: 16, color: '#000' },

    // Success state
    successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl, gap: Spacing.lg },
    successIcon: {
        width: 100, height: 100, borderRadius: 50, backgroundColor: `${Colors.brand.primary}15`,
        alignItems: 'center', justifyContent: 'center'
    },
    successTitle: { fontFamily: Fonts.black, fontSize: 28, color: Colors.dark.text },
    successSub: { fontFamily: Fonts.regular, fontSize: 15, color: Colors.dark.textMuted, textAlign: 'center', lineHeight: 24 },
    doneBtn: {
        backgroundColor: Colors.brand.primary, paddingHorizontal: 32, paddingVertical: 16, borderRadius: Radius.full
    },
    doneBtnText: { fontFamily: Fonts.bold, fontSize: 16, color: '#000' }
})
