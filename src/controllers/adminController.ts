import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { 
  generateAccessToken, 
  generateRefreshToken
} from '../utils/tokens';

// Admin login
export const adminLogin = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin đăng nhập'
      });
    }

    // Get admin credentials from environment variables
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPasswordHash = process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD_HASH || '';
    const adminPasswordPlain = process.env.ADMIN_PASSWORD_PLAINTEXT || '';
    const adminRole = 'ADMIN';

    // Verify credentials (support hash or plaintext for dev convenience)
    let isPasswordValid = false;
    if (adminPasswordHash) {
      try {
        isPasswordValid = await bcrypt.compare(password, adminPasswordHash);
      } catch {
        isPasswordValid = false;
      }
    } else if (adminPasswordPlain) {
      isPasswordValid = password === adminPasswordPlain;
    } else {
      // Development fallback if no envs set
      isPasswordValid = username === 'admin' && password === 'Admin@123';
    }

    if (username !== adminUsername || !isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Tên đăng nhập hoặc mật khẩu không đúng'
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken('0', username, adminRole);
    const refreshToken = generateRefreshToken('0');

    // In a real app, you'd save the refresh token to the database
    // For simplicity, we're just returning it here
    // The refreshTokenExpires is intentionally not used in the response
    // as it's only needed when storing the token in the database

    return res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        user: {
          id: 0,
          username,
          role: adminRole
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống. Vui lòng thử lại sau.'
    });
  }
};

// Get current admin profile
export const getAdminProfile = async (_req: Request, res: Response): Promise<Response> => {
  try {
    // This would normally verify the admin token and get the admin user
    // For simplicity, we're just returning a success response
    return res.status(200).json({
      success: true,
      data: {
        id: 0,
        username: process.env.ADMIN_USERNAME || 'admin',
        role: 'ADMIN',
        email: process.env.ADMIN_EMAIL || 'admin@example.com'
      }
    });
  } catch (error) {
    console.error('Get admin profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống. Vui lòng thử lại sau.'
    });
  }
};
