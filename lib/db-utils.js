import mysql from 'mysql2/promise';

// Database connection configuration
const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'noveris',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Create connection pool
let pool = null;

// Get database connection pool
export function getPool() {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

// Execute a query with parameters
export async function executeQuery(query, params = []) {
  try {
    const connection = getPool();
    const [results] = await connection.execute(query, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error(`Database error: ${error.message}`);
  }
}

// Execute a query and return the first result
export async function executeQueryFirst(query, params = []) {
  const results = await executeQuery(query, params);
  return results[0] || null;
}

// Execute a query and return the affected rows count
export async function executeQueryAffected(query, params = []) {
  try {
    const connection = getPool();
    const [result] = await connection.execute(query, params);
    return result.affectedRows;
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error(`Database error: ${error.message}`);
  }
}

// Test database connection
export async function testConnection() {
  try {
    const connection = getPool();
    await connection.execute('SELECT 1');
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Close database connection pool
export async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

// Database helper functions for common operations
export const dbHelpers = {
  // User operations
  async findUserByEmail(email) {
    return executeQueryFirst(
      'SELECT * FROM users WHERE email = ? LIMIT 1',
      [email]
    );
  },

  async findUserById(id) {
    return executeQueryFirst(
      'SELECT * FROM users WHERE id = ? LIMIT 1',
      [id]
    );
  },

  async createUser(userData) {
    const { name, email, password, image, provider } = userData;
    const result = await executeQuery(
      'INSERT INTO users (name, email, password, image, email_verified, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      [name, email, password || null, image || null, provider === 'google' ? true : false]
    );
    return result.insertId;
  },

  async updateUser(id, userData) {
    const { name, email, image } = userData;
    return executeQueryAffected(
      'UPDATE users SET name = ?, email = ?, image = ?, updated_at = NOW() WHERE id = ?',
      [name, email, image, id]
    );
  },

  // OTP operations
  async createOTP(email, code, expiresAt) {
    return executeQuery(
      'INSERT INTO otp_codes (email, code, expires_at, created_at) VALUES (?, ?, ?, NOW())',
      [email, code, expiresAt]
    );
  },

  async findValidOTP(email, code) {
    return executeQueryFirst(
      'SELECT * FROM otp_codes WHERE email = ? AND code = ? AND verified = 0 AND expires_at > NOW() LIMIT 1',
      [email, code]
    );
  },

  async markOTPAsVerified(id) {
    return executeQueryAffected(
      'UPDATE otp_codes SET verified = 1 WHERE id = ?',
      [id]
    );
  },

  // Password reset operations
  async createPasswordResetToken(email, token, expiresAt) {
    return executeQuery(
      'INSERT INTO password_reset_tokens (email, token, expires_at, created_at) VALUES (?, ?, ?, NOW())',
      [email, token, expiresAt]
    );
  },

  async findValidResetToken(token) {
    return executeQueryFirst(
      'SELECT * FROM password_reset_tokens WHERE token = ? AND used = 0 AND expires_at > NOW() LIMIT 1',
      [token]
    );
  },

  async markResetTokenAsUsed(id) {
    return executeQueryAffected(
      'UPDATE password_reset_tokens SET used = 1 WHERE id = ?',
      [id]
    );
  },

  async updateUserPassword(email, hashedPassword) {
    return executeQueryAffected(
      'UPDATE users SET password = ?, updated_at = NOW() WHERE email = ?',
      [hashedPassword, email]
    );
  },

  // Session operations
  async createSession(sessionToken, userId, expiresAt) {
    return executeQuery(
      'INSERT INTO sessions (session_token, user_id, expires_at, created_at) VALUES (?, ?, ?, NOW())',
      [sessionToken, userId, expiresAt]
    );
  },

  async findSession(sessionToken) {
    return executeQueryFirst(
      'SELECT * FROM sessions WHERE session_token = ? AND expires_at > NOW() LIMIT 1',
      [sessionToken]
    );
  },

  async deleteSession(sessionToken) {
    return executeQueryAffected(
      'DELETE FROM sessions WHERE session_token = ?',
      [sessionToken]
    );
  },

  // Verification token operations
  async createVerificationToken(identifier, token, expiresAt) {
    return executeQuery(
      'INSERT INTO verification_tokens (identifier, token, expires_at, created_at) VALUES (?, ?, ?, NOW())',
      [identifier, token, expiresAt]
    );
  },

  async findVerificationToken(identifier, token) {
    return executeQueryFirst(
      'SELECT * FROM verification_tokens WHERE identifier = ? AND token = ? AND expires_at > NOW() LIMIT 1',
      [identifier, token]
    );
  },

  async deleteVerificationToken(identifier, token) {
    return executeQueryAffected(
      'DELETE FROM verification_tokens WHERE identifier = ? AND token = ?',
      [identifier, token]
    );
  }
};
