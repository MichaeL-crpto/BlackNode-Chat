import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET ?? "dev-only-secret-change-this-before-production",
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8,
  },
  pages: {
    signIn: "/",
  },
  providers: [
    Google({
      allowDangerousEmailAccountLinking: false,
    }),
    GitHub({
      allowDangerousEmailAccountLinking: false,
    }),
  ],
})
