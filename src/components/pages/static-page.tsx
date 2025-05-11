import { Card, Center, Show, Spinner } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import { useEffect, useMemo } from 'react'
import useGetDynamicId from '@/hooks/use-get-dynamic-id'
import useGetRoute from '@/hooks/use-get-route'
import useIsCRUDPath from '@/hooks/use-is-crud-path'
import useIsExceptionPath from '@/hooks/use-is-exception-path'
import useStaticStore from '@/stores/button-static'
import type { GetNavigationScreenData } from '@/types/user/common'
import type { GetPrivilegeData } from '@/types/user/security-role'
import { messages } from '@/utilities/validation'
import Forbidden from './forbidden'

type StaticPageProps = {
	navigation: GetNavigationScreenData[]
	privilege: GetPrivilegeData[]
	isCard?: boolean
}

const ErrorComponent = () => <>{messages.component_not_found}</>

const LoadingComponent = () => (
	<Center marginY="2">
		<Spinner size="lg" />
	</Center>
)

const StaticPage: React.FC<StaticPageProps> = (props) => {
	const dynamicId = useGetDynamicId()
	const route = useGetRoute({ fromLast: true, index: 0 })
	const isCRUDPath = useIsCRUDPath()
	const isExceptionPath = useIsExceptionPath()

	const { card, reset, setBack, setSubmit } = useStaticStore()

	const normal = dynamicId?.toLowerCase()
	const crud = normal + '/' + route

	const path = useMemo(() => {
		if (isCRUDPath) return crud
		if (isExceptionPath) return route
		return normal
	}, [crud, isCRUDPath, isExceptionPath, normal, route])

	const routes = `./${path}/page.tsx`

	const Component = useMemo(
		() =>
			dynamic<StaticPageProps>(() => import(routes).catch(() => ErrorComponent), {
				loading: LoadingComponent,
				ssr: false
			}),
		[routes]
	)

	const privilege = useMemo(() => {
		return props.privilege.find(
			(item) => item.screen_id.toLowerCase() === dynamicId?.toLowerCase()
		)
	}, [props.privilege, dynamicId])

	const canInsert = useMemo(() => {
		return privilege ? privilege.can_insert : false
	}, [privilege])

	const canUpdate = useMemo(() => {
		return privilege ? privilege.can_update : false
	}, [privilege])

	const canSubmit = useMemo(() => {
		return canInsert || canUpdate
	}, [canInsert, canUpdate])

	const canView = useMemo(() => {
		return privilege ? privilege.can_view : (isExceptionPath ?? false)
	}, [privilege, isExceptionPath])

	const canInteractWithSubmit = useMemo(() => {
		return canSubmit && canView && props.isCard
	}, [canSubmit, canView, props.isCard])

	useEffect(() => {
		setBack({ hidden: !props.isCard })
		setSubmit({ hidden: !canInteractWithSubmit })

		return () => reset()
	}, [setBack, setSubmit, reset, canInteractWithSubmit, props.isCard])

	return (
		<Show fallback={<Forbidden />} when={canView}>
			<Show when={props.isCard}>
				<Show
					when={card?.normalize}
					fallback={
						<Card.Root {...card} hidden={card?.hidden}>
							<Card.Header />
							<Card.Body paddingX="8">
								<Component {...props} />
							</Card.Body>
							<Card.Footer />
						</Card.Root>
					}
				>
					<Component {...props} />
				</Show>
			</Show>
			<Show when={!props.isCard}>
				<Component {...props} />
			</Show>
		</Show>
	)
}

export default StaticPage
