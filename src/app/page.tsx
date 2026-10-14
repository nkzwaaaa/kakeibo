export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-100 px-4 py-12 text-stone-900 sm:px-8">
      <section
        aria-labelledby="page-title"
        className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-sm sm:p-12"
      >
        <p className="text-sm font-semibold tracking-[0.16em] text-lime-950">
          家計簿アプリ
        </p>
        <h1
          id="page-title"
          className="mt-3 text-4xl font-bold tracking-tight sm:text-6xl"
        >
          Kakeibo
        </h1>
        <p className="mt-4 text-base leading-7 text-stone-600 sm:text-lg">
          毎日の収支を、シンプルに記録。
        </p>
        <p className="mt-8 inline-flex rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800">
          準備中
        </p>
      </section>
    </main>
  );
}
