import NextAuth, { type NextAuthOptions, type Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { type JWT } from "next-auth/jwt";
import { supabase } from "@/lib/supabaseClient";


export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Supabase",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (error || !data.user) {
          throw new Error(error?.message || "Login failed");
        }

        // ユーザーのプラン情報を取得
        const { data: userData, error: userError } = await supabase
          .from("users") // ユーザーデータが格納されているテーブル名
          .select("plan_grade") // plan_gradeカラムを取得
          .eq("id", data.user.id) // ログインしたユーザーのIDでフィルタリング
          .single();

        if (userError) {
          throw new Error("Failed to fetch user data");
        }

        return {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.full_name,
          plan_grade: userData.plan_grade, // plan_gradeを追加
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.email = token.sub as string;
        // session.user.plan_grade = token.plan_grade; // plan_gradeをセッションに追加
      }
      return session;
    },
    async jwt({
      token,
      user,
    }: {
      token: JWT;
      user: {
        id: string;
        name?: string | null;
        email?: string | null;
        plan_grade?: number;
      };
    }) {
      if (user) {
        token.id = user.id;
        // token.plan_grade = user.plan_grade; // plan_gradeをJWTトークンに追加
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };