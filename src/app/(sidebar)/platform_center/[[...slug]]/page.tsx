'use client'

import { useIsFetching } from '@tanstack/react-query'
import { useMemo } from 'react'
import GridCard from '@/components/pages/grid-card'
import StaticPage from '@/components/pages/static-page'
import TablePage from '@/components/pages/table-page'
import TreePage from '@/components/pages/tree-page'
import useCustomViewId from '@/hooks/use-custom-view-id'
import useGetAction from '@/hooks/use-get-action'
import useGetDynamicId from '@/hooks/use-get-dynamic-id'
import useIsCRUDPath from '@/hooks/use-is-crud-path'
import useIsExceptionPath from '@/hooks/use-is-exception-path'
import useQueryFetched from '@/hooks/use-query-fetched'
import type { GetNavigationScreenResponse } from '@/types/user/common'
import type { GetPrivilegeResponse } from '@/types/user/security-role'

const Page = () => {
	const customViewId = useCustomViewId()
	const dynamicId = useGetDynamicId()
	const isCRUDPath = useIsCRUDPath()
	const isExceptionPath = useIsExceptionPath()
	const action = useGetAction()

	useIsFetching({ queryKey: ['get_navigation_screen', customViewId, dynamicId] })
	useIsFetching({ queryKey: ['get_privilege', dynamicId] })

	const getNavigationScreen = useQueryFetched<GetNavigationScreenResponse>({
		queryKey: ['get_navigation_screen', customViewId, dynamicId]
	})

	const getPrivilege = useQueryFetched<GetPrivilegeResponse>({
		queryKey: ['get_privilege', dynamicId]
	})

	const navigation = useMemo(() => {
		return getNavigationScreen?.data || []
	}, [getNavigationScreen])

	const privilege = useMemo(() => {
		return getPrivilege?.data || []
	}, [getPrivilege])

	const isTable = useMemo(() => {
		return navigation.some((item) => item.is_table)
	}, [navigation])

	const isFormTable = useMemo(() => {
		return isTable && navigation.some((item) => item.form_type === 'TABLE')
	}, [isTable, navigation])

	const isFormCardTable = useMemo(() => {
		return isTable && navigation.some((item) => item.form_type === 'CARD_TABLE')
	}, [isTable, navigation])

	const isTree = useMemo(() => {
		return isTable && navigation.some((item) => item.form_type === 'TREE')
	}, [isTable, navigation])

	const isStatic = useMemo(() => {
		const BE = isTable && navigation.some((item) => item.form_type === 'STATIC')
		const FE = (isCRUDPath && !action?.is_modal) || isExceptionPath

		return BE || FE
	}, [action?.is_modal, isCRUDPath, isExceptionPath, isTable, navigation])

	if (isTree) {
		return <TreePage navigation={navigation} privilege={privilege} />
	}

	if (isStatic) {
		return <StaticPage navigation={navigation} privilege={privilege} isCard />
	}

	if (isTable) {
		return (
			<TablePage
				isFormCardTable={isFormCardTable}
				isFormTable={isFormTable}
				navigation={navigation}
				privilege={privilege}
			/>
		)
	}

	return <GridCard navigation={navigation} privilege={privilege} />
}

export default Page
