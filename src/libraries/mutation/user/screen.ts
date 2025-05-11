import type { GetPathUrlScreenPayload, GetPathUrlScreenResponse } from '@/types/user/screen'
import endpoints from '@/utilities/endpoints'
import { get } from '@/utilities/mutation'

const GetPathUrlScreen = async (
	payload: GetPathUrlScreenPayload
): Promise<GetPathUrlScreenResponse> =>
	await get(endpoints.user.screen.get_path_url_screen, payload)

export { GetPathUrlScreen }
