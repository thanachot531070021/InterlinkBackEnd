import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SocialLoginService } from './social-login.service';
import { JwtAuthGuard } from '../jwt-auth.guard';

@ApiTags('social-auth')
@Controller('auth/social')
export class SocialLoginController {
  constructor(private readonly socialLoginService: SocialLoginService) {}

  @Post('google')
  @ApiOperation({ summary: 'Login with Google' })
  @ApiResponse({ 
    status: 200, 
    description: 'Google login successful',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
                email: { type: 'string', example: 'user@gmail.com' },
                name: { type: 'string', example: 'John Doe' },
                role: { type: 'string', example: 'CUSTOMER_GUEST' },
                profile: {
                  type: 'object',
                  properties: {
                    avatar: { type: 'string', example: 'https://lh3.googleusercontent.com/a/default-user=s96-c' },
                    provider: { type: 'string', example: 'google' }
                  }
                }
              }
            },
            tokens: {
              type: 'object',
              properties: {
                accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
              }
            },
            isNewUser: { type: 'boolean', example: false }
          }
        },
        message: { type: 'string', example: 'Login successful' }
      }
    }
  })
  async googleLogin(@Body() body: { token: string }) {
    const profile = await this.socialLoginService.verifyGoogleToken(body.token);
    
    if (!profile) {
      return {
        success: false,
        message: 'Invalid Google token',
      };
    }

    const result = await this.socialLoginService.handleSocialLogin(profile);

    return {
      success: true,
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role,
          profile: result.user.profile,
        },
        tokens: {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
        isNewUser: result.isNewUser,
      },
      message: result.isNewUser ? 'Account created successfully' : 'Login successful',
    };
  }

  @Post('facebook')
  @ApiOperation({ summary: 'Login with Facebook' })
  @ApiResponse({ 
    status: 200, 
    description: 'Facebook login successful',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
                email: { type: 'string', example: 'user@facebook.com' },
                name: { type: 'string', example: 'Jane Smith' },
                role: { type: 'string', example: 'CUSTOMER_GUEST' },
                profile: {
                  type: 'object',
                  properties: {
                    avatar: { type: 'string', example: 'https://graph.facebook.com/v12.0/me/picture' },
                    provider: { type: 'string', example: 'facebook' }
                  }
                }
              }
            },
            tokens: {
              type: 'object',
              properties: {
                accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
              }
            },
            isNewUser: { type: 'boolean', example: true }
          }
        },
        message: { type: 'string', example: 'Account created successfully' }
      }
    }
  })
  async facebookLogin(@Body() body: { token: string }) {
    const profile = await this.socialLoginService.verifyFacebookToken(body.token);
    
    if (!profile) {
      return {
        success: false,
        message: 'Invalid Facebook token',
      };
    }

    const result = await this.socialLoginService.handleSocialLogin(profile);

    return {
      success: true,
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role,
          profile: result.user.profile,
        },
        tokens: {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
        isNewUser: result.isNewUser,
      },
      message: result.isNewUser ? 'Account created successfully' : 'Login successful',
    };
  }

  @Get('accounts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get linked social accounts' })
  @ApiResponse({ 
    status: 200, 
    description: 'Social accounts retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'social-account-uuid' },
              provider: { type: 'string', example: 'google' },
              providerId: { type: 'string', example: '1234567890' },
              email: { type: 'string', example: 'user@gmail.com' },
              name: { type: 'string', example: 'John Doe' },
              avatar: { type: 'string', example: 'https://lh3.googleusercontent.com/a/default-user=s96-c' },
              linkedAt: { type: 'string', format: 'date-time', example: '2024-01-20T14:30:00.000Z' }
            }
          }
        }
      }
    }
  })
  async getSocialAccounts(@Request() req: any) {
    const accounts = await this.socialLoginService.getSocialAccounts(req.user.id);
    return {
      success: true,
      data: accounts,
    };
  }

  @Post('link/:provider')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Link social account to current user' })
  @ApiResponse({ 
    status: 200, 
    description: 'Social account linked successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'google account linked successfully' }
      }
    }
  })
  async linkSocialAccount(
    @Request() req: any,
    @Param('provider') provider: string,
    @Body() body: { token: string },
  ) {
    let profile: any = null;

    if (provider === 'google') {
      profile = await this.socialLoginService.verifyGoogleToken(body.token);
    } else if (provider === 'facebook') {
      profile = await this.socialLoginService.verifyFacebookToken(body.token);
    }

    if (!profile) {
      return {
        success: false,
        message: `Invalid ${provider} token`,
      };
    }

    try {
      await this.socialLoginService.linkSocialAccount(req.user.id, profile);
      return {
        success: true,
        message: `${provider} account linked successfully`,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Delete('unlink/:provider')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unlink social account' })
  @ApiResponse({ 
    status: 200, 
    description: 'Social account unlinked successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'google account unlinked successfully' }
      }
    }
  })
  async unlinkSocialAccount(
    @Request() req: any,
    @Param('provider') provider: string,
  ) {
    try {
      await this.socialLoginService.unlinkSocialAccount(req.user.id, provider);
      return {
        success: true,
        message: `${provider} account unlinked successfully`,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}