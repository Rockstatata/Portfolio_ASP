/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./**/*.{html,js}"],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    50: 'rgb(253 242 244)',
                    100: 'rgb(252 229 233)',
                    200: 'rgb(247 192 201)',
                    300: 'rgb(242 154 169)',
                    400: 'rgb(237 117 137)',
                    500: 'rgb(232 79 104)',
                    600: 'rgb(220 20 60)', // Crimson Red (DC143C)
                    700: 'rgb(198 18 54)',
                    800: 'rgb(166 15 45)',
                    900: 'rgb(134 12 37)',
                    950: 'rgb(102 9 28)',
                }
            },
            fontFamily: {
                inter: ['Inter', 'sans-serif'],
            },
            container: {
                center: true,
                padding: {
                    DEFAULT: '1rem',
                    sm: '2rem',
                    lg: '4rem',
                    xl: '5rem',
                },
            },
        },
    },
    plugins: [],
}