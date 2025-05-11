import { UpdateUserSettingsNotificationPayload } from '@/libraries/schemas/email/notification_setting_user'
import { ReglaResponse } from '@/types/default'
import {
	GetUserSettingsNotificationPayload,
	GetUserSettingsNotificationResponse
} from '@/types/email/notification_setting_user'
import endpoints from '@/utilities/endpoints'
import { get, put } from '@/utilities/mutation'

const GetUserSettingsNotification = async (
	payload: GetUserSettingsNotificationPayload
): Promise<GetUserSettingsNotificationResponse> =>
	await get(endpoints.email.notification_setting_user.get_user_settings_notification, payload)

const UpdateUserSettingsNotification = async (
	payload: UpdateUserSettingsNotificationPayload
): Promise<ReglaResponse> =>
	await put(
		endpoints.email.notification_setting_user.update_user_settings_notification,
		payload
	)

export { GetUserSettingsNotification, UpdateUserSettingsNotification }
