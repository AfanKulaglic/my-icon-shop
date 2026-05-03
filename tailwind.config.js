/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // New modern color scheme
        primary: "#0A0E27",
        "primary-light": "#141937",
        "primary-lighter": "#1E2447",
        accent: "#6366F1",
        "accent-hover": "#4F46E5",
        "accent-light": "#818CF8",
        secondary: "#EC4899",
        "secondary-hover": "#DB2777",
        success: "#10B981",
        warning: "#F59E0B",
      },
      fontFamily: {
        heading: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 30px -10px rgba(0,0,0,0.4)",
        glow: "0 0 20px rgba(99, 102, 241, 0.3)",
        "glow-lg": "0 0 40px rgba(99, 102, 241, 0.4)",
        "inner-glow": "inset 0 0 20px rgba(99, 102, 241, 0.1)",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh': 'radial-gradient(at 40% 20%, hsla(250, 100%, 70%, 0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(280, 100%, 70%, 0.15) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(240, 100%, 70%, 0.15) 0px, transparent 50%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
};
