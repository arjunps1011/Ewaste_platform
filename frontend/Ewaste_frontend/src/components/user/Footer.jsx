import styles from "../../css/user/footer.module.css"

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <div className={styles.logo}>Eco<span>Cycle</span></div>
          <p className={styles.tagline}>Turning e-waste into a greener future, one device at a time.</p>
        </div>

        <div className={styles.links}>
          <div className={styles.col}>
            <div className={styles.colTitle}>Platform</div>
            <a href="#">Sell E-Waste</a>
            <a href="#">Schedule Pickup</a>
            <a href="#">Track Order</a>
            <a href="#">Pricing</a>
          </div>
          <div className={styles.col}>
            <div className={styles.colTitle}>Company</div>
            <a href="#">About Us</a>
            <a href="#">Blog</a>
            <a href="#">Careers</a>
            <a href="#">Contact</a>
          </div>
          <div className={styles.col}>
            <div className={styles.colTitle}>Legal</div>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <p className={styles.copy}>© {new Date().getFullYear()} EcoCycle. All rights reserved.</p>
        <div className={styles.socials}>
          <a href="#" aria-label="Twitter">𝕏</a>
          <a href="#" aria-label="Instagram">◎</a>
          <a href="#" aria-label="LinkedIn">in</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer;
