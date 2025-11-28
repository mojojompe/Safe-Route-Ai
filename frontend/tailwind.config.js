/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
    theme: {
        extend: {
            colors: {
                'sr-dark': '#0a1f16',
                'sr-darker': '#05140d',
                'sr-green': '#00d35a',
                'sr-green-dim': '#00a345',
                'sr-muted': '#1c3329',
                'sr-text': '#e2e8f0',
                'sr-text-muted': '#94a3b8',
                // Colors from provided code.html
                primary: "#13ec5b",
                "background-light": "#f6f8f6",
                "background-dark": "#102216",
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ["Lexend", "sans-serif"],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #00d35a33 0deg, transparent 180deg)',
            },
            boxShadow: {
                'glow': '0 0 20px -5px rgba(0, 211, 90, 0.3)',
            }
        }
    },
    plugins: [],
}
