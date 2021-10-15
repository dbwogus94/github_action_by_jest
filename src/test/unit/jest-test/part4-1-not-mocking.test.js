/*
  ## mocking 테스트 1 
  - mocking을 사용하지 않는 경우

  ** 가정 
  - fn.createUser()로직은 DB와 연결되어 Insert SQL을 요청하는 로직이라고 가정한다.
  - 그렇기 때문에 아래처럼 mocking하지 않고 fn.creatUser()을 사용 테스트하면
  - DB Insert SQl이 요청되어 user 테이블에 데이터가 추가된다.
  - 이 경우 테스트 격리가 되지 않았기 때문에
  - 생성된 User 데이터를 삭제 하거나, Rallback해야한다.
*/

const fn = require('./my-fn');

test('### mocking을 하지 않고 테스트', () => {
  const user = fn.createUser('Mike');
  expect(user.name).toBe('Mike');
});
