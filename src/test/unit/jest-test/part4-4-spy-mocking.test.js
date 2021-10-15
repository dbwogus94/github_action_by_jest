/*
  ## mocking 테스트 4
  - 모듈의 특정 함수를 스파이(spy) mock으로 mocking 한다.
  - jest.spyOn(mudule, 'functionName')를 사용

  ** 가정 
  - fn.createUser()로직은 DB와 연결되어 Insert SQL을 요청하는 로직이라고 가정한다.
  - spy mock과 mockReturnValue()를 사용하여 mocking 한다.
  - spy mock과 mockReturnValue()를 사용하면 테스트 격리를 할 수 있다.

  Q) spy mock이란?
  A) 스파이 mock는 이름 그대로 스파이의 역할을 수행하는 mock 함수이다.
    - spy mock이 mocking한 함수는 일반적인 mock함수와 다르게 실제로 실행된다.
    - spy mock은 함수의 실행을 감시한다.
    - spy mock은 함수가 실행됬는지, 결과는 무엇인지, 몇번 실행됬는지 등을 감시한다.
    - spy mock는 기본적으로 mocking한 함수를 실행하지만 mockReturnValue()을 사용하여 
      결과값을 지정하면 함수 자체를 일반적인 mock처럼 실행을 가짜로 대체할 수 있다.
    - 또한 다른 mock 함수와는 다르게 spy mock는 mocking을 해제 하여 복원할 수 있다.
  
*/
const fn = require('./my-fn');

let spyMock;
beforeEach(() => {
  // ## fn.createUser함수를 spy mock로 만들기
  spyMock = jest.spyOn(fn, 'createUser');
});

afterEach(() => {
  // ## spy mock 완전 초기화
  spyMock.mockRestore();

  /* ### jest mock 초기화 함수
    1. spyMock.mockClear(): 
      - 테스트 실행에 사용된 mock 실행 정보(calls, results 등) 초기화
    2. spyMock.mockReset(): 
      - 내부적으로 mockClear()를 호출
      - 추가로 jest.fn(param)에 전달된 param을 undefined로 초기화 한다.
    3. spyMock.mockRestore(): 
      - 내부적으로 mockReset() 호출
      - 추가로 spy mock함수를 mocking하기 전으로 원복한다.
      - 가장 완벽한 초기화 방법이지만 spy mock에만 사용이 가능하다.
  */
});

describe('## sqy mocking 테스트', () => {
  /* ## spy mock는 기본적으로 테스트 격리가 되지 않는다.
    - spy mock는 기본적으로 함수 호출을 막지 않는다.
    - 이름처럼 "스파이"하게 동작한다. 
      - spy mock 함수가 호출은 됬는지?
      - spy mock 함수가 몇번 호출됬는지? 
      - param은 어떤것을 받았는지?

    ## mockReturnValue()을 사용하면 테스트 격리가 된다.
    - spy mock은 mocking한 함수의 호출을 막지 않기 때문에 테스트가 격리적으로 동작하지 않는다.
    - 하지만 mockReturnValue() 사용해 결과 값을 설정하면 상황은 달라진다.
    - spy mock에 mockReturnValue()를 사용한 이후 호출은 일반 mock 함수와 똑같이 동작하게 된다.
    - 즉 원래의 함수를 호출하지 않고, mock함수가 호출되어 테스트 격리가 가능해진다.
    
    ## mockReturnValue()사용한 spy mock를 초기화 하고 싶다면 mockRestore()으로만 초기화 할 수 있다.
    - spy mock에 mockReturnValue()를 사용한 후 적용을 취소하고 싶다면,
      => mockReturnValue()를 한번 적용하면 전역적으로 적용된다.
    - mockRestore()을 사용하여 spy mock를 원래의 함수로 원복하고,
    - 복원된 함수를 다시 spy mock로 설정하는 방법 밖에 없다.
  */
  describe('### 실제 fn.createUser을 호출되지 않고 mock이 호출되는 경우 - 테스트 격리 O', () => {
    it('spy mocking 함수 호출 됬다.', () => {
      spyMock.mockReturnValue({ name: 'Mike' }); // spy mock에 결과 지정, 더 이상 원래 함수를 호출 하지 않게 된다.
      fn.createUser('Mike');
      expect(fn.createUser).toBeCalled();
    });

    it('spy mocking 함수가 1번 호출 됬다', () => {
      spyMock.mockReturnValue({ name: 'Mike' });
      fn.createUser('Mike');
      expect(fn.createUser).toBeCalledTimes(1);
    });

    it('spy mocking 함수에 마지막 인자로 "Mike"가 들어왔다', () => {
      spyMock.mockReturnValue({ name: 'Mike' });
      fn.createUser('Mike');
      expect(fn.createUser).lastCalledWith('Mike');
    });

    it('생성된 유저의 name은 "Mike"이다', () => {
      spyMock.mockReturnValue({ name: 'Mike' });
      const user = fn.createUser('Mike');
      expect(user.name).toBe('Mike');
    });
  });

  describe('### 실제 fn.createUser가 호출된 경우 - 테스트 격리 x', () => {
    // 해당 영역에 테스트는 모두 테스트 격리가 되지 않았다.
    // 때문에 "실제로 DB에 user가 생성되었습니다."라는 log가 계속 출력된다.
    it('spy mocking 함수 호출 됬는가?', () => {
      fn.createUser('jay');
      expect(fn.createUser).toBeCalled();
    });

    it('spy mocking 함수가 1번 호출 됬다', () => {
      fn.createUser('jay');
      expect(fn.createUser).toBeCalledTimes(1);
    });

    it('spy mocking 함수에 마지막 인자로 "jay"가 들어왔다', () => {
      fn.createUser('jay');
      expect(fn.createUser).lastCalledWith('jay');
    });

    it('생성된 유저의 name은 "jay"이다', () => {
      const user = fn.createUser('jay');
      expect(user.name).toBe('jay');
    });
  });
});

it('## spy mocking된 함수를 복원하여 원본으로 테스트', () => {
  spyMock.mockReturnValue({ name: 'Mike' });
  const user1 = fn.createUser('Mike');
  expect(fn.createUser).toBeCalled();
  expect(user1.name).toBe('Mike');

  // spyMock을 해지 원복한다.
  spyMock.mockRestore();

  const user2 = fn.createUser('Mike');
  //expect(fn.createUser).toBeCalled();  // mock함수가 아니기 때문에 mock 전용 테스트 함수를 사용할 수 없다.
  expect(user2.name).toBe('Mike');
});
