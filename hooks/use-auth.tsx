"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import type { AuthState, LoginCredentials } from "@/lib/auth-types"
import { login as loginService, logout as logoutService, getCurrentUser, isTokenValid } from "@/services/auth-service"

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true,
  })

  const router = useRouter()
  const pathname = usePathname()

  const login = async (credentials: LoginCredentials) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }))

      const authResponse = await loginService(credentials)

      setAuthState({
        user: authResponse.user,
        token: authResponse.token,
        refreshToken: authResponse.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      })

      // Redirigir al dashboard después del login exitoso
      router.push("/")
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const logout = async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }))

      await logoutService()

      setAuthState({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      })

      // Redirigir al login después del logout
      router.push("/login")
    } catch (error) {
      // Incluso si hay error, limpiar el estado local
      setAuthState({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      })

      router.push("/login")
      throw error
    }
  }

  const checkAuth = async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }))

      const isValid = await isTokenValid()
      if (isValid) {
        const user = await getCurrentUser()
        if (user) {
          setAuthState((prev) => ({
            ...prev,
            user,
            isAuthenticated: true,
            isLoading: false,
          }))
          return
        }
      }

      // Si no hay token válido o usuario, limpiar estado
      setAuthState({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      })

      // Redirigir al login si no está autenticado y no está en rutas públicas
      const publicRoutes = ["/login", "/unauthorized"]
      if (!publicRoutes.includes(pathname)) {
        router.push("/login")
      }
    } catch (error) {
      console.error("Error al verificar autenticación:", error)
      setAuthState({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      })

      // Redirigir al login en caso de error
      const publicRoutes = ["/login", "/unauthorized"]
      if (!publicRoutes.includes(pathname)) {
        router.push("/login")
      }
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}
