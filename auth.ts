import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import type { Student, User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import { fetchStudentByName } from './app/lib/data';

 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string(), password: z.string().min(6)})
          .safeParse(credentials);
 
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user =  await fetchStudentByName(email);
          if (!user) return null;
          const passwordsMatch = true; //await bcrypt.compare(password, user.password);
 
          if (passwordsMatch) return user;
        }
        console.log('Invalid credentials');
        return null;
 

      },
    }),
  ],
});