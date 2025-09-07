import { Module } from '@nestjs/common';
import { EntitlementsService } from './entitlements.service';
import { EntitlementsController } from './entitlements.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [EntitlementsController],
  providers: [EntitlementsService],
  exports: [EntitlementsService],
})
export class EntitlementsModule {}