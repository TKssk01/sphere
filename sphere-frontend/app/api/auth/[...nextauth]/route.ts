import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "@/lib/supabaseClient";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Supabase",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Emailとパスワードは必須です");
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (error || !data.user) {
          throw new Error(error?.message || "ログインに失敗しました");
        }

        // ユーザーのプラン情報を取得
        const { data: userData, error: userError } = await supabase
          .from("users") // ユーザーデータが格納されているテーブル名
          .select("plan_grade") // plan_gradeカラムを取得
          .eq("id", data.user.id) // ログインしたユーザーのIDでフィルタリング
          .single();

        if (userError) {
          throw new Error("ユーザーデータの取得に失敗しました");
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
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.sub as string;
        // session.user.plan_grade = token.plan_grade; // plan_gradeをセッションに追加
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // token.plan_grade = user.plan_grade; // plan_gradeをJWTトークンに追加
      }
      return token;
    },
  },
});

export { handler as GET, handler as POST };