import type { ReglaResponse } from '../default'

export type GetPlatformData = {
	is_active_menu: boolean
	appId: string
	applicationName: string
	url: string
	sequence: number
	image_url: string
	description: string
}

export type GetPlatformResponse = ReglaResponse<GetPlatformData[]>
