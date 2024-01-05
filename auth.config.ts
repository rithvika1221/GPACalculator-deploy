import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { fetchStudentByEamil } from './app/lib/data';
import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },

  callbacks: {
    async session({ session, token }) {
      if (token.email) {
        const userDetails = await fetchStudentByEamil(token.email);
        if (userDetails) {
          // Here, you can add additional user details to the session
          session.user.id = userDetails.id;
          session.user.email = userDetails.email;
          // Add other details as needed
        }
      }
      return session;
    },

    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/gpacalculator');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        // var email = "";
        // email = auth?.user?.email || "";
        // const user =  await fetchStudentByName(email);
        // const userId = user?.id;
        return Response.redirect(new URL(`/gpacalculator/${auth.user?.id}`, nextUrl));
;
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
  
} satisfies NextAuthConfig;


// import type { NextAuthConfig } from 'next-auth';

// export const authConfig: NextAuthConfig = {
//   pages: {
//     signIn: '/login',
//   },

//   session: {
//     strategy: 'jwt',
//     // Optional: if using database sessions, you might have different settings
//   },

//   callbacks: {
//     async redirect({ url, baseUrl }) {
//       // Redirect user to the dashboard after successful login
//       if (url.startsWith(baseUrl)) return '/gpacalculator/1';
//       return baseUrl;
//     },
    
//     async session({ session, token, user }) {
//       // Add necessary user data to the session
//       session.user = user;
//       return session;
//     },
//   },
//   providers: [], // Your providers here
// };
