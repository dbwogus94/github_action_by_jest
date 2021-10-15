/*  ## mock : 
### 코드 작성 순서
1. 구현해야할 목록, 함수(껍데기) 생성 
2. 통과할 단위테스트 작성
3. 실제 코드 작성
*/

const productController = require('../../controllers/products');
const { Product } = require('../../models');
const httpMocks = require('node-mocks-http');
const getJson = require('../../util.js');

// ## 테스트 데이터 파싱
const newProduct = getJson('./src/test/data/new-product.json');
const products = getJson('./src/test/data/products.json');

/* ## mock 생성
  - mock는 실재 로직에서 호출되는 함수를 가짜로 대체하는 작업이다.
  - mock으로 대체 하는 함수는 다른 계층 또는 실제 데이터에 영향을 주는 코드에 해야한다.
  - 그래서 productController.createProduct에서 호출되는 Product.create를 mock로 대체한다.

  ### mock 란?
  - 모의를 의미하며 단위 테스트를 작성할 때,
  - 해당 코드가 의존하는 부분을 모의로 만들어 대체하는 역할을 한다.
*/
Product.create = jest.fn();
Product.findAll = jest.fn();

/*## 테스트 전처리 함수 정의 : beforeAll, beforeEach
  ### beforeAll
  - 테스트가 시작되기 전 딱 한번만 실행된다.
  - 주로 전역적으로 값을 설정해야 할 때 사용한다.

  ### beforeEach
  - 테스트가 실행되기전 마다 실행되는 함수이다.
  - 이 코드에는 주로 모든 테스트에 마다 값을 새로 설정할때 사용한다.
  
  ex) 네트워크 mock 코드
  - 아래는 controller 계층에 대한 테스트이다.
  - controller 계층은 router에 의해 호출되고 인자로 http requset, response를 받는다.
  - 그렇기 때문에 아래처럼 테스트를 시작하기전에 준비 사항으로 http-mock가 필요하다.
*/
let req, res, next;
beforeEach(() => {
  // beforeEach
  // node-mocks-http를 사용하여 controller에 사용될 파라미터를 만든다.
  // 테스트 마다 만드는 이유는, 이전 테스트에 사용된 req, res 값을 사용하지 않기 위해서다.
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  // next는 에러 처리 미들웨어를 호출하는 것이기 때문에 다른 계층 mock로 대체한다.
  next = jest.fn();
});

/* ## controller.createProduct 유닛 테스트  
    1. productController.createProduct가 함수인지 확인
    2. createProduct 내부 로직 확인 1 - Product.create(mock) 호출 확인
    3. createProduct 내부 로직 확인2 - http mock을 인자로 전달, Product.create(mock) 호출 확인
    4. 성공시 201코드를 응답하는지 체크
    5. 성공시 data를 정상적으로 응답하는지 체크
    6. next를 호출하여 에러 헨들링
    7-1. (비동기) throw error 테스트 => toThrow()를 사용
    7-2. (비동기) throw error 테스트 => toThrow()를 사용하지 않는 방법
*/
describe('Product Controller Create', () => {
  // describe안에 선언된 beforeEach는 describe에 속한 테스트들이 시작되기 전마다 실행된다.
  beforeEach(() => {
    // req mock에 body 데이터 추가
    req.body = newProduct;
  });
  // 각 테스트 이후 실행
  // afterEach(() => {
  // });

  // 테스트 1) productController.createProduct가 함수인지 확인
  it('should have a createProduct function', () => {
    // 1. 구현할 함수(목록)를 정의
    // 2. 통과할 테스트 작성
    //  -> porductController.createProduct가 함수인지 테스트
    expect(typeof productController.createProduct).toBe('function');
    // 3. 테스트에 통과할 로직을 작성
    // 4. 테스트 하기 -> 통과하면 다음 단계로, 실패하면 통과할 때까지 수정
  });

  // 테스트 2) createProduct 내부 로직 확인 1 - Product.create(mock) 호출 확인
  // it('should call Product.create', () => {
  //   productController.createProduct();
  //   // productController.createProduct 실행 할때
  //   // Product.create가 호출되는지 확인
  //   // DB에 직접적인 영향을 주면 안되기 때문에
  //   // mock함수인 jest.fn()을 확인한다.
  //   expect(Product.create).toBeCalled();
  //   // 즉, 이 테스트는 Product.create 호출이 되는지 확인하는 코드이다.
  // });

  // 테스트 3) createProduct 내부 로직 확인2 - http mock을 인자로 전달, Product.create(mock) 호출 확인
  it('should call Product.create - node-mocks-http', async () => {
    // productController.createProduct에 파리미터 전달
    await productController.createProduct(req, res, next);
    // productController.createProduct가 실행 될때
    // Product.create(mock)호출 한다.
    // DB에 직접적인 영향을 받으면 안되기 때문에 mock 함수를 사용한다.
    // 호출 시 req.body를 인자로 전달한다.
    expect(Product.create).toBeCalledWith(req.body);
  });

  // 테스트 4) 성공시 201코드를 응답하는지 체크
  it('should return 201 response code', async () => {
    // productController.createProduct 실행 될 때
    await productController.createProduct(req, res, next);
    // 응답 상태 코드가 201 인지 확인
    expect(res.statusCode).toBe(201);
    // res._isEndCalled : res가 응답하고있는 값이 있으면 true, 없다면 false를 리턴한다.
    expect(res._isEndCalled()).toBeTruthy();
  });

  // 테스트 5) 성공시 data를 정상적으로 응답하는지 체크
  it('should return json body in response', async () => {
    // mock 함수가 리턴 해야하는 값을 지정한다.
    Product.create.mockReturnValue(newProduct);

    await productController.createProduct(req, res, next);

    // res의 json data가 newProduct와 일치하는지 확인( toStrictEqual : 엄격한 검사 === )
    expect(res._getJSONData()).toStrictEqual(newProduct);
  });

  // // 테스트 6) next를 호출하여 에러 헨들링
  // it('should handle errors - call next function', async () => {
  //   // 에러 정의
  //   const errorMessage = new Error('server error');
  //   // Promise.reject()를 이용하여 비동기 실패를 강제로 만든다.
  //   const rejectedPromise = Promise.reject(errorMessage);
  //   // mock 함수가 리턴 해야하는 값을 지정한다.
  //   Product.create.mockReturnValue(rejectedPromise);

  //   // http mock를 인자로 전달하고 createProduct 호출
  //   await productController.createProduct(req, res, next);
  //   // createProduct()로직에서 next 함수를 호출한다.
  //   // next 함수(mock)를 호출시 인자로 errorMessage를 전달한다.
  //   expect(nxt).toBeCalledWith(errorMessage);
  // });

  // 테스트 7-1) (비동기) throw error 테스트 => toThrow()를 사용
  it('async function throw exception test - ver 1', async () => {
    const error = new Error('server error');
    const rejectedPromise = Promise.reject(error);
    Product.create.mockReturnValue(rejectedPromise);

    await expect(productController.createProduct(req, res)).rejects.toThrow(Error); // 같은 에러 객체인지 확인
    await expect(productController.createProduct(req, res)).rejects.toThrow('server error'); // error message 까지 확인
    /*## toThrow()는 함수에만 사용이 가능하다.
      - expect(param).toThrow();를 사용하려면 param이 에러를 던지는 함수여야 한다.

      ### 비동기 함수에 사용하려면?
      1) toThrow()를 사용해야하기 때문에 expect()에 인자로 error를 내보내는 비동기 함수를 전달한다.
      2) 그리고 expect()에 await를 적용하여 비동기를 동기적으로 처리한다.
      3) 비동기 함수가 실패인 경우를 테스트 하기 위해 .rejects를 호출한다.
      4) 마지막으로 .rejects결과에 .toThrow(...)를 호출한다.

     */
  });

  // 테스트 7-2) (비동기) throw error 테스트 => toThrow()를 사용하지 않는 방법
  it('async function throw exception test - ver 2', async () => {
    const error = new Error('server error');
    const rejectedPromise = Promise.reject(error);
    Product.create.mockReturnValue(rejectedPromise); // mockRejectedValue 변경하면 비동기 에러 만들 수 있음

    // await를 비동기로 테스트 하는 방법
    try {
      await productController.createProduct(req, res);
    } catch (error) {
      // 객체는 toEqual()로 확인 하고, 값은 toBe()로 확인 한다.
      expect(error).toEqual(new Error('server error'));
      // expect(error).toThrow(Error) 사용 불가 : error는 함수가 아니기 때문에
    }

    // Promise의 catch를 비동기로 테스트 하는 방법
    return productController
      .createProduct(req, res) //
      .catch(err => expect(err).toEqual(new Error('server error')));
  });
});

/*## controller.getProducts 유닛 테스트
  1. getProdects 함수인지 테스트
  2. getProdects 내부 로직 확인 -> Product.findAll(mock) 호출 확인
  3. 성공 응답 코드 확인
  4. 성공시 응답하는 값 확인
  5. 에러 발생 테스트
 */
describe('Product Controller getProdects', () => {
  // 1) 함수인지 테스트
  it('should have a getProducts function', () => {
    expect(typeof productController.getProducts).toBe('function');
  });

  // 2) getProducts 내부 로직 확인 -> Product.findAll(mock) 호출 확인
  it('should call Product.findAll - node-mocks-http', async () => {
    await productController.getProducts(req, res, next);
    expect(Product.findAll).toBeCalled();
  });

  // 3) 성공 응답 코드 확인
  it('should return 200 response code', async () => {
    await productController.getProducts(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy(); // 응답하고 있는 값이 참인지?
  });

  // 4) 성공시 응답하는 값 확인
  it('should return json body in response', async () => {
    // mock가 응답할 데이터 지정
    Product.findAll.mockReturnValue(products); // req.body에 추가는 beforeEach에서 한다.
    await productController.getProducts(req, res, next);
    expect(res._getJSONData()).toStrictEqual(products);
  });

  // 5) 에러 발생 테스트
  it('should getProducts throw errors', async () => {
    // mock에 비동기로 에러 전달
    const rejectedPromise = Promise.reject(new Error('server error'));
    Product.findAll.mockReturnValue(rejectedPromise);

    // productController.getProducts가 던지는 오류가 Error인지 확인
    await expect(productController.getProducts(req, res)).rejects.toThrow(Error);
    // productController.getProducts가 던지는 오류의 에러와 에러 메세지 일치 확인
    await expect(productController.getProducts(req, res)).rejects.toThrow('server error');
  });
});

//jest src/test/unit/products.test.js --detectOpenHandles
