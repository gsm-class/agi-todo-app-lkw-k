import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'

const config = [
  {
    ignores: ['.next/**', 'out/**', 'coverage/**'],
  },
  ...nextCoreWebVitals,
]

export default config
