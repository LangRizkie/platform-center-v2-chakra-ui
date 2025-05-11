import {
	AbsoluteCenter,
	Accordion,
	AccordionRootProps,
	Box,
	Center,
	Group,
	IconButton,
	Menu,
	MenuSelectionDetails,
	Portal,
	Tag,
	Text
} from '@chakra-ui/react'
import { Iconify } from '@regla/monorepo'
import { Case } from 'change-case-all'
import { isEmpty } from 'lodash'
import useGetAction from '@/hooks/use-get-action'
import useGetCurrentId from '@/hooks/use-get-current-id'
import { TreeData } from '@/types/list'
import modal from './modal'

type TreeProps<T extends TreeData<T>> = AccordionRootProps & {
	data: T[]
	'data-title-key': keyof T
	onSelect?: (selected: MenuSelectionDetails) => void
}

const Tree = <T extends TreeData<T>>(props: TreeProps<T>) => {
	const currentId = useGetCurrentId()

	const create = useGetAction('CREATE')
	const view = useGetAction('VIEW')
	const update = useGetAction('UPDATE')
	const erase = useGetAction('DELETE')

	const handleDeleteTree = (item: T) => {
		modal.open('delete-tree', {
			children: (
				<Center paddingY="8" textStyle="md">
					Are you sure you want to delete the selected record(s)?
				</Center>
			),
			options: {
				submit: {
					colorPalette: 'red',
					onClick: () => {
						props.onSelect?.({ value: JSON.stringify({ action: 'DELETE', ...item }) })
					},
					title: 'Delete'
				}
			},
			size: 'md',
			title: ['Delete', Case.capital(currentId ?? '')].join(' ')
		})
	}

	return (
		<Accordion.Root size="sm" collapsible multiple {...props}>
			{props.data.map((item) => {
				const passed = ['active', 'success', 'passed']
				const failed = ['failed', 'not passed']

				const isPassed = passed.includes(Case.lower(item.status))
				const isFailed = failed.includes(Case.lower(item.status))

				const palette = (isPassed && 'green') || (isFailed && 'red') || 'gray'

				return (
					<Accordion.Item
						key={String(item[props['data-title-key']])}
						disabled={isEmpty(item.items)}
						value={String(item[props['data-title-key']])}
					>
						<Box position="relative">
							<Accordion.ItemTrigger _disabled={{ cursor: 'default', opacity: 'inherit' }}>
								<Accordion.ItemIndicator _disabled={{ visibility: 'collapse' }} />
								<Text flex="1">
									Level {item.level} : {String(item[props['data-title-key']])}
								</Text>
							</Accordion.ItemTrigger>
							<AbsoluteCenter axis="vertical" gap="2" insetEnd="0">
								<Tag.Root colorPalette={palette} size="sm">
									<Tag.Label>{String(item.status)}</Tag.Label>
								</Tag.Root>
								<Menu.Root
									positioning={{ placement: 'right' }}
									onSelect={(selected) => {
										if (selected.value) props.onSelect?.(selected)
									}}
								>
									<Menu.Trigger asChild>
										<IconButton size="xs" variant="ghost">
											<Iconify icon="bx:dots-vertical-rounded" />
										</IconButton>
									</Menu.Trigger>
									<Portal>
										<Menu.Positioner>
											<Menu.Content>
												<Group gap="2" grow>
													<Menu.Item
														alignItems="center"
														cursor="pointer"
														hidden={!create}
														justifyContent="center"
														value={JSON.stringify({ action: 'CREATE', ...item })}
														width="8"
													>
														<Iconify height="20" icon="bx:plus" />
													</Menu.Item>
													<Menu.Item
														alignItems="center"
														cursor="pointer"
														hidden={!view}
														justifyContent="center"
														value={JSON.stringify({ action: 'VIEW', ...item })}
														width="8"
													>
														<Iconify height="20" icon="bxs:show" />
													</Menu.Item>
													<Menu.Item
														alignItems="center"
														cursor="pointer"
														hidden={!update}
														justifyContent="center"
														value={JSON.stringify({ action: 'UPDATE', ...item })}
														width="8"
													>
														<Iconify height="16" icon="bxs:edit-alt" />
													</Menu.Item>
													<Menu.Item
														alignItems="center"
														cursor="pointer"
														hidden={!erase}
														justifyContent="center"
														value=""
														width="8"
														onClick={() => handleDeleteTree(item)}
													>
														<Iconify height="16" icon="bxs:trash" />
													</Menu.Item>
												</Group>
											</Menu.Content>
										</Menu.Positioner>
									</Portal>
								</Menu.Root>
							</AbsoluteCenter>
						</Box>
						<Accordion.ItemContent>
							<Accordion.ItemBody>
								<Tree
									data={item.items}
									data-title-key={props['data-title-key']}
									onSelect={props.onSelect}
								/>
							</Accordion.ItemBody>
						</Accordion.ItemContent>
					</Accordion.Item>
				)
			})}
		</Accordion.Root>
	)
}

export default Tree
