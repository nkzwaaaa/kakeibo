# Kakeibo プロジェクト構成設計書

## 1. 目的

Kakeiboのディレクトリ構成と各ファイル・ディレクトリの責務を定義する。

初期段階では過度に複雑な構成を避けつつ、機能追加やテストがしやすい設計を目指す。

## 2. ディレクトリ構成

```text
kakeibo/
├── public/
│   └── images/
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── docs/
│   ├── requirements.md
│   ├── screen-flow.md
│   ├── expense-registration.md
│   ├── database-design.md
│   ├── api-design.md
│   ├── tech-stack.md
│   ├── project-structure.md
│   ├── feature-specification.md
│   └── implementation-issues.md
│
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (main)/
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── expenses/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── incomes/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── categories/
│   │   │   │   └── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   │
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── register/
│   │   │   │   │   └── route.ts
│   │   │   │   └── me/
│   │   │   │       └── route.ts
│   │   │   ├── expenses/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── incomes/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── categories/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── dashboard/
│   │   │   │   └── route.ts
│   │   │   └── analytics/
│   │   │       └── categories/
│   │   │           └── route.ts
│   │   │
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   └── error.tsx
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   └── Modal.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Navigation.tsx
│   │   ├── expenses/
│   │   │   ├── ExpenseForm.tsx
│   │   │   ├── ExpenseList.tsx
│   │   │   └── ExpenseItem.tsx
│   │   ├── incomes/
│   │   │   ├── IncomeForm.tsx
│   │   │   └── IncomeList.tsx
│   │   ├── categories/
│   │   │   └── CategorySelector.tsx
│   │   └── dashboard/
│   │       ├── SummaryCards.tsx
│   │       └── ExpenseChart.tsx
│   │
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   ├── utils.ts
│   │   └── validations/
│   │       ├── expense.ts
│   │       ├── income.ts
│   │       ├── category.ts
│   │       └── auth.ts
│   │
│   ├── services/
│   │   ├── expense-service.ts
│   │   ├── income-service.ts
│   │   ├── category-service.ts
│   │   └── dashboard-service.ts
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   └── middleware.ts
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example
├── .gitignore
├── .prettierrc
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tsconfig.json
├── README.md
└── docker-compose.yml
```

※これは目標構成の例であり、すべてのファイルを初期段階で作成する必要はない。Next.js、Tailwind CSS、Prismaの採用バージョンによって設定ファイル名や配置が異なる場合がある。

## 3. ディレクトリの責務

### 3.1 `src/app/`

Next.js App Routerの画面、レイアウト、APIを配置する。

- `page.tsx`：画面
- `layout.tsx`：共通レイアウト
- `route.ts`：APIエンドポイント
- `error.tsx`：画面単位のエラーUI

`(auth)` や `(main)` はRoute Groupであり、URLのパスには含まれない。

例：

- `src/app/(auth)/login/page.tsx` → `/login`
- `src/app/(main)/dashboard/page.tsx` → `/dashboard`

### 3.2 `src/components/`

画面で利用するUIコンポーネントを配置する。

- `ui/`：ボタン・入力欄などの汎用UI
- `layout/`：ヘッダー・ナビゲーションなど
- `expenses/`：支出関連のUI
- `incomes/`：収入関連のUI
- `categories/`：カテゴリ関連のUI
- `dashboard/`：ダッシュボード関連のUI

コンポーネントは責務が明確な単位で分割する。単純な表示だけのコンポーネントを必要以上に増やさない。

### 3.3 `src/lib/`

複数の機能で利用する基盤的な処理を配置する。

- `prisma.ts`：Prisma Clientの初期化
- `auth.ts`：認証設定・共通処理
- `utils.ts`：汎用関数
- `validations/`：入力検証スキーマ

`utils.ts` にすべての処理を詰め込まず、機能ごとにファイルを分ける。

### 3.4 `src/services/`

業務ロジックやデータアクセスの処理を配置する。

例：

- `expense-service.ts`：支出の登録・取得・更新・削除
- `income-service.ts`：収入の管理
- `category-service.ts`：カテゴリの管理
- `dashboard-service.ts`：月次集計

Route Handlerから業務処理を呼び出すことで、APIの受付処理と業務ロジックを分離する。

サービス層を設ける場合でも、認証情報をどこで取得し、どの関数で所有権を検証するかを明確にする。

### 3.5 `src/types/`

複数の機能で共有する型を配置する。

ただし、Prismaが生成する型やZodから推論できる型を無意味に複製しない。型は可能な限り元の定義から再利用する。

### 3.6 `prisma/`

- `schema.prisma`：DBモデル
- `migrations/`：スキーマ変更履歴
- `seed.ts`：開発用初期データ

DBスキーマを変更した場合は、マイグレーションを作成し、Gitで管理する。

### 3.7 `tests/`

- `unit/`：業務ロジックなどの単体テスト
- `integration/`：APIとDBの連携テスト
- `e2e/`：ブラウザ操作を通じたシナリオテスト

テストツールの設定に合わせて配置を調整する。

## 4. 実装時の責務分担

支出登録を例にした処理の流れ：

```mermaid
flowchart TD
    A[ExpenseForm] --> B[入力値の検証]
    B --> C[POST /api/expenses]
    C --> D[認証確認]
    D --> E[サーバー側バリデーション]
    E --> F[Expense Service]
    F --> G[Prisma]
    G --> H[(PostgreSQL)]
    H --> I[APIレスポンス]
    I --> J[成功・失敗のUI表示]
```

重要なルール：

- UIは表示とユーザー操作を担当する
- Route HandlerはHTTPリクエスト、認証、入力検証、レスポンスを担当する
- Serviceは業務ルールとデータ操作を担当する
- PrismaはDBとのやり取りを担当する
- PostgreSQLはデータの永続化と整合性を担う

## 5. Server ComponentsとClient Components

### Server Componentsを基本とする

以下のような用途では、Server Componentsを優先する。

- 初期データの取得
- 静的な表示
- サーバー側で完結する処理

### Client Componentsを使用する場面

以下のようにブラウザ上の状態やイベント処理が必要な場合に使用する。

- フォーム入力
- ボタン操作
- モーダルの開閉
- インタラクティブなグラフ
- ReactのStateやEffectを使うUI

`"use client"` は必要なコンポーネントのみに指定し、無条件にすべての画面をClient Componentにしない。

## 6. 環境変数

`.env.example` には必要な環境変数名とダミー値を記載する。

例：

```dotenv
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"
AUTH_SECRET="replace-with-a-secure-random-value"
```

認証ライブラリやDBホスティング先により、必要な環境変数は異なる。

- `.env` などの実際の秘密情報をGitにコミットしない
- `.env.example` には本物の秘密情報を記載しない
- `NEXT_PUBLIC_` で始まる環境変数はブラウザに公開されるため、秘密情報に使用しない

## 7. 初期段階で作るファイル

最初から全ディレクトリを作成するのではなく、次の順で追加する。

1. Next.jsの基本構成
2. 共通レイアウトと画面
3. PrismaとDBスキーマ
4. 認証処理
5. 支出登録と一覧
6. 収入・カテゴリ管理
7. ダッシュボード
8. テスト
9. デプロイとCI

## 8. 設計方針

- ファイル数を増やすこと自体を目的にしない
- 一つのファイルにUI・認証・DB処理を詰め込みすぎない
- 機能単位で関連コードを探しやすくする
- テストしやすい単位で業務ロジックを分離する
- 実装の進行に合わせて構成を見直す
