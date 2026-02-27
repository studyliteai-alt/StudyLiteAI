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
                cream: 'var(--cream)',
                brandPurple: 'var(--brand-purple)',
                brandYellow: 'var(--brand-yellow)',
                brandGreen: 'var(--brand-green)',
                brandPink: 'var(--brand-pink)',
                brandBlack: 'var(--brand-black)',
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
