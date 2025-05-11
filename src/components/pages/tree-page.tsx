import {
	Button,
	Card,
	Field,
	For,
	Grid,
	GridItem,
	HStack,
	Input,
	InputGroup,
	RadioCard,
	Show,
	Stack
} from '@chakra-ui/react'
import { Iconify } from '@regla/monorepo'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useDebounceFn, useSetState } from 'ahooks'
import { Case } from 'change-case-all'
import { isEmpty } from 'lodash'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import useGetAction from '@/hooks/use-get-action'
import useGetCurrentId from '@/hooks/use-get-current-id'
import useGetDynamicId from '@/hooks/use-get-dynamic-id'
import useGetNativeCurrentId from '@/hooks/use-get-native-current-id'
import useIsCRUDPath from '@/hooks/use-is-crud-path'
import useIsExceptionPath from '@/hooks/use-is-exception-path'
import useQueryFetched from '@/hooks/use-query-fetched'
import { CustomEndpoint, CustomEndpointProps } from '@/libraries/mutation/list'
import { GetFormatExportFile, GetTypeExportFile } from '@/libraries/mutation/parameter/dropdown'
import useModalStore from '@/stores/modal-dynamic'
import { ReglaResponse } from '@/types/default'
import { DownloadDataPayload, PaginationPayload, TreeResponse } from '@/types/list'
import {
	GetNavigationScreenAction,
	GetNavigationScreenData,
	GetNavigationScreenDynamicForm
} from '@/types/user/common'
import { GetPathUrlScreenResponse } from '@/types/user/screen'
import { GetPrivilegeData } from '@/types/user/security-role'
import { routes } from '@/utilities/constants'
import { createQueryParams, setQueryParams } from '@/utilities/helper'
import modal from '../ui/modal'
import StaticPage from './static-page'

type TreePageProps = {
	navigation: GetNavigationScreenData[]
	privilege: GetPrivilegeData[]
}

type ComponentProps = {
	index: number
	children: React.ReactNode
	navigation: GetNavigationScreenData
	privilege: GetPrivilegeData
}

type WithFormProps = ComponentProps & {
	form: (action: GetNavigationScreenAction) => GetNavigationScreenDynamicForm | undefined
}

type StaticModalProps = {
	data: GetNavigationScreenDynamicForm
	row: never[]
	unique: string
}

const Search = () => {
	const router = useRouter()
	const pathname = usePathname()
	const search = useSearchParams()

	const [value, setValue] = useState<string>(search.get('search') ?? '')
	const { run } = useDebounceFn(() => router.replace(queries), { wait: 500 })

	const queries = setQueryParams(search.toString(), { search: value }, { route: pathname })

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

const Download: React.FC<StaticModalProps> = (props) => {
	const currentId = useGetCurrentId()
	const params = useSearchParams()

	const { setAttribute } = useModalStore()

	const [download, setDownload] = useSetState({ format: '', type: '' })

	const search = useMemo(() => {
		return params.get('search') ?? ''
	}, [params])

	const queries = useMemo(
		() => ({
			columnSearch: [],
			customViewId: '',
			filter: { filters: [] },
			length,
			search,
			sort: [],
			start: 0
		}),
		[search]
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

const ButtonAction: React.FC<Pick<WithFormProps, 'form'>> = ({ form }) => {
	const pathname = usePathname()
	const nativeCurrentId = useGetNativeCurrentId()
	const isCRUDPath = useIsCRUDPath()
	const isExceptionPath = useIsExceptionPath()
	const dynamicId = useGetDynamicId()

	const download = useGetAction('DOWNLOAD')
	const create = useGetAction('CREATE')

	const getPathUrlScreen = useQueryFetched<GetPathUrlScreenResponse>({
		queryKey: ['get_path_url_screen', nativeCurrentId, isCRUDPath, dynamicId, isExceptionPath]
	})

	const title = useMemo(() => {
		if (getPathUrlScreen?.data) {
			const path = getPathUrlScreen.data.flatMap((item) => item.path.split('/'))
			return path[path.length - 1]
		}

		return ''
	}, [getPathUrlScreen?.data])

	const handleDownloadModal = (data: GetNavigationScreenDynamicForm, title: string) => {
		modal.open('download', {
			children: <Download data={data} row={[]} unique={data.unique_key} />,
			options: { submit: { disabled: true, title: 'Download' } },
			size: 'lg',
			title
		})
	}

	const handleButtonClick = (action: GetNavigationScreenAction) => {
		const data = form(action)

		if (data) {
			const name = [Case.capital(data.action), title].join(' ')

			switch (data.action) {
				case 'DOWNLOAD':
					return handleDownloadModal(data, name)
				case 'DEACTIVATE':
				case 'DELETE':
					return console.log(action)
			}
		}
	}

	const createRoute = useMemo(() => {
		return [pathname, routes.crud.create].join('')
	}, [pathname])

	return (
		<HStack flexDirection="row-reverse">
			<Show when={!isEmpty(create)}>
				<Button colorPalette="primary" asChild>
					<Link href={createRoute}>
						<Iconify height={20} icon="bx:plus" style={{ color: 'white' }} />
						Create
					</Link>
				</Button>
			</Show>
			<Show when={!isEmpty(download)}>
				<Button colorPalette="primary" onClick={() => handleButtonClick('DOWNLOAD')}>
					<Iconify height={16} icon="bxs:download" style={{ color: 'white' }} />
					Download
				</Button>
			</Show>
		</HStack>
	)
}

const Component: React.FC<ComponentProps> = ({ children, index, ...props }) => {
	const router = useRouter()
	const pathname = usePathname()
	const params = useSearchParams()
	const currentId = useGetCurrentId()
	const isCRUDPath = useIsCRUDPath()
	const list = useGetAction('LIST')

	const { mutateAsync } = useMutation<
		TreeResponse<unknown>,
		Error,
		CustomEndpointProps<PaginationPayload>
	>({
		mutationFn: CustomEndpoint,
		mutationKey: ['custom_endpoint', currentId, params.toString()]
	})

	const queries = createQueryParams({}, { route: pathname })

	const search = useMemo(() => {
		const value = params.get('search')
		return value ?? ''
	}, [params])

	const handleAnimationDuration = (index: number) => {
		return (index + 1) * 200 + 'ms'
	}

	const form = useCallback(
		(action: GetNavigationScreenAction) => {
			if (props.navigation.dynamic_form) {
				const data = props.navigation.dynamic_form.find((item) => item.action === action)
				return data
			}

			return undefined
		},
		[props.navigation.dynamic_form]
	)

	const payload = useMemo(
		(): PaginationPayload => ({
			columnSearch: [],
			customViewId: '',
			filter: { filters: [] },
			length,
			search,
			sort: [],
			start: 0
		}),
		[search]
	)

	useEffect(() => {
		if (params.size <= 0 && !isCRUDPath) router.replace(queries)
	}, [isCRUDPath, queries, router, params.size])

	useEffect(() => {
		if (!isEmpty(list)) mutateAsync({ ...payload, ...list })
	}, [list, mutateAsync, payload])

	return (
		<Card.Root
			animationDuration={handleAnimationDuration(index)}
			animationName="slide-from-top, fade-in"
			width="full"
		>
			<Card.Header>
				<Grid gap="4" templateColumns={{ base: '1fr', lg: 'auto auto' }} width="full">
					<GridItem>
						<Search />
					</GridItem>
					<GridItem>
						<ButtonAction form={form} {...props} />
					</GridItem>
				</Grid>
			</Card.Header>
			<Card.Body>
				<Card.Root>
					<Card.Body>{children}</Card.Body>
				</Card.Root>
			</Card.Body>
			<Card.Footer />
		</Card.Root>
	)
}

const TreePage: React.FC<TreePageProps> = (props) => {
	return (
		<For each={props.navigation}>
			{(item, index) => (
				<Component
					key={index}
					index={index}
					navigation={item}
					privilege={props.privilege[index]}
				>
					<StaticPage navigation={props.navigation} privilege={props.privilege} />
				</Component>
			)}
		</For>
	)
}

export default TreePage
