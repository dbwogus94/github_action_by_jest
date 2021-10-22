const Fn = require('./fn');
const { Obj, obj, fn1, fn2 } = Fn;

/*## 함수 export 형식에 따른 mocking 차이를 확인하기 위한 테스트
  - 동일 모듈내의 의존성이 있는 함수 테스트 할때 
  - export 방식에 따라 mocking가 재대로 동작하지 않는다.
  - 이는 jest문제가 아니라 "babel"이 자바스크립트를 컴파일하는 방식 때문이라고 한다.

  ### 상황 1 - prototype를 사용하여 함수 선언 - mocking 성공
  - 정상적으로 fn2함수가 mocking되어 fn2에 선언된 "Obj.prototype - 2"가 출력되지 않는다.
  - 그리고 mock이 호출됬는지 확인하는 테스트 함수(toBeCalled)가 정상적으로 통과한다.

  ### 상황 2 - object를 사용해 함수 선언 - mocking 성공
  - 정상적으로 fn2함수가 mocking되어 fn2에 선언된 "object - 2"가 출력되지 않는다.
  - 그리고 mock이 호출됬는지 확인하는 테스트 함수(toBeCalled)가 정상적으로 통과한다.

  ### 상황3 - 함수 선언식을 사용하여 선언 - mocking 실패
  - fn2 함수는 mocking 되었으나, 
  - "babel"이 자바스크립트를 컴파일하는 방식 때문에
  - fn1에서 호출하는 fn2가 mocking되 fn2인지 jest가 알지 못한다.
  - 때문에 fn1() 호출시 fn2() 호출되고 '2'가 출력된다.
  - 또한 mocking된 fn2가 호출되지 않았기 때문에 toBeCalled를 통과하지 못한다.

  => 즉, 상황3 처럼 export를 사용하면 내부 동작원리에 의해 
    "jest가 mocking한 fn2"와 "fn1에서 호출되는 fn2"를 동일한 함수로 인지하지 못하서, 
    재대로된 테스트를 수행 할 수 없다.

  **참고 : https://medium.com/@DavideRama/mock-spy-exported-functions-within-a-single-module-in-jest-cdf2b61af642
*/

it('상황 1 - prototype를 사용하여 함수 선언 - mocking 성공', () => {
  obj.fn2 = jest.fn();
  obj.fn1();
  expect(obj.fn2).toBeCalled();
});

it('상황 2 - object를 사용해 함수 선언 - mocking 성공', () => {
  const instance = new Obj();
  instance.fn2 = jest.fn();
  instance.fn1();
  expect(instance.fn2).toBeCalled();

  Obj.prototype.fn2 = jest.fn();
  Obj.prototype.fn1();
  expect(Obj.prototype.fn2).toBeCalled();
});

it('상황3 - 함수 선언식을 사용하여 선언 - mocking 실패', () => {
  Fn.fn2 = jest.fn();
  Fn.fn1();
  // mock 함수가 호출되지 않았음
  expect(Fn.fn2).not.toBeCalled();
  // jest는 mocking된 Fn.fn2 !== fn.fn1()에서 호출하는 fn2 다르다고 인식한다.
});
