/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'dbi-primary': '#1e40af',
                'dbi-secondary': '#3b82f6',
                'dbi-accent': '#60a5fa',
                'dbi-dark': '#1e3a8a',
                'dbi-light': '#dbeafe',
            },
        },
    },
    plugins: [],
}
