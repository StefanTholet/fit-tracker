import { logout } from '@/server-actions/auth-actions'
const LogoutForm = () => {
  return (
    <form action={logout}>
      <button>Logout</button>
    </form>
  )
}

export default LogoutForm
