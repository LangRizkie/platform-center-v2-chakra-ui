import {
	Center,
	createListCollection,
	Field,
	For,
	Group,
	HStack,
	Input,
	InputGroup,
	Link,
	Portal,
	Select,
	Show,
	Stack,
	Table
} from '@chakra-ui/react'
import { Iconify } from '@regla/monorepo'
import { useMutation } from '@tanstack/react-query'
import { useDebounceFn } from 'ahooks'
import { isEmpty } from 'lodash'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import modal from '@/components/ui/modal'
import Pagination from '@/components/ui/pagination'
import {
	AssignedLicense,
	GetListLicensePaging,
	RevokeLicense
} from '@/libraries/mutation/platform-settings/license-key'
import useStaticStore from '@/stores/button-static'
import useModalStore from '@/stores/modal-dynamic'
import { PaginationPayload } from '@/types/list'
import { GetListLicensePagingData } from '@/types/platform-settings/license-key'
import { createQueryParams, setQueryParams } from '@/utilities/helper'
import { values } from '@/utilities/validation'

const DataTable = () => {
	const router = useRouter()
	const params = useSearchParams()
	const pathname = usePathname()

	const { setBack, setSubmit: setStaticSubmit } = useStaticStore()
	const { setSubmit } = useModalStore()

	const { data, mutateAsync } = useMutation({
		mutationFn: GetListLicensePaging,
		mutationKey: ['get_list_license_paging']
	})

	const { mutateAsync: revoke } = useMutation({
		mutationFn: RevokeLicense,
		mutationKey: ['revoke_license']
	})

	const { mutateAsync: assign } = useMutation({
		mutationFn: AssignedLicense,
		mutationKey: ['assigned_license']
	})

	const [value, setValue] = useState<string>(params.get('search') ?? '')
	const { run } = useDebounceFn(
		() =>
			router.replace(setQueryParams(params.toString(), { search: value }, { route: pathname })),
		{ wait: 500 }
	)

	const defaultQueries = createQueryParams(
		{
			by: 'ASC',
			column: 'All',
			length: values.length.toString(),
			start: values.start.toString()
		},
		{ route: pathname }
	)

	const list = useMemo(() => {
		return data?.data || []
	}, [data])

	const column = useMemo(
		() => [
			{ label: 'License Key', value: 'licenseCode' },
			{ label: 'Assigned Date', value: 'assignedDateFormat' },
			{ label: 'Assigned To', value: 'userName' },
			{ label: 'Action', value: 'action' },
			{ label: 'Application', value: 'applicationName' }
		],
		[]
	)

	const columns = useMemo(
		() =>
			createListCollection({
				items: [{ label: 'All', value: '' }, ...column]
			}),
		[column]
	)

	const bys = useMemo(
		() =>
			createListCollection({
				items: [
					{ label: 'Descending', value: 'DESC' },
					{ label: 'Ascending', value: 'ASC' }
				]
			}),
		[]
	)

	const columnSearch = useMemo(() => {
		const value = params.get('column')
		const find = columns.items.find((item) => item.label === value)

		if (value === 'All') return []
		return find ? [find.value] : []
	}, [columns.items, params])

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
		const by = params.get('by')
		const columnSearch = params.get('column')

		if (by && columnSearch && columnSearch !== 'All') {
			const find = columns.items.find((item) => item.label === columnSearch)
			return find ? [{ dir: by, field: find.value }] : []
		}

		return []
	}, [columns.items, params])

	const recordsTotal = useMemo(() => {
		return data ? data.recordsTotal : 0
	}, [data])

	const payload = useMemo(
		(): PaginationPayload => ({
			columnSearch,
			customViewId: '',
			filter: { filters: [] },
			length,
			search,
			sort,
			start
		}),
		[columnSearch, length, search, sort, start]
	)

	const handleColumnChange = useCallback(
		(value: Record<string, string>) => {
			const queries = setQueryParams(params.toString(), value, { route: pathname })
			router.replace(queries)
		},
		[pathname, router, params]
	)

	const handleRevokeAction = (item: GetListLicensePagingData) => {
		modal.open('revoke-license', {
			children: (
				<Center paddingY="8" textStyle="md">
					Are you sure want to Revoke this license?
				</Center>
			),
			options: {
				cancel: { hidden: true },
				submit: {
					onClick: () => {
						setSubmit({ loading: true })

						revoke({
							action: item.action,
							licenseCode: item.licenseCode,
							licenseId: item.pkid,
							userName: item.userName
						})
							.then(() => {
								mutateAsync(payload)
								return modal.close('revoke-license')
							})
							.finally(() => {
								setSubmit({ loading: false })
							})
					}
				}
			},
			size: 'sm',
			title: 'Revoke License'
		})
	}

	const handleAssignAction = (item: GetListLicensePagingData) => {
		modal.open('assign-license', {
			children: <Stack></Stack>,
			options: {
				cancel: { hidden: true },
				submit: {
					onClick: () => {
						setSubmit({ loading: true })

						assign({
							action: item.action,
							licenseCode: item.licenseCode,
							licenseId: item.pkid,
							userName: ''
						})
							.then(() => {
								mutateAsync(payload)
								return modal.close('assign-license')
							})
							.finally(() => {
								setSubmit({ loading: false })
							})
					}
				}
			},
			title: 'Assign License'
		})
	}

	const handleActionClick = (item: GetListLicensePagingData) => {
		if (item.action === 'Revoke') return handleRevokeAction(item)
		return handleAssignAction(item)
	}

	useEffect(() => {
		setBack({ hidden: true })
		setStaticSubmit({ hidden: true })
	}, [setBack, setStaticSubmit])

	useEffect(() => {
		if (params.size <= 0) router.replace(defaultQueries)
	}, [defaultQueries, router, params.size])

	useEffect(() => {
		if (params.size > 0) mutateAsync(payload)
	}, [mutateAsync, params.size, payload])

	return (
		<Stack gap="4">
			<HStack>
				<Group width="full" attached>
					<Select.Root
						collection={columns}
						defaultValue={isEmpty(columnSearch) ? [''] : columnSearch}
						maxWidth="48"
						size="sm"
						width={{ base: 32, xl: 56 }}
						onValueChange={(value) => handleColumnChange({ column: value.items[0].label })}
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
									<For each={columns.items}>
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
					<Field.Root>
						<InputGroup startElement={<Iconify height={16} icon="bx:search" />}>
							<Input
								autoComplete="off"
								borderBottomLeftRadius="none"
								borderTopLeftRadius="none"
								placeholder="Search..."
								size="sm"
								value={value}
								width={{ base: 32, xl: 56 }}
								onChange={(e) => {
									setValue(e.target.value)
									run()
								}}
							/>
						</InputGroup>
					</Field.Root>
				</Group>
				<Select.Root
					collection={bys}
					defaultValue={isEmpty(sort) ? ['ASC'] : [sort[0].dir]}
					maxWidth="48"
					size="sm"
					width={{ base: 32, xl: 56 }}
					onValueChange={(value) => handleColumnChange({ by: value.items[0].value })}
				>
					<Select.HiddenSelect />
					<Select.Control>
						<Select.Trigger>
							<Select.ValueText />
						</Select.Trigger>
						<Select.IndicatorGroup>
							<Select.Indicator />
						</Select.IndicatorGroup>
					</Select.Control>
					<Portal>
						<Select.Positioner>
							<Select.Content>
								<For each={bys.items}>
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
			</HStack>
			<Table.ScrollArea borderWidth="1px">
				<Table.Root striped>
					<Table.Header>
						<Table.Row>
							<For each={column}>
								{(item) => (
									<Table.ColumnHeader key={item.value} whiteSpace="nowrap">
										{item.label}
									</Table.ColumnHeader>
								)}
							</For>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						<Show when={!isEmpty(list)}>
							<For each={list}>
								{(item, index) => (
									<Table.Row key={index}>
										<Table.Cell whiteSpace="nowrap">{item.licenseCode}</Table.Cell>
										<Table.Cell whiteSpace="nowrap">{item.assignedDateFormat}</Table.Cell>
										<Table.Cell whiteSpace="nowrap">{item.userName}</Table.Cell>
										<Table.Cell whiteSpace="nowrap">
											<Link colorPalette="primary" onClick={() => handleActionClick(item)}>
												{item.action}
											</Link>
										</Table.Cell>
										<Table.Cell whiteSpace="nowrap">{item.applicationName}</Table.Cell>
									</Table.Row>
								)}
							</For>
						</Show>
					</Table.Body>
				</Table.Root>
			</Table.ScrollArea>
			<Pagination
				length={length}
				placeSelf="end"
				recordsTotal={recordsTotal}
				start={start}
				onPageChange={(value) =>
					handleColumnChange({
						length: value.pageSize.toString(),
						start: (value.page - 1).toString()
					})
				}
			/>
		</Stack>
	)
}

export default DataTable
