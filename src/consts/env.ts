
import type { IExpoConfig } from '@model'
import { default as Consts, ExecutionEnvironment as ExecEnv } from 'expo-constants'
import { Platform } from 'react-native'

import { version } from '../../package.json'

const { executionEnvironment: execEnv } = Consts
// `true` when running in Expo Go.
const isExpoDev = execEnv && ExecEnv?.StoreClient && execEnv === ExecEnv?.StoreClient
// `true` when running in preview/production mode.
const isExpoProd = execEnv && ExecEnv?.Standalone && execEnv === ExecEnv?.Standalone
// True if the app is running in an `expo build` app or if it's running in Expo Go.
const isExpo = isExpoDev || isExpoProd

const isReactNativeDevMode = typeof __DEV__ === 'boolean' && __DEV__

export { isExpo, isExpoDev, isExpoProd, isReactNativeDevMode }

type AppVariant = 'preview' | 'beta' | 'prod' | 'dev' | undefined

function nodeEnvShort(): 'test' | AppVariant {
	if (!process?.env?.NODE_ENV) {
		process.env.NODE_ENV = 'development'
		return
	}
	if (process?.env?.NODE_ENV === 'production') { return 'prod' }
	if (process?.env?.NODE_ENV === 'development') { return 'dev' }
	if (process?.env?.NODE_ENV === 'test') { return 'test' }
	if (process?.env?.NODE_ENV === 'preview') { return 'preview' }
	if (process?.env?.NODE_ENV === 'beta') { return 'beta' }
}

function appVariant(): AppVariant {
	if (!process?.env?.APP_VARIANT) {
		process.env.APP_VARIANT = 'dev'
		return
	}
	if (process?.env?.APP_VARIANT === 'prod') { return 'prod' }
	if (process?.env?.APP_VARIANT === 'dev') { return 'dev' }
	if (process?.env?.APP_VARIANT === 'preview') { return 'preview' }
	if (process?.env?.APP_VARIANT === 'beta') { return 'beta' }
}

const config: Readonly<IExpoConfig | undefined | null> = Consts?.expoConfig

export const env/* : Readonly<IExpoConfig['extra'] & { BUGSNAG_API_KEY?: string }> */ = {
	DEBUG: process?.env?.DEBUG || config?.extra?.DEBUG,

	NODE_ENV: process?.env?.NODE_ENV || config?.extra?.NODE_ENV,

	NODE_ENV_SHORT: process?.env?.NODE_ENV_SHORT || config?.extra?.NODE_ENV_SHORT || nodeEnvShort() || appVariant(),

	APP_VARIANT: process?.env?.APP_VARIANT || config?.extra?.APP_VARIANT || appVariant() || nodeEnvShort(),

	SENTRY_DSN: process?.env?.SENTRY_DSN
		|| process?.env?.SENTRY_DSN
		|| config?.extra?.SENTRY_DSN,

	isExpo,
	isExpoDev,
	isExpoBeta: process?.env?.APP_VARIANT === 'beta' || config?.extra?.APP_VARIANT === 'beta' || appVariant() === 'beta',
	isExpoProd,
	isReactNativeDevMode,
} as const

export const isTestMode = (typeof __TEST__ === 'boolean' && __TEST__)
	|| (typeof jest !== 'undefined' && jest.isMockFunction(jest))
	|| (env?.NODE_ENV_SHORT === 'test' || env?.NODE_ENV === 'test')
	|| (env?.APP_VARIANT === 'test' || env?.NODE_ENV === 'test')
	|| (env?.NODE_ENV === 'test' && env?.NODE_ENV_SHORT === 'test')
	|| process?.env?.NODE_ENV === 'test' || config?.extra?.NODE_ENV === 'test'

export const isIOS = Platform.OS === 'ios'
export const isNotIosStore = __DEV__ || env.isExpoBeta || !isIOS
export const appVersion = `eNuts v${version}${env.isExpoBeta ? '-beta' : ''}`
