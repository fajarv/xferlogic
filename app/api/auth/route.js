import NextAuth from "next-auth";
import LinkedInProvider from "next-auth/providers/linkedin";
import EmailProvider from "next-auth/providers/email";

const handler = NextAuth({
  providers: [
    LinkedInProvider({
      clientId: process.env.LINKEDIN_ID,
      clientSecret: process.env.LINKEDIN_SECRET,
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
