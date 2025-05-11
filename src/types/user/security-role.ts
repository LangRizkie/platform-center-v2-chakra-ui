import type { ReglaResponse } from '../default'

export type GetPrivilegePayload = {
	screenId?: string | null
}

export type GetPrivilegeData = {
	can_delete: boolean
	can_export: boolean
	can_import: boolean
	can_insert: boolean
	can_update: boolean
	can_view: boolean
	group_screen_id: string
	parent_id: string
	pkid: number
	screen_id: string
	url: string
}

export type GetPrivilegeResponse = ReglaResponse<GetPrivilegeData[]>
