import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import { createClient } from '@/lib/supabase/server'

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
}

// Convert Supabase User to our AuthUser interface
export const mapSupabaseUser = (user: User): AuthUser => {
  return {
    id: user.id,
    email: user.email || '',
    username: user.user_metadata?.username || user.email?.split('@')[0] || 'User',
  }
}

// Client-side auth functions
export const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const register = async (userData: {
  username: string;
  email: string;
  password: string;
}) => {
  const { data, error } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
    options: {
      data: {
        username: userData.username,
        full_name: userData.username,
      },
    },
  })
  return { data, error }
}

export const logout = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  return mapSupabaseUser(user)
}

// Server-side auth functions
export const getServerUser = async (): Promise<AuthUser | null> => {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  return mapSupabaseUser(user)
}