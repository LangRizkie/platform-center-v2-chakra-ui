import type { ReglaResponse } from '@/types/default'
import type { GetNavigationScreenDynamicForm } from '@/types/user/common'
import { erase, get, post, put } from '@/utilities/mutation'

export type CustomEndpointProps<P> = P & GetNavigationScreenDynamicForm

const CustomEndpoint = async <P, R = never>(
	payload: CustomEndpointProps<P>
): Promise<ReglaResponse<R>> => {
	const data: P & Partial<GetNavigationScreenDynamicForm> = { ...payload }

	delete data.url_api
	delete data.action
	delete data.is_modal
	delete data.method

	const key = payload.unique_key as keyof typeof data

	switch (payload.method) {
		case 'POST':
			return await post(payload.url_api, data)
		case 'PUT':
			return await put(payload.url_api, data)
		case 'DELETE':
			return await erase(payload.url_api, key in data ? data[key] : undefined)
		default:
			return await get(payload.url_api, data)
	}
}

export { CustomEndpoint }
