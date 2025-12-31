import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    DEFAULT: '#000091', // Deep Vibrant Blue (Open Style)
                    light: '#3333A7',
                    dark: '#000063',
                    50: '#f0f0ff',
                    100: '#e0e0ff',
                    900: '#000063',
                }
            },
        },
    },
    plugins: [],
};
export default config;
