import {
	Accordion,
	Button,
	For,
	Menu,
	MenuSelectionDetails,
	Portal,
	Presence,
	Show,
	Text
} from '@chakra-ui/react'
import { Iconify, Tooltip } from '@regla/monorepo'
import { isEmpty } from 'lodash'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import useGetParentId from '@/hooks/use-get-parent-id'
import useQueryFetched from '@/hooks/use-query-fetched'
import usePreference from '@/stores/preference'
import {
	GetAllNavigationScreenResponse,
	GetNavigationScreenData,
	GetNavigationScreenResponse
} from '@/types/user/common'
import { GenerateIcon } from '@/utilities/helper'

const SidebarContent = () => {
	const router = useRouter()
	const parentId = useGetParentId()
	const { isSidebarOpen } = usePreference()

	const getAllNavigationScreen = useQueryFetched<GetAllNavigationScreenResponse>({
		queryKey: ['get_all_navigation_screen', parentId]
	})

	const menu = useMemo(() => {
		return getAllNavigationScreen?.data || []
	}, [getAllNavigationScreen])

	return (
		<Accordion.Root
			display="flex"
			flexDirection="column"
			gap="2"
			size="lg"
			variant="plain"
			collapsible
		>
			<For each={menu}>
				{(item, index) => (
					<Accordion.Item key={index} value={item.title}>
						<Tooltip content={item.title} positioning={{ placement: 'right' }} showArrow>
							<Accordion.ItemTrigger
								_hover={{ bg: 'gray.subtle' }}
								cursor="pointer"
								paddingX="3.5"
								paddingY="3"
								onClick={() => isEmpty(item.items) && router.push(item.url)}
							>
								<Show fallback={<Iconify height="20" icon="bx:folder" />} when={item.image_url}>
									<GenerateIcon icon={item.image_url} size={20} />
								</Show>
								<Text textStyle="sm" width="full" truncate>
									{item.title}
								</Text>
								<Accordion.ItemIndicator hidden={!isSidebarOpen || isEmpty(item.items)} />
							</Accordion.ItemTrigger>
						</Tooltip>
						<Presence present={!isEmpty(item.items)}>
							<Accordion.ItemContent>
								<Accordion.ItemBody>
									<For each={item.items}>
										{(sub, id) => (
											<Tooltip
												key={id}
												content={sub.title}
												positioning={{ placement: 'right' }}
												showArrow
											>
												<Button
													gap="3"
													justifyContent="start"
													paddingY="3"
													variant="ghost"
													width="full"
													onClick={() => router.push(item.url)}
												>
													<Show
														fallback={<Iconify height="16" icon="bx:folder" />}
														when={item.image_url}
													>
														<GenerateIcon icon={sub.image_url} size={16} />
													</Show>
													<Text textAlign="left" truncate>
														{sub.title}
													</Text>
												</Button>
											</Tooltip>
										)}
									</For>
								</Accordion.ItemBody>
							</Accordion.ItemContent>
						</Presence>
					</Accordion.Item>
				)}
			</For>
		</Accordion.Root>
	)
}

const SidebarMenu = () => {
	const router = useRouter()
	const { isSidebarOpen } = usePreference()

	const getNavigationScreen = useQueryFetched<GetNavigationScreenResponse>({
		queryKey: ['get_navigation_screen']
	})

	const root = useMemo(() => {
		return getNavigationScreen?.data || []
	}, [getNavigationScreen])

	const handleOnMenuSelect = (selected: MenuSelectionDetails) => {
		const data: GetNavigationScreenData = JSON.parse(selected.value)
		router.push(data.url)
	}

	return (
		<Menu.Root onSelect={handleOnMenuSelect}>
			<Menu.Trigger asChild>
				<Button justifyContent="start" size="sm" variant="outline" width="full">
					<Iconify height={20} icon="bxs:grid-alt" />
					<Text hidden={!isSidebarOpen}>Menu</Text>
				</Button>
			</Menu.Trigger>
			<Portal>
				<Menu.Positioner>
					<Menu.Content>
						<For each={root}>
							{(item, index) => (
								<Menu.Item key={index} value={JSON.stringify(item)}>
									<Show fallback={<Iconify icon="bx:folder" />} when={item.image_url}>
										<GenerateIcon icon={item.image_url} />
									</Show>
									{item.title}
								</Menu.Item>
							)}
						</For>
					</Menu.Content>
				</Menu.Positioner>
			</Portal>
		</Menu.Root>
	)
}

export { SidebarContent, SidebarMenu }
