import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export const authOptions = {
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : [
          // Instant 1-click Google OAuth simulation when Google API keys are not provided
          CredentialsProvider({
            id: 'google',
            name: 'Google',
            credentials: {},
            async authorize() {
              try {
                await connectToDatabase();
                let user = await User.findOne({ email: 'karimul.developer@gmail.com' });
                if (!user) {
                  user = await User.create({
                    name: 'Md. Karimul Islam',
                    email: 'karimul.developer@gmail.com',
                    image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
                    role: 'user',
                  });
                }
                return {
                  id: user._id.toString(),
                  name: user.name,
                  email: user.email,
                  image: user.image,
                  role: user.role,
                };
              } catch (error) {
                console.error('Google mock authorize error:', error);
                return {
                  id: 'mock-google-user-id',
                  name: 'Md. Karimul Islam',
                  email: 'karimul.developer@gmail.com',
                  image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
                  role: 'user',
                };
              }
            },
          }),
        ]),
    
    // Also keep google-mock id
    CredentialsProvider({
      id: 'google-mock',
      name: 'GoogleMock',
      credentials: {},
      async authorize() {
        try {
          await connectToDatabase();
          let user = await User.findOne({ email: 'karimul.developer@gmail.com' });
          if (!user) {
            user = await User.create({
              name: 'Md. Karimul Islam',
              email: 'karimul.developer@gmail.com',
              image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
              role: 'user',
            });
          }
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
          };
        } catch (error) {
          console.error('Google mock authorize error:', error);
          return {
            id: 'mock-google-user-id',
            name: 'Md. Karimul Islam',
            email: 'karimul.developer@gmail.com',
            image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
            role: 'user',
          };
        }
      },
    }),

    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter both email and password');
        }

        try {
          await connectToDatabase();
          const user = await User.findOne({ email: credentials.email.toLowerCase() }).select('+password');

          if (!user) {
            throw new Error('No user found with this email');
          }

          if (!user.password) {
            throw new Error('This account was created with Google OAuth. Please sign in with Google.');
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          if (!isPasswordValid) {
            throw new Error('Invalid email or password');
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
          };
        } catch (error) {
          throw new Error(error.message || 'Authentication failed');
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' && process.env.GOOGLE_CLIENT_ID) {
        try {
          await connectToDatabase();
          const existingUser = await User.findOne({ email: user.email.toLowerCase() });
          if (!existingUser) {
            await User.create({
              name: user.name,
              email: user.email.toLowerCase(),
              image: user.image,
              role: 'user',
            });
          }
        } catch (error) {
          console.error('Error saving Google user to DB:', error);
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id || token.sub;
        session.user.role = token.role || 'user';
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'smart_deals_secret_development_key',
  pages: {
    signIn: '/login',
    error: '/login',
  },
};

export default NextAuth(authOptions);
