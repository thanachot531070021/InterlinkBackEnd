import { PartialType } from '@nestjs/swagger';
import { CreateStoreBrandEntitlementDto } from './create-entitlement.dto';

export class UpdateStoreBrandEntitlementDto extends PartialType(CreateStoreBrandEntitlementDto) {}