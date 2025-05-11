const routes = {
	crud: {
		create: '/create',
		update: '/update',
		view: '/view'
	},
	exception: {
		custom_view: '/custom_view',
		notification: '/notification',
		profile: '/profile',
		search: '/search'
	},
	forgot: '/forgot-password',
	login: '/',
	main: '/main',
	request_unlock: '/request-unlock',
	request_unlock_email: '/request-unlock/email',
	request_unlock_otp: '/request-unlock/otp'
}

const cookies = {
	credential: 'credential',
	refresh: 'refresh',
	session: 'session'
}

const storages = {
	histories: 'histories',
	username: 'username'
}

export { cookies, routes, storages }
