import { Mutex } from 'async-mutex'
import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { isEmpty } from 'lodash'
import type { ReglaResponse } from '@/types/default'
import type { AuthenticateResponse } from '@/types/user/common'
import endpoints from '@/utilities/endpoints'
import useUserProperty from '../stores/user-property'
import { routes } from '../utilities/constants'
import { deleteCredential, getCredential, setCredential } from '../utilities/credentials'
import toast from '../utilities/toast'

const mutex = new Mutex()

export const instance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_BASE_API,
	headers: {
		Accept: 'application/json',
		'x-Appid': process.env.NEXT_PUBLIC_APP_ID
	}
})

const disposition = (content: string) => {
	if (isEmpty(content)) return ''
	if (!content.includes('filename')) return content

	const key = 'filename'
	const disposition = content
	const split = disposition?.split(';')
	const filename = split && split.length > 0 && split[1]
	const name = filename ? filename.slice(key.length + 2, filename.length) : ''

	return name
}

const request = async (config: InternalAxiosRequestConfig) => {
	const { credential } = await getCredential()
	const { accept_language } = useUserProperty.getState()

	if (credential) {
		config.headers.Authorization = ['Bearer', credential].join(' ')
		config.headers.set('language', accept_language)
		config.headers.set('accept-language', accept_language)
	}

	return config
}

export const logout = async () => {
	const { credential } = await getCredential()
	const redirect = [location.pathname, location.search].join('')
	const token = ['Bearer', credential?.toString()].join(' ')

	const headers = new Headers()

	headers.append('content-type', 'application/json')
	headers.append('x-appid', process.env.NEXT_PUBLIC_APP_ID ?? '')
	headers.append('Authorization', credential ? token : '')

	await fetch(process.env.NEXT_PUBLIC_BASE_API + endpoints.user.common.logout, {
		headers: headers,
		method: 'POST'
	})

	await deleteCredential()
	useUserProperty.getState().reset()

	location.href = [routes.login, '?redirect=', redirect].join('')
}

instance.interceptors.request.use(request)
instance.interceptors.response.use(
	(response: AxiosResponse<ReglaResponse>) => {
		const redirect = {
			replace: response.config.headers['x-redirect-replace'],
			url: response.config.headers['x-redirect-url']
		}

		const useToast = !!response.config.headers['x-toast']

		const isEmptyData = isEmpty(response.data.data)
		const isEmptyMessage = isEmpty(response.data.message)

		if (useToast && isEmptyData && !isEmptyMessage) {
			toast.success({
				duration: 1200,
				onStatusChange: ({ status }) => {
					if (status === 'unmounted' && !isEmpty(redirect.url)) {
						if (redirect.replace) location.replace(redirect.url)
						else location.href = redirect.url
					}
				},
				title: response.data.message
			})
		}

		if (!useToast && !isEmpty(redirect.url)) {
			if (redirect.replace) location.replace(redirect.url)
			else location.href = redirect.url
		}

		if (response.headers['content-disposition']) {
			const blob = new Blob([JSON.stringify(response.data)], { type: 'plain/text' })

			const dispose = disposition(response.headers['content-disposition'])
			const link = document.createElement('a')
			const url = URL.createObjectURL(blob)

			link.href = url
			link.download = dispose
			link.click()

			toast.success({ title: 'File downloaded successfully' })
		}

		return Promise.resolve(response)
	},
	async (error) => {
		const property = useUserProperty.getState()
		const message = error.response?.data?.message ?? error.message

		if (mutex.isLocked()) {
			return await mutex.waitForUnlock().then(() => instance(error.config))
		}

		if (error.status === 401) {
			try {
				const { username } = property
				const { credential, refresh } = await getCredential()

				if (username && refresh && credential) {
					const headers = new Headers()

					headers.append('content-type', 'application/json')
					headers.append('x-appid', process.env.NEXT_PUBLIC_APP_ID ?? '')
					headers.append('Authorization', credential.toString())

					await mutex.runExclusive(async () => {
						const response = await fetch(
							process.env.NEXT_PUBLIC_BASE_API + endpoints.user.common.refresh_token,
							{
								body: JSON.stringify({ refreshToken: refresh.toString(), username }),
								headers: headers,
								method: 'POST'
							}
						)

						if (!response.ok) return logout()

						const result: AuthenticateResponse = await response.json()
						await setCredential(result)

						mutex.release()
						return await instance(error.config)
					})

					return
				}

				return logout()
			} catch (error) {
				mutex.release()

				await logout()
				return Promise.reject(new Error('Unauthorized', { cause: error }))
			}
		} else {
			toast.error({ title: message })
		}

		if (error.response) {
			return Promise.reject(
				new Error(error.response.data?.message, { cause: error.response.data })
			)
		}

		return Promise.reject(new Error(error.message, { cause: error }))
	}
)
