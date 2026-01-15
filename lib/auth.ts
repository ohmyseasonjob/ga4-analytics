import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

// Extend the built-in types
declare module 'next-auth' {
  interface Session {
    accessToken?: string
    refreshToken?: string
    provider?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    provider?: string
    expiresAt?: number
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: [
            'openid',
            'email',
            'profile',
            'https://www.googleapis.com/auth/analytics.readonly',
            'https://www.googleapis.com/auth/adwords',
          ].join(' '),
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    }),
    // Meta provider (custom implementation)
    {
      id: 'meta',
      name: 'Meta',
      type: 'oauth',
      clientId: process.env.META_APP_ID,
      clientSecret: process.env.META_APP_SECRET,
      authorization: {
        url: 'https://www.facebook.com/v18.0/dialog/oauth',
        params: {
          scope: 'ads_read,ads_management,business_management',
        },
      },
      token: 'https://graph.facebook.com/v18.0/oauth/access_token',
      userinfo: {
        url: 'https://graph.facebook.com/me',
        params: { fields: 'id,name,email,picture' },
      },
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.picture?.data?.url,
        }
      },
    },
  ],
  callbacks: {
    async jwt({ token, account, trigger }) {
      // Initial sign in - save tokens
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.provider = account.provider
        token.expiresAt = account.expires_at ? account.expires_at * 1000 : Date.now() + 3600000 // Default 1 hour
        return token
      }

      // Refresh token if expired (for Google OAuth)
      if (token.provider === 'google' && token.refreshToken && token.expiresAt) {
        const now = Date.now()
        const expiresAt = token.expiresAt as number
        
        // Refresh if token expires in less than 5 minutes
        if (now >= expiresAt - 300000) {
          try {
            const response = await fetch('https://oauth2.googleapis.com/token', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: new URLSearchParams({
                client_id: process.env.GOOGLE_CLIENT_ID!,
                client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                refresh_token: token.refreshToken as string,
                grant_type: 'refresh_token',
              }),
            })

            if (response.ok) {
              const refreshedTokens = await response.json()
              token.accessToken = refreshedTokens.access_token
              token.expiresAt = Date.now() + (refreshedTokens.expires_in * 1000)
              
              // Update refresh token if provided
              if (refreshedTokens.refresh_token) {
                token.refreshToken = refreshedTokens.refresh_token
              }
            } else {
              console.error('Failed to refresh token:', await response.text())
            }
          } catch (error) {
            console.error('Error refreshing token:', error)
          }
        }
      }

      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.refreshToken = token.refreshToken
      session.provider = token.provider
      return session
    },
  },
  session: {
    strategy: 'jwt',
  },
}
