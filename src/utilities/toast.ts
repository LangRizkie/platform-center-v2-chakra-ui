'use client'

import { createToaster } from '@chakra-ui/react'

const toast = createToaster({
	pauseOnPageIdle: true,
	placement: 'top-end'
})

export default toast
