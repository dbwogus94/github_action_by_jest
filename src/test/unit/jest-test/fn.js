'use strict';
/*
  **참고 : https://medium.com/@DavideRama/mock-spy-exported-functions-within-a-single-module-in-jest-cdf2b61af642
  
  ## 동일 모듈내의 의존성이 있는 함수 테스트시 주의점 테스트

  ### 공통 로직
  - 아래 "fn1"이름을 가진 함수는 "fn2"이름을 가진 
    함수를 호출하는 의존관계를 가진다.

  ### 테스트 시나리오  
  1. jest의 mock기능을 사용하여 fn2를 mocking한다.
  2. 그리고 fn1을 호출한다. 
  3. 이후 mocking된 fn2이 호출됬는지 테스트 함수 "toBeCalled"로 확인한다.
  
  => 정상적인 로직 : 통과
    - fn1에서 fn2를 호출한다. 
    - fn2는 mocking 되었기 때문에 원래 fn2는 호출되지 않고
      mocking된 mock함수가 호출된다.
    - mock함수가 호출됬는지 확인하는 toBeCalled 테스트는 통과한다.

  => 모두 통과하는게 당연하다고 생각했는데 
    아래 상황1, 2, 3중 마지막 방법은 통과하지 않는다.
    이는 jest문제가 아니라 "babel"이 자바스크립트를 컴파일하는 방식 때문이라고 한다.

  상황 1 - prototype를 사용하여 함수 선언
  - Obj의 prototype에 "fn"과 "f2"를 선언하였다.
  - 성공

  상황 2 - object를 사용해 함수 선언
  - 객체 obj의 property로 "fn1"과 "fn2"를 선언
  - 성공

  상황3 - 함수 선언식을 사용하여 선언 
  - 모듈의 전역에 "fn1"과 "fn2"를 선언
  - 실패
*/

// ### 클래스(prototype)에 메서드로 선언
function Obj() {
  this.name = '이름';
}
Obj.prototype.fn1 = function (name) {
  console.log('Obj.prototype - 1');
  this.fn2();
};
Obj.prototype.fn2 = function (name) {
  console.log(`Obj.prototype - 2`);
};

// ### obj의 property로 함수 선언
const obj = {
  fn1: function () {
    console.log('object - 1');
    this.fn2();
  },
  fn2: function () {
    console.log('object - 2');
  },
};

// ### 모듈의 전역에 함수로 선언
function fn1() {
  console.log('1');
  fn2();
}
function fn2() {
  console.log('2');
}

module.exports = { Obj, obj, fn1, fn2 };
