import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const config = defineConfig({
	theme: {
		semanticTokens: {
			colors: {
				error: { value: '{colors.error}' },
				info: { value: '{colors.info}' },
				primary: {
					contrast: { value: '{colors.white}' },
					emphasized: { value: '{colors.primary.300}' },
					fg: {
						value: {
							_dark: '{colors.gray.100}',
							_light: '{colors.primary.500}'
						}
					},
					focusRing: { value: '{colors.primary.500}' },
					muted: { value: '{colors.primary.50}' },
					solid: { value: '{colors.primary.500}' },
					subtle: { value: '{colors.primary.200}' }
				},
				success: { value: '{colors.success}' },
				warning: { value: '{colors.warning}' }
			}
		},
		tokens: {
			colors: {
				error: { value: '#F40C0C' },
				info: { value: '#F2F2F9' },
				primary: {
					50: { value: '#89A0D2' },
					100: { value: '#728DC8' },
					200: { value: '#5D7ABE' },
					300: { value: '#4868B4' },
					400: { value: '#3355A9' },
					500: { value: '#20419E' },
					600: { value: '#1A3789' },
					700: { value: '#152E74' },
					800: { value: '#0F2560' },
					900: { value: '#0A1C4D' }
				},
				success: { value: ' #009688' },
				warning: { value: '#F4AE0C' }
			}
		}
	}
})

const system = createSystem(defaultConfig, config)

export { system }
