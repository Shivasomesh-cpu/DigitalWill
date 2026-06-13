import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { getSupabaseAdminClient } from '@/lib/supabase/client';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: [
            'openid',
            'email',
            'profile',
            'https://www.googleapis.com/auth/gmail.readonly',
          ].join(' '),
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.sub = profile?.email ?? token.email ?? token.sub;

        if (profile?.email) {
          await getSupabaseAdminClient().from('users').upsert(
            {
              email: profile.email,
              name: profile.name,
              avatar_url: (profile as { picture?: string }).picture,
            },
            { onConflict: 'email' },
          );
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.accessToken =
        typeof token.accessToken === 'string' ? token.accessToken : undefined;
      if (session.user) {
        session.user.email = token.sub ?? session.user.email;
      }
      return session;
    },
  },
});

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
  }
}
