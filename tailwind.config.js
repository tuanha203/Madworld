module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      sm: '260px',
      // => @media (min-width: 360px) { ... }

      md: '600px',
      // => @media (min-width: 600px) { ... }

      lg: '960px',
      // => @media (min-width: 960px) { ... }

      xl: '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1800px',
      // => @media (min-width: 1800px) { ... }
    },
    extend: {
      fontFamily: {
        Spartan: ['Spartan', 'sans-serif'],
        Lato: ['Lato', 'sans-serif'],
        Roboto: ['Roboto', 'sans-serif'],
        Chakra: ['Chakra Petch', 'sans-serif'],
        Hanson: ['Hanson', 'sans-serif'],
        OnlyChakra: ['Chakra Petch'],
      },
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        'primary-dark': '#7340D3',
        'primary-dark-2': '#BBA2EA',
        'primary-10': '#1A087A',
        'primary-50': '#00857E',
        'primary-60': '#F4B1A3',
        'primary-90': '#B794F6',
        'primary-95': '#D6C7F2',
        'primary-99': '#E6D8FC',
        'primary-200': '#BB86FC',
        'primary-yellow': '#FFD166',
        'primary-light': 'var(--pimary-light-green-color)',
        'light-on-primary': '#FFFFFF',
        'dark-on-surface': '#EEE4FF',
        'persian-blue': '#1919BC',
        'primary-gray': '#E9E9E9',

        // archive
        'archive-teal-400': '#16FBF0',
        'archive-Neutral-Variant30': '#3F4947',
        'archive-Neutral-Variant70': '#A2ADAB',
        'archive-Neutral-Variant60': '#889391',
        'archive-Neutral-Variant80': '#BEC9C7',
        'archive-Neutral-Variant50': '#6F7978',
        'archive-Neutral-Variant95': '#E9F3F1',

        //Secondary
        'secondary-container': '#8F1115',
        'secondary-20': '#680005',
        'secondary-30': '#8F1115',
        'secondary-40': '#FC5E44',
        'fantasy-secondary-40': '#B02C29',
        'secondary-50': '#D3453F',
        'secondary-60': '#F4B1A3',
        'secondary-65': '#F55E55',
        'fantasy-secondary-70': '#FF897E',
        'secondary-70': '#F7CFC7',
        'secondary-200': '#03DAC5',
        'on-secondary-container': '#FFDAD5',
        'light-on-secondary-container': '#410002',
        'dark-on-surface-variant': '#BEC9C7',
        'dark-on-surface': '#EBE0E1',
        'fantasy-dark-on-primary': '#003733',
        'dark-on-primary': '#FFFFFF',
        'light-on-primary': '#FFFFFF',
        'secondary-container-hover': '#7B0E12',
        'secondary-container-focus': '#9E292D',
        'secondary-container-dragged': '#9E292D',
        'secondary-green': '#4EB000',
        'secondary-light-green': '#16C784',
        'secondary-rose': '#AE71D2',
        'secondary-ref': '#444B56',
        'secondary-gray': '#B0B8C7',
        'third-gray': 'rgba(255, 255, 255, 0.38)',

        // 'orange': '#D3453F',

        // error
        'error-50': '#DD3730',
        'error-60': '#FF5449',
        'error-70': '#FF897A',

        //border
        'neutral-600': '#646B7A99',

        // background
        'background-10': '#050119',
        'background-20': '#C1C8E0',
        'background-dark-200': '#D4DBEB',
        'background-dark-300': '#C2CADA',
        'fantasy-background-dark-300': '#5A617D',
        'background-dark-400': '#9DA5B4',
        'fantasy-background-dark-400': '#4B526A',
        'fantasy-background-dark-500': '#4B525D',
        'background-dark-500': '#3D4255',
        'background-dark-200': '#646B7A',
        'background-dark-600': '#3E3F4D',
        'background-dark-700': 'var(--background-700-dark)',
        'background-dark-800': 'var(--background-800-dark)',
        'background-scroll-bar': '#F4B1A3',
        'background-dark-900': '#1D1C29',
        'background-dark-1000': '#010b19',
        'background-dark': 'var(--background-900-dark)',
        'background-asset-detail': '#161D28',
        'background-variant-dark': '#2D2D39',
        'background-700': '#373D4A',
        'background-dark-input': 'rgba(255, 255, 255, 0.12)',
        'background-preview-sell': '#252D3A',
        'background-sell-step-popup-selected': '#161D28',
        'background-black-pearl': '#010B19',
        'background-disabled': 'background: rgba(227, 227, 227, 0.12)',
        // outlined button
        'outlined-normal': 'var(--outlined-normal)',
        'gray-c4': '#C4C4C4',
        'gray-c2': '#C2C2C2',
        black: '#000',
        'color-close': '#707A83',
        // other

        'medium-emphasis': 'rgba(255, 255, 255, 0.6)',
        'dark-opacity': '#FFFFFF',
        'light-opacity': '#32126D',
        'pink-bland': '#EFE9F3',
        'white-blur': '#FCFCFC',
        'text-dark': 'rgba(255, 255, 255, 0.5)',
        'cyan-blue': 'rgba(85, 92, 105, 0.5)',
      },
      boxShadow: {
        // ELEVATION DARK
        'elevation-dark-1': 'var(--elevation-dark-1)',
        'elevation-dark-2': 'var(--elevation-dark-2)',
        'elevation-dark-3': 'var(--elevation-dark-3)',
        'elevation-dark-4': 'var(--elevation-dark-4)',
        'elevation-dark-5': 'var(--elevation-dark-5)',
        // ELEVATION light
        'elevation-light-1': 'var(--elevation-light-1)',
        'elevation-light-2': 'var(--elevation-light-2)',
        'elevation-light-3': 'var(--elevation-light-3)',
        'elevation-light-4': 'var(--elevation-light-4)',
        'elevation-light-5': 'var(--elevation-light-5)',
      },
      width: {
        container: '1128px !important',
        'container-xxl': '1440px !important',
      },
    },
  },
  options: {
    important: true,
  },
  plugins: [
    function ({ addVariant }) {
      addVariant('child', '& > *');
      addVariant('child-hover', '& > *:hover');
    },
    function ({ addComponents }) {
      addComponents({
        '.layout': {
          maxWidth: '100%',
          '@screen sm': {
            maxWidth: '640px',
          },
          '@screen md': {
            maxWidth: '768px',
          },
          '@screen lg': {
            maxWidth: '768px',
          },
          '@screen lg': {
            maxWidth: '1024px',
          },
          '@screen xl': {
            maxWidth: '1128px',
          },
          '@screen 2xl': {
            maxWidth: '1128px',
          },
        },
      });
    },
  ],
};
