import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { LayoutType } from '@/types/default'
import { Provider } from './provider'

const inter = Inter({
	subsets: ['latin'],
	weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
})

export const metadata: Metadata = {
	description: 'Your platform for regulatory compliance',
	title: 'REGLA® App | Your platform for regulatory compliance'
}

const RootLayout: React.FC<LayoutType> = ({ children }) => {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<Provider>{children}</Provider>
			</body>
		</html>
	)
}

export default RootLayout
