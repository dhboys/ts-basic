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
