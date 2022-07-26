/**
 * interface와 type의 차이
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
 * type checker
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
