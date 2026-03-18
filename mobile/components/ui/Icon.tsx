/**
 * Safe Route AI — Icon System
 * Stroke-rounded icons matching HugeIcons aesthetic, built with react-native-svg.
 * Usage: <Icon name="location" size={28} color={Colors.brand.primary} />
 */
import React from 'react'
import Svg, { Path, Circle, Rect, Line, Polyline, G } from 'react-native-svg'

export type IconName =
    | 'location' | 'shield' | 'route' | 'share' | 'emergency'
    | 'profile' | 'analytics' | 'achievements' | 'settings' | 'notification'
    | 'appearance' | 'about' | 'history' | 'favorites' | 'navigator'
    | 'mail' | 'lock' | 'eye' | 'eye-off' | 'phone' | 'person'
    | 'arrow-left' | 'arrow-right' | 'check' | 'close' | 'plus'
    | 'search' | 'map' | 'warning' | 'car' | 'logout' | 'camera'
    | 'contacts' | 'broadcast' | 'police' | 'medical' | 'fire' | 'road'
    // Extended icons for Phase 3-7
    | 'mic' | 'send' | 'more-vertical' | 'shield-check' | 'shield-alert'
    | 'alert-triangle' | 'alert-circle' | 'clock' | 'chevron-right' | 'chevron-left'
    | 'map-pin' | 'map-pin-off' | 'users' | 'user-plus' | 'user-check' | 'user-x'
    | 'award' | 'bell' | 'bell-off' | 'copy' | 'check-circle' | 'briefcase'
    | 'zap' | 'moon' | 'sun' | 'smartphone' | 'file-text' | 'book-open' | 'globe'
    | 'share-2' | 'siren' | 'phone-call' | 'trash-2' | 'droplets' | 'heart'
    | 'sunrise' | 'lock-open'

interface IconProps {
    name: IconName
    size?: number
    color?: string
    strokeWidth?: number
}

const ICONS: Record<IconName, (color: string, sw: number) => React.ReactNode> = {
    location: (c, sw) => (
        <>
            <Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <Circle cx="12" cy="9" r="2.5" stroke={c} strokeWidth={sw} fill="none" />
        </>
    ),
    shield: (c, sw) => (
        <Path d="M12 2L3 7v5c0 5.25 3.5 10.15 9 11.5C17.5 22.15 21 17.25 21 12V7l-9-5z" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    ),
    route: (c, sw) => (
        <>
            <Path d="M3 11l6-6 4 4 5-5" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M3 19c3-2 6-3 9-2s6 1 9-2" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </>
    ),
    share: (c, sw) => (
        <>
            <Circle cx="18" cy="5" r="2" stroke={c} strokeWidth={sw} fill="none" />
            <Circle cx="6" cy="12" r="2" stroke={c} strokeWidth={sw} fill="none" />
            <Circle cx="18" cy="19" r="2" stroke={c} strokeWidth={sw} fill="none" />
            <Path d="M8 11.5l8-4M8 12.5l8 4" stroke={c} strokeWidth={sw} strokeLinecap="round" />
        </>
    ),
    emergency: (c, sw) => (
        <>
            <Path d="M12 2L2 7l2 13 8 2 8-2 2-13z" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M12 8v4M12 16h.01" stroke={c} strokeWidth={sw} strokeLinecap="round" />
        </>
    ),
    profile: (c, sw) => (
        <>
            <Circle cx="12" cy="8" r="4" stroke={c} strokeWidth={sw} fill="none" />
            <Path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" />
        </>
    ),
    analytics: (c, sw) => (
        <>
            <Path d="M3 20h18" stroke={c} strokeWidth={sw} strokeLinecap="round" />
            <Path d="M7 20V10" stroke={c} strokeWidth={sw} strokeLinecap="round" />
            <Path d="M11 20V6" stroke={c} strokeWidth={sw} strokeLinecap="round" />
            <Path d="M15 20V14" stroke={c} strokeWidth={sw} strokeLinecap="round" />
            <Path d="M19 20V4" stroke={c} strokeWidth={sw} strokeLinecap="round" />
        </>
    ),
    achievements: (c, sw) => (
        <>
            <Path d="M7 4h10l1 6c0 4-2.5 7-6 7s-6-3-6-7l1-6z" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M7 4H4l-1 5h4M17 4h3l1 5h-4" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M12 17v3M9 20h6" stroke={c} strokeWidth={sw} strokeLinecap="round" />
        </>
    ),
    settings: (c, sw) => (
        <>
            <Circle cx="12" cy="12" r="3" stroke={c} strokeWidth={sw} fill="none" />
            <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke={c} strokeWidth={sw} fill="none" />
        </>
    ),
    notification: (c, sw) => (
        <>
            <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M13.73 21a2 2 0 0 1-3.46 0" stroke={c} strokeWidth={sw} strokeLinecap="round" />
        </>
    ),
    appearance: (c, sw) => (
        <>
            <Circle cx="12" cy="12" r="5" stroke={c} strokeWidth={sw} fill="none" />
            <Path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke={c} strokeWidth={sw} strokeLinecap="round" />
        </>
    ),
    about: (c, sw) => (
        <>
            <Circle cx="12" cy="12" r="10" stroke={c} strokeWidth={sw} fill="none" />
            <Path d="M12 16v-4M12 8h.01" stroke={c} strokeWidth={sw} strokeLinecap="round" />
        </>
    ),
    history: (c, sw) => (
        <>
            <Path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M3 3v5h5" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M12 7v5l4 2" stroke={c} strokeWidth={sw} strokeLinecap="round" />
        </>
    ),
    favorites: (c, sw) => (
        <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    ),
    navigator: (c, sw) => (
        <>
            <Path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <Circle cx="12" cy="9" r="2.5" stroke={c} strokeWidth={sw} fill="none" />
            <Path d="M9 21c0-1.5 1.34-2 3-2s3 .5 3 2" stroke={c} strokeWidth={sw} strokeLinecap="round" />
        </>
    ),
    mail: (c, sw) => (
        <>
            <Rect x="2" y="4" width="20" height="16" rx="2" stroke={c} strokeWidth={sw} fill="none" />
            <Path d="M2 7l10 7 10-7" stroke={c} strokeWidth={sw} strokeLinecap="round" />
        </>
    ),
    lock: (c, sw) => (
        <>
            <Rect x="5" y="11" width="14" height="10" rx="2" stroke={c} strokeWidth={sw} fill="none" />
            <Path d="M8 11V7a4 4 0 0 1 8 0v4" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" />
            <Circle cx="12" cy="16" r="1" fill={c} />
        </>
    ),
    eye: (c, sw) => (
        <>
            <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" />
            <Circle cx="12" cy="12" r="3" stroke={c} strokeWidth={sw} fill="none" />
        </>
    ),
    'eye-off': (c, sw) => (
        <>
            <Path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" />
        </>
    ),
    phone: (c, sw) => (
        <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 11.7 19.79 19.79 0 0 1 1 3.09 2 2 0 0 1 2.96 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    ),
    person: (c, sw) => (
        <>
            <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" />
            <Circle cx="12" cy="7" r="4" stroke={c} strokeWidth={sw} fill="none" />
        </>
    ),
    'arrow-left': (c, sw) => (
        <Path d="M19 12H5M12 19l-7-7 7-7" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    ),
    'arrow-right': (c, sw) => (
        <Path d="M5 12h14M12 5l7 7-7 7" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    ),
    check: (c, sw) => (
        <Path d="M20 6L9 17l-5-5" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    ),
    close: (c, sw) => (
        <Path d="M18 6L6 18M6 6l12 12" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" />
    ),
    plus: (c, sw) => (
        <Path d="M12 5v14M5 12h14" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" />
    ),
    search: (c, sw) => (
        <>
            <Circle cx="11" cy="11" r="8" stroke={c} strokeWidth={sw} fill="none" />
            <Path d="M21 21l-4.35-4.35" stroke={c} strokeWidth={sw} strokeLinecap="round" />
        </>
    ),
    map: (c, sw) => (
        <>
            <Polyline points="1,6 1,22 8,18 16,22 23,18 23,2 16,6 8,2 1,6" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M8 2v16M16 6v16" stroke={c} strokeWidth={sw} strokeLinecap="round" />
        </>
    ),
    warning: (c, sw) => (
        <>
            <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M12 9v4M12 17h.01" stroke={c} strokeWidth={sw} strokeLinecap="round" />
        </>
    ),
    car: (c, sw) => (
        <>
            <Path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h14l4 4v4a2 2 0 0 1-2 2h-2" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <Circle cx="7" cy="17" r="2" stroke={c} strokeWidth={sw} fill="none" />
            <Circle cx="15" cy="17" r="2" stroke={c} strokeWidth={sw} fill="none" />
        </>
    ),
    logout: (c, sw) => (
        <>
            <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <Polyline points="16,17 21,12 16,7" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M21 12H9" stroke={c} strokeWidth={sw} strokeLinecap="round" />
        </>
    ),
    camera: (c, sw) => (
        <>
            <Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <Circle cx="12" cy="13" r="4" stroke={c} strokeWidth={sw} fill="none" />
        </>
    ),
    contacts: (c, sw) => (
        <>
            <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" />
            <Circle cx="9" cy="7" r="4" stroke={c} strokeWidth={sw} fill="none" />
            <Path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" />
        </>
    ),
    broadcast: (c, sw) => (
        <>
            <Circle cx="12" cy="12" r="2" stroke={c} strokeWidth={sw} fill="none" />
            <Path d="M16.24 7.76a6 6 0 0 1 0 8.49M7.76 16.25a6 6 0 0 1 0-8.49" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" />
            <Path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 19.07a10 10 0 0 1 0-14.14" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" />
        </>
    ),
    police: (c, sw) => (
        <Path d="M12 2L3 7v5c0 5.25 3.5 10.15 9 11.5C17.5 22.15 21 17.25 21 12V7l-9-5zM9 12l2 2 4-4" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    ),
    medical: (c, sw) => (
        <>
            <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" />
            <Path d="M9 12h6M12 9v6" stroke={c} strokeWidth={sw} strokeLinecap="round" />
        </>
    ),
    fire: (c, sw) => (
        <Path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 0 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    ),
    road: (c, sw) => (
        <>
            <Path d="M3 20h18M8 20L5 4h14l-3 16" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M12 8v4" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeDasharray="2 2" />
        </>
    ),
    // ── Phase 3-7 extended icons ──────────────────────────────────────────────
    mic: (c, sw) => (
        <>
            <Rect x="9" y="2" width="6" height="12" rx="3" stroke={c} strokeWidth={sw} fill="none" />
            <Path d="M5 10a7 7 0 0 0 14 0M12 19v3M9 22h6" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" />
        </>
    ),
    send: (c, sw) => (
        <Path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    ),
    'more-vertical': (c, sw) => (
        <>
            <Circle cx="12" cy="5" r="1.2" fill={c} />
            <Circle cx="12" cy="12" r="1.2" fill={c} />
            <Circle cx="12" cy="19" r="1.2" fill={c} />
        </>
    ),
    'shield-check': (c, sw) => (
        <>
            <Path d="M12 2L3 7v5c0 5.25 3.5 10.15 9 11.5C17.5 22.15 21 17.25 21 12V7l-9-5z" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M9 12l2 2 4-4" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </>
    ),
    'shield-alert': (c, sw) => (
        <>
            <Path d="M12 2L3 7v5c0 5.25 3.5 10.15 9 11.5C17.5 22.15 21 17.25 21 12V7l-9-5z" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M12 8v4M12 16h.01" stroke={c} strokeWidth={sw} strokeLinecap="round" />
        </>
    ),
    'alert-triangle': (c, sw) => (
        <>
            <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M12 9v4M12 17h.01" stroke={c} strokeWidth={sw} strokeLinecap="round" />
        </>
    ),
    'alert-circle': (c, sw) => (
        <>
            <Circle cx="12" cy="12" r="10" stroke={c} strokeWidth={sw} fill="none" />
            <Path d="M12 8v4M12 16h.01" stroke={c} strokeWidth={sw} strokeLinecap="round" />
        </>
    ),
    clock: (c, sw) => (
        <>
            <Circle cx="12" cy="12" r="10" stroke={c} strokeWidth={sw} fill="none" />
            <Path d="M12 6v6l4 2" stroke={c} strokeWidth={sw} strokeLinecap="round" />
        </>
    ),
    'chevron-right': (c, sw) => (
        <Path d="M9 18l6-6-6-6" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    ),
    'chevron-left': (c, sw) => (
        <Path d="M15 18l-6-6 6-6" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    ),
    'map-pin': (c, sw) => (
        <>
            <Path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <Circle cx="12" cy="10" r="3" stroke={c} strokeWidth={sw} fill="none" />
        </>
    ),
    'map-pin-off': (c, sw) => (
        <>
            <Path d="M5.43 5.43A9 9 0 0 0 12 21S21 14 21 10a9 9 0 0 0-3.39-7.07M9 3.17A9 9 0 0 1 21 10" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" />
            <Path d="M1 1l22 22" stroke={c} strokeWidth={sw} strokeLinecap="round" />
        </>
    ),
    users: (c, sw) => (
        <>
            <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" />
            <Circle cx="9" cy="7" r="4" stroke={c} strokeWidth={sw} fill="none" />
            <Path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" />
        </>
    ),
    'user-plus': (c, sw) => (
        <>
            <Path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" />
            <Circle cx="9" cy="7" r="4" stroke={c} strokeWidth={sw} fill="none" />
            <Path d="M19 8v6M22 11h-6" stroke={c} strokeWidth={sw} strokeLinecap="round" />
        </>
    ),
    'user-check': (c, sw) => (
        <>
            <Path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" />
            <Circle cx="9" cy="7" r="4" stroke={c} strokeWidth={sw} fill="none" />
            <Path d="M16 11l2 2 4-4" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </>
    ),
    'user-x': (c, sw) => (
        <>
            <Path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" />
            <Circle cx="9" cy="7" r="4" stroke={c} strokeWidth={sw} fill="none" />
            <Path d="M18 8l5 5M23 8l-5 5" stroke={c} strokeWidth={sw} strokeLinecap="round" />
        </>
    ),
    award: (c, sw) => (
        <>
            <Circle cx="12" cy="8" r="6" stroke={c} strokeWidth={sw} fill="none" />
            <Path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.11" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </>
    ),
    bell: (c, sw) => (
        <>
            <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M13.73 21a2 2 0 0 1-3.46 0" stroke={c} strokeWidth={sw} strokeLinecap="round" />
        </>
    ),
    'bell-off': (c, sw) => (
        <>
            <Path d="M13.73 21a2 2 0 0 1-3.46 0M18.63 13A17.89 17.89 0 0 1 18 8M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" />
            <Path d="M1 1l22 22" stroke={c} strokeWidth={sw} strokeLinecap="round" />
        </>
    ),
    copy: (c, sw) => (
        <>
            <Rect x="9" y="9" width="13" height="13" rx="2" stroke={c} strokeWidth={sw} fill="none" />
            <Path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" />
        </>
    ),
    'check-circle': (c, sw) => (
        <>
            <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" />
            <Path d="M22 4L12 14.01l-3-3" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </>
    ),
    briefcase: (c, sw) => (
        <>
            <Rect x="2" y="7" width="20" height="14" rx="2" stroke={c} strokeWidth={sw} fill="none" />
            <Path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M12 12h.01" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" />
        </>
    ),
    zap: (c, sw) => (
        <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    ),
    moon: (c, sw) => (
        <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    ),
    sun: (c, sw) => (
        <>
            <Circle cx="12" cy="12" r="5" stroke={c} strokeWidth={sw} fill="none" />
            <Path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke={c} strokeWidth={sw} strokeLinecap="round" />
        </>
    ),
    smartphone: (c, sw) => (
        <>
            <Rect x="5" y="2" width="14" height="20" rx="2" stroke={c} strokeWidth={sw} fill="none" />
            <Path d="M12 18h.01" stroke={c} strokeWidth={sw} strokeLinecap="round" />
        </>
    ),
    'file-text': (c, sw) => (
        <>
            <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke={c} strokeWidth={sw} strokeLinecap="round" />
        </>
    ),
    'book-open': (c, sw) => (
        <>
            <Path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </>
    ),
    globe: (c, sw) => (
        <>
            <Circle cx="12" cy="12" r="10" stroke={c} strokeWidth={sw} fill="none" />
            <Path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" />
        </>
    ),
    'share-2': (c, sw) => (
        <>
            <Circle cx="18" cy="5" r="3" stroke={c} strokeWidth={sw} fill="none" />
            <Circle cx="6" cy="12" r="3" stroke={c} strokeWidth={sw} fill="none" />
            <Circle cx="18" cy="19" r="3" stroke={c} strokeWidth={sw} fill="none" />
            <Path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke={c} strokeWidth={sw} strokeLinecap="round" />
        </>
    ),
    siren: (c, sw) => (
        <>
            <Path d="M11 17a1 1 0 0 1 2 0c0 .5-.34 3-.5 4.5a.5.5 0 0 1-1 0C11.34 20 11 17.5 11 17z" stroke={c} strokeWidth={sw} fill="none" />
            <Path d="M16.5 9.4l1.93-1.1M7.5 9.4L5.57 8.3M21 17H3M12 3a4 4 0 0 1 4 4v10H8V7a4 4 0 0 1 4-4z" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </>
    ),
    'phone-call': (c, sw) => (
        <>
            <Path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" />
            <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 10.7 19.79 19.79 0 0 1 1 2.09 2 2 0 0 1 2.96 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </>
    ),
    'trash-2': (c, sw) => (
        <>
            <Path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M10 11v6M14 11v6" stroke={c} strokeWidth={sw} strokeLinecap="round" />
        </>
    ),
    droplets: (c, sw) => (
        <>
            <Path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 3.9 4 6.7 4 10.18a4.5 4.5 0 0 1-9 0c0-.85.19-1.66.53-2.39z" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </>
    ),
    heart: (c, sw) => (
        <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    ),
    sunrise: (c, sw) => (
        <>
            <Path d="M17 18a5 5 0 0 0-10 0M12 2v7" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" />
            <Path d="M4.22 10.22l1.42 1.42M18.36 11.64l1.42-1.42M1 18h2M21 18h2M4 18c0-4 3.58-6 8-6s8 2 8 6" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" />
        </>
    ),
    'lock-open': (c, sw) => (
        <>
            <Rect x="3" y="11" width="18" height="11" rx="2" stroke={c} strokeWidth={sw} fill="none" />
            <Path d="M7 11V7a5 5 0 0 1 9.9-1" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" />
        </>
    ),
}

export function Icon({ name, size = 24, color = '#ffffff', strokeWidth = 1.8 }: IconProps) {
    const paths = ICONS[name]?.(color, strokeWidth)
    if (!paths) return null
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
            {paths}
        </Svg>
    )
}
