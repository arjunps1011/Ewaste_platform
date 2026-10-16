import { useEffect } from "react";
import styles from "../../css/user/about.module.css";
import Nav from "./Nav";
import Footer from "./Footer";

const MISSION_ITEMS = [
  {
    tag: "Mission",
    title: "Responsible Recycling, Rewarded.",
    desc: "We make it effortless to dispose of old electronics responsibly — while putting money back in your pocket. Every device we collect is handled with care for people and the planet.",
  },
  {
    tag: "Vision",
    title: "A World Without E-Waste.",
    desc: "We envision a future where no electronic device ends up in a landfill. Through technology and community, we're building the infrastructure to make that future real.",
  },
];

const WHAT_WE_DO = [
  { num: "01", title: "Device Collection", desc: "We accept phones, laptops, tablets, batteries, TVs, wearables, and more — in any condition." },
  { num: "02", title: "Expert Inspection", desc: "Every device is carefully assessed by our trained technicians to determine its condition and value." },
  { num: "03", title: "Fair Valuation", desc: "We offer transparent, competitive pricing based on market rates and device condition." },
  { num: "04", title: "Eco Recycling", desc: "Devices that can't be resold are dismantled and recycled through certified, zero-landfill partners." },
];

const HOW_IT_WORKS = [
  { num: "01", title: "Create a Listing", desc: "Log in, describe your device, and upload a photo. Takes under 2 minutes." },
  { num: "02", title: "Choose Collection", desc: "Pick what works for you — home pickup, nearest drop-off centre, or prepaid mail." },
  { num: "03", title: "Quality Assessment", desc: "Our technicians grade your device against 40+ condition checkpoints." },
  { num: "04", title: "Instant Payout", desc: "Confirm the offer and funds hit your account the same business day." },
];

const WHY_US = [
  { tag: "01", title: "No Hidden Fees", desc: "The price we quote is the price you receive. No deductions, no surprises at payout." },
  { tag: "02", title: "Any Condition Accepted", desc: "Cracked screen, dead battery, water damage — we take it all and still pay fairly." },
  { tag: "03", title: "Real-Time Tracking", desc: "A live dashboard shows exactly where your device is from collection to payment." },
  { tag: "04", title: "Certified Data Wipe", desc: "Every device undergoes a DoD-standard data erasure before it leaves our facility." },
  { tag: "05", title: "Nationwide Coverage", desc: "Over 200 drop-off points and same-day pickup available in all major cities." },
  { tag: "06", title: "Business Accounts", desc: "Bulk disposal plans for offices and enterprises with dedicated account management." },
];

const VALUES = [
  { num: "01", title: "Sustainability First", desc: "Every decision we make is guided by its environmental impact." },
  { num: "02", title: "Integrity", desc: "We operate with full transparency — in pricing, process, and partnerships." },
  { num: "03", title: "Innovation", desc: "We continuously improve our platform to make recycling faster and smarter." },
  { num: "04", title: "Community", desc: "We believe collective action drives real change. You're part of the movement." },
];

export default function About() {
  useEffect(() => {
    const checkVisible = () => {
      document.querySelectorAll(
        `.${styles.animSlideUp}, .${styles.animSlideLeft}, .${styles.animSlideRight}`
      ).forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.88) {
          el.classList.add("visible");
        }
      });
    };
    checkVisible();
    window.addEventListener("scroll", checkVisible);
    return () => window.removeEventListener("scroll", checkVisible);
  }, []);

  return (
    <div className={styles.wrapper}>
      <Nav />

      {/* ── 1. Hero / Who We Are ── */}
      <section className={styles.heroSection}>
        <div className={styles.heroInner}>
          <p className={`${styles.eyebrow} ${styles.animSlideUp}`}>Who We Are</p>
          <h1 className={`${styles.heroTitle} ${styles.animSlideUp} ${styles.delay1}`}>
            We turn old devices<br /><em>into a greener future.</em>
          </h1>
          <p className={`${styles.heroSub} ${styles.animSlideUp} ${styles.delay2}`}>
            EcoCycle is a technology-driven e-waste recycling platform that makes it simple, rewarding, and responsible to dispose of your old electronics. We connect individuals and businesses with certified recycling infrastructure — and pay you for it.
          </p>
        </div>
      </section>

      {/* ── 2. Mission & Vision ── */}
      <section className={styles.section}>
        <p className={`${styles.eyebrow} ${styles.animSlideUp}`}>Purpose</p>
        <h2 className={`${styles.sectionTitle} ${styles.animSlideUp} ${styles.delay1}`}>
          Mission &amp; <em>Vision</em>
        </h2>
        <div className={styles.twoCol}>
          {MISSION_ITEMS.map((item, i) => (
            <div
              key={item.tag}
              className={`${styles.missionCard} ${i === 0 ? styles.animSlideLeft : styles.animSlideRight}`}
            >
              <div className={styles.cardTag}>{item.tag}</div>
              <div className={styles.cardTitle}>{item.title}</div>
              <div className={styles.cardDesc}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. What We Do ── */}
      <section className={styles.section}>
        <p className={`${styles.eyebrow} ${styles.animSlideUp}`}>Our Services</p>
        <h2 className={`${styles.sectionTitle} ${styles.animSlideUp} ${styles.delay1}`}>
          What we <em>do.</em>
        </h2>
        <div className={styles.fourGrid}>
          {WHAT_WE_DO.map((item, i) => (
            <div key={item.title} className={`${styles.serviceCard} ${styles.animSlideUp}`} style={{ transitionDelay: `${i * 0.08}s` }}>
              <div className={styles.serviceNum}>{item.num}</div>
              <div className={styles.cardTitle}>{item.title}</div>
              <div className={styles.cardDesc}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. How It Works ── */}
      <section className={styles.section}>
        <p className={`${styles.eyebrow} ${styles.animSlideUp}`}>The Process</p>
        <h2 className={`${styles.sectionTitle} ${styles.animSlideUp} ${styles.delay1}`}>
          How it <em>works.</em>
        </h2>
        <div className={styles.stepsRow}>
          {HOW_IT_WORKS.map((step, i, arr) => (
            <div key={step.num} style={{ display: "contents" }}>
              <div className={`${styles.stepCard} ${styles.animSlideUp}`} style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className={styles.stepNum}>{step.num}</div>
                <div className={styles.cardTitle}>{step.title}</div>
                <div className={styles.cardDesc}>{step.desc}</div>
              </div>
              {i < arr.length - 1 && <div className={styles.stepArrow}>→</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. Why Choose Us ── */}
      <section className={styles.section}>
        <p className={`${styles.eyebrow} ${styles.animSlideUp}`}>Why EcoCycle</p>
        <h2 className={`${styles.sectionTitle} ${styles.animSlideUp} ${styles.delay1}`}>
          What sets us <em>apart.</em>
        </h2>
        <div className={styles.threeGrid}>
          {WHY_US.map((item, i) => (
            <div
              key={item.tag}
              className={`${styles.whyCard} ${i % 2 === 0 ? styles.animSlideLeft : styles.animSlideRight}`}
              style={{ transitionDelay: `${i * 0.07}s` }}
            >
              <div className={styles.whyTag}>{item.tag}</div>
              <div className={styles.cardTitle}>{item.title}</div>
              <div className={styles.cardDesc}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. Environmental Impact ── */}
      <section className={styles.impactSection}>
        <div className={styles.impactInner}>
          <div className={`${styles.impactCopy} ${styles.animSlideLeft}`}>
            <p className={styles.eyebrow}>Environmental Responsibility</p>
            <h2 className={styles.sectionTitle}>
              Every device.<br /><em>Zero landfill.</em>
            </h2>
            <p className={styles.impactDesc}>
              Electronic waste is the world's fastest-growing waste stream. Toxic materials like lead, mercury, and cadmium leach into soil and water when improperly discarded. At EcoCycle, every device we collect is either refurbished for reuse or dismantled through certified zero-landfill recycling channels.
            </p>
            <p className={styles.impactDesc}>
              We are committed to full compliance with international e-waste regulations and partner exclusively with ISO 14001-certified recycling facilities.
            </p>
          </div>
          <div className={`${styles.impactCommitments} ${styles.animSlideRight}`}>
            <div className={styles.commitCard}>
              <div className={styles.commitTitle}>Zero Landfill Policy</div>
              <div className={styles.commitDesc}>No device we collect ends up in a landfill. Every item is either refurbished, resold, or broken down through certified recycling channels.</div>
            </div>
            <div className={styles.commitCard}>
              <div className={styles.commitTitle}>ISO 14001 Certified Partners</div>
              <div className={styles.commitDesc}>We work exclusively with recycling facilities that meet international environmental management standards.</div>
            </div>
            <div className={styles.commitCard}>
              <div className={styles.commitTitle}>Regulatory Compliance</div>
              <div className={styles.commitDesc}>Our operations comply with all applicable e-waste disposal laws and extended producer responsibility frameworks.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Company Values ── */}
      <section className={styles.section}>
        <p className={`${styles.eyebrow} ${styles.animSlideUp}`}>What We Stand For</p>
        <h2 className={`${styles.sectionTitle} ${styles.animSlideUp} ${styles.delay1}`}>
          Our <em>values.</em>
        </h2>
        <div className={styles.fourGrid}>
          {VALUES.map((v, i) => (
            <div key={v.title} className={`${styles.valueCard} ${styles.animSlideUp}`} style={{ transitionDelay: `${i * 0.08}s` }}>
              <div className={styles.valueNum}>{v.num}</div>
              <div className={styles.cardTitle}>{v.title}</div>
              <div className={styles.cardDesc}>{v.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 8. Call to Action ── */}
      <section className={styles.ctaSection}>
        <p className={`${styles.eyebrow} ${styles.animSlideUp}`}>Get Started Today</p>
        <h2 className={`${styles.ctaTitle} ${styles.animSlideUp} ${styles.delay1}`}>
          Ready to recycle<br /><em>responsibly?</em>
        </h2>
        <p className={`${styles.ctaSub} ${styles.animSlideUp} ${styles.delay2}`}>
          Turn your old devices into cash while helping protect the planet. It takes less than 2 minutes to get started.
        </p>
        <div className={`${styles.ctaBtns} ${styles.animSlideUp} ${styles.delay3}`}>
          <a href="/sell" className={styles.ctaBtnPrimary}>Sell Your E-Waste →</a>
          <a href="/products" className={styles.ctaBtnSecondary}>Browse Refurbished</a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
