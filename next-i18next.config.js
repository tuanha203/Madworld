const path = require('path');

module.exports = {
    i18n: {
        locales: ['en', 'cn'],
        defaultLocale: 'en',
        localePath: path.resolve('./src/locales'),
    },
    react: { useSuspense: false }
}
