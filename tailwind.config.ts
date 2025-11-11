import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./utils/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                "ibm-plex-sans": ["IBM Plex Sans", "sans-serif"],
                "bebas-neue": ["var(--bebas-neue)"],
            },
            colors: {
                primary: {
                    DEFAULT: "#436436",
                    admin: "#25388C",
                },
            }
        },
    },
    plugins: [],
};

export default config;