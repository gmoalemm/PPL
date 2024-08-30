import * as R from "ramda";

const stringToArray = R.split("");

/* Question 1 */
export const countVowels: (s: string) => number = (s: string) =>
    (stringToArray(s.toLowerCase()).filter((x) => (x === 'a' || x === 'e' || x === 'i' || x === 'o' || x === 'u')).length);

/* Question 2 */
export const isPaired: (s: string) => boolean = (s: string) =>
    stringToArray(s)
        .filter((x: string) => ['(', '[', '{', ')', ']', '}'].includes(x))  // make an array of brackets
        .reduce((stack: string[], curr: string) =>
            ['(', '[', '{'].includes(curr) ?
                stack.concat([curr]) : // if the current bracket is an opening bracket, add it to the stack
                (stack.length > 0 && ['()', '[]', '{}'].includes(stack.slice(-1)[0].concat(curr))) ? // is the current closing bracket matches the last opening bracket?
                    stack.slice(0, -1) : ['*'], []) // if so, discard them both, otherwise - signal that the string is not paired
        .length === 0;  // if we did not discard all of the brackets, then the string is not paired!

/* Question 3 */
export type WordTree = {
    root: string;
    children: WordTree[];
}

export const treeToSentence: (treeRoot: WordTree) => string =
    (treeRoot: WordTree) => (
        // use recursion to traverse in a pre-order traversal: 
        // first comes the root (as the initial current value), 
        // then the sentences that the children represent.
        treeRoot.children.reduce(
            (acc: string, curr: WordTree) => acc.concat(" ".concat(treeToSentence(curr))),
            treeRoot.root)  // add a space after each word
    );
