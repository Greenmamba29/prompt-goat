import 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    role: string
    hasActiveSubscription: boolean
  }

  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      role: string
      hasActiveSubscription: boolean
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
    hasActiveSubscription: boolean
  }
}
