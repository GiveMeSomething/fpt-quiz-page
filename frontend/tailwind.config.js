const colors = require('tailwindcss/colors')
module.exports = {
    purge: ['./pages/**/*.tsx', './src/**/*.tsx'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        colors: {
            transparent: 'transparent',
            current: 'currentColor',
            black: colors.black,
            white: colors.white,
            gray: colors.trueGray,
            indigo: colors.indigo,
            red: colors.rose,
            yellow: colors.amber,
            fresh: {
                1: {
                    100: '#030078',
                    200: '#001F82',
                    300: '#05386B',
                    400: '#006382',
                    500: '#007874',
                },
                2: {
                    100: '#347DA3',
                    200: '#37A4AD',
                    300: '#379683',
                    400: '#37AD74',
                    500: '#34A34E',
                },
                3: {
                    100: '#56E6E8',
                    200: '#5AF2CA',
                    300: '#5CDB95',
                    400: '#5AF273',
                    500: '#6BE856',
                },
                4: {
                    100: '#89F0EA',
                    200: '#8EFAD6',
                    300: '#8EE4AF',
                    400: '#8EFA99',
                    500: '#A0F089',
                },
                5: {
                    100: '#DAFADC',
                    200: '#C8DEC1',
                    300: '#EDF5E1',
                    400: '#DCDEC1',
                    500: '#FAF8DA',
                },
            },
        },
        extend: {
            colors: {
                green: {
                    compound: {
                        1: '#2DC4ED',
                        2: '#294B54',
                        3: '#C34942',
                        4: '#ED2D6B',
                    },
                },
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
