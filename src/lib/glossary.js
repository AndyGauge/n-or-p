// Glossary for N or P.  Reference any term from a section's body, gesture,
// or eli5 as [[term]] and it becomes a link to /glossary#term-slug.
// Keys are the display term; values are markdown definitions, or
// { definition, see: [...] } for terms with related cross-refs.

export const GLOSSARY = {
  // ─────────────────── Complexity classes ───────────────────
  'P': {
    definition: 'The class of decision problems solvable in polynomial time on a deterministic Turing machine.  "Polynomial in the input bit-length" is the working definition of *tractable*.',
    see: ['NP', 'polynomial time', 'decision problem']
  },
  'NP': {
    definition: 'The class of decision problems where a yes-answer has a polynomial-time *verifiable* certificate.  Every problem in P is in NP; whether P = NP is the central open question of computer science.',
    see: ['P', 'NP-complete', 'verifier', 'certificate']
  },
  'NP-complete': {
    definition: 'The hardest problems in NP.  A problem is NP-complete if it is in NP and every NP problem reduces to it in polynomial time.  SAT was the first, proved by Cook in 1971; Karp added twenty more in 1972.',
    see: ['NP', 'NP-hard', 'reduction', 'Cook-Levin theorem']
  },
  'NP-hard': {
    definition: 'At least as hard as every NP problem under polynomial-time reduction — but not necessarily *in* NP.  The halting problem is NP-hard but uncomputable.  Optimization versions of NP-complete decision problems are typically NP-hard.',
    see: ['NP-complete', 'reduction']
  },
  'co-NP': {
    definition: 'The mirror of NP: the class of decision problems where a *no*-answer has a polynomial-time verifiable certificate.  Tautology checking is co-NP-complete.  Whether NP = co-NP is open and widely believed false.',
    see: ['NP']
  },
  'APX': {
    definition: 'The class of NP-hard optimization problems that admit a polynomial-time constant-factor approximation.  Vertex cover (factor 2) and metric TSP (factor 3/2) are in APX.',
    see: ['approximation algorithm', 'PTAS', 'APX-hard']
  },
  'APX-hard': {
    definition: 'An optimization problem is APX-hard if no PTAS exists for it unless P = NP.  Vertex cover, metric TSP, and MAX-3SAT are APX-hard — you can approximate them within a constant factor but not arbitrarily closely.',
    see: ['APX', 'PTAS', 'PCP theorem']
  },
  'PTAS': {
    definition: 'Polynomial-Time Approximation Scheme.  A family of algorithms parameterized by ε > 0, each producing a (1 + ε)-approximation in polynomial time.  The exponent may depend on 1/ε, so tighter approximations are slower.  Euclidean TSP has a PTAS.',
    see: ['FPTAS', 'approximation algorithm']
  },
  'FPTAS': {
    definition: 'Fully Polynomial-Time Approximation Scheme.  Like a PTAS, but the running time is polynomial in both input size and 1/ε.  The gold standard of approximability.  0/1 knapsack admits an FPTAS.',
    see: ['PTAS', '0/1 knapsack']
  },
  'FPT': {
    definition: 'Fixed-Parameter Tractable.  A problem is FPT in parameter k if it is solvable in time f(k) · n^O(1) — polynomial in input size with all exponential dependence isolated in k.  Vertex cover is FPT in cover size.',
    see: ['parameterized complexity', 'treewidth', 'W[1]-hard']
  },
  'W[1]-hard': {
    definition: 'The parameterized analogue of NP-hardness.  No algorithm of the form f(k) · n^O(1) is known.  Clique parameterized by the size of the clique is W[1]-hard.',
    see: ['FPT', 'parameterized complexity']
  },
  'parameterized complexity': {
    definition: 'A complexity framework that classifies problems by a secondary parameter k in addition to input size n, asking whether the exponential cost can be confined to k.  Founded by Downey and Fellows in 1999.',
    see: ['FPT', 'treewidth']
  },
  'pseudo-polynomial': 'An algorithm whose running time is polynomial in the numeric value of an input parameter, not in the bit-length.  0/1 knapsack DP is pseudo-polynomial in the capacity W — polynomial when W is small, exponential when W is exponential in n.',
  'weakly NP-complete': {
    definition: 'NP-complete problems with pseudo-polynomial algorithms.  Tractable when the numeric parameters in the input are small.  Knapsack, subset sum, and partition are weakly NP-complete.',
    see: ['pseudo-polynomial', '0/1 knapsack', 'subset sum']
  },
  'strongly NP-complete': {
    definition: 'NP-complete problems that remain NP-complete even when all numeric inputs are bounded polynomially in the input size.  Bin packing and 3-SAT are strongly NP-complete — there is no pseudo-polynomial algorithm unless P = NP.',
    see: ['weakly NP-complete', '3-SAT', 'bin packing']
  },

  // ─────────────────── Complexity vocabulary ───────────────────
  'polynomial time': 'Running time bounded by some polynomial in the input size in bits.  The working definition of "fast" in classical complexity.  See [[P]].',
  'exponential time': 'Running time that grows as a constant raised to a polynomial in the input size.  The opposite of tractable.  Brute-force search over 2^n subsets is exponential.',
  'linear time': 'Running time proportional to the input size.  BFS, DFS, KMP, 2-SAT, topological sort, and union-find operations (amortized) all run in linear time.',
  'decision problem': 'A computational problem whose answer is yes or no.  "Does this graph contain a Hamiltonian cycle?" is a decision problem; "what is the shortest one?" is an optimization problem.',
  'optimization problem': 'A computational problem asking for the best (minimum or maximum) value of an objective over a feasible set.  Most NP-complete problems have a decision form (the textbook NP-completeness target) and an optimization form (usually NP-hard).',
  'verifier': 'An algorithm that takes a problem instance and a candidate certificate and decides in polynomial time whether the certificate proves a yes-answer.  Every NP problem has a verifier by definition.',
  'certificate': {
    definition: 'A short, polynomial-time-checkable proof that a yes-instance of an NP problem is indeed yes.  A satisfying assignment is a certificate for SAT; a Hamiltonian cycle is a certificate for Hamiltonian-cycle existence.',
    see: ['verifier', 'NP']
  },
  'reduction': {
    definition: 'A function that converts instances of problem A into instances of problem B preserving yes/no answers.  A polynomial-time reduction lets you solve A by solving B; the existence of one means A is no harder than B.',
    see: ['NP-complete', 'NP-hard']
  },
  'Cook-Levin theorem': {
    definition: 'Stephen Cook (1971) and Leonid Levin (1973) independently proved that SAT is NP-complete.  Every NP problem reduces to SAT in polynomial time.  The cornerstone result of computational complexity.',
    see: ['NP-complete', 'SAT']
  },
  'Karp\'s 21 problems': {
    definition: 'Richard Karp\'s 1972 paper *Reducibility Among Combinatorial Problems* established NP-completeness for twenty-one classic problems by reducing from SAT, including 3-SAT, clique, vertex cover, Hamiltonian cycle, knapsack, partition, graph coloring, and set cover.',
    see: ['NP-complete', 'reduction']
  },
  'PCP theorem': {
    definition: 'The Probabilistically Checkable Proofs theorem (Arora-Lund-Motwani-Sudan-Szegedy 1998, building on Arora-Safra 1992) characterizes NP via constant-query randomized verifiers.  Its main consequence is tight inapproximability bounds for many NP-hard optimization problems.',
    see: ['APX-hard', 'approximation algorithm']
  },
  'Strong Exponential Time Hypothesis': 'The conjecture that for every ε > 0 there exists k such that k-SAT cannot be solved in O((2−ε)^n) time.  Stronger than P ≠ NP; used in fine-grained complexity to prove conditional lower bounds, e.g., that no truly subquadratic edit-distance algorithm exists.',

  // ─────────────────── Boolean logic / SAT ───────────────────
  'SAT': {
    definition: 'Boolean satisfiability.  Given a propositional formula, does there exist a truth assignment that makes it true?  The first NP-complete problem (Cook 1971).  Modern CDCL solvers handle practical instances with millions of variables.',
    see: ['3-SAT', '2-SAT', 'CDCL', 'CNF', 'Cook-Levin theorem']
  },
  '2-SAT': {
    definition: 'SAT restricted to clauses of exactly two literals.  Solvable in linear time by building the implication graph and computing strongly connected components (Aspvall-Plass-Tarjan 1979).  Sits on the P side of the 2-vs-3 dividing line.',
    see: ['SAT', '3-SAT', 'strongly connected component']
  },
  '3-SAT': {
    definition: 'SAT restricted to clauses of exactly three literals.  NP-complete (Karp 1972).  The canonical reduction target for proving other problems NP-complete because of its uniform clause structure.',
    see: ['SAT', '2-SAT', 'Karp\'s 21 problems']
  },
  'k-SAT': 'SAT restricted to clauses of width at most k.  In P for k ≤ 2, NP-complete for k ≥ 3.  See [[2-SAT]] and [[3-SAT]].',
  'CNF': {
    definition: 'Conjunctive Normal Form.  A Boolean formula written as an AND of ORs of literals.  The standard input format for SAT solvers.  Every Boolean formula has an equivalent CNF (or an equisatisfiable CNF via Tseitin encoding).',
    see: ['SAT', 'DIMACS']
  },
  'DIMACS': 'The standard text file format for CNF SAT instances, named for the Center for Discrete Mathematics and Theoretical Computer Science.  Lines of integer literals terminated by 0, one clause per line.  Accepted by every modern SAT solver including [[splr]] and [[varisat]].',
  'clause': 'In Boolean logic, a disjunction (OR) of literals.  CNF formulas are conjunctions (ANDs) of clauses.',
  'literal': 'A variable or its negation in a Boolean formula.  In the clause (x ∨ ¬y), both x and ¬y are literals.',
  'implication graph': {
    definition: 'A directed graph used to decide 2-SAT.  For each clause (a ∨ b), add edges ¬a → b and ¬b → a.  The formula is satisfiable iff no variable shares an SCC with its negation.',
    see: ['2-SAT', 'strongly connected component']
  },
  'DPLL': {
    definition: 'Davis-Putnam-Logemann-Loveland (1962).  The backtracking framework underlying every modern SAT solver: assign a variable, simplify, unit-propagate, recurse, backtrack on contradiction.',
    see: ['SAT', 'CDCL']
  },
  'CDCL': {
    definition: 'Conflict-Driven Clause Learning.  The dominant SAT solver architecture since the late 1990s.  Adds learned clauses on conflict, watches literals for fast propagation, restarts periodically, branches by VSIDS heuristic.  Origin: GRASP (Marques-Silva 1996), Chaff (2001).',
    see: ['SAT', 'DPLL', 'VSIDS']
  },
  'VSIDS': 'Variable State Independent Decaying Sum.  A SAT branching heuristic that prefers variables involved in recent conflicts.  Introduced in Chaff (2001) and used in essentially every modern CDCL solver.',

  // ─────────────────── Graphs ───────────────────
  'graph': 'A set of vertices connected by edges.  Directed graphs have edges with direction; undirected graphs do not.  Weighted graphs have numeric labels on edges.',
  'DAG': {
    definition: 'Directed Acyclic Graph.  A directed graph with no cycles.  Admits a topological order.  Many NP-hard graph problems become polynomial on DAGs via dynamic programming over the topological order.',
    see: ['topological order', 'dynamic programming']
  },
  'bipartite graph': {
    definition: 'A graph whose vertices split into two sets U and V with edges only between sets.  Equivalent to having no odd cycle, equivalent to being 2-colorable.  Bipartite matching is in P even though general matching needs the blossom algorithm.',
    see: ['bipartite matching', 'matching', '2-coloring']
  },
  'spanning tree': 'A subgraph that is a tree and includes every vertex of the original graph.  Connected graphs always have at least one.',
  'minimum spanning tree': {
    definition: 'A spanning tree with the smallest possible sum of edge weights.  Computed in O(E log V) by Kruskal\'s or Prim\'s algorithm.  In P; the [[Steiner tree]] variant is NP-complete.',
    see: ['spanning tree', 'Kruskal\'s algorithm', 'Prim\'s algorithm', 'Steiner tree']
  },
  'Steiner tree': {
    definition: 'A minimum-weight tree connecting a specified subset of vertices (terminals), allowed to use other vertices (Steiner points) as relays.  NP-complete.  The MST\'s NP-complete sibling.',
    see: ['minimum spanning tree']
  },
  'vertex cover': {
    definition: 'A set of vertices touching every edge.  Minimum vertex cover is NP-complete.  Has a 2-approximation via greedy edge picking and a (1.27)^k · n FPT algorithm in cover size k.',
    see: ['independent set', 'clique', 'NP-complete']
  },
  'independent set': {
    definition: 'A set of vertices with no edges between them.  Maximum independent set is NP-complete and APX-hard — no n^{1−ε} approximation exists unless P = NP.  Complement of vertex cover: S is independent iff V\\S is a vertex cover.',
    see: ['vertex cover', 'clique']
  },
  'clique': {
    definition: 'A set of vertices all mutually adjacent.  Maximum clique is NP-complete.  S is a clique in G iff S is an independent set in the complement of G.',
    see: ['independent set', 'vertex cover']
  },
  'matching': 'A set of edges with no shared endpoints.  Maximum matching is in P for both bipartite graphs (Hopcroft-Karp) and general graphs (Edmonds blossom).  See [[bipartite matching]] and [[Edmonds blossom algorithm]].',
  'bipartite matching': {
    definition: 'Maximum matching in a bipartite graph.  In P via Hopcroft-Karp at O(E√V) or via reduction to max-flow.  The weighted version (assignment problem) uses the Hungarian algorithm at O(V³).',
    see: ['matching', 'Hopcroft-Karp', 'Hungarian algorithm', 'max-flow']
  },
  'Hamiltonian cycle': {
    definition: 'A cycle visiting every vertex of a graph exactly once.  Decision problem is NP-complete (Karp 1972).  Contrast with [[Euler circuit]] which visits every edge once and is in P.',
    see: ['Euler circuit', 'TSP', 'NP-complete']
  },
  'Euler circuit': {
    definition: 'A closed walk traversing every edge of a graph exactly once.  Exists iff the graph is connected and every vertex has even degree (Euler 1735).  Constructable in linear time by Hierholzer\'s algorithm.',
    see: ['Hamiltonian cycle', 'Hierholzer\'s algorithm']
  },
  'strongly connected component': {
    definition: 'A maximal subset of vertices in a directed graph such that every vertex can reach every other.  Computable in linear time by Tarjan\'s 1972 algorithm or Kosaraju\'s algorithm.  Key to [[2-SAT]].',
    see: ['2-SAT', 'implication graph']
  },
  'topological order': {
    definition: 'A linear arrangement of the vertices of a DAG such that every edge points forward.  Exists iff the graph is acyclic.  Computed in O(V + E) by [[Kahn\'s algorithm]] or DFS finishing times.',
    see: ['DAG', 'Kahn\'s algorithm']
  },
  'chromatic number': 'The minimum number of colors needed to properly color a graph.  Computing it is NP-hard.  See [[graph coloring]].',
  'graph coloring': {
    definition: 'Assign one of k colors to each vertex so no edge has both endpoints the same color.  In P for k ≤ 2 (bipartite testing), NP-complete for k ≥ 3.',
    see: ['chromatic number', 'bipartite graph']
  },
  '2-coloring': 'The k = 2 case of graph coloring — equivalent to bipartite testing.  Decidable in linear time by BFS.  The P side of the 2-vs-3 dividing line in coloring.',
  'treewidth': {
    definition: 'A graph parameter measuring how tree-like a graph is.  Trees have treewidth 1; series-parallel graphs have treewidth 2.  Many NP-complete problems are FPT in treewidth via dynamic programming on a tree decomposition (Courcelle\'s theorem).',
    see: ['FPT', 'parameterized complexity']
  },
  'König\'s theorem': 'In a bipartite graph, the minimum vertex cover size equals the maximum matching size (König 1931).  A structural duality unique to bipartite graphs.',
  'Matrix-Tree theorem': 'Kirchhoff (1847).  The number of spanning trees of a graph equals any cofactor of its Laplacian matrix.  Counting spanning trees is polynomial via determinant computation despite the exponential number of trees.',
  'four color theorem': 'Every planar graph is 4-colorable.  Conjectured 1852, proved by Appel and Haken in 1976 with extensive computer verification.  Planar 3-colorability, in contrast, is NP-complete (Stockmeyer 1973).',

  // ─────────────────── Flow ───────────────────
  'max-flow': {
    definition: 'The maximum rate of flow from a source to a sink in a directed graph with edge capacities.  Equal to the min-cut by the Ford-Fulkerson theorem.  Solvable in polynomial time by Edmonds-Karp (O(VE²)), Dinic (O(V²E)), or push-relabel.',
    see: ['min-cut', 'Ford-Fulkerson', 'Edmonds-Karp', 'Dinic\'s algorithm']
  },
  'min-cut': {
    definition: 'The minimum total capacity of edges whose removal disconnects source from sink in a directed graph.  Equal to max-flow.  Many image segmentation and clustering problems reduce to min-cut.',
    see: ['max-flow']
  },

  // ─────────────────── Algorithms by name ───────────────────
  'Dijkstra\'s algorithm': 'Edsger Dijkstra (1959).  Computes single-source shortest paths in a graph with non-negative edge weights in O((V + E) log V).  See [[Bellman-Ford]] for the negative-weight case.',
  'Bellman-Ford': 'Bellman (1958), Ford (1956).  Single-source shortest paths in O(VE) for graphs that may contain negative edge weights.  Detects negative cycles reachable from the source.',
  'Floyd-Warshall': 'Floyd (1962), Warshall (1962).  All-pairs shortest paths in O(V³) via three nested loops and dynamic programming over intermediate vertices.',
  'A* search': 'Heuristic shortest-path algorithm: Dijkstra biased by an admissible estimate of remaining distance.  Optimal when the heuristic never overestimates the true distance.  See [[Dijkstra\'s algorithm]].',
  'Kruskal\'s algorithm': 'MST construction by sorting edges and adding them in order, skipping those that form cycles.  O(E log V) with union-find.  See [[minimum spanning tree]] and [[union-find]].',
  'Prim\'s algorithm': 'MST construction by growing a tree from a starting vertex, always adding the cheapest edge that connects the tree to a new vertex.  O(E log V) with a heap.  See [[minimum spanning tree]].',
  'Boruvka\'s algorithm': 'MST construction (1926) where every component simultaneously selects its cheapest outgoing edge.  Naturally parallelizable; the oldest known MST algorithm.',
  'Ford-Fulkerson': 'The method of augmenting paths for computing max-flow.  Polynomial only when augmenting paths are chosen carefully — e.g., shortest by edge count, giving [[Edmonds-Karp]].',
  'Edmonds-Karp': 'Edmonds and Karp (1972).  Max-flow in O(VE²) by always augmenting along a shortest path (BFS).',
  'Dinic\'s algorithm': 'Yefim Dinic (1970).  Max-flow in O(V²E) using level graphs and blocking flows.  Faster than Edmonds-Karp on most inputs.',
  'Hopcroft-Karp': 'Hopcroft and Karp (1973).  Maximum bipartite matching in O(E√V) by finding multiple shortest augmenting paths per phase via BFS.',
  'Hungarian algorithm': 'Kuhn (1955), Munkres (1957).  Maximum-weight perfect matching in a bipartite graph (assignment problem) in O(V³).  Also called Kuhn-Munkres.',
  'Edmonds blossom algorithm': {
    definition: 'Jack Edmonds (1965).  Maximum matching in general graphs in O(V³) by contracting odd-length cycles ("blossoms") into supervertices.  Edmonds\'s paper also introduced polynomial time as the formal definition of "efficient."',
    see: ['matching', 'blossom']
  },
  'blossom': 'An odd-length cycle reached by an alternating path in matching theory.  Edmonds\'s 1965 insight: contract the blossom into a single vertex, continue the augmenting-path search, expand the blossom afterward.',
  'Tarjan SCC': 'Robert Tarjan (1972).  Linear-time algorithm for finding strongly connected components using a single DFS and a stack.',
  'Hierholzer\'s algorithm': 'Carl Hierholzer (1873).  Linear-time construction of an Euler circuit in a connected graph where every vertex has even degree.',
  'Kahn\'s algorithm': 'Topological sort by repeatedly removing source vertices with no incoming edges.  O(V + E).',
  'union-find': {
    definition: 'A data structure for maintaining disjoint sets with two operations: find (which set is this in?) and union (merge two sets).  With path compression and union by rank, both operations run in nearly constant amortized time (inverse Ackermann).',
    see: ['Kruskal\'s algorithm']
  },
  'KMP': 'Knuth-Morris-Pratt (1977).  Linear-time single-pattern string matching by precomputing the longest proper prefix that is also a suffix for each prefix of the pattern.',
  'Aho-Corasick': 'Alfred Aho and Margaret Corasick (1975).  Linear-time multi-pattern string matching by building a trie of patterns with failure links.  Implemented in the Rust [[aho-corasick]] crate.',
  'Wagner-Fischer': 'Wagner and Fischer (1974).  The O(nm) dynamic programming algorithm for computing Levenshtein edit distance.',
  'Held-Karp': 'Held and Karp (1962).  Dynamic programming for TSP and Hamiltonian cycle in O(n²·2ⁿ).  The exact algorithm of choice for n ≤ 20.',
  'Christofides algorithm': 'Nicos Christofides (1976).  3/2-approximation for metric TSP using MST, perfect matching on odd-degree vertices, and Euler-tour shortcutting.  Improved to 3/2 − ε by Karlin-Klein-Oveis Gharan in 2020.',
  'Lin-Kernighan': 'Lin and Kernighan (1973).  The state-of-the-art TSP heuristic, generalizing 2-opt to variable-depth edge swaps.  Basis of the LKH solver.',
  'Miller-Rabin': 'Probabilistic primality test (Miller 1976, Rabin 1980).  Declares a composite "probably prime" with error 4^(−k) after k random rounds.  Fast and standard in practice.',
  'AKS primality': 'Agrawal-Kayal-Saxena (2002).  The first deterministic polynomial-time primality test.  Slow in practice; superseded by Miller-Rabin or Baillie-PSW.',
  'simplex method': 'George Dantzig (1947).  The classic algorithm for linear programming.  Walks vertices of the feasible polyhedron toward better objective values.  Exponential worst case but nearly always polynomial in practice.',
  'interior-point method': 'A family of polynomial-time algorithms for LP and convex optimization that traverse the interior of the feasible region rather than vertices.  Karmarkar (1984) gave the first practical one.',
  'ellipsoid algorithm': 'Khachiyan (1979).  The first proof that LP is in P.  Too slow for practical use; superseded by interior-point methods.',
  'simulated annealing': 'Kirkpatrick-Gelatt-Vecchi (1983).  A metaheuristic that accepts worsening moves with temperature-dependent probability, cooling toward greedy descent.  No worst-case quality guarantees but empirically strong.',
  'tabu search': 'Fred Glover (1986).  A metaheuristic that maintains a memory of recently visited solutions to forbid backtracking, forcing exploration beyond local optima.',

  // ─────────────────── Optimization ───────────────────
  'LP': {
    definition: 'Linear Programming.  Optimize a linear objective over a polyhedron defined by linear inequality and equality constraints.  In P (Khachiyan 1979).  Modern solvers handle millions of variables.',
    see: ['ILP', 'simplex method', 'interior-point method']
  },
  'ILP': {
    definition: 'Integer Linear Programming.  LP with the requirement that some or all variables take integer values.  NP-complete (Karp 1972).  Practical solvers combine branch-and-bound with cutting planes.',
    see: ['LP', 'MIP', 'branch and bound', 'cutting plane']
  },
  'MIP': 'Mixed Integer Programming.  Optimization with both integer and continuous variables and linear constraints.  NP-complete.  Modern MIP solvers (HiGHS, Gurobi, CPLEX) routinely solve practical instances with hundreds of thousands of variables.  See [[ILP]].',
  'convex optimization': {
    definition: 'Minimize a convex function over a convex set.  Every local minimum is global.  Solvable in polynomial time by interior-point methods.  Includes LP, QP, SOCP, and SDP.',
    see: ['LP', 'interior-point method']
  },
  'LP relaxation': 'The LP obtained from an ILP by dropping the integrality constraints.  Solvable in polynomial time; gives a bound on the integer optimum that drives branch-and-bound.',
  'branch and bound': 'A search framework for exact solution of NP-hard optimization: explore a tree of subproblems, pruning branches whose bounds rule them out of optimality.',
  'cutting plane': 'A valid inequality added to an LP relaxation to tighten it without excluding integer-feasible points.  Gomory cuts (1958) were the first; modern MIP solvers use dozens of families.',
  'duality': 'In LP, every minimization problem has a dual maximization problem; the optima coincide (strong duality).  The duals of common combinatorial problems give certificates of optimality and structural insight (max-flow ↔ min-cut, matching ↔ vertex cover in bipartite).',
  'approximation algorithm': {
    definition: 'A polynomial-time algorithm for an NP-hard optimization problem that produces a solution within a known factor of optimal.  See [[PTAS]] and [[FPTAS]] for stronger guarantees.',
    see: ['PTAS', 'FPTAS', 'APX']
  },
  'metaheuristic': 'A general-purpose search framework — simulated annealing, tabu search, genetic algorithm, large neighborhood search — applied when exact methods, approximation algorithms, and parameterized algorithms all fail.  No worst-case quality guarantees.',
  'matroid': {
    definition: 'A set system with an exchange property: if A and B are independent and |A| > |B|, then B can be extended by an element of A.  When a problem\'s feasible sets form a matroid, the greedy algorithm is provably optimal (Edmonds 1971).',
    see: ['greedy algorithm']
  },
  'greedy algorithm': 'An algorithm that makes the locally optimal choice at each step.  Provably optimal when the underlying structure is a [[matroid]] (e.g., MST via Kruskal) or admits an exchange argument (interval scheduling, Huffman coding).',
  'dynamic programming': 'Solving a problem by combining solutions to overlapping subproblems, typically by filling a table in dependency order.  Used for shortest path on DAGs, edit distance, knapsack DP, sequence alignment, Held-Karp TSP.',

  // ─────────────────── Specific problems ───────────────────
  'TSP': {
    definition: 'Traveling Salesman Problem.  Given cities with pairwise distances, find the shortest tour visiting every city once.  Decision version NP-complete (Karp 1972).  Metric TSP admits a 3/2-approximation (Christofides 1976); Euclidean TSP admits a PTAS (Arora 1996).',
    see: ['Hamiltonian cycle', 'Christofides algorithm', 'Held-Karp']
  },
  '0/1 knapsack': {
    definition: 'Choose a subset of items, each with weight and value, totaling weight at most W and maximizing value.  Weakly NP-complete.  Pseudo-polynomial DP in O(nW); FPTAS exists.',
    see: ['knapsack', 'pseudo-polynomial', 'FPTAS']
  },
  'knapsack': 'Family of optimization problems involving packing items into a capacity.  See [[0/1 knapsack]] (NP-complete), fractional knapsack (in P via greedy), bounded and unbounded variants.',
  'subset sum': {
    definition: 'Given a multiset of integers and a target, does some subset sum to the target?  Weakly NP-complete.  Pseudo-polynomial DP in O(nS); Horowitz-Sahni meet-in-the-middle in O(2^(n/2)).',
    see: ['partition', '0/1 knapsack']
  },
  'partition': 'Given a multiset of integers, can it be split into two subsets of equal sum?  The special case of subset sum with target equal to half the total.  Weakly NP-complete.',
  'bin packing': {
    definition: 'Pack items of various sizes into the fewest bins of fixed capacity.  Strongly NP-complete.  First-Fit-Decreasing achieves 11/9 · OPT + 6/9.  Admits an APTAS.',
    see: ['First-Fit-Decreasing', 'approximation algorithm']
  },
  'First-Fit-Decreasing': 'Bin-packing heuristic: sort items descending by size, place each in the first bin that fits, open a new bin if none does.  At most 11/9 · OPT + 6/9 bins (Johnson 1973, Dósa 2007).',
  'set cover': 'Given a ground set and a collection of subsets, find the smallest subcollection whose union is the ground set.  NP-complete (Karp 1972).  Greedy gives a (1 + ln n)-approximation, which is optimal unless P = NP (Feige 1998).',
  'longest common subsequence': 'Given two strings, find the longest sequence appearing as a subsequence (not necessarily contiguous) in both.  Solvable in O(nm) DP.  No truly subquadratic algorithm exists unless [[Strong Exponential Time Hypothesis]] fails.',
  'edit distance': 'The minimum number of single-character insertions, deletions, or substitutions to transform one string into another.  Also called [[Levenshtein distance]].  Solvable in O(nm) by [[Wagner-Fischer]].',
  'Levenshtein distance': 'See [[edit distance]].  Defined by Vladimir Levenshtein in 1965.',
  'Hamming distance': 'The number of positions at which two equal-length strings differ.  The substitution-only version of edit distance.  O(n).',
  'PageRank': 'Page-Brin (1998).  Web page ranking by the principal eigenvector of a stochastic transition matrix derived from the link graph.  Computed by power iteration.  See [[power iteration]].',
  'power iteration': 'A method for computing the dominant eigenvector of a matrix by repeated multiplication and normalization.  Converges geometrically.  Underlies [[PageRank]] and many spectral methods.',
  'spectral methods': 'Algorithms that exploit the eigenvalues and eigenvectors of matrices associated with a problem — graph Laplacians, similarity matrices, transition matrices.  Includes PageRank, spectral clustering, and PCA.',

  // ─────────────────── Rust crates ───────────────────
  'petgraph': 'The dominant Rust graph crate.  Supports directed/undirected, weighted/unweighted graphs.  Algorithms include BFS, DFS, Dijkstra, Bellman-Ford, Floyd-Warshall, MST, Ford-Fulkerson, Tarjan SCC, topological sort, and matching.',
  'pathfinding': 'Rust crate offering A*, Dijkstra, BFS, DFS, IDA*, Floyd-Warshall, Edmonds-Karp, and Kuhn-Munkres assignment.  Generic over node and cost types via closures.',
  'good_lp': 'Rust LP/ILP/MIP modeling crate with swappable backends (HiGHS, CBC, microlp, SCIP).  The standard entry point for optimization modeling in Rust.',
  'highs': 'Rust bindings to the HiGHS open-source LP/MIP solver.  The recommended backend for [[good_lp]].',
  'clarabel': 'Pure-Rust interior-point solver for convex conic optimization — LP, QP, SOCP, SDP, exponential and power cones.',
  'splr': 'Pure-Rust CDCL SAT solver.  Accepts DIMACS input.  See [[CDCL]] and [[SAT]].',
  'varisat': 'Another pure-Rust CDCL SAT solver.  Library and CLI.',
  'aho-corasick': 'Rust crate for multi-pattern string matching via the Aho-Corasick automaton.  Production-grade, used internally by the regex crate.',
  'strsim': 'Rust crate exposing Levenshtein, Damerau-Levenshtein, Hamming, Jaro, Jaro-Winkler, and Sørensen-Dice string similarity metrics.',
  'nalgebra': 'General-purpose Rust linear algebra crate.  Dense and sparse, fixed-size and dynamic, with traits for the standard matrix decompositions.',
  'faer': 'High-performance Rust dense linear algebra crate.  Parallel and SIMD-aware kernels, competitive with LAPACK on large dense problems.',
  'num-prime': 'Rust crate for primality testing and integer factorization.  Exposes Baillie-PSW (default) and Miller-Rabin (configurable rounds).',
  'argmin': 'Rust optimization framework supporting first-order methods (gradient descent, L-BFGS), Newton-type methods, and several derivative-free metaheuristics.'
};
