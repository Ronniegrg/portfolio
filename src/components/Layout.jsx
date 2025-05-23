import Navbar from "./Navbar";
import Footer from "./Footer";
import styles from "./Layout.module.css";

const Layout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <a href="#main-content" className="skip-link visually-hidden">
        Skip to content
      </a>
      <Navbar />
      <main className={styles.main} id="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
