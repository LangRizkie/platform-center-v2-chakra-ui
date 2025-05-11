import { Key } from 'react'
import endpoints from '@/utilities/endpoints'
import { get } from '@/utilities/mutation'

const GetBySubscriptionId = async (payload: Key) =>
	await get(endpoints.platform_settings.license.get_by_subscription_id + payload)

export { GetBySubscriptionId }
