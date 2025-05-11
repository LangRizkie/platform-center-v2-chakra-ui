import { Key } from 'react'
import endpoints from '@/utilities/endpoints'
import { get } from '@/utilities/mutation'

const GetApplicationBySubsId = async (payload: Key) =>
	await get(
		endpoints.platform_settings.master_subscription_package.get_application_by_subs_id + payload
	)

export { GetApplicationBySubsId }
