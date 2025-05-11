import {
	Button,
	Center,
	chakra,
	For,
	HStack,
	Image,
	Input,
	InputGroup,
	Link,
	Separator,
	Show,
	Spinner,
	Stack,
	Switch,
	Text
} from '@chakra-ui/react'
import { Iconify } from '@regla/monorepo'
import { useMutation } from '@tanstack/react-query'
import { useDebounceFn } from 'ahooks'
import moment from 'moment'
import {
	redirect,
	RedirectType,
	usePathname,
	useRouter,
	useSearchParams
} from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import modal from '@/components/ui/modal'
import Pagination from '@/components/ui/pagination'
import { AllRead, IsRead } from '@/libraries/mutation/email/update'
import { Paging } from '@/libraries/mutation/email/user/notification'
import useModalStore from '@/stores/modal-dynamic'
import { PagingData } from '@/types/email/user/notification/list'
import { createQueryParams, setQueryParams } from '@/utilities/helper'
import { values } from '@/utilities/validation'

const Page = () => {
	const router = useRouter()
	const params = useSearchParams()
	const pathname = usePathname()
	const { setSubmit } = useModalStore()

	const [value, setValue] = useState<string>(params.get('search') ?? '')

	const { data, isPending, mutateAsync } = useMutation({
		mutationFn: Paging,
		mutationKey: ['paging']
	})

	const { mutateAsync: allRead } = useMutation({
		mutationFn: AllRead,
		mutationKey: ['all_read']
	})

	const { mutateAsync: isRead } = useMutation({
		mutationFn: IsRead,
		mutationKey: ['is_read']
	})

	const { run } = useDebounceFn(
		() =>
			router.replace(setQueryParams(params.toString(), { search: value }, { route: pathname })),
		{ wait: 500 }
	)

	const list = useMemo(() => {
		return data?.data || []
	}, [data?.data])

	const search = useMemo(() => {
		return params.get('search') ?? ''
	}, [params])

	const length = useMemo(() => {
		const value = params.get('length')
		return value ? Number(value) : values.length
	}, [params])

	const start = useMemo(() => {
		const value = params.get('start')
		return value ? Number(value) : values.start
	}, [params])

	const recordsTotal = useMemo(() => {
		return data ? data.recordsTotal : 0
	}, [data])

	const isChecked = useMemo(() => {
		const isUnreadOnly = params.get('isUnreadOnly') ?? undefined
		return isUnreadOnly ? JSON.parse(isUnreadOnly) : false
	}, [params])

	const isUnreadOnly = useMemo(() => {
		if (!isChecked) return []

		return [
			{
				field: 'is_read',
				logic: 'and',
				operator: 'eq',
				value: 'false'
			}
		]
	}, [isChecked])

	const queries = useMemo(
		() => ({
			columnSearch: [],
			customViewId: '',
			filter: { filters: isUnreadOnly },
			length,
			search,
			sort: [],
			start
		}),
		[isUnreadOnly, length, search, start]
	)

	const handleOnAllReadClick = () => {
		modal.open('all-read', {
			children: (
				<Center paddingY="8" textStyle="md">
					Are you sure want to read all this notifications?
				</Center>
			),
			options: {
				submit: {
					onClick: () => {
						setSubmit({ loading: true })

						allRead()
							.then(() => {
								mutateAsync(queries)
								return modal.close('all-read')
							})
							.finally(() => {
								setSubmit({ loading: false })
							})
					}
				}
			},
			size: 'sm',
			title: 'Read All Notifications'
		})
	}

	const handleOnCheckedChange = (state: boolean) => {
		const queries = setQueryParams(
			params.toString(),
			{ isUnreadOnly: String(state) },
			{ route: pathname }
		)

		router.replace(queries)
	}

	const handleLinkClick = async (data: PagingData) => {
		modal.open('is-read', {
			children: (
				<Center mb="4" mt="8">
					<Spinner color="primary.fg" size="lg" />
				</Center>
			),
			options: { cancel: { hidden: true }, submit: { hidden: true } },
			size: 'xs'
		})

		isRead({ notification_id: data.notification_id })
			.then(() => {
				redirect(data.redirect_url, RedirectType.push)
			})
			.finally(() => {
				modal.close('is-read')
			})
	}

	const handleColumnChange = useCallback(
		(value: Record<string, string>) => {
			const queries = setQueryParams(params.toString(), value, { route: pathname })
			router.replace(queries)
		},
		[pathname, router, params]
	)

	useEffect(() => {
		if (params.size < 1) {
			const queries = createQueryParams(
				{
					isUnreadOnly: 'false',
					length: values.per[2].toString(),
					start: values.start.toString()
				},
				{ route: pathname }
			)

			router.replace(queries)
		}
	}, [params.size, pathname, router])

	useEffect(() => {
		if (params.size > 0) mutateAsync(queries)
	}, [mutateAsync, params.size, queries])

	return (
		<Stack gap="6">
			<HStack justifyContent="space-between">
				<InputGroup
					maxWidth={{ base: 'full', md: 'breakpoint-sm' }}
					startElement={<Iconify height={20} icon="bx:search" />}
				>
					<Input
						placeholder="Search..."
						value={value}
						onChange={(e) => {
							setValue(e.target.value)
							run()
						}}
					/>
				</InputGroup>
				<HStack gap="4">
					<Button
						colorPalette={{ _hover: 'orange' }}
						variant="ghost"
						onClick={handleOnAllReadClick}
					>
						Mark all as read
					</Button>
					<Switch.Root
						colorPalette="primary"
						defaultChecked={isChecked}
						onCheckedChange={({ checked }) => handleOnCheckedChange(checked)}
					>
						<Switch.HiddenInput />
						<Switch.Label>Only show unread</Switch.Label>
						<Switch.Control />
					</Switch.Root>
				</HStack>
			</HStack>
			<Stack gap="0" maxHeight="96" overflowY="auto">
				<Show
					when={!isPending}
					fallback={
						<Center marginY="12">
							<Spinner color="primary.fg" size="lg" />
						</Center>
					}
				>
					<For each={list}>
						{(item, index) => {
							const image = item.is_read ? '/read.svg' : '/unread.svg'

							return (
								<Link key={index} onClick={() => handleLinkClick(item)}>
									<Stack _hover={{ backgroundColor: 'bg.muted' }} gap="0" width="full">
										<HStack gap="4" paddingX="2" paddingY="4">
											<Image alt="Read" aspectRatio="square" src={image} width="8" />
											<chakra.div
												dangerouslySetInnerHTML={{ __html: item.message }}
												width="full"
											/>
											<Text textStyle="xs" whiteSpace="nowrap">
												{moment(item.created_date).fromNow()}
											</Text>
										</HStack>
										<Separator />
									</Stack>
								</Link>
							)
						}}
					</For>
				</Show>
			</Stack>
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

export default Page
