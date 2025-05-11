import {
	ButtonGroup,
	createListCollection,
	For,
	HStack,
	IconButton,
	Pagination as ChakraPagination,
	Portal,
	Select,
	StackProps,
	Text
} from '@chakra-ui/react'
import { Iconify } from '@regla/monorepo'
import { useMemo } from 'react'
import { values } from '@/utilities/validation'

export type PageChangeDetails = {
	page: number
	pageSize: number
}

type PaginationProps = StackProps & {
	start: number
	length: number
	recordsTotal: number
	onPageChange?: (value: PageChangeDetails) => void
}

const Pagination: React.FC<PaginationProps> = ({
	length,
	onPageChange,
	recordsTotal,
	start,
	...props
}) => {
	const handlePerPageList = useMemo(() => {
		return values.per.map((item) => ({ value: item.toString() }))
	}, [])

	const list = createListCollection({
		items: handlePerPageList
	})

	return (
		<HStack alignItems="center" gap="8" {...props}>
			<Text>Items per page:</Text>
			<Select.Root
				key={crypto.randomUUID()}
				collection={list}
				defaultValue={[length.toString()]}
				size="sm"
				width="24"
				onValueChange={({ value }) => {
					if (onPageChange) onPageChange({ page: 1, pageSize: Number(value[0]) })
				}}
			>
				<Select.HiddenSelect />
				<Select.Label />
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
							<For each={list.items}>
								{(item) => (
									<Select.Item key={item.value} item={item}>
										{item.value}
										<Select.ItemIndicator />
									</Select.Item>
								)}
							</For>
						</Select.Content>
					</Select.Positioner>
				</Portal>
			</Select.Root>
			<ChakraPagination.Root
				key={start}
				count={recordsTotal}
				defaultPage={start + 1}
				pageSize={length}
				onPageChange={onPageChange}
			>
				<ButtonGroup size="sm" variant="ghost" w="full">
					<ChakraPagination.PageText flex="1" format="long" />
					<ChakraPagination.PrevTrigger asChild>
						<IconButton>
							<Iconify height="20" icon="bx:chevron-left" />
						</IconButton>
					</ChakraPagination.PrevTrigger>
					<ChakraPagination.NextTrigger asChild>
						<IconButton>
							<Iconify height="20" icon="bx:chevron-right" />
						</IconButton>
					</ChakraPagination.NextTrigger>
				</ButtonGroup>
			</ChakraPagination.Root>
		</HStack>
	)
}

export default Pagination
