import { Card, Center, For, Grid, Show, Text } from '@chakra-ui/react'
import { Iconify } from '@regla/monorepo'
import { isEmpty } from 'lodash'
import Link from 'next/link'
import { useMemo } from 'react'
import useGetCurrentId from '@/hooks/use-get-current-id'
import type { GetPrivilegeData } from '@/types/user/security-role'
import type { GetNavigationScreenData } from '../../types/user/common'
import { GenerateIcon } from '../../utilities/helper'
import Forbidden from './forbidden'

type GridCardProps = {
	navigation: GetNavigationScreenData[]
	privilege: GetPrivilegeData[]
}

const GridCard: React.FC<GridCardProps> = (props) => {
	const currentId = useGetCurrentId()

	const privilege = useMemo(() => {
		return props.privilege.find((item) => item.screen_id.toLowerCase() === currentId)
	}, [props.privilege, currentId])

	const canView = useMemo(() => {
		if (!privilege && !isEmpty(props.navigation)) return true
		return privilege ? privilege.can_view : true
	}, [privilege, props.navigation])

	const handleAnimationDuration = (index: number) => {
		return (index + 1) * 200 + 'ms'
	}

	const handleEmptyDescription = (item: GetNavigationScreenData) => {
		const description = [item.title, 'folder'].join(' ')
		return item.description ? item.description : description
	}

	return (
		<Show fallback={<Forbidden />} when={canView}>
			<Grid
				autoRows="1fr"
				gap="8"
				width="full"
				templateColumns={{
					'2xl': 'repeat(4, 1fr)',
					base: 'repeat(1, 1fr)',
					lg: 'repeat(3, 1fr)',
					md: 'repeat(2, 1fr)'
				}}
			>
				<For each={props.navigation}>
					{(item, index) => {
						return (
							<Link key={index} href={item.url} passHref>
								<Card.Root
									animationDuration={handleAnimationDuration(index)}
									animationName="slide-from-top, fade-in"
									cursor="pointer"
									height="full"
									variant="outline"
								>
									<Card.Header alignItems="center" flexDirection="row" gap="4">
										<Center
											borderColor="gray.300"
											borderRadius="sm"
											borderStyle="solid"
											borderWidth="thin"
											height="12"
											padding="2"
											width="12"
										>
											<Show
												fallback={<Iconify height="28" icon="bx:folder" />}
												when={item.image_url}
											>
												<GenerateIcon
													icon={item.image_url}
													size={28}
													style={{ color: 'var(--chakra-colors-primary-fg)' }}
												/>
											</Show>
										</Center>
										<Text fontWeight="bold">{item.title}</Text>
									</Card.Header>
									<Card.Body>
										<Text color="gray" textStyle="xs" textWrap="pretty">
											{handleEmptyDescription(item)}
										</Text>
									</Card.Body>
									<Card.Footer></Card.Footer>
								</Card.Root>
							</Link>
						)
					}}
				</For>
			</Grid>
		</Show>
	)
}

export default GridCard
