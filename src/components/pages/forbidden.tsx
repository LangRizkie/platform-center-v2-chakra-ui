import { Card, Center, Stack, Text } from '@chakra-ui/react'
import Image from 'next/image'

const Forbidden = () => (
	<Card.Root size="lg">
		<Card.Header></Card.Header>
		<Card.Body>
			<Center flexDirection="column" gap="12">
				<Image
					alt="forbidden"
					draggable={false}
					height={384}
					src="/forbidden.svg"
					style={{ height: 'auto', width: 'auto' }}
					width={384}
					priority
				/>
				<Stack textAlign="center">
					<Text color="primary.fg" fontWeight="semibold" textStyle="lg">
						Error 403
					</Text>
					<Text color="primary.fg" fontWeight="semibold" textStyle="xs">
						Forbidden
					</Text>
				</Stack>
				<Text color="gray" textStyle="sm">
					You do not have permission to access or on this server
				</Text>
			</Center>
		</Card.Body>
		<Card.Footer></Card.Footer>
	</Card.Root>
)
export default Forbidden
