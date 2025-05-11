'use client'

import { chakra } from '@chakra-ui/react'

const Prose = chakra('div', {
	base: {
		'& :is(h1,h2,h3,h4,h5,hr) + *': {
			marginTop: '0'
		},
		'& > ol > li > p:first-of-type': {
			marginTop: '1em'
		},
		'& > ol > li > p:last-of-type': {
			marginBottom: '1em'
		},
		'& > ul > li > p:first-of-type': {
			marginTop: '1em'
		},
		'& > ul > li > p:last-of-type': {
			marginBottom: '1em'
		},
		'& > ul > li p': {
			marginBottom: '0.5em',
			marginTop: '0.5em'
		},
		'& a': {
			color: 'fg',
			fontWeight: '500',
			textDecoration: 'underline',
			textDecorationColor: 'border.muted',
			textDecorationThickness: '2px',
			textUnderlineOffset: '3px'
		},
		'& a strong': {
			color: 'inherit'
		},
		'& blockquote': {
			borderInlineStartWidth: '0.25em',
			marginBottom: '1.285em',
			marginTop: '1.285em',
			paddingInline: '1.285em'
		},
		'& code': {
			borderRadius: 'md',
			borderWidth: '1px',
			fontSize: '0.925em',
			letterSpacing: '-0.01em',
			padding: '0.25em'
		},
		'& dd': {
			marginTop: '0.285em',
			paddingInlineStart: '1.5em'
		},
		'& dl': {
			marginBottom: '1em',
			marginTop: '1em'
		},
		'& dt': {
			fontWeight: '600',
			marginTop: '1em'
		},
		'& figcaption': {
			color: 'fg.muted',
			fontSize: '0.85em',
			lineHeight: '1.25em',
			marginTop: '0.85em'
		},
		'& figure': {
			marginBottom: '1.625em',
			marginTop: '1.625em'
		},
		'& figure > *': {
			marginBottom: '0',
			marginTop: '0'
		},
		'& h1': {
			fontSize: '2.15em',
			letterSpacing: '-0.02em',
			lineHeight: '1.2em',
			marginBottom: '0.8em',
			marginTop: '0'
		},
		'& h1, h2, h3, h4': {
			color: 'fg',
			fontWeight: '600'
		},
		'& h2': {
			fontSize: '1.4em',
			letterSpacing: '-0.02em',
			lineHeight: '1.4em',
			marginBottom: '0.8em',
			marginTop: '1.6em'
		},
		'& h2 code': {
			fontSize: '0.9em'
		},
		'& h3': {
			fontSize: '1.285em',
			letterSpacing: '-0.01em',
			lineHeight: '1.5em',
			marginBottom: '0.4em',
			marginTop: '1.5em'
		},
		'& h3 code': {
			fontSize: '0.8em'
		},
		'& h4': {
			letterSpacing: '-0.01em',
			lineHeight: '1.5em',
			marginBottom: '0.5em',
			marginTop: '1.4em'
		},
		'& hr': {
			marginBottom: '2.25em',
			marginTop: '2.25em'
		},
		'& img': {
			borderRadius: 'lg',
			boxShadow: 'inset',
			marginBottom: '1.7em',
			marginTop: '1.7em'
		},
		'& kbd': {
			'--shadow': 'colors.border',
			borderRadius: 'xs',
			boxShadow: '0 0 0 1px var(--shadow),0 1px 0 1px var(--shadow)',
			color: 'fg.muted',
			fontFamily: 'inherit',
			fontSize: '0.85em',
			paddingBottom: '0.15em',
			paddingInlineEnd: '0.35em',
			paddingInlineStart: '0.35em',
			paddingTop: '0.15em'
		},
		'& li': {
			marginBottom: '0.285em',
			marginTop: '0.285em'
		},
		'& ol': {
			marginBottom: '1em',
			marginTop: '1em',
			paddingInlineStart: '1.5em'
		},
		'& ol > li': {
			'&::marker': {
				color: 'fg.muted'
			},
			listStyleType: 'decimal',
			paddingInlineStart: '0.4em'
		},
		'& p': {
			marginBottom: '1em',
			marginTop: '1em'
		},
		'& picture': {
			marginBottom: '1.7em',
			marginTop: '1.7em'
		},
		'& picture > img': {
			marginBottom: '0',
			marginTop: '0'
		},
		'& pre': {
			backgroundColor: 'bg.subtle',
			borderRadius: 'md',
			fontSize: '0.9em',
			fontWeight: '400',
			marginBottom: '1.6em',
			marginTop: '1.6em',
			overflowX: 'auto',
			paddingBottom: '0.65em',
			paddingInlineEnd: '1em',
			paddingInlineStart: '1em',
			paddingTop: '0.65em'
		},
		'& pre code': {
			borderWidth: 'inherit',
			fontSize: 'inherit',
			letterSpacing: 'inherit',
			padding: '0'
		},
		'& strong': {
			fontWeight: '600'
		},
		'& table': {
			lineHeight: '1.5em',
			marginBottom: '2em',
			marginTop: '2em',
			tableLayout: 'auto',
			textAlign: 'start',
			width: '100%'
		},
		'& tbody td, tfoot td': {
			paddingBottom: '0.65em',
			paddingInlineEnd: '1em',
			paddingInlineStart: '1em',
			paddingTop: '0.65em'
		},
		'& tbody td:first-of-type, tfoot td:first-of-type': {
			paddingInlineStart: '0'
		},
		'& tbody td:last-of-type, tfoot td:last-of-type': {
			paddingInlineEnd: '0'
		},
		'& tbody tr': {
			borderBottomColor: 'border',
			borderBottomWidth: '1px'
		},
		'& thead': {
			borderBottomWidth: '1px',
			color: 'fg'
		},
		'& thead th': {
			fontWeight: 'medium',
			paddingBottom: '0.65em',
			paddingInlineEnd: '1em',
			paddingInlineStart: '1em',
			textAlign: 'start'
		},
		'& thead th:first-of-type': {
			paddingInlineStart: '0'
		},
		'& thead th:last-of-type': {
			paddingInlineEnd: '0'
		},
		'& ul': {
			marginBottom: '1em',
			marginTop: '1em',
			paddingInlineStart: '1.5em'
		},
		'& ul > li': {
			'&::marker': {
				color: 'fg.muted'
			},
			listStyleType: 'disc',
			paddingInlineStart: '0.4em'
		},
		'& ul ul, ul ol, ol ul, ol ol': {
			marginBottom: '0.5em',
			marginTop: '0.5em'
		},
		'& video': {
			marginBottom: '1.7em',
			marginTop: '1.7em'
		},
		color: 'fg.muted',
		fontSize: 'sm',
		lineHeight: '1.7em',
		maxWidth: '65ch'
	},
	defaultVariants: {
		size: 'md'
	},
	variants: {
		size: {
			lg: {
				fontSize: 'md'
			},
			md: {
				fontSize: 'sm'
			}
		}
	}
})

export default Prose
