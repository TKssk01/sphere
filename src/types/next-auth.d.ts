import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      plan_grade?: string; // plan_grade プロパティを追加
    }
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    plan_grade?: string; // plan_grade プロパティを追加
  }
}