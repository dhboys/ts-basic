const str: string = "5";
const num: number = 5;
const bool: boolean = true;
const un: undefined = undefined;
const n: null = null;
const sym: symbol = Symbol.for("abc");
const bigI: bigint = 10000000n;
const anything: any = "123";
// type 자리에 고정된 원시값을 넣을 수도 있다. (const로 선언할 경우 변경될 일이 없으므로 최대한 정확하게 사용하는 것이 좋다.)
const five: 5 = 5;

// 일반적인 함수
function normalAdd(x: number, y: number) {
  return x + y;
}

const result = normalAdd(1, 2);

// 일반적인 화살표 함수
const add: (x: number, y: number) => number = (x, y) => x + y;

// type 을 사용하면
type AddwithType = (x: number, y: number) => number;
const addWithType: AddwithType = (x, y) => x + y;

// interface를 사용하면
interface AddwithInter {
  (x: number, y: number): number;
}
const addWithInter: AddwithInter = (x, y) => x + y;

// 객체에 타입 주기
const obj: { lat: number; lon: number } = { lat: 37.5, lon: 127.5 };

// 배열에 타입 주기 (두 가지 방식)
const arrStr: string[] = ["one", "two"];
const arrNum: Array<number> = [1, 2, 3];

// tuple (고정된 자리수의 배열)
const arrTuple: [number, number, string] = [0, 1, "two"];

// 함수를 타입으로 사용할 수도 있다(심화)
function addWithFunc(x: number, y: number): number;
function addWithFunc(x: number, y: number) {
  return x + y;
}

// as
let asNum = 123;
asNum = "onetwothree" as unknown as number;

// 빈 배열 선언시 never[] 타입으로 지정되어 에러가 날 수 있음
const array: string[] = [];
array.push("string");

// pipe (' | ')
// head는 Element | null type
const head = document.querySelector("#head");
if (head) {
  head.innerHTML = "hello";
}
// 뒤에 느낌표를 붙이면 type이 Element로 확정됨
const headWithBang = document.querySelector("#head")!;
// ! 방식보단 if 방식을 사용하는 것이 안전하다 (위의 예시 참고 .59)

// type 정교화를 위한 type 만들기
type World = "world" | "hell";
const specificType: World = "world";
type Greeting = `hello ${World}`;

// 아래 코드에 값을 할당할 때 Greeting type을 추론하여 typescript가 값을 추천해준다.
const sayWhat: Greeting = "hello hell";

// array 관련 rest 매개변수
function rest(a: number, ...args: string[]) {
  console.log(a, args); // 1, ['2', '3']
}
rest(1, "2", "3");

// enum: 여러 값들을 하나의 상수로 사용하고 싶을 때 사용 -> JS로 변환시 사라짐
// 값을 할당 안해주면 0,1,2 .. , num, str .. 다 지정 가능
const enum EDirection {
  Up,
  Down,
  Left,
  Right,
}

// enum 처럼 객체를 사용하고 싶다면.. as const (readonly)
// as const를 사용 안하려면 type으로 0,1,2,3을 정확하게 지정해주어야한다.
// 정확한 타입을 지정하지 않으면 number 타입으로 추론해버린다.
const ObjDirection = {
  Up: 0,
  Down: 1,
  Left: 2,
  Right: 3,
} as const;

// enum은 직접 타입으로 사용 가능하지만 객체를 사용하려면 type 정의를 해주어야한다.
type Direction = typeof ObjDirection[keyof typeof ObjDirection];
function run(dir: Direction) {}
run(ObjDirection.Right);

// 위 코드 분석
const objWithKey = { a: "123", b: "hello", c: "world" } as const;
type Key = keyof typeof objWithKey; // "a" |"b" | "c"
type Value = typeof objWithKey[keyof typeof objWithKey]; // "123" |"hello" | "world"
// 즉, objWithKey 객체의 value들을 type으로 사용할 수 있다.

// type과 interface로 type 선언하기
type typeA = { a: string };
const aWithType: typeA = { a: "hello" };

interface typeA2 {
  a: string;
}
const aWithInter: typeA2 = { a: "hello" };

// interface 확장
interface AnimalType {
  breath: true;
}

interface MammalType extends AnimalType {
  breed: true;
}
const tiger: MammalType = { breath: true, breed: true };

// interface는 여러개 선언 가능 (& 로 묶임)
interface Acting {
  talk: () => void;
}

interface Acting {
  walk: () => void;
}

interface Acting {
  sleep: () => void;
}
// 하나라도 구현 안하면 타입 에러
const todo: Acting = { talk() {}, walk() {}, sleep() {} };

/**
 * union과 intersection ( |, & )
 */

// union: 하나의 속성만 있어도 된다.
type ObjWithUnion = { hello: "world" } | { dongho: "yoon" };
const objUnion: ObjWithUnion = { hello: "world", dongho: "yoon" };

// intersection: 모든 속성이 다 있어야한다.
type ObjWithIntersection = { hello: "world" } & { dongho: "yoon" };
const objIntersection: ObjWithIntersection = { hello: "world", dongho: "yoon" };

// Example (type 상속과 유사)
type Animal = { breath: true };
type Mammal = Animal & { breed: true };
type Human = Mammal & { think: true };

const me: Human = { breath: true, breed: true, think: true };
