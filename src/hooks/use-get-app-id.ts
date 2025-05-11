import useGetRoute from './use-get-route'

const useGetAppId = () => {
	const route = useGetRoute({ index: 0 })
	return route
}

export default useGetAppId
