// ## 구동시 init 해야하는 모듈
// process.env를 읽어서 config 정보를 가진 객체 생성
const { host } = require('./config/config');
// sequelize init + models init
const { sequelize } = require('./models');

// ## express 관련
const express = require('express');
const products = require('./routes/products');

// sequelize model이 관리하는 table drop -> create
// (async () => {
//   await sequelize.sync({ force: true });
// })();

// ### express 인스턴스 생성
const app = express();

// ## 미들웨어
app.use(express.json());

// ### 라우트 설정
app.all('/', (req, res, next) => {
  console.log('Hello World');
  res.send('Hello World');
});
app.use('/products', products);

// ### 404 처리 미들웨어
app.use((req, res, next) => {
  console.info('[라우트 없음] : ', req.url);
  res.sendStatus(404);
});

// ### 서버 에러처리 미들웨어
app.use((err, req, res, next) => {
  console.error('[server error] ', err);
  res.status(500).json({ message: 'server error' });
});

// ## 서버 리스닝
app.listen(host.port, () => {
  console.info('server listen, port :', host.port);
});

module.exports = app;
