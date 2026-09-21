import { Navigate, Outlet } from 'react-router-dom'
import Loading from '../components/Loading'
import { useAppContext } from '../context/AppContext'

export function AuthLayout() {
    const { user, loadingUser } = useAppContext()

    if (loadingUser) {
        return <Loading />
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}

export function GuestLayout() {
    const { user, loadingUser } = useAppContext()

    if (loadingUser) {
        return <Loading />
    }

    if (user) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}