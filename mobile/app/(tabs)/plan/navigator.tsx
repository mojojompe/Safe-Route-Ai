import React, { useState, useRef } from 'react'
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { Colors, Fonts, Spacing, Radius } from '@/constants/Colors'
import { Icon } from '@/components/ui/Icon'
import { chatApi } from '@/services/api'

type Message = { id: string; role: 'ai' | 'user'; text: string }

export default function NavigatorScreen() {
    const [message, setMessage] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [chat, setChat] = useState<Message[]>([
        { id: '1', role: 'ai', text: 'Hi! I am Arlo, your Safe Route AI co-pilot. Where are we heading today, or do you need a quick route assessment?' }
    ])

    const scrollViewRef = useRef<ScrollView>(null)

    const handleSend = async () => {
        if (!message.trim() || isTyping) return

        const userMsg: Message = { id: Date.now().toString(), role: 'user', text: message.trim() }
        const history = chat.map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text }))
        setChat(prev => [...prev, userMsg])
        setMessage('')
        setIsTyping(true)

        try {
            const res = await chatApi.send(userMsg.text, history)
            const reply = res.data?.reply || res.data?.message || "I'm analysing the route — please try again in a moment."
            setChat(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'ai', text: reply }])
        } catch {
            setChat(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'ai', text: "I'm having trouble connecting right now. Please check your internet connection." }])
        } finally {
            setIsTyping(false)
        }
    }


    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Icon name="arrow-left" size={24} color={Colors.dark.text} strokeWidth={2.5} />
                </TouchableOpacity>
                <View style={styles.titleBox}>
                    <Text style={styles.headerTitle}>Arlo AI</Text>
                    <View style={styles.onlinePing} />
                </View>
                <TouchableOpacity style={styles.backBtn}>
                    <Icon name="more-vertical" size={24} color={Colors.dark.textMuted} />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView 
                style={{ flex: 1 }} 
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                {/* Chat Area */}
                <ScrollView 
                    ref={scrollViewRef}
                    contentContainerStyle={styles.chatScroll} 
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                >
                    {chat.map((msg, i) => (
                        <Animated.View 
                            key={msg.id} 
                            entering={FadeInUp.duration(400)}
                            style={[
                                styles.messageRow,
                                msg.role === 'user' ? styles.messageRowUser : styles.messageRowAi
                            ]}
                        >
                            {msg.role === 'ai' && (
                                <View style={styles.avatarAi}>
                                    <Text style={{ fontSize: 16 }}>🤖</Text>
                                </View>
                            )}
                            <View style={[
                                styles.bubble,
                                msg.role === 'user' ? styles.bubbleUser : styles.bubbleAi
                            ]}>
                                <Text style={[
                                    styles.messageText,
                                    msg.role === 'user' ? { color: '#000' } : { color: Colors.dark.text }
                                ]}>
                                    {msg.text}
                                </Text>
                            </View>
                        </Animated.View>
                    ))}
                    {isTyping && (
                        <Animated.View entering={FadeInUp.duration(300)} style={[styles.messageRow, styles.messageRowAi]}>
                            <View style={styles.avatarAi}>
                                <Text style={{ fontSize: 16 }}>🤖</Text>
                            </View>
                            <View style={[styles.bubble, styles.bubbleAi]}>
                                <ActivityIndicator size="small" color={Colors.brand.primary} />
                            </View>
                        </Animated.View>
                    )}

                </ScrollView>

                {/* Input Area */}
                <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Ask about a route..."
                            placeholderTextColor={Colors.dark.textMuted}
                            value={message}
                            onChangeText={setMessage}
                            multiline
                            maxLength={500}
                        />
                        <TouchableOpacity style={styles.attachBtn}>
                            <Icon name="mic" size={20} color={Colors.dark.textMuted} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity 
                        style={[styles.sendBtn, message.trim() ? { backgroundColor: Colors.brand.primary } : { backgroundColor: Colors.dark.border }]}
                        onPress={handleSend}
                        disabled={!message.trim()}
                    >
                        <Icon name="send" size={20} color={message.trim() ? '#000' : Colors.dark.textMuted} strokeWidth={2.5} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
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
    backBtn: { padding: 8, marginHorizontal: -8 },
    titleBox: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    headerTitle: { fontFamily: Fonts.bold, fontSize: 18, color: Colors.dark.text },
    onlinePing: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.brand.primary, marginTop: 2 },
    
    chatScroll: { padding: Spacing.lg, paddingBottom: Spacing.xl, gap: Spacing.md },
    messageRow: { flexDirection: 'row', width: '100%', marginBottom: Spacing.sm },
    messageRowUser: { justifyContent: 'flex-end' },
    messageRowAi: { justifyContent: 'flex-start', alignItems: 'flex-end' },
    
    avatarAi: { 
        width: 32, height: 32, borderRadius: 16, backgroundColor: `${Colors.brand.primary}15`,
        alignItems: 'center', justifyContent: 'center', marginRight: 8, marginBottom: 4
    },
    bubble: { maxWidth: '75%', padding: Spacing.md, borderRadius: Radius.lg },
    bubbleUser: { 
        backgroundColor: Colors.brand.primary, 
        borderBottomRightRadius: 4,
    },
    bubbleAi: { 
        backgroundColor: Colors.dark.card, 
        borderWidth: 1, borderColor: Colors.dark.border,
        borderBottomLeftRadius: 4,
    },
    messageText: { fontFamily: Fonts.regular, fontSize: 15, lineHeight: 22 },

    inputContainer: {
        flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.sm,
        padding: Spacing.lg,
        borderTopWidth: 1, borderTopColor: Colors.dark.border,
        backgroundColor: Colors.dark.surface
    },
    inputWrapper: {
        flex: 1, flexDirection: 'row', alignItems: 'flex-end',
        backgroundColor: Colors.dark.card,
        borderWidth: 1, borderColor: Colors.dark.border,
        borderRadius: Radius.lg,
        paddingHorizontal: Spacing.lg,
        minHeight: 48,
        maxHeight: 120,
    },
    input: {
        flex: 1,
        fontFamily: Fonts.regular, fontSize: 15, color: Colors.dark.text,
        paddingTop: 14, paddingBottom: 14,
        marginRight: Spacing.sm
    },
    attachBtn: { paddingBottom: 14 },
    sendBtn: {
        width: 48, height: 48, borderRadius: 24,
        alignItems: 'center', justifyContent: 'center'
    }
})
