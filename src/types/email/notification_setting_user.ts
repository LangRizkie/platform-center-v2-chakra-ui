import { ReglaResponse } from '../default'

export type GetUserSettingsNotificationData = {
	account_user_code: string
	app_approval_to_approver: boolean
	app_approval_to_creator: boolean
	app_assigning_record: boolean
	app_password_expires: boolean
	app_record_create: boolean
	app_record_delete: boolean
	app_record_updates: boolean
	app_subscription: boolean
	created_by: string
	created_date: string
	created_host: string
	email_approval_to_approver: boolean
	email_approval_to_creator: boolean
	email_assigning_record: boolean
	email_password_expires: boolean
	email_record_create: boolean
	email_record_delete: boolean
	email_record_updates: boolean
	email_subscription: boolean
	incoming_email: number
	number_email_limit: number
	outgoing_email: number
	pkid: number
	server_profile: number
	updated_by: string
	updated_date: string
	updated_host: string
	user_name: string
}

export type GetUserSettingsNotificationPayload = {
	username: string
}

export type GetUserSettingsNotificationResponse = ReglaResponse<GetUserSettingsNotificationData>
