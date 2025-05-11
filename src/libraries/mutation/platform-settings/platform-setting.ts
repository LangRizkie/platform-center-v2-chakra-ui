import type { AccountActiveUserPayload } from '@/libraries/schemas/platform-settings/platform-setting'
import type { ReglaResponse } from '@/types/default'
import endpoints from '@/utilities/endpoints'
import { get, post } from '@/utilities/mutation'

const GenerateRandomPassword = async (): Promise<ReglaResponse> =>
	await get(endpoints.platform_settings.generate_random_pass, undefined, { useToast: false })

const AddAccountActiveUser = async (
	payload: AccountActiveUserPayload
): Promise<ReglaResponse> =>
	await post(endpoints.platform_settings.add_account_active_user, payload)

const UpdateAccountActiveUser = async (
	payload: AccountActiveUserPayload
): Promise<ReglaResponse> =>
	await post(endpoints.platform_settings.add_account_active_user, payload)

export { AddAccountActiveUser, GenerateRandomPassword, UpdateAccountActiveUser }
