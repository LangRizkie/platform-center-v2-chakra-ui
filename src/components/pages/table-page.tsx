import {
	ActionBar,
	Button,
	Card,
	Center,
	Checkbox,
	CheckboxCard,
	createListCollection,
	EmptyState,
	Field,
	Flex,
	For,
	Grid,
	GridItem,
	Group,
	HStack,
	IconButton,
	Input,
	InputGroup,
	Menu,
	Portal,
	RadioCard,
	Select,
	type SelectValueChangeDetails,
	Separator,
	Show,
	Spinner,
	Stack,
	Table,
	Tag,
	Text,
	useDisclosure
} from '@chakra-ui/react'
import { ClosedTooltip, Iconify } from '@regla/monorepo'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useDebounceFn, useSelections, useSetState } from 'ahooks'
import { Case } from 'change-case-all'
import { groupBy, isEmpty } from 'lodash'
import moment from 'moment'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type React from 'react'
import { type Dispatch, type SetStateAction, useEffect, useMemo, useState } from 'react'
import useGetAction from '@/hooks/use-get-action'
import useGetCurrentId from '@/hooks/use-get-current-id'
import useGetDynamicId from '@/hooks/use-get-dynamic-id'
import useGetNativeCurrentId from '@/hooks/use-get-native-current-id'
import useIsCRUDPath from '@/hooks/use-is-crud-path'
import useIsExceptionPath from '@/hooks/use-is-exception-path'
import useQueryFetched from '@/hooks/use-query-fetched'
import { CustomEndpoint, type CustomEndpointProps } from '@/libraries/mutation/list'
import { GetFormatExportFile, GetTypeExportFile } from '@/libraries/mutation/parameter/dropdown'
import { GetLookupCustomView } from '@/libraries/mutation/user/common'
import useModalStore from '@/stores/modal-dynamic'
import type { ReglaResponse } from '@/types/default'
import type { DownloadDataPayload, PaginationPayload } from '@/types/list'
import type {
	GetNavigationScreenAction,
	GetNavigationScreenData,
	GetNavigationScreenDynamicForm
} from '@/types/user/common'
import { GetPathUrlScreenResponse } from '@/types/user/screen'
import type { GetPrivilegeData } from '@/types/user/security-role'
import { routes } from '@/utilities/constants'
import { createQueryParams, getForm, setQueryParams } from '@/utilities/helper'
import { values } from '@/utilities/validation'
import modal from '../ui/modal'
import Pagination, { type PageChangeDetails } from '../ui/pagination'

type TablePageProps = {
	navigation: GetNavigationScreenData[]
	privilege: GetPrivilegeData[]
	isFormTable: boolean
	isFormCardTable: boolean
}

type ComponentProps = Pick<TablePageProps, 'isFormTable' | 'isFormCardTable'> & {
	index: number
	navigation: GetNavigationScreenData
	privilege: GetPrivilegeData
}

type ToolbarProps = Omit<ComponentProps, 'index'> & {
	handleButtonClick: (action: GetNavigationScreenAction, row?: never) => void
}

type ButtonActionProps = {
	handleButtonClick: (action: GetNavigationScreenAction, row?: never) => void
}

type StaticModalProps = {
	data: GetNavigationScreenDynamicForm
	row: never[]
	unique: string
}

type ListProps = Omit<ComponentProps, 'index'> &
	Pick<ComponentProps, 'isFormTable' | 'isFormCardTable'> & {
		rows: never[]
		selected: never[]
		isPending: boolean
		setSelected: Dispatch<SetStateAction<never[]>>
		handleButtonClick: (action: GetNavigationScreenAction, row?: never) => void
	}

const Filter: React.FC<Pick<ComponentProps, 'navigation'>> = ({ navigation }) => {
	const router = useRouter()
	const currentId = useGetCurrentId()
	const pathname = usePathname()
	const search = useSearchParams()

	const { data } = useQuery({
		queryFn: () => GetLookupCustomView({ screenId: currentId }),
		queryKey: ['get_lookup_custom_view', currentId]
	})

	const custom = useMemo(() => {
		return data?.data || []
	}, [data])

	const selected = useMemo(() => {
		return search.get('condition') === 'All' ? '' : (search.get('condition') ?? '')
	}, [search])

	const initial = useMemo(() => {
		const list = custom.map((item) => ({
			category: item.is_standard_view ? 'standard' : 'custom',
			label: item.desc,
			value: item.id
		}))

		if (navigation.is_all_category) {
			list.unshift({ category: 'standard', label: 'All', value: '' })
		}

		return list
	}, [custom, navigation.is_all_category])

	const filter = createListCollection({
		items: initial
	})

	const categories = Object.entries(groupBy(filter.items, (item) => item.category))

	const handleValueChange = (item: SelectValueChangeDetails) => {
		const value = item.value.find((v) => !!v)
		const queries = setQueryParams(
			search.toString(),
			{ condition: value ?? 'All', start: '0' },
			{ route: pathname }
		)

		router.replace(queries)
	}

	return (
		<Select.Root
			collection={filter}
			defaultValue={[selected]}
			maxWidth="48"
			minWidth={{ base: 16, xl: 32 }}
			size="sm"
			onValueChange={handleValueChange}
		>
			<Select.HiddenSelect />
			<Select.Control>
				<Select.Trigger>
					<HStack alignItems="center">
						<Iconify height={16} icon="bx:customize" />
						<Select.ValueText width="fit" />
					</HStack>
				</Select.Trigger>
				<Select.IndicatorGroup>
					<Select.Indicator />
				</Select.IndicatorGroup>
			</Select.Control>
			<Portal>
				<Select.Positioner>
					<Select.Content>
						<For each={categories}>
							{([category, items], index) => (
								<Select.ItemGroup key={category}>
									<Select.ItemGroupLabel textStyle="xs">{category}</Select.ItemGroupLabel>
									<For each={items}>
										{(item) => (
											<Select.Item key={item.value} item={item}>
												{item.label}
												<Select.ItemIndicator />
											</Select.Item>
										)}
									</For>
									<Show when={index > items.length - 1}>
										<Separator />
									</Show>
								</Select.ItemGroup>
							)}
						</For>
					</Select.Content>
				</Select.Positioner>
			</Portal>
		</Select.Root>
	)
}

const By: React.FC<Pick<ComponentProps, 'navigation'>> = ({ navigation }) => {
	const router = useRouter()
	const pathname = usePathname()
	const search = useSearchParams()

	const columns = useMemo(() => {
		if (!navigation.map_column) return []

		return [
			{ label: 'All', value: '' },
			...navigation.map_column.map((item) => ({
				label: item.value,
				value: item.object_name
			}))
		]
	}, [navigation])

	const selected = useMemo(() => {
		return search.get('column') === 'All' ? '' : (search.get('column') ?? '')
	}, [search])

	const handleValueChange = (item: SelectValueChangeDetails) => {
		const value = item.value.find((v) => !!v)
		const queries = setQueryParams(
			search.toString(),
			{ column: value ?? 'All', start: '0' },
			{ route: pathname }
		)

		router.replace(queries)
	}

	const filter = createListCollection({
		items: columns
	})

	return (
		<Select.Root
			collection={filter}
			defaultValue={[selected]}
			maxWidth="48"
			minWidth={{ base: 16, xl: 32 }}
			size="sm"
			onValueChange={handleValueChange}
		>
			<Select.HiddenSelect />
			<Select.Control>
				<Select.Trigger
					borderBottomRightRadius="none"
					borderRight="none"
					borderTopRightRadius="none"
				>
					<Select.ValueText />
				</Select.Trigger>
				<Select.IndicatorGroup>
					<Select.Indicator />
				</Select.IndicatorGroup>
			</Select.Control>
			<Portal>
				<Select.Positioner>
					<Select.Content>
						<For each={filter.items}>
							{(item) => (
								<Select.Item key={item.value} item={item}>
									{item.label}
									<Select.ItemIndicator />
								</Select.Item>
							)}
						</For>
					</Select.Content>
				</Select.Positioner>
			</Portal>
		</Select.Root>
	)
}

const Search = () => {
	const router = useRouter()
	const pathname = usePathname()
	const search = useSearchParams()

	const [value, setValue] = useState<string>(search.get('search') ?? '')
	const { run } = useDebounceFn(() => router.replace(queries), { wait: 500 })

	const queries = setQueryParams(
		search.toString(),
		{ search: value, start: '0' },
		{ route: pathname }
	)

	return (
		<Field.Root>
			<InputGroup startElement={<Iconify height={16} icon="bx:search" />}>
				<Input
					autoComplete="off"
					borderBottomLeftRadius="none"
					borderTopLeftRadius="none"
					minWidth={{ base: 32, xl: 56 }}
					placeholder="Search..."
					size="sm"
					value={value}
					width="full"
					onChange={(e) => {
						setValue(e.target.value)
						run()
					}}
				/>
			</InputGroup>
		</Field.Root>
	)
}

const Toolbar: React.FC<ToolbarProps> = (props) => {
	const router = useRouter()
	const pathname = usePathname()
	const search = useSearchParams()
	const download = useGetAction('DOWNLOAD')
	const custom = useGetAction('CUSTOM_VIEW')

	const { open, setOpen } = useDisclosure()

	const [filter, setFilter] = useSetState({
		by: search.get('by') ?? '',
		sort: search.get('sort') ?? ''
	})

	const sorts = useMemo(() => {
		if (!props.navigation.map_column) return []

		return [
			{ label: 'Default', value: '' },
			...props.navigation.map_column.map((item) => ({
				label: item.value,
				value: item.object_name
			}))
		]
	}, [props.navigation])

	const bys = useMemo(() => {
		return [
			{ label: 'Descending', value: 'DESC' },
			{ label: 'Ascending', value: 'ASC' }
		]
	}, [])

	const handleSortChange = () => {
		setOpen(false)

		const queries = setQueryParams(search.toString(), filter, { route: pathname })
		router.replace(queries)
	}

	const customViewRoute = useMemo(() => {
		return isEmpty(custom) ? '' : [pathname, routes.exception.custom_view].join('')
	}, [custom, pathname])

	return (
		<HStack>
			<ClosedTooltip content="Download" showArrow>
				<IconButton
					cursor={{ _disabled: 'not-allowed' }}
					disabled={isEmpty(download)}
					size="sm"
					variant="ghost"
					onClick={() => props.handleButtonClick('DOWNLOAD')}
				>
					<Iconify height="20" icon="bxs:download" />
				</IconButton>
			</ClosedTooltip>
			<Menu.Root
				closeOnSelect={false}
				open={open}
				onEscapeKeyDown={() => setOpen(false)}
				onInteractOutside={() => setOpen(false)}
				onOpenChange={(item) => setOpen(item.open)}
			>
				<Menu.Trigger asChild>
					<IconButton size="sm" variant="ghost">
						<Iconify height="20" icon="bx:filter" />
					</IconButton>
				</Menu.Trigger>
				<Portal>
					<Menu.Positioner>
						<Menu.Content minW="10rem">
							<Menu.RadioItemGroup
								value={filter.sort}
								onValueChange={(item) =>
									setFilter((state) => ({
										by: isEmpty(item.value) ? 'DESC' : state.by,
										sort: item.value
									}))
								}
							>
								<Menu.ItemGroupLabel textStyle="xs">Sort</Menu.ItemGroupLabel>
								<For each={sorts}>
									{(item) => (
										<Menu.RadioItem key={item.value} value={item.value}>
											<Menu.ItemIndicator />
											{item.label}
										</Menu.RadioItem>
									)}
								</For>
							</Menu.RadioItemGroup>
							<Show when={!isEmpty(filter.sort)}>
								<Menu.RadioItemGroup
									value={filter.by}
									onValueChange={(item) => setFilter({ by: item.value })}
								>
									<Menu.ItemGroupLabel textStyle="xs">By</Menu.ItemGroupLabel>
									<For each={bys}>
										{(item) => (
											<Menu.RadioItem key={item.value} value={item.value}>
												<Menu.ItemIndicator />
												{item.label}
											</Menu.RadioItem>
										)}
									</For>
								</Menu.RadioItemGroup>
							</Show>
							<Button
								colorPalette="primary"
								marginTop="4"
								size="sm"
								width="full"
								onClick={handleSortChange}
							>
								Apply
							</Button>
						</Menu.Content>
					</Menu.Positioner>
				</Portal>
			</Menu.Root>
			<ClosedTooltip content="Custom View" showArrow>
				<IconButton
					cursor={{ _disabled: 'not-allowed' }}
					disabled={isEmpty(custom)}
					size="sm"
					variant="ghost"
					asChild
				>
					<Link aria-disabled={isEmpty(custom)} href={customViewRoute} passHref>
						<Iconify height="20" icon="fluent:data-usage-settings-24-regular" />
					</Link>
				</IconButton>
			</ClosedTooltip>
		</HStack>
	)
}

const ButtonAction: React.FC<ButtonActionProps> = ({ handleButtonClick }) => {
	const pathname = usePathname()
	const create = useGetAction('CREATE')
	const global = useGetAction('GLOBAL')
	const approve = useGetAction('APPROVE')

	const createRoute = useMemo(() => {
		return [pathname, routes.crud.create].join('')
	}, [pathname])

	return (
		<HStack flexDirection="row-reverse" gap="2">
			<Show when={!isEmpty(create)}>
				<Button colorPalette="primary" asChild>
					<Link href={createRoute} passHref shallow>
						<Iconify height={20} icon="bx:plus" style={{ color: 'white' }} />
						Create
					</Link>
				</Button>
			</Show>
			<Show when={!isEmpty(global)}>
				<Button colorPalette="primary" onClick={() => handleButtonClick('GLOBAL')}>
					<Iconify height={20} icon="bx:plus" style={{ color: 'white' }} />
					Add Global User
				</Button>
			</Show>
			<Show when={!isEmpty(approve)}>
				<Button colorPalette="teal" onClick={() => handleButtonClick('APPROVE')}>
					Approve
				</Button>
			</Show>
		</HStack>
	)
}

const List: React.FC<ListProps> = (props) => {
	const {
		allSelected,
		isSelected,
		noneSelected,
		partiallySelected,
		selected,
		toggle,
		toggleAll
	} = useSelections(props.rows, { defaultSelected: props.selected })

	const list = useGetAction('LIST')
	const view = useGetAction('VIEW')
	const update = useGetAction('UPDATE')
	const lock = useGetAction('LOCK')
	const deallocate = useGetAction('DEALLOCATE')
	const deactivate = useGetAction('DEACTIVATE')
	const erase = useGetAction('DELETE')

	const unique = useMemo(() => {
		return list ? list.unique_key : undefined
	}, [list])

	const columns = useMemo(() => {
		return props.navigation.map_column ?? []
	}, [props.navigation])

	const keys = Object.entries(groupBy(columns, (item) => item.object_name))

	const checked = useMemo(() => {
		if (partiallySelected) return 'indeterminate'
		return allSelected
	}, [allSelected, partiallySelected])

	const setCustomColumn = (row: never, key: string) => {
		if (key.toLowerCase() === 'status') {
			const passed = ['active', 'success', 'passed']
			const failed = ['failed', 'not passed']

			const isPassed = passed.includes(Case.lower(row[key]))
			const isFailed = failed.includes(Case.lower(row[key]))

			const palette = (isPassed && 'green') || (isFailed && 'red') || 'gray'

			return (
				<Tag.Root colorPalette={palette}>
					<Tag.Label>{row[key]}</Tag.Label>
				</Tag.Root>
			)
		}

		if (/_time|_date/.test(key.toLowerCase())) {
			return <Text>{moment(row[key] || '-').format('LLL')}</Text>
		}

		return <Text>{row[key] ?? '-'}</Text>
	}

	useEffect(() => {
		props.setSelected(selected)
	}, [props, selected])

	return (
		<Show
			when={!isEmpty(columns)}
			fallback={
				<EmptyState.Root>
					<EmptyState.Content>
						<EmptyState.Description>No Data Available</EmptyState.Description>
					</EmptyState.Content>
				</EmptyState.Root>
			}
		>
			<Show
				when={!props.isPending}
				fallback={
					<Center marginY="12">
						<Spinner size="xl" />
					</Center>
				}
			>
				<Show when={props.isFormTable}>
					<Table.ScrollArea borderWidth="1px">
						<Table.Root striped>
							<Table.Header>
								<Table.Row>
									<Table.ColumnHeader backgroundColor="bg" left="0" position="sticky">
										<Checkbox.Root
											checked={checked}
											colorPalette="primary"
											onCheckedChange={() => toggleAll()}
										>
											<Checkbox.HiddenInput />
											<Checkbox.Control />
										</Checkbox.Root>
									</Table.ColumnHeader>
									<For each={columns}>
										{(item) => (
											<Table.ColumnHeader key={item.object_name} whiteSpace="nowrap">
												{item.value}
											</Table.ColumnHeader>
										)}
									</For>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								<Show when={!isEmpty(props.rows)}>
									<For each={props.rows}>
										{(row, index) => {
											const key = unique ? row[unique] : index
											const color = ~index & 1 ? 'bg.muted' : 'bg'

											return (
												<Menu.Root
													key={key}
													onSelect={({ value }) =>
														props.handleButtonClick(value as GetNavigationScreenAction, row)
													}
												>
													<Menu.ContextTrigger width="full" asChild>
														<Table.Row onClick={() => toggle(row)}>
															<Table.Cell backgroundColor={color} left="0" position="sticky">
																<Checkbox.Root
																	checked={isSelected(row)}
																	colorPalette="primary"
																	onClick={() => toggle(row)}
																>
																	<Checkbox.HiddenInput />
																	<Checkbox.Control />
																</Checkbox.Root>
															</Table.Cell>
															<For each={keys}>
																{([key]) => (
																	<Table.Cell key={crypto.randomUUID()} whiteSpace="nowrap">
																		{setCustomColumn(row, key)}
																	</Table.Cell>
																)}
															</For>
														</Table.Row>
													</Menu.ContextTrigger>
													<Portal>
														<Menu.Positioner>
															<Menu.Content>
																<Menu.Item hidden={isEmpty(view)} value="VIEW">
																	<Text width="full">View</Text>
																	<Iconify height="16" icon="bxs:show" />
																</Menu.Item>
																<Menu.Item hidden={isEmpty(update)} value="UPDATE">
																	<Text width="full">Update</Text>
																	<Iconify height="16" icon="bxs:edit-alt" />
																</Menu.Item>
																<Menu.Item hidden={isEmpty(lock)} value="LOCK">
																	<Text width="full">Unlock</Text>
																	<Iconify height="16" icon="bx:lock-open" />
																</Menu.Item>
																<Menu.Item hidden={isEmpty(deallocate)} value="DEALLOCATE">
																	<Text width="full">Deallocate</Text>
																	<Iconify
																		height="16"
																		icon="icon-park-solid:people-delete-one"
																	/>
																</Menu.Item>
																<Menu.Item hidden={isEmpty(deactivate)} value="DEACTIVATE">
																	<Text width="full">Deactivate</Text>
																	<Iconify height="16" icon="bxs:minus-circle" />
																</Menu.Item>
																<Menu.Item hidden={isEmpty(erase)} value="DELETE">
																	<Text width="full">Delete</Text>
																	<Iconify height="16" icon="bxs:trash" />
																</Menu.Item>
															</Menu.Content>
														</Menu.Positioner>
													</Portal>
												</Menu.Root>
											)
										}}
									</For>
								</Show>
							</Table.Body>
						</Table.Root>
					</Table.ScrollArea>
				</Show>
				<Show when={props.isFormCardTable}>
					<Grid
						gap="6"
						templateColumns={{
							base: 'repeat(1, 1fr)',
							md: 'repeat(2, 1fr)',
							xl: 'repeat(3, 1fr)'
						}}
					>
						<For each={props.rows}>
							{(row, index) => (
								<GridItem key={index}>
									<Menu.Root
										onSelect={({ value }) =>
											props.handleButtonClick(value as GetNavigationScreenAction, row)
										}
									>
										<Menu.ContextTrigger width="full">
											<CheckboxCard.Root
												checked={isSelected(row)}
												colorPalette="primary"
												onCheckedChange={() => toggle(row)}
											>
												<CheckboxCard.HiddenInput />
												<CheckboxCard.Control>
													<CheckboxCard.Content>
														<CheckboxCard.Label>
															{
																row[
																	columns.filter((column) =>
																		column.object_name.includes('_name')
																	)[0].object_name ?? '-'
																]
															}
														</CheckboxCard.Label>
													</CheckboxCard.Content>
													<CheckboxCard.Indicator />
												</CheckboxCard.Control>
												<CheckboxCard.Addon>
													<Stack gap="2">
														<For
															each={columns.filter(
																(column) => !column.object_name.includes('_name')
															)}
														>
															{(column) => (
																<Flex
																	key={column.object_name}
																	gap="4"
																	justifyContent="space-between"
																>
																	<Text minWidth="fit">{column.value}</Text>
																	{setCustomColumn(row, column.object_name)}
																</Flex>
															)}
														</For>
													</Stack>
												</CheckboxCard.Addon>
											</CheckboxCard.Root>
										</Menu.ContextTrigger>
										<Portal>
											<Menu.Positioner>
												<Menu.Content>
													<Menu.Item hidden={isEmpty(view)} value="VIEW">
														<Text width="full">View</Text>
														<Iconify height="16" icon="bxs:show" />
													</Menu.Item>
													<Menu.Item hidden={isEmpty(update)} value="UPDATE">
														<Text width="full">Update</Text>
														<Iconify height="16" icon="bxs:edit-alt" />
													</Menu.Item>
													<Menu.Item hidden={isEmpty(lock)} value="LOCK">
														<Text width="full">Unlock</Text>
														<Iconify height="16" icon="bx:lock-open" />
													</Menu.Item>
													<Menu.Item hidden={isEmpty(deallocate)} value="DEALLOCATE">
														<Text width="full">Deallocate</Text>
														<Iconify height="16" icon="icon-park-solid:people-delete-one" />
													</Menu.Item>
													<Menu.Item hidden={isEmpty(deactivate)} value="DEACTIVATE">
														<Text width="full">Deactivate</Text>
														<Iconify height="16" icon="bxs:minus-circle" />
													</Menu.Item>
													<Menu.Item hidden={isEmpty(erase)} value="DELETE">
														<Text width="full">Delete</Text>
														<Iconify height="16" icon="bxs:trash" />
													</Menu.Item>
												</Menu.Content>
											</Menu.Positioner>
										</Portal>
									</Menu.Root>
								</GridItem>
							)}
						</For>
					</Grid>
				</Show>
				<ActionBar.Root open={!noneSelected}>
					<Portal>
						<ActionBar.Positioner>
							<ActionBar.Content>
								<ActionBar.SelectionTrigger>
									{selected.length} selected
								</ActionBar.SelectionTrigger>
								<ActionBar.Separator />
								<Show when={selected.length === 1}>
									<ClosedTooltip content="view" showArrow>
										<IconButton
											variant="ghost"
											onClick={() => props.handleButtonClick('VIEW', selected[0])}
										>
											<Iconify height="20" icon="bxs:show" />
										</IconButton>
									</ClosedTooltip>
								</Show>
								<Show when={selected.length === 1}>
									<ClosedTooltip content="update" showArrow>
										<IconButton
											variant="ghost"
											onClick={() => props.handleButtonClick('UPDATE', selected[0])}
										>
											<Iconify height="20" icon="bxs:edit-alt" />
										</IconButton>
									</ClosedTooltip>
								</Show>
								<Show when={lock}>
									<ClosedTooltip content="unlock" showArrow>
										<IconButton variant="ghost" onClick={() => props.handleButtonClick('LOCK')}>
											<Iconify height="20" icon="bx:lock-open" />
										</IconButton>
									</ClosedTooltip>
								</Show>
								<Show when={deallocate}>
									<ClosedTooltip content="deallocate" showArrow>
										<IconButton
											variant="ghost"
											onClick={() => props.handleButtonClick('DEALLOCATE')}
										>
											<Iconify height="20" icon="icon-park-solid:people-delete-one" />
										</IconButton>
									</ClosedTooltip>
								</Show>
								<Show when={deactivate}>
									<ClosedTooltip content="deactivate" showArrow>
										<IconButton
											variant="ghost"
											onClick={() => props.handleButtonClick('DEACTIVATE')}
										>
											<Iconify height="20" icon="bxs:minus-circle" />
										</IconButton>
									</ClosedTooltip>
								</Show>
								<Show when={erase}>
									<ClosedTooltip content="delete" showArrow>
										<IconButton
											variant="ghost"
											onClick={() => props.handleButtonClick('DELETE')}
										>
											<Iconify height="20" icon="bxs:trash" />
										</IconButton>
									</ClosedTooltip>
								</Show>
							</ActionBar.Content>
						</ActionBar.Positioner>
					</Portal>
				</ActionBar.Root>
			</Show>
		</Show>
	)
}

const Download: React.FC<StaticModalProps> = (props) => {
	const currentId = useGetCurrentId()
	const params = useSearchParams()

	const { setAttribute } = useModalStore()

	const [download, setDownload] = useSetState({ format: '', type: '' })

	const columnSearch = useMemo(() => {
		const column = params.get('column') ?? ''
		return column ? [column] : []
	}, [params])

	const customViewId = useMemo(() => {
		return params.get('condition') ?? ''
	}, [params])

	const length = useMemo(() => {
		return params.get('length') ?? values.length
	}, [params])

	const start = useMemo(() => {
		return params.get('start') ?? values.start
	}, [params])

	const sort = useMemo(() => {
		const sort = params.get('sort')
		const by = params.get('by')
		const isDefaultSort = sort === 'Default'

		if (sort && !isDefaultSort && by) {
			const field = sort === 'Default' ? '' : sort
			return [{ dir: by, field }]
		}

		return []
	}, [params])

	const search = useMemo(() => {
		return params.get('search') ?? ''
	}, [params])

	const queries = useMemo(
		() => ({
			columnSearch,
			customViewId,
			filter: { filters: [] },
			length,
			search,
			sort,
			start
		}),
		[columnSearch, customViewId, length, search, sort, start]
	)

	const type = useQuery({
		queryFn: GetTypeExportFile,
		queryKey: ['get_type_export_file']
	})

	const format = useQuery({
		queryFn: GetFormatExportFile,
		queryKey: ['get_format_export_file']
	})

	const { mutateAsync } = useMutation<
		ReglaResponse,
		Error,
		CustomEndpointProps<DownloadDataPayload>
	>({
		mutationFn: CustomEndpoint,
		mutationKey: ['list_export', currentId, search.toString()]
	})

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault()

		mutateAsync({
			...props.data,
			...queries,
			[props.unique]: download.type === 'Selected' ? props.row : [],
			format: download.format,
			type: download.type
		}).finally(() => modal.close('download'))
	}

	useEffect(() => {
		modal.update('download', {
			...modal.get('download'),
			options: { submit: { disabled: isEmpty(download.format) || isEmpty(download.type) } }
		})
	}, [download.format, download.type, setAttribute])

	return (
		<Stack as="form" gap="8" id="submit-form" onSubmit={handleSubmit}>
			<RadioCard.Root
				colorPalette="primary"
				onValueChange={({ value }) => setDownload({ type: value ?? '' })}
			>
				<RadioCard.Label>File Type</RadioCard.Label>
				<Stack align="stretch">
					<Show when={!type.isPending}>
						<For each={type.data?.data}>
							{(item) => (
								<RadioCard.Item
									key={item.id}
									disabled={item.id === 'Selected' && props.row.length < 1}
									value={item.id.toString()}
								>
									<RadioCard.ItemHiddenInput />
									<RadioCard.ItemControl>
										<RadioCard.ItemText>
											{item.desc} {item.id === 'Selected' && `(${props.row.length})`}
										</RadioCard.ItemText>
										<RadioCard.ItemIndicator />
									</RadioCard.ItemControl>
								</RadioCard.Item>
							)}
						</For>
					</Show>
				</Stack>
			</RadioCard.Root>
			<RadioCard.Root
				align="center"
				colorPalette="primary"
				justify="center"
				orientation="horizontal"
				onValueChange={({ value }) => setDownload({ format: value ?? '' })}
			>
				<RadioCard.Label>File Format</RadioCard.Label>
				<HStack>
					<Show when={!format.isPending}>
						<For each={format.data?.data}>
							{(item) => (
								<RadioCard.Item key={item.id} value={item.id.toString()}>
									<RadioCard.ItemHiddenInput />
									<RadioCard.ItemControl>
										<RadioCard.ItemText>{item.desc}</RadioCard.ItemText>
									</RadioCard.ItemControl>
								</RadioCard.Item>
							)}
						</For>
					</Show>
				</HStack>
			</RadioCard.Root>
		</Stack>
	)
}

const Component: React.FC<ComponentProps> = ({ index, ...props }) => {
	const router = useRouter()
	const pathname = usePathname()
	const params = useSearchParams()
	const isCRUDPath = useIsCRUDPath()
	const isExceptionPath = useIsExceptionPath()
	const dynamicId = useGetDynamicId()
	const nativeCurrentId = useGetNativeCurrentId()
	const list = useGetAction('LIST')

	const { setAttribute } = useModalStore()

	const { data, isPending, mutateAsync } = useMutation<
		ReglaResponse<never[]>,
		Error,
		CustomEndpointProps<PaginationPayload>
	>({
		mutationFn: CustomEndpoint,
		mutationKey: ['custom_endpoint', dynamicId, params.toString()]
	})

	const getPathUrlScreen = useQueryFetched<GetPathUrlScreenResponse>({
		queryKey: ['get_path_url_screen', nativeCurrentId, isCRUDPath, dynamicId, isExceptionPath]
	})

	const queries = createQueryParams(
		{
			by: 'ASC',
			column: 'All',
			condition: props.navigation.default_custom_view_id ?? 'All',
			length: values.length.toString(),
			sort: 'Default',
			start: values.start.toString()
		},
		{ route: pathname }
	)

	const columnSearch = useMemo(() => {
		const value = params.get('column')
		if (value === 'All') return []
		return value ? [value] : []
	}, [params])

	const customViewId = useMemo(() => {
		const value = params.get('condition')
		if (value === 'All') return ''
		return value ?? ''
	}, [params])

	const length = useMemo(() => {
		const value = params.get('length')
		return value ? Number(value) : values.length
	}, [params])

	const start = useMemo(() => {
		const value = params.get('start')
		return value ? Number(value) : values.start
	}, [params])

	const search = useMemo(() => {
		const value = params.get('search')
		return value ?? ''
	}, [params])

	const sort = useMemo(() => {
		const sort = params.get('sort')
		const by = params.get('by')
		const isDefaultSort = sort === 'Default'

		if (sort && !isDefaultSort && by) {
			const field = sort === 'Default' ? '' : sort
			return [{ dir: by, field }]
		}

		return []
	}, [params])

	const recordsTotal = useMemo(() => {
		return data ? data.recordsTotal : 0
	}, [data])

	const rows = useMemo(() => {
		return data?.data || []
	}, [data])

	const title = useMemo(() => {
		if (getPathUrlScreen?.data) {
			const path = getPathUrlScreen.data.flatMap((item) => item.path.split('/'))
			return path[path.length - 1]
		}

		return ''
	}, [getPathUrlScreen?.data])

	const { clearAll, selected, setSelected } = useSelections(rows)

	const handleAnimationDuration = (index: number) => {
		return (index + 1) * 200 + 'ms'
	}

	const handleButtonClick = (action: GetNavigationScreenAction, row?: never) => {
		const data = getForm(action, props.navigation)

		if (data) {
			const name = [Case.capital(data.action), title].join(' ')
			const unlock = ['Unlock', title].join(' ')
			const route = [pathname, '/', data.action.toLowerCase()].join('')

			if (data.is_modal) {
				switch (data.action) {
					case 'DOWNLOAD':
						return handleDownloadModal(data, name)
					case 'GLOBAL':
						return console.log('global')
					case 'APPROVE':
						return handleDynamicModal({ data, row, title: name })
					case 'LOCK':
						return handleDynamicModal({
							buttonTitle: 'Unlock',
							colorPalette: 'primary',
							data,
							row,
							title: unlock
						})
					case 'DEALLOCATE':
					case 'DEACTIVATE':
					case 'DELETE':
						return handleDynamicModal({ colorPalette: 'red', data, row, title: name })
				}
			}

			if (row) {
				const queries = createQueryParams(
					{ [data.unique_key]: row[data.unique_key] },
					{ route }
				)

				return router.push(queries)
			}
		}
	}

	const handleDownloadModal = (
		data: GetNavigationScreenDynamicForm,
		title: string,
		row?: never
	) => {
		const list = row ? [row] : selected
		const unique = list.map((item) => item[data.unique_key])

		modal.open('download', {
			children: <Download data={data} row={unique} unique={data.unique_key} />,
			options: { submit: { disabled: true, title: 'Download' } },
			size: 'lg',
			title
		})
	}

	const handleDynamicModal = (options: {
		data: GetNavigationScreenDynamicForm
		title: string
		colorPalette?: 'primary' | 'red'
		buttonTitle?: string
		row?: never
	}) => {
		const list = options.row ? [options.row] : selected
		const unique = list.map((item) => item[options.data.unique_key])

		modal.open('danger', {
			children: (
				<Center paddingY="8" textStyle="md">
					Are you sure you want to {Case.lower(options.data.action)} the selected record(s)?
				</Center>
			),
			options: {
				submit: {
					colorPalette: options.colorPalette ?? 'primary',
					onClick: () => {
						setAttribute('submit', { loading: true })
						CustomEndpoint({ [options.data.unique_key]: unique, ...options.data })
							.then(() => router.replace(setQueryParams(search.toString(), { start: '0' })))
							.catch((error) => error)
							.finally(() => {
								setAttribute('submit', { loading: false })
								modal.close('danger')
							})
					},
					title: options.buttonTitle ?? Case.capital(options.data.action)
				}
			},
			size: 'sm',
			title: options.title
		})
	}

	const handlePaginationChange = (value: PageChangeDetails) => {
		const queries = setQueryParams(
			params.toString(),
			{
				length: value.pageSize.toString(),
				start: (value.page - 1).toString()
			},
			{ route: pathname }
		)

		router.replace(queries)
	}

	const payload = useMemo(
		(): PaginationPayload => ({
			columnSearch,
			customViewId,
			filter: { filters: [] },
			length,
			search,
			sort,
			start
		}),
		[columnSearch, customViewId, length, search, sort, start]
	)

	useEffect(() => {
		if (params.size <= 0 && !isCRUDPath) router.replace(queries)
	}, [isCRUDPath, queries, router, params.size])

	useEffect(() => {
		if (!isEmpty(list) && params.size > 0) mutateAsync({ ...payload, ...list })
		clearAll()
	}, [clearAll, list, mutateAsync, params.size, payload])

	return (
		<Card.Root
			animationDuration={handleAnimationDuration(index)}
			animationName="slide-from-top, fade-in"
			width="full"
		>
			<Card.Header>
				<Grid
					autoColumns={{ base: 'auto', xl: 'min-content' }}
					autoFlow={{ base: 'row', xl: 'column' }}
					gap="4"
					templateColumns={{ xl: 'min-content min-content auto' }}
					width="full"
				>
					<GridItem colSpan={{ base: 4, xl: 1 }}>
						<HStack>
							<Filter {...props} />
							<Group width="full" attached>
								<By {...props} />
								<Search />
							</Group>
						</HStack>
					</GridItem>
					<GridItem colSpan={1} rowStart={{ base: 2, xl: 'auto' }}>
						<Toolbar handleButtonClick={handleButtonClick} {...props} />
					</GridItem>
					<GridItem colSpan={{ base: 3, xl: 1 }} rowStart={{ base: 2, xl: 'auto' }}>
						<ButtonAction handleButtonClick={handleButtonClick} />
					</GridItem>
				</Grid>
			</Card.Header>
			<Card.Body>
				<List
					key={rows.toString()}
					handleButtonClick={handleButtonClick}
					isPending={isPending}
					rows={rows}
					selected={selected}
					setSelected={setSelected}
					{...props}
				/>
			</Card.Body>
			<Card.Footer alignSelf="end">
				<Pagination
					length={length}
					recordsTotal={recordsTotal}
					start={start}
					onPageChange={handlePaginationChange}
				/>
			</Card.Footer>
		</Card.Root>
	)
}

const TablePage: React.FC<TablePageProps> = (props) => {
	return (
		<For each={props.navigation}>
			{(item, index) => (
				<Component
					key={index}
					index={index}
					isFormCardTable={props.isFormCardTable}
					isFormTable={props.isFormTable}
					navigation={item}
					privilege={props.privilege[index]}
				/>
			)}
		</For>
	)
}

export default TablePage
