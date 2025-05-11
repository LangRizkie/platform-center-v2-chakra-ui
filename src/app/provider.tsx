'use client'

import dynamic from 'next/dynamic'

const Provider = dynamic(() => import('./providers').then((mod) => mod), {
	ssr: false
})

export { Provider }
