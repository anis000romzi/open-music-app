import { CiMail } from 'react-icons/ci';
import { IoCodeSlash } from 'react-icons/io5';
import styles from '../../_styles/style.module.css';

export default function About() {
  return (
    <main className={styles.about_page}>
      <div className={styles.about_page_text}>
        <h1>My Free Tunes</h1>
        <p className={styles.about_page_info}>
          Welcome to My Free Tunes, free music platform app designed to provide
          users with a seamless and enjoyable music streaming experience without
          any subscription fees.
        </p>
        <div className={styles.about_page_links}>
          <p>
            If you have any feedbacks, questions, or need further information,
            please feel free to contact me.
          </p>
          <div className={styles.about_page_contacts}>
            <div>
              <p>Contacts</p>
              <a href="mailto:anis000romzi@gmail.com" target="_blank">
                <CiMail /> : <p>anis000romzi@gmail.com</p>
              </a>
            </div>
            <div>
              <p>Source Code</p>
              <a href="https://github.com/anis000romzi/open-music-app" target="_blank">
                <IoCodeSlash /> :{' '}
                <p>https://github.com/anis000romzi/open-music-app</p>
              </a>
            </div>
          </div>
        </div>
      </div>
      <p className={styles.about_page_research}>
        <em>
          This web app is for research purpose only - all data collected will be
          kept confidential and used solely for research purposes. By
          participating in this research, you are contributing to the
          advancement of music streaming technology!
        </em>
      </p>
    </main>
  );
}
