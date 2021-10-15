/*
  ## jest에서 비동기 함수를 테스트 하는 방법
  1. callback
    - 테스트 콜백에 인자로 done를 사용한다.
    - 비동기 종료 시점에 인자로 받은 done()를 호출하여 테스트 종료를 알린다.

  2. promise
    - Promise에 return을 사용하여 Promise 함수임을 알린다.

  3. async await
    - async 키워드를 테스트 콜백 함수에 붙여서 비동기 함수임을 알린다.

  4. await promise 함수의 결과를 여러번 사용시 주의점 
 */

const fn = require('./my-fn');

describe('### jest 비동기 테스트', () => {
  it.skip('잘못된 비동기 테스트', () => {
    function callback(name) {
      expect(name).toBe('Tom');
    }
    fn.getName(callback);
    /* ### 잘못된 이유
      - jest는 기본적으로 비동기를 기다리지 않고 테스트를 끝낸다.
      - 때문에 해당 테스트는 성공으로 끝난다.
      - 게다가 getName은 3초뒤에 callback에게 naem를 전달하는데
      - 이 테스트의 실행 시간은 1ms 밖에 나오지 않는다.
    */
  });

  it('[callback]', done => {
    function callback(name) {
      expect(name).toBe('Mike');
      done();
    }
    fn.getName(callback);
    /* ### done을 사용하는 효과는?
      - jest는 기본적으로 비동기를 기다리지 않는다.
      - 하지만 테스트 함수의 인자로 done이 사용되면 다르다.
      - done() 호출될때까지 테스트를 종료하지 않고 기다린다.
      
      Q) 만약 done를 인자로 전달하고 호출하지 않는다면?
      A) jest timeout에러가 발생할 것이다.
     */
  });

  // Promise를 사용하려면 return을 붙여 Promise를 기다리게 한다.
  it('[promise] - 방법1)', async () => {
    // callback에서 결과 비교
    return fn.getAge().then(age => {
      expect(age).toBe(20);
    });
  });
  it('[promise] - 방법2)', async () => {
    // jest의 .resolves를 사용하여 결과 비교
    return expect(fn.getAge()).resolves.toBe(20);
  });

  it('[async await]', async () => {
    // return 대신 await를 사용하여 Promise를 테스트할 수 있다.
    await expect(fn.getAge()).resolves.toBe(20);
  });
});

describe('### jest 비동기 에러 테스트', () => {
  it('[callback]', done => {
    function callback(err) {
      expect(err).toBeInstanceOf(Error);
      done();
      // done를 통해 비동기 결과로 에러를 전달 받을 때까지 기다린다.
    }

    fn.getName_err(callback);
  });

  it('[promise] - 방법 1) ', () => {
    return fn.getAge_err().catch(err => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe('서버 에러...');
      expect(() => {
        // err은 이미 발생한 에러 결과이다.
        // 때문에 새로운 익명함수에서 다시 예외를 던지게 만들어야 테스트가 가능하다.
        throw err;
      }).toThrow('서버 에러...');
    });
  });

  it('[promise] - 방법 2)', () => {
    return expect(fn.getAge_err()).rejects.toThrow('서버 에러...');
  });

  it('[async await]', async () => {
    await expect(fn.getAge_err()).rejects.toThrow('서버 에러...');
  });
});

describe('### await promise 함수의 결과를 여러번 사용시 주의점', () => {
  it.skip('[Time out 발생] 성공 결과 여러번 사용', async () => {
    // 아래처럼 하면 타임아웃이 발생,
    // 당연한 이유지만 동기적으로 실행되기 때문에 여러번 호출하지 말아야 한다.
    await expect(fn.getAge()).resolves.toBeTruthy();
    await expect(fn.getAge()).resolves.toBe(20);
    await expect(fn.getAge()).resolves.not.toBe(30);
  });

  it('성공 결과 여러번 사용', async () => {
    // 성공 결과를 테스트한다.
    const res = await fn.getAge();
    expect(res).toBeTruthy();
    expect(res).toBe(20);
    expect(res).not.toBe(30);

    /* TODO: 버그인지? 아래처럼 try cath를 사용하면 실패 코드가 모두 통과한다. */
    // try {
    //   const res = await fn.getAge();
    //   console.log(res);
    //   expect(res).toBeFalsy();
    //   expect(res).toBe(2);
    //   expect(res).not.toBe(20);
    // } catch (err) {
    //   //
    // }
  });

  it.skip('[Time out 발생] 실패 결과 여러번 사용', async () => {
    // 아래처럼 하면 타임아웃이 발생,
    await expect(fn.getAge_err()).rejects.toThrow(Error);
    await expect(fn.getAge_err()).rejects.toThrow(new Error('서버 에러...'));
    await expect(fn.getAge_err()).rejects.toThrow('서버 에러...');
  });

  it('실패 결과 여러번 사용', async () => {
    // TODO: 에러 테스트는 try catch를 정상 사용가능하다.
    try {
      await fn.getAge_err();
    } catch (err) {
      expect(() => {
        throw err;
      }).toThrow();

      expect(() => {
        throw err;
      }).toThrow(new Error('서버 에러...'));

      expect(() => {
        throw err;
      }).toThrow('서버 에러...');
    }
  });
});
