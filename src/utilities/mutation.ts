import { instance } from '@/config/instance'

type RedirectProps = {
	url: string
	replace?: boolean
}

type OptionProps = {
	asParameter: boolean
	useToast: boolean
	redirectTo: RedirectProps
}

const post = async <P, R>(path: string, payload?: P, options?: Partial<OptionProps>) => {
	const { data } = await instance.post<R>(path, options?.asParameter ? undefined : payload, {
		headers: {
			'x-redirect-replace': options?.redirectTo?.replace ?? false,
			'x-redirect-url': options?.redirectTo?.url,
			'x-toast': options?.useToast ?? true
		},
		params: options?.asParameter ? payload : undefined
	})

	return data
}

const put = async <P, R>(path: string, payload?: P, options?: Partial<OptionProps>) => {
	const { data } = await instance.put<R>(path, options?.asParameter ? undefined : payload, {
		headers: {
			'x-redirect-replace': options?.redirectTo?.replace ?? false,
			'x-redirect-url': options?.redirectTo?.url,
			'x-toast': options?.useToast ?? true
		},
		params: options?.asParameter ? payload : undefined
	})

	return data
}

const erase = async <P, R>(path: string, payload?: P, options?: Partial<OptionProps>) => {
	const { data } = await instance.delete<R>(path, {
		data: options?.asParameter ? undefined : payload,
		headers: {
			'x-redirect-replace': options?.redirectTo?.replace ?? false,
			'x-redirect-url': options?.redirectTo?.url,
			'x-toast': options?.useToast ?? true
		},
		params: options?.asParameter ? payload : undefined
	})

	return data
}

const get = async <P, R>(
	path: string,
	payload?: P,
	options?: Partial<Omit<OptionProps, 'asParameter'>>
) => {
	const { data } = await instance.get<R>(path, {
		headers: {
			'x-redirect-replace': options?.redirectTo?.replace ?? false,
			'x-redirect-url': options?.redirectTo?.url,
			'x-toast': options?.useToast ?? true
		},
		params: payload
	})

	return data
}

export { erase, get, post, put }
