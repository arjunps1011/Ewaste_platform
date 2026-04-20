import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from '../../css/user/nav.module.css'
import axios from 'axios'


function Nav() {

  const BASE_URL = import.meta.env.VITE_API_URL
  const navRef = useRef(null)
  const lastY = useRef(0)
  const token = localStorage.getItem('token')
  const [showModal, setShowModal] = useState(false)
  const [isSignup, setIsSignup] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [showLogout, setShowLogout] = useState(false)

  const handleLogout = () => { localStorage.removeItem('token'); setShowLogout(false); window.location.reload() }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!loginForm.email || !loginForm.password) { setError('Please fill in all fields.'); return }
    try {
      const res = await axios.post(`${BASE_URL}/api/login/`, loginForm)
      localStorage.setItem('token', res.data.token)
      setShowModal(false)
      setLoginForm({ email: '', password: '' })
      setError('')
      const payload = JSON.parse(atob(res.data.token.split('.')[1]))
      if (payload.role === 'admin') window.location.href = '/admin'
      else if ( payload.role ==='collector') window.location.href = '/employee'
      else if(payload.role === 'technician') window.location.href = '/recycle'
      else window.location.reload()
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
  }

  const navigation = () => {
    const t = localStorage.getItem('token')
    if (!t) return
    const payload = JSON.parse(atob(t.split('.')[1]))
    if (payload.role === 'admin') window.location.href = '/admin'
    else if (payload.role === 'collector') window.location.href = '/employee'
    else if (payload.role === 'technician') window.location.href = '/recycle'
  }

  useEffect(() => {
    navigation()
  }, [])

  const signup = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password || !form.phone || !form.address) {
      setError('Please fill in all fields.'); return
    }
    try {
      const res = await axios.post(`${BASE_URL}/api/register/`, form)
      setIsSignup(false)
      setError('')
      setSuccess('Account created successfully!')
      setTimeout(() => setSuccess(''), 3000)
      console.log('Account created successfully!');
      
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
  }


  useEffect(() => {
    const handler = () => { setIsSignup(false); setShowModal(true) }
    window.addEventListener('openLogin', handler)
    return () => window.removeEventListener('openLogin', handler)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY
      if (currentY > lastY.current && currentY > 60) {
        navRef.current.style.transform = 'translateY(-100%)'
      } else {
        navRef.current.style.transform = 'translateY(0)'
      }
      lastY.current = currentY
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <div ref={navRef} className={styles.navWrapper}>
        <nav className={styles.nav}>

          <Link to='/' className={styles.navLogo}>Eco<span>Cycle</span></Link>

          <div className={styles.navLinks}>
            <Link to='/' className={styles.navLink}>Home</Link>
            <Link to='/products' className={styles.navLink}>Buy Products</Link>
            <Link to='/sell' className={styles.navLink}>Sell E-Waste</Link>
            <Link to='/about' className={styles.navLink}>About</Link>
          </div>

          <div className={styles.navActions}>
            <Link to='/cart' className={styles.iconBtn} aria-label='Cart'>
              <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round'>
                <path d='M6 2 L3 6 L3 20 C3 21.1 3.9 22 5 22 L19 22 C20.1 22 21 21.1 21 20 L21 6 L18 2 Z'/>
                <line x1='3' y1='6' x2='21' y2='6'/>
                <path d='M16 10 C16 12.2 14.2 14 12 14 C9.8 14 8 12.2 8 10'/>
              </svg>
              <span className={styles.cartBadge}>0</span>
            </Link>

            {token ? (
              <>
                <Link to='/profile' className={styles.iconBtn} aria-label='Profile'>
                  <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round'>
                    <circle cx='12' cy='8' r='4'/>
                    <path d='M4 20 C4 16 7.6 13 12 13 C16.4 13 20 16 20 20'/>
                  </svg>
                </Link>
                <button className={styles.logoutBtn} onClick={() => setShowLogout(true)}>Log out</button>
              </>
            ) : (
              <>
                <button className={styles.loginBtn} onClick={() => { setIsSignup(false); setError(''); setForm({ name: '', email: '', password: '' }); setShowModal(true) }}>Log in</button>
                <button className={styles.signupBtn} onClick={() => { setIsSignup(true); setError(''); setForm({ name: '', email: '', password: '' }); setShowModal(true) }}>Sign up</button>
              </>
            )}
          </div>

        </nav>
      </div>

      {/* ── Logout confirm modal ── */}
      {showLogout && (
        <div className={styles.overlay} onClick={() => setShowLogout(false)}>
          <div className={styles.modal} style={{ maxWidth: 360 }} onClick={e => e.stopPropagation()}>
            <div className={styles.modalGlow} />
            <button className={styles.modalClose} onClick={() => setShowLogout(false)}>
              <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round'>
                <line x1='18' y1='6' x2='6' y2='18'/><line x1='6' y1='6' x2='18' y2='18'/>
              </svg>
            </button>
            <div className={styles.logoutIcon}>
              <svg width='28' height='28' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round'>
                <path d='M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4'/>
                <polyline points='16 17 21 12 16 7'/>
                <line x1='21' y1='12' x2='9' y2='12'/>
              </svg>
            </div>
            <h2 className={styles.modalTitle} style={{ fontSize: '1.3rem', marginTop: 12 }}>Log out?</h2>
            <p className={styles.modalSub}>You'll need to log back in to access your account.</p>
            <div className={styles.logoutBtns}>
              <button className={styles.logoutCancelBtn} onClick={() => setShowLogout(false)}>Cancel</button>
              <button className={styles.logoutConfirmBtn} onClick={handleLogout}>Yes, log out</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Login / Signup modal ── */}
      {showModal && (
        <div className={styles.overlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalGlow} />
            <button className={styles.modalClose} onClick={() => setShowModal(false)}>
              <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round'>
                <line x1='18' y1='6' x2='6' y2='18'/><line x1='6' y1='6' x2='18' y2='18'/>
              </svg>
            </button>
            <div className={styles.modalBody} key={isSignup ? 'signup' : 'login'}>
              {isSignup ? (
                <>
                  <h2 className={styles.modalTitle}>Create account</h2>
                  <p className={styles.modalSub}>Join the recycling movement.</p>
                  <form className={styles.modalForm} onSubmit={signup}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Full Name</label>
                      <input className={styles.fieldInput} type='text' placeholder='Your name' value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Email</label>
                      <input className={styles.fieldInput} type='email' placeholder='you@example.com' value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Phone</label>
                      <input className={styles.fieldInput} type='text' placeholder='Your phone number' value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Address</label>
                      <input className={styles.fieldInput} type='text' placeholder='Your address' value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Password</label>
                      <input className={styles.fieldInput} type='password' placeholder='••••••••' value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
                    </div>
                    {error && <p className={styles.errorMsg}>{error}</p>}
                    <button type='submit' className={styles.submitBtn}>Create Account</button>
                    <p style={{textAlign:'center', marginTop:'12px', fontSize:'0.85rem'}}>Already have an account? <span style={{color:'#00ffa3', cursor:'pointer'}} onClick={() => setIsSignup(false)}>Log in</span></p>
                  </form>
                </>
              ) : (
                <>
                  <h2 className={styles.modalTitle}>Welcome back</h2>
                  <p className={styles.modalSub}>Log in to your account.</p>
                  <form className={styles.modalForm} onSubmit={handleLogin}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Email</label>
                      <input className={styles.fieldInput} type='email' placeholder='you@example.com' value={loginForm.email} onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))} />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Password</label>
                      <input className={styles.fieldInput} type='password' placeholder='••••••••' value={loginForm.password} onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))} />
                    </div>
                    {error && <p className={styles.errorMsg}>{error}</p>}
                    <button type='submit' className={styles.submitBtn}>Log In</button>
                    {success && <p className={styles.successMsg}>{success}</p>}
                    <p style={{textAlign:'center', marginTop:'12px', fontSize:'0.85rem'}}>Don't have an account? <span style={{color:'#00ffa3', cursor:'pointer'}} onClick={() => setIsSignup(true)}>Sign up</span></p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Nav
