import React from 'react';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, G, Rect } from 'react-native-svg';

export const WelcomeIllustration = ({ className }: { className?: string }) => (
    <Svg viewBox="0 0 400 300" className={className} width="100%" height="250">
        <Defs>
            <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0" stopColor="#10b981" stopOpacity="0.8" />
                <Stop offset="1" stopColor="#3b82f6" stopOpacity="0.8" />
            </LinearGradient>
        </Defs>
        <Circle cx="200" cy="150" r="80" fill="url(#grad)" fillOpacity="0.2" />
        <Path
            d="M150 150 L200 100 L250 150 L220 150 L220 200 L180 200 L180 150 Z"
            fill="#10b981"
            stroke="#fff"
            strokeWidth="2"
            transform="translate(0, 10)"
        />
        <Circle cx="50" cy="50" r="20" fill="#3b82f6" fillOpacity="0.1" />
        <Circle cx="350" cy="250" r="30" fill="#10b981" fillOpacity="0.1" />
    </Svg>
);

export const LoginIllustration = ({ className }: { className?: string }) => (
    <Svg viewBox="0 0 400 300" className={className} width="100%" height="200">
        <Defs>
            <LinearGradient id="grad2" x1="0%" y1="100%" x2="100%" y2="0%">
                <Stop offset="0" stopColor="#059669" stopOpacity="0.6" />
                <Stop offset="1" stopColor="#34d399" stopOpacity="0.8" />
            </LinearGradient>
        </Defs>
        <G transform="translate(100, 50)">
            <Rect x="50" y="20" width="100" height="160" rx="15" fill="url(#grad2)" />
            <Rect x="70" y="50" width="60" height="5" rx="2" fill="white" fillOpacity="0.5" />
            <Rect x="70" y="70" width="60" height="5" rx="2" fill="white" fillOpacity="0.5" />
            <Circle cx="100" cy="130" r="20" fill="white" fillOpacity="0.8" />
        </G>
    </Svg>
);

export const SignupIllustration = ({ className }: { className?: string }) => (
    <Svg viewBox="0 0 400 300" className={className} width="100%" height="200">
        <Defs>
            <LinearGradient id="grad3" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor="#10b981" />
                <Stop offset="1" stopColor="#064e3b" />
            </LinearGradient>
        </Defs>
        <Circle cx="200" cy="150" r="60" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="10 5" />
        <Path d="M170 150 L190 170 L230 130" stroke="#fff" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <Circle cx="100" cy="100" r="10" fill="#34d399" />
        <Circle cx="300" cy="200" r="15" fill="#34d399" fillOpacity="0.5" />
    </Svg>
);
