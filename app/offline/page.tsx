import styles from './page.module.css';

export default function Offline() {
  return (
    <div className={styles.offline}>
      <h1>Hmmm, We couldn't reach our server !!</h1>
      <p>It seems like our server is under maintainance. </p>
      <p><a href="https://aswanthvc.me/contact">In the mean time, donate us for making things better and faster</a></p>
    </div>
  );
}