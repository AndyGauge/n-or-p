// N or P — a self-teaching book on the P and NP classes, written in Rust.
//
// The thesis: most "hard" problems you meet in code are not actually hard.
// They are P-class problems wearing NP-complete clothing.  Learning to tell
// them apart is the entire skill.  Each page pairs a problem with the named
// algorithm that solves it, and the Rust crate that solves it best.
//
// Part I  — The classes (01–05)
// Part II — P, with Rust (06–22)
// Part III— NP-complete, with Rust (23–32)
// Part IV — When you cannot solve exactly (33–36)
// Part V  — The diagnostic spine (37–39)

const raw = [
  // ───────────────────────── Part I — The classes ─────────────────────────
  {
    title: 'P vs NP',
    tldr: 'P is solve-fast.  NP is verify-fast.  Whether they are the same class is the open question.',
    gesture: 'Two classes, one unproven equality, and the reason every algorithm choice is also a class declaration.',
    body: `P is the set of decision problems solvable in polynomial time on a deterministic Turing machine — there is an algorithm whose worst-case running time is bounded by some polynomial in the input size.  NP is the set of decision problems verifiable in polynomial time given a witness — a yes-answer comes with a certificate that can be checked fast, even when finding the certificate is hard.  Every problem in P sits inside NP because the solver doubles as the verifier.  The open question P = NP asks whether finding is as easy as checking.  Stephen Cook formalized the question in 1971 and Leonid Levin independently in 1973.  No proof either way exists.  The class your problem lives in determines which Rust tools belong in the toolbox.`,
    citation: 'Cook, S. A. (1971). *The Complexity of Theorem-Proving Procedures.* STOC.  Sipser, M. (2013). *Introduction to the Theory of Computation,* 3rd ed.',
    link: 'https://en.wikipedia.org/wiki/P_versus_NP_problem',
    eli5: `Computer scientists sort problems by how much work it takes to solve them.  The most useful sorting puts problems into classes based on how the work grows with the size of the input.  If you double the input and the work merely doubles, or quadruples, or grows by some polynomial, that is fast.  If the work doubles every time you add one item to the input, that is slow — exponential.  The first class is called P.  The second class is the swamp.

NP is a strange middle.  It is the class of problems where, if someone hands you a candidate answer, you can check it fast — in polynomial time.  Verifying a sudoku solution is easy.  Solving sudoku from scratch on a giant board is not obviously easy.  Verifying that a graph has a Hamiltonian cycle, given the cycle, is easy.  Finding the cycle is the swamp.

P sits inside NP because if you can solve fast, you can certainly verify fast — just solve it again and compare.  The question P = NP asks whether the reverse is also true.  If every problem that is fast to verify is also fast to solve, then encryption breaks, drug design becomes trivial, and most of operations research collapses into a single algorithm.  Almost nobody believes this is true, but nobody has proven it false.

The reason this matters for your code, today, is that the labels are not just theoretical.  When a problem is in P, there is almost always a named algorithm with a tight running time and a Rust crate that implements it well.  When a problem is NP-complete, you are choosing among exact-but-slow, approximate, heuristic, or constraint-solver approaches — different tools, different tradeoffs.  Reaching for an NP-complete tool on a P problem is wasted motion.  Reaching for a P tool on an NP-complete problem is wishful thinking.

The class is the contract.  Read it before you write code.`
  },
  {
    title: 'Verifier vs solver',
    tldr: 'Checking an answer and producing one are not the same job.  The gap between them is where complexity lives.',
    gesture: 'NP is defined by the verifier, not the solver — and that asymmetry is the whole game.',
    body: `A verifier for a decision problem is an algorithm that, given an input and a candidate certificate, returns yes or no in polynomial time.  A solver returns yes or no given only the input.  Every NP problem has a polynomial-time verifier by definition.  Whether it has a polynomial-time solver is the per-problem question.  For problems in P, the solver itself is a verifier — feed in the input, ignore the certificate, return the answer.  For NP-complete problems, no polynomial solver is known, but the verifier is trivial: hand the algorithm a sudoku grid and its purported solution and a few rules-checks tell you in microseconds whether it works.  The asymmetry between verifying and producing is where every approximation, every heuristic, every SAT solver lives.`,
    citation: 'Sipser, M. (2013). *Introduction to the Theory of Computation,* 3rd ed., Chapter 7.',
    link: 'https://en.wikipedia.org/wiki/NP_(complexity)',
    eli5: `Imagine two jobs at a math contest.  One person grades the papers.  Another person solves the problems.  Both jobs need to finish before the bell rings.  For most problems, solving is harder than grading.  That is the whole intuition behind NP.

A decision problem is a question with a yes-or-no answer.  Does this graph have a path that visits every vertex once?  Is there a set of items totaling exactly $1,000?  Can this Boolean formula be made true?  For each of these, the grader's job is simple — given a proposed answer, walk through it and check the rules.  A path that visits every vertex?  Walk it and count.  A subset summing to $1,000?  Add it up.  A satisfying assignment?  Substitute and evaluate.

The solver does not get a candidate.  The solver gets only the problem.  The solver has to find the path, find the subset, find the assignment.  For problems in P, the search is structured enough that a smart algorithm gets there in polynomial time.  For NP-complete problems, every known approach in the worst case is essentially trying many candidates.

The reason this framing matters for Rust code is that it tells you what to build.  If your problem has an obvious fast verifier and no obvious fast solver, you are in NP-complete territory until proven otherwise.  Reach for a SAT solver, a SMT solver, an integer programming solver, or a branch-and-bound search.  If your problem has a fast solver that you can sketch in a few lines, you are in P.  Reach for the named algorithm.

Verifier-fast does not mean solver-fast.  That is the gap.`
  },
  {
    title: 'Reducibility',
    tldr: 'If problem A can be rewritten as problem B in polynomial time, A is no harder than B.',
    gesture: 'Reductions are arrows between problems.  Follow them and the whole NP-complete catalog falls out of one source.',
    body: `A polynomial-time reduction from problem A to problem B is a function f, computable in polynomial time, such that x is a yes-instance of A if and only if f(x) is a yes-instance of B.  If such a reduction exists, A is no harder than B, written A ≤ₚ B — a fast solver for B yields a fast solver for A.  Karp formalized this many-one reduction in his 1972 paper proving twenty-one classic problems NP-complete.  The relation is transitive: if A reduces to B and B reduces to C, then A reduces to C.  Reductions are the backbone of the NP-complete catalog — every problem in that set reduces to every other.  Proving a new problem NP-complete means reducing a known NP-complete problem to it.`,
    citation: 'Karp, R. M. (1972). *Reducibility Among Combinatorial Problems.* In *Complexity of Computer Computations.*  Cook, S. A. (1971). *The Complexity of Theorem-Proving Procedures.* STOC.',
    link: 'https://en.wikipedia.org/wiki/Polynomial-time_reduction',
    eli5: `A reduction is a translator.  You have a problem in language A.  You want to use a solver that speaks language B.  A reduction is a function that converts every A-instance into a B-instance such that the answers line up: yes-in-A becomes yes-in-B, no-in-A becomes no-in-B.  If the conversion itself runs in polynomial time, the existence of a fast B-solver implies the existence of a fast A-solver.

This is the trick that lets the NP-complete catalog grow without each problem being proven hard from scratch.  Cook proved that SAT is NP-complete in 1971 — every NP problem reduces to SAT, because the Turing machine that verifies the certificate can itself be encoded as a SAT formula.  Once that one cornerstone existed, Karp showed in 1972 that you can reduce SAT to 3-SAT, then 3-SAT to clique, clique to vertex cover, vertex cover to set cover, and so on.  Every new reduction extends the catalog.

The practical use of reducibility in your Rust code is bidirectional.  When you spot that your problem is really 0/1 knapsack in disguise, you have proven it is NP-complete and you can reach for the same tools — pseudo-polynomial DP, ILP, or branch-and-bound.  When you spot that a problem you thought was hard actually reduces to bipartite matching or 2-SAT or max-flow, you have just promoted it to P and you can throw away the heuristic and use \`petgraph\`.

The arrows go both ways.  Follow them.  The class of your problem might be one rewrite away.`
  },
  {
    title: 'NP-complete, NP-hard, co-NP — the map',
    tldr: 'Four labels.  Each one tells you something different about what tools to reach for.',
    gesture: 'Complexity classes are not a ladder — they are a map.  Knowing the map keeps you from wandering.',
    body: `NP-complete problems are the hardest in NP — every NP problem reduces to them in polynomial time.  Cook proved SAT NP-complete in 1971; Karp added twenty more in 1972.  NP-hard is a strictly broader label: a problem is NP-hard if every NP problem reduces to it, but it need not itself be in NP.  The halting problem is NP-hard but uncomputable.  Optimization versions of NP-complete decision problems are NP-hard but usually outside NP because the answer is a number rather than a yes/no.  Co-NP is NP turned inside out — the class where no-answers have short certificates.  Tautology checking is the canonical co-NP-complete problem.  P sits in the intersection P = NP ∩ co-NP — at least, that part of the intersection we currently know about.`,
    citation: 'Garey, M. R., Johnson, D. S. (1979). *Computers and Intractability: A Guide to the Theory of NP-Completeness.* W. H. Freeman.',
    link: 'https://en.wikipedia.org/wiki/NP-completeness',
    eli5: `Four labels show up over and over.  They are not synonyms.  Mixing them up is a real source of mistakes.

NP-complete is the inner circle.  These are the problems that are both in NP and at least as hard as every other NP problem.  SAT, 3-SAT, vertex cover, clique, Hamiltonian cycle, TSP-decision, 0/1 knapsack-decision, graph coloring for three or more colors, subset sum.  When you reduce a new problem to one of these, you have shown the new problem is NP-complete too.

NP-hard is broader.  A problem is NP-hard if every NP problem reduces to it — but the problem itself does not have to be in NP.  Optimization versions of NP-complete decision problems are NP-hard because their answer is a real number rather than a yes/no.  The halting problem is NP-hard because every NP problem reduces to it, but it sits outside NP because no algorithm — polynomial or otherwise — can verify a no-instance.  NP-hardness is a lower bound.  It says "at least this hard."

Co-NP is the mirror of NP.  NP is the class of problems where yes-answers have short verifiers.  Co-NP is the class where no-answers do.  Checking that a Boolean formula is a tautology — true under every assignment — is in co-NP, because a counterexample is a short certificate for the no-answer.  Whether NP = co-NP is open and is widely believed to be false.

P lives inside NP ∩ co-NP.  If P = NP, the whole map collapses.  If P ≠ NP, the structure is real and the labels matter.

The reason this map matters for your code is that NP-hard does not always mean "use a SAT solver."  Some NP-hard optimization problems have good polynomial-time approximations.  Some have efficient pseudo-polynomial algorithms.  Some have parameterized algorithms when one dimension of the input is small.  The right tool depends on the exact label.

Read the map before you pick a road.`
  },
  {
    title: 'What changes if P = NP',
    tldr: 'Cryptography breaks.  Optimization becomes trivial.  Mathematical proof becomes automatable.  Almost nobody thinks this is what happens.',
    gesture: 'The world looks very different on the other side of an unproven equality.',
    body: `If P = NP, every problem in NP has a polynomial-time solver.  Public-key cryptography collapses — RSA, elliptic curve, lattice-based schemes built on conjectured hardness assumptions all reduce to NP problems whose solvers would become polynomial.  Optimization becomes a one-shot routine: vehicle routing, scheduling, protein folding, drug design, circuit verification, theorem proving — every NP search problem becomes tractable.  Mathematics becomes partly automatable, since finding a short formal proof of a theorem is an NP problem.  The Clay Mathematics Institute offers a million-dollar prize for resolving the question either way.  Most computer scientists believe P ≠ NP — surveys put the share above eighty percent — but the belief has no proof.  Scott Aaronson's essay on the question is the cleanest summary.`,
    citation: 'Aaronson, S. (2017). *P =? NP.* In *Open Problems in Mathematics,* Springer.  Fortnow, L. (2013). *The Golden Ticket: P, NP, and the Search for the Impossible.* Princeton.',
    link: 'https://www.scottaaronson.com/papers/pnp.pdf',
    eli5: `Most computer science majors learn the P = NP question as an academic curiosity.  It is anything but.  The stakes on each side are immense.

If P = NP, the modern internet stops working in the way it works today.  Every public-key system in widespread use rests on the assumption that some specific NP problem — factoring integers, computing discrete logarithms, solving lattice problems — is not in P.  A constructive proof that P = NP would, in principle, hand you a polynomial-time algorithm for one of those problems, and from there cascade to all of them.  Banking, messaging, software updates, and identity systems would all need new foundations.

The upside side of the same coin is enormous.  Drug design becomes searching the chemical space for molecules with desired binding properties — an NP problem.  Logistics, scheduling, routing — all NP problems.  Protein folding, machine learning training, theorem proving, program synthesis — all reducible in their core search step to NP.  A polynomial-time NP solver would be the single most consequential algorithm in the history of computing.

The reason almost nobody believes this is the world we live in is the absence of evidence.  Decades of attacks on specific NP-complete problems have produced no polynomial algorithms despite enormous incentive.  The natural-proofs barrier of Razborov-Rudich, the relativization barrier of Baker-Gill-Solovay, and the algebrization barrier of Aaronson-Wigderson all show that any proof of P ≠ NP must use techniques the current proof toolkit lacks.  The question is hard in part because the obvious approaches provably cannot work.

For practical Rust code today, the working assumption is P ≠ NP.  Treat NP-complete problems as genuinely hard.  Treat P problems as genuinely tractable.  Build accordingly.

The day the equality flips, every line of code changes.  Until that day, the line between the two classes is the line that matters.`
  },

  // ─────────────────────── Part II — P, with Rust ───────────────────────
  {
    title: 'Sorting and order statistics',
    tldr: 'Sorting is in P.  The comparison-based ceiling is O(n log n), and Rust\'s std::sort hits it.',
    gesture: 'Sorting is the canonical P problem — and the place where the standard library is almost always the right answer.',
    body: `Comparison-based sorting has a proven lower bound of Ω(n log n) — any algorithm that compares pairs of elements must do at least that many comparisons on some input.  Merge sort, heap sort, and well-implemented quicksort hit the bound.  Rust's \`slice::sort\` uses a stable adaptive merge sort (Timsort-derived); \`slice::sort_unstable\` uses pattern-defeating quicksort (pdqsort) with O(n log n) worst case.  When the elements are integers or floats with bounded ranges, you can break the comparison bound — radix sort runs in O(nk) where k is the key width.  Order statistics (the kth-smallest) run in O(n) expected via quickselect or O(n) worst-case via median-of-medians.  Use the standard library unless you can prove a specialized routine wins.`,
    citation: 'Knuth, D. E. (1998). *The Art of Computer Programming, Volume 3: Sorting and Searching,* 2nd ed.  Sedgewick, R., Wayne, K. (2011). *Algorithms,* 4th ed.',
    link: 'https://doc.rust-lang.org/std/primitive.slice.html#method.sort_unstable',
    eli5: `Sorting is the most studied algorithm in computer science.  Generations of textbooks open with it.  The reason is that it is simple to state, easy to mess up, and the right answer reveals a deep structural fact: comparison-based sorting cannot beat n log n.

The proof is a decision-tree argument.  Each comparison of two elements has two outcomes.  A sorting algorithm distinguishes all n-factorial possible permutations.  A binary tree that distinguishes n! leaves has depth at least log₂(n!) ≈ n log n.  So at least one input forces n log n comparisons on any comparison-based sorter.  This is one of the cleanest lower bounds in the field.

When you do not need to compare — when the keys are bounded-width integers or strings — you can sort in linear time using radix sort, counting sort, or bucket sort.  These dodge the bound by exploiting key structure, not by being cleverer at comparing.

For Rust, the practical answer is almost always \`slice::sort_unstable\` for performance or \`slice::sort\` for stability.  The standard library implementations are extensively tuned, branch-predicted, and benchmark-driven.  Hand-rolling a sorter rarely beats them.  When you need a custom comparator, pass a closure.  When you need partial sorting, use \`select_nth_unstable\` for the kth element in linear time.

For radix sort and other non-comparison sorters on integer data, the \`radsort\` and \`rdxsort\` crates exist.  They are worth reaching for when you have tens of millions of keys.

The lesson sorting teaches the rest of this book is that classes have lower bounds.  Knowing the bound tells you when to stop optimizing.  When the standard library hits the bound, hand-rolling does not.

Stop sorting your own sorts.  Use the std.`
  },
  {
    title: 'Graph traversal — BFS and DFS',
    tldr: 'Both linear.  The choice between them is about what order you want, not whether the problem is in P.',
    gesture: 'BFS and DFS are O(V + E).  Most P-class graph problems are a traversal plus bookkeeping.',
    body: `Breadth-first search and depth-first search both visit every vertex and every edge of a graph in O(V + E) time.  BFS uses a FIFO queue and discovers vertices in order of distance from the source — it computes shortest paths in unweighted graphs.  DFS uses an LIFO stack (or recursion) and discovers vertices along one branch as far as possible before backtracking — it computes finishing times, articulation points, bridges, strongly connected components, and topological orderings.  In Rust, \`petgraph::visit\` provides \`Bfs\`, \`Dfs\`, and \`DfsPostOrder\` iterators that work on any graph type implementing \`IntoNeighbors\`.  Whenever a graph problem can be solved by a single traversal plus constant-time per-vertex work, the problem is in P.`,
    citation: 'Cormen, T. H., Leiserson, C. E., Rivest, R. L., Stein, C. (2009). *Introduction to Algorithms,* 3rd ed., Chapter 22.',
    link: 'https://docs.rs/petgraph/latest/petgraph/visit/index.html',
    eli5: `A graph is a set of vertices connected by edges.  Almost every interesting question you can ask about a graph reduces to "visit the vertices in some order and remember what you saw."  Two orders dominate.

Breadth-first search visits vertices in waves.  Start at the source.  Visit all neighbors of the source.  Then all neighbors of those neighbors that have not yet been seen.  Then the next wave.  Because BFS visits vertices in order of edge-distance from the source, it solves the shortest-path problem on unweighted graphs in one pass.  Maze-solving, peer-to-peer broadcasting, social-network friend-of-friend search — all BFS.

Depth-first search picks one neighbor, follows it as far as possible, then backtracks.  DFS visits vertices in an order that captures tree structure — entry and exit times, ancestor relationships, back edges.  This is the right tool for cycle detection, topological sort, strongly connected components (Tarjan, Kosaraju), articulation points, bridges, and biconnected components.

In Rust, \`petgraph\` is the graph crate.  Its \`visit\` module exposes BFS and DFS as iterators.  Build a graph with \`Graph\` or \`StableGraph\`, then traverse with \`Bfs::new(&g, start)\` or \`Dfs::new(&g, start)\`.  The traversal returns vertex indices in visit order; you decorate them however your problem demands.

The reason both traversals are in P is that every vertex and edge is touched a constant number of times.  Linear in the input size.  When a graph problem reduces to a single traversal with constant per-step work, it is in P.  When it requires exponentially many traversals — try every permutation, every subset — it lives in NP-complete territory.

The discipline is to ask, before writing any code: can I solve this with one BFS or one DFS?  If yes, do that.`
  },
  {
    title: 'Dijkstra — shortest path with non-negative weights',
    tldr: 'O((V + E) log V) with a binary heap.  petgraph and pathfinding both ship it.',
    gesture: 'Dijkstra 1959 — the single-source shortest-path algorithm that defines the P-class shape.',
    body: `Edsger Dijkstra's 1959 algorithm finds shortest paths from a source vertex to every other vertex in a graph with non-negative edge weights.  It maintains a tentative-distance table and repeatedly extracts the unvisited vertex with the smallest tentative distance, relaxing its outgoing edges.  With a binary heap the running time is O((V + E) log V); with a Fibonacci heap it improves to O(V log V + E).  Negative edges break the algorithm — use Bellman-Ford instead.  In Rust, \`petgraph::algo::dijkstra\` returns a HashMap of distances; \`pathfinding::directed::dijkstra::dijkstra\` returns both the path and the cost given a successor closure.  For pathfinding with a heuristic, A* is the same algorithm with priority biased by an admissible estimate of remaining distance.`,
    citation: 'Dijkstra, E. W. (1959). *A Note on Two Problems in Connexion with Graphs.* Numerische Mathematik 1: 269–271.',
    link: 'https://docs.rs/petgraph/latest/petgraph/algo/dijkstra/fn.dijkstra.html',
    eli5: `Edsger Dijkstra came up with the algorithm in twenty minutes at a café in Amsterdam, designing a demo for a new computer.  He wanted something that looked impressive and was easy to explain.  Sixty-five years later it is the foundation of every routing system, every map application, every game pathfinder.

The intuition is greedy with a guarantee.  Maintain a set of vertices whose final shortest distance from the source is known.  Initially that set contains only the source.  Among all vertices not yet in the set, pick the one with the smallest tentative distance — that distance is final, because any other path to it would have to go through an unvisited vertex with already-larger tentative distance, and adding more non-negative edges only makes it longer.  Add that vertex to the set.  Update tentative distances for its neighbors.  Repeat.

The non-negativity assumption is load-bearing.  With a negative edge, a longer path can become shorter than a shorter path by traversing a negative-weight detour.  Dijkstra's greedy commitment to the smallest tentative distance becomes wrong.  For graphs with negative edges, use Bellman-Ford.  For graphs with negative cycles, the shortest-path problem is ill-defined and Bellman-Ford reports it.

In Rust, the cleanest API is \`pathfinding::directed::dijkstra::dijkstra\`, which takes a start node, a successor closure that returns neighbors and edge weights, and a goal closure.  \`petgraph::algo::dijkstra\` is good when your graph is already built and you want all distances.  For A*, \`pathfinding\` offers \`astar\` with the same shape plus a heuristic closure.

When you see a shortest-path problem with non-negative weights, you are in P, and you reach for one of these two crates.  Hand-rolling Dijkstra is a learning exercise, not a production answer.

Find the path.  Move on.`
  },
  {
    title: 'Bellman-Ford — shortest path with negative weights',
    tldr: 'O(VE).  Slower than Dijkstra but handles negative edges and detects negative cycles.',
    gesture: 'When the edges can be negative, drop Dijkstra and do V−1 passes of edge relaxation.',
    body: `The Bellman-Ford algorithm computes single-source shortest paths in a graph that may contain negative edge weights.  It performs V−1 passes over all edges, relaxing each edge once per pass; after V−1 passes, every shortest-path distance is correct unless a negative cycle is reachable from the source.  A final pass checks for further relaxation — if any edge still tightens, a negative cycle exists.  Running time is O(VE).  It is named for Richard Bellman (1958) and L. R. Ford Jr. (1956), with Shimbel (1955) sometimes added.  In Rust, \`petgraph::algo::bellman_ford\` returns distances and predecessors, or an error if a negative cycle is found.  Distance-vector routing protocols (RIP) are practical applications.`,
    citation: 'Bellman, R. (1958). *On a Routing Problem.* Quarterly of Applied Mathematics 16: 87–90.  Ford, L. R. Jr. (1956). *Network Flow Theory.* RAND Corporation.',
    link: 'https://docs.rs/petgraph/latest/petgraph/algo/bellman_ford/fn.bellman_ford.html',
    eli5: `Most shortest-path discussions stop at Dijkstra.  Bellman-Ford is the algorithm you reach for when Dijkstra's assumption — no negative edges — does not hold.

Negative edges show up more than you expect.  Currency exchange arbitrage: take the negative log of each exchange rate and a negative cycle is a profit cycle.  Financial netting: balances can be either direction.  Time-shifted scheduling: doing a task earlier may save cost.  Constraint difference systems: every \`x_i − x_j ≤ c_ij\` translates to an edge of weight \`c_ij\`, and the constraint system is feasible exactly when the resulting graph has no negative cycle.

The algorithm is simpler than Dijkstra.  Initialize all distances to infinity, source to zero.  For V−1 rounds, walk through every edge and relax it — if the distance to its tail plus the edge weight is less than the distance to its head, update.  After V−1 rounds, every shortest path that uses at most V−1 edges has been relaxed.  Any simple shortest path uses at most V−1 edges, so we are done.  If a final round still relaxes, there is a negative cycle reachable from the source.

The O(VE) cost is the price of generality.  In sparse graphs it is competitive; in dense graphs it is much slower than Dijkstra.  When negative edges exist but are rare, the SPFA variant (Shortest Path Faster Algorithm) often runs faster in practice, though its worst case is the same.

In Rust, \`petgraph::algo::bellman_ford\` is the direct call.  The return type is a Result that captures negative-cycle detection — pattern match on it to handle both outcomes.  For systems-of-difference-constraints feasibility, build the constraint graph and call bellman-ford; the success/failure of the call is your answer.

Negative-edge shortest path stays in P.  The right tool is just slower than Dijkstra.  Reach for it deliberately.`
  },
  {
    title: 'Floyd-Warshall — all-pairs shortest paths',
    tldr: 'O(V³).  Dense graphs love it.  Three nested loops and you have every pair distance.',
    gesture: 'When you want every distance to every other vertex, Floyd-Warshall is three loops and a table.',
    body: `Floyd-Warshall computes shortest paths between every pair of vertices in O(V³) time and O(V²) space.  Robert Floyd published the form most commonly used in 1962, building on a transitive-closure algorithm by Stephen Warshall the same year.  The algorithm fills a V×V distance matrix by considering each vertex k as a potential intermediate node: for every pair (i, j), test whether going through k is shorter than the current best.  Three nested loops, k outermost.  The algorithm handles negative edge weights but not negative cycles — a negative diagonal entry after completion signals one.  In Rust, \`pathfinding::matrix::matrix\` plus a Floyd-Warshall pass works, or the \`petgraph::algo::floyd_warshall\` function returns the distance matrix directly.  When V is small and the graph is dense, this is the right tool.`,
    citation: 'Floyd, R. W. (1962). *Algorithm 97: Shortest Path.* Communications of the ACM 5(6): 345.  Warshall, S. (1962). *A Theorem on Boolean Matrices.* JACM 9(1): 11–12.',
    link: 'https://docs.rs/petgraph/latest/petgraph/algo/floyd_warshall/fn.floyd_warshall.html',
    eli5: `The Floyd-Warshall algorithm is the most elegant graph algorithm in the canon.  Three nested for-loops over the vertices, one assignment in the middle, and you have the shortest distance between every pair of vertices.  It is the canonical example of dynamic programming on graphs.

The key insight is the order of the outer loop.  Vertices are numbered 1 through V.  After iteration k, the distance matrix entry D[i][j] holds the length of the shortest path from i to j whose internal vertices are all drawn from \`{1, 2, ..., k}\`.  When k = V, the constraint is empty and D holds true shortest paths.  The recurrence is simply: D[i][j] = min(D[i][j], D[i][k] + D[k][j]).

The O(V³) cost is the algorithm's defining feature.  For dense graphs with V in the low hundreds, this is faster than running Dijkstra V times.  For sparse graphs with V in the thousands, running Dijkstra V times (Johnson's algorithm, properly) wins.

The same loop structure also computes transitive closure (replace min/plus with or/and), maximum-capacity paths (replace min/plus with max/min), and matrix multiplication in the tropical semiring.  When you see the pattern, it shows up everywhere.

In Rust, \`petgraph::algo::floyd_warshall\` is the easy call.  Pass a graph and an edge cost function; receive a HashMap from (NodeIndex, NodeIndex) to weight.  For dense graphs where you want a literal V×V matrix in memory, use \`ndarray\` or a flat Vec and write the three loops by hand — it is short enough that hand-rolling is reasonable and the access pattern is cache-friendly.

The lesson is structural.  Whenever you see "every pair," ask whether you can fill a table.  When you can, you are in P.`
  },
  {
    title: 'Minimum spanning tree',
    tldr: 'Kruskal sorts edges and union-finds them.  Prim grows a tree.  Both O(E log V).',
    gesture: 'Connect every vertex with the cheapest edges that form no cycle — a textbook P problem.',
    body: `A minimum spanning tree of a connected weighted graph is a subset of edges that connects all vertices with the minimum total edge weight.  Kruskal's algorithm (1956) sorts edges by weight and adds them in order, skipping any that would form a cycle — efficient cycle detection uses union-find with path compression and union by rank, yielding O(E log V) or near-linear with the inverse Ackermann factor.  Prim's algorithm (1957, rediscovered Dijkstra 1959) grows the tree from a starting vertex, repeatedly adding the cheapest edge that connects the tree to a new vertex — O(E log V) with a heap.  Borůvka's algorithm (1926) parallelizes well.  In Rust, \`petgraph::algo::min_spanning_tree\` returns an iterator of edges forming the MST.`,
    citation: 'Kruskal, J. B. (1956). *On the Shortest Spanning Subtree of a Graph and the Traveling Salesman Problem.* Proceedings of the AMS.  Prim, R. C. (1957). *Shortest Connection Networks and Some Generalisations.* Bell System Technical Journal.',
    link: 'https://docs.rs/petgraph/latest/petgraph/algo/fn.min_spanning_tree.html',
    eli5: `You have a set of cities and a list of roads with costs.  You want every city connected, with the smallest total road cost.  Every road added has to bring at least one previously-unconnected city online; if it forms a cycle, you are paying for redundancy.

This is the minimum spanning tree problem, and it is one of the cleanest examples of a greedy algorithm provably finding the optimal answer.  The structural fact that makes it work is the cut property: for any partition of the vertices into two sets, the minimum-weight edge crossing the partition is in some MST.  Both Kruskal and Prim are greedy applications of the cut property.

Kruskal processes edges in sorted order.  An edge is added if its endpoints are in different components, then the two components are merged.  Detecting "different components" is the union-find data structure: each vertex starts in its own component, find returns the root, union merges two components.  Path compression and union-by-rank make the operations nearly constant time amortized.

Prim grows one tree.  Start at any vertex.  Maintain a priority queue of edges crossing the tree boundary.  Pop the minimum-weight edge; if its outer endpoint is not yet in the tree, add it and add all its new boundary edges.  The structure is identical to Dijkstra with a different relaxation rule.

Borůvka is the parallel-friendly cousin.  Every component picks its cheapest outgoing edge simultaneously; all chosen edges are added; components merge.  Repeat until one component remains.  Useful on GPUs.

In Rust, \`petgraph::algo::min_spanning_tree\` gives you Kruskal's output; \`min_spanning_tree_prim\` uses Prim's.  Both work on any graph implementing the required traits.

Steiner tree is the same problem with a twist — you only need to connect a subset of vertices, and you may include others as relays.  Adding that twist breaks the greedy structure and pushes the problem into NP-complete territory.  See page 38.

The MST is in P because the greedy works.  The Steiner tree is NP-complete because it doesn't.`
  },
  {
    title: 'Max-flow and min-cut',
    tldr: 'Ford-Fulkerson is the framework.  Edmonds-Karp is O(VE²).  Dinic is O(V²E).  All in P.',
    gesture: 'The duality between flow and cut is the deepest theorem in graph algorithms, and the engine behind a dozen P-class reductions.',
    body: `The max-flow problem asks for the maximum rate of flow from a source to a sink through a directed graph with edge capacities.  The min-cut problem asks for the minimum total capacity of edges whose removal disconnects source from sink.  Ford and Fulkerson proved in 1956 that the two are equal — the max-flow min-cut theorem.  The Ford-Fulkerson method augments flow along an arbitrary path of remaining capacity until none exists; choosing shortest augmenting paths gives the Edmonds-Karp algorithm at O(VE²) (1972).  Dinic's algorithm uses level graphs and blocking flows to reach O(V²E) (1970).  Modern push-relabel variants achieve O(V³) and are fast in practice.  In Rust, \`petgraph::algo::ford_fulkerson\` is a starting point; production work often calls out to highs or LEMON via FFI.`,
    citation: 'Ford, L. R., Fulkerson, D. R. (1956). *Maximal Flow Through a Network.* Canadian Journal of Mathematics 8: 399–404.  Edmonds, J., Karp, R. M. (1972). *Theoretical Improvements in Algorithmic Efficiency for Network Flow Problems.* JACM 19(2): 248–264.',
    link: 'https://docs.rs/petgraph/latest/petgraph/algo/ford_fulkerson/fn.ford_fulkerson.html',
    eli5: `Imagine a network of pipes from a source to a sink.  Each pipe has a capacity.  You want to push as much water from source to sink as the network allows.

The max-flow min-cut theorem says: the maximum water you can push equals the minimum total capacity of any set of pipes whose removal disconnects source from sink.  Cut the bottleneck; the bottleneck is the bound.  This duality is one of the deepest results in combinatorial optimization, and it powers an enormous range of algorithms.

The Ford-Fulkerson method computes max-flow by repeatedly finding an augmenting path — a path from source to sink with remaining capacity — and pushing flow along it.  The trick is that the algorithm also maintains a residual graph that allows flow to be "undone" by sending counter-flow.  When no augmenting path exists in the residual graph, the flow is maximum and the set of vertices reachable from the source in the residual graph defines a minimum cut.

Edmonds-Karp specifies: always pick the shortest augmenting path (BFS).  This bounds the number of augmentations and yields a polynomial running time.  Dinic refines further by processing all shortest paths of a given length at once via blocking flows on a level graph.

The deeper value of max-flow is that many other problems reduce to it.  Bipartite matching is max-flow on the bipartite graph with unit-capacity edges.  Image segmentation is min-cut on a pixel-similarity graph.  Project selection, sports elimination, baseball-elimination problems, assignment problems — all reduce to max-flow.  When you spot a flow structure, you have spotted P.

In Rust, \`petgraph::algo::ford_fulkerson\` works for small instances.  For larger networks, the practical move is to model the problem as a min-cost flow LP and hand it to \`good_lp\` with the highs backend, or call out to a dedicated solver via FFI.

Flow is in P.  Reduce to flow.`
  },
  {
    title: 'Bipartite matching',
    tldr: 'Hopcroft-Karp runs in O(E√V).  The Hungarian algorithm handles weighted matching in O(V³).',
    gesture: 'Pair up two sides as much as possible — a P-class workhorse that reduces from flow.',
    body: `A matching in a bipartite graph (vertices split into two sets U and V with edges only between sets) is a set of edges with no shared endpoints.  Maximum bipartite matching is solvable in polynomial time: reduce to max-flow with unit capacities, or use the specialized Hopcroft-Karp algorithm at O(E√V) (1973).  For weighted bipartite matching — find a perfect matching minimizing or maximizing total edge weight — the Hungarian algorithm (Kuhn 1955, Munkres 1957) runs in O(V³).  König's theorem (1931) provides the deep structural result: minimum vertex cover equals maximum matching in bipartite graphs.  In Rust, \`pathfinding::matrix::kuhn_munkres\` and \`pathfinding::matrix::kuhn_munkres_min\` solve the assignment problem; \`pathfinding\` also offers unweighted bipartite matching utilities.`,
    citation: 'Hopcroft, J. E., Karp, R. M. (1973). *An n^5/2 Algorithm for Maximum Matchings in Bipartite Graphs.* SIAM Journal on Computing 2(4): 225–231.  Kuhn, H. W. (1955). *The Hungarian Method for the Assignment Problem.* Naval Research Logistics 2.',
    link: 'https://docs.rs/pathfinding/latest/pathfinding/kuhn_munkres/index.html',
    eli5: `A bipartite graph has two sides.  Imagine candidates on the left and jobs on the right, with an edge between a candidate and a job whenever the candidate is qualified for it.  You want to pair up as many candidates with jobs as possible, no candidate to more than one job, no job to more than one candidate.

This is bipartite matching, and it is in P.  The first proof was constructive: model the bipartite graph as a flow network with a super-source connected to all left vertices, all right vertices connected to a super-sink, all edges with capacity one.  Max-flow on this network equals max-matching, and any of the polynomial flow algorithms solves it.

Hopcroft and Karp in 1973 noticed that flow on a unit-capacity bipartite graph admits a faster specialized algorithm.  Their method finds multiple shortest augmenting paths per round via BFS, runs O(√V) rounds, and totals O(E√V).  For dense bipartite graphs with thousands of vertices on each side, this is much faster than generic flow.

The weighted version — every edge has a cost, you want a perfect matching minimizing total cost — is the assignment problem.  Solved by the Hungarian algorithm in O(V³).  The classical applications are personnel assignment, machine-job scheduling, transportation problems.

König's theorem connects matching to vertex cover.  In a bipartite graph, the minimum number of vertices needed to cover every edge equals the maximum matching size.  This is a structural fact unique to bipartite graphs — for general graphs vertex cover is NP-complete (page 27) but matching is still in P (page 14).  The bipartite structure changes the class.

In Rust, \`pathfinding::kuhn_munkres::kuhn_munkres\` and \`kuhn_munkres_min\` solve the assignment problem given a cost matrix.  For unweighted maximum matching, model as flow with \`petgraph\` or hand-roll Hopcroft-Karp — it is about a hundred lines.

Bipartite matching is in P.  Three-dimensional matching is NP-complete.  Two sides P, three sides NP-complete.  See page 38.`
  },
  {
    title: 'General matching — Edmonds blossom',
    tldr: 'Maximum matching in any graph, not just bipartite, in polynomial time.  Edmonds 1965 is the surprise.',
    gesture: 'The "wait, that\'s in P?" result.  Edmonds 1965 shows odd cycles do not push matching out of P.',
    body: `Jack Edmonds proved in 1965 that maximum matching in a general graph — not just bipartite — is solvable in polynomial time.  The blossom algorithm runs in O(V³) and the Micali-Vazirani 1980 refinement reaches O(E√V).  The key idea is the blossom: an odd-length cycle reachable by an alternating path.  Bipartite-style augmenting-path search fails on odd cycles, but Edmonds showed that contracting each blossom into a single vertex preserves the matching's maximum and lets the augmenting-path search continue.  When the search finishes, blossoms are expanded back to recover the matching.  The result was historically important — Edmonds's paper introduced the notion of "polynomial time" as the dividing line between tractable and intractable.  In Rust, \`petgraph::algo::matching::maximum_matching\` implements the blossom algorithm.`,
    citation: 'Edmonds, J. (1965). *Paths, Trees, and Flowers.* Canadian Journal of Mathematics 17: 449–467.  Micali, S., Vazirani, V. V. (1980). *An O(√|V|·|E|) Algorithm for Finding Maximum Matching in General Graphs.* FOCS.',
    link: 'https://docs.rs/petgraph/latest/petgraph/algo/matching/fn.maximum_matching.html',
    eli5: `Bipartite matching is easy in retrospect.  Two sides, no odd cycles, augmenting paths just work.  General-graph matching looked harder for decades, because the moment a graph contains an odd cycle, augmenting-path search can fail in a specific way.

The pathological pattern is an odd cycle reached by an alternating path — alternating between matched and unmatched edges.  Edmonds called this a blossom.  Inside the blossom, you can reach the same vertex through either two paths of different parities, so the usual "is this vertex already on the path?" check breaks the search.

Edmonds's contribution was twofold.  First, he found the right operation: contract the blossom into a single super-vertex.  Now augmenting-path search proceeds on the contracted graph.  When an augmenting path is found, expand blossoms back along the path to recover the actual augmentation in the original graph.  Second — and this is the part that mattered for the field — he wrote his 1965 paper as an argument for polynomial time itself as the right definition of "efficient."  Before Edmonds, "efficient" was informal.  After him, it meant P.

The blossom algorithm runs in O(V·E·α(V)) or O(V³) depending on the variant.  Micali-Vazirani 1980 brought it down to O(E√V), matching Hopcroft-Karp's bound for bipartite matching.  Both are practical.

The reason general matching matters operationally is that real graphs are rarely bipartite.  Roommate assignment is general matching.  Stable roommates (a different problem — see Irving 1985) is general matching with preferences.  Maximum matching in general graphs sits in P alongside bipartite matching, just with more machinery.

The contrast that teaches the lesson: general-graph matching is in P, but general-graph three-dimensional matching is NP-complete.  Two-dimensional structure with odd cycles is still P; three-dimensional structure is not.  See page 38.

In Rust, \`petgraph::algo::matching::maximum_matching\` runs the blossom algorithm on any UnGraph.  Pass the graph; receive the matching as a set of edge pairs.  Production-ready.

Odd cycles do not push you out of P.  They just push you into harder data structures.`
  },
  {
    title: '2-SAT — boolean satisfiability with two literals per clause',
    tldr: 'Linear time via strongly connected components.  The width of the clauses changes the class.',
    gesture: '2-SAT in P, 3-SAT NP-complete — one literal per clause separates the two classes.',
    body: `A 2-CNF Boolean formula is a conjunction of clauses each containing exactly two literals.  Determining satisfiability of a 2-CNF formula is solvable in linear time, despite being a restriction of SAT.  Aspvall, Plass, and Tarjan published the algorithm in 1979.  Build an implication graph: for each clause (a ∨ b) add edges (¬a → b) and (¬b → a).  Compute strongly connected components (Tarjan's algorithm, linear time).  The formula is unsatisfiable iff some variable and its negation lie in the same SCC.  Otherwise, a satisfying assignment is recovered from the topological order of components.  In Rust, build the implication graph with \`petgraph\` and call \`petgraph::algo::tarjan_scc\`.  The cleanest application: scheduling with two-choice constraints.`,
    citation: 'Aspvall, B., Plass, M. F., Tarjan, R. E. (1979). *A Linear-Time Algorithm for Testing the Truth of Certain Quantified Boolean Formulas.* Information Processing Letters 8(3): 121–123.',
    link: 'https://en.wikipedia.org/wiki/2-satisfiability',
    eli5: `Boolean satisfiability — given a logical formula, can it be made true? — is the canonical NP-complete problem.  Cook proved it in 1971.  3-SAT, the restriction to three literals per clause, is also NP-complete.  Naively you would expect 2-SAT to be just as hard, only with a tighter restriction.  It is not.  2-SAT is in P.  Linear time.

The reason is structural.  A 2-clause (a ∨ b) is equivalent to two implications: ¬a → b and ¬b → a.  Build a directed graph with one node per literal (variables and their negations), and one edge per implication.  The formula is unsatisfiable exactly when some variable x and its negation ¬x are forced into the same strongly connected component — because then the formula requires both x and ¬x to be true.

Strongly connected components are computable in linear time by Tarjan's algorithm (1972) or Kosaraju's algorithm.  Walk the SCCs once.  Check that no variable and its negation share a component.  If they do, unsatisfiable.  If they don't, recover an assignment by topological order over the SCCs — assign true to each variable whose negation's SCC comes before its own.

The transition from 2-SAT to 3-SAT is dramatic.  Two literals per clause gives implications, and implications give a graph, and graphs are in P.  Three literals per clause does not — a 3-clause has eight possible implications but they are non-deterministic, and no analogous structural collapse is known.  Three is the boundary.

In Rust, the build is direct.  Use \`petgraph::Graph\` for the implication structure, call \`petgraph::algo::tarjan_scc\`, then check the partition.  The whole thing is fewer than fifty lines.

When you spot a problem that decomposes into "for each constraint, exactly one of two things must hold," try modeling it as 2-SAT.  You may be in P and not realize it.  See page 38 for the 2-SAT vs 3-SAT line.`
  },
  {
    title: 'Topological sort and DAG dynamic programming',
    tldr: 'Linear time on a DAG.  Open the door to single-source longest path, counting paths, and reachability.',
    gesture: 'When the graph is a DAG, everything is in P — topological order is the key that unlocks the DP.',
    body: `A topological ordering of a directed acyclic graph is a linear order of its vertices such that every edge points from earlier to later in the order.  Kahn's algorithm (1962) constructs one in O(V + E) by repeatedly removing source vertices with no incoming edges.  DFS-based topological sort uses finishing-time order and is equally fast.  A directed graph has a topological order iff it is acyclic.  Once you have the order, dynamic programming on the DAG runs in linear time: longest path, shortest path with negative edges, number of distinct paths from source to sink, single-source shortest path even with negative weights — all solvable by one pass over vertices in topological order.  In Rust, \`petgraph::algo::toposort\` returns the ordering or an error if a cycle exists.`,
    citation: 'Kahn, A. B. (1962). *Topological Sorting of Large Networks.* Communications of the ACM 5(11): 558–562.',
    link: 'https://docs.rs/petgraph/latest/petgraph/algo/fn.toposort.html',
    eli5: `A directed acyclic graph — DAG — is a directed graph with no cycles.  Many real things are DAGs: build dependency graphs, course prerequisites, task scheduling with precedence constraints, computation graphs, expression trees, version histories that respect time.

The defining property of a DAG is the existence of a topological order.  A topological order is a linear arrangement of the vertices such that every edge points forward.  Computing one is linear: repeatedly find a vertex with no incoming edges, output it, remove it and its outgoing edges.  Kahn's algorithm formalizes this.  DFS gives the same answer via reverse finishing times.

The reason topological order matters is that it unlocks dynamic programming on the graph.  Many problems on general graphs are hard — longest path is NP-complete in general — but on DAGs they collapse to a linear pass.  To compute the longest path ending at each vertex, process vertices in topological order and set dp[v] = 1 + max over incoming edges of dp[u].  Same shape for shortest path with negative edges (no negative cycles can exist in a DAG), number of paths, expected reward in a stochastic DAG, and many others.

The class flip from general graphs to DAGs is the same flip you see in the dividing-line pairs (page 38): adding or removing one structural constraint changes the algorithmic problem completely.  Cycles are the hard part.  Acyclicity removes them.

In Rust, \`petgraph::algo::toposort\` returns a Vec of NodeIndex in topological order, or an \`Error::Cycle\` if no order exists.  Pair it with a manual DP loop over the returned order to solve almost any DAG-restricted question.

If your problem lives on a DAG, you are in P.  If you can prove the natural graph is a DAG, you can stop looking for harder tools.`
  },
  {
    title: 'String matching',
    tldr: 'KMP, Boyer-Moore, Aho-Corasick.  Rust has aho-corasick, regex, memchr, bstr — pick the fit.',
    gesture: 'Finding a pattern in a text is linear in the text length — and Rust has crates for every variant.',
    body: `Single-pattern string matching is solvable in O(n + m) time on a text of length n with a pattern of length m using the Knuth-Morris-Pratt algorithm (1977).  Boyer-Moore (1977) is sublinear in many practical cases.  Multiple-pattern matching uses the Aho-Corasick automaton (1975), which finds occurrences of any of k patterns in O(n + Σmᵢ + matches).  Regular expression matching with backreferences is NP-hard; without backreferences it is in P via NFA simulation, O(nm).  In Rust, the canonical crates are \`aho-corasick\` for multi-pattern, \`regex\` for regular expressions, \`memchr\` for byte-level scans, and \`bstr\` for byte-string operations.  The standard library's \`str::find\` and \`str::contains\` use SIMD when the pattern is short enough.`,
    citation: 'Knuth, D. E., Morris, J. H., Pratt, V. R. (1977). *Fast Pattern Matching in Strings.* SIAM Journal on Computing 6(2): 323–350.  Aho, A. V., Corasick, M. J. (1975). *Efficient String Matching: An Aid to Bibliographic Search.* Communications of the ACM 18(6).',
    link: 'https://docs.rs/aho-corasick/latest/aho_corasick/',
    eli5: `Finding a substring in a text is so common that most people never stop to ask its complexity.  The naive method — slide the pattern across the text, compare each position — is O(nm).  Linear-time algorithms cut this to O(n + m) by avoiding redundant comparisons.

KMP precomputes, for each position in the pattern, the length of the longest proper prefix that is also a suffix.  When a mismatch occurs at pattern position j, the algorithm shifts the pattern by j minus that prefix-suffix length, never re-examining text characters.  The result is linear in the text length, regardless of how bad the pattern is.

Boyer-Moore goes the other direction.  It scans the pattern right-to-left and uses two heuristics — bad-character and good-suffix — to skip large stretches of text on a mismatch.  Worst case is the same as KMP but practical performance on natural text is often O(n/m), strictly sublinear.  Most production grep implementations use a Boyer-Moore variant.

Aho-Corasick generalizes KMP to multiple patterns.  Build a trie of patterns, add failure links between nodes (like KMP's prefix function but on the trie), and walk the trie while scanning the text.  Every occurrence of any pattern is reported in one pass.  This is the right tool for keyword scanning, dictionary matching, virus signatures.

In Rust, \`aho-corasick\` is the production answer for multi-pattern.  \`regex\` is the standard regular-expression engine, NFA-based, linear in text length when the regex avoids backreferences.  \`memchr\` does byte-level search with SIMD acceleration.  \`bstr\` extends it to byte-string operations.

Regular expression matching with backreferences (PCRE-style) is NP-hard.  Most Rust regex crates deliberately exclude backreferences for this reason.  When you see a regex flavor that supports them and your input is adversarial, you can construct an input that takes exponential time.  Use Rust's \`regex\` and stay in P.

String matching is in P.  Use the crates.`
  },
  {
    title: 'Edit distance and sequence alignment',
    tldr: 'Wagner-Fischer DP, O(nm).  strsim has it, plus Jaro-Winkler and Damerau-Levenshtein.',
    gesture: 'How many edits separate two strings — and the DP that answers in polynomial time.',
    body: `The Levenshtein edit distance between two strings is the minimum number of single-character insertions, deletions, or substitutions to transform one into the other.  Vladimir Levenshtein defined the metric in 1965; Wagner and Fischer published the O(nm) dynamic programming algorithm in 1974.  The DP fills an (n+1)×(m+1) table where entry (i,j) is the edit distance between the first i characters of one string and the first j of the other.  Space is reducible to O(min(n,m)) by keeping only the previous row.  Variants — Damerau-Levenshtein (adds transposition), Hamming (substitution only, equal lengths), longest common subsequence — all share the same DP shape.  In Rust, \`strsim\` exposes \`levenshtein\`, \`damerau_levenshtein\`, \`jaro\`, \`jaro_winkler\`, and others.`,
    citation: 'Wagner, R. A., Fischer, M. J. (1974). *The String-to-String Correction Problem.* JACM 21(1): 168–173.  Levenshtein, V. I. (1965). *Binary Codes Capable of Correcting Deletions, Insertions, and Reversals.* Doklady Akademii Nauk.',
    link: 'https://docs.rs/strsim/latest/strsim/',
    eli5: `Edit distance is the standard measure of how similar two strings are.  Spell checkers use it to find candidate corrections.  Bioinformatics tools use it (or its weighted cousin, sequence alignment) to compare DNA and protein sequences.  Diff tools use it to find minimal change sets between file versions.

The algorithm is the cleanest dynamic programming example in the textbook.  Fill a table of size (n+1) by (m+1).  Cell (0, j) is j and cell (i, 0) is i — that many insertions or deletions to align an empty prefix with j or i characters.  Cell (i, j) is the minimum of three candidates: (i−1, j) + 1 for a deletion, (i, j−1) + 1 for an insertion, (i−1, j−1) + (0 if characters match else 1) for a substitution or match.  The bottom-right corner is the answer.

The same DP shape solves many problems.  Longest common subsequence drops the substitution case.  Sequence alignment with custom substitution scores (BLAST, Smith-Waterman, Needleman-Wunsch) replaces the +1 with a scoring matrix.  Damerau-Levenshtein adds a fourth case for adjacent-character transposition.  Approximate string matching with bounded edits exploits the diagonal structure.

The space bound matters.  The full (n+1) × (m+1) table is fine for short strings but blows up at scale.  Because each cell depends only on the row above and the cell to the left, you can store only the previous row and overwrite — O(min(n, m)) space.  Recovering the actual edit script requires the full table or Hirschberg's divide-and-conquer trick.

In Rust, the \`strsim\` crate exposes a clean API for the standard metrics.  When you need scoring matrices, the \`bio\` crate provides sequence alignment routines.  For approximate string matching at scale, \`triple_accel\` uses SIMD and bit-parallel tricks.

Edit distance is in P with O(nm) DP.  The longest common subsequence has a celebrated lower bound of essentially the same — no truly subquadratic algorithm is known, and recent fine-grained complexity results suggest one cannot exist without breaking the Strong Exponential Time Hypothesis.

P is not always linear.  Quadratic is in P.  Decide accordingly.`
  },
  {
    title: 'Linear programming',
    tldr: 'Khachiyan 1979 proved LP is in P.  In Rust, good_lp with the highs backend is the production answer.',
    gesture: 'Continuous optimization with linear constraints is in P.  Add the integer requirement and you fall into NP-complete.',
    body: `Linear programming optimizes a linear objective over a polyhedron defined by linear inequality and equality constraints.  Dantzig published the simplex method in 1947 — exponential in the worst case but excellent in practice.  Leonid Khachiyan proved in 1979 that LP is in P via the ellipsoid algorithm; Narendra Karmarkar's 1984 interior-point method gave a practical polynomial-time alternative.  Modern solvers (HiGHS, Gurobi, CPLEX) use simplex and barrier methods together.  In Rust, \`good_lp\` is the canonical modeling crate, offering a problem-construction DSL on top of swappable backends including \`highs\`, \`microlp\`, \`coin_cbc\`, and \`scip\`.  LP relaxations of NP-complete integer problems often give strong bounds and feasible-region intuition even when the integer problem itself is intractable.`,
    citation: 'Dantzig, G. B. (1947). *The Simplex Method.* RAND.  Khachiyan, L. G. (1979). *A Polynomial Algorithm in Linear Programming.* Doklady Akademii Nauk SSSR.  Karmarkar, N. (1984). *A New Polynomial-Time Algorithm for Linear Programming.* Combinatorica 4.',
    link: 'https://docs.rs/good_lp/latest/good_lp/',
    eli5: `Linear programming is the workhorse of operations research.  The model is simple: pick values for a set of real variables, subject to linear inequality constraints, to maximize or minimize a linear objective.  Diet planning, blending problems, transportation problems, network flow LP duals, machine scheduling relaxations — an enormous fraction of practical optimization fits this shape.

For decades the standard algorithm was Dantzig's simplex method.  It walks the vertices of the feasible polyhedron, moving from one to an adjacent one with better objective value, until no better neighbor exists.  In the worst case (Klee-Minty 1972 constructed an n-cube example) simplex takes exponentially many steps.  In practice on random and real instances it is nearly always polynomial.

Khachiyan's ellipsoid algorithm in 1979 was the first proof that LP is in P at all.  It is too slow for practical use but mathematically essential — it showed the class.  Karmarkar's 1984 interior-point method gave a practical polynomial-time alternative and triggered a revolution in optimization.  Modern solvers fold simplex and interior-point together, switching between them based on instance shape.

In Rust, \`good_lp\` is the right starting point.  It models the LP in code — define variables, add constraints with operator overloading, set the objective — and dispatches to a backend solver.  HiGHS is the recommended open-source backend; it is fast, well-maintained, and supports both LP and MIP.  For embedded use, \`microlp\` is a pure-Rust simplex implementation.

LP shows up as a building block far beyond pure optimization.  LP duality is the language of certificates.  LP relaxations of NP-complete integer programs (page 32) give bounds on the optimal.  Total unimodularity of the constraint matrix is a sufficient condition for the LP optimum to be integer — this is why bipartite matching and shortest path can be modeled as LP and still be in P.

Linear programming is the boundary the rest of the book is mapped against.  Continuous variables stay in P.  Integer variables push you into NP-complete.  See page 38.`
  },
  {
    title: 'Convex optimization',
    tldr: 'Minimize a convex function over a convex set — interior-point methods, polynomial time.  Clarabel is the Rust solver.',
    gesture: 'Convexity is the structural property that keeps optimization in P.',
    body: `Convex optimization minimizes a convex objective function over a convex feasible set.  The defining property: any local minimum is a global minimum.  Linear programming is the simplest case; quadratic programming, second-order cone programming, and semidefinite programming extend the model.  Interior-point methods solve all of these in polynomial time given a self-concordant barrier function — Yurii Nesterov and Arkadi Nemirovski systematized the theory in 1994.  Stephen Boyd and Lieven Vandenberghe's 2004 textbook is the canonical reference.  In Rust, \`clarabel\` is a native conic interior-point solver supporting LP, QP, SOCP, SDP, and exponential and power cones.  \`argmin\` provides first-order methods (gradient descent, BFGS, Newton).  Convex problems show up in machine learning, signal processing, control, finance — everywhere a "best" answer must exist and be findable.`,
    citation: 'Boyd, S., Vandenberghe, L. (2004). *Convex Optimization.* Cambridge University Press.  Nesterov, Y., Nemirovski, A. (1994). *Interior-Point Polynomial Algorithms in Convex Programming.* SIAM.',
    link: 'https://oxfordcontrol.github.io/ClarabelDocs/',
    eli5: `Convex optimization is the broadest class of optimization problems that is reliably in P.  The key word is convex.  A set is convex if the line segment between any two of its points stays inside the set.  A function is convex if it lies below every chord — the line segment between two points on its graph never dips below the function.  Convex optimization minimizes a convex function over a convex set.

The structural fact that makes convex problems tractable is the absence of bad local minima.  In a convex problem, any local minimum is global.  Gradient descent and its variants cannot get stuck in a basin that is not the answer.  Newton's method, when applicable, converges quadratically.  Interior-point methods walk through the interior of the feasible set toward the optimum and provably terminate in polynomial iterations.

The hierarchy goes: LP (linear) ⊂ QP (linear constraints, quadratic objective) ⊂ SOCP (second-order cone) ⊂ SDP (semidefinite).  Each step adds expressiveness while staying in the convex world and staying in P.  Robust portfolio optimization sits in SOCP.  Sensor-network localization sits in SDP.  Logistic regression's loss is convex.  Support vector machines are QP.  Many regularized estimators in statistics and ML are convex.

In Rust, \`clarabel\` is the production convex solver — interior-point, handles cones beyond LP/QP/SOCP, well-documented, BSD-licensed.  \`good_lp\` covers LP and MIP.  \`argmin\` is the right home for first-order methods (gradient descent, L-BFGS, Newton, conjugate gradient).  For specific convex problems with structure — proximal methods, ADMM, mirror descent — \`argmin\` has the primitives.

When a problem is not convex, the world becomes harder very quickly.  Local minima multiply.  Initialization matters.  Heuristics enter.  Most of deep learning training is non-convex optimization with stochastic gradients and engineering luck.

If your problem is convex, you are in P and you should reach for a solver.  If it is not, the toolkit changes.  Page 36 covers metaheuristics for the non-convex case.

Convexity is the property.  Solvers do the rest.`
  },
  {
    title: 'Primality testing',
    tldr: 'Miller-Rabin is fast and probabilistic.  AKS proved primality is in P.  num-prime has both.',
    gesture: 'Is this number prime?  AKS 2002 proved the answer is in P.  Practically, you reach for Miller-Rabin.',
    body: `Determining whether an integer is prime is in P.  Manindra Agrawal, Neeraj Kayal, and Nitin Saxena proved it in 2002 with the AKS algorithm, deterministic polynomial time in the number of digits.  Practical primality testing uses Miller-Rabin (1976, 1980) — a probabilistic test that declares a composite "probably prime" with arbitrarily small error rate after enough rounds.  For numbers below 2⁶⁴, deterministic Miller-Rabin with a fixed small set of bases is known to be correct.  Baillie-PSW combines Miller-Rabin with a Lucas test and has no known counterexamples up to 2⁶⁴.  In Rust, \`num-prime\` exposes \`is_prime\` (Baillie-PSW) and \`is_prime_probabilistic\`, along with factorization and prime generation.  Primality testing is in P, but factoring — the basis of RSA — is conjectured not to be.`,
    citation: 'Agrawal, M., Kayal, N., Saxena, N. (2004). *PRIMES is in P.* Annals of Mathematics 160(2): 781–793.  Miller, G. L. (1976). *Riemann\'s Hypothesis and Tests for Primality.* JCSS 13(3).  Rabin, M. O. (1980). *Probabilistic Algorithm for Testing Primality.* Journal of Number Theory 12.',
    link: 'https://annals.math.princeton.edu/2004/160-2/p12',
    eli5: `For most of the twentieth century, deciding whether an integer is prime was widely conjectured to be in P, but no proof existed.  Probabilistic tests like Miller-Rabin (1976, 1980) were known and fast.  In 2002, three researchers at IIT Kanpur — Manindra Agrawal and two of his students, Neeraj Kayal and Nitin Saxena — published a deterministic polynomial-time primality test.  The AKS algorithm runs in time polynomial in the number of digits of the input.

AKS is a landmark theoretical result.  It closed a decades-old open question.  In practice, AKS is slow relative to Miller-Rabin, so production code almost always uses Miller-Rabin or a variant.  Miller-Rabin picks a random base a, computes a^(n−1) mod n, and checks against the Fermat test plus a refinement involving square roots of one.  For each round with random base, a composite passes with probability at most 1/4.  After k rounds, the probability of falsely calling a composite prime is at most 4^(−k).  For 64 rounds, the error rate is below 2^(−128) — far smaller than the probability of cosmic-ray bit flips in your hardware.

For deterministic answers on 64-bit integers, you do not even need randomness — fixed sets of bases are known to determine primality exactly.  For larger numbers, Baillie-PSW (Miller-Rabin base 2 plus a Lucas test) has no known counterexamples and is conjectured to be deterministic.

In Rust, \`num-prime\` is the right crate.  Its \`is_prime\` runs Baillie-PSW.  Its \`is_prime_probabilistic\` runs Miller-Rabin with a configurable number of rounds.  For arbitrary-precision integers, \`num-bigint\` interops cleanly.

Primality is in P.  Factoring is not known to be — every public-key cryptosystem built on factoring assumes it is genuinely hard.  Primality and factoring are different questions.  Primality you do.  Factoring you avoid.

The class boundary runs between them, not around them both.`
  },
  {
    title: 'Linear algebra as an algorithmic hammer',
    tldr: 'Matrix operations are in P.  PageRank, spectral graph methods, least squares — all reduce to linear algebra.',
    gesture: 'Many P-class problems become trivial once you spot the matrix.',
    body: `Matrix multiplication, matrix inverse, determinant, eigenvalues, and singular value decomposition are all computable in polynomial time.  Standard matrix multiplication is O(n³); Strassen (1969) is O(n^2.807); the current theoretical best is roughly O(n^2.37).  Solving Ax = b runs in O(n³) via LU decomposition.  Eigenvalues via QR iteration converge in practical polynomial time.  Many graph and combinatorial problems reduce to linear algebra: PageRank is the principal eigenvector of a Markov matrix (Page, Brin 1998).  Spectral clustering uses the eigenvectors of the graph Laplacian.  Counting spanning trees uses the Matrix-Tree theorem (Kirchhoff 1847).  Linear least squares is the normal equation solution.  In Rust, \`nalgebra\` and \`ndarray\` cover general linear algebra; \`faer\` is the high-performance dense linear algebra crate with parallel and SIMD-aware kernels.`,
    citation: 'Page, L., Brin, S., Motwani, R., Winograd, T. (1998). *The PageRank Citation Ranking: Bringing Order to the Web.* Stanford Technical Report.  Strassen, V. (1969). *Gaussian Elimination is not Optimal.* Numerische Mathematik 13.',
    link: 'https://docs.rs/faer/latest/faer/',
    eli5: `Linear algebra is the secret hammer.  Many problems that look combinatorial collapse to a matrix computation once you spot the structure.

PageRank ranks web pages by the principal eigenvector of a stochastic matrix derived from the link graph.  The Page-Brin paper from 1998 is one of the most cited papers in computer science.  The algorithm is power iteration: multiply a vector by the matrix repeatedly until it stops changing direction.  Converges quickly.  No combinatorial search.  Just matrices.

Spectral clustering uses the eigenvectors of the graph Laplacian to partition vertices into clusters with few edges between them.  The structural fact behind this is the Cheeger inequality, which bounds the conductance of the best graph cut by the second eigenvalue of the Laplacian.

The Matrix-Tree theorem of Kirchhoff (1847) says the number of spanning trees in a graph equals any cofactor of its Laplacian.  Computing a determinant is in P; counting spanning trees by enumeration is exponential.  Linear algebra collapses an apparently combinatorial count into a polynomial operation.

Least squares regression solves an overdetermined linear system by minimizing residuals — the normal equations or QR or SVD all give the same answer in polynomial time.  Principal component analysis is the SVD of a centered data matrix.  Recommender systems built on matrix factorization are constrained low-rank approximations.

In Rust, the linear algebra ecosystem has three main crates.  \`nalgebra\` is the general-purpose option, supports dense and sparse, fixed and dynamic sizes, well-documented.  \`ndarray\` mirrors NumPy's interface and is preferred when you want array semantics over linear algebra semantics.  \`faer\` is the high-performance option, especially for large dense problems — parallel kernels, SIMD-aware, competitive with LAPACK.

The lesson is structural.  When a problem can be encoded as Ax = b, eigenvalues, or matrix factorization, you are in P with strong constants.  When you spot the matrix, stop looking for the combinatorial algorithm.

Reach for the matrix.  The class follows.`
  },

  // ────────────── Part III — NP-complete, with Rust ──────────────
  {
    title: 'SAT solvers and CDCL',
    tldr: 'SAT is NP-complete but modern CDCL solvers tear through millions of variables.  splr and varisat are the Rust options.',
    gesture: 'SAT is the canonical NP-complete problem — and yet a great solver answers most practical instances in milliseconds.',
    body: `Boolean satisfiability — given a propositional formula, does there exist an assignment that makes it true — was proven NP-complete by Cook in 1971 and independently by Levin in 1973.  The Davis-Putnam-Logemann-Loveland (DPLL) algorithm of 1962 is the foundation of modern SAT solvers: backtracking search with unit propagation and pure-literal elimination.  Conflict-Driven Clause Learning (CDCL) — Marques-Silva's GRASP 1996, Bayardo-Schrag 1997, MoskewiczMadigan-Zhao-Zhang-Malik's Chaff 2001 — added learned clauses, watched literals, restart strategies, and branching heuristics like VSIDS.  Modern solvers handle millions of variables and clauses on practical instances.  In Rust, \`splr\` is a pure-Rust CDCL solver from a Japanese researcher; \`varisat\` is another pure-Rust implementation; \`cadical-sys\` wraps the C++ CaDiCaL solver via FFI.`,
    citation: 'Marques-Silva, J. P., Sakallah, K. A. (1996). *GRASP—A New Search Algorithm for Satisfiability.* ICCAD.  Davis, M., Logemann, G., Loveland, D. (1962). *A Machine Program for Theorem Proving.* CACM 5(7).',
    link: 'https://docs.rs/splr/latest/splr/',
    eli5: `SAT is the original NP-complete problem.  Cook proved it in 1971.  Every other NP problem reduces to it.  By every theoretical measure, SAT is hard.

And yet a modern SAT solver routinely cracks instances with millions of variables and tens of millions of clauses in seconds.  How?

The answer is that "NP-complete" is a worst-case statement.  Most practical SAT instances have hidden structure — community structure, low treewidth, easy backbones — and modern solvers exploit it.  The architecture they all share is Conflict-Driven Clause Learning.

The core of CDCL: when the search hits a conflict (a clause that cannot be satisfied under the current partial assignment), analyze the conflict to identify the smallest set of decisions that caused it.  Add a learned clause that forbids that set.  Backtrack to the deepest decision that the new clause is no longer unit on, and continue.  Over time, the solver builds up a large body of learned constraints that prune the search space dramatically.

Layered on top: VSIDS branching heuristics that prefer variables involved in recent conflicts; watched literals for fast unit propagation; restart strategies that periodically clear the stack but keep the learned clauses; preprocessing techniques like blocked-clause elimination and variable elimination; symmetry breaking.  Engineering matters.

In Rust, \`splr\` is the pure-Rust solver, well-documented and embeddable.  \`varisat\` is another option.  For maximum performance, \`cadical-sys\` wraps the world-class C++ CaDiCaL solver.  All of them accept DIMACS format and return a model or UNSAT.

The right way to use a SAT solver is not to write your own.  Encode your problem in CNF.  Hand it to splr.  Read the answer.  Modern solvers are decades of engineering effort; you will not beat them.

NP-complete in theory.  Tractable in practice.  Page 38 explains when this trick fails.`
  },
  {
    title: '3-SAT and the reduction from SAT',
    tldr: 'SAT reduces to 3-SAT by splitting wide clauses with auxiliary variables.  Both NP-complete.',
    gesture: 'The reduction that anchors most other NP-completeness proofs starts here.',
    body: `3-SAT is SAT restricted to clauses of exactly three literals.  Cook's 1971 proof showed SAT is NP-complete; the standard reduction from SAT to 3-SAT — split each k-clause (k > 3) into k−2 three-clauses connected by auxiliary variables — gives a polynomial reduction, so 3-SAT is also NP-complete.  3-SAT is the launchpad for most other NP-completeness proofs in Karp's 1972 paper and beyond, because its uniform structure makes it the easiest target to reduce to other graph and combinatorial problems.  Algorithmically, all the CDCL machinery from generic SAT applies — modern solvers do not distinguish 2-SAT, 3-SAT, and k-SAT, they parse CNF and run.  The class boundary is at width 2: 2-SAT is in P (page 15), 3-SAT is NP-complete.`,
    citation: 'Cook, S. A. (1971). *The Complexity of Theorem-Proving Procedures.* STOC.  Karp, R. M. (1972). *Reducibility Among Combinatorial Problems.*',
    link: 'https://en.wikipedia.org/wiki/Boolean_satisfiability_problem#3-satisfiability',
    eli5: `3-SAT is SAT with every clause having exactly three literals.  It is the canonical NP-complete problem you reduce other problems to.  Once you have a 3-SAT formula, the structure is so uniform that reductions to graph problems, scheduling problems, packing problems become tractable to write down.

The reduction from arbitrary SAT to 3-SAT is constructive and short.  A 1-clause (x) becomes (x ∨ y ∨ z) ∧ (x ∨ y ∨ ¬z) ∧ (x ∨ ¬y ∨ z) ∧ (x ∨ ¬y ∨ ¬z) — four 3-clauses with fresh variables y, z that force x to be true.  A 2-clause (x ∨ y) becomes (x ∨ y ∨ z) ∧ (x ∨ y ∨ ¬z).  A k-clause for k > 3 (x₁ ∨ ... ∨ xₖ) becomes a chain of k−2 three-clauses linked by k−3 auxiliary variables: (x₁ ∨ x₂ ∨ a₁) ∧ (¬a₁ ∨ x₃ ∨ a₂) ∧ ... ∧ (¬a_{k−3} ∨ x_{k−1} ∨ xₖ).  The construction preserves satisfiability and runs in linear time.

This reduction is doing more work than it looks.  By giving every NP-complete proof a uniform target, it cuts the surface area of subsequent reductions.  Karp's 1972 paper reduced 3-SAT (not full SAT) to twenty other problems — clique, vertex cover, set cover, Hamiltonian cycle, knapsack, 3-coloring, and so on — and the reductions are short precisely because 3-SAT clauses are tiny.

The class boundary is sharp.  2-SAT (page 15) is in P because 2-clauses are implications, implications form a graph, and the graph's SCC structure determines satisfiability in linear time.  3-SAT has no such structural collapse.  No polynomial-time algorithm for 3-SAT is known, and the consensus is that none exists.

In Rust, 3-SAT is the same as SAT operationally — encode in DIMACS CNF, hand to \`splr\` or \`varisat\`.  The width restriction is a theoretical convenience, not a solver feature.

3-SAT is the launchpad for the rest of NP-complete.  Know the reduction.  See page 38 for why 2 is in P and 3 is not.`
  },
  {
    title: 'Traveling Salesman Problem',
    tldr: 'Decision version NP-complete.  Held-Karp DP O(n²2ⁿ).  Christofides 1.5-approx for metric TSP.',
    gesture: 'The poster problem of NP-completeness — and the workshop where every NP-complete trick was first sharpened.',
    body: `Given a set of cities and pairwise distances, the traveling salesman problem asks for the shortest tour visiting every city exactly once and returning to the start.  The decision version (is there a tour of length at most k?) was on Karp's 1972 list of NP-complete problems.  Held and Karp's 1962 dynamic programming algorithm solves it exactly in O(n²·2ⁿ) — fine for n up to roughly 20.  For metric TSP (distances satisfy the triangle inequality), Christofides' 1976 algorithm achieves a 3/2 approximation; Karlin, Klein, and Oveis Gharan improved this to 3/2 − ε in 2020.  Euclidean TSP admits a PTAS (Arora 1996).  In Rust, the practical approach is to model as ILP with \`good_lp\`, or use a specialized crate like \`tsp-rs\` for heuristics (nearest-neighbor, 2-opt, Lin-Kernighan).`,
    citation: 'Held, M., Karp, R. M. (1962). *A Dynamic Programming Approach to Sequencing Problems.* JSIAM 10(1).  Christofides, N. (1976). *Worst-case Analysis of a New Heuristic for the Travelling Salesman Problem.* CMU TR.',
    link: 'https://en.wikipedia.org/wiki/Travelling_salesman_problem',
    eli5: `TSP is the most famous NP-complete problem in the world.  Every undergraduate textbook uses it as the running example.  The reasons are good ones: the problem is easy to state, has direct industrial applications (vehicle routing, circuit board drilling, DNA sequencing), and admits a remarkable variety of attack methods.

The Held-Karp dynamic program from 1962 solves it exactly.  The state is a pair (S, v) where S is a subset of cities and v is the most recently visited.  The value is the length of the shortest path starting from city 1, visiting exactly the cities in S, and ending at v.  Fill the table in order of |S|.  The final answer is min over v of dp[all cities, v] + dist(v, 1).  Time: O(n² · 2ⁿ).  Space: O(n · 2ⁿ).  For n = 20, this is roughly 20 million entries — workable on a laptop.

For larger n, exact methods rely on integer programming.  The standard formulation has binary variables x_{ij} for "edge ij in tour," with degree constraints and subtour elimination constraints.  Subtour elimination is exponential in the number of constraints; cutting-plane methods add them lazily.  Concorde, the state-of-the-art TSP solver, has solved instances with tens of thousands of cities to optimality.

For approximate solutions on metric TSP, Christofides' 1976 algorithm builds a minimum spanning tree, finds a perfect matching on the odd-degree vertices of the MST, combines them into an Eulerian multigraph, walks the Euler tour, and shortcuts to get a Hamiltonian tour.  The result is at most 1.5 times optimal.  Karlin-Klein-Oveis Gharan's 2020 randomized improvement is the first to break 1.5 in fifty years.

For heuristic solutions, 2-opt and Lin-Kernighan are the workhorses.  2-opt repeatedly swaps pairs of edges if it shortens the tour.  Lin-Kernighan generalizes to k-edge swaps and is the basis of the LKH solver, the best heuristic in practice.

In Rust, model with \`good_lp\` for exact small instances; use heuristic libraries for large practical instances.  Or skip Rust and call out to LKH or Concorde when problem size demands it.

TSP is the workshop.  Every NP-complete trick was sharpened here.`
  },
  {
    title: '0/1 Knapsack',
    tldr: 'NP-complete in the strong sense?  No — weakly NP-complete.  Pseudo-polynomial DP O(nW) is the standard exact method.',
    gesture: 'Knapsack is NP-complete, but it has a polynomial-time algorithm in the value of the capacity.',
    body: `The 0/1 knapsack problem: given items with weights and values and a capacity W, choose a subset of items with total weight at most W maximizing total value.  Karp 1972 placed it on the NP-complete list.  But it is only weakly NP-complete: the dynamic programming algorithm with state (item, current weight) runs in O(nW) time, which is polynomial in n and W but exponential in the bit-length of W.  This pseudo-polynomial time makes knapsack tractable whenever W is small relative to n.  Knapsack also admits a fully polynomial-time approximation scheme (FPTAS) — for any ε > 0, a (1−ε)-approximation in time polynomial in n and 1/ε.  In Rust, hand-roll the DP for exact answers, or use \`good_lp\` to model as a 0-1 ILP and dispatch to HiGHS or CBC.`,
    citation: 'Karp, R. M. (1972). *Reducibility Among Combinatorial Problems.*  Bellman, R. (1957). *Dynamic Programming.* Princeton University Press.',
    link: 'https://en.wikipedia.org/wiki/Knapsack_problem',
    eli5: `0/1 knapsack is the cleanest example of a weakly NP-complete problem.  It is on Karp's NP-complete list, so it is genuinely hard in the bit-complexity sense.  But it has a dynamic programming algorithm that runs in O(nW) time — polynomial in n (the number of items) and W (the capacity in arbitrary units), but exponential in the number of bits needed to write W.

The DP fills a table of size n × W.  Entry dp[i][w] is the maximum value attainable using only the first i items with total weight at most w.  The recurrence: dp[i][w] = max(dp[i−1][w], dp[i−1][w−wᵢ] + vᵢ) if wᵢ ≤ w else dp[i−1][w].  Fill in order; the answer is dp[n][W].  Recover the chosen items by back-tracing.

The reason this is not a polynomial-time algorithm for knapsack is that the input size is the number of bits, not the magnitude.  Doubling W only adds one bit to the input but doubles the work.  For pathological instances with W = 2^n, the DP is exponential.  For typical instances with W bounded by a polynomial in n, the DP is polynomial.

Knapsack also admits a fully polynomial-time approximation scheme.  Scale the values down so the maximum is polynomial in n/ε, run the DP on scaled values, scale back.  The result is within (1−ε) of optimal in time O(n³ / ε).  This makes knapsack one of the friendliest NP-complete problems in practice.

In Rust, the DP is twenty lines.  For modeling, \`good_lp\` lets you describe the 0-1 ILP and dispatch to a solver — overkill for knapsack alone but the right pattern when knapsack is one constraint in a larger optimization.

The pair to remember: 0/1 knapsack is NP-complete, but pseudo-polynomial.  Fractional knapsack — items can be split — is in P via a single greedy sort.  The dividing line is the integer restriction.  See page 38.`
  },
  {
    title: 'Vertex cover, independent set, clique',
    tldr: 'Three NP-complete problems that are the same coin viewed from three angles.  All Karp 1972.',
    gesture: 'Three sides of the same NP-complete coin — and the simplest reductions to remember.',
    body: `A vertex cover is a set of vertices such that every edge has at least one endpoint in the set.  An independent set is a set of vertices with no edges between them.  A clique is a set of vertices with every pair connected.  All three decision problems are NP-complete (Karp 1972).  The reductions among them are immediate: S is an independent set iff V \\ S is a vertex cover; S is a clique in G iff S is an independent set in the complement of G.  Solving any one in polynomial time would solve all three.  Vertex cover has a 2-approximation by greedy edge picking; independent set is APX-hard with no constant-factor approximation possible unless P = NP.  In Rust, model as ILP via \`good_lp\` for exact solutions, or hand-roll branch-and-bound on the vertex-cover side where the fixed-parameter algorithm is O(2^k · n) in the cover size k.`,
    citation: 'Karp, R. M. (1972). *Reducibility Among Combinatorial Problems.*  Håstad, J. (1996). *Clique is hard to approximate within n^{1−ε}.* FOCS.',
    link: 'https://en.wikipedia.org/wiki/Vertex_cover',
    eli5: `Three problems.  Three statements.  All NP-complete.  All the same problem.

Vertex cover: pick a minimum-size set of vertices that touches every edge.  Independent set: pick a maximum-size set of vertices with no edges among them.  Clique: pick a maximum-size set of vertices all mutually adjacent.

The reductions are mechanical.  A set S is an independent set if and only if its complement V \\ S is a vertex cover — if no edge has both endpoints in S, then every edge has at least one endpoint outside S.  A set S is a clique in graph G if and only if S is an independent set in the complement graph (the graph with the same vertices and an edge wherever G does not).  So a fast algorithm for any one yields fast algorithms for the others.

The approximation landscape is different even though the exact-complexity landscape is identical.  Vertex cover has a simple 2-approximation: repeatedly pick an uncovered edge and add both endpoints to the cover.  This is at most twice optimal because every optimal cover must include at least one endpoint of every such edge.  By contrast, independent set is APX-hard — Håstad's 1996 result says no polynomial-time algorithm can approximate it within n^{1−ε} for any ε > 0 unless P = NP.  Clique inherits the same hardness.  Same problem, very different approximability.

Vertex cover is also one of the cleanest fixed-parameter tractable problems.  Parameterized by the cover size k, an O(1.27^k · n) algorithm exists.  When the cover is small, exact solutions are fast even for large graphs.

In Rust, model as ILP with \`good_lp\` and dispatch to HiGHS or CBC.  For vertex cover specifically with small k, branch-and-bound by hand: pick any uncovered edge, branch on which endpoint to include, recurse with k decreased by one.  About forty lines.

When you see one of these three problems, you have actually seen all three.  And you have seen NP-complete.`
  },
  {
    title: 'Graph coloring',
    tldr: '2-coloring is in P (bipartite check).  3-coloring and beyond are NP-complete.',
    gesture: 'k-coloring with k = 2 is bipartite-testing.  With k = 3 it falls off the cliff into NP-complete.',
    body: `A proper k-coloring of a graph assigns one of k colors to each vertex such that no edge has both endpoints the same color.  2-coloring is solvable in linear time — a graph is 2-colorable iff it is bipartite, and BFS or DFS decides bipartiteness in O(V + E).  3-coloring is NP-complete (Karp 1972, Stockmeyer 1973), and k-coloring for any fixed k ≥ 3 is NP-complete.  Approximating the chromatic number within n^{1−ε} is NP-hard (Feige-Kilian 1996, Zuckerman 2006).  The DSATUR heuristic (Brélaz 1979) and tabu search work well in practice.  In Rust, hand-roll backtracking for exact small-graph coloring, model as 0-1 ILP via \`good_lp\` for medium instances, or encode in SAT and use \`splr\`.`,
    citation: 'Karp, R. M. (1972). *Reducibility Among Combinatorial Problems.*  Stockmeyer, L. J. (1973). *Planar 3-Colorability is Polynomial Complete.* SIGACT News 5(3).',
    link: 'https://en.wikipedia.org/wiki/Graph_coloring',
    eli5: `Graph coloring asks: can you assign one of k colors to each vertex such that adjacent vertices get different colors?  Real applications include register allocation in compilers, frequency assignment in wireless networks, scheduling exams to non-overlapping time slots, and Sudoku.

For k = 1, trivial — only graphs with no edges work.

For k = 2, the problem is exactly bipartite testing.  A graph is 2-colorable iff it has no odd cycle.  BFS from any vertex, color levels alternately, check for consistency on every edge.  Linear time.

For k = 3, the problem becomes NP-complete.  This is the canonical cliff.  Karp included 3-coloring in his 1972 list; Stockmeyer in 1973 strengthened it to planar 3-coloring (planar 4-coloring is always possible by the Four Color Theorem, but deciding planar 3-colorability is still NP-complete).

For any k ≥ 3, k-coloring is NP-complete.  Finding the chromatic number — the minimum k for which the graph is k-colorable — is NP-hard.  No polynomial-time approximation within any constant factor is possible unless P = NP.

The practical heuristics are good despite the theoretical hardness.  DSATUR (Degree of Saturation) iteratively colors the vertex with the most distinct colors among its neighbors, breaking ties by degree.  It produces optimal colorings on many real graph classes.  Tabu search, simulated annealing, and genetic algorithms all do reasonable jobs on hard instances.

For exact small-graph coloring, encode in SAT and use \`splr\` — one Boolean variable per (vertex, color) pair, clauses enforcing exactly-one-color-per-vertex and different-colors-on-edge.  Modern SAT solvers handle graphs with hundreds of vertices and tens of colors.  For larger graphs, model as 0-1 ILP via \`good_lp\` with HiGHS.

The 2-vs-3 cliff is the central lesson.  Reducing a graph problem to "binary classification of vertices" (2-coloring) often lands in P.  Three classes pushes you to NP-complete.  See page 38.`
  },
  {
    title: 'Hamiltonian cycle',
    tldr: 'NP-complete.  Held-Karp DP O(n²2ⁿ) for exact; reduction to SAT for moderate sizes.',
    gesture: 'Visit every vertex exactly once and return — the cousin of Euler circuit that landed on the other side of P.',
    body: `A Hamiltonian cycle in a graph is a cycle that visits every vertex exactly once.  Deciding existence is NP-complete (Karp 1972); the optimization variant on weighted graphs is TSP.  In contrast, Euler circuit existence — visiting every edge exactly once — is decidable in linear time (Hierholzer 1873): a graph has an Euler circuit iff it is connected and every vertex has even degree.  The contrast between vertex and edge constraints is the textbook example of how a small specification change moves a problem between classes.  The Held-Karp DP from 1962 solves Hamiltonian cycle in O(n²·2ⁿ).  Bellman's 1962 inclusion-exclusion bound is similar.  In Rust, model as SAT or ILP for moderate n, or hand-roll the bitmask DP for n up to roughly 20.`,
    citation: 'Karp, R. M. (1972). *Reducibility Among Combinatorial Problems.*  Held, M., Karp, R. M. (1962). *A Dynamic Programming Approach to Sequencing Problems.* JSIAM 10(1).',
    link: 'https://en.wikipedia.org/wiki/Hamiltonian_path_problem',
    eli5: `The Hamiltonian cycle problem is one of the cleanest examples of how a tiny specification change moves a problem between complexity classes.

Euler circuit: a closed walk that traverses every edge exactly once.  Euler proved in 1735 that a connected graph has one iff every vertex has even degree.  Hierholzer in 1873 gave a linear-time algorithm.  This is the famous Königsberg bridges problem, the founding example of graph theory.  Linear time.  In P.

Hamiltonian cycle: a closed walk that visits every vertex exactly once.  Almost the same sentence, with "edge" replaced by "vertex."  And the problem is NP-complete.  No polynomial-time algorithm is known.  The Held-Karp DP from 1962 runs in O(n²·2ⁿ).  Brute force is O(n!).  Modern SAT and ILP solvers handle instances with hundreds of vertices for structured cases.

The reason this transition matters is that it is the canonical example of how complexity classes are sensitive to specification.  Edge-traversal is in P because every edge is touched exactly once and counting parities locally determines feasibility.  Vertex-traversal is NP-complete because visiting every vertex once requires global coordination — no local property suffices to decide feasibility.

For exact small-graph Hamiltonian cycle, hand-roll the bitmask DP.  State: (subset S of visited vertices, current vertex v).  Value: is there a path from the start, visiting exactly S, ending at v.  Transition: from (S, v), for each neighbor u not in S, set dp[S ∪ {u}][u] = true if dp[S][v] is true.  Answer: dp[V][v] is true and the start is adjacent to v.

For larger instances, encode in SAT — one variable per (position, vertex) pair, clauses enforcing one vertex per position, one position per vertex, edges between consecutive positions.  Use \`splr\`.

For weighted variants (TSP), see page 25.

Edge → P.  Vertex → NP-complete.  The same trip described two ways, two different worlds.  See page 38.`
  },
  {
    title: 'Subset sum and partition',
    tldr: 'Both NP-complete.  Pseudo-polynomial DP O(nS).  Meet-in-the-middle O(2^(n/2)) for exact.',
    gesture: 'Pick a subset summing to a target — the simplest NP-complete arithmetic problem.',
    body: `Subset sum: given a set of integers and a target T, does some subset sum exactly to T?  Partition: can a set of integers be split into two subsets with equal sums?  Both NP-complete (Karp 1972).  Like 0/1 knapsack, they are weakly NP-complete — a dynamic programming algorithm on (item, partial sum) runs in O(nS) where S is the target, polynomial in n and S but exponential in the bit-length of S.  Horowitz and Sahni's 1974 meet-in-the-middle technique solves subset sum in O(2^(n/2)) time and O(2^(n/2)) space — far better than naive 2^n for moderate n.  In Rust, hand-roll the DP for small targets, the meet-in-the-middle for n around 40–60, or call \`good_lp\` for ILP modeling.`,
    citation: 'Karp, R. M. (1972). *Reducibility Among Combinatorial Problems.*  Horowitz, E., Sahni, S. (1974). *Computing Partitions with Applications to the Knapsack Problem.* JACM 21(2).',
    link: 'https://en.wikipedia.org/wiki/Subset_sum_problem',
    eli5: `Subset sum is the simplest NP-complete arithmetic problem.  Given a multiset of integers and a target, decide whether some subset sums to the target.  Partition is the special case where the target is half the total — split the set into two equal-sum halves.

Both are NP-complete, both weakly so.  The standard DP fills a Boolean table dp[i][s] = "some subset of the first i items sums to s."  Recurrence: dp[i][s] = dp[i−1][s] OR dp[i−1][s−aᵢ] (if aᵢ ≤ s).  Time O(n · S), space reducible to O(S) by keeping one row.  Polynomial when S is polynomial in n, exponential in S's bit-length.

For instances where the target is huge but n is moderate, the Horowitz-Sahni meet-in-the-middle is the trick.  Split the items into two halves of size n/2.  Enumerate all 2^(n/2) subset sums of each half — that is feasible for n up to 60.  Sort one list; for each value in the other list, binary search for its complement.  Total time O(2^(n/2) log 2^(n/2)) = O(n · 2^(n/2)).  For n = 40, this is roughly 10^6 ·  20 = 20 million operations.  Tractable.

Subset sum is the canonical reduction target for several other NP-completeness proofs — partition, bin packing, makespan minimization on identical machines.  Karp's 1972 paper used subset sum as the bridge from 3-SAT to many number-theoretic problems.

In Rust, the DP is fifteen lines.  Meet-in-the-middle is fifty.  For modeling as part of a larger optimization, \`good_lp\` with binary variables.

The class story is the same as knapsack.  Pseudo-polynomial DP makes the problem tractable when numbers are small.  Truly large numbers — cryptographically large — push the problem back into exponential territory.  This is the basis of the Merkle-Hellman knapsack cryptosystem, broken by Shamir in 1982 because the chosen "small" instances had hidden structure.

Weakly NP-complete.  Use the size of the numbers as your guide.`
  },
  {
    title: 'Bin packing',
    tldr: 'NP-complete.  First-Fit-Decreasing approximation 11/9 OPT + 6/9.  ILP for exact.',
    gesture: 'Pack items into the fewest bins — strongly NP-complete, with surprisingly tight approximations.',
    body: `Bin packing: given items of various sizes and bins of fixed capacity, pack all items into the minimum number of bins.  Strongly NP-complete (Garey-Johnson 1979).  First-Fit-Decreasing (FFD) — sort items descending, place each in the first bin that fits — uses at most 11/9 · OPT + 6/9 bins (Johnson 1973, tightened by Dósa 2007).  An asymptotic polynomial-time approximation scheme (APTAS) exists (Fernandez de la Vega-Lueker 1981).  For exact small instances, model as ILP and dispatch to HiGHS via \`good_lp\` — binary variables x_{ij} for "item i goes in bin j" plus a binary indicator y_j for "bin j is used."  In Rust, hand-roll FFD for fast heuristic answers, or model exactly in \`good_lp\`.`,
    citation: 'Johnson, D. S. (1973). *Near-Optimal Bin Packing Algorithms.* PhD thesis, MIT.  Garey, M. R., Johnson, D. S. (1979). *Computers and Intractability.*',
    link: 'https://en.wikipedia.org/wiki/Bin_packing_problem',
    eli5: `Bin packing shows up everywhere you have to fit things into containers: virtual machines on physical servers, ads into TV breaks, files on disks, cargo into trucks, problems into compute time.  It is strongly NP-complete, but it has some of the best approximation algorithms in the field.

The simplest heuristic is First-Fit: process items in arrival order, put each in the first bin that has room, open a new bin if none does.  First-Fit uses at most 1.7 · OPT bins.

First-Fit-Decreasing (FFD) is the same algorithm with items sorted in decreasing order of size first.  Johnson's 1973 thesis proved FFD uses at most 11/9 · OPT + 6/9 bins.  Dósa in 2007 tightened the bound and showed it is tight in the worst case.  For practical inputs, FFD is often within a few percent of optimal.

Best-Fit-Decreasing (BFD) is FFD with a different tie-breaker — place each item in the bin where it leaves the least leftover space.  Same asymptotic bound, sometimes slightly better in practice.

For exact answers, model as ILP.  Variables: x_{ij} = 1 iff item i goes in bin j; y_j = 1 iff bin j is used.  Constraints: each item in exactly one bin, total size in each bin at most capacity, x_{ij} ≤ y_j.  Objective: minimize Σ y_j.  Hand to HiGHS via \`good_lp\`.

A more efficient ILP uses configuration variables — enumerate every feasible subset of items that fits in one bin, decide how many bins of each configuration to use.  This is the column-generation approach, scales to hundreds of items.

In Rust, FFD is about thirty lines.  Build a Vec of bins, sort items descending, iterate and place.  For exact, build the ILP in \`good_lp\`.

Bin packing is the workhorse problem.  When you have a fixed-capacity packing problem, FFD is the fast first answer.  The 11/9 approximation ratio is the price you pay for staying in P on an NP-complete problem.  Page 33 explains the broader theory of approximation algorithms.`
  },
  {
    title: 'Integer Linear Programming',
    tldr: 'NP-complete.  good_lp + HiGHS or CBC handles thousands of variables for practical instances.',
    gesture: 'LP plus the integer requirement.  The single most useful NP-complete framework in practice.',
    body: `Integer linear programming extends LP by requiring some or all variables to take integer values.  ILP is NP-complete (Karp 1972).  Mixed integer programming (MIP) allows both integer and continuous variables and inherits the hardness.  Modern MIP solvers — HiGHS (open source), Gurobi, CPLEX, SCIP — combine branch-and-bound, cutting-plane methods (Gomory cuts, mixed-integer rounding cuts), primal heuristics, and presolve into engineering monuments that solve practical instances with hundreds of thousands of variables.  An enormous fraction of operations research problems are MIP under the hood.  In Rust, \`good_lp\` lets you declare integer variables with \`add_variable().integer()\` and dispatches to a backend solver.  HiGHS is the recommended open-source choice; \`coin_cbc\` and \`scip\` are alternatives.`,
    citation: 'Karp, R. M. (1972). *Reducibility Among Combinatorial Problems.*  Gomory, R. E. (1958). *Outline of an Algorithm for Integer Solutions to Linear Programs.* Bull. AMS 64.',
    link: 'https://docs.rs/good_lp/latest/good_lp/',
    eli5: `Integer linear programming is linear programming with one extra rule: some variables must be integers.  That single restriction transforms the problem from polynomial (LP, page 19) to NP-complete.  This is one of the most consequential complexity-class transitions in applied mathematics.

The reason ILP is harder than LP is that the feasible set stops being a convex polyhedron and becomes a lattice of integer points inside one.  LP can walk vertices of the polyhedron in polynomial time; ILP cannot, because the optimal integer point may be far from any LP vertex.  Branching on a fractional value of a variable — does it round up or round down? — generates an exponential search tree in the worst case.

And yet ILP is one of the most useful frameworks in practice.  Modern solvers combine many tricks.  Branch-and-bound searches the tree but prunes aggressively using LP relaxations as lower bounds.  Cutting planes — Gomory cuts, mixed-integer rounding cuts, cover cuts, clique cuts — add valid inequalities that tighten the relaxation without removing integer feasible points.  Presolve eliminates redundant variables and constraints.  Primal heuristics find feasible solutions quickly to establish bounds.  The result is that practical MIPs with tens of thousands of binary variables routinely solve in seconds.

Most NP-complete problems in this book — knapsack, vertex cover, bin packing, TSP, scheduling, set cover — can be modeled as ILP.  Modeling is usually straightforward: write down the constraints and the objective.  The solver handles the search.

In Rust, \`good_lp\` is the modeling crate.  Define variables with \`add_variable().integer()\` or \`.binary()\`.  Add constraints with operator overloading.  Define the objective.  Call \`.solve()\` and pick a backend — \`highs\` is recommended.  The interface is comparable to PuLP in Python or JuMP in Julia.

ILP is the Swiss Army knife of NP-complete in practice.  When you have an NP-complete optimization problem and you have not already identified a specialized algorithm, model as ILP and try.  Modern solvers are routinely competitive with specialized algorithms on practical instances.

LP is the line.  ILP is the cliff.  Page 38 puts them side by side.`
  },

  // ────────── Part IV — When you cannot solve exactly ──────────
  {
    title: 'Approximation algorithms',
    tldr: 'Polynomial-time algorithms with provable bounds on how far from optimal they can be.',
    gesture: 'When you cannot solve exactly, the right replacement is "provably close."',
    body: `An approximation algorithm for an optimization problem runs in polynomial time and produces a solution whose value is within a known factor of optimal.  For a minimization problem, an α-approximation produces an answer at most α · OPT for α ≥ 1.  Classic results: 2-approximation for vertex cover (greedy edge picking), 3/2-approximation for metric TSP (Christofides), ln(n)-approximation for set cover (greedy), 11/9 for bin packing (FFD).  Some problems have inapproximability lower bounds — independent set cannot be approximated within n^{1−ε} unless P = NP (Håstad 1996, Zuckerman 2006), set cover cannot be approximated within (1−o(1))·ln(n) (Feige 1998).  The approximation ratio is the metric of progress on NP-complete problems.  In Rust, most approximation algorithms are small enough to hand-roll directly.`,
    citation: 'Vazirani, V. V. (2001). *Approximation Algorithms.* Springer.  Williamson, D. P., Shmoys, D. B. (2011). *The Design of Approximation Algorithms.* Cambridge.',
    link: 'https://www.designofapproxalgs.com/',
    eli5: `An approximation algorithm trades exactness for speed.  Instead of finding the optimal solution to an NP-complete problem, you find a solution that is provably close — within a known factor.  The polynomial-time guarantee is preserved.  The exactness is sacrificed for tractability.

The greedy 2-approximation for vertex cover is the textbook starter.  Pick any uncovered edge, add both endpoints to the cover, remove all edges incident to those endpoints.  Repeat until no edges remain.  The result is a vertex cover (every edge was touched).  Its size is at most twice the optimal vertex cover, because every selected pair of endpoints includes at least one optimal-cover vertex.  Twenty lines.  2-approximation guaranteed.

Christofides' 3/2-approximation for metric TSP is more elaborate.  Build a minimum spanning tree.  Find a perfect matching on the odd-degree vertices of the MST.  Combine MST and matching into an Eulerian multigraph; find an Euler tour; shortcut repeated vertices.  The result is a Hamiltonian tour at most 3/2 times the optimal TSP tour, assuming the triangle inequality.  This bound stood from 1976 until 2020.

Set cover gets a (1 + ln n)-approximation by greedy: repeatedly pick the set that covers the most uncovered elements.  This is tight — Feige proved in 1998 that no polynomial-time algorithm can do better unless P = NP.

The deeper structure is that not all NP-complete problems are equally approximable.  Some — vertex cover, TSP, knapsack, bin packing — have constant-factor or near-constant-factor approximations.  Some — set cover, dominating set — have logarithmic ratios.  Some — independent set, clique, chromatic number — have ratios that are essentially the input size, meaning approximation is hopeless.

The PCP theorem (Arora-Lund-Motwani-Sudan-Szegedy 1998) is the theoretical backbone for inapproximability results — it shows that many NP-complete problems are hard to approximate beyond specific thresholds.  Page 34 explains the PTAS/FPTAS/APX hierarchy.

In Rust, approximation algorithms are mostly small enough to hand-roll directly — vertex cover, set cover, FFD bin packing, Christofides all fit in a few dozen lines.  When you reach for an approximation, write the algorithm yourself and verify the bound by hand.

Approximation is the honest reply to NP-completeness.  Use it.`
  },
  {
    title: 'PTAS, FPTAS, and APX-hardness',
    tldr: 'Approximation schemes give arbitrarily tight ratios — at a cost.  Not every NP-complete problem has one.',
    gesture: 'The approximation hierarchy is the second layer of the complexity map — and it has its own dividing lines.',
    body: `A polynomial-time approximation scheme (PTAS) is a family of algorithms parameterized by ε > 0, each producing a (1 + ε)-approximation in polynomial time (the polynomial may depend exponentially on 1/ε).  A fully polynomial-time approximation scheme (FPTAS) requires polynomial dependence on both input size and 1/ε.  0/1 knapsack admits an FPTAS.  Euclidean TSP admits a PTAS (Arora 1996).  APX is the class of problems with constant-factor approximations.  APX-hard problems — vertex cover, TSP general, set cover — cannot be approximated arbitrarily closely unless P = NP.  The PCP theorem is the engine behind APX-hardness proofs.  Knowing where your problem sits in this hierarchy tells you what approximation quality is theoretically achievable.`,
    citation: 'Arora, S., Lund, C., Motwani, R., Sudan, M., Szegedy, M. (1998). *Proof Verification and the Hardness of Approximation Problems.* JACM 45(3).  Arora, S. (1996). *Polynomial Time Approximation Schemes for Euclidean TSP and Other Geometric Problems.* FOCS.',
    link: 'https://en.wikipedia.org/wiki/Polynomial-time_approximation_scheme',
    eli5: `Approximation algorithms have their own complexity hierarchy.  Not every NP-complete problem is equally approximable, and the labels above are the field's way of charting the territory.

PTAS — Polynomial-Time Approximation Scheme.  For any ε > 0, you can get within (1 + ε) of optimal in polynomial time.  The polynomial may have ε in the exponent, so getting closer is slower.  Euclidean TSP has a PTAS — Arora's 1996 algorithm.  So do scheduling problems on identical machines.  A PTAS says "you can approach optimal as closely as you are willing to pay for."

FPTAS — Fully Polynomial-Time Approximation Scheme.  Same idea, but the running time is polynomial in both input size and 1/ε.  Much stronger guarantee.  0/1 knapsack has an FPTAS: scale values, run the pseudo-polynomial DP on scaled inputs, scale back.  Time O(n³/ε).  FPTAS is the gold standard for approximability.

APX — the class of problems with constant-factor approximations.  Vertex cover (factor 2), bin packing (factor 11/9 + o(1)), MAX-3SAT (factor 7/8), set cover (factor ln n + 1) — though that last one is not constant.

APX-hardness — a problem is APX-hard if it does not admit a PTAS unless P = NP.  Vertex cover is APX-hard.  Metric TSP is APX-hard.  Set cover is even harder — it does not even admit a constant-factor approximation better than ln n.  Independent set is among the worst, with no n^{1−ε} approximation possible.

The engine behind APX-hardness is the PCP theorem.  It is the most influential theorem in theoretical computer science of the last forty years.  Arora-Lund-Motwani-Sudan-Szegedy in 1998 (building on Arora-Safra 1992) showed that NP problems have probabilistically checkable proofs — a verifier can check an NP certificate by sampling only a constant number of bits.  This characterization of NP, applied via gap-introducing reductions, proved tight inapproximability bounds for many problems.

For practical Rust code, the hierarchy matters because it tells you what to expect.  If your problem is in APX-hard with no constant approximation known, the best you can do is heuristic — simulated annealing, local search, ILP with time limits.  If your problem has an FPTAS, write the FPTAS; it gives you a knob to turn between speed and quality.

Knowing where you sit determines the toolkit.`
  },
  {
    title: 'Parameterized complexity (FPT)',
    tldr: 'Some NP-complete problems become polynomial when one input dimension is small.  The right way to be NP-complete.',
    gesture: 'NP-completeness is worst-case in the input size.  Real instances often have a small structural parameter — exploit it.',
    body: `Parameterized complexity studies problems with a designated parameter k.  A problem is fixed-parameter tractable (FPT) if there is an algorithm running in time f(k) · n^O(1) for some computable f — polynomial in n, arbitrary dependence on k.  Vertex cover is FPT in cover size: O(1.27^k · n).  Treewidth-bounded problems are FPT in treewidth — most NP-complete problems become polynomial on graphs of bounded treewidth via Courcelle's theorem (1990) and dynamic programming on tree decompositions.  The complement class W[1]-hard problems (clique parameterized by size) are not believed to be FPT.  Downey and Fellows established the field in their 1999 book.  In Rust, FPT algorithms are usually hand-rolled — branching, kernelization, treewidth DP — though graph libraries like \`petgraph\` provide the data structures.`,
    citation: 'Downey, R. G., Fellows, M. R. (1999). *Parameterized Complexity.* Springer.  Cygan, M. et al. (2015). *Parameterized Algorithms.* Springer.',
    link: 'https://www.springer.com/gp/book/9783319212746',
    eli5: `Classical complexity is binary.  A problem is in P or it is not.  Polynomial time as a function of total input size or nothing.  But real instances have structure.  A network may have millions of nodes but a small feedback vertex set.  A query plan may have many tables but small treewidth.  A scheduling problem may have many jobs but few machines.

Parameterized complexity exploits this structure.  Choose a parameter k that captures the structural property.  Ask whether the problem admits an algorithm whose running time is polynomial in n with the exponential part isolated in k.  Formally: time f(k) · n^c for some computable f and constant c.  Such a problem is fixed-parameter tractable, or FPT.

Vertex cover (page 27) is FPT in the cover size.  Branch-and-bound: pick any uncovered edge, branch on which endpoint to include, recurse with k decreased by one.  Worst-case 2^k branches.  Combined with kernelization rules, the time becomes O(1.27^k · n).  For graphs with small vertex covers, this is fast even when n is huge.

Treewidth is the swiss army knife of structural parameters.  Many NP-complete graph problems — vertex cover, independent set, dominating set, Hamiltonian cycle, graph coloring, MAX-CUT — admit linear-time algorithms on graphs of bounded treewidth via dynamic programming on a tree decomposition.  Courcelle's theorem (1990) generalizes this to any property expressible in monadic second-order logic.

The complement is W[1]-hardness.  Clique parameterized by the size of the clique is W[1]-hard — no algorithm of the form f(k) · n^c is known.  This is the parameterized analog of NP-hardness.  W[1] ⊆ W[2] ⊆ ... ⊆ XP is the parameterized hardness hierarchy.

In Rust, FPT algorithms are typically hand-rolled.  Branching, kernelization, tree decompositions — all bespoke.  \`petgraph\` provides the graph data structure; the algorithmics is yours.  For treewidth specifically, \`tree-decomposition\`-related crates exist but are sparse — this is an area where the Rust ecosystem lags Python's NetworkX.

When your problem is NP-complete but has a small structural parameter, FPT is the right framework.  Look for it before reaching for SAT.`
  },
  {
    title: 'Metaheuristics — when nothing else fits',
    tldr: 'Simulated annealing, tabu search, genetic algorithms.  No guarantees.  Often the right answer at scale.',
    gesture: 'When the problem is non-convex, NP-hard, and not approximable, the last layer is heuristic search with no proof of quality.',
    body: `Metaheuristics are general-purpose search frameworks for problems where exact methods, approximation algorithms, and structural parameterization all fail.  Simulated annealing (Kirkpatrick-Gelatt-Vecchi 1983) accepts worse moves with temperature-dependent probability, cooling gradually toward greedy.  Tabu search (Glover 1986) maintains a memory of recently visited states to escape local optima.  Genetic algorithms (Holland 1975) evolve a population of candidate solutions via selection, crossover, and mutation.  Large neighborhood search alternates destruction and repair.  Ant colony optimization, particle swarm, variable neighborhood search — each has a domain where it shines.  None come with worst-case guarantees on solution quality, but they routinely produce strong solutions on real instances.  In Rust, \`argmin\` provides a framework for several metaheuristics with custom problem traits.`,
    citation: 'Kirkpatrick, S., Gelatt, C. D., Vecchi, M. P. (1983). *Optimization by Simulated Annealing.* Science 220(4598).  Glover, F. (1986). *Future Paths for Integer Programming and Links to Artificial Intelligence.* Computers & OR 13(5).',
    link: 'https://docs.rs/argmin/latest/argmin/',
    eli5: `Metaheuristics are the last layer of the optimization stack.  When exact methods (Held-Karp, ILP) are too slow, approximation algorithms have ratios too loose, FPT does not apply, and the problem is too unstructured for specialized algorithms, you reach for heuristic search.

Simulated annealing imitates the physical process of cooling a metal.  Start at high temperature: accept any neighboring solution, including worse ones.  Cool gradually: become more selective.  At low temperature: behave like greedy descent.  The schedule of cooling is the art.  Original applications were VLSI layout and TSP.  Convergence to global optima is asymptotic and useless in practice — the value is empirical performance on real instances.

Tabu search keeps a list of recently visited solutions and forbids returning to them, forcing the search to explore.  Aspiration criteria allow forbidden moves when they would improve the global best.  Tabu search is the workhorse of operations research for scheduling and routing.

Genetic algorithms encode candidate solutions as chromosomes.  Selection picks parents based on fitness.  Crossover combines parents into offspring.  Mutation introduces variation.  Repeat.  The metaphor is overstated — most successful "genetic algorithms" are essentially stochastic local search with a population — but the framework is useful when the encoding has natural recombination structure.

Large neighborhood search (LNS) is a different beast.  Take a current solution.  Destroy a piece of it.  Repair the destroyed piece with an exact or heuristic subroutine.  Iterate.  LNS shines when the subproblem is small enough for exact methods.  Modern vehicle routing solvers are LNS-based.

In Rust, the \`argmin\` crate provides a framework for several gradient-free methods.  Define your problem by implementing a trait that exposes the objective and a way to mutate solutions.  Pick a solver — simulated annealing, particle swarm — and run.  For very specific metaheuristics, hand-rolling is the norm; the algorithms are short and the customization needed is usually problem-specific.

The honest reality: at the very limit of NP-hard practice, you are doing engineering, not theory.  No bounds.  No proofs.  Just measurements on real instances.  The Hard Way is to admit it.`
  },

  // ─────────── Part V — The diagnostic spine ───────────
  {
    title: 'Is this in P?  A checklist',
    tldr: 'Greedy?  Matroid?  DP with polynomial state?  Flow?  2-SAT?  LP?  Convex?  Then it is in P.',
    gesture: 'Before you reach for a SAT solver, run the checklist.  Half the time the problem is already in P.',
    body: `When facing a new optimization or decision problem, run through structural tests for membership in P.  Greedy with exchange argument — does picking the best local choice provably lead to optimal?  Matroid structure — does the problem fit the matroid framework (Edmonds 1971), which guarantees greedy works?  Dynamic programming — is there a polynomial-sized state space with a polynomial-time recurrence?  Network flow reduction — can the problem be expressed as max-flow or min-cost flow?  2-SAT — do the constraints have width-2 structure?  Linear programming — are constraints and objective linear with continuous variables?  Convexity — is the objective convex and the feasible set convex?  Spectral or linear algebra — does the problem reduce to eigenvalues or matrix factorization?  If any test passes, the problem is in P and a named algorithm exists.`,
    citation: 'Cormen, T. H., Leiserson, C. E., Rivest, R. L., Stein, C. (2009). *Introduction to Algorithms,* 3rd ed.  Schrijver, A. (2003). *Combinatorial Optimization: Polyhedra and Efficiency.* Springer.',
    link: 'https://github.com/andygauge',
    eli5: `The trap that triggered this book — reaching for NP-complete tools on P problems — has a counter: a checklist.  Before treating a problem as hard, run through structural patterns that put problems in P.

Greedy with exchange argument.  Sort by some criterion, pick greedily, prove that any deviation from greedy can be swapped to match greedy without losing optimality.  Interval scheduling, fractional knapsack, Huffman coding, MST — all have this shape.

Matroid.  A matroid is a set system with exchange properties — if A and B are independent sets and |A| > |B|, then B can be extended by an element of A.  When your problem's feasible sets form a matroid, the greedy algorithm (sort and pick) is provably optimal.  Edmonds 1971.  Forests in a graph form a matroid (giving Kruskal); linearly independent vectors form a matroid; transversals of bipartite graphs form a matroid.

Dynamic programming with polynomial state.  State space size is polynomial in the input.  Transition is polynomial-time.  Total work is polynomial.  Shortest path, edit distance, LCS, matrix chain, knapsack-when-W-is-poly all fit.

Network flow.  When the problem reduces to "maximize flow through a capacitated network" or "minimize cost flow with demands," you are in P via Edmonds-Karp or specialized flow algorithms.  Bipartite matching, assignment, project selection, image segmentation, baseball elimination — all flow.

2-SAT.  Constraints of the form "if A then B" with two-literal clauses, decided by SCC in linear time.

Linear programming.  Real-valued variables, linear constraints, linear objective.  Polynomial via ellipsoid or interior-point.  When the constraint matrix is totally unimodular, the LP optimum is integer for free.

Convex optimization.  Objective and feasible set both convex.  Polynomial via interior-point.  Most regularized statistical estimators.

Spectral methods.  PageRank, spectral clustering, spectral graph theory.  Eigenvalues are polynomial.

Linear algebra.  Matrix multiplication, inversion, factorization, least squares.  Polynomial.

The procedure: read the problem, look for a structural match, name the class, name the algorithm, name the crate.  Half your problems will be solved by the third bullet point.

The other half are NP-complete.  Page 38 helps you tell them apart.`
  },
  {
    title: 'The dividing-line pairs',
    tldr: 'Eight pairs of look-alike problems — one in P, one NP-complete.  The single most useful page in this book.',
    gesture: 'When the problem looks easy, check which side of the line it actually lives on.',
    body: `Eight classic pairs separate P from NP-complete by a small specification change.  Euler circuit (P, every edge once, Hierholzer's algorithm) vs Hamiltonian circuit (NP-complete, every vertex once).  2-SAT (P, linear via SCC) vs 3-SAT (NP-complete).  2-coloring (P, bipartite check) vs 3-coloring (NP-complete).  Shortest path (P, Dijkstra) vs longest simple path (NP-complete).  Minimum spanning tree (P, Kruskal/Prim) vs Steiner tree (NP-complete, connect required subset).  Bipartite matching (P, Hopcroft-Karp) vs 3-dimensional matching (NP-complete).  Linear programming (P, interior-point) vs integer linear programming (NP-complete).  Fractional knapsack (P, greedy) vs 0/1 knapsack (NP-complete).  When a problem looks like one side, check that it is not actually the other.`,
    citation: 'Karp, R. M. (1972). *Reducibility Among Combinatorial Problems.*  Garey, M. R., Johnson, D. S. (1979). *Computers and Intractability.*',
    link: 'https://github.com/andygauge',
    eli5: `These pairs are the spine of the diagnostic.  Each one is a near-mirror, where a single specification change moves a problem from P to NP-complete.  Memorize the pairs and your reflex will improve immediately.

**Euler vs Hamilton.**  Euler circuit visits every edge once and is decided by checking that every vertex has even degree — linear time.  Hamiltonian cycle visits every vertex once and is NP-complete.  The change: edges to vertices.

**2-SAT vs 3-SAT.**  Width-2 clauses give an implication graph whose SCC structure decides satisfiability in linear time.  Width-3 clauses do not collapse to any such structure and are NP-complete.  The change: clause width.

**2-coloring vs 3-coloring.**  Two colors is bipartite testing, BFS-decidable in linear time.  Three or more colors is NP-complete.  The change: number of color classes.

**Shortest path vs longest simple path.**  Shortest path on non-negative weighted graphs is Dijkstra, polynomial.  Longest simple path is NP-complete because it requires no-repeats and finding the longest no-repeat path is essentially Hamilton.  The change: max vs min.

**MST vs Steiner tree.**  MST connects every vertex with minimum total weight, Kruskal or Prim, polynomial.  Steiner tree connects a specified subset of vertices (using others as relays if helpful) with minimum total weight, NP-complete.  The change: optional vertices.

**Bipartite matching vs 3-D matching.**  Matching with two sides is Hopcroft-Karp, polynomial.  Three-dimensional matching (triples instead of pairs) is NP-complete.  The change: dimension.

**LP vs ILP.**  Linear programming with real variables is interior-point, polynomial.  Integer linear programming with integer variables is NP-complete.  The change: integrality.

**Fractional vs 0/1 knapsack.**  Items can be cut: greedy by value/weight ratio, polynomial.  Items must be taken whole: NP-complete (weakly).  The change: divisibility.

The pattern across all eight: a continuity assumption (real values, two classes, two sides, edge-traversal, max one path) keeps the problem in P.  An integrality assumption (whole items, three classes, vertex-traversal, longest path) pushes it to NP-complete.  Continuity opens P.  Integrality closes it.

When your problem feels like one of the right-column problems, check whether you can model it as the left.  Often you can.  Often you have been needlessly heuristic.

This is the page to bookmark.`
  },
  {
    title: 'Common misidentifications',
    tldr: 'Six patterns where you reach for the wrong class.  Each one is the trap this book exists to prevent.',
    gesture: 'The traps cluster.  Six patterns cover almost every case where the wrong tool comes out first.',
    body: `Six recurring misidentifications.  Treating shortest-path-with-non-negative-weights as NP-complete because the graph is large — Dijkstra is O((V+E)logV) and \`petgraph\` ships it.  Treating bipartite matching as NP-complete because the size is large — Hopcroft-Karp scales to millions of edges.  Treating LP as NP-complete because it has many variables — modern interior-point handles millions.  Treating 2-SAT or implication-style constraints as NP-complete — SCC is linear.  Treating problems on DAGs as NP-complete when the cycle-freeness collapses them to DP.  Treating any problem with a matroid structure as needing search when greedy is optimal.  In every case the fix is the same: name the structural property, look up the named algorithm, find the Rust crate.  See the page-37 checklist and the page-38 pairs.`,
    citation: 'Schrijver, A. (2003). *Combinatorial Optimization: Polyhedra and Efficiency.*  Cormen, T. H. et al. (2009). *Introduction to Algorithms,* 3rd ed.',
    link: 'https://github.com/andygauge',
    eli5: `The dividing-line pairs (page 38) give you the structural difference between classes.  This page is the practical companion: the six places where, in your own code, you have most likely reached for the wrong class.

**Misidentification one: large input means hard.**  No.  Input size is only one parameter.  Shortest-path on a graph with ten million edges is still Dijkstra, still O((V+E) log V).  \`petgraph\` and \`pathfinding\` handle this routinely.  Reach for a SAT solver only when the structure is genuinely combinatorial — not when the problem is just big.

**Misidentification two: bipartite matching looks like assignment which looks like ILP.**  Yes, the assignment problem can be modeled as ILP.  No, you do not need to use ILP.  Hopcroft-Karp for unweighted, Kuhn-Munkres (Hungarian) for weighted, both polynomial.  \`pathfinding::kuhn_munkres\` is the right crate.

**Misidentification three: linear programming looks heavy.**  It is not.  HiGHS solves LPs with millions of variables in seconds.  When your problem has linear constraints and a linear objective with real-valued variables, model it as LP and dispatch to HiGHS via \`good_lp\`.  Do not search the solution space yourself.

**Misidentification four: implication constraints look like SAT.**  When clauses have width 2 — every constraint is "if X then Y" — you are in 2-SAT, decidable in linear time by SCC.  Do not encode in CNF and call \`splr\` for what \`petgraph::algo::tarjan_scc\` solves in linear time.

**Misidentification five: cycles complicate everything.**  When your graph is a DAG, many NP-complete problems collapse to polynomial DP.  Topological sort plus dynamic programming over the order solves longest path on DAGs, counts paths, computes expected reward.  Confirm DAG-ness; do the DP.

**Misidentification six: greedy is a hack.**  When the underlying structure is a matroid — forests, bipartite transversals, linearly independent vectors — greedy is provably optimal.  Sort, pick, prove the matroid property.  No search needed.

The common thread: the structural property determines the class.  Name the property and the class declares itself.  The crates are listed in the relevant Part II pages.

The book exists to make this reflex automatic.  Page 37 is the checklist.  Page 38 is the pairs.  This page is the mirror — what you have probably been doing wrong, in case any of it sounds familiar.

Now do less.`
  }
];

export const flat = raw.map((s, i) => ({
  ...s,
  num: String(i + 1).padStart(2, '0'),
  orderIndex: i
}));

export function next(num) {
  const i = flat.findIndex((s) => s.num === num);
  return i >= 0 && i < flat.length - 1 ? flat[i + 1] : null;
}

export function prev(num) {
  const i = flat.findIndex((s) => s.num === num);
  return i > 0 ? flat[i - 1] : null;
}
