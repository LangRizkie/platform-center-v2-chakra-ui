import type { Key } from 'react'
import type { ReglaResponse } from '../default'

export type FormType = 'TABLE' | 'TREE' | 'STATIC' | 'CARD_TABLE'
export type MethodType = 'GET' | 'POST' | 'PUT' | 'DELETE'

export type GetNavigationScreenAction =
	| 'CREATE'
	| 'GLOBAL'
	| 'UPDATE'
	| 'LIST'
	| 'VIEW'
	| 'LOCK'
	| 'DELETE'
	| 'DOWNLOAD'
	| 'UPLOAD'
	| 'DEACTIVATE'
	| 'DEALLOCATE'
	| 'STOP'
	| 'RUN'
	| 'SIMULATION'
	| 'CREATE_MOREVERT'
	| 'REACTIVATE'
	| 'APPROVE'
	| 'PUBLISH'
	| 'UPDATE_EOM'
	| 'CUSTOM_VIEW'
	| 'CHECKBOX'

export type GetLookupData = {
	id: Key
	desc: string
}

export type ResponseUserData = {
	is_user_locked: boolean
}

export type AuthenticateData = {
	token: string
	tokenExpired: number
	refreshToken: string
	password_expired: boolean
	tokenExpiredDate: string
	session_id: string
}

export type GetUserPropertyApplication = {
	appId: string
	applicationName: string
	url: string
	image_url: string
	description: string
}

export type GetUserPropertyData = {
	pkid: number
	username: string
	email: string
	firstName: string
	lastName: string
	lastLogin: string
	passwordExpired: boolean
	role: string
	organization: string
	team: string
	jobTitle: string
	department: string
	officeCountry: string
	isInitPassword: boolean
	accept_language: string
	is_dark_mode: boolean
	application: GetUserPropertyApplication[]
}

export type ForgotPasswordPayload = {
	username: string
}

export type GetAllNavigationScreenPayload = {
	parentId?: string | null
}

export type GetAllNavigationScreenData = {
	title: string
	screen_id: string
	url: string
	image_url: string
	items: GetAllNavigationScreenData[]
}

export type GetNavigationScreenPayload = {
	parentId?: string | null
	customViewId?: string | null
}

export type GetNavigationScreenMapColumn = {
	is_hidden: boolean
	object_name: string
	sequence: number
	value: string
}

export type GetNavigationScreenDynamicForm = {
	action: GetNavigationScreenAction
	is_modal: boolean
	unique_key: string
	url_api: string
	method: MethodType
}

export type GetNavigationScreenData = {
	header: string
	title: string
	screen_id: string
	url: string
	url_api_list: string
	image_url: string
	description: string
	is_table: boolean
	form_type: FormType
	unique_key: string
	default_custom_view_id: string
	is_all_category: boolean
	map_column: GetNavigationScreenMapColumn[] | null
	dynamic_form: GetNavigationScreenDynamicForm[] | null
}

export type GetLookupCustomViewPayload = {
	screenId?: string | null
}

export type GetLookupCustomViewData = GetLookupData & {
	is_standard_view: boolean
	is_pin: boolean
}

export type RefreshTokenPayload = {
	username: string
	refreshToken: string
}

export type CheckUsernameResponse = ReglaResponse<ResponseUserData | null>
export type AuthenticateResponse = ReglaResponse & AuthenticateData
export type GetUserPropertyResponse = ReglaResponse & GetUserPropertyData

export type GetAllNavigationScreenResponse = ReglaResponse<GetAllNavigationScreenData[]>
export type GetNavigationScreenResponse = ReglaResponse<GetNavigationScreenData[]>
export type GetLookupCustomViewResponse = ReglaResponse<GetLookupCustomViewData[]>
