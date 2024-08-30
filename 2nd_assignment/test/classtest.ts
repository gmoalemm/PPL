import { expect } from 'chai';
import { evalL3program } from '../L3/L3-eval-env';
import { SExpValue, Value, isSExp, valueToString } from "../L3/L3-value";
import { Result, bind, isOk, makeOk, makeFailure } from "../shared/result";
import { isClassExp, isProgram, parseL3, parseL3Exp, unparseL3 } from "../L3/L3-ast";
import { parse as p, isSexpString, isToken, isCompoundSexp } from "../shared/parser";
import { class2proc, lexTransform } from '../L3/LexicalTransformations';


const evalP = (x: string): Result<Value> =>
    bind(parseL3(x), evalL3program);

const prog = parseL3(`(L3 
    (define pi 3.14)
    (define square (lambda (x) * x x))
    (define circle
        (class (x y radius)
            (
                (area (lambda () (* (square radius) pi)))
                (perimeter (lambda () (* (pi) radius))
            )
    )))
    (define c (circle 0 0 3))
    (c 'area)
)`)

const trans = bind(prog, lexTransform);

if (isOk(trans) && isProgram(trans.value)){
    evalL3program(trans.value)
}

