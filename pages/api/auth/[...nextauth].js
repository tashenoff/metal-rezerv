import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const NEXTAUTH_URL = process.env.NEXTAUTH_URL || "http://localhost:3001";
console.log("NEXTAUTH_URL used:", NEXTAUTH_URL);

/**
 * Варианты конфигурации NextAuth.js
 * Подробнее: https://next-auth.js.org/configuration/options
 */
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Пароль", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Explicitly include company with all fields
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: { 
              company: true
            }
          });

          if (!user) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          // Log company information to verify
          console.log('Company info during auth:', JSON.stringify(user.company, null, 2));

          // Return the user with the company object directly from prisma
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            companyId: user.companyId,
            points: user.points || 0,
            city: user.city || '',
            companyName: user.company?.name || '',
            company: user.company // Pass the complete company object without modification
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add user data to JWT
      if (user) {
        const userId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
        
        token.id = userId;
        token.role = user.role;
        token.companyId = user.companyId;
        token.points = user.points || 0;
        token.city = user.city || '';
        token.companyName = user.companyName || '';
        token.company = user.company; // Pass the complete company object
        
        // Legacy token for compatibility
        token.legacyToken = jwt.sign(
          { 
            id: userId, 
            email: user.email,
            role: user.role 
          },
          process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
      }
      
      return token;
    },
    
    async session({ session, token }) {
      // Pass data from token to session
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.companyId = token.companyId;
        session.user.points = token.points || 0;
        session.user.city = token.city || '';
        session.user.companyName = token.companyName || '';
        session.user.username = session.user.name;
        session.user.company = token.company; // Pass the complete company object
        
        // Log session company data for debugging
        console.log('Session company data:', JSON.stringify(session.user.company, null, 2));
        
        session.legacyToken = token.legacyToken;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production"
      }
    }
  },
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);