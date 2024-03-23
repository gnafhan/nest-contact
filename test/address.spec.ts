import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('Address Testing', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);
  });

  describe('POST /api/contacts/:contactId/addresses', () => {
    beforeEach(async () => {
      await testService.deleteAddress();
      await testService.deleteContact();
      await testService.deleteUser();

      await testService.createUser();
      await testService.createContact();
    });

    it('should be rejected if request is invalid', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .post(`/api/contacts/${contact.id}/addresses`)
        .set('Authorization', 'test')
        .send({
          street: '',
          city: '',
          province: '',
          country: '',
          postal_code: '',
        })
        .expect(400);
      logger.info(response.body);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to create address', async () => {
      const contact = await testService.getContact();

      const response = await request(app.getHttpServer())
        .post(`/api/contacts/${contact.id}/addresses`)
        .set('Authorization', 'test')
        .send({
          street: 'jalan test',
          city: 'kota test',
          province: 'provinsi test',
          country: 'negara test',
          postal_code: '12345',
        })
        .expect(200);
      logger.info(response.body);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.street).toBe('jalan test');
      expect(response.body.data.city).toBe('kota test');
      expect(response.body.data.province).toBe('provinsi test');
      expect(response.body.data.country).toBe('negara test');
      expect(response.body.data.postal_code).toBe('12345');
    });
  });

  describe('GET /api/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
      await testService.deleteAddress();
      await testService.deleteContact();
      await testService.deleteUser();

      await testService.createUser();
      await testService.createContact();
      await testService.createAddress();
    });

    it('should be rejected if contact is not found', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
        .set('Authorization', 'test')
        .expect(404);
      logger.info(response.body);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if address is not found', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
        .set('Authorization', 'test')
        .expect(404);
      logger.info(response.body);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to get address', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set('Authorization', 'test')
        .expect(200);
      logger.info(response.body);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.street).toBe('jalan test');
      expect(response.body.data.city).toBe('kota test');
      expect(response.body.data.province).toBe('provinsi test');
      expect(response.body.data.country).toBe('negara test');
      expect(response.body.data.postal_code).toBe('12345');
    });
  });

  describe('PUT /api/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
      await testService.deleteAddress();
      await testService.deleteContact();
      await testService.deleteUser();

      await testService.createUser();
      await testService.createContact();
      await testService.createAddress();
    });

    it('should be rejected if request is invalid', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set('Authorization', 'test')
        .send({
          street: '',
          city: '',
          province: '',
          country: '',
          postal_code: '',
        })
        .expect(400);
      logger.info(response.body);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to update address', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set('Authorization', 'test')
        .send({
          street: 'jalan test update',
          city: 'kota test update',
          province: 'provinsi test update',
          country: 'negara test update',
          postal_code: '123456',
        })
        .expect(200);
      logger.info(response.body);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.street).toBe('jalan test update');
      expect(response.body.data.city).toBe('kota test update');
      expect(response.body.data.province).toBe('provinsi test update');
      expect(response.body.data.country).toBe('negara test update');
      expect(response.body.data.postal_code).toBe('123456');
    });

    it('should be rejected if contact is notfound', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
        .set('Authorization', 'test')
        .send({
          street: 'jalan test update',
          city: 'kota test update',
          province: 'provinsi test update',
          country: 'negara test update',
          postal_code: '123456',
        })
        .expect(404);
      logger.info(response.body);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if adress is notfound', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
        .set('Authorization', 'test')
        .send({
          street: 'jalan test update',
          city: 'kota test update',
          province: 'provinsi test update',
          country: 'negara test update',
          postal_code: '123456',
        })
        .expect(404);
      logger.info(response.body);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('DELETE /api/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
      await testService.deleteAddress();
      await testService.deleteContact();
      await testService.deleteUser();

      await testService.createUser();
      await testService.createContact();
      await testService.createAddress();
    });

    it('should be rejected if contact is not found', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
        .set('Authorization', 'test')
        .expect(404);
      logger.info(response.body);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if address is not found', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
        .set('Authorization', 'test')
        .expect(404);
      logger.info(response.body);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to delete address', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set('Authorization', 'test')
        .expect(200);
      logger.info(response.body);
      expect(response.body.data).toBe(true);

      const addressDeleted = await testService.getAddress();
      expect(addressDeleted).toBeNull();
    });

    describe('GET /api/contacts/:contactId/addresses/', () => {
      beforeEach(async () => {
        await testService.deleteAddress();
        await testService.deleteContact();
        await testService.deleteUser();

        await testService.createUser();
        await testService.createContact();
        await testService.createAddress();
      });

      it('should be rejected if contact is not found', async () => {
        const contact = await testService.getContact();
        const response = await request(app.getHttpServer())
          .get(`/api/contacts/${contact.id + 1}/addresses/`)
          .set('Authorization', 'test')
          .expect(404);
        logger.info(response.body);
        expect(response.body.errors).toBeDefined();
      });

      it('should be able to list address', async () => {
        const contact = await testService.getContact();
        const response = await request(app.getHttpServer())
          .get(`/api/contacts/${contact.id}/addresses/`)
          .set('Authorization', 'test')
          .expect(200);
        logger.info(response.body);
        expect(response.body.data.length).toBe(1);
        expect(response.body.data[0].id).toBeDefined();
        expect(response.body.data[0].street).toBe('jalan test');
        expect(response.body.data[0].city).toBe('kota test');
        expect(response.body.data[0].province).toBe('provinsi test');
        expect(response.body.data[0].country).toBe('negara test');
        expect(response.body.data[0].postal_code).toBe('12345');
      });
    });
  });
});
