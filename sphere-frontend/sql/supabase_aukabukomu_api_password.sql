-- profilesテーブルにaucabucom_api_passwordカラムを追加
ALTER TABLE profiles ADD COLUMN aucabucom_api_password TEXT;

-- aucabucom_api_passwordカラムを更新できるポリシー
CREATE POLICY "aukabucom_api_passwordを更新"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (aucabucom_api_password IS NULL OR aucabucom_api_password = aucabucom_api_password);

-- サインアップ時にプロフィールテーブル作成する関数 (更新版)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, aucabucom_api_password)
  VALUES (NEW.id, NEW.email, NULL);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;