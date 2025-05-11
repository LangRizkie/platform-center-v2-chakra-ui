import { useTheme } from 'next-themes'

export type ColorMode = 'light' | 'dark'
export type UseColorModeReturn = {
	colorMode: ColorMode
	setColorMode: (colorMode: ColorMode) => void
	toggleColorMode: () => void
}

const useColorMode = (): UseColorModeReturn => {
	const { resolvedTheme, setTheme } = useTheme()

	const toggleColorMode = () => {
		setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
	}

	return {
		colorMode: resolvedTheme as ColorMode,
		setColorMode: setTheme,
		toggleColorMode
	}
}

const useColorModeValue = <T>(light: T, dark: T) => {
	const { colorMode } = useColorMode()
	return colorMode === 'dark' ? dark : light
}

export { useColorMode, useColorModeValue }
