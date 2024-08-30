import { treeToSentence, WordTree } from "../Assignment1/src/part2/part2";

const t1: WordTree = {root:"hello", children:[{root: "world", children:[]}]}
console.log('"' + treeToSentence(t1) + '"');