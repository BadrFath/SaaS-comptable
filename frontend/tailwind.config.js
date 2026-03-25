/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#f4f7fb",
        ink: "#0c2338",
        accent: "#0d8b9c",
        ember: "#d46a21",
        success: "#1f8a4c",
        warning: "#b98200",
        danger: "#b72d2d"
      },
      fontFamily: {
        display: ["Sora", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["Space Grotesk", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        floating: "0 18px 40px rgba(12, 35, 56, 0.12)",
        soft: "0 8px 24px rgba(12, 35, 56, 0.08)"
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        rise: "rise 420ms ease-out"
      }
    }
  },
  plugins: []
};
