import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'crypto'
import { promisify } from 'util'

const scrypt = promisify(scryptCallback)

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex')
  const derived = (await scrypt(password, salt, 64)) as Buffer
  return `${salt}:${derived.toString('hex')}`
}

export async function verifyPassword(
  password: string,
  encoded: string
): Promise<boolean> {
  const [salt, savedHex] = encoded.split(':')
  if (!salt || !savedHex) return false

  const saved = Buffer.from(savedHex, 'hex')
  const derived = (await scrypt(password, salt, saved.length)) as Buffer

  if (saved.length !== derived.length) return false
  return timingSafeEqual(saved, derived)
}
