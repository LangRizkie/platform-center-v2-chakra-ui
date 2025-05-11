'use client'

import { useIsFetching } from '@tanstack/react-query'
import { Case } from 'change-case-all'
import { redirect, RedirectType } from 'next/navigation'
import { useEffect, useMemo } from 'react'
import StaticPage from '@/components/pages/static-page'
import modal from '@/components/ui/modal'
import useCustomViewId from '@/hooks/use-custom-view-id'
import useGetAction from '@/hooks/use-get-action'
import useGetDynamicId from '@/hooks/use-get-dynamic-id'
import useGetRoute from '@/hooks/use-get-route'
import useIsCRUDPath from '@/hooks/use-is-crud-path'
import useIsExceptionPath from '@/hooks/use-is-exception-path'
import useLocationPathname from '@/hooks/use-location-pathname'
import useQueryFetched from '@/hooks/use-query-fetched'
import type { GetNavigationScreenResponse } from '@/types/user/common'
import type { GetPrivilegeResponse } from '@/types/user/security-role'

const Page = () => {
	const form = useGetAction()
	const isCRUDPath = useIsCRUDPath()
	const isExceptionPath = useIsExceptionPath()
	const customViewId = useCustomViewId()
	const route = useGetRoute({ fromLast: true, index: 0 })
	const dynamicId = useGetDynamicId()
	const pathname = useLocationPathname()

	useIsFetching({
		queryKey: ['get_navigation_screen', customViewId, dynamicId]
	})

	const getNavigationScreen = useQueryFetched<GetNavigationScreenResponse>({
		queryKey: ['get_navigation_screen', customViewId, dynamicId]
	})

	const getPrivilege = useQueryFetched<GetPrivilegeResponse>({
		queryKey: ['get_privilege', dynamicId]
	})

	const title = useMemo(() => {
		const screen = getNavigationScreen?.data?.[0]
		const title = screen?.title

		return [Case.capital(route), title].join(' ')
	}, [route, getNavigationScreen?.data])

	const navigation = useMemo(() => {
		return getNavigationScreen?.data || []
	}, [getNavigationScreen])

	const privilege = useMemo(() => {
		return getPrivilege?.data || []
	}, [getPrivilege])

	useEffect(() => {
		if (navigation && (isCRUDPath || isExceptionPath) && form?.is_modal) {
			modal
				.open('static-modal', {
					children: <StaticPage navigation={navigation} privilege={privilege} />,
					title
				})
				.then(() => {
					if (isCRUDPath || isExceptionPath) {
						const parent = pathname.slice(0, pathname.lastIndexOf('/'))
						const isOrigin = document.referrer.startsWith(origin)

						if (isOrigin) return history.back()
						return redirect(parent, RedirectType.push)
					}
				})
				.finally(() => {
					modal.remove('static-modal')
				})
		}
	}, [form, isCRUDPath, isExceptionPath, navigation, pathname, privilege, title])

	return <></>
}

export default Page
