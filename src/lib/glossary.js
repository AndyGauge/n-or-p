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
  'argmin': 'Rust optimization framework supporting first-order methods (gradient descent, L-BFGS), Newton-type methods, and several derivative-free metaheuristics.',
  'itertools': 'Rust crate that extends the standard [[Iterator]] trait with combinators that did not make the cut for std — \`.permutations()\`, \`.combinations()\`, \`.cartesian_product()\`, \`.unique()\`, \`.zip_eq()\`, \`.chunks()\`, and dozens more.',
  'rayon': 'Rust data-parallelism crate.  Provides \`par_iter\`, \`par_sort\`, and other parallel counterparts to the standard iterator methods.  Work-stealing scheduler under the hood.',
  'rand': 'The standard Rust random-number generation crate.  Provides RNG traits, several PRNG implementations, distributions, and seeding utilities.',
  'serde': 'Rust\'s de-facto serialization framework.  Defines the \`Serialize\` and \`Deserialize\` traits, with derive macros that wire up JSON, CBOR, MessagePack, and dozens of other formats.',
  'thiserror': {
    definition: 'A Rust crate that derives \`std::error::Error\` and the formatting boilerplate from a custom error enum.  The library-friendly companion to ad-hoc error types.',
    see: ['Error trait', 'anyhow']
  },
  'anyhow': 'A Rust crate for ergonomic dynamic error handling in application code.  Provides one error type (\`anyhow::Error\`) that wraps anything implementing \`std::error::Error\`.  Pair with [[thiserror]] for libraries.',

  // ─────────────────── Rust language fundamentals ───────────────────
  'ownership': {
    definition: 'Rust\'s core memory-management rule: every value has exactly one owner, and when the owner goes out of scope the value is dropped — memory freed, file handles closed, locks released.  No garbage collector required.',
    see: ['borrow', 'move semantics', 'Drop']
  },
  'borrow': {
    definition: 'Temporary access to a value without transferring ownership.  Written \`&T\` for a [[shared reference]] (read-only) or \`&mut T\` for an [[mutable reference]] (exclusive).  The compiler tracks the lifetime of every borrow.',
    see: ['ownership', 'reference', 'borrow checker']
  },
  'borrow checker': {
    definition: 'The part of the Rust compiler that enforces the borrowing rules at compile time: at any moment a value may have any number of shared borrows OR exactly one exclusive borrow, never both.  "Fighting the borrow checker" is the universal Rust-learner experience.',
    see: ['borrow', 'ownership', 'lifetime']
  },
  'reference': 'A non-owning pointer to a value.  Comes in two forms — [[shared reference]] (\`&T\`) and [[mutable reference]] (\`&mut T\`).  The compiler tracks how long each one is valid.',
  'shared reference': {
    definition: '\`&T\`: a read-only borrow.  Many shared references to the same value can coexist.  Implements [[Copy]], so passing one around does not consume it.',
    see: ['mutable reference', 'borrow']
  },
  'mutable reference': {
    definition: '\`&mut T\`: an exclusive borrow that permits mutation.  At most one can exist for a given value at a time.  Not [[Copy]] — passing it consumes the borrow.',
    see: ['shared reference', 'borrow']
  },
  'move semantics': {
    definition: 'In Rust, assigning or passing a non-[[Copy]] value transfers ownership rather than copying.  After \`let b = a;\`, \`a\` is no longer usable.  Move is the default; copy requires opting in via [[Copy]].',
    see: ['ownership', 'Copy', 'Clone']
  },
  'Copy': {
    definition: 'A marker [[trait]] for types whose bytes alone are the entire value — no heap to share, no invariant to maintain.  Assignment and parameter passing copy bytes instead of moving ownership.  Implemented by all integer, float, bool, char types; \`&T\` references; tuples of Copy types.  Not implemented by \`String\`, \`Vec\`, \`Box\`, anything with [[Drop]].',
    see: ['Clone', 'move semantics', 'Drop']
  },
  'Clone': {
    definition: 'A [[trait]] for types that can be explicitly duplicated via \`.clone()\`.  Unlike [[Copy]], cloning may run code (allocate, copy heap data, bump a refcount).  Every \`Copy\` type is also \`Clone\`, but not vice versa.',
    see: ['Copy', 'move semantics']
  },
  'Drop': {
    definition: 'A [[trait]] for types with cleanup logic that runs automatically when the owner goes out of scope.  Implementing \`Drop\` makes the type non-[[Copy]].  Used by \`Vec\`, \`String\`, \`File\`, \`MutexGuard\`, and anything owning a non-trivial resource.',
    see: ['Copy', 'ownership']
  },
  'lifetime': {
    definition: 'The compile-time span during which a [[reference]] is valid.  Lifetimes are part of the type system but erased at runtime — they exist only to let the compiler verify that references never outlive what they borrow from.',
    see: ['lifetime parameter', 'lifetime elision', "'static"]
  },
  'lifetime parameter': {
    definition: 'An explicit named lifetime in angle brackets, e.g. \`<\'a>\`.  Treated by the compiler exactly like a [[generic]] type parameter, on the lifetime axis instead of the type axis.  Convention puts lifetimes before types: \`fn f<\'a, T>(...)\`.',
    see: ['lifetime', 'lifetime elision', 'generic']
  },
  'lifetime elision': {
    definition: 'The compiler\'s rules for inferring lifetime parameters when they are not written.  Most function signatures involving references do not need explicit lifetimes because the elision rules cover them.',
    see: ['lifetime', 'lifetime parameter']
  },
  "'static": {
    definition: 'The lifetime that covers the entire run of the program.  String literals, \`const\` items, and leaked heap allocations all have \`\'static\` lifetime.  Also appears as a bound (\`T: \'static\`) meaning "the type contains no shorter-lifetime references."',
    see: ['lifetime']
  },
  'non-lexical lifetimes': 'Rust\'s modern borrow checker (NLL, stabilized 2018) ends borrows at their last use rather than at the end of the lexical scope.  Lets you write \`let r = &v; use(r); v.push(x);\` — the shared borrow ends after \`use(r)\`, so mutating \`v\` afterward is fine.  See [[borrow checker]].',
  'interior mutability': 'A pattern for mutating data through a [[shared reference]] using runtime-checked types like \`Cell\`, \`RefCell\`, \`Mutex\`, or \`RwLock\`.  Necessary when ownership rules are too strict for a specific structure (e.g., graphs with cycles).  See [[Cell]] / [[RefCell]].',

  // ─────────────────── Rust type system ───────────────────
  'generic': {
    definition: 'A type or function parameterized over one or more types or lifetimes.  Written with angle brackets: \`fn f<T>(x: T) { ... }\`.  Resolved at compile time via [[monomorphization]] — each concrete instantiation produces its own copy of the code.',
    see: ['trait bound', 'turbofish', 'monomorphization']
  },
  'trait': 'Rust\'s interface mechanism — a named set of methods (and associated types/constants) a type can implement.  Traits enable polymorphism without inheritance.  Defined with \`trait Name { ... }\`, implemented with \`impl Name for Type { ... }\`.',
  'trait bound': {
    definition: 'A constraint on a [[generic]] parameter requiring it to implement specific [[trait]]s.  Written \`<T: Clone>\` (inline) or in a [[where clause]].  Compose bounds with \`+\`: \`<T: Clone + Debug>\`.',
    see: ['generic', 'where clause', 'impl Trait']
  },
  'where clause': 'Syntax for placing trait bounds after a function signature instead of inline.  \`fn f<T>() where T: Clone + Debug { ... }\`.  Preferred for many or long bounds.  See [[trait bound]].',
  'impl Trait': {
    definition: 'Syntax meaning "some type implementing this trait."  In argument position (\`fn f(x: impl Display)\`) it is sugar for an anonymous generic.  In return position (\`fn g() -> impl Iterator\`) it is an opaque type — the compiler picks the concrete type, the caller only sees the trait.',
    see: ['trait bound', 'generic']
  },
  'turbofish': {
    definition: 'The \`::<T>\` syntax used to specify [[generic]] type parameters at a callsite when [[type inference]] cannot figure them out — \`"42".parse::<i32>()\`, \`Vec::<u8>::new()\`.  Named for the fish-like shape \`::<>\`.',
    see: ['generic', 'type inference']
  },
  'type inference': 'The compiler\'s process of deducing type information that the programmer left out.  Rust\'s inference is largely local — it works within a function and from explicit type signatures, but does not propagate across function boundaries.  See [[turbofish]] for when inference needs a hint.',
  'never type': {
    definition: '\`!\`, the type with no values — a function returning \`!\` never returns.  Coerces into any other type, which is why \`panic!()\`, \`todo!()\`, \`return\`, \`break\`, and \`continue\` can stand in for any expression.',
    see: ['todo!', 'panic']
  },
  'Fn (trait)': {
    definition: 'The most permissive closure trait: \`Fn(args) -> R\` can be called any number of times and only borrows its captures.  Compatible callers include regular \`fn\` items, function pointers, and closures that do not mutate or consume captures.',
    see: ['FnMut (trait)', 'FnOnce (trait)', 'closure']
  },
  'FnMut (trait)': {
    definition: 'Closure trait that allows mutation of captured state.  \`FnMut(args) -> R\` can be called any number of times but the caller must hold \`&mut\` to it.  Every closure that mutates captures implements only \`FnMut\` and \`FnOnce\`, not \`Fn\`.',
    see: ['Fn (trait)', 'FnOnce (trait)', 'closure']
  },
  'FnOnce (trait)': {
    definition: 'The most restrictive closure trait: \`FnOnce(args) -> R\` can be called exactly once.  Allows the closure to move out of captures.  Required for closures that consume their environment.',
    see: ['Fn (trait)', 'FnMut (trait)', 'closure']
  },
  'function pointer': '\`fn(args) -> R\`: a regular function as a value.  Always implements [[Fn (trait)]], [[FnMut (trait)]], and [[FnOnce (trait)]].  Smaller and slightly faster than a closure but cannot capture environment.',
  'monomorphization': 'The compiler\'s strategy for generic code: produce a separate compiled copy for every concrete type combination the program uses.  Yields zero-cost abstractions but inflates code size when many types are involved.  See [[generic]].',
  'dyn Trait': 'A trait object — \`&dyn Trait\` or \`Box<dyn Trait>\` — that uses runtime (dynamic) dispatch instead of [[monomorphization]].  Pay a vtable lookup; gain the ability to hold heterogeneous types in one collection.',
  'newtype pattern': 'Wrap a type in a single-field tuple struct to give it new behavior or semantic meaning: \`struct Miles(f64);\`, \`struct UserId(u64);\`.  Cheap (no runtime overhead) and lets you implement traits without orphan-rule conflicts.',

  // ─────────────────── Rust standard library types ───────────────────
  'Vec': {
    definition: '\`Vec<T>\`: heap-allocated, growable list of \`T\` values stored contiguously.  The default Rust collection.  Construct with \`Vec::new()\`, \`vec![]\`, or \`Vec::with_capacity(n)\`.',
    see: ['slice', 'array']
  },
  'slice': {
    definition: '\`[T]\`: an unsized view into a contiguous sequence of \`T\` values.  Almost always seen behind a reference (\`&[T]\` or \`&mut [T]\`).  Stored at runtime as a [[fat pointer]] — data pointer plus length.',
    see: ['Vec', 'array', 'fat pointer']
  },
  'array': '\`[T; N]\`: a fixed-size, compile-time-known sequence of \`T\` values stored inline (no heap).  Used for buffers of known size — \`[u8; 32]\` for a hash, \`[f32; 4]\` for an RGBA pixel.  Coerces to \`&[T]\` via \`&arr\`.',
  'String': {
    definition: 'Heap-allocated, growable UTF-8 string.  Owns its bytes.  Construct with \`String::new()\`, \`String::from("...")\`, or via \`format!\`.',
    see: ['&str', 'str']
  },
  '&str': {
    definition: 'A read-only view into UTF-8 bytes owned by something else — a [[String]], a string literal, a substring slice.  The standard parameter type for "I just want to read this text."',
    see: ['String', 'str', 'slice']
  },
  'str': 'The unsized UTF-8 string type.  You almost never name it directly; it appears behind a reference (\`&str\`) or pointer (\`Box<str>\`).  See [[&str]].',
  'Option': {
    definition: '\`enum Option<T> { Some(T), None }\`: standard library type for "value or absence."  Replaces null in safer languages — the compiler refuses to let you use the inner value without first handling \`None\`.',
    see: ['Result', 'match']
  },
  'Result': {
    definition: '\`enum Result<T, E> { Ok(T), Err(E) }\`: standard library type for "success or failure with reason."  The canonical return type for fallible operations.  Combined with the [[? operator]] for ergonomic error propagation.',
    see: ['Option', '? operator', 'Error trait']
  },
  'HashMap': {
    definition: '\`HashMap<K, V>\`: hash-based associative map.  \`O(1)\` average lookup, insert, and delete.  No ordering guarantee — iteration order depends on the hash.',
    see: ['BTreeMap', 'HashSet']
  },
  'BTreeMap': {
    definition: '\`BTreeMap<K, V>\`: sorted associative map implemented as a B-tree.  \`O(log n)\` operations.  Keys are always in sorted order, enabling range queries.',
    see: ['HashMap', 'BTreeSet']
  },
  'HashSet': '\`HashSet<T>\`: hash-based set.  \`O(1)\` average operations.  No iteration order.  See [[HashMap]].',
  'BTreeSet': '\`BTreeSet<T>\`: sorted set implemented as a B-tree.  \`O(log n)\` operations with sorted iteration.  See [[BTreeMap]].',
  'VecDeque': 'Double-ended queue with \`O(1)\` push and pop at both ends.  Implemented as a growable ring buffer.  Use when the access pattern is FIFO or you need fast pops from the front.',
  'tuple': 'An anonymous heterogeneous collection: \`(T1, T2, ..., Tn)\`.  Has no field names — elements are accessed by index (\`t.0\`, \`t.1\`) or destructured via pattern matching.  Useful for ad-hoc grouping without a struct.',
  'unit type': {
    definition: '\`()\`: the zero-element tuple.  Carries no information, occupies zero bytes.  Default return type for functions that produce no value; success type of \`Result<(), E>\` when only the error is interesting.',
    see: ['tuple']
  },
  'Box': '\`Box<T>\`: a single owned heap allocation.  Use for recursive data structures, large values you want to move cheaply, or trait objects (\`Box<dyn Trait>\`).  Drops the heap allocation when the box goes out of scope.',
  'Rc': '\`Rc<T>\`: reference-counted shared owner for single-threaded code.  Multiple \`Rc<T>\` clones share one heap allocation; dropped when the last clone disappears.  Not thread-safe — use [[Arc]] across threads.',
  'Arc': '\`Arc<T>\`: atomic reference-counted shared owner for multi-threaded code.  Same idea as [[Rc]] but the refcount uses atomic operations and is safe to send across threads.',
  'Cell': '\`Cell<T>\`: cheapest [[interior mutability]] primitive.  Holds a \`T\` and lets you swap it out via \`.set()\` / \`.replace()\` through a shared reference.  Single-threaded; \`T\` must be [[Copy]] for \`.get()\`.',
  'RefCell': '\`RefCell<T>\`: interior mutability with runtime-checked [[borrow]] rules.  \`.borrow()\` returns a guard for shared access, \`.borrow_mut()\` for exclusive; rule violations panic at runtime instead of compile time.',
  'fat pointer': {
    definition: 'A two-word pointer used for unsized types: (data pointer, metadata).  Slices store (data, length); trait objects store (data, vtable pointer).  16 bytes on a 64-bit target.',
    see: ['slice', 'dyn Trait']
  },

  // ─────────────────── Rust syntax & control flow ───────────────────
  'match': {
    definition: 'Pattern-matching expression with exhaustive arms.  The compiler refuses to compile a \`match\` that does not cover every possible variant of the input — the exhaustiveness check.  Returns a value, like every other expression in Rust.',
    see: ['if let', 'let-else', 'pattern']
  },
  'pattern': 'The left side of a binding — what \`match\` arms, \`if let\`, \`let-else\`, and function parameters destructure against.  Patterns can match literals (\`0\`), variants (\`Some(x)\`), tuples (\`(a, b)\`), structs (\`Point { x, y }\`), references (\`&v\`), or use wildcards (\`_\`).',
  'destructuring': 'Pulling apart a structured value (tuple, struct, enum variant) into its components using a [[pattern]].  Works in \`let\` bindings, \`match\` arms, function parameters, and \`for\` loops.',
  'if let': {
    definition: 'Pattern-matching as a conditional: \`if let Some(x) = opt { use(x); }\`.  Sugar for a \`match\` with one explicit arm and a wildcard fallthrough.',
    see: ['match', 'let-else', 'while let']
  },
  'let-else': {
    definition: 'A binding form (Rust 1.65+) that runs a diverging else block when the pattern does not match: \`let Some(x) = opt else { return; };\`.  Keeps the happy path at the top indentation level.',
    see: ['if let', 'match']
  },
  'while let': 'Loop variant of [[if let]]: \`while let Some(x) = it.next() { ... }\` — keep looping as long as the pattern matches.  Idiomatic for consuming iterators and channels.',
  '? operator': {
    definition: 'The error-propagation operator.  Applied to a [[Result]] in a Result-returning function, \`expr?\` unwraps \`Ok\` and early-returns on \`Err\`.  Works the same way for [[Option]].  The shorthand that makes nested fallible code readable.',
    see: ['Result', 'Option']
  },
  'closure': {
    definition: 'An anonymous function written \`|params| body\`.  Can capture variables from its enclosing scope by reference, by mutable reference, or by move (with the \`move\` keyword).  Implements one of [[Fn (trait)]], [[FnMut (trait)]], or [[FnOnce (trait)]] depending on how it uses captures.',
    see: ['Fn (trait)', 'FnMut (trait)', 'FnOnce (trait)']
  },
  'lambda': 'Another name for a [[closure]].  More common in functional-programming-flavored languages; Rust documentation prefers "closure."',
  'attribute': 'Metadata applied to an item with \`#[name]\` or \`#[name(args)]\`.  Common examples: \`#[derive(Debug)]\`, \`#[test]\`, \`#[allow(dead_code)]\`, \`#[serde(rename = "x")]\`.  Crates can define custom [[procedural macro]] attributes.',
  'derive': '\`#[derive(Trait, ...)]\`: an [[attribute]] that auto-generates trait implementations.  Standard derivable traits include \`Debug\`, \`Clone\`, \`Copy\`, \`PartialEq\`, \`Eq\`, \`Hash\`, \`Default\`, \`Serialize\`, \`Deserialize\`.',
  'macro': {
    definition: 'A code-generating construct invoked with a trailing \`!\` (\`println!\`, \`vec!\`, \`assert_eq!\`).  Macros expand at compile time, before normal compilation runs.  Two flavors: [[macro_rules!]] (declarative, pattern-matching on tokens) and [[procedural macro]] (Rust code that takes tokens and returns tokens).',
    see: ['macro_rules!', 'procedural macro']
  },
  'macro_rules!': 'Syntax for defining a **declarative macro** by token-tree pattern matching.  Used to implement \`vec!\`, \`println!\`, \`todo!\`, and most standard-library macros.',
  'procedural macro': 'A macro implemented as Rust code that operates on a \`TokenStream\` and returns a \`TokenStream\`.  Three forms: function-like (\`name!(...)\`), attribute (\`#[name]\`), and [[derive]] (\`#[derive(Name)]\`).',
  'expression vs statement': 'In Rust nearly everything is an [[expression]] that evaluates to a value.  \`if\`, \`match\`, \`loop\`, and blocks all return values; semicolons turn an expression into a value-less statement.  The last expression of a block (no semicolon) is the block\'s value.',
  'expression': 'A piece of code that evaluates to a value.  In Rust this includes \`if\`/\`else\`, \`match\`, blocks, and any function call — see [[expression vs statement]].',

  // ─────────────────── Rust iterators & combinators ───────────────────
  'iterator': {
    definition: 'A type implementing the [[Iterator]] trait — produces values one at a time via \`.next()\`.  Lazy by default: no work happens until a terminal operation pulls values through the chain.',
    see: ['Iterator', 'IntoIterator', 'collect']
  },
  'Iterator (trait)': 'The standard iterator interface: a single required method \`fn next(&mut self) -> Option<Self::Item>\`, plus dozens of provided combinators (\`map\`, \`filter\`, \`fold\`, \`sum\`, ...) that build on it.',
  'IntoIterator': 'The trait that lets a type be used as the right-hand side of a \`for\` loop.  \`for x in collection\` calls \`collection.into_iter()\` (or \`.iter()\` if the collection is a reference).',
  'DoubleEndedIterator': 'An iterator that can yield items from both ends.  Implemented by ranges, slices, and most ordered collections.  Required for \`.rev()\`, \`.next_back()\`, and \`.rfind()\`.',
  'collect': 'Terminal iterator method that materializes a chain into a concrete collection — \`Vec<T>\`, \`HashMap<K,V>\`, \`String\`, anything implementing \`FromIterator\`.  Often needs a [[turbofish]] or type annotation to pick the target collection.',
  'map (iter)': 'Iterator combinator that applies a closure to every element, yielding a new iterator of transformed values.  Lazy — no work until a terminal operation pulls.',
  'filter': 'Iterator combinator that keeps only elements for which a predicate closure returns true.  Lazy.',
  'fold': 'Iterator combinator that accumulates via a closure: \`iter.fold(initial, |acc, x| ...)\`.  The general form of \`sum\`, \`product\`, \`count\`, \`max\`.',
  'sum (iter)': 'Iterator terminal that totals elements using the \`Add\` trait.  Often needs a [[turbofish]] (\`.sum::<i32>()\`) because the target type cannot be inferred from the element type alone.',
  'enumerate': 'Iterator combinator that pairs each element with its 0-based index, yielding \`(usize, item)\`.  Same idea as Python\'s \`enumerate()\` or JS \`Array.entries()\`.',
  'zip': {
    definition: 'Iterator combinator that walks two iterators in lockstep, yielding \`(a, b)\` pairs.  Stops at the **shorter** of the two; \`itertools::zip_eq\` panics on length mismatch.',
    see: ['itertools']
  },
  'chain (iter)': 'Iterator combinator that concatenates two iterators end-to-end.  Element types must match.',
  'take': 'Iterator combinator that yields at most the first \`n\` elements.',
  'skip': 'Iterator combinator that discards the first \`n\` elements and yields the rest.',
  'windows': {
    definition: 'Slice method that returns an iterator of **overlapping** length-\`k\` views.  For \`[1, 2, 3, 4]\`, \`.windows(2)\` yields \`[1,2]\`, \`[2,3]\`, \`[3,4]\`.  Used to walk consecutive pairs or triples.',
    see: ['chunks']
  },
  'chunks': {
    definition: 'Slice method that returns an iterator of **non-overlapping** length-\`k\` chunks.  Last chunk may be shorter; use \`.chunks_exact(k)\` to skip the short tail.',
    see: ['windows']
  },
  'copied': 'Iterator combinator that converts \`&T\` items to \`T\` by bit-copying each one.  Requires \`T: Copy\`.  Use to strip a reference layer without allocating.  See [[Copy]] and [[cloned]].',
  'cloned': 'Iterator combinator that converts \`&T\` items to \`T\` by calling \`.clone()\` on each.  Requires \`T: Clone\` and may allocate.  See [[Clone]] and [[copied]].',
  'rev': 'Iterator combinator that reverses direction.  Requires the source to implement [[DoubleEndedIterator]].',
  'all (iter)': 'Iterator terminal that returns \`true\` if every element satisfies the predicate.  Short-circuits on the first \`false\`.',
  'any (iter)': 'Iterator terminal that returns \`true\` if any element satisfies the predicate.  Short-circuits on the first \`true\`.',
  'find': 'Iterator terminal that returns the first element matching a predicate, as \`Option<Item>\`.  Short-circuits.',
  'find_map': 'Iterator terminal that combines \`map\` and \`find\` — runs a closure returning \`Option<T>\` on each element, returns the first \`Some\`.',
  'min (iter)': 'Iterator terminal that returns the smallest element as \`Option<Item>\` (\`None\` when the iterator is empty).',
  'max (iter)': 'Iterator terminal that returns the largest element as \`Option<Item>\` (\`None\` when the iterator is empty).',
  'flat_map': 'Iterator combinator that maps each element to an iterator and concatenates the results.  The flatmap operation from functional programming.',
  'flatten': 'Iterator combinator that takes an iterator of iterators and yields one level less — collapses one layer of nesting.',
  'step_by': 'Iterator combinator that yields every \`n\`-th element.',
  'peekable': 'Iterator wrapper that adds a \`.peek()\` method — look at the next item without consuming it.',
  'range': 'A lightweight iterator yielding consecutive values.  Written \`a..b\` (half-open, excludes \`b\`) or \`a..=b\` (inclusive).  Implements [[Iterator]] and (for integer ranges) [[DoubleEndedIterator]].',

  // ─────────────────── Rust error handling ───────────────────
  'panic': {
    definition: 'A controlled program crash.  Rust panics unwind the stack (running [[Drop]] for every local) and then abort by default.  Triggered by \`panic!\`, \`unwrap\` on \`None\`/\`Err\`, array out-of-bounds, integer overflow in debug builds, and divide-by-zero.',
    see: ['unwrap', 'expect', 'todo!']
  },
  'unwrap': 'Method on \`Option\`/\`Result\` that returns the inner value on success and panics on \`None\`/\`Err\`.  Convenient for prototypes and tests, dangerous in production code.  Prefer [[expect]] (custom message) or the [[? operator]] (propagate).',
  'expect': 'Method on \`Option\`/\`Result\` like [[unwrap]] but with a custom panic message.  Strictly better than \`unwrap\` for production code because the panic prints useful text.  Use when failure means a bug in your code.',
  'todo!': {
    definition: 'A placeholder [[macro]] that panics at runtime with "not yet implemented."  Returns the [[never type]] \`!\` so it fits in any expression position.  Use as a development-time TODO marker.',
    see: ['unimplemented!', 'unreachable!', 'never type']
  },
  'unimplemented!': 'A placeholder macro like [[todo!]] but with the message "not implemented."  Used for intentionally-unimplemented trait methods that callers should never invoke.',
  'unreachable!': 'A macro that panics with "internal error: entered unreachable code" — used to assert that a code path is impossible.  If it ever fires, it indicates a logic bug.',
  'Error trait': 'The \`std::error::Error\` trait — the standard interface for error types.  Requires \`Display\` for a human message and \`Debug\` for a developer view, plus optional source-chain support.  Derive it with [[thiserror]] in libraries.',
  'unwrap_or': 'Method on \`Option<T>\`/\`Result<T, E>\` that returns the inner value on success or a supplied fallback on failure.  See also \`.unwrap_or_else(closure)\` (lazy fallback) and \`.unwrap_or_default()\` (uses \`T::default()\`).',
  'map_err': 'Method on \`Result<T, E>\` that transforms the error side: \`Err(e)\` becomes \`Err(f(e))\`.  The error-side counterpart of \`.map()\`.  Used to narrow a library\'s rich error type to a simpler one your API exposes.',

  // ─────────────────── Rust numeric types ───────────────────
  'usize': 'The pointer-sized unsigned integer type — 64 bits on a 64-bit target, 32 bits on a 32-bit target.  The type for array indices, lengths, and counts.  Rust never implicitly converts to or from \`usize\`; use \`as usize\` for explicit casts.',
  'isize': 'The pointer-sized signed integer type — same width as [[usize]].  Used when a count or offset can legitimately be negative.',
  'integer types': '\`i8\`, \`i16\`, \`i32\`, \`i64\`, \`i128\` (signed) and \`u8\`, \`u16\`, \`u32\`, \`u64\`, \`u128\` (unsigned).  Fixed-width.  No implicit conversion between them — every cross-width assignment needs an [[as cast]] (or fallible \`TryFrom\` for narrowing).',
  'float types': '\`f32\` and \`f64\`: IEEE 754 binary floating-point.  \`f64\` is the default for arithmetic in this book.  Subject to rounding errors — see [[floating-point precision]].',
  'as cast': 'Explicit numeric type conversion: \`expr as Target\`.  The only way to convert between primitive numeric types in Rust.  Truncates on narrowing without complaint; use \`TryFrom\` if you want to detect overflow.',
  'saturating arithmetic': 'Operations like \`.saturating_add()\` and \`.saturating_sub()\` that clamp at the type\'s minimum or maximum instead of wrapping around or overflowing.  Useful when overflow should silently pin to the boundary.',
  'wrapping arithmetic': 'Operations like \`.wrapping_add()\` that explicitly perform modular two\'s-complement arithmetic without checking for overflow.  Standard for hashes, counters, and bit manipulation.',
  'checked arithmetic': 'Operations like \`.checked_add()\` that return \`Option<T>\` — \`None\` on overflow, \`Some(value)\` otherwise.  Use when overflow is a real possibility you want to handle.',
  'floating-point precision': 'IEEE 754 floats represent values with finite precision — about 15-17 significant decimal digits for \`f64\`.  Operations introduce tiny rounding errors.  Compare against thresholds rather than \`== 0.0\` or \`== 1.0\`; see the 0.5-threshold trick on page 27.',

  // ─────────────────── Algorithm vocabulary ───────────────────
  'BFS': {
    definition: 'Breadth-First Search.  Graph traversal that visits all vertices at distance 1 from the start, then all at distance 2, and so on.  Linear time \`O(V + E)\`.  The standard tool for unweighted shortest paths and "within k hops" queries.',
    see: ['DFS', "Dijkstra's algorithm"]
  },
  'DFS': {
    definition: 'Depth-First Search.  Graph traversal that descends one branch as far as it can before backtracking.  Linear time \`O(V + E)\`.  Used for cycle detection, topological sort (via finishing times), and as the engine for [[Tarjan SCC]] and [[Hierholzer\'s algorithm]].',
    see: ['BFS']
  },
  'adjacency list': 'A graph representation that stores, for each vertex, a list of its neighbors.  Memory \`O(V + E)\`.  The default for sparse graphs.  petgraph uses this internally.',
  'adjacency matrix': 'A graph representation as a square \`V × V\` boolean (or weight) matrix.  Memory \`O(V²)\`.  Better than adjacency lists when graphs are dense or when you need fast edge-existence lookups.',
  'bitmask DP': 'Dynamic programming that uses a [[bitmask]] over a small universe (≤ 64 elements) as part of the state.  Used by [[Held-Karp]] for TSP, by subset-sum variants, and by many "small parameter" exact algorithms.',
  'bitmask': 'An integer whose bits encode a subset of a small universe — bit \`i\` set means "element \`i\` is in the subset."  Bitwise AND/OR/XOR/shift operate on whole subsets in one CPU instruction.',
  'memoization': 'Caching the result of a function call so subsequent calls with the same input return the cached answer.  The top-down sibling of [[dynamic programming]].',
  'backtracking': 'Search by trial assignment with explicit undo on conflict.  Classic for SAT, constraint satisfaction, n-queens, and Sudoku.  Modern [[CDCL]] solvers are heavily optimized backtracking searches.',
  'divide and conquer': 'A recursive algorithm pattern: split the problem into independent subproblems, solve each recursively, combine.  Examples: merge sort, FFT, Karatsuba multiplication.',
  'amortized analysis': 'Averaging the cost of operations over a sequence to get a tighter bound than worst-case-per-operation.  \`Vec::push\` is \`O(1)\` amortized despite occasional reallocations; \`union-find\` operations are nearly \`O(1)\` amortized.',
  'big O notation': 'Asymptotic upper bound on growth.  \`O(f(n))\` means "no worse than a constant times \`f(n)\` for sufficiently large \`n\`."  The standard vocabulary for algorithm cost.',
  'meet in the middle': 'Split the search space in half, enumerate both halves separately, combine via hashing or binary search.  Reduces \`2^n\` brute force to \`2^(n/2)\` time and space.  Standard technique for [[subset sum]] with large targets.',
  'admissible heuristic': 'In [[A* search]], a heuristic that never overestimates the true remaining distance.  Sufficient to guarantee optimality of the path A* returns.',
  'DSATUR': 'Degree of saturation.  A graph-coloring heuristic that colors the vertex with the most distinct colors already in its neighborhood, picking the smallest available color.  Often optimal in practice despite being a heuristic.',
  'pdqsort': 'Pattern-Defeating Quicksort.  The unstable sort algorithm used by Rust\'s \`sort_unstable()\`.  Quicksort variant with introspective fallback to heapsort and special handling for sorted, reverse-sorted, and equal-key inputs.',
  'Timsort': 'Adaptive merge-sort variant that exploits existing runs of sorted data.  Used by Rust\'s stable \`sort()\`, Python\'s \`sorted()\`, and Java\'s \`Arrays.sort\`.',
  'radix sort': 'Non-comparison sort that processes input digit-by-digit.  Linear time when keys are fixed-width integers or strings.  Beats the \`O(n log n)\` comparison bound by exploiting key structure.',
  'pattern matching': 'See [[match]] and [[pattern]] for Rust\'s syntax.  In algorithms, also refers to string search — see [[KMP]] and [[Aho-Corasick]].',

  // ─────────────────── OR / Optimization ───────────────────
  'large neighborhood search': 'LNS.  A metaheuristic that alternates **destroy** (remove a portion of the current solution) and **repair** (rebuild the destroyed portion, optionally using an exact subroutine).  The basis of modern vehicle-routing solvers.',
  'genetic algorithm': 'A metaheuristic that maintains a population of candidate solutions, selects parents by fitness, combines them by crossover, mutates, and iterates.  Empirically useful but rarely beats problem-specific methods.',
  'Concorde': 'The state-of-the-art exact TSP solver.  Uses branch-and-cut on an ILP formulation with hundreds of cutting-plane families.  Has solved instances with tens of thousands of cities to optimality.',
  'Vroom': 'Open-source SaaS-ready solver for vehicle routing problems.  Built around local-search metaheuristics.',
  'OR-Tools': 'Google\'s open-source operations research toolkit.  Includes a constraint programming solver, MIP wrappers, vehicle-routing engine, and graph algorithms.',
  'OptaPlanner': 'Open-source Java constraint-satisfaction and optimization engine.  Common for shift scheduling, exam timetabling, and similar industrial planning problems.',
  'Gurobi': 'Industrial-strength commercial LP/MIP/QP solver.  State of the art on the largest practical instances.  Free for academic use, paid licenses for industry.',
  'CPLEX': 'IBM\'s commercial LP/MIP solver, originally developed at CPLEX Optimization (named for the "C" programming language and "simplex").  Long-time peer of Gurobi at the top of the MIP solver benchmark tables.',
  'HiGHS': 'Open-source LP/MIP solver in C++.  Competitive with the commercial solvers on many practical problems.  The recommended free backend for [[good_lp]].',
  'Tseitin transformation': 'A polynomial-time encoding from arbitrary Boolean formulas into [[CNF]] using auxiliary variables, with size linear in the original formula.  Lets SAT solvers consume formulas that are not naturally CNF.',
  'normal equations': 'The linear system \`X^T X β = X^T y\` whose solution gives the least-squares regression coefficients.  Numerically less stable than QR/SVD-based methods but conceptually direct.  Ridge regression adds \`λI\` to make the matrix well-conditioned.',
  'ridge regression': 'Linear regression with an L2 penalty on the coefficients: minimize \`||y - Xβ||² + λ||β||²\`.  Convex, closed-form solution \`(X^T X + λI)^{-1} X^T y\`.  Stabilizes the [[normal equations]] when features are correlated.',
  'lasso regression': 'Linear regression with an L1 penalty: minimize \`||y - Xβ||² + λ||β||₁\`.  Convex (no closed form).  Encourages sparse coefficient vectors — most coefficients land at exactly zero.',
  'support vector machine': 'A convex, margin-maximizing classifier.  Quadratic programming under the hood.  Linear SVMs and kernel SVMs are both convex; the latter use the kernel trick to operate implicitly in high-dimensional feature spaces.',
  'gradient descent': 'Iterative optimization that takes steps in the direction of the negative gradient.  The workhorse of machine learning training.  Variants include momentum, AdaGrad, RMSProp, and Adam.',
  "Newton's method": 'Optimization using both gradient and Hessian (second derivative).  Converges quadratically near a local minimum but requires solving a linear system per iteration.  Practical variants: Gauss-Newton, Levenberg-Marquardt.',
  'L-BFGS': 'Limited-memory BFGS.  A quasi-Newton method that approximates the inverse Hessian using a small history of gradient differences.  The standard choice for smooth convex optimization at scale.',
  'Metropolis criterion': 'The acceptance rule in [[simulated annealing]]: accept a worsening move with probability \`exp(-Δcost / temperature)\`.  At high temperature accepts almost everything; at low temperature behaves like greedy descent.',

  // ─────────────────── Linear algebra & numerics ───────────────────
  'eigenvalue': 'A scalar \`λ\` such that \`A v = λ v\` for some non-zero vector \`v\`.  Captures how a matrix scales certain directions (its [[eigenvector]]s).  Computing eigenvalues is polynomial.',
  'eigenvector': 'A non-zero vector \`v\` satisfying \`A v = λ v\` for some scalar [[eigenvalue]] \`λ\`.  PageRank and spectral clustering both rest on dominant eigenvectors.  See [[power iteration]].',
  'SVD': 'Singular Value Decomposition.  Factorize any matrix \`A = U Σ V^T\` with \`U\` and \`V\` orthogonal and \`Σ\` diagonal with non-negative entries.  The universal matrix decomposition — used for PCA, low-rank approximation, pseudo-inverse, and recommendation systems.',
  'PCA': 'Principal Component Analysis.  Dimensionality reduction via the top components of an [[SVD]].  Projects data onto the directions of maximum variance.',
  'spectral clustering': 'Clustering algorithm that uses the eigenvectors of a graph [[Laplacian]] to find groups with few edges between them.  Reduces clustering to a much-easier eigenvalue computation.',
  'Laplacian': 'For a graph with adjacency \`A\` and degree-diagonal \`D\`, the Laplacian is \`L = D - A\`.  Its spectrum encodes connectivity, expansion, and cluster structure.  The smallest eigenvalues / eigenvectors drive [[spectral clustering]].',
  'identity matrix': 'The \`n × n\` matrix with \`1\` on the diagonal and \`0\` elsewhere.  Algebraic identity for matrix multiplication: \`I · A = A\`.  Constructed in [[nalgebra]] with \`DMatrix::identity(n, n)\`.',
  'transpose': 'The matrix \`A^T\` obtained by swapping rows and columns of \`A\`.  \`(A B)^T = B^T A^T\`.  Symmetric matrices satisfy \`A = A^T\`.',
  'inverse matrix': 'For a square matrix \`A\`, the inverse \`A^{-1}\` satisfies \`A A^{-1} = A^{-1} A = I\`.  Exists iff \`A\` is non-[[singular matrix]].  Computing the inverse explicitly is rarely the right move; solve the linear system \`A x = b\` instead.',
  'singular matrix': 'A square matrix with no inverse.  Equivalent to: determinant is zero, rank is less than \`n\`, has \`0\` as an eigenvalue, columns are linearly dependent.  Ridge regression adds \`λI\` specifically to push singular \`X^T X\` away from singularity.',
  'positive definite': 'A symmetric matrix with all positive eigenvalues.  Admits a [[Cholesky]] decomposition.  The condition under which the [[normal equations]] have a unique solution.',
  'Cholesky': 'A factorization \`A = L L^T\` for symmetric [[positive definite]] matrices, with \`L\` lower triangular.  About twice as fast as LU for the symmetric case; the workhorse decomposition for least-squares and Gaussian-process methods.',
  'condition number': 'A measure of how sensitive the solution of a linear system is to perturbations in the input.  Low condition number means the problem is well-behaved; large condition number means small input errors blow up in the output.  Ridge regularization improves condition number.',
  'numerical stability': 'The property of an algorithm whose output errors are bounded by small multiples of the input errors.  Stable algorithms can be trusted in floating-point arithmetic; unstable ones produce nonsense on hard inputs.  See [[condition number]] and [[floating-point precision]].',

  // ─────────────────── Cryptography ───────────────────
  'RSA': {
    definition: 'Rivest-Shamir-Adleman (1977).  The first practical public-key cryptosystem.  Security rests on the hardness of [[integer factorization]] — the public modulus is a product of two large primes that no one knows how to factor in polynomial time.',
    see: ['public-key cryptography', 'integer factorization', "Shor's algorithm"]
  },
  'public-key cryptography': {
    definition: 'Asymmetric cryptography with separate public (encryption / verification) and private (decryption / signing) keys.  Enables secure communication between parties who have never met.  Most practical schemes — RSA, ECDSA, Diffie-Hellman — rest on the hardness of specific number-theoretic problems.',
    see: ['RSA']
  },
  'integer factorization': {
    definition: 'Given a composite integer, recover its prime factors.  Conjectured exponentially hard for classical computers.  Best known algorithm is the general number field sieve at sub-exponential time.  Foundation of [[RSA]].',
    see: ['RSA', "Shor's algorithm"]
  },
  "Shor's algorithm": {
    definition: 'Peter Shor (1994).  A polynomial-time quantum algorithm for [[integer factorization]] and discrete logarithm.  Would break RSA and most current public-key cryptography if a sufficiently large quantum computer existed; none does yet.',
    see: ['integer factorization', 'post-quantum cryptography']
  },
  'post-quantum cryptography': 'Cryptographic schemes designed to resist attacks by quantum computers running [[Shor\'s algorithm]] and similar.  NIST standardized the first set (Kyber, Dilithium, Falcon, SPHINCS+) in 2024.',
  'discrete logarithm': 'Given \`g, h, p\` with \`p\` prime, find \`x\` such that \`g^x ≡ h (mod p)\`.  Believed exponentially hard for classical computers; broken in polynomial time by [[Shor\'s algorithm]].  Foundation of Diffie-Hellman and ECDSA.',

  // ─────────────────── Domain / book vocabulary ───────────────────
  'arbitrage': 'Risk-free profit from price discrepancies — a sequence of currency trades that returns more than you started with.  Equivalent to a negative-cost cycle in a graph whose edges are \`-ln(exchange_rate)\`.  Detected by [[Bellman-Ford]].',
  'unbounded knapsack': 'Knapsack variant where each item can be used any number of times.  Solvable by forward-iterating DP in \`O(n W)\`.  Contrast with 0/1 knapsack (page 26), which uses reverse-iterating DP to prevent reuse.',
  'fractional knapsack': 'Knapsack variant where items are divisible — you can take any fraction.  Solvable in polynomial time by greedy by value-to-weight ratio.  The cheap twin of 0/1 knapsack (page 38).',
  'assignment problem': 'Find a one-to-one matching between two equal-size sets that minimizes total cost.  Solved by the [[Hungarian algorithm]] in \`O(V³)\`.  Used for driver-to-delivery, applicant-to-position, and resource-allocation problems.',
  '3-dimensional matching': 'Match triples (one from each of three sets) such that no element appears in more than one chosen triple.  NP-complete (Karp 1972).  Three sets is expensive; two sets ([[bipartite matching]]) is in P.',
  'vehicle routing problem': 'Multi-vehicle generalization of TSP with capacity and time-window constraints.  NP-hard.  Production solvers are heuristic-based (Vroom, OR-Tools, LKH).  Real-world enterprise SaaS market.',
  'crew scheduling': 'Airline industry term for assigning pilots and flight attendants to flight legs subject to FAA rules.  Decomposes into pairing (build legal multi-day rotations) and rostering (assign rotations to people).  Both ILP, both solved daily at production scale.',
  'facility location': 'Decide which warehouses to open and which customer each is served from, minimizing fixed plus transportation cost.  NP-hard in general; specialized variants (uncapacitated, metric) have known approximation algorithms.',
  'tolerance': 'In numerical algorithms, the largest acceptable error.  Idiom: compare floating-point values against thresholds (\`> 0.5\`, \`< 1e-6\`) rather than against exact \`0.0\` or \`1.0\`.  See [[floating-point precision]].'
};
