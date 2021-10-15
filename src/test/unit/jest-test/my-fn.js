'strict use';
module.exports = {
  add: (num1, num2) => num1 + num2,
  makeUser: (name, age) => ({ name, age }),
  throwError: () => {
    throw new Error('서버 에러...');
  },
  getName: callback => {
    const name = 'Mike';
    setTimeout(() => {
      callback(name);
    }, 1000);
  },
  getName_err: callback => {
    setTimeout(() => {
      const err = new Error('서버 에러...');
      callback(err);
    }, 1000);
  },
  getAge: () => {
    const age = 20;
    // promise resolve
    return new Promise((res, rei) => {
      setTimeout(() => {
        res(age);
      }, 1000);
    });
  },
  getAge_err: () => {
    // promise reject
    return new Promise((res, rei) => {
      setTimeout(() => {
        rei(new Error('서버 에러...'));
      }, 1000);
    });
  },
  // DB에 실제로 insert SQL을 요청하는 로직이라고 가정한다.
  createUser: name => {
    console.log(`실제로 DB에 user가 생성되었습니다.`);
    return { name };
  },
};
