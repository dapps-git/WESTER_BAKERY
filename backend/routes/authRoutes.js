import express from 'express'

const router = express.Router()

const ADMIN_EMAIL = 'westernadmin@gmail.com'
const ADMIN_PASS = 'WESTER@ADMIN'

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body

  if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
    return res.json({
      success: true,
      message: 'Login successful',
      token: 'western_bakery_admin_token_2026',
      user: { email: ADMIN_EMAIL, role: 'admin' },
    })
  }

  return res.status(401).json({
    success: false,
    error: 'Invalid admin credentials. Please check your email and password.',
  })
})

export default router
