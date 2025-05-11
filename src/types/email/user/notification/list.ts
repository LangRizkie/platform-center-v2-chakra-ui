import { ReglaResponse } from '@/types/default'

export type PagingData = {
	created_date: string
	is_read: boolean
	message: string
	notification_id: string
	redirect_url: string
}

export type ListData = {
	count: number
	list: PagingData[]
}

type NotificationHubData = {
	is_download: boolean
	redirect_url: string
	session_id: string
}

type NotificationHubArguments = {
	data?: NotificationHubData
	notificationId: string
	message: string
	is_read: boolean | null
	is_noisy: boolean
	source: string | null
}

export type NotificationHubResponse = {
	error: string
	type: number
	target: string
	arguments: NotificationHubArguments[]
}

export type ListResponse = ReglaResponse<ListData>
export type PagingResponse = ReglaResponse<PagingData[]>
