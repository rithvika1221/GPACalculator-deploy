// 'use server'; // Directs Next.js to run this code on the server side

// // Importing necessary modules and functions
// //import { signIn } from '@/auth';
// //import { AuthError } from 'next-auth';

// // authenticate function to handle user sign-in
// export async function authenticate(
//     prevState: string | undefined, // Previous state of the application, if any
//     formData: FormData, // Form data containing user credentials
// ) {
//     try {
//         await signIn('credentials', formData);
//     } catch (error) {
//         if (error instanceof AuthError) {
//             switch (error.type) {
//                 case 'CredentialsSignin':
//                     return 'Invalid credentials.';
//                 default:
//                     return 'Something went wrong.';
//             }
//         }
//         throw error;
//     }
// }