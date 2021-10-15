/*
  ## mocking 테스트 3
  - 모듈 전체를 mocking 하여 테스트
  - jest.mock(moduleName) 사용 

  ** 가정 
  - fn.createUser()로직은 DB와 연결되어 Insert SQL을 요청하는 로직이라고 가정한다.
  - fn 모듈에 선언된 모든 함수가 mocking 된다.
  - 즉, 테스트 격리가 된것이다.
*/
const fn = require('./my-fn');

// ./my-fn을 mocking 한다.
jest.mock('./my-fn'); // 어디에 선언되든 가장 먼저 실행된다.
fn.createUser.mockReturnValue({ name: 'Mike' });

it('### 모듈을 mocking 하여 테스트', () => {
  const user = fn.createUser('Mike');
  expect(user.name).toBe('Mike');
});

/* ## jest.mock('./my-fn');에 대하여
   1. jest.mock은 어디에 선언하든 가장 먼저 실행된다.

   2. jest.mock()는 인자로 module의 경로를 받는다.
   - 즉, 모듈을 새로 import 하여도 그 모듈은 mocking된 모듈이다.
   ex)
    const fn = require('./my-fn');    // mocking된 모듈이다.
    const fn2 = require('./my-fn');   // mocking된 모듈이다.
    jest.mock('./my-fn');

   3. mocking된 모듈은 일반적으로 해제하고 원래 모듈로 복원하지 못한다.
   - jest에는 restoreMocks() 메서드가 정의되어 있다.
   - API를 확인하면 "mocking된 mock를 원래 상태로 복원한다"고 설명되어 있다.
   - 하지만 이 메서드를 사용할 수 있는 mock는 jest.spyOn()를 사용하여 mocking된 mock 뿐이다.
 */
