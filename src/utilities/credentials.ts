import { deleteCookie, getCookie, type OptionsType, setCookie } from 'cookies-next'
import { AuthenticateResponse } from '@/types/user/common'
import { cookies, routes } from './constants'

const setCredential = async (credential: AuthenticateResponse) => {
	setCookie(cookies.credential, credential.token, {
		expires: new Date(credential.tokenExpiredDate),
		maxAge: credential.tokenExpired,
		path: routes.login
	})

	setCookie(cookies.refresh, credential.refreshToken, {
		path: routes.login
	})

	setCookie(cookies.session, credential.session_id, {
		path: routes.login
	})
}

const getCredential = async (options?: OptionsType) => {
	const credential = await getCookie(cookies.credential, options)
	const refresh = await getCookie(cookies.refresh, options)
	const session = await getCookie(cookies.session, options)

	return { credential, refresh, session }
}

const deleteCredential = async () => {
	deleteCookie(cookies.credential, { path: routes.login })
	deleteCookie(cookies.refresh, { path: routes.login })
	deleteCookie(cookies.session, { path: routes.login })
}

export { deleteCredential, getCredential, setCredential }
