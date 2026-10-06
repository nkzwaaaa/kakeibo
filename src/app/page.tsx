import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
      <section className={styles.intro} aria-labelledby="page-title">
        <p className={styles.eyebrow}>家計簿アプリ</p>
        <h1 id="page-title">Kakeibo</h1>
        <p className={styles.description}>毎日の収支を、シンプルに記録。</p>
        <p className={styles.status}>準備中</p>
      </section>
    </main>
  );
}
