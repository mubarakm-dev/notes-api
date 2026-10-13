import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { TransformInterceptor } from './../src/common/transform/transform.interceptor';
import { HttpExceptionFilter } from './../src/common/http-exception/http-exception.filter';

describe('Notes (e2e)', () => {
  let app: INestApplication<App>;
  const testEmail = `e2e-${Date.now()}@example.com`;
  const testPassword = 'Password123!';
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(new TransformInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /auth/signup creates a new user', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: testEmail, password: testPassword })
      .expect(201);
  });

  it('POST /auth/login returns a token', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: testEmail, password: testPassword })
      .expect(201);

    token = response.body.data.token;
    expect(token).toBeDefined();
  });

  it('GET /notes without a token returns 401', () => {
    return request(app.getHttpServer()).get('/notes').expect(401);
  });

  it('POST /notes with a valid token creates a note', () => {
    return request(app.getHttpServer())
      .post('/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'E2E Test Note', body: 'Created during e2e test' })
      .expect(201)
      .expect((res) => {
        expect(res.body.data.title).toBe('E2E Test Note');
      });
  });

  it('GET /notes with a valid token returns the created note', async () => {
    const response = await request(app.getHttpServer())
      .get('/notes')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.data.length).toBeGreaterThan(0);
  });
});
