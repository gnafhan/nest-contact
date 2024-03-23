import { Module } from '@nestjs/common';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { ContactModule } from '../contact/contact.module';

@Module({
  controllers: [AddressController],
  providers: [AddressService],
  imports: [ContactModule],
})
export class AddressModule {}
