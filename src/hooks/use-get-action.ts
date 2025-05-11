import { useMemo } from 'react'
import type {
	GetNavigationScreenAction,
	GetNavigationScreenResponse
} from '@/types/user/common'
import useCustomViewId from './use-custom-view-id'
import useGetCurrentId from './use-get-current-id'
import useGetDynamicId from './use-get-dynamic-id'
import useQueryFetched from './use-query-fetched'

const useGetAction = (action?: GetNavigationScreenAction) => {
	const customViewId = useCustomViewId()
	const dynamicId = useGetDynamicId()
	const currentId = useGetCurrentId()

	const getNavigationScreen = useQueryFetched<GetNavigationScreenResponse>({
		queryKey: ['get_navigation_screen', customViewId, dynamicId]
	})

	const form = useMemo(() => {
		if (getNavigationScreen?.data) {
			const map = getNavigationScreen.data.map((item) => {
				if (item.dynamic_form) {
					return item.dynamic_form.find((form) => {
						const loop = form.action.toLowerCase()
						const param = action?.toLowerCase()
						const current = currentId?.toLowerCase()

						if (action) return param === loop
						return loop === current
					})
				}
			})

			return map?.[0] ?? undefined
		}

		return undefined
	}, [getNavigationScreen?.data, action, currentId])

	return form
}

export default useGetAction
