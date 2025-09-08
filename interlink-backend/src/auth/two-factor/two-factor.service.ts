import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';

@Injectable()
export class TwoFactorService {
  constructor(private readonly database: DatabaseService) {}

  async generateSecret(userId: string): Promise<{
    secret: string;
    qrCodeUrl: string;
    qrCodeDataURL: string;
    backupCodes: string[];
  }> {
    const user = await this.database.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Generate TOTP secret
    const secret = speakeasy.generateSecret({
      name: `Interlink (${user.email})`,
      issuer: 'Interlink System',
      length: 32,
    });

    // Generate QR code
    const qrCodeDataURL = await QRCode.toDataURL(secret.otpauth_url);

    // Generate backup codes
    const backupCodes = await this.generateBackupCodes(userId);

    return {
      secret: secret.base32,
      qrCodeUrl: secret.otpauth_url,
      qrCodeDataURL,
      backupCodes,
    };
  }

  async enableTwoFactor(userId: string, secret: string, token: string): Promise<boolean> {
    // Verify the token first
    const isValid = speakeasy.totp.verify({
      secret,
      token,
      encoding: 'base32',
      window: 2,
    });

    if (!isValid) {
      throw new Error('Invalid verification code');
    }

    // Save secret and enable 2FA
    await this.database.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: true,
        twoFactorSecret: secret,
      },
    });

    return true;
  }

  async disableTwoFactor(userId: string, token?: string, backupCode?: string): Promise<boolean> {
    const user = await this.database.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.twoFactorEnabled) {
      throw new Error('Two-factor authentication is not enabled');
    }

    let isValid = false;

    if (token && user.twoFactorSecret) {
      // Verify with TOTP token
      isValid = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        token,
        encoding: 'base32',
        window: 2,
      });
    } else if (backupCode) {
      // Verify with backup code
      isValid = await this.verifyBackupCode(userId, backupCode);
    }

    if (!isValid) {
      throw new Error('Invalid verification code or backup code');
    }

    // Disable 2FA and clear secret
    await this.database.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
      },
    });

    // Delete all backup codes
    await this.database.twoFactorBackupCode.deleteMany({
      where: { userId },
    });

    return true;
  }

  async verifyTwoFactor(userId: string, token?: string, backupCode?: string): Promise<boolean> {
    const user = await this.database.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.twoFactorEnabled) {
      return false;
    }

    if (token && user.twoFactorSecret) {
      // Verify TOTP token
      return speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        token,
        encoding: 'base32',
        window: 2,
      });
    } else if (backupCode) {
      // Verify backup code
      return await this.verifyBackupCode(userId, backupCode);
    }

    return false;
  }

  async generateBackupCodes(userId: string): Promise<string[]> {
    // Clear existing backup codes
    await this.database.twoFactorBackupCode.deleteMany({
      where: { userId },
    });

    const codes: string[] = [];
    const hashedCodes: any[] = [];

    // Generate 10 backup codes
    for (let i = 0; i < 10; i++) {
      const code = crypto.randomBytes(4).toString('hex').toUpperCase();
      const hashedCode = await bcrypt.hash(code, 10);
      
      codes.push(code);
      hashedCodes.push({
        userId,
        code: hashedCode,
      });
    }

    // Save hashed codes to database
    await this.database.twoFactorBackupCode.createMany({
      data: hashedCodes,
    });

    return codes;
  }

  async verifyBackupCode(userId: string, inputCode: string): Promise<boolean> {
    const backupCodes = await this.database.twoFactorBackupCode.findMany({
      where: {
        userId,
        isUsed: false,
      },
    });

    for (const backupCode of backupCodes) {
      const isMatch = await bcrypt.compare(inputCode, backupCode.code);
      if (isMatch) {
        // Mark backup code as used
        await this.database.twoFactorBackupCode.update({
          where: { id: backupCode.id },
          data: {
            isUsed: true,
            usedAt: new Date(),
          },
        });
        return true;
      }
    }

    return false;
  }

  async regenerateBackupCodes(userId: string, token?: string, oldBackupCode?: string): Promise<string[]> {
    // Verify current 2FA first
    const isVerified = await this.verifyTwoFactor(userId, token, oldBackupCode);
    if (!isVerified) {
      throw new Error('Invalid verification code');
    }

    return await this.generateBackupCodes(userId);
  }

  async getTwoFactorStatus(userId: string): Promise<{
    enabled: boolean;
    backupCodesCount: number;
  }> {
    const [user, backupCodesCount] = await Promise.all([
      this.database.user.findUnique({
        where: { id: userId },
        select: { twoFactorEnabled: true },
      }),
      this.database.twoFactorBackupCode.count({
        where: {
          userId,
          isUsed: false,
        },
      }),
    ]);

    return {
      enabled: user?.twoFactorEnabled || false,
      backupCodesCount,
    };
  }
}