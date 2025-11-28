/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Brand color palette
      colors: {
        'deep-purple': '#4B2E83',
        'sunrise-orange': '#F79E38',
        'soft-cream': '#F7F4ED',
        'charcoal': '#1A1A1A',
        'light-lilac': '#EDE6F7',
      },
      // Brand fonts
      fontFamily: {
        'heading': ['Montserrat', 'sans-serif'],
        'body': ['Open Sans', 'sans-serif'],
      },
      // Custom shadows for soft, empowering feel
      boxShadow: {
        'soft': '0 4px 14px 0 rgba(75, 46, 131, 0.1)',
        'medium': '0 6px 20px 0 rgba(75, 46, 131, 0.15)',
        'glow': '0 0 20px rgba(247, 158, 56, 0.3)',
      },
      // Animation for micro-interactions
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-soft': 'pulseSoft 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}
