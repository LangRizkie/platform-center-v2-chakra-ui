import { PagingResponse } from '@/types/email/user/notification/list'
import { PaginationPayload } from '@/types/list'
import endpoints from '@/utilities/endpoints'
import { get, post } from '@/utilities/mutation'

const List = async (): Promise<PagingResponse> =>
	await get(endpoints.email.user.notification.list)

const Paging = async (payload: PaginationPayload): Promise<PagingResponse> =>
	await post(endpoints.email.user.notification.paging, payload)

export { List, Paging }
