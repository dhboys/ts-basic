/**
 *
 * interface와 type의 차이
 *
 */

// inter - 같은 이름의 interface를 사용 가능
interface Inter {
  a: string;
}
interface Inter {
  b: string;
}
const objInter: Inter = { a: "hello", b: "world" };

// type - 같은 이름의 type 사용 불가
type T = { a: string };
type T2 = { b: string };
const objType: T = { a: "hello " };
const objType2: T2 = { b: "world" };

/**
 * 객체리터럴의 잉여속성 검사
 */
// type을 붙인 변수에 직접 객체리터럴을 넣으면 type이 맞지 않을 때 에러발생
// but, 중간에 다른 변수를 끼면 에러 발생 X

interface EtcInter {
  a: string;
}
// const objEtcInter: EtcInter = {a:"hello", b: 'world'}   // Error
const objEtcInter = { a: "hello", b: "world" };
const objEtcInterWithType = objEtcInter; // Error 발생 X

/**
 * void 타입
 */

// 함수에서 return이 undefined를 제외하고는 없어야한다.
function voidFunc(): void {
  return undefined;
}

const execVoidFunc = voidFunc();

/**
 * void 의 3가지 종류
 */

// 1. return 값이 void -> return 값이 있으면 안된다,

// 2. 매개변수의 void 함수가 들어간 함수 -> return 값이 있어도 된다 -> 여기서 void는 매개변수의 return 값을 사용하지 않겠다는 의미
function paramVoidFunc(callback: () => void): void {}
paramVoidFunc(() => {
  return "possible";
});

// 3. 메서드의 void가 들어간 함수 -> return 값이 있어도 된다. -> 여기서 void는 메서드의 return 값을 사용하지 않겠다는 의미
interface HumanForVoid {
  talk: () => void;
}

const human: HumanForVoid = {
  talk() {
    return "possible";
  },
};

const execHuman = human.talk(); // return type은 void가 된다 -> return 값을 신경쓰지 않겠다는 의미이므로..

/**
 *
 * void와 undefined type 에 차이 + declare로 함수를 타입만 사용할 수 있다.
 *
 */

// forEach 함수 return에 undefined type을 주면 push는 number를 return 하므로 에러 발생
// but, void로 선언하여도 에러 발생 X -> 매개변수에서 사용하는 void는 return 값을 상관하지 않겠다는 의미이므로..
declare function forEach(arr: number[], callback: (el: number) => void): void;
let target: number[] = [];
forEach([1, 2, 3], (el) => target.push(el));

/**
 * type을 모를 땐 unknown type
 */

// Example: error는 unknown type 이라 Error 라고 지정 필요
try {
} catch (error) {
  (error as Error).message;
}

/**
 * type 가드
 */
function numOrStr(a: number | string) {
  // typescript는 모든 상황을 다 고려하므로 type 가드를 해주어야 한다.
  if (typeof a === "string") {
    a.split(",");
  } else {
    a.toFixed(1);
  }
  // boolean은 올 수 없는 것까지 추론해준다.
  // if (typeof a === "boolean") {
  //   a.toString();
  // }
}
numOrStr("123");
numOrStr(1);

function numOrNumArray(a: number | number[]) {
  if (Array.isArray(a)) {
    // number[]
    a.concat(4);
  } else {
    // number
    a.toFixed(3);
  }
}
numOrNumArray(123);
numOrNumArray([1, 2, 3]);

// class는 그 자체로 type이 될 수 있다.
class A {
  a() {}
}

class B {
  b() {}
}

// class를 type 가드 하는 방법은 instanceof 사용
function aOrB(param: A | B) {
  if (param instanceof A) {
    param.a();
  }
  if (param instanceof B) {
    param.b();
  }
}
// param으로 들어오는 것은 클래스 자체가 아닌 인스턴스를 의미
aOrB(new A()); // aOrB(A) -> class를 넣으면 에러 발생
aOrB(new B());

/**
 *
 * type checker
 *
 */

// 객체간의 type 구별법 -> 내부 속성으로 구별 가능
type BForCheck = { type: "b"; bbb: string };
type CForCheck = { type: "c"; ccc: string };
type DForCheck = { type: "d"; ddd: string };

// 내부 속성의 값으로 구별하는 방법
function typeCheckWithValue(alpha: BForCheck | CForCheck | DForCheck) {
  // type 안에 프로퍼티를 통해 타입 추론을 해준다.
  if (alpha.type === "b") {
    alpha.bbb;
  } else if (alpha.type === "c") {
    alpha.ccc;
  } else {
    alpha.ddd;
  }
}

// 내부 속성으로 구별하는 방법 -> in 연산자 사용 -> deepdive 19.13.1 에서 확인 가능
// in 연산자 대신 Reflect.has 사용 가능 (ES6)
function typeCheckWithProp(alpha: BForCheck | CForCheck | DForCheck) {
  // type 안에 프로퍼티를 통해 타입 추론을 해준다.
  if ("bbb" in alpha) {
    alpha.type;
  } else if ("ccc" in alpha) {
    alpha.ccc;
  } else if (Reflect.has(alpha, "ddd")) {
    alpha.ddd;
  }
}

/**
 * 일반적으로 내부 속성의 값으로 구별하는 방법을 많이 사용하므로 typescript 사용을 위해 객체를 만들 때 type 속성을 넣어주는 습관 !
 */

// Example
const dogEx = { type: "dog", name: "mung" };
const catEx = { type: "cat" };

// 내부 속성으로 구별하려면 각자 특징이 있는 속성을 활용
const dogAct = { bow(): void {} };
const catAct = { meow(): void {} };

/**
 * return 값에서 사용하는 'is' -> custom type 가드 함수 만들 때 사용
 */

interface Cat {
  meow: number;
}
interface Dog {
  bow: number;
}
// type을 구분해주는 커스텀 함수를 직접 만들 수 있다 -> is 사용
function catOrDog(animal: Cat | Dog): animal is Dog {
  // 타입 판별하는 로직
  if ((animal as Cat).meow) {
    return false;
  }
  return true;
}
// catOrDog 함수를 이용하여 type check 하거나 prop을 통해 type check
function pet(param: Cat | Dog) {
  if (catOrDog(param)) {
    console.log(param.bow);
  }
  if ("meow" in param) {
    console.log(param.meow);
  }
}

/**
 *
 *  Promise 타입에 관한 설명
 *
 */

// Promise -> Pending -> Settled(Resolved, Rejected);
// promise의 성공, 실패 여부 상관 없이 settled가 된다.
// Ex. promises.then().catch() 에서
// then과 catch 모두 settled이고 그 중 then 은 Resolved, catch는 Rejected 이다.
// type 에서는 PromiseSettledResult에 PromiseRejectedResult와 PromiseFulfilledResult가 있다.

// custom type guard Example -> is 가 붙으면 type guard
const isRejected = (
  input: PromiseSettledResult<unknown>
): input is PromiseRejectedResult => input.status === "rejected";
const isFulfilled = <T>(
  input: PromiseSettledResult<T>
): input is PromiseFulfilledResult<T> => input.status === "fulfilled";

const promises = await Promise.allSettled([
  Promise.resolve("a"),
  Promise.resolve("b"),
]);
// success 한 것과 errors 인 것만 받고 싶을 때 type guard 사용
const success = promises.filter(isFulfilled);
const errors = promises.filter(isRejected);
// type guard를 사용하지 않고
// const errors = promises.filter((promise) => promise.status === 'rejected');
// 를 사용하여도 PromiseSettledResult type으로 추론

export {};

/**
 * 읽기 전용
 */
interface ReadOnlyInter {
  readonly a: string;
  b: string;
}
const readOnlyObj: ReadOnlyInter = { a: "hello", b: "world" };
// readOnlyObj.a = '변경불가'

/**
 * indexed signiture - 모든 속성의 타입을 통일해서 사용하고 싶을 때 사용
 */
type IndexedSigNum = { [key: string]: number };
const indexedNum: IndexedSigNum = { a: 3, b: 4, c: 5 };

// key에 제한을 줄 수도 있다. (mapped type)
type Gender = "Male" | "Female" | "Bi";
type GenderObj = { [key in Gender]: number };
const indexedNumGen: GenderObj = { Male: 1, Female: 2, Bi: 3 };

/**
 *
 * class와 interface 관계
 *
 */

interface Level {
  readonly high: string;
  middle: string;
  low: string;
}

class People implements Level {
  high: string = "high"; // private high: string 으로 지정하면 내부에서만 사용 가능
  middle: string = "middle"; // protected middle: string 으로 지정하면 상속 받은 class에서도 사용 가능
  public low: string = "low"; // public -> 인스턴스에서도 사용 가능
}

// 추상 클래스 구현 가능
abstract class AbClass {
  private readonly should: string = "should";

  abstract method(): void;
}

// abstract method는 반드시 구현해야 한다.
class ExClass extends AbClass {
  method(): void {}
}

/**
 *
 *
 * optional type (있어도 되고 없어도 된다.)
 *
 *
 */
function optionFunc(a: number, b?: number, c?: number): void {}
optionFunc(1);
optionFunc(1, 2);
optionFunc(1, 2, 3);

// 만약 전부다 받고 싶다면..
function allArgsFunc(...args: number[]) {}
allArgsFunc(1, 2, 3, 4, 5, 6);

/**
 *
 *
 * generic - type을 변수처럼 만들어주는 형식 -> 만들 때 type을 정하지 않고 사용할 때 type을 정한다.
 *
 *
 */
function genericFunc<T extends string | number>(x: T, y: T): void {}
genericFunc(1, 2);
genericFunc("1", "2");

// type 추론을 못하면 직접 넣어줄 수 있다 -> type parameter 문법
genericFunc<string>('1', '2')

// parameter에 각각 다른 type 제한을 줄 수 도 있다.
function genericFuncWithDiffType<T extends string, K extends number>(
  x: T,
  y: K
): void {}

genericFuncWithDiffType("1", 2);

// Example - forEach 함수와 map 함수
interface Array<T> {
  forEach(callbackfn: (value: T, index: number, array: T[]) => void,thisArg?: any): void;
  map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): U[];
}

// forEach 예시
const numArr: Array<number> = [1, 2, 3]
numArr.forEach((value) => { console.log(value)});  // 1, 2, 3
['1', '2', '3'].forEach((value) => { console.log(value)}); // '1', '2', '3'
['123', 123, true].forEach((value) => { console.log(value)})  

// map 예시
// T는 number로 추론하고 map 함수에서 callback 함수의 return 값이 U이고 item.toString()이 callback 함수의 return 값이므로 U: string으로 추론된다.
const strings = [1, 2, 3].map((item) => item.toString())  // ['1', '2', '3']  string[]
const numbers = [1, 2, 3].map((item) => item + 1 ); //  [2, 3, 4] number[]
