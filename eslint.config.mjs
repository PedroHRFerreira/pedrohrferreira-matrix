import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTypeScript from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier'

const eslintConfig = [
  ...nextVitals,
  ...nextTypeScript,
  prettier,
  {
    ignores: ['.next/**', 'coverage/**', 'playwright-report/**', 'test-results/**', 'next-env.d.ts']
  }
]

export default eslintConfig
