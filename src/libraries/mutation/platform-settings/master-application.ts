import type { GetPlatformResponse } from '@/types/platform-settings/master-application'
import endpoints from '@/utilities/endpoints'
import { get } from '@/utilities/mutation'

const GetPlatform = async (): Promise<GetPlatformResponse> =>
	await get(endpoints.user.application.get_platform)

export { GetPlatform }
