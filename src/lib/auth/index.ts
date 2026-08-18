// src/lib/auth/index.ts — NextAuth instance

import NextAuth from 'next-auth'
import { authConfig } from './config'

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
