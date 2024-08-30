import { Result, makeFailure, makeOk, bind, either, isFailure } from "../lib/result";

/* Library code */
const findOrThrow = <T>(pred: (x: T) => boolean, a: T[]): T => {
    for (let i = 0; i < a.length; i++) {
        if (pred(a[i])) return a[i];
    }
    throw "No element found.";
}

export const findResult: <T>(pred: (x: T) => boolean, a: T[]) => Result<T> =
    <T>(pred: (x: T) => boolean, a: T[]) =>
        a.reduce((acc, curr) => acc = (pred(curr) && isFailure(acc)) ? makeOk(curr) : acc,
            makeFailure<T>("No element found."));

/* Client code */
const returnSquaredIfFoundEven_v1 = (a: number[]): number => {
    try {
        const x = findOrThrow(x => x % 2 === 0, a);
        return x * x;
    } catch (e) {
        return -1;
    }
}

export const returnSquaredIfFoundEven_v2: (a: number[]) => Result<number> =
    (a: number[]) => bind<number, number>(findResult(x => x % 2 === 0, a), x => makeOk(x * x));

export const returnSquaredIfFoundEven_v3: (a: number[]) => number =
    (a: number[]) => either<number, number>(findResult(x => x % 2 === 0, a), x => x * x, () => -1);
