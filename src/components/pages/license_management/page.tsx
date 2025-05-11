import { Flex, Grid, GridItem, Text } from '@chakra-ui/react'
import { Iconify } from '@regla/monorepo'
import { useQuery } from '@tanstack/react-query'
import { GetTotalLicense } from '@/libraries/mutation/platform-settings/license-key'
import DataTable from './data-table'

const Page = () => {
	const { data } = useQuery({
		queryFn: GetTotalLicense,
		queryKey: ['get_total_license'],
		refetchOnWindowFocus: false
	})

	return (
		<Grid
			alignItems="center"
			gap="4"
			placeItems="start"
			templateColumns={{ base: '1fr', lg: '14rem 1fr' }}
			textStyle="sm"
			w="full"
		>
			<GridItem>
				<Text fontWeight="semibold" textStyle="sm">
					Total License
				</Text>
			</GridItem>
			<GridItem fontWeight="semibold">{data?.data.totalLicense}</GridItem>
			<GridItem alignItems="center" as={Flex} gap="2">
				<Text fontWeight="semibold" textStyle="sm">
					Detail License Usage
				</Text>
				<Iconify height={20} icon="bx:id-card" />
			</GridItem>
			<GridItem width="full">
				<DataTable />
			</GridItem>
		</Grid>
	)
}

export default Page
