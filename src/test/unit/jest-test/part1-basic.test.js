/*
## 기본 테스트 함수 테스트

1. 비교에 사용되는 테스트 함수
- toBe(): 값 비교
- toEqual(): 객체 비교
- toStrictEqual(): 엄격한 객체 비교

2. null, undefined, defined 판별
- toBeNull()
- toBeUndefined()
- toBeDefined()

3. toBeTruthy() vs toBeFalsy()
- toBeTruthy() 
  : true로 판별되는 값인 경우에 테스트 통과
- toBeFalsy()
  : false로 판별되는 값인 경우에 테스트 통과

4. 숫자, 큰숫자, 실수 크기 비교 
- toBeGreaterThan(number | bigint) : 크다
- toBeGreaterThanOrEqual(number | bigint) : 크거나 작다
- toBeLessThan(number | bigint) : 작다
- toBeLessThanOrEqual(number | bigint) : 작거나 같다

5. 부동소수점 동등 비교 
- toBeCloseTo(number, numDigits)

6. 정규식 테스트
- toMatch(RegExp)

7. 배열의 원소 존재 유무 확인
- toContain(item)

8. 에러 발생 테스트
- toThrow()
- toThrowError()
*/

const { not } = require('expect');
const fn = require('./my-fn');

/* ## toBe
  - 단순 값 비교에 사용된다. */
describe('### tobe()를 사용하여 값 비교', () => {
  it('1은 1이야', () => {
    expect(1).toBe(1);
  });

  it('2 더하기 3은 5야', () => {
    expect(fn.add(2, 3)).toBe(5);
  });

  it('3 더하기 3은 5가 아니다', () => {
    expect(fn.add(3, 3)).not.toBe(5);
  });
});

/* ## toEqual()
  - 객체를 비교에 사용된다.
  - 내부적으로 재귀를 사용하여 검사한다.
 */
describe('### toEqual()을 사용하여 객체 비교', () => {
  const testName = '를 사용하여 객체 비교';
  it.skip(`[toBe]${testName}`, () => {
    expect(fn.makeUser('Mike', 30)).toBe({
      name: 'Mike',
      age: 30,
    });
  });

  it(`[toEqual]${testName}`, () => {
    expect(fn.makeUser('Mike', 30)).toEqual({
      name: 'Mike',
      age: 30,
    });
  });

  it(`[toEqual]를 사용하여 배열비교`, () => {
    expect([1, 2, 3]).toEqual([1, 2, 3]);
  });
});

/* ## toStrictEqual
  - 엄격한 객체 비교
  - 객체에 필드에 값이 정의되어 있는지까지 판별한다.
    (js에서는 값이 정의되어 있지 않음을 나타낼때 undefined를 할당한다.)

  ** toEqual vs to toStrictEqual
  - toEqual: 필드가 undefined라면 해당 필드가 없는 것으로 판별한다.
  - toStrictEqual: 필드 undefined라면 필드가 있다고 판별한다.
 */
describe('### toStrictEqual을 사용한 객체 비교', () => {
  const testName = 'undefined가 포함된 객체 비교';
  it(`[toEqual] ${testName}`, () => {
    expect(fn.makeUser('Mike', 30)).toEqual({
      name: 'Mike',
      age: 30,
      gender: undefined, // null를 넣는 경우는 실패
      // toEqual()는 필드는 있지만 값이 undefined인 객체와,
      // 필드 자체가 없는 객체를 비교하면 같다고 판별한다.
    });
  });

  it.skip(`[toStrictEqual] ${testName}`, () => {
    expect(fn.makeUser('Mike', 30)).toStrictEqual({
      name: 'Mike',
      age: 30,
      gender: undefined,
      // toStrictEqual()는 필드는 있지만 값이 undefined인 객체와,
      // 필드 자체가 없는 객체를 비교하면 다르다고 판별한다.
    });
  });
});

/*
  ## toBeNull()
  ## toBeUndefined()
  ## toBeDefined()
*/
describe('### null, undefined 테스트', () => {
  it('[toBeNull]로 null값 테스트', () => {
    // 0, ''은 null으로 판별하지 않는다.
    expect('').not.toBeNull();
    expect(0).not.toBeNull();

    expect(null).toBeNull();
  });

  it('[toBeUndefined]로 undefined 테스트', () => {
    // 0, ''은 undefined으로 판별하지 않는다.
    expect('').not.toBeUndefined();
    expect(0).not.toBeUndefined();

    expect(undefined).toBeUndefined();
  });

  it('[toBeDefined]로 undefined가 아닌 값 테스트 ', () => {
    expect('').toBeDefined();
    expect(0).toBeDefined();
    expect(null).toBeDefined();

    // undefined만 toBeDefined에서 실패한다.
    expect(undefined).not.toBeDefined();
  });
});

/* 
  ## toBeTruthy() : true로 판별되는 값인 경우 통과 
  ## toBeFalsy():  false로 판별되는 값인 경우에 테스트 통과 
*/
describe('### toBeTruthy() vs toBeFalsy()', () => {
  describe('- toBeTruthy() 테스트', () => {
    it('true is true?', () => {
      expect(true).toBeTruthy();
    });
    it('"true" is true?', () => {
      expect('true').toBeTruthy();
    });
    it('"0" is true?', () => {
      expect('0').toBeTruthy();
    });
    it('"null" is true?', () => {
      expect('null').toBeTruthy();
    });
    it('"undefinde" is true?', () => {
      expect('undefinde').toBeTruthy();
    });
  });

  describe('- toBeFalsy() 테스트', () => {
    it('false is false?', () => {
      expect(false).toBeFalsy();
    });
    it('0 is false?', () => {
      expect(0).toBeFalsy();
    });
    it('null is false?', () => {
      expect(null).toBeFalsy();
    });
    it('undefined is false?', () => {
      expect(undefined).toBeFalsy();
    });
    it('NaN is false?', () => {
      expect(NaN).toBeFalsy();
    });
  });
});

/*
  ### toBeGreaterThan(number | bigint) : 크다
  ### toBeGreaterThanOrEqual(number | bigint) : 크거나 작다
  ### toBeLessThan(number | bigint) : 작다
  ### toBeLessThanOrEqual(number | bigint) : 작거나 같다
  
  - 범위 비교 테스트 함수는 숫자, 큰 숫자, 부동소수점 비교를 모두 지원한다.
  - 소수점은 제한 없이 가능한 것 같음(10자리 까지 테스트 했음)
 */
describe('### 범위 함수(초과, 이상, 미만, 이하) 테스트', () => {
  it('id는 3자리 이상 20자리 이하 입니다.', () => {
    const id = 'testerId';
    expect(id.length).toBeLessThanOrEqual(20);
    expect(id.length).toBeGreaterThanOrEqual(3);
  });

  it('password는 10자리 미만의 입니다.', () => {
    const password = '1234!';
    expect(password.length).toBeLessThan(10);
  });

  it('content는 3자리 이상 입력해야 합니다.', () => {
    const content = 'hello world';
    expect(content.length).toBeGreaterThan(3);
  });
  describe('- 소수를 범위 함수로 비교', () => {
    it('[toBeGreaterThan] 0.3 초과', () => {
      expect(0.4).toBeGreaterThan(0.3);
    });
    it('[toBeGreaterThanOrEqual] 0.3 이상', () => {
      expect(0.3).toBeGreaterThanOrEqual(0.3);
    });
    it('[toBeLessThan] 0.3 미만', () => {
      expect(0.2).toBeLessThan(0.3);
    });
    it('[toBeLessThanOrEqual] 0.3 이하', () => {
      expect(0.3).toBeLessThanOrEqual(0.3);
    });
  });
});

/*
  ### toBeCloseTo(number, numDigits)
  - 부동 소수점 동등 비교에 사용된다.
  - 파라미터 
    number : 비교할 소수
    numDigits : 확인할 자릿수 제한 -정밀도, default: 2 
*/
describe('### 부동소수점 동등비교', () => {
  it('[toBeCloseTo] 동등성 비교', () => {
    expect(0.1 + 0.4).toBeCloseTo(0.5);
    // 통과: numDigits의 기본값은 2이다.
    // 즉, 소수점 2자리까지만 비교
    expect(0.10001).toBeCloseTo(0.1);
    // 실패: 소수점 5자리까지 비교
    expect(0.10001).not.toBeCloseTo(0.1, 5);
  });
});

/* 
  ### toMatch(RegExp)
  - 정규식 사용한 테스트
  - not 사용 불가
*/
describe('[toMath] 정규식 테스트 함수 사용', () => {
  it('영문자만 일치', () => {
    const str = 'abcXYX';
    expect(str).toMatch(/^[a-zA-Z]*$/);
    expect(str).toMatch(/^[a-z]*$/i);
    //expect('a1b2c3X4Y5X').toMatch(/^[a-zA-Z]*$/);
  });

  it('숫자(문자열)만 일치', () => {
    const str = '1234';
    expect(str).toMatch(/^[0-9]*$/);
    expect(str).toMatch(/^\d*$/);
  });

  it('영어 숫자(문자열)만 일치', () => {
    const str = 'a1b2c3X4Y5X';
    expect(str).toMatch(/^[a-zA-Z0-9]*$/);
    expect(str).toMatch(/^[a-z0-9]*$/i); // i: 영어 대소문자 구분x

    //expect(str).toMatch(/^\w*$/i);
    // \w는 63개의 문자 일치 => 영어(52) + 숫자(10) + _(언더바) 허용
  });

  it('영어 숫자 특수문자(_~!@#$%^&*?)만 일치', () => {
    const str = '_$a%1&~b2*c3?^X4Y5X!@#';

    expect(str).toMatch(/^[A-Za-z0-9_~!@#$%^&*?]*$/);
    expect(str).toMatch(/^[a-z\d_~!@#$%^&*?]*$/i);
    // 숫자: \d, 'i'플래그: 영어 대소문자 구분x
    expect(str).toMatch(/^[\w_~!@#$%^&*?]*$/);
    // _(언더바)포함이기 때문에 \w 사용가능
  });

  it('한글만 일치', () => {
    const str = 'ㄱㄴㄷ안녕하세요ㅣㅑㅔㅓ';
    expect(str).toMatch(/^[ㄱ-ㅎㅏ-ㅣ가-힣]*$/);
    // [ㄱ-힣] 사용 x
  });
});

/*
  ### toContain(item)
  - 배열의 item 존재 유무 확인
*/
describe('배열의 item 존재 유무 테스트', () => {
  it('[toContain] 유저 리스트에 Mike가 존재한다', () => {
    const user = 'Mike';
    const userList = ['Tom', 'Kim', 'Mike', 'Bob'];
    expect(userList).toContain(user);
  });
});

/* 
  ### toThrow(), 
  - 에러 발생 테스트
  ### toThrowError()
  - toThrow와 동일

  ** 주의! 
  - toThrow()함수는 검사하는 대상 함수가 호출시 에러를 내보내는지 검증하는 테스트이다.
  - 그렇기 때문에 toThrow() 함수는 이미 발생한 에러를 검증하지 못한다.
  - 즉, 미래에 에러를 던지는 함수를 expect에 인자로 전달해야한다.
    
  - 잘못된 방법 
    : expect(fn.throwError()).toThrow()       // 함수가 실행되어 테스트 하지 못함.
  - 잘된 방법
    : expect(fn.throwError).toThrow()         // 실행하지 않은 함수 자체를 전달
    : expect(() => fn.throwError).toThrow()   // 익명함수로 한번 감싸서 전달
 */
describe('에러 발생 테스트', () => {
  it('[toThrow]', () => {
    // 기본 Error 객체를 검증
    expect(fn.throwError).toThrow();
    // 에러 타입을 전달하여 검증
    expect(fn.throwError).toThrow(Error);
    // 에러 객체와 에러 message까지 검증
    expect(fn.throwError).toThrow(new Error('서버 에러...'));
    // 에러 message 검증
    expect(fn.throwError).toThrow('서버 에러...');

    // not 사용 가능함
    expect(fn.throwError).not.toThrow('서버 Error...');
  });
  it('[toThrowError]', () => {
    // 기본 Error 객체를 검증
    expect(fn.throwError).toThrowError();
    // 에러 타입을 전달하여 검증
    expect(fn.throwError).toThrowError(Error);
    // 에러 객체와 에러 message까지 검증
    expect(fn.throwError).toThrowError(new Error('서버 에러...'));
    // 에러 message 검증
    expect(fn.throwError).toThrowError('서버 에러...');
  });
});
