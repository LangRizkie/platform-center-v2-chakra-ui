import type { ReglaResponse } from '../default'

export type GetPathUrlScreenPayload = {
	screenId?: string | null
}

export type GetPathUrlScreenData = {
	parent_id: string
	path: string
	screen_id: string
	url: string
}

export type GetPathUrlScreenResponse = ReglaResponse<GetPathUrlScreenData[]>
