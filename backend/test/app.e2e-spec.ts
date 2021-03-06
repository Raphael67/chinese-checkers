import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        app = await NestFactory.create(AppModule);
        await app.init();
    });

    it('/ (GET)', () => {
        return request(app.getHttpServer())
            .get('')
            .expect(200);
    });
});
