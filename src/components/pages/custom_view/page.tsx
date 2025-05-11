import {
	Accordion,
	Button,
	Card,
	createListCollection,
	For,
	HStack,
	RadioCard,
	Stack,
	Text
} from '@chakra-ui/react'
import { Iconify } from '@regla/monorepo'
import { useQuery } from '@tanstack/react-query'
import { useSetState } from 'ahooks'
import { Case } from 'change-case-all'
import { groupBy } from 'lodash'
import { Key, useEffect, useMemo } from 'react'
import useGetCurrentId from '@/hooks/use-get-current-id'
import { GetLookupCustomView } from '@/libraries/mutation/user/common'
import useStaticStore from '@/stores/button-static'

type SelectedProps = {
	standard?: Key
	custom?: Key
}

const Page = () => {
	const currentId = useGetCurrentId()
	const { setCard, setSubmit } = useStaticStore()

	const [selected, setSelected] = useSetState<SelectedProps>({
		custom: undefined,
		standard: undefined
	})

	const { data } = useQuery({
		queryFn: () => GetLookupCustomView({ screenId: currentId }),
		queryKey: ['get_lookup_custom_view', currentId]
	})

	const list = useMemo(() => {
		return data?.data || []
	}, [data])

	const initial = useMemo(() => {
		const data = list.map((item) => ({
			category: item.is_standard_view ? 'standard views' : 'custom views',
			...item
		}))

		return data
	}, [list])

	const filter = createListCollection({
		items: initial
	})

	const categories = Object.entries(groupBy(filter.items, (item) => item.category))

	const defaultSelected = useMemo(() => {
		const standard = list
			.filter((item) => item.is_standard_view)
			.filter((item) => item.is_pin)
			.find((item) => item.is_pin)?.id

		const custom = list
			.filter((item) => !item.is_standard_view)
			.filter((item) => item.is_pin)
			.find((item) => item.is_pin)?.id

		return { custom, standard }
	}, [list])

	useEffect(() => {
		setCard({ normalize: true })
	}, [setCard])

	useEffect(() => {
		setSubmit({ hidden: false, title: 'Next' })
	}, [setSubmit])

	useEffect(() => {
		setSelected(defaultSelected)
	}, [defaultSelected, setSelected])

	return (
		<HStack align="flex-start" gap="4" width="full">
			<Card.Root width="md">
				<Card.Body>
					<Accordion.Root
						value={categories.map((category) => category[0])}
						collapsible
						multiple
					>
						<For each={categories}>
							{([category, items]) => (
								<Accordion.Item key={category} value={category}>
									<Accordion.ItemTrigger>
										<Text flex="1">{Case.capital(category)}</Text>
										<Accordion.ItemIndicator />
									</Accordion.ItemTrigger>
									<Accordion.ItemContent>
										<Accordion.ItemBody>
											<RadioCard.Root
												colorPalette="primary"
												value={selected.standard?.toString()}
												onValueChange={({ value }) =>
													setSelected({ standard: value?.toString() })
												}
											>
												<Stack gap="2">
													<For each={items}>
														{(item) => {
															const icon =
																selected.standard === item.id
																	? 'fluent:pin-16-filled'
																	: 'fluent:pin-16-regular'

															return (
																<RadioCard.Item key={item.id} value={item.id.toString()}>
																	<RadioCard.ItemHiddenInput />
																	<RadioCard.ItemControl>
																		<RadioCard.ItemText>{item.desc}</RadioCard.ItemText>
																		<Iconify height="20" icon={icon} />
																	</RadioCard.ItemControl>
																</RadioCard.Item>
															)
														}}
													</For>
												</Stack>
											</RadioCard.Root>
										</Accordion.ItemBody>
									</Accordion.ItemContent>
								</Accordion.Item>
							)}
						</For>
					</Accordion.Root>
					<Button colorPalette="primary" width="full">
						<Iconify height="20" icon="bx:plus" />
						New View
					</Button>
				</Card.Body>
			</Card.Root>
			<Card.Root width="full">
				<Card.Header />
				<Card.Body />
				<Card.Footer />
			</Card.Root>
		</HStack>
	)
}

export default Page
