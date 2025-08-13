// src/store/user.ts
'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

// Types et Interfaces
type UserRole = 'ADMIN' | 'USER' | null

interface User {
  id: string
  email: string
  name: string
  role: UserRole
}

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  role: UserRole
  setRole: (role: UserRole) => void
  logout: () => void
  isAdmin: boolean
}

// Création et export du contexte avec une valeur initiale null-safe
export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  role: null,
  setRole: () => {},
  logout: () => {},
  isAdmin: false
})

// Provider Component
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<UserRole>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser)
      setUser(parsedUser)
      setRole(parsedUser.role)
    }
  }, [])

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  }, [user])

  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
    setRole(null)
  }

  const isAdmin = role === 'ADMIN'

  const value = {
    user,
    setUser,
    role,
    setRole,
    logout,
    isAdmin
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

// Hook personnalisé
export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
