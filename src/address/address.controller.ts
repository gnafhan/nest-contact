import {
  Body,
  Controller,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { WebResponse } from '../model/web.model';
import { AddressResponse, CreateAddressRequest } from '../model/address.model';
import { User } from '@prisma/client';
import { Auth } from '../common/auth.decorator';

@Controller('/api/contacts/:contactId/addresses')
export class AddressController {
  constructor(private adrresService: AddressService) {}

  @Post()
  @HttpCode(200)
  async create(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Body() request: CreateAddressRequest,
  ): Promise<WebResponse<AddressResponse>> {
    request.contact_id = contactId;
    const result = await this.adrresService.create(user, request);

    return {
      data: result,
    };
  }
}
