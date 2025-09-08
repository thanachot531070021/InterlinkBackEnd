import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { UserRole } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

export interface SocialProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
}

@Injectable()
export class SocialLoginService {
  constructor(private readonly database: DatabaseService) {}

  async handleSocialLogin(profile: SocialProfile): Promise<{
    user: any;
    accessToken: string;
    refreshToken: string;
    isNewUser: boolean;
  }> {
    // Check if user exists with this social account
    let existingUser = await this.database.user.findFirst({
      where: {
        socialProvider: profile.provider,
        socialId: profile.id,
      },
      include: {
        profile: true,
        socialAccounts: true,
      },
    });

    // If no social account, check by email
    if (!existingUser && profile.email) {
      existingUser = await this.database.user.findUnique({
        where: { email: profile.email },
        include: {
          profile: true,
          socialAccounts: true,
        },
      });
    }

    let isNewUser = false;
    let user: any;

    if (existingUser) {
      // Update existing user's social info
      user = await this.database.user.update({
        where: { id: existingUser.id },
        data: {
          socialProvider: profile.provider,
          socialId: profile.id,
          emailVerified: true, // Email from social providers is usually verified
          lastLoginAt: new Date(),
        },
        include: {
          profile: true,
          socialAccounts: true,
        },
      });

      // Update or create social account record
      await this.upsertSocialAccount(user.id, profile);
    } else {
      // Create new user
      isNewUser = true;
      user = await this.database.user.create({
        data: {
          email: profile.email,
          name: profile.name,
          role: UserRole.CUSTOMER_GUEST, // Default role for social login
          socialProvider: profile.provider,
          socialId: profile.id,
          emailVerified: true,
          lastLoginAt: new Date(),
          profile: {
            create: {
              firstName: profile.name.split(' ')[0],
              lastName: profile.name.split(' ').slice(1).join(' ') || null,
              avatar: profile.avatar,
            },
          },
        },
        include: {
          profile: true,
          socialAccounts: true,
        },
      });

      // Create social account record
      await this.upsertSocialAccount(user.id, profile);
    }

    // Generate JWT tokens
    const jwtSecret = process.env.JWT_SECRET;
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRATION || '15m' },
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      jwtRefreshSecret,
      { expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d' },
    );

    return {
      user,
      accessToken,
      refreshToken,
      isNewUser,
    };
  }

  private async upsertSocialAccount(userId: string, profile: SocialProfile): Promise<void> {
    await this.database.socialAccount.upsert({
      where: {
        provider_providerId: {
          provider: profile.provider,
          providerId: profile.id,
        },
      },
      update: {
        email: profile.email,
        name: profile.name,
        avatar: profile.avatar,
        accessToken: profile.accessToken,
        refreshToken: profile.refreshToken,
        expiresAt: profile.expiresAt,
      },
      create: {
        userId,
        provider: profile.provider,
        providerId: profile.id,
        email: profile.email,
        name: profile.name,
        avatar: profile.avatar,
        accessToken: profile.accessToken,
        refreshToken: profile.refreshToken,
        expiresAt: profile.expiresAt,
      },
    });
  }

  async unlinkSocialAccount(userId: string, provider: string): Promise<void> {
    const user = await this.database.user.findUnique({
      where: { id: userId },
      include: { socialAccounts: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Check if user has password or other social accounts
    const hasPassword = user.password !== null;
    const otherSocialAccounts = user.socialAccounts.filter(
      account => account.provider !== provider,
    );

    if (!hasPassword && otherSocialAccounts.length === 0) {
      throw new Error('Cannot unlink the only authentication method. Please set a password first.');
    }

    // Remove social account
    await this.database.socialAccount.deleteMany({
      where: {
        userId,
        provider,
      },
    });

    // Update user if this was their primary social account
    if (user.socialProvider === provider) {
      const nextSocialAccount = otherSocialAccounts[0];
      await this.database.user.update({
        where: { id: userId },
        data: {
          socialProvider: nextSocialAccount?.provider || null,
          socialId: nextSocialAccount?.providerId || null,
        },
      });
    }
  }

  async getSocialAccounts(userId: string): Promise<any[]> {
    return this.database.socialAccount.findMany({
      where: { userId },
      select: {
        id: true,
        provider: true,
        providerId: true,
        email: true,
        name: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        // Don't expose tokens
      },
    });
  }

  async linkSocialAccount(userId: string, profile: SocialProfile): Promise<void> {
    // Check if this social account is already linked to another user
    const existingLink = await this.database.socialAccount.findFirst({
      where: {
        provider: profile.provider,
        providerId: profile.id,
        userId: { not: userId },
      },
    });

    if (existingLink) {
      throw new Error('This social account is already linked to another user');
    }

    // Create or update the social account link
    await this.upsertSocialAccount(userId, profile);

    // Update user's primary social info if they don't have one
    const user = await this.database.user.findUnique({
      where: { id: userId },
    });

    if (user && !user.socialProvider) {
      await this.database.user.update({
        where: { id: userId },
        data: {
          socialProvider: profile.provider,
          socialId: profile.id,
        },
      });
    }
  }

  async verifyGoogleToken(token: string): Promise<SocialProfile | null> {
    try {
      // In a real implementation, you would verify the Google token
      // with Google's API. For now, this is a placeholder.
      
      // Example implementation:
      // const { OAuth2Client } = require('google-auth-library');
      // const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      // const ticket = await client.verifyIdToken({
      //   idToken: token,
      //   audience: process.env.GOOGLE_CLIENT_ID,
      // });
      // const payload = ticket.getPayload();

      // For development purposes, return mock data
      return {
        id: 'google_user_123',
        email: 'user@gmail.com',
        name: 'Google User',
        avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
        provider: 'google',
      };
    } catch (error) {
      return null;
    }
  }

  async verifyFacebookToken(token: string): Promise<SocialProfile | null> {
    try {
      // In a real implementation, you would verify the Facebook token
      // For development purposes, return mock data
      return {
        id: 'facebook_user_123',
        email: 'user@facebook.com',
        name: 'Facebook User',
        avatar: 'https://graph.facebook.com/user_id/picture',
        provider: 'facebook',
      };
    } catch (error) {
      return null;
    }
  }
}