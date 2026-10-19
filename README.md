# Kakeibo

Next.js と TypeScript で作成した家計簿アプリです。

## 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開くと、トップページを表示できます。編集する場合は `src/app/page.tsx` を変更してください。

## Tailwind CSS

Tailwind CSS v4 を使用しています。PostCSS プラグインは `postcss.config.mjs` で設定し、`src/app/globals.css` で Tailwind CSS を読み込んでいます。要素の `className` にユーティリティクラスを指定して、文字・色・余白・レスポンシブ表示などを調整できます。

## PostgreSQL 開発環境

Docker Desktopを起動し、初回は環境変数ファイルを作成してからPostgreSQLを起動します。

```bash
cp .env.example .env
docker compose up -d db
```

コンテナの起動状態とDB接続を確認します。

```bash
docker compose ps
docker compose exec -T db pg_isready -U kakeibo -d kakeibo_dev
docker compose exec -T db psql -U kakeibo -d kakeibo_dev -c "SELECT current_database(), current_user;"
```

接続情報は `.env` の `DATABASE_URL` です。サンプルのユーザー名・パスワードはローカル開発専用です。DBデータは `postgres_data` という名前付きボリュームに保存されるため、コンテナを作り直しても残ります。環境を初期化する場合は `docker compose down -v` を実行してください。このコマンドはDBデータも削除します。

停止・再起動は次のコマンドで行えます。

```bash
docker compose stop db
docker compose start db
```

## フォルダ構成

アプリケーションのソースコードは `src/` 以下に配置します。`src/app/` が Next.js App Router のディレクトリです。Next.js の規約に沿って、ルート直下には `app/` を作らず、既存の `src/app/` を使用します。

| ディレクトリ | 役割 |
| --- | --- |
| `src/app/` | ルート、レイアウト、ページ単位のUI（Next.js App Router） |
| `src/features/` | 取引や予算など、機能・業務領域ごとのコード |
| `src/components/` | 複数の機能から共通して使うUIコンポーネント |
| `src/lib/` | 共通ユーティリティ、クライアント、機能横断の処理 |
| `prisma/` | Prismaスキーマ、マイグレーション、シードスクリプト |
| `tests/` | 自動テストとテスト用ファイル |
| `docs/` | 設計メモ、アーキテクチャ決定、開発ドキュメント |
| `public/` | サイトのルートURLから配信する静的ファイル |
| `compose.yaml` | Docker ComposeによるローカルPostgreSQL環境 |
| `.env.example` | 開発環境変数の共有用サンプル |

## 参考資料

- [Next.js ドキュメント](https://nextjs.org/docs)
- [Next.js チュートリアル](https://nextjs.org/learn)
- [Tailwind CSS ドキュメント](https://tailwindcss.com/docs)
