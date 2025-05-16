import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { GetUserPropertyData, GetUserPropertyResponse } from '@/types/user/common'

type UseUserPropertyProps = Partial<GetUserPropertyData> & {
	setUserProperty: (value: GetUserPropertyResponse) => void
	reset: () => void
}

const initial: Partial<GetUserPropertyData> = {
	accept_language: undefined,
	application: undefined,
	department: undefined,
	email: undefined,
	firstName: undefined,
	is_dark_mode: undefined,
	isInitPassword: undefined,
	jobTitle: undefined,
	lastLogin: undefined,
	lastName: undefined,
	officeCountry: undefined,
	organization: undefined,
	passwordExpired: undefined,
	pkid: undefined,
	role: undefined,
	team: undefined,
	username: undefined
}

const useUserProperty = create<UseUserPropertyProps>()(
	persist(
		(set) => ({
			...initial,
			reset: () => set(initial),
			setUserProperty: (value: GetUserPropertyResponse) => set(() => ({ ...value }))
		}),
		{ name: 'user_property' }
	)
)

export default useUserProperty
