/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{html,js,jsx,tsx,ts}'],
    theme: {
        fontFamily: {
            sans: ['Inter var, sans-serif'],
        },
        extend: {
            colors: {
                clifford: '#da373d',
            },
        },
    },
    plugins: [],
}
