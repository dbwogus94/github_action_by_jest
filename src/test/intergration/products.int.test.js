// 네트워크 요청을 생성하는 모듈
const request = require('supertest');
const { app, server } = require('../../app');
const getJson = require('../../util.js');
const { sequelize } = require('../../models');

// sequelize 테이블 자동 생성 옵션
const autoCreateDB = async () => {
  await sequelize.sync({ force: true });
};

// 테스트 데이터 파싱
const newProduct = getJson('./src/test/data/new-product.json');

// 테스트 시작시 : autoCreateDB 호출
beforeAll(async () => {
  await autoCreateDB();
});

// 테스트 종료시 : 서비스 종료
afterAll(async () => {
  // sequelize 종료
  await sequelize.close();
  if (app) {
    // 서버 종료
    server.close();
  }
});

// #통합 테스트 정의

// ## POST /products 테스트
describe('POST /products', () => {
  // ### POST /products 성공 요청
  it('should request POST /products by success', async () => {
    // 요청에 대한 응답 생성
    const response = await request(app).post('/products').send(newProduct);

    // 결과 테스트
    expect(response.statusCode).toBe(201);
    expect(response.body.name).toBe(newProduct.name);
    expect(response.body.description).toBe(newProduct.description);
  });

  // ### 실패 요청 테스트
  it('should return 500 on POST /products', async () => {
    const response = await request(app) //
      .post('/products')
      .send({ name: 'description 제외하고 보내기' });

    // 응답 에러 상태 코드 테스트
    expect(response.statusCode).toBe(500);
    // 응답 body 테스트
    expect(response.body).toStrictEqual({
      message: 'server error',
    });
  });
});

// ## GET /products
describe('GET /products', () => {
  it('should request GET /products by success', async () => {
    const response = await request(app).get('/products');
    expect(response.statusCode).toBe(200);
    expect(response.body[0].name).toBe(newProduct.name);
    expect(response.body[0].description).toBe(newProduct.description);
  });
});
