import crypto from 'node:crypto'

export const hashUserPassword = (password: string) => {
  const salt = crypto.randomBytes(16).toString('hex')

  const hashedPassword = crypto.scryptSync(password, salt, 64)
  return hashedPassword.toString('hex') + ':' + salt
}

export const verifyPassword = (
  storedPassword: string,
  suppliedPassword: string
) => {
  try {
    const [hashedPassword, salt] = storedPassword.split(':')
    const hashedPasswordBuf = Buffer.from(hashedPassword, 'hex')
    const suppliedPasswordBuf = crypto.scryptSync(suppliedPassword, salt, 64)
    return crypto.timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf)
  } catch (error) {
    console.log(error)
  }
}
