/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
            },
            colors: {
                cream: '#FCF9F3',
                brandPurple: '#A855F7',
                brandYellow: '#FACC15',
                brandGreen: '#22C55E',
                brandPink: '#F472B6',
                brandBlack: '#18181B',
            },
            animation: {
                wiggle: 'highlight-wiggle 4s ease-in-out infinite',
            },
            keyframes: {
                'highlight-wiggle': {
                    '0%, 100%': { transform: 'rotate(-1.5deg)' },
                    '50%': { transform: 'rotate(1deg)' },
                }
            }
        },
    },
    plugins: [],
}
