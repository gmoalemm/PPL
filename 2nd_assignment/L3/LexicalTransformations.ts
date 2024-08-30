import { ClassExp, ProcExp, Exp, Program, Binding, makeIfExp, parseL3CExp, makeBoolExp, AppExp, isAppExp, CExp, makeVarDecl, isExp, isClassExp, makeProgram, makeStrExp, makeAppExp, isDefineExp, isCExp, makeDefineExp, isAtomicExp, isLitExp, isIfExp, isLetExp, isProcExp, makeLetExp, makeBinding } from "./L3-ast";
import { Result, isOk, makeFailure, makeOk } from "../shared/result";
import { isProgram, parseL3, makeProcExp } from "../L3/L3-ast";
import { is, map } from "ramda";
import { allT } from "../shared/list";
import { valueToString } from "./L3-value";

/*
Purpose: Transform ClassExp to ProcExp
Signature: class2proc(classExp)
Type: ClassExp => ProcExp
*/
export const class2proc = (exp: ClassExp): ProcExp =>{
    const reversedMethods = exp.methods.slice().reverse();
    const nestedIfs = reversedMethods.reduce((acc: CExp, method) => 
        makeIfExp(createPredicate(method.var.var), makeAppExp(method.val, []), acc), makeBoolExp(false));
    const nestedProc = makeProcExp([makeVarDecl("msg")], [nestedIfs]);
    return makeProcExp(exp.fields, [nestedProc]);
}

const createPredicate = (mname: string): CExp =>
{
    const prog = parseL3(`(L3 (eq? msg '${mname}))`);

    return (isOk(prog) && isProgram(prog.value) && isAppExp(prog.value.exps[0])) 
        ? prog.value.exps[0] : makeBoolExp(false);
}

/*
Purpose: Transform all class forms in the given AST to procs
Signature: lexTransform(AST)
Type: [Exp | Program] => Result<Exp | Program>
*/

export const lexTransform = (exp: Exp | Program): Result<Exp | Program> =>
    isExp(exp) ? makeOk(rewriteAllClassExp(exp)) :
    isProgram(exp) ? makeOk(makeProgram(map(rewriteAllClassExp, exp.exps))) :
    makeFailure("Never");

const rewriteAllClassExp = (exp: Exp): Exp =>
    isCExp(exp) ? rewriteAllClassCExp(exp) :
    isDefineExp(exp) ? makeDefineExp(exp.var, rewriteAllClassCExp(exp.val)) :
    exp;

const rewriteAllClassCExp = (exp: CExp): CExp =>
    isAtomicExp(exp) ? exp :
    isLitExp(exp) ? exp :
    isIfExp(exp) ? makeIfExp(rewriteAllClassCExp(exp.test),
                             rewriteAllClassCExp(exp.then),
                             rewriteAllClassCExp(exp.alt)) :
    isAppExp(exp) ? makeAppExp(rewriteAllClassCExp(exp.rator),
                               map(rewriteAllClassCExp, exp.rands)) :
    isProcExp(exp) ? makeProcExp(exp.args, map(rewriteAllClassCExp, exp.body)) :
    isClassExp(exp) ? rewriteAllClassCExp(class2proc(exp)) :
    isLetExp(exp) ? makeLetExp(map((b: Binding) => makeBinding(b.var.var, rewriteAllClassCExp(b.val)), exp.bindings), map(rewriteAllClassCExp, exp.body)) :
    exp;

