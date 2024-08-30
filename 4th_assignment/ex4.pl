/*
 * **********************************************
 * Printing result depth
 *
 * You can enlarge it, if needed.
 * **********************************************
 */
maximum_printing_depth(100).

:- current_prolog_flag(toplevel_print_options, A),
   (select(max_depth(_), A, B), ! ; A = B),
   maximum_printing_depth(MPD),
   set_prolog_flag(toplevel_print_options, [max_depth(MPD)|B]).


edge(a,b). %e1
edge(a,c). %e2
edge(c,b). %e3
edge(c,a). %e4

path(Node1, Node2, Path) :- edge(Node1, Node2), Path = [Node1, Node2].                              %p1
path(Node1, Node2, Path) :- edge(Node1, Node3), path(Node3, Node2, Path1), Path = [Node1 | Path1].  %p2

% Signature: cycle(Node, Cycle)/2
% Purpose: Cycle is a cyclic path, denoted a list of nodes, from Node1 to Node1.

cycle(Node, Cycle) :- path(Node, Node, Cycle).




% Signature: reverse(Graph1,Graph2)/2
% Purpose: The edges in Graph1 are reversed in Graph2

reverse([], []).
reverse([[X, Y] | R1], [[Y, X] | R2]) :- reverse(R1, R2).






% Signature: degree(Node, Graph, Degree)/3
% Purpose: Degree is the degree of node Node, denoted by a Church number (as defined in class)

degree(A, [], zero).
degree(A, [[X | Y] | R], D) :- X \= A, degree(A, R, D).
degree(A, [[A | Y] | R], s(D)) :- degree(A, R, D).
