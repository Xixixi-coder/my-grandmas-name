/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        grandma: {
          DEFAULT: '#8B7355',
          light: '#A0926B',
          dark: '#6B5344'
        },
        mother: {
          DEFAULT: '#6B8E6B',
          light: '#8BAA8B',
          dark: '#4B6E4B'
        }
      },
      fontFamily: {
        handwritten: ['ZCOOL XiaoWei', 'cursive'],
        'serif-cn': ['Noto Serif SC', 'serif'],
        'sans-cn': ['Inter', 'Noto Sans SC', 'sans-serif']
      },
      animation: {
        'cursor-blink': 'blink 1s step-end infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out'
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    }
  },
  plugins: []
}
