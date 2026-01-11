module.exports = {
    // NOTE: NativeWind v4 uses "nativewind" preset in babel, and this config works with it.
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                background: '#121A15', // User ref: dark background
                primary: {
                    DEFAULT: '#32CD32', // User ref: Bright Green
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#32CD32', // Match default
                    600: '#16a34a',
                    700: '#15803d',
                    800: '#166534',
                    900: '#14532d',
                    950: '#052e16',
                },
                secondary: '#3b82f6',
                glass: {
                    DEFAULT: 'rgba(255, 255, 255, 0.1)',
                    dark: 'rgba(0, 0, 0, 0.5)',
                    stroke: 'rgba(255, 255, 255, 0.2)',
                }
            },
        },
    },
    plugins: [],
}
