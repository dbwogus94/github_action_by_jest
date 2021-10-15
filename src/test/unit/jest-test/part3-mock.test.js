/*
  ## mock function - 1. 기본 mock 함수 jest.fn 사용하기
  * mockfn = jestfn();

  1. mockfn.mock.calls
  - mock 함수의 호출 정보를 가지고 있다.

  2. mockfn.mock.results
  - mock 함수의 실행 결과를 가지고 있다.

  3. jest.fn() 활용해보기 - 미구현된 로직을 mock을 사용하여 테스트

  4. mockfn.mockResolvedValue VS mockfn.mockRejectedValue 사용
  - mockResolvedValue: Promise 성공 결과를 가진다.
  - mockRejectedValue: Promise 실패 결과를 가진다.


  5. mock전용 테스트 함수
  - toBeCalled(): mock 함수가 호출되었는가?
  - toBeCalledTimes(num): num번 호출 되었는가?
  - toBeCalledWith(param): 호출된 mock중 인자로 param을 받은 함수가 있는가?
  - lastCalledWith(param): 마지막 mock 호출에 사용된 인자가 param과 일치하는가?
*/

/*### mockFn.mock.calls
- mock 함수의 호출 정보를 가지고 있다.
- log : [ [ '한번 호출' ], [ '두번 호출' ], [ '세번 호출' ] ] 
*/
const mockFn = jest.fn();
describe('### [jestfn().mock.calls] 호출 정보 확인', () => {
  mockFn('한번 호출');
  mockFn('두번 호출');
  mockFn('세번 호출');

  //console.log(mockFn.mock.calls);
  test('mock 함수가 3번 호출 되었습니다.', () => {
    expect(mockFn.mock.calls.length).toBe(3);
  });

  test('2번째로 호출된 mock함수는 인자가 존재 합니다.', () => {
    expect(mockFn.mock.calls[1][0]).toBeTruthy();
  });
});

/*### mockfn2.mock.results
- mock 함수의 실행 결과를 가지고 있다.
- log :
[
  { type: 'return', value: 11 },
  { type: 'return', value: 21 },
  { type: 'return', value: 31 }
]
*/
const mockFn2 = jest.fn(num => num + 1);
describe('### [jestfn().mock.results] 실행 결과 확인', () => {
  mockFn2(10);
  mockFn2(20);
  mockFn2(30);
  //console.log(mockfn2.mock.results);
  it('인자로 받은 10에서 1 증간한 값이 반환된다.', () => {
    expect(mockFn2.mock.results[0].value).toBe(11);
  });
  it('인자로 받은 20에서 1 증간한 값이 반환된다.', () => {
    expect(mockFn2.mock.results[1].value).toBe(21);
  });
  it('인자로 받은 30에서 1 증간한 값이 반환된다.', () => {
    expect(mockFn2.mock.results[2].value).toBe(31);
  });
});

/*
  ## jest.fn() 활용해보기 - 미구현된 로직을 mock을 사용하여 테스트

  ### 시나리오 
  - 주어진 정수 배열에서 홀수만 리턴하는 로직을 테스트 한다.
  - 테스트를 수행하기 위해 홀수일때 true를 리턴하는 "isOdd" 함수가 있어야 한다. 
  - 하지만 아직 "isOdd" 함수는 미구현 상태이다.
  - 이때 테스트를 테스트를 위해 "isOdd"를 mock 함수로 대체한다.

  1. mock함수 정의
  - "isOdd" 함수를 mock로 jest.fn()을 사용하여 mock를 만든다.
  
  ** 홀수 짝수 로직을 미구현된 복잡한 로직이나, 
    테스트 격리를 해치는 로직이라고 생각하자.

  2. mockReturnValueOnce()를 사용하여 중간값 설정
  - mock 함수가 리턴할 중간 값을 설정하는데 사용한다.

  3. mockReturnValue()를 사용하여 최종값 설정
  - mock 함수가 리턴할 최종 값을 설정하는데 사용한다.

*/
describe('### jest.fn() 활용', () => {
  // 테스트에 입력 값
  const input = [1, 2, 3, 4, 5];
  // 테스트 결과 값
  const output = [1, 3, 5];
  // 1. mock함수 정의
  const isOdd = jest.fn();

  it('### 배열에서 홀수만 리턴', () => {
    // 2. 3. input 데이터에 따른 mock의 결과값 설정 - isOdd.mock.results에 설정됨
    isOdd //
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)
      .mockReturnValue(true);

    // 테스트 수행
    const result = input.filter(num => isOdd(num));
    expect(result).toStrictEqual(output);
    // 배열을 동등 비교시는 StrictEqual을 사요해야한다.
  });
});

/*
  ### mockResolvedValue vs mockRejectedValue 사용
 
 */
const mockFn3 = jest.fn();
describe('### mockResolvedValue VS mockRejectedValue 사용', () => {
  beforeEach(() => {
    mockFn3.mockReset();
  });

  it('[mockResolvedValue] promise then으로 확인', () => {
    mockFn3.mockResolvedValue({ name: 'Mike' });
    // promise then은 return을 빼면 오류를 잡지 못함
    return mockFn3().then(res => {
      expect(res.name).not.toBe('jay');
    });
  });

  it('[mockResolvedValue] awiat로 확인', async () => {
    mockFn3.mockResolvedValue({ name: 'Mike' });
    await expect(mockFn3()).resolves.toStrictEqual({ name: 'Mike' });
  });

  it('[mockRejectedValue] 발생한 에러 확인', async () => {
    mockFn3.mockRejectedValue(new Error());
    await expect(mockFn3).rejects.toBeInstanceOf(Error);
    // .rejects를 통해 받아오는 실패 결과는 에러 객체 그 자체이다.
    // 즉, throw된 에러이다.
  });

  it('[mockRejectedValue] 어떤 에러가 발생하는지 테스트', async () => {
    mockFn3.mockRejectedValue(new Error('서버 에러...'));
    try {
      await mockFn3();
    } catch (error) {
      expect(() => {
        throw error;
      }).toThrow(new Error('서버 에러...'));
      // promise에서 발생하는 throw 자체를 테스트 하려면
      // 위 처럼 error객체를 다시 던지는 익명함수를 만들어서 테스트 해야한다.

      /* TODO: 
        ".toThrow('서버 에러')"형식은 감지하지 못 한다. 
        의도한 것인지 버그인지 알 수 없기 때문에 
        새로운 에러 객체를 선언(new Error('서버 에러'))하여 사용 해야한다.
      */
    }
  });
});

describe('mock전용 테스트 함수', () => {
  let mockfn4;
  beforeEach(() => {
    mockfn4 = jest.fn();
  });

  it('[toBeCalled] - 호출 되었는가?', () => {
    mockfn4();
    expect(mockfn4).toBeCalled();
  });

  it('[toBeCalledTimes] - 3번 호출 되었는가?', () => {
    mockfn4();
    mockfn4();
    mockfn4();
    expect(mockfn4).toBeCalledTimes(3);
  });

  it('[toBeCalledWith] - mock.calls의 item중 [10, 20]이 있는가?', () => {
    mockfn4(10, 20);
    mockfn4();
    mockfn4(30, 40);
    expect(mockfn4).toBeCalledWith(10, 20);
  });

  it('[toBeCalledWith] - mock.calls의 마지막 item이 [30, 40]인가?', () => {
    mockfn4(10, 20);
    mockfn4();
    mockfn4(30, 40);
    expect(mockfn4).lastCalledWith(30, 40);
  });
});
