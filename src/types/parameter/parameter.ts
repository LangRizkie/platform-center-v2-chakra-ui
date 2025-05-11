import { ReglaResponse } from '../default'

type SearchList = {
	created_by: string
	created_date: string
	model_name: string
	module: string
	path: string
	record_name: string
	record_number: string
	redirect_url: string
}

type GeneralSearchData = {
	count: number
	list: SearchList[]
}

export type GeneralSearchPayload = {
	search: string
}

export type GeneralSearchModulePayload = {
	search: string
}

export type GeneralSearchResponse = ReglaResponse<GeneralSearchData>
export type GeneralSearchModuleResponse = ReglaResponse<GeneralSearchData>
