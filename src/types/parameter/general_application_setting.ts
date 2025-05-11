import { ReglaResponse } from '../default'

export type GetDetailGeneralAppSettingData = {
	account_lockout_after: number
	account_lockout_after_measurement: string
	app_code: string
	change_password_interval: number
	change_password_interval_measurement: string
	created_by: string
	created_date: string
	created_host: string
	password_expires_after: number
	password_expires_after_measurement: string
	password_reuse_after: number
	password_reuse_after_measurement: string
	pkid: number
	refresh_token: number
	refresh_token_measurement: string
	token_expired_after: number
	token_expired_after_measurement: string
	updated_by: string
	updated_date: string
	updated_host: string
}

export type GetDetailGeneralAppSettingResponse = ReglaResponse<GetDetailGeneralAppSettingData>
