/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './src/**/*.{js,jsx,ts,tsx}',
        './public/index.html',
    ],
    theme: {
        extend: {
            colors: {
                primary: '#1392ec',
                'background-light': '#f6f7f8',
                'background-dark': '#101a22',
                'skipper-primary': '#00427A',
                'skipper-secondary': '#40E0D0',
                'skipper-accent': '#FFA500',
                'skipper-success': '#28A745',
                'skipper-neutral-bg': '#F4F7F9',
                'skipper-neutral-text': '#333333',
            },
            fontFamily: {
                display: ['Inter', 'system-ui', 'sans-serif'],
            },
            borderRadius: {
                DEFAULT: '0.25rem',
                lg: '0.5rem',
                xl: '0.75rem',
                full: '9999px',
            },
        },
    },
    plugins: [],
};
