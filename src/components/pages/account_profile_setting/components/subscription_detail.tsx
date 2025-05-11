import { Grid, Heading, Stack, Text } from '@chakra-ui/react'

const SubscriptionDetail = () => {
	return (
		<Stack alignItems="flex-start" as="form" gap="8" id="general-form" paddingBottom="4">
			<Stack>
				<Heading size="xl">Subscription Detail</Heading>
				<Text>
					You need to assign the required subscription package based on your company&apos;s
					allocation.
				</Text>
			</Stack>
			<Grid gap="4" placeItems="start" templateColumns="repeat(2, 1fr)" width="full"></Grid>
		</Stack>
	)
}

export default SubscriptionDetail
