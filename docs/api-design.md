# API設計書

## 1. 概要

Kakeiboで使用するAPIのエンドポイント、リクエスト、レスポンス、エラー処理のルールを定義する。

| 項目 | 方針 |
|---|---|
| 通信方式 | HTTP / HTTPS |
| データ形式 | JSON |
| API実装 | Next.js Route Handlers |
| 認証 | 採用する認証方式に合わせて実装 |
| データアクセス | Prisma |
| バリデーション | クライアント側とサーバー側の両方 |

## 2. 共通ルール

### 2.1 認証

認証が必要なAPIでは、リクエストごとにサーバー側でログイン状態を確認する。

ユーザーIDは認証済みセッションなどの信頼できるサーバー側情報から取得する。リクエスト本文の `userId` は信用しない。

### 2.2 Content-Type

JSONリクエストでは、原則として以下を使用する。

```http
Content-Type: application/json
```

### 2.3 HTTPステータス

| ステータス | 用途 |
|---|---|
| 200 OK | 取得・更新成功 |
| 201 Created | 新規作成成功 |
| 204 No Content | 削除成功 |
| 400 Bad Request | リクエスト形式が不正 |
| 401 Unauthorized | 未認証 |
| 403 Forbidden | 操作権限がない |
| 404 Not Found | 対象データが存在しない |
| 409 Conflict | 重複などの競合 |
| 422 Unprocessable Content | 入力値の検証エラー |
| 500 Internal Server Error | 想定外のサーバーエラー |

認証・認可の詳細や、対象データの存在を外部に漏らさないための応答方針は実装時に統一する。

## 3. 共通エラー形式

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "入力内容を確認してください",
    "details": {
      "amount": "金額は1円以上で入力してください"
    }
  }
}
```

`details` は必要な場合のみ返す。内部例外、SQL、スタックトレース、秘密情報はクライアントに返さない。

主なエラーコード：

| コード | 意味 |
|---|---|
| `VALIDATION_ERROR` | 入力値エラー |
| `UNAUTHENTICATED` | 未認証 |
| `FORBIDDEN` | 権限なし |
| `NOT_FOUND` | 対象なし |
| `CONFLICT` | 重複・競合 |
| `INTERNAL_ERROR` | 内部エラー |

## 4. 認証API

認証ライブラリを採用する場合、ログイン・ログアウト用のURLやHTTPメソッドは、そのライブラリの仕様に合わせる。以下はアプリケーションの論理的な機能を表す。

| 機能 | エンドポイント例 | 説明 |
|---|---|---|
| ユーザー登録 | `POST /api/auth/register` | 新規ユーザー作成 |
| ログイン | 認証ライブラリのエンドポイント | 認証処理 |
| ログアウト | 認証ライブラリのエンドポイント | セッション終了 |
| 認証状態確認 | `GET /api/auth/me` | ログインユーザー情報取得 |

### ユーザー登録

リクエスト例：

```json
{
  "email": "user@example.com",
  "password": "example-password"
}
```

仕様：

- メールアドレスの形式を検証する
- パスワードの長さなどのルールを検証する
- パスワードを平文で保存しない
- メールアドレスの重複を防ぐ
- パスワードなどの秘密情報をレスポンスに含めない

## 5. 支出API

| メソッド | パス | 説明 | 成功時 |
|---|---|---|---|
| GET | `/api/expenses` | 支出一覧取得 | 200 |
| POST | `/api/expenses` | 支出登録 | 201 |
| GET | `/api/expenses/[id]` | 支出詳細取得 | 200 |
| PATCH | `/api/expenses/[id]` | 支出更新 | 200 |
| DELETE | `/api/expenses/[id]` | 支出削除 | 204 |

### 支出一覧取得

クエリ例：

`GET /api/expenses?from=2026-10-01&to=2026-11-01`

- `from` は対象期間の開始日
- `to` は対象期間の終了境界（この日付を含まない）
- 必要に応じてページネーションを追加する

レスポンス例：

```json
{
  "items": [
    {
      "id": "expense-uuid",
      "amount": 1200,
      "categoryId": "category-uuid",
      "categoryName": "食費",
      "date": "2026-10-15",
      "memo": "昼食"
    }
  ]
}
```

### 支出登録

リクエスト例：

```json
{
  "amount": 1200,
  "categoryId": "category-uuid",
  "date": "2026-10-15",
  "memo": "昼食"
}
```

検証項目：

- 金額が1以上の整数である
- 日付が有効である
- カテゴリが存在する
- カテゴリが支出用である
- カテゴリの所有者がログインユーザーと一致する

### 支出更新・削除

対象支出がログインユーザーの所有物であることを検証する。他ユーザーの支出を取得・更新・削除できないようにする。

## 6. 収入API

| メソッド | パス | 説明 |
|---|---|---|
| GET | `/api/incomes` | 収入一覧取得 |
| POST | `/api/incomes` | 収入登録 |
| GET | `/api/incomes/[id]` | 収入詳細取得 |
| PATCH | `/api/incomes/[id]` | 収入更新 |
| DELETE | `/api/incomes/[id]` | 収入削除 |

支出APIと同様のルールを適用し、カテゴリが収入用であることを検証する。

## 7. カテゴリAPI

| メソッド | パス | 説明 |
|---|---|---|
| GET | `/api/categories` | カテゴリ一覧取得 |
| POST | `/api/categories` | カテゴリ作成 |
| PATCH | `/api/categories/[id]` | カテゴリ更新 |
| DELETE | `/api/categories/[id]` | カテゴリ削除 |

作成リクエスト例：

```json
{
  "name": "食費",
  "type": "EXPENSE",
  "icon": "utensils"
}
```

- `type` は `EXPENSE` または `INCOME`
- カテゴリ名は空欄を許可しない
- 同一ユーザー・同一種別のカテゴリ名重複を防止する
- 使用中カテゴリの削除はDB設計に定めたルールに従う

## 8. ダッシュボード・集計API

| メソッド | パス | 説明 |
|---|---|---|
| GET | `/api/dashboard?yearMonth=2026-10` | 月次収支概要 |
| GET | `/api/analytics/categories?yearMonth=2026-10` | カテゴリ別支出集計 |

月次概要レスポンス例：

```json
{
  "yearMonth": "2026-10",
  "incomeTotal": 300000,
  "expenseTotal": 85000,
  "balance": 215000
}
```

カテゴリ別支出レスポンス例：

```json
{
  "yearMonth": "2026-10",
  "items": [
    {
      "categoryId": "category-uuid",
      "categoryName": "食費",
      "total": 25000
    }
  ]
}
```

集計条件は、対象月の開始日以上、翌月開始日未満とする。支出と収入を別々に集計し、収支は「収入合計 − 支出合計」で計算する。

## 9. バリデーションと例外処理

- リクエスト本文の型・必須項目を検証する
- 不正なUUIDや日付を検証する
- 金額の上限を必要に応じて定義する
- DB制約違反を適切なエラーに変換する
- 想定外のエラーはサーバーログに記録し、クライアントには一般的なメッセージを返す
- 重要な更新処理では、データの整合性を保つ

## 10. API実装方針

Next.js App Routerでは、APIを `src/app/api/**/route.ts` に実装する。

例：

```text
src/app/api/
├── auth/
│   ├── register/route.ts
│   └── me/route.ts
├── expenses/
│   ├── route.ts
│   └── [id]/route.ts
├── incomes/
│   ├── route.ts
│   └── [id]/route.ts
├── categories/
│   ├── route.ts
│   └── [id]/route.ts
├── dashboard/route.ts
└── analytics/
    └── categories/route.ts
```

認証ライブラリのルートと独自APIの役割が重複しないようにする。例えば、Auth.jsを利用する場合、ログイン・ログアウトは原則としてAuth.jsの認証フローを利用し、独自APIはユーザー登録など不足する機能に限定する。

## 11. セキュリティ確認項目

- [ ] 認証が必要なAPIで未認証アクセスを拒否する
- [ ] すべてのデータ操作で所有者を検証する
- [ ] リクエストの `userId` を信用しない
- [ ] 入力値をサーバー側で検証する
- [ ] 秘密情報や内部例外をレスポンスに含めない
- [ ] DBアクセスは原則として認証・認可の検証後に行う
- [ ] 認証ライブラリのCSRF対策やCookie設定を適切に利用する
