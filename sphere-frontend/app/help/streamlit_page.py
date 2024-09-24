import streamlit as st

def display_help_page():
    st.title("ヘルプページ")

    st.header("使い方")
    st.write("""
    - アプリケーションを起動します。
    - メニューから目的の機能を選択します。
    - 必要な情報を入力し、実行ボタンを押します。
    - 結果が表示されます。
    """)

    st.header("メリット")
    st.write("""
    - 直感的なインターフェースで簡単に操作できます。
    - 高速な処理で時間を節約できます。
    - 多機能で様々なニーズに対応します。
    - 安全で信頼性の高いデータ管理を提供します。
    """)

if __name__ == "__main__":
    display_help_page()
