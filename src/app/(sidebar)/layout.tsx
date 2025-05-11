'use client'

import { Layout } from '@regla/monorepo'
import { useQuery } from '@tanstack/react-query'
import { Case } from 'change-case-all'
import { isEmpty } from 'lodash'
import { useMemo } from 'react'
import Header from '@/components/ui/header'
import { SidebarContent, SidebarMenu } from '@/components/ui/sidebar'
import useCustomViewId from '@/hooks/use-custom-view-id'
import useGetAction from '@/hooks/use-get-action'
import useGetDynamicId from '@/hooks/use-get-dynamic-id'
import useGetNativeCurrentId from '@/hooks/use-get-native-current-id'
import useGetParentId from '@/hooks/use-get-parent-id'
import useGetRoute from '@/hooks/use-get-route'
import useIsCRUDPath from '@/hooks/use-is-crud-path'
import useIsExceptionPath from '@/hooks/use-is-exception-path'
import useLocationPathname from '@/hooks/use-location-pathname'
import { List } from '@/libraries/mutation/email/user/notification'
import { GetAllNavigationScreen, GetNavigationScreen } from '@/libraries/mutation/user/common'
import { GetPathUrlScreen } from '@/libraries/mutation/user/screen'
import { GetPrivilege } from '@/libraries/mutation/user/security-role'
import useStaticStore from '@/stores/button-static'
import usePreference from '@/stores/preference'
import type { LayoutType } from '../../types/default'

const SidebarLayout: React.FC<LayoutType> = ({ children, modal }) => {
	const pathname = useLocationPathname()
	const customViewId = useCustomViewId()
	const dynamicId = useGetDynamicId()
	const parentId = useGetParentId()
	const route = useGetRoute({ fromLast: true, index: 0 })
	const nativeCurrentId = useGetNativeCurrentId()
	const isCRUDPath = useIsCRUDPath()
	const isExceptionPath = useIsExceptionPath()
	const action = useGetAction()

	const { isSidebarOpen, setOpen } = usePreference()
	const { activate, back, deactivate, reactivate, submit } = useStaticStore()

	// Notification Menu
	useQuery({
		queryFn: List,
		queryKey: ['list'],
		refetchOnWindowFocus: false
	})

	// Breadcrumb and title
	const { data: pathUrlScreen } = useQuery({
		queryFn: () =>
			GetPathUrlScreen({
				screenId: isCRUDPath || isExceptionPath ? dynamicId : nativeCurrentId
			}),
		queryKey: ['get_path_url_screen', nativeCurrentId, isCRUDPath, dynamicId, isExceptionPath],
		refetchOnWindowFocus: false
	})

	// Sidebar Menu
	useQuery({
		queryFn: () => GetAllNavigationScreen({ parentId: parentId }),
		queryKey: ['get_all_navigation_screen', parentId],
		refetchOnWindowFocus: false
	})

	// Sidebar Bottom Menu
	useQuery({
		queryFn: () => GetNavigationScreen(),
		queryKey: ['get_navigation_screen'],
		refetchOnWindowFocus: false
	})

	// Dynamic menu
	const { data: navigationScreen } = useQuery({
		queryFn: () => GetNavigationScreen({ customViewId, parentId: dynamicId }),
		queryKey: ['get_navigation_screen', customViewId, dynamicId],
		refetchOnWindowFocus: false
	})

	// User Privilege
	useQuery({
		queryFn: () => GetPrivilege({ screenId: dynamicId }),
		queryKey: ['get_privilege', dynamicId],
		refetchOnWindowFocus: false
	})

	const breadcrumb = useMemo(() => {
		if (isEmpty(pathUrlScreen) || (pathUrlScreen && isEmpty(pathUrlScreen.data))) {
			const routes = pathname.split('/').filter((item) => !!item)

			const crumb = routes.map((item, index) => ({
				title: Case.capital(item),
				url: '/' + routes.slice(0, index + 1).join('/')
			}))

			return crumb
		}

		const crumb = pathUrlScreen.data[0]
		const path = crumb.path.split('/').filter((item) => !!item)
		const url = crumb.url.split('/').filter((item) => !!item)

		if (isCRUDPath || isExceptionPath) {
			const capitalize = Case.capital(route)
			path.push(capitalize)
			url.push(capitalize)
		}

		return path.map((item, index) => ({
			title: item,
			url: '/' + url.slice(0, index + 1).join('/')
		}))
	}, [isCRUDPath, isExceptionPath, pathUrlScreen, pathname, route])

	const title = useMemo(() => {
		const screen = navigationScreen?.data.find(
			(item) => item.screen_id.toLowerCase() === dynamicId?.toLowerCase()
		)

		if ((isCRUDPath || isExceptionPath) && !action?.is_modal)
			return [Case.capital(route), screen?.title].join(' ')

		return screen?.title ?? Case.capital(route)
	}, [navigationScreen?.data, isCRUDPath, isExceptionPath, action?.is_modal, route, dynamicId])

	return (
		<Layout
			breadcrumb={breadcrumb}
			container={{ activate, back, deactivate, reactivate, submit, title }}
			modal={modal}
			header={{
				content: <Header />,
				onSymbolClick: () => setOpen(!isSidebarOpen)
			}}
			sidebar={{
				content: <SidebarContent />,
				footer: <SidebarMenu />,
				isOpen: isSidebarOpen
			}}
		>
			{children}
		</Layout>
	)
}

export default SidebarLayout
