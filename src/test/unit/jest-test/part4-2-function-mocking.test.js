/*
  ## mocking 테스트 2
  - 모듈에서 특정 함수만 mocking하여 사용하기 
  - jest.fn()을 사용

  ** 가정 
  - fn.createUser()로직은 DB와 연결되어 Insert SQL을 요청하는 로직이라고 가정한다.
  - fn.createUser()을 mock 함수로 변경했기 때문에 Insert SQL이 요청되지 않는다.
  - 즉, 테스트 격리가 된것이다.
*/
const fn = require('./my-fn');

// 모듈의 특정 함수만 mocking 한다.
fn.createUser = jest.fn();
fn.createUser.mockReturnValue({ name: 'Mike' });

it('### 함수를 mocking 하여 테스트', () => {
  const user = fn.createUser('Mike');
  expect(user.name).toBe('Mike');
});
