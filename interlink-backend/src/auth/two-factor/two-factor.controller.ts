import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TwoFactorService } from './two-factor.service';
import { JwtAuthGuard } from '../jwt-auth.guard';

@ApiTags('two-factor-auth')
@Controller('auth/2fa')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TwoFactorController {
  constructor(private readonly twoFactorService: TwoFactorService) {}

  @Get('status')
  @ApiOperation({ summary: 'Get 2FA status for current user' })
  @ApiResponse({ 
    status: 200, 
    description: '2FA status retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        enabled: { type: 'boolean', example: true },
        backupCodesRemaining: { type: 'number', example: 8 },
        lastUsedAt: { type: 'string', format: 'date-time', example: '2024-01-20T14:30:00.000Z', nullable: true }
      }
    }
  })
  async getTwoFactorStatus(@Request() req: any) {
    return this.twoFactorService.getTwoFactorStatus(req.user.id);
  }

  @Post('generate')
  @ApiOperation({ summary: 'Generate 2FA secret and QR code' })
  @ApiResponse({ 
    status: 200, 
    description: '2FA secret generated successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            secret: { type: 'string', example: 'JBSWY3DPEHPK3PXP' },
            qrCodeUrl: { type: 'string', example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...' },
            manualEntryKey: { type: 'string', example: 'JBSW Y3DP EHPK 3PXP' },
            backupCodes: {
              type: 'array',
              items: { type: 'string' },
              example: ['12345678', '87654321', '11223344', '44332211', '55667788', '88776655', '99887766', '66778899']
            }
          }
        }
      }
    }
  })
  async generateSecret(@Request() req: any) {
    const result = await this.twoFactorService.generateSecret(req.user.id);
    return {
      success: true,
      data: result,
    };
  }

  @Post('enable')
  @ApiOperation({ summary: 'Enable 2FA with verification token' })
  @ApiResponse({ 
    status: 200, 
    description: '2FA enabled successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Two-factor authentication enabled successfully' }
      }
    }
  })
  async enableTwoFactor(
    @Request() req: any,
    @Body() body: { secret: string; token: string },
  ) {
    await this.twoFactorService.enableTwoFactor(req.user.id, body.secret, body.token);
    return {
      success: true,
      message: 'Two-factor authentication enabled successfully',
    };
  }

  @Delete('disable')
  @ApiOperation({ summary: 'Disable 2FA with verification' })
  @ApiResponse({ 
    status: 200, 
    description: '2FA disabled successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Two-factor authentication disabled successfully' }
      }
    }
  })
  async disableTwoFactor(
    @Request() req: any,
    @Body() body: { token?: string; backupCode?: string },
  ) {
    await this.twoFactorService.disableTwoFactor(req.user.id, body.token, body.backupCode);
    return {
      success: true,
      message: 'Two-factor authentication disabled successfully',
    };
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify 2FA token or backup code' })
  @ApiResponse({ 
    status: 200, 
    description: '2FA verification result',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            valid: { type: 'boolean', example: true }
          }
        }
      }
    }
  })
  async verifyTwoFactor(
    @Request() req: any,
    @Body() body: { token?: string; backupCode?: string },
  ) {
    const isValid = await this.twoFactorService.verifyTwoFactor(
      req.user.id,
      body.token,
      body.backupCode,
    );
    return {
      success: true,
      data: { valid: isValid },
    };
  }

  @Post('backup-codes/regenerate')
  @ApiOperation({ summary: 'Regenerate backup codes' })
  @ApiResponse({ 
    status: 200, 
    description: 'Backup codes regenerated successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            backupCodes: {
              type: 'array',
              items: { type: 'string' },
              example: ['12345678', '87654321', '11223344', '44332211', '55667788', '88776655', '99887766', '66778899']
            }
          }
        },
        message: { type: 'string', example: 'Backup codes regenerated successfully. Please save these codes in a safe place.' }
      }
    }
  })
  async regenerateBackupCodes(
    @Request() req: any,
    @Body() body: { token?: string; backupCode?: string },
  ) {
    const backupCodes = await this.twoFactorService.regenerateBackupCodes(
      req.user.id,
      body.token,
      body.backupCode,
    );
    return {
      success: true,
      data: { backupCodes },
      message: 'Backup codes regenerated successfully. Please save these codes in a safe place.',
    };
  }
}