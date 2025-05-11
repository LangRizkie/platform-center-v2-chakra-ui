import type { Key } from 'react'
import { ReglaResponse } from './default'

type GetDataSort = {
	field: string
	dir: string
}

type GetDataFilters = {
	field: string
	operator: string
	value: string
	logic: string
}

type GetDataFilter = {
	filters: GetDataFilters[]
}

export type PaginationPayload = {
	search: string
	customViewId: Key
	columnSearch: string[]
	sort: GetDataSort[]
	filter: GetDataFilter
	start: Key
	length: Key
}

export type DownloadDataPayload = PaginationPayload & {
	format: string
	type: string
	[key: string]: unknown
}

export type TreeData<T> = {
	level: number
	is_active: boolean
	items: T[]
	status: string
}

export type TreeResponse<T> = ReglaResponse<TreeData<T>[]>
