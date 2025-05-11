import { type NextRequest, NextResponse } from 'next/server'
import { routes } from './utilities/constants'
import { getCredential } from './utilities/credentials'

export const config = {
	matcher: ['/((?!api|static|.*\\..*|_next|request-unlock).*)']
}

const unauthenticated = [routes.login]

export const middleware = async (req: NextRequest) => {
	const data = await getCredential({ req })

	const pathname = req.nextUrl.pathname
	const searchParams = req.nextUrl.searchParams

	if (pathname.startsWith(routes.forgot)) {
		const token = searchParams.get('token')

		if (token) {
			const route = [routes.forgot, '/', encodeURIComponent(token)].join('')
			return NextResponse.redirect(new URL(route, req.url))
		}

		return NextResponse.next()
	}

	if (!data.credential && pathname !== routes.login) {
		const redirect = pathname + req.nextUrl.search
		const route = [routes.login, '?redirect=', redirect].join('')

		return NextResponse.redirect(new URL(route, req.url))
	}

	if (data.credential && unauthenticated.includes(pathname)) {
		return NextResponse.redirect(new URL(routes.main, req.url))
	}

	return NextResponse.next()
}
