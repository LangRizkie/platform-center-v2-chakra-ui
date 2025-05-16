import {
	Avatar,
	Badge,
	Box,
	Center,
	chakra,
	EmptyState,
	Float,
	For,
	FormatNumber,
	Heading,
	HStack,
	IconButton,
	Link,
	Menu,
	MenuSelectionDetails,
	Popover,
	Portal,
	Separator,
	Show,
	Spinner,
	Stack,
	Text
} from '@chakra-ui/react'
import { Iconify, Search } from '@regla/monorepo'
import { useMutation } from '@tanstack/react-query'
import { useDebounceFn } from 'ahooks'
import { isEmpty } from 'lodash'
import moment from 'moment'
import Image from 'next/image'
import {
	redirect,
	RedirectType,
	usePathname,
	useRouter,
	useSearchParams
} from 'next/navigation'
import { useEffect, useMemo } from 'react'
import { logout } from '@/config/instance'
import useGetAppId from '@/hooks/use-get-app-id'
import useQueryFetched from '@/hooks/use-query-fetched'
import { IsRead } from '@/libraries/mutation/email/update'
import { GeneralSearch, GeneralSearchModule } from '@/libraries/mutation/parameter/parameter'
import useUserProperty from '@/stores/user-property'
import { ListResponse, PagingData } from '@/types/email/user/notification/list'
import { routes } from '@/utilities/constants'
import { setQueryParams } from '@/utilities/helper'
import modal from './modal'

const Empty = () => (
	<EmptyState.Root size="sm">
		<EmptyState.Content>
			<EmptyState.Indicator>
				<Iconify icon="flat-color-icons:about" />
			</EmptyState.Indicator>
			<EmptyState.Title textStyle="xs">Record is Empty</EmptyState.Title>
		</EmptyState.Content>
	</EmptyState.Root>
)

const Header = () => {
	const router = useRouter()
	const pathname = usePathname()
	const params = useSearchParams()
	const appId = useGetAppId()

	const { firstName, lastName } = useUserProperty()

	const list = useQueryFetched<ListResponse>({
		queryKey: ['list']
	})

	const { mutateAsync: isRead } = useMutation({
		mutationFn: IsRead,
		mutationKey: ['is_read']
	})

	const {
		data: module,
		isPending: isModuleLoading,
		mutateAsync: generalSearch
	} = useMutation({
		mutationFn: GeneralSearch,
		mutationKey: ['general_search']
	})

	const {
		data: submodule,
		isPending: isSubmoduleLoading,
		mutateAsync: generalSearchModule
	} = useMutation({
		mutationFn: GeneralSearchModule,
		mutationKey: ['general_search_module']
	})

	const { run: handleValueChange } = useDebounceFn(
		(search) => {
			if (search) {
				generalSearch({ search })
				generalSearchModule({ search })
			}

			const queries = setQueryParams(params.toString(), { path: search }, { route: pathname })
			router.replace(queries)
		},
		{ wait: 500 }
	)

	const value = useMemo(() => {
		return params.get('path') ?? undefined
	}, [params])

	const fallback = useMemo(() => {
		return [firstName, lastName].join(' ')
	}, [firstName, lastName])

	const moduleList = useMemo(() => {
		return module?.data.list || []
	}, [module?.data.list])

	const submoduleList = useMemo(() => {
		return submodule?.data.list || []
	}, [submodule?.data.list])

	const notification = useMemo(() => {
		const count = list?.data.count ?? 0
		const data = list?.data.list || []

		return { count, data }
	}, [list?.data.count, list?.data.list])

	const searchRoute = useMemo(() => {
		const route = [appId, routes.exception.search].join('')
		return `/${route}${location.search}`
	}, [appId])

	const notificationRoute = useMemo(() => {
		const route = [appId, routes.exception.notification].join('')
		return `/${route}${location.search}`
	}, [appId])

	const handleLinkClick = (item: PagingData) => {
		modal.open('is-read', {
			children: (
				<Center mb="4" mt="8">
					<Spinner color="primary.fg" size="lg" />
				</Center>
			),
			options: { cancel: { hidden: true }, submit: { hidden: true } },
			size: 'xs'
		})

		isRead({ notification_id: item.notification_id })
			.then(() => {
				redirect(item.redirect_url, RedirectType.push)
			})
			.finally(() => {
				modal.close('is-read')
			})
	}

	const handleProfileClick = ({ value }: MenuSelectionDetails) => {
		switch (value) {
			case 'main':
				location.href = routes.main
				return
			case 'profile':
				return redirect('/' + appId + routes.exception.profile, RedirectType.push)
			case 'logout':
				modal.open('logout', {
					children: (
						<Center mb="4" mt="8">
							<Spinner color="primary.fg" size="lg" />
						</Center>
					),
					options: { cancel: { hidden: true }, submit: { hidden: true } },
					size: 'xs'
				})

				logout()
				return
			default:
				break
		}
	}

	useEffect(() => {
		if (params.get('path')) handleValueChange(params.get('path'))
	}, [handleValueChange, params])

	return (
		<HStack gap="4">
			<Search defaultValue={value} onValueChange={handleValueChange}>
				<Stack gap="0">
					<Box padding="4">
						<Heading textStyle="xs">Record(s)</Heading>
					</Box>
					<Separator />
					<Box maxHeight="48" overflowX="auto" width="full">
						<Show
							when={!isModuleLoading}
							fallback={
								<Center marginY="4">
									<Spinner color="primary.fg" />
								</Center>
							}
						>
							<Show fallback={<Empty />} when={!isEmpty(moduleList)}>
								<For each={moduleList}>
									{(item, index) => (
										<Link
											key={index}
											_hover={{ backgroundColor: 'bg.muted' }}
											href={item.redirect_url}
											width="full"
											truncate
										>
											<Stack gap="1" padding="4" textStyle="xs" width="full">
												<Text
													color="primary.fg"
													fontWeight="semibold"
													marginBottom="1"
													textStyle="sm"
													truncate
												>
													{item.model_name}
												</Text>
												<Text truncate>{item.path}</Text>
												<Text truncate>{item.record_name}</Text>
											</Stack>
										</Link>
									)}
								</For>
							</Show>
						</Show>
					</Box>
					<Separator />
					<Box padding="4">
						<Heading textStyle="xs">Module(s)/Sub-Module(s)</Heading>
					</Box>
					<Separator />
					<Box maxHeight="48" overflowX="auto" width="full">
						<Show
							when={!isSubmoduleLoading}
							fallback={
								<Center marginY="4">
									<Spinner color="primary.fg" />
								</Center>
							}
						>
							<Show fallback={<Empty />} when={!isEmpty(submoduleList)}>
								<For each={submoduleList}>
									{(item, index) => (
										<Link
											key={index}
											_hover={{ backgroundColor: 'bg.muted' }}
											href={item.redirect_url}
											width="full"
											truncate
										>
											<Stack gap="1" padding="4" textStyle="xs" width="full">
												<Text
													color="primary.fg"
													fontWeight="semibold"
													marginBottom="1"
													textStyle="sm"
													truncate
												>
													{item.model_name}
												</Text>
												<Text truncate>{item.path}</Text>
											</Stack>
										</Link>
									)}
								</For>
							</Show>
						</Show>
					</Box>
					<Separator />
					<Center padding="4">
						<Link colorPalette="primary" href={searchRoute} textStyle="xs">
							See all results
						</Link>
					</Center>
				</Stack>
			</Search>
			<Popover.Root autoFocus={false}>
				<Popover.Trigger asChild>
					<IconButton variant="subtle">
						<Iconify height={20} icon="bxs:bell" />
						<Show when={notification.count > 0}>
							<Float placement="top-end">
								<Badge colorPalette="red" size="sm" variant="solid">
									<Text fontSize="2xs">
										<FormatNumber
											compactDisplay="short"
											notation="compact"
											value={notification.count}
										/>
									</Text>
								</Badge>
							</Float>
						</Show>
					</IconButton>
				</Popover.Trigger>
				<Portal>
					<Popover.Positioner>
						<Popover.Content width="96">
							<Popover.Body padding="0">
								<Box padding="4">
									<Heading textStyle="xs">Notification</Heading>
								</Box>
								<Separator />
								<Box maxHeight="72" overflowX="auto" width="full">
									<Show fallback={<Empty />} when={!isEmpty(notification.data)}>
										<For each={notification.data}>
											{(item, index) => (
												<Link
													key={index}
													_hover={{ backgroundColor: 'bg.muted' }}
													variant="plain"
													width="full"
													onClick={() => handleLinkClick(item)}
												>
													<HStack gap="4" padding="4" textStyle="xs" width="full">
														<Show
															when={item.is_read}
															fallback={
																<Image alt="unread" height={40} src="/unread.svg" width={40} />
															}
														>
															<Image alt="read" height={40} src="/read.svg" width={40} />
														</Show>
														<chakra.div
															dangerouslySetInnerHTML={{ __html: item.message }}
															width="full"
														/>
														<Text whiteSpace="nowrap">
															{moment(item.created_date).fromNow()}
														</Text>
													</HStack>
												</Link>
											)}
										</For>
									</Show>
								</Box>
								<Center padding="4">
									<Link colorPalette="primary" href={notificationRoute} textStyle="xs">
										View all notifications
									</Link>
								</Center>
							</Popover.Body>
						</Popover.Content>
					</Popover.Positioner>
				</Portal>
			</Popover.Root>
			<Menu.Root onSelect={handleProfileClick}>
				<Menu.Trigger focusRing="outside" rounded="full">
					<Avatar.Root size="sm" variant="outline">
						<Avatar.Fallback name={fallback} />
					</Avatar.Root>
				</Menu.Trigger>
				<Portal>
					<Menu.Positioner>
						<Menu.Content>
							<Menu.Item value="main">
								<Iconify height="16" icon="bx:grid-alt" />
								<Text>Main</Text>
							</Menu.Item>
							<Menu.Item value="profile">
								<Iconify height="16" icon="bx:user" />
								<Text>Profile</Text>
							</Menu.Item>
							<Menu.Item color="red" value="logout">
								<Iconify height="16" icon="bx:log-out" />
								<Text>Logout</Text>
							</Menu.Item>
						</Menu.Content>
					</Menu.Positioner>
				</Portal>
			</Menu.Root>
		</HStack>
	)
}

export default Header
