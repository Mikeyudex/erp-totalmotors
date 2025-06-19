// Tipos para autenticación
export interface User {
  id: string
  email: string
  name: string
  role: string
  avatar?: string
  permissions: string[]
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
  expiresIn: number
}

export interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
}
