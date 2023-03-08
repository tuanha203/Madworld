import development from './development'
import production from './production'
import staging from './staging'
import beta from './beta'

const env = process.env.REACT_APP_ENV || 'production'
const configs = { development, production, staging, beta }

const config = configs[env]

export default config
