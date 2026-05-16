// N or P — a working manager's guide to which engineering problems are cheap
// to solve, which are expensive, and how to tell them apart in a planning
// meeting.  The single most expensive mistake in technical decision-making is
// treating a solved problem as if it were an open research question — or
// vice-versa.  Each page names a class of problem you actually have at work,
// the kind of solution it deserves, and the cost of getting that wrong.
//
// Part I  — The two classes that decide everything (01–05)
// Part II — Problems that are already solved (06–22)
// Part III— Problems that are genuinely hard (23–32)
// Part IV — When "hard" hits your roadmap (33–36)
// Part V  — The diagnostic — how to tell, in a meeting (37–39)

const raw = [
  // ──────── Part I — The two classes that decide everything ────────
  {
    title: 'P and NP — the two classes',
    steps: [
      {
        prose: `A Sudoku checker is the canonical P-class function — it scans the grid once and decides.  A solver is NP — searching for a valid grid is the expensive half.  In Rust both are short, but only the checker is fast.`,
        code: `// O(n²) in the side length — the cheap half.
fn is_valid_sudoku(grid: &[[u8; 9]; 9]) -> bool {
    for i in 0..9 {
        let (mut row, mut col, mut box_) = ([false; 9], [false; 9], [false; 9]);
        for j in 0..9 {
            let (r, c) = (grid[i][j], grid[j][i]);
            let b = grid[(i / 3) * 3 + j / 3][(i % 3) * 3 + j % 3];
            for (v, seen) in [(r, &mut row), (c, &mut col), (b, &mut box_)] {
                if v == 0 { continue; }
                if seen[(v - 1) as usize] { return false; }
                seen[(v - 1) as usize] = true;
            }
        }
    }
    true
}`,
        lang: 'rust'
      }
    ],
    tldr: 'Some problems are cheap to solve forever.  Some are cheap to check but expensive to solve.  The first kind is called P.  The second is NP.',
    gesture: 'Two categories of computing problem — and the line between them is the line that decides your engineering budget.',
    body: `Computing problems split into two categories that matter for every estimate your team makes.  Category one — known as P — covers problems with a known, fast solution.  Doubling the size of the input only multiplies the work by a predictable factor.  Routing, sorting, matching, scheduling on one machine — all in P.  Category two — known as NP — covers problems where, if someone hands you a candidate answer, you can verify it quickly, but finding the answer in the first place may take forever.  Sudoku is the everyday example.  Whether every NP problem is also in P is the most famous unsolved question in computer science.  The working assumption — and the basis of every engineering plan — is that the two are different.  Knowing which category a problem lives in determines whether the work is a week or a quarter.`,
    citation: 'Cook, S. (1971).  Sipser, M. (2013) *Introduction to the Theory of Computation* is the textbook reference.',
    link: 'https://en.wikipedia.org/wiki/P_versus_NP_problem',
    eli5: `Almost every estimating error in engineering comes from misreading which category a problem belongs to.  When the team treats a P-class problem as if it were NP — building elaborate heuristics, buying expensive solvers, hiring optimization specialists — the work takes weeks instead of an afternoon.  When the team treats an NP problem as if it were P — promising an exact answer at scale, in real time, for free — the project misses every deadline and ships a bad approximation that nobody trusts.

The split is not about how hard the problem feels.  It is about whether a known fast solution exists.  A polynomial-time solution is one where the work grows predictably with the input — double the data, the work roughly doubles or quadruples, but it does not explode.  These problems have been studied for decades, and almost every one has a named algorithm in a Rust crate that an engineer can drop in.  Routing a delivery truck through a road network is P.  Matching tutors to students by availability is P.  Allocating ad slots to bidders with a fixed budget is P.

The other category — NP — covers problems where the only honest answer is "we will check candidate solutions until one works."  Some of these have effective approximations.  Some have solvers that work on most real inputs.  Some are genuinely intractable beyond toy sizes.  The Traveling Salesman problem — visit a list of cities in the shortest total tour — is the famous example.

The question P = NP asks whether every NP problem is secretly P, with an undiscovered fast solution.  If so, every codebreaking system on earth fails the next day, and every operations research consultant retires.  Almost nobody believes this is the world.  The plan is to act as if the categories are real.

The book is a field guide to telling them apart.`
  },
  {
    title: 'Checking is cheaper than building',
    steps: [
      {
        prose: `A schedule checker is a tight loop over the constraints — one pass, no search.  Producing a valid schedule from the same constraints is the expensive half and would call a solver.  Same data, two complexity classes.`,
        code: `struct Shift { staff: u32, start: u32, end: u32 }

fn schedule_is_valid(shifts: &[Shift], min_gap: u32) -> bool {
    let mut by_staff: std::collections::HashMap<u32, Vec<&Shift>> = Default::default();
    for s in shifts { by_staff.entry(s.staff).or_default().push(s); }
    for assignments in by_staff.values_mut() {
        assignments.sort_by_key(|s| s.start);
        for w in assignments.windows(2) {
            if w[0].end + min_gap > w[1].start { return false; }
        }
    }
    true
}`,
        lang: 'rust'
      }
    ],
    tldr: 'It is much easier to grade a finished answer than to produce one.  That asymmetry is where the entire field of "hard problems" lives.',
    gesture: 'The gap between verifying an answer and producing one is the whole reason consultants exist.',
    body: `Every NP problem shares a defining shape: somebody hands you a candidate answer, and you can check it in a reasonable amount of time.  Verifying that a delivery route hits every stop, that a schedule violates no rules, that a circuit design wires up correctly — all fast.  Producing the route, the schedule, the design in the first place can be vastly harder.  The asymmetry between checking and producing is where most of the difficulty in software engineering hides.  Build pipelines are checkers.  Test suites are checkers.  Code review is a checker.  The hard, slow, expensive work — the actual writing, planning, designing — is on the producing side.  When your team can describe a checker for a problem but cannot describe a producer, the problem is probably NP.  Treat the estimate accordingly.`,
    citation: 'Sipser, M. (2013) *Introduction to the Theory of Computation,* chapter 7.',
    link: 'https://en.wikipedia.org/wiki/NP_(complexity)',
    eli5: `Think about a math contest.  One person solves the problems.  Another person grades the solutions.  Both jobs have to finish before the bell rings.  Grading is much, much easier than solving — that is why grading happens in minutes and solving takes the whole contest period.  Almost every interesting problem in computing has the same shape.  Checking that an answer is correct is one job.  Finding the answer in the first place is a different and usually much harder job.

This matters for estimating because the two jobs are easy to confuse.  A product manager looking at a problem like "schedule our drivers to cover every shift with no conflicts" might assume that, since the rules are simple to check, the planning must be simple to do.  It is not.  The rules-checker is a polynomial-time algorithm that fits on one screen.  The planner is an NP-complete optimization that needs an industrial solver.

The reverse error is equally common.  A team facing a problem where checking would actually require running an expensive simulation might assume the producer is correspondingly expensive.  Often it is not.  Sometimes the producer is a one-line library call and the team has been overengineering.

The skill is reading a problem and asking two questions in sequence: Could I write a checker that runs fast on a finished answer?  If yes, the problem is at most NP — possibly easier.  Then: Do I know of a fast producer?  If yes, the problem is in P and is a known job.  If no, prepare for a search.

Checking is cheap.  Building is the expensive half.  Estimate the half you are actually doing.`
  },
  {
    title: 'Reducibility — turning one problem into another',
    steps: [
      {
        prose: `Driver-to-delivery assignment is the canonical assignment problem in disguise.  The reduction is mechanical — build a cost matrix, hand it to a solver from \`pathfinding\`, read the matching back.  No new algorithm to write.`,
        code: `use pathfinding::kuhn_munkres::kuhn_munkres_min;
use pathfinding::matrix::Matrix;

fn assign_drivers(miles: Vec<Vec<i32>>) -> Vec<usize> {
    let m = Matrix::from_rows(miles).expect("rectangular");
    let (_total, assignment) = kuhn_munkres_min(&m);
    assignment // assignment[driver] = delivery
}`,
        lang: 'rust'
      }
    ],
    tldr: 'If you can rewrite Problem A as Problem B, then a solver for B is also a solver for A.  This is how engineers reuse other people\'s work.',
    gesture: 'The most leveraged move in engineering is recognizing your new problem is an old problem in disguise.',
    body: `A reduction is a translation from one problem to another such that solving the translated version solves the original.  If you can translate your problem into a known-solved problem cheaply, you inherit that problem's solution and never have to write your own.  This is the most leveraged move in engineering — and the most under-used one.  An assignment problem ("match drivers to deliveries minimizing total miles") is a reduction away from a published algorithm with a Rust library that handles thousands of items in milliseconds.  A constraint problem ("each shift must have at least two staff, no person works two shifts back-to-back") is a reduction away from a solver that the industry already built.  When your team faces a new problem, the first question is not "what should we build" — it is "what known problem is this in disguise."`,
    citation: 'Karp, R. (1972) *Reducibility Among Combinatorial Problems.*  The single most cited paper on the subject.',
    link: 'https://en.wikipedia.org/wiki/Polynomial-time_reduction',
    eli5: `Reductions are the secret superpower of experienced engineers.  Most novel-looking business problems are not novel at all — they are a decades-old textbook problem with the words changed.  "Find which customers to assign to which sales reps" is the assignment problem from 1955.  "Decide which features to ship under a fixed engineering budget" is knapsack from 1957.  "Plan our delivery routes" is vehicle routing from the 1960s.  In every case, an experienced engineer recognizes the underlying shape and reaches for a library or a paper instead of building from scratch.

The translation step matters because once you have done it, you inherit decades of research.  Someone has published the algorithm.  Someone has implemented it as a library.  Someone has benchmarked it on instances ten times the size of yours.  The work has already been done.  Your job is to phrase the problem in the right vocabulary.

In the other direction, reductions are also how we know certain problems are genuinely hard.  Hundreds of business problems — scheduling, routing, packing, allocating — have been shown to be reducible to each other, all sitting in the same difficulty class.  If one of them turns out to be easy, all of them do.  So far, none of them has.  That cluster of mutually-equivalent hard problems is called NP-complete, and the inability to crack any one of them after fifty years of effort is the strongest evidence that the cluster is genuinely hard.

The discipline to develop: in any planning meeting, when a new problem comes up, the first thirty minutes belong to "is this actually a known problem."  More often than not, it is.

The biggest cost savings come not from clever code but from recognizing you do not need clever code.`
  },
  {
    title: 'Hard, harder, hardest — the labels',
    steps: [
      {
        prose: `An \`enum\` is the simplest way to make the labels a thing the codebase carries.  Tag each estimation function with its complexity class, and the procurement question — solver, approximation, or SaaS — falls out of the match arm.`,
        code: `enum Complexity { P, NpComplete, NpHard, CoNp }

fn procurement(problem: Complexity) -> &'static str {
    match problem {
        Complexity::P          => "use the standard library or crate",
        Complexity::NpComplete => "encode and dispatch to a solver",
        Complexity::NpHard     => "approximation or SaaS",
        Complexity::CoNp       => "verifier finds bugs; certifier is the hard half",
    }
}`,
        lang: 'rust'
      }
    ],
    tldr: 'NP-complete is "as hard as any NP problem."  NP-hard is "at least that hard, possibly worse."  Knowing the label tells you what to buy.',
    gesture: 'The vocabulary that separates "expensive but solvable" from "buy the SaaS instead."',
    body: `Four labels show up in engineering conversations about complexity.  P is the cheap category — fast algorithms exist.  NP-complete is the canonical hard category — every problem in it is as hard as every other, and no fast algorithm is known despite enormous effort.  NP-hard is at least that hard, and may be even harder.  Co-NP is the mirror — problems where catching a violation is easy but proving a clean bill of health is not (compliance auditing has this shape).  When a problem you face is labeled NP-complete, the right responses are: model it carefully and hand it to a commercial solver, settle for an approximation with a known quality bound, or buy a SaaS that handles it.  When a problem is labeled NP-hard but the optimization version, the same options apply with looser quality guarantees.`,
    citation: 'Garey, M., Johnson, D. (1979) *Computers and Intractability* — the classic catalog of which problems are which.',
    link: 'https://en.wikipedia.org/wiki/NP-completeness',
    eli5: `When someone in a planning meeting says a problem is NP-complete, they mean: this is a known-hard problem, in a club with hundreds of other known-hard problems, and the fact that none of them has fallen to a fast algorithm in over fifty years is the strongest available evidence that none of them ever will.  Treat the estimate accordingly.

NP-hard is a slightly broader label.  Optimization versions of NP-complete decision problems — "what is the cheapest schedule" rather than "does a schedule under cost X exist" — are NP-hard.  They are at least as hard as NP-complete and sometimes harder.  Most of operations research lives here.

Co-NP is the inversion.  These are problems where confirming a problem (finding a fault, a security flaw, a compliance gap) is easy but certifying the absence of problems is hard.  Software verification, regulatory audit, security scanning — all have co-NP flavor.  You can prove the system is broken by exhibiting one bug.  Proving it is unbroken requires checking everything.

The practical implication of these labels is purchasing.  When your team identifies a problem as NP-complete or NP-hard, the menu of options changes.  Building a from-scratch exact solver is not on the menu — it has been tried.  The options are: model the problem as integer programming and call HiGHS or CPLEX (commercial); use a SAT or constraint solver (open source); buy a domain-specific SaaS (Vroom for routing, OptaPlanner for scheduling, Gurobi for general optimization); or design an approximation that is provably good enough.

The labels are a vocabulary for procurement.  Learn them and the conversation gets shorter.`
  },
  {
    title: 'What if the line collapsed',
    steps: [
      {
        prose: `RSA is the most concrete bet on P ≠ NP.  The encryption is one multiplication; the inverse is factoring.  The Rust \`num-prime\` crate handles both halves and makes the asymmetry visible — primality test in microseconds, factoring of a 200-bit composite in minutes.`,
        code: `use num_prime::nt_funcs::is_prime;
use num_bigint::BigUint;

fn rsa_modulus(p: &BigUint, q: &BigUint) -> BigUint {
    assert!(is_prime(p, None).probably());
    assert!(is_prime(q, None).probably());
    p * q
    // Recovering p, q from p*q alone is the bet.  No fast classical
    // algorithm is known.  The day one is found, every RSA key on the
    // internet is broken.
}`,
        lang: 'rust'
      }
    ],
    tldr: 'If P turned out to equal NP — if every hard problem were secretly easy — banking breaks, drug discovery becomes trivial, and most of operations research disappears overnight.',
    gesture: 'The unproven equality that, if proven, would rewire the entire economy in a week.',
    body: `The question P = NP asks whether every problem that is fast to check is also fast to solve.  The whole world is betting that the answer is no.  Every public-key cryptosystem (banking, messaging, identity, software updates) rests on the assumption that certain NP problems are genuinely hard.  Most of operations research, drug design, protein folding, and AI training would become trivial if the answer turned out to be yes.  Almost nobody believes that.  Decades of attacks on these problems have produced nothing, and the Clay Mathematics Institute will pay a million dollars to anyone who settles the question either way.  The practical implication for your engineering planning is this: do not bet on P = NP being true.  Treat NP-complete problems as hard, build accordingly, and reach for SaaS solvers or approximations rather than waiting for a breakthrough.`,
    citation: 'Aaronson, S. (2017) *P =? NP* is the most accessible survey.',
    link: 'https://www.scottaaronson.com/papers/pnp.pdf',
    eli5: `The P = NP question is the most famous unsolved problem in computer science, and it is also a question about the world economy.  If P turned out to equal NP, the day after the announcement, every encrypted bank transaction would be vulnerable to anyone with a laptop.  Every password-protected service would be compromised.  Every signed software update could be forged.  The internet as a payment and identity system would need to be rebuilt on new foundations.

The upside would be just as dramatic.  Drug discovery, which today requires expensive lab work to find molecules with desired properties, would become a search algorithm — find the binding affinity by computation, not experiment.  Protein folding, which DeepMind partially cracked with AlphaFold in 2020, would collapse into a single algorithm.  Vehicle routing, staff scheduling, supply chain optimization, every NP-complete problem in the business world — solved.  Operations research as a profession would empty out.

The reason almost nobody believes this is that the absence of evidence is now overwhelming.  Fifty years of brilliant researchers attacking specific NP-complete problems for academic glory and commercial reward have produced no polynomial algorithm for any of them.  The known mathematical barriers to a proof of P ≠ NP are nontrivial — but the practical evidence that the problems are genuinely hard is now stacked very high.

For business planning today, the working assumption is that P ≠ NP.  This means: when a problem is labeled NP-complete, do not promise an exact, fast solution.  Buy a solver.  Use an approximation.  Outsource to a SaaS.  Set realistic expectations.

The day the equality flips, every contract gets renegotiated.  Until then, plan for the world you live in.`
  },

  // ──────── Part II — Problems that are already solved ────────
  {
    title: 'Sorting — almost never your problem',
    steps: [
      {
        prose: `\`sort_unstable_by_key\` is the right default — faster than \`sort\` for most workloads, allocates nothing, and is what \`std\` ships.  Reach for \`rayon::par_sort_unstable_by\` when the slice is large enough that the parallel split pays for itself.`,
        code: `use rayon::slice::ParallelSliceMut;

struct Order { id: u64, price_cents: u64, placed_at: u64 }

fn newest_first(orders: &mut [Order]) {
    orders.sort_unstable_by_key(|o| std::cmp::Reverse(o.placed_at));
}

fn newest_first_parallel(orders: &mut [Order]) {
    orders.par_sort_unstable_by_key(|o| std::cmp::Reverse(o.placed_at));
}`,
        lang: 'rust'
      }
    ],
    tldr: 'Putting a list in order is solved.  Your engineers should reach for the standard library.  If they are writing their own sort, ask why.',
    gesture: 'The first problem any programmer learns, and one of the very few where the standard library is always the right answer.',
    body: `Sorting a list — by date, by price, by score, by any key — is one of the most studied problems in computing.  The standard library in every modern language ships an implementation that is faster than anything your team will write.  Rust's standard sort handles millions of items per second per core, is well-tested, and degrades gracefully on adversarial inputs.  When sorting becomes a performance question — typically only at the scale of billions of items — the answer is to use a specialized data layout (radix sort for fixed-width keys, external sort for data that does not fit in memory) or a database that does the work for you.  Almost no business has a sorting problem that is not already solved.  If a ticket on your roadmap is "implement custom sorting," ask whether the real ticket is something else.`,
    citation: 'Knuth, D. (1998) *The Art of Computer Programming, Volume 3.*  Sedgewick, R. (2011) *Algorithms.*',
    link: 'https://doc.rust-lang.org/std/primitive.slice.html#method.sort_unstable',
    eli5: `Sorting is the running example in every introductory programming course.  Generations of students have implemented bubble sort, insertion sort, merge sort, and quicksort as homework.  The result is that every working engineer thinks they understand sorting and almost none of them should ever write a sorting routine in production code.

The standard library implementations are the product of decades of tuning.  They handle the cases your team will not think about — already-sorted inputs, mostly-sorted inputs, inputs with many duplicates, inputs that fit in cache versus inputs that do not, inputs with expensive comparison functions versus cheap ones.  Beating a standard library sort on a generic workload is a multi-week project that almost no team has a business reason to attempt.

There is a theoretical limit to comparison-based sorting that you should know exists — the work grows in proportion to the input times the logarithm of the input.  This means sorting a list ten times larger takes roughly eleven times as long, not a hundred times.  It scales predictably.  Your engineers cannot do better than this without exploiting some special structure of the keys.

The exceptions worth knowing.  When your keys are bounded-width integers or short strings, sorting can be done in time proportional to just the input — radix sort and counting sort skip the comparison limit entirely.  When the data does not fit in memory, you need an external sort algorithm, which databases handle natively.  When you need to pick the top K items rather than sort everything, the standard library has a partial-sort function that runs in linear time.

If a ticket on the roadmap says "improve our sorting performance," the questions to ask are: are we using the standard library, are we sorting more than we need to, and is the right answer actually to push the sort into the database.  Almost always the answer is one of those three.

You do not have a sorting problem.  You have a planning problem.`
  },
  {
    title: 'Traversing a network',
    steps: [
      {
        prose: `Friends-of-friends within three hops — the textbook BFS.  \`petgraph\` exposes \`Bfs\` as a visitor you drive with a loop, so you can stop at any depth without writing the queue or the visited set yourself.`,
        code: `use petgraph::graph::{NodeIndex, UnGraph};
use petgraph::visit::{Bfs, Walker};

fn friends_within(g: &UnGraph<&str, ()>, start: NodeIndex, hops: usize) -> Vec<NodeIndex> {
    let mut bfs = Bfs::new(g, start);
    let mut out = Vec::new();
    let mut depth = vec![usize::MAX; g.node_count()];
    depth[start.index()] = 0;
    while let Some(n) = bfs.next(g) {
        if depth[n.index()] > hops { continue; }
        out.push(n);
        for nbr in g.neighbors(n) {
            if depth[nbr.index()] == usize::MAX {
                depth[nbr.index()] = depth[n.index()] + 1;
            }
        }
    }
    out
}`,
        lang: 'rust'
      }
    ],
    tldr: 'Walking through every connected item in a graph — friends-of-friends, dependencies, file trees — is one of the cheapest operations in computing.',
    gesture: 'Whenever the data shape is "things connected to other things," the operations are cheap.  Plan accordingly.',
    body: `Any time your data takes the shape of items connected to other items — a social graph, a dependency tree, an org chart, a file system, a workflow — the basic operations are cheap.  Visiting every connected item, finding the shortest chain between two items, detecting cycles, finding clusters — all run in time proportional to the number of items plus the number of connections.  No clever data structure or specialized solver is needed.  The Rust library petgraph implements every standard traversal as one function call.  When a feature request looks like "find everyone this person is connected to within three hops," the engineering estimate is a day.  When it looks like "tell me the most influential person in our network," the estimate may also be a day with the right algorithm (PageRank, see page 22).`,
    citation: 'Cormen, Leiserson, Rivest, Stein (2009) *Introduction to Algorithms,* chapter 22.',
    link: 'https://docs.rs/petgraph/latest/petgraph/visit/index.html',
    eli5: `Graph data shows up everywhere in business systems.  Customer relationships, employee org charts, product dependency trees, supply chain links, communication threads, recommendation systems — all graphs.  The good news for planning is that basic graph operations are some of the cheapest things a computer does.

There are two standard ways to walk a graph: breadth-first (visit everything one hop away, then two hops, then three) and depth-first (follow one branch as far as it goes, then back up and try another).  Both touch every node and every connection exactly once.  Both run in time proportional to the size of the graph.  Most business questions about a graph reduce to one of these two walks plus some bookkeeping.

Breadth-first is the right answer for distance questions.  How many degrees of separation between these two users?  Who is within three handoffs of this lead?  Which servers can be reached from the compromised host?  All breadth-first.

Depth-first is the right answer for structural questions.  Are there any circular dependencies in this build graph?  Which modules form an isolated subsystem?  What is the right order to apply these database migrations?  All depth-first.

In Rust, the petgraph library exposes both as one-line calls.  Build the graph, ask for a traversal, iterate the result.  Your team should not be writing their own.

The estimating implication is that any feature whose core operation is "walk the graph" should be measured in days, not weeks.  The work is in the data modeling — defining what counts as a node, what counts as an edge, what metadata each carries — not in the traversal itself.

When a graph problem feels expensive, the question to ask is whether you are doing more than one walk per query.  If the same walk is hitting the database every time a user clicks, you need a cache or a precomputed result.  The walk itself is cheap.  Doing it a hundred million times is not.`
  },
  {
    title: 'Routing — the shortest path through a network',
    steps: [
      {
        prose: `Build the road graph as a \`DiGraph\` with travel-minute edge weights, then call \`dijkstra\` once.  The return is a \`HashMap\` from each reachable intersection to the cheapest distance.  Sixty years of algorithms, four lines of glue.`,
        code: `use petgraph::algo::dijkstra;
use petgraph::graph::{DiGraph, NodeIndex};

fn fastest_routes(road: &DiGraph<&str, u32>, from: NodeIndex)
    -> std::collections::HashMap<NodeIndex, u32>
{
    dijkstra(road, from, None, |e| *e.weight())
}`,
        lang: 'rust'
      }
    ],
    tldr: 'Finding the cheapest path from A to B in any kind of network is solved.  Every map app uses the same idea.  Your team should reach for the library.',
    gesture: 'Routing problems are a settled category — and one of the most common places engineering teams waste weeks reinventing the standard answer.',
    body: `Routing problems — given a network with costs on each link, find the cheapest path from one point to another — are completely solved when all costs are non-negative.  The algorithm is named for Edsger Dijkstra, who published it in 1959.  Every map application, every game pathfinder, every logistics platform uses it.  Cost grows roughly with the size of the network — a network ten times bigger takes about eleven times longer to route through.  Rust's petgraph and pathfinding libraries both implement it as a one-line call.  When your team estimates more than a day on a routing feature with non-negative costs, they are either solving a different problem (negative costs?  See page 09.  Multiple stops in any order?  Page 25) or they are not using the library.`,
    citation: 'Dijkstra, E. (1959) *A Note on Two Problems in Connexion with Graphs.*',
    link: 'https://docs.rs/petgraph/latest/petgraph/algo/dijkstra/fn.dijkstra.html',
    eli5: `Edsger Dijkstra invented the shortest-path algorithm in twenty minutes at a café in Amsterdam in 1956.  He published it three years later.  Sixty-five years later, it is the engine inside every map application, every car navigation system, every game pathfinder, every logistics platform, every internet routing protocol.  It is one of the most successful algorithms in the history of computing.

For a business planning purposes, what matters is the shape of the problem it solves.  You have a network of points connected by paths, each path with a cost — distance, time, dollars, latency.  You want the cheapest way to get from one point to another.  As long as no path has negative cost (no reverse-arbitrage), Dijkstra's algorithm finds the answer in time roughly proportional to the size of the network.

The key word is roughly.  Doubling the network size does not double the work, it slightly more than doubles it — the work grows with the network size times the logarithm of the number of points.  In practice, this means a routing query over a road network of a million intersections takes milliseconds on a single laptop core.  Routing over a hundred million takes a couple of seconds.

In Rust, the algorithm is a one-line call against either the petgraph library or the pathfinding library.  Your team writes a function that, given a point, returns its neighbors and the cost of each edge.  The library handles the rest.

Where routing becomes harder is when the problem is not actually shortest-path.  If you need to visit many points in any order, that is the Traveling Salesman problem and it is genuinely hard (page 25).  If you have multiple vehicles with capacity constraints, that is vehicle routing and you should buy a SaaS like Vroom or OptiMoR.  If the costs change in real time, that is dynamic routing and you need a different approach.

But for plain "cheapest path from A to B" with positive costs, the answer is settled.  Use the library.`
  },
  {
    title: 'Routing when paths can have negative costs',
    steps: [
      {
        prose: `Currency arbitrage as a graph: each edge weight is \`-ln(rate)\`.  \`bellman_ford\` either returns the shortest-path table or signals a negative cycle — and the negative cycle is the arbitrage opportunity, not an error.`,
        code: `use petgraph::algo::bellman_ford;
use petgraph::graph::{DiGraph, NodeIndex};

fn detect_arbitrage(fx: &DiGraph<&str, f32>, from: NodeIndex) -> Result<(), &'static str> {
    match bellman_ford(fx, from) {
        Ok(_paths) => Ok(()),
        Err(_) => Err("negative cycle — arbitrage opportunity exists"),
    }
}`,
        lang: 'rust'
      }
    ],
    tldr: 'When some paths actually save money — currency arbitrage, refund flows, financial netting — the standard router fails.  A slower but still-cheap variant handles it.',
    gesture: 'Negative-cost paths break the standard router.  The fix is slower, but it stays cheap.',
    body: `Some routing problems involve paths with negative cost.  Currency exchange arbitrage is the classic example — a sequence of trades can return more than you started with, expressible as a negative-cost cycle in a graph.  Refund flows in finance, time-shifted scheduling where doing a task earlier saves money, and constraint systems where some inputs offset others all share this shape.  The standard shortest-path algorithm fails on negative costs — it can be tricked into committing to a path that looks short locally but is actually long.  The Bellman-Ford algorithm handles negative costs at a higher computational cost — work grows with the network size times the number of edges, not the logarithm of nodes.  It also detects when a negative-cost cycle exists, which is the signal for "your input data has an arbitrage opportunity."  Rust's petgraph implements it as a single function call.`,
    citation: 'Bellman, R. (1958) *On a Routing Problem.*  Ford, L. (1956) *Network Flow Theory.*',
    link: 'https://docs.rs/petgraph/latest/petgraph/algo/bellman_ford/fn.bellman_ford.html',
    eli5: `Most routing problems have non-negative costs and the standard library handles them.  But a surprising number of business problems have negative-cost edges that you might not initially recognize as routing problems at all.

Currency arbitrage is the textbook case.  Take the logarithm of each exchange rate and negate it.  A profitable cycle of trades — buy USD with EUR, EUR with JPY, JPY back to USD with more than you started — becomes a negative-cost cycle in a graph of currency pairs.  Detecting whether arbitrage exists is exactly the question Bellman-Ford answers.

The same shape shows up in financial netting (some balances are debts, some are credits, find the cheapest way to settle them all).  In time-shifted scheduling (doing a task this week saves cost compared to next week).  In constraint difference systems (every constraint of the form "x must be at most y plus 5" is an edge with weight 5; the system is solvable iff there are no negative cycles).

The standard router (Dijkstra, page 08) cannot handle this.  It commits to paths based on local cost decisions, and a single negative edge later in the graph can invalidate those decisions.  Bellman-Ford takes a different approach — it relaxes every edge in the graph repeatedly, enough times to guarantee that every shortest path has been found.  This is slower than Dijkstra but still polynomial — work grows with the product of nodes and edges, not exponentially.

The negative-cycle detection is often the most valuable output.  If your input data has negative cycles, your "find the cheapest path" question has no answer (you could go around the cycle forever, getting cheaper).  But the existence of the cycle is itself useful information — it tells you the system has an arbitrage opportunity, a scheduling inconsistency, or a constraint violation.

In Rust, this is petgraph's bellman_ford function.  Returns the distances or an error indicating the negative cycle.  Twenty lines of glue and your team has the answer.

When the standard router does not fit, the slower router does — and stays in the cheap-to-solve category.`
  },
  {
    title: 'Distance from everywhere to everywhere',
    steps: [
      {
        prose: `\`floyd_warshall\` fills the entire pair-wise distance table in one call.  On the petgraph API it returns a \`HashMap\` keyed by \`(NodeIndex, NodeIndex)\` — perfect for caching a delivery-zone travel matrix you precompute once and serve from forever.`,
        code: `use petgraph::algo::floyd_warshall;
use petgraph::graph::{DiGraph, NodeIndex};
use std::collections::HashMap;

fn travel_matrix(zones: &DiGraph<&str, u32>)
    -> HashMap<(NodeIndex, NodeIndex), u32>
{
    floyd_warshall(zones, |e| *e.weight())
        .expect("no negative cycles in travel times")
}`,
        lang: 'rust'
      }
    ],
    tldr: 'When you need the distance from every point to every other point — not just one start — there is a one-page algorithm that handles it.',
    gesture: 'Three nested loops and a table.  When the network is small and you want every distance, this is the answer.',
    body: `Some questions require knowing the distance between every pair of points in a network, not just from one start.  Travel-time matrices for delivery planning.  Latency tables between data centers.  Reachability matrices for org charts.  The Floyd-Warshall algorithm fills the entire table at once and runs in time proportional to the cube of the number of points.  This sounds expensive but is competitive for networks up to about a thousand nodes — fast enough to recompute on demand for many business uses.  Rust's petgraph implements it directly.  When your network is larger than a few thousand nodes and you need all pairs, run the single-source router (Dijkstra) once per starting point in parallel instead.  When you need a few specific pairs, run it once per pair.`,
    citation: 'Floyd, R. (1962) *Algorithm 97: Shortest Path.*  Warshall, S. (1962).',
    link: 'https://docs.rs/petgraph/latest/petgraph/algo/floyd_warshall/fn.floyd_warshall.html',
    eli5: `The Floyd-Warshall algorithm is one of the prettiest algorithms in computer science.  It is three nested loops and one assignment in the middle.  When you run it on a network, it fills in a complete table of distances from every point to every other point.

The business uses come up more often than you might expect.  Logistics planning often needs a complete travel-time matrix between warehouses or delivery zones.  Multi-tenant systems need latency tables between data centers.  Knowledge graphs need reachability between concepts.  When the network is small enough — up to about a thousand nodes — Floyd-Warshall fills the entire table in seconds.

The cost is that work grows with the cube of the number of nodes.  Doubling the network multiplies the work by eight.  This is fine for small networks and infeasible for large ones.  The crossover where running the single-source router (Dijkstra) once per starting point becomes faster depends on graph density — for sparse networks, Dijkstra-times-n is faster around a few hundred nodes; for dense networks, Floyd-Warshall holds up longer.

The reason to prefer Floyd-Warshall when it fits is simplicity.  The algorithm has no data structures to maintain — just a flat matrix of distances.  It is trivial to parallelize across CPUs.  It is trivial to cache.  When the network does not change often, you compute the table once and look up distances forever after.

In Rust, petgraph's floyd_warshall function takes a graph and an edge-weight function and returns the distance matrix.  Your team should not be writing this themselves.

For larger networks, the right pattern is to precompute the distance matrix in batch (overnight, in a worker process), store it in a database or a key-value store, and serve queries from the precomputed table.  The recomputation is expensive; the lookups are free.

When the question is "every distance to every other place," the answer is in the toolbox.`
  },
  {
    title: 'Cheapest network that connects everything',
    steps: [
      {
        prose: `\`min_spanning_tree\` returns the edges of the optimal tree as an iterator you can fold straight into a new graph.  For a fiber-rollout plan, the input is locations with cable costs and the output is the cheapest provably-complete network.`,
        code: `use petgraph::algo::min_spanning_tree;
use petgraph::data::FromElements;
use petgraph::graph::UnGraph;

fn cheapest_fiber(sites: &UnGraph<&str, u32>) -> UnGraph<&str, u32> {
    UnGraph::from_elements(min_spanning_tree(sites))
}`,
        lang: 'rust'
      }
    ],
    tldr: 'When you need to connect a set of locations with the minimum total wire, road, or cable, there is a greedy algorithm that finds the best answer guaranteed.',
    gesture: 'Connect every point with the cheapest wires that form no loop.  This is one of the few business problems where greedy is provably optimal.',
    body: `When you need to connect a set of points — fiber backbone, electrical grid, road network, communication mesh — with the minimum total length of cable or path, the problem is a minimum spanning tree.  Two algorithms find the exact best answer: sort all possible connections by cost and add them in order, skipping any that would form a redundant loop (Kruskal 1956); or grow a tree from any starting point, always adding the cheapest connection to a new point (Prim 1957).  Both are fast — work grows roughly with the number of possible connections.  Rust's petgraph has both.  When the problem changes to "connect this subset, using others as relays if it saves money," it becomes the Steiner tree problem and is genuinely hard (NP-complete, see page 38 for the contrast).  The line between cheap and expensive is whether every point must be connected or only a subset.`,
    citation: 'Kruskal, J. (1956).  Prim, R. (1957).  Borůvka, O. (1926) is the oldest.',
    link: 'https://docs.rs/petgraph/latest/petgraph/algo/fn.min_spanning_tree.html',
    eli5: `Connecting a set of locations with the cheapest possible total infrastructure is a classic business problem.  Telecom companies solving fiber rollout.  Utilities planning the grid.  Cloud providers planning data center interconnect.  Logistics companies planning trunk routes.  All minimum spanning tree problems, all solved.

The algorithms are about as simple as algorithms get.  Kruskal's version: list every possible connection with its cost, sort the list cheapest first, add connections in order, skip any that would create a loop.  Stop when every location is connected.  The result is provably the minimum total cost.  Prim's version: start at any one location, repeatedly add the cheapest connection that reaches a new location.  Same answer.

The reason greedy works here — and almost nowhere else for genuinely combinatorial problems — is a structural property of spanning trees called the cut property.  For any split of the locations into two groups, the cheapest connection crossing the split must be in some optimal spanning tree.  Both algorithms exploit this fact.  The result is one of the cleanest examples of a greedy algorithm being provably optimal.

In Rust, petgraph's min_spanning_tree function does the work.  Your team feeds in a graph; the library returns the edges of the optimal tree.  This is a half-day feature, not a quarter-long project.

The trap to watch for is a variant that looks similar but is actually much harder.  Steiner tree is the problem where you only need to connect a specified subset of locations — and you are allowed to use other locations as relays if it saves money.  This added flexibility breaks the greedy structure.  Steiner tree is NP-complete.  The problem looks innocent in a planning meeting ("connect just these five offices, but route through others if cheaper") and it is the wrong problem to underestimate.

If every location must be on the network, the work is cheap.  If only a subset must be, the work is expensive.  Read the requirement carefully.

See page 38 for the cluster of "cheap twin vs expensive twin" pairs.  This is one of the most important.`
  },
  {
    title: 'Flow, capacity, and bottlenecks',
    steps: [
      {
        prose: `Project-selection-under-budget reduces to max-flow: a source feeds each project's revenue, each project feeds its required resources, resources feed a sink with capacity equal to the budget.  Run \`ford_fulkerson\` once; the max flow is the optimal portfolio value.`,
        code: `use petgraph::algo::ford_fulkerson;
use petgraph::graph::{DiGraph, NodeIndex};

fn max_throughput(network: &DiGraph<&str, u32>, source: NodeIndex, sink: NodeIndex) -> u32 {
    let (flow, _flows) = ford_fulkerson(network, source, sink);
    flow
}`,
        lang: 'rust'
      }
    ],
    tldr: 'How much water can flow through a network of pipes — and where the bottleneck is — is solved.  Many surprising business problems reduce to this.',
    gesture: 'Flow through a network is a polynomial problem.  Image segmentation, project selection, sports elimination, ad allocation — all secretly the same problem.',
    body: `The maximum-flow problem asks: given a network of pipes (or connections, or assignments, or commitments) with capacity on each, how much can flow from a source to a sink?  The companion question, minimum cut, asks: what is the cheapest set of connections to sever to disconnect them?  These two answers are always equal — a famous result from 1956.  Both are computable in polynomial time.  Many business problems that do not look like flow reduce to it: image segmentation in vision, project selection under budget, baseball elimination, advertising slot allocation, image matting, scheduling with resource constraints.  When a team recognizes a flow structure, the problem moves from intractable to a library call.  Rust's petgraph implements the standard flow algorithm.  For larger or more nuanced flow problems, modeling as linear programming (page 19) and calling HiGHS is the production approach.`,
    citation: 'Ford, L., Fulkerson, D. (1956) *Maximal Flow Through a Network.*',
    link: 'https://docs.rs/petgraph/latest/petgraph/algo/ford_fulkerson/fn.ford_fulkerson.html',
    eli5: `The maximum-flow problem is the secret backbone of a startling fraction of business optimization problems.  On its face, it is simple: water flows from a source through a network of pipes, each pipe has a capacity, how much water can reach the sink?  The classical theorem — proven by Ford and Fulkerson in 1956 — is that the answer equals the minimum total capacity you would need to cut to disconnect source from sink.  Flow and cut are two sides of the same coin.

What makes flow important for business planning is the long list of seemingly unrelated problems that reduce to it.  Matching applicants to jobs subject to capacity constraints (each job can take so many people, each person can take so many jobs)?  Max-flow.  Picking which projects to fund subject to budget?  Max-flow.  Allocating ad slots to advertisers subject to bid and budget constraints?  Max-flow.  Cutting an image into foreground and background based on pixel similarity?  Max-flow.  Determining whether a baseball team is mathematically eliminated from playoff contention?  Max-flow.

In each case, an experienced engineer recognizes the flow structure and the problem moves from a research project to a library call.  The recognition is the hard part.  The algorithm is decades old.

For modest-sized problems, Rust's petgraph implements the standard Edmonds-Karp algorithm directly.  For larger or more nuanced problems, the right approach is to model the flow as a linear program and dispatch to an LP solver like HiGHS — modern LP solvers handle flow problems with millions of variables in seconds.

The teaching for planning: when a problem involves capacity constraints, source-to-sink shape, or matching with limits, ask whether it reduces to flow.  If yes, the work is days.  If no, look for other reductions before assuming the problem is novel.

Many of your hardest-looking problems are flow problems wearing different clothes.`
  },
  {
    title: 'Matching two sides',
    steps: [
      {
        prose: `\`pathfinding::kuhn_munkres\` is the Hungarian algorithm in one call.  Feed it a square cost matrix — rows are workers, columns are jobs, cells are costs — and it returns the assignment that minimizes total cost.`,
        code: `use pathfinding::kuhn_munkres::kuhn_munkres_min;
use pathfinding::matrix::Matrix;

fn assign_jobs(cost: Vec<Vec<i32>>) -> (i32, Vec<usize>) {
    let m = Matrix::from_rows(cost).expect("square cost matrix");
    kuhn_munkres_min(&m) // (total_cost, assignment[worker] = job)
}`,
        lang: 'rust'
      }
    ],
    tldr: 'Pairing up applicants with jobs, drivers with deliveries, tutors with students — when there are two distinct sides, this is solved and fast.',
    gesture: 'Two-sided matching is a settled category.  Buy the algorithm.  Do not let your team build it.',
    body: `Matching problems with two distinct sides are completely solved.  Pairing job applicants with positions, drivers with deliveries, students with mentors, ads with slots — all bipartite matching.  Two questions arise: maximum matching (pair as many as possible) and assignment (find the pairing with the lowest total cost).  Both are polynomial.  Hopcroft-Karp handles unweighted matching at scale.  The Hungarian algorithm — also called Kuhn-Munkres — handles cost-minimizing assignment.  Rust's pathfinding library implements both as one-line calls and handles tens of thousands of items in milliseconds.  When the problem has more than two sides — for example, matching student to mentor to time slot all together — it becomes the three-dimensional matching problem and is genuinely hard (NP-complete, see page 38).  Two sides cheap, three sides expensive.`,
    citation: 'Hopcroft, J., Karp, R. (1973) for maximum matching.  Kuhn, H. (1955) for assignment.  König, D. (1931) for the structural foundation.',
    link: 'https://docs.rs/pathfinding/latest/pathfinding/kuhn_munkres/index.html',
    eli5: `Two-sided matching shows up in business constantly.  Applicants to jobs, customers to support reps, drivers to deliveries, tutors to students, ads to ad slots, organs to recipients, surgeons to operating rooms.  Every one of these is the same problem in different vocabulary.

The structure is: two sets, with potential pairings between them, and some criterion to optimize.  When the criterion is "maximum number of pairings," the problem is bipartite matching and is solved by Hopcroft-Karp's 1973 algorithm.  When the criterion is "lowest total cost," it is the assignment problem and is solved by the Hungarian algorithm, also known as Kuhn-Munkres, from 1955.  Both are polynomial.  Both handle tens of thousands of items in milliseconds on a laptop.  Both are one function call in Rust's pathfinding library.

The fact that these are solved is not always obvious to product teams.  Engineering tickets that read "build matching system" routinely turn into multi-week projects when an unfamiliar team tries to design the algorithm from scratch.  The right ticket is "wire up Kuhn-Munkres for our assignment problem."  Days, not weeks.

The trap is dimension.  Two-sided matching is in the cheap category.  Three-sided matching — match three things together at once, like student to mentor to time slot — is NP-complete.  The problem looks innocent ("just one more dimension") and it is not.  When the requirement involves a triple constraint, the matching category changes and the engineering estimate triples.

A workaround for three-sided problems: solve them sequentially.  Match students to mentors first (two-sided, cheap), then match mentor-student pairs to time slots (two-sided again, cheap).  The result is not provably optimal in the three-sided sense, but it is often good enough and stays in the affordable category.

When you see "matching" in a requirement, the first question is how many sides.  Two — cheap.  Three or more — buy a solver or accept an approximation.`
  },
  {
    title: 'Matching with no clean sides',
    steps: [
      {
        prose: `Roommate pairing has no left/right split — any student can pair with any other.  petgraph's \`maximum_matching\` runs the blossom algorithm and returns the maximum set of disjoint pairs.`,
        code: `use petgraph::algo::matching::maximum_matching;
use petgraph::graph::UnGraph;

fn roommate_pairs(compat: &UnGraph<&str, ()>) -> Vec<(&str, &str)> {
    let m = maximum_matching(compat);
    m.edges()
        .map(|(a, b)| (compat[a], compat[b]))
        .collect()
}`,
        lang: 'rust'
      }
    ],
    tldr: 'When the matching has no natural left/right split — roommate assignment, peer-to-peer pairing — there is still a polynomial algorithm.  It is just harder.',
    gesture: 'Matching without a clean two-sided structure is still in the cheap category.  Surprising, and worth knowing.',
    body: `Some matching problems have no natural two-sided structure.  Assigning roommates to share spaces, pairing players in a tournament, matching peer-to-peer transactions — every participant could potentially match with every other.  These look harder than two-sided matching and historically were thought to be.  Jack Edmonds in 1965 proved otherwise — general matching is still polynomial, just with more complex machinery.  The blossom algorithm handles odd-length cycles in the matching graph that break simpler approaches.  Rust's petgraph implements maximum matching for general graphs.  When you see a matching problem and your first instinct is "this is just like the two-sided case but more flexible," that instinct is right — and the algorithm is in the library.  Three-dimensional and higher-dimensional matching remain hard; only the no-clean-sides two-dimensional case is in the cheap category.`,
    citation: 'Edmonds, J. (1965) *Paths, Trees, and Flowers* — also the paper that defined "polynomial time" as the working definition of "efficient."',
    link: 'https://docs.rs/petgraph/latest/petgraph/algo/matching/fn.maximum_matching.html',
    eli5: `Matching without a clean two-sided structure shows up in business more than you would expect.  University roommate assignment.  Tournament bracket generation.  Peer-to-peer payment netting.  Carpool group formation.  In each case, every participant could potentially pair with every other, and the question is to find the maximum number of pairings.

Until 1965, this was thought to be genuinely hard.  The standard two-sided matching algorithm fails on these problems because odd-length cycles in the matching graph create configurations where the simple greedy search gets stuck.  Jack Edmonds at the US National Bureau of Standards in 1965 proved that the problem is still polynomial — you just need a more clever search.  His algorithm contracts odd cycles into super-nodes, runs the standard search on the contracted graph, then expands the cycles back.  The result was a major surprise to the field at the time.

Edmonds's paper did something more than solve the matching problem.  It introduced the modern definition of "efficient computation" as polynomial time.  Before 1965, "efficient" was an informal term.  After Edmonds, the formal definition stuck and the field reorganized around it.

For business planning, the relevant fact is that one-pool matching (anyone to anyone) is still in the cheap category.  Rust's petgraph implements maximum_matching for general graphs.  The estimate for a roommate-assignment feature, a peer-pairing system, or a tournament-bracket generator is a few days, not a few weeks.

The dimension warning from page 13 still applies.  Two-dimensional matching, even without sides, is cheap.  Three-dimensional matching (any-to-any-to-any) is NP-complete and requires the solver-or-SaaS treatment.

The shape of the data matters more than the labels on the sides.  Two-way matching of any kind — even without sides — is solved.`
  },
  {
    title: 'Either-or constraints',
    steps: [
      {
        prose: `2-SAT reduces to strongly-connected components on the implication graph.  Each clause \`(a ∨ b)\` becomes two implication edges (\`¬a → b\` and \`¬b → a\`).  A variable and its negation in the same SCC mean unsatisfiable — otherwise the SCC order gives a satisfying assignment.`,
        code: `use petgraph::algo::tarjan_scc;
use petgraph::graph::DiGraph;

fn two_sat_feasible(n: usize, clauses: &[(i32, i32)]) -> bool {
    let mut g = DiGraph::<(), ()>::new();
    let nodes: Vec<_> = (0..2 * n).map(|_| g.add_node(())).collect();
    let idx = |lit: i32| {
        let v = lit.unsigned_abs() as usize - 1;
        if lit > 0 { 2 * v } else { 2 * v + 1 }
    };
    for &(a, b) in clauses {
        g.add_edge(nodes[idx(-a)], nodes[idx(b)], ());
        g.add_edge(nodes[idx(-b)], nodes[idx(a)], ());
    }
    let sccs = tarjan_scc(&g);
    let mut comp = vec![0usize; 2 * n];
    for (i, c) in sccs.iter().enumerate() {
        for &n in c { comp[n.index()] = i; }
    }
    (0..n).all(|v| comp[2 * v] != comp[2 * v + 1])
}`,
        lang: 'rust'
      }
    ],
    tldr: 'When every rule in the system is "if A then B" — exactly two-piece constraints — there is a linear-time check whether the rules are satisfiable.',
    gesture: 'Two-piece logical constraints are in the cheap category.  Three-piece are not.  The boundary is sharp.',
    body: `Some constraint problems have the shape "for each rule, exactly one of two things must hold" — staff assignments where each shift has two possible covers, layout problems where each item must be in one of two positions, configuration problems with binary either-or rules.  These problems can be checked for feasibility in linear time by translating each rule into a logical implication and analyzing the resulting graph.  This is the 2-SAT problem and it is in the cheap category.  When the constraints have three or more pieces — for each rule, exactly one of three things must hold — the problem becomes 3-SAT and is NP-complete.  The line between two and three is the most famous complexity boundary in computer science.  When you see two-piece rules everywhere, you are in the cheap category and a 2-SAT model with the petgraph library handles it.`,
    citation: 'Aspvall, B., Plass, M., Tarjan, R. (1979) *A Linear-Time Algorithm for Testing the Truth of Certain Quantified Boolean Formulas.*',
    link: 'https://en.wikipedia.org/wiki/2-satisfiability',
    eli5: `The two-piece-versus-three-piece distinction in logical constraints is one of the most useful boundaries in computer science.  When every constraint in a system involves exactly two variables, the system can be checked for satisfiability in linear time.  When some constraint involves three variables, the system is NP-complete.  The boundary is at width two, and crossing it is a cliff, not a slope.

Business cases that fit the two-piece structure are more common than they sound.  Scheduling where every shift must be covered by one of two named employees.  Layout where every component must go in one of two slots.  Permission systems where every role must include or exclude a specific capability.  Configuration where every choice forces another choice.  In each case, the constraint takes the form "if A then B" — and a system of these constraints can be modeled as a graph and analyzed in linear time.

The technique is to build a graph where each variable and its negation are nodes, and each constraint becomes a pair of implication edges.  Running a standard graph-analysis algorithm (strongly connected components) on this graph determines whether a valid assignment exists, and if so, constructs one.  The whole thing is about fifty lines of code on top of Rust's petgraph library.

The cliff at three constraints is dramatic.  3-SAT is the canonical NP-complete problem.  No polynomial-time algorithm is known.  Industrial SAT solvers (page 23) can solve very large instances in practice through clever heuristics, but the worst case is exponential.

The teaching for planning: when a constraint system can be expressed entirely with two-variable rules, it is in the cheap category and a graph-based check answers it in linear time.  When some rules genuinely require three variables (or more), the problem becomes a SAT problem and you reach for a solver.  The check on which side you are on is simple — look at the constraints and count the variables in each one.

Two is cheap.  Three is expensive.  No middle ground.`
  },
  {
    title: 'Dependency order — when the graph has no cycles',
    steps: [
      {
        prose: `petgraph's \`toposort\` returns the build order or an error pointing at a cycle.  Once you have the order, every NP-hard graph problem that becomes easy on DAGs — longest path, counting completions, critical path — is one linear scan over the sorted list.`,
        code: `use petgraph::algo::toposort;
use petgraph::graph::{DiGraph, NodeIndex};

fn build_order(deps: &DiGraph<&str, ()>) -> Result<Vec<NodeIndex>, NodeIndex> {
    toposort(deps, None).map_err(|cycle| cycle.node_id())
}`,
        lang: 'rust'
      }
    ],
    tldr: 'When the data has no circular dependencies — build graphs, prerequisite chains, version histories — many problems collapse into one linear pass.',
    gesture: 'No cycles, no problem.  DAG-shaped data unlocks an enormous toolbox of fast algorithms.',
    body: `Directed acyclic graphs (DAGs) are the data shape of build systems, prerequisite chains, version histories, computation pipelines, and most workflow systems.  The defining property is "no cycles" — you can list the items in an order where every dependency comes before what depends on it.  Computing that order is linear time (topological sort).  And once you have it, an enormous range of problems that are hard on general graphs become trivial: longest paths, shortest paths with negative costs, counting completions, computing expected costs.  All linear passes over the topological order.  Rust's petgraph has topological sort as one call.  When your problem lives on a DAG, you are in the cheap category and your team should ship the feature in days.`,
    citation: 'Kahn, A. (1962) *Topological Sorting of Large Networks.*',
    link: 'https://docs.rs/petgraph/latest/petgraph/algo/fn.toposort.html',
    eli5: `A directed acyclic graph — or DAG — is a flow of dependencies with no circles.  Build systems are DAGs.  Course prerequisites are DAGs.  Software dependency graphs are DAGs.  Workflow engines, data pipelines, computation graphs in machine learning, version control histories — all DAGs.

The structural property that makes DAGs cheap is the topological order.  Because there are no cycles, you can list every item in a sequence such that all of its dependencies appear earlier in the sequence.  Computing this ordering takes time proportional to the size of the graph.

The reason this matters for planning is that an enormous number of business problems are easy on DAGs and hard on general graphs.  The longest-path problem on a general graph is NP-complete.  On a DAG it is linear.  The shortest-path problem with negative edges takes the slower Bellman-Ford algorithm on general graphs.  On a DAG it is one pass.  Counting the number of completions of a workflow, computing the expected duration of a project, finding the critical path through a Gantt chart — all linear on DAGs.

The estimating discipline: when a problem involves dependencies, ask whether the dependencies could ever form a cycle.  If the answer is no — and it usually is, for build systems, prerequisite chains, and workflows — the problem is on a DAG and is cheap.  If the answer is yes, you are on a general graph and the toolbox shrinks.

In Rust, petgraph's toposort function returns the ordering or an error if a cycle exists.  Combined with a hand-written loop over the order, your team can solve almost any DAG question in a day.  The work is in defining the graph correctly; the algorithm is free.

Many production systems have hidden DAG structure that is not exploited.  When a feature request looks expensive, check whether the underlying data is acyclic.  Often it is, and the work moves from a quarter to a sprint.`
  },
  {
    title: 'Searching for text patterns',
    steps: [
      {
        prose: `\`aho-corasick\` compiles a list of keywords into a single automaton, then scans a body of text in one pass.  Ideal for content moderation, spam filtering, intrusion detection — anywhere you need many needles in one haystack.`,
        code: `use aho_corasick::AhoCorasick;

fn flag(text: &str, banned: &[&str]) -> Vec<(usize, String)> {
    let ac = AhoCorasick::new(banned).expect("valid patterns");
    ac.find_iter(text)
        .map(|m| (m.start(), banned[m.pattern()].to_string()))
        .collect()
}`,
        lang: 'rust'
      }
    ],
    tldr: 'Finding a needle in a haystack of text is solved.  Rust has industrial-grade libraries that scan gigabytes per second.',
    gesture: 'Pattern matching in text is a solved category.  Reach for the library; the library is faster than anything your team will write.',
    body: `Searching for patterns in text — substrings, regular expressions, dictionaries of keywords — is one of the most engineered problems in computing.  Industrial implementations scan gigabytes of text per second on a single CPU core.  The libraries handle every edge case — Unicode, multi-pattern, anchored, case-insensitive, with SIMD acceleration.  Rust's aho-corasick library handles multi-pattern matching (finding any of thousands of keywords in a body of text).  Rust's regex library handles regular expressions and is the fastest in widespread use.  Rust's memchr library handles single-byte and short-pattern scanning with SIMD.  Your team should never write their own pattern matcher.  The only flavor that is genuinely hard is regular expressions with backreferences (PCRE-style) — those can be made to run exponentially slow.  Rust's regex library deliberately excludes them.`,
    citation: 'Knuth, Morris, Pratt (1977).  Aho, Corasick (1975).  These algorithms are over forty years old and the library implementations have been refined ever since.',
    link: 'https://docs.rs/aho-corasick/latest/aho_corasick/',
    eli5: `Pattern matching in text is one of those problems where the libraries are so far ahead of what an in-house team will produce that there is no business case to write your own.  Modern implementations of substring search, regex matching, and multi-pattern keyword scanning run at gigabytes per second on a single core, with hand-tuned SIMD assembly for the inner loop.

The standard library or the regex library handles the basics.  When you need multi-pattern matching — looking for any of thousands of keywords in a body of text, as in spam filtering, content moderation, or intrusion detection — the Aho-Corasick algorithm is the right tool, and Rust's aho-corasick library is industrial-grade.  When you need single-pattern search at maximum speed, memchr exploits SIMD instructions to scan a hundred bytes per cycle.

The one trap to know about: regular expressions with backreferences.  PCRE-style regular expressions (the kind in Perl, PHP, JavaScript) allow patterns to refer back to previously matched substrings, which lets you express things like "the same word twice in a row."  Patterns with backreferences are NP-hard in the worst case, and a malicious input can cause them to run exponentially slow.  This is the source of regex-based denial-of-service attacks.

Rust's regex library deliberately omits backreferences.  This is a feature, not a bug.  Every pattern is guaranteed to match in time proportional to the input length.  If your team's existing regex usage requires backreferences, the right path is to model the requirement differently — usually parse the text first, then check the structural property — rather than to use a different regex engine.

For business planning, pattern matching is one of the very few "you should never build your own" categories.  The libraries are mature, fast, well-maintained, and free.  Tickets that involve searching text should be sized in hours, not days.

When the requirement looks bigger than that, the work is somewhere else — in defining what to search for, in scaling to many documents, in serving results — not in the pattern matcher itself.`
  },
  {
    title: 'How different are these two strings',
    steps: [
      {
        prose: `\`strsim\` exposes every common edit-distance variant as a one-liner.  Levenshtein for spell check, Damerau-Levenshtein for typos that include swaps, Jaro-Winkler for name matching where the first few characters matter most.`,
        code: `use strsim::{damerau_levenshtein, jaro_winkler, levenshtein};

fn best_match<'a>(query: &str, candidates: &'a [&'a str]) -> Option<&'a str> {
    candidates
        .iter()
        .min_by_key(|c| levenshtein(query, c))
        .copied()
}

fn name_score(a: &str, b: &str) -> f64 {
    jaro_winkler(a, b) // 1.0 = identical, 0.0 = no shared prefix
}

fn typo_distance(a: &str, b: &str) -> usize {
    damerau_levenshtein(a, b) // counts adjacent swaps as one edit
}`,
        lang: 'rust'
      }
    ],
    tldr: 'Edit distance — how many character changes between two strings — is solved by a single dynamic programming pass.  Spell check, diff, DNA alignment all use it.',
    gesture: 'Spell check, diff tools, DNA matching, fuzzy search — all the same algorithm, all polynomial.',
    body: `The edit distance between two strings is the number of character insertions, deletions, or substitutions to transform one into the other.  It is the standard measure of string similarity and the foundation of spell checkers, diff tools, fuzzy search, plagiarism detection, and DNA sequence alignment.  The algorithm is a textbook dynamic programming routine that runs in time proportional to the product of the two string lengths.  Rust's strsim library implements Levenshtein distance, Damerau-Levenshtein (adds transposition), Jaro-Winkler (weights early matches more), and several other common variants as one-line calls.  For very long sequences (DNA), the work scales as a square of the length and becomes expensive — specialized libraries with diagonal-band optimization handle it.  For short strings (names, addresses, search queries), the work is microseconds and your team should reach for the library.`,
    citation: 'Wagner, R., Fischer, M. (1974) *The String-to-String Correction Problem.*  Levenshtein, V. (1965).',
    link: 'https://docs.rs/strsim/latest/strsim/',
    eli5: `Edit distance is the most useful string-similarity metric in business software.  Spell checkers use it to find the most likely correction for a typo.  Diff tools use it to find the minimal change set between two file versions.  Fuzzy search uses it to match queries to records when the user does not type the exact spelling.  Address normalization uses it to detect that "123 Main Street" and "123 Main St" are the same address.  Bioinformatics uses it (with custom scoring) to align DNA sequences.

The algorithm is one of the cleanest examples of dynamic programming.  You fill in a table where each cell represents the edit distance between prefixes of the two strings, building up from the empty prefix.  The table fills in linear time per cell, so the total work is the product of the two string lengths.  For two strings of a hundred characters each, this is ten thousand operations — microseconds.  For two strings of a million characters each, it is a trillion operations and becomes a research problem.

For short strings — names, addresses, query terms, ticket titles — the work is so cheap that you should compute distances on demand.  Rust's strsim library handles the standard variants in a one-line call.  Levenshtein for basic edit distance.  Damerau-Levenshtein for typos that involve swapping adjacent characters (a common kind of error).  Jaro-Winkler for cases where matching the beginning of a string matters more (good for name matching).

The variants matter because the right metric depends on the kind of error you are catching.  Jaro-Winkler is the standard in record linkage and customer-database deduplication.  Levenshtein is the right choice for spell checking.  Damerau-Levenshtein for keyboard typos.  Hamming distance (no insertions or deletions) for fixed-length codes.

The teaching for planning: any feature that involves "how similar are these two strings" is a library call away.  When the requirement is more elaborate — matching across millions of records, with fuzzy joins and blocking — the work is in the data plumbing, not the similarity computation.

The similarity computation is solved.  Reach for it and move on.`
  },
  {
    title: 'Optimization with continuous numbers',
    steps: [
      {
        prose: `\`good_lp\` lets your team model the LP in code — variables with bounds, linear constraints with operator overloading, an objective — and dispatch to a backend solver.  HiGHS is the recommended open-source backend; the model below is a diet problem in three lines of math.`,
        code: `use good_lp::{constraint, default_solver, variables, SolverModel, Solution};

fn cheapest_diet() -> (f64, f64, f64) {
    variables! { vars: 0 <= bread; 0 <= rice; 0 <= eggs; }
    let model = vars
        .minimise(2.0 * bread + 1.5 * rice + 3.0 * eggs) // dollars
        .using(default_solver)
        .with(constraint!(80.0 * bread + 130.0 * rice + 70.0 * eggs >= 2000.0))
        .with(constraint!( 3.0 * bread +   2.0 * rice + 13.0 * eggs >= 50.0));
    let sol = model.solve().expect("feasible");
    (sol.value(bread), sol.value(rice), sol.value(eggs))
}`,
        lang: 'rust'
      }
    ],
    tldr: 'When the variables can be any real number — money, quantity, percentage — and the constraints are linear, the problem is solved at industrial scale.',
    gesture: 'Real-valued optimization with linear constraints is in the cheap category — even at millions of variables.  Buy or open-source the solver.',
    body: `Linear programming covers an enormous fraction of business optimization.  Variables are continuous (money, hours, units of inventory).  Constraints and objective are linear (budget caps, capacity limits, sum-to-one).  Modern solvers — HiGHS (open source), Gurobi, CPLEX — handle millions of variables in seconds.  Diet planning, blending problems, transportation problems, scheduling relaxations, network flow at scale, portfolio allocation, blending ad targeting — all linear programs.  Rust's good_lp library lets your team model the problem in code (define variables, add constraints, set objective) and dispatch to a backend solver.  HiGHS is the recommended open-source backend.  When some variables must be integer (page 32), the problem moves to the expensive category.  When the variables are continuous, the work is industrial and your team should not be writing their own solver.`,
    citation: 'Dantzig, G. (1947) simplex.  Khachiyan, L. (1979) ellipsoid (proved LP is polynomial).  Karmarkar, N. (1984) interior-point.',
    link: 'https://docs.rs/good_lp/latest/good_lp/',
    eli5: `Linear programming is the workhorse of operations research.  An enormous fraction of business optimization problems can be modeled as: pick values for a set of real-valued variables, subject to linear inequality constraints, to maximize or minimize a linear objective.  Diet planning.  Production blending.  Transportation costs.  Portfolio allocation.  Network flow.  Advertising auctions.  Workforce scheduling relaxations.

The modeling discipline is to write the problem in three pieces: variables (what can vary), constraints (what limits the variables), and objective (what to maximize or minimize).  Once it is in that form, the solver does the rest.  Modern solvers like HiGHS handle problems with millions of variables and constraints in seconds.

The history is instructive.  George Dantzig invented the simplex method in 1947 for the US Air Force, who needed to plan logistics.  Simplex is exponential in the worst case but almost always fast in practice.  In 1979, Khachiyan proved that linear programming is genuinely in the cheap category — there is a polynomial-time algorithm.  In 1984, Karmarkar found a practical polynomial-time alternative (interior-point), which kicked off a revolution.  Modern solvers combine simplex and interior-point methods.

In Rust, the good_lp library is the standard.  Your team declares variables, adds constraints with operator overloading, sets the objective, and calls solve.  The library dispatches to a backend.  HiGHS is the recommended open-source backend; commercial backends (Gurobi, CPLEX) handle larger problems faster but cost real money.

The boundary to remember: linear programming with continuous variables is in the cheap category.  Linear programming with integer variables (page 32) is NP-complete and expensive.  The continuous-versus-integer distinction is one of the most consequential complexity boundaries in applied mathematics.

When your problem has linear constraints and continuous variables, you have a solved problem and should reach for a solver.  When it has integer variables, the work changes — see page 32.`
  },
  {
    title: 'Optimization with curves instead of lines',
    steps: [
      {
        prose: `Ridge regression is the easiest convex problem to recognize — a quadratic loss plus an L2 penalty.  The closed-form solution is one linear-system solve; \`nalgebra\` handles it.  For larger problems the same setup goes to \`argmin\` or \`clarabel\` without any change of shape.`,
        code: `use nalgebra::{DMatrix, DVector};

fn ridge(x: &DMatrix<f64>, y: &DVector<f64>, lambda: f64) -> DVector<f64> {
    let n = x.ncols();
    let xt = x.transpose();
    let a = &xt * x + DMatrix::identity(n, n) * lambda;
    let b = xt * y;
    a.lu().solve(&b).expect("ridge is always solvable for lambda > 0")
}`,
        lang: 'rust'
      }
    ],
    tldr: 'When the objective is curved (cost of risk grows faster than linearly) and the feasible set is well-behaved, the problem is still in the cheap category.',
    gesture: 'Convex optimization is the broadest class of optimization that stays in the cheap category.  Most machine learning training fits here.',
    body: `Convex optimization extends linear programming with curved objectives, as long as the curve goes the right way.  "Convex" means the objective looks like a bowl — every local minimum is the global minimum.  This structure makes the problem solvable in polynomial time, even when the objective is not linear.  Most regularized statistical models (ridge regression, lasso, support vector machines, logistic regression) are convex.  Portfolio optimization with risk penalties is convex.  Many control problems are convex.  Rust's clarabel library is a production-grade convex solver.  When the problem is convex, the engineering estimate is days.  When the problem is non-convex (most deep learning training), the toolkit changes to heuristics with no global guarantees.  Knowing whether your objective is convex changes the engineering plan.`,
    citation: 'Boyd, S., Vandenberghe, L. (2004) *Convex Optimization* — the textbook reference.',
    link: 'https://oxfordcontrol.github.io/ClarabelDocs/',
    eli5: `Convex optimization is the broadest class of optimization that is still in the cheap category.  Linear programming is the simplest convex case.  Quadratic, second-order-cone, and semidefinite programming are progressively more expressive but stay in the convex world.

The key property is that the objective is shaped like a bowl — there is one bottom, and any local minimum is the global minimum.  This property removes the search problem.  Standard iterative algorithms (interior-point methods, projected gradient, Newton's method) converge reliably to the answer.  No hyperparameter tuning, no restart strategies, no luck required.

Most regularized statistical models are convex.  Ridge regression, lasso, support vector machines, logistic regression — all convex optimization with a one-line solver call in any decent library.  Portfolio optimization with mean-variance trade-offs is convex.  Many control problems (LQR, MPC) are convex.

The boundary that matters: when the problem is convex, the engineering estimate is days to a week.  When the problem is non-convex — most deep learning training, most genuinely hard optimization — the toolkit shifts to heuristics (stochastic gradient descent, simulated annealing, evolutionary search) with no global guarantees and substantial engineering effort.

In Rust, the clarabel library is the production-grade convex solver.  It handles linear, quadratic, and conic problems, all in polynomial time.  For pure gradient-based optimization on more general (possibly non-convex) problems, the argmin crate provides a framework for gradient descent, L-BFGS, Newton, and several derivative-free methods.

The questions to ask when sizing an optimization feature: is the objective convex?  Are the constraints linear or convex?  If both, the work is cheap and a solver does the job.  If not, you are in heuristic territory and the estimate triples.

Convexity is the structural property that buys you tractability.  Confirm it before sizing the work.`
  },
  {
    title: 'Is this number prime',
    steps: [
      {
        prose: `\`num-prime\` gives you Miller-Rabin (probabilistic, fast) and Baillie-PSW (no known counterexamples) as one call.  The same crate exposes \`factorize\` for the hard direction — and the contrast in runtime between the two is exactly the gap that secures the internet.`,
        code: `use num_bigint::BigUint;
use num_prime::nt_funcs::{is_prime, factorize};

fn prime_check(n: &BigUint) -> bool {
    is_prime(n, None).probably() // microseconds, even at 4096 bits
}

fn try_factor(n: &BigUint) -> std::collections::BTreeMap<BigUint, usize> {
    factorize(n.clone()) // fast for small n, infeasible for cryptographic n
}`,
        lang: 'rust'
      }
    ],
    tldr: 'Testing whether a number is prime is solved.  Factoring large numbers is not — that asymmetry is the basis of every public-key cryptosystem.',
    gesture: 'Primality testing is cheap.  Factoring is expensive.  Most of internet security rides on the gap between them.',
    body: `Testing whether a number is prime is in the cheap category.  Both probabilistic methods (Miller-Rabin, extremely fast, vanishingly small error rate) and deterministic methods (the AKS algorithm, proved to be polynomial in 2002) exist.  Rust's num-prime library exposes both as one-line calls and handles arbitrary-precision integers.  Factoring a composite number into its prime factors is, in contrast, conjectured to be genuinely hard for large numbers.  This asymmetry — primality is easy, factoring is hard — is the basis of RSA encryption, which secures most of the internet.  The day a polynomial-time factoring algorithm is found is the day RSA dies and the entire payment and identity infrastructure needs to be replaced.  Quantum computers (Shor's algorithm) could in principle factor in polynomial time, but no quantum computer large enough exists yet.`,
    citation: 'Agrawal, Kayal, Saxena (2002) *PRIMES is in P.*  Miller, G. (1976), Rabin, M. (1980) for the standard probabilistic test.',
    link: 'https://annals.math.princeton.edu/2004/160-2/p12',
    eli5: `The primality-versus-factoring asymmetry is one of the most consequential gaps in computing.  Testing whether a single number is prime — even a thousand-digit number — is fast.  Breaking a composite number into its prime factors is conjectured to be exponentially hard, and the entire public-key cryptography infrastructure of the internet rests on that conjecture.

For primality testing, the practical algorithm is Miller-Rabin.  It picks a random "witness" and runs a quick check; if the witness fails the check, the number is composite; if it passes, the number is probably prime, with a failure rate of one in four per witness.  Running sixty witnesses gives a false-prime rate below cosmic-ray bit-flip rates.  Modern variants like Baillie-PSW have no known counterexamples up to 64-bit integers and are conjectured to be deterministic.

In 2002, three researchers in India proved that primality testing is genuinely in the cheap category — there exists a deterministic polynomial-time algorithm (AKS).  AKS is slower than Miller-Rabin in practice and rarely used, but the theoretical result closed a decades-old open question.

For factoring, the situation is different.  No polynomial-time algorithm is known for factoring large composite numbers.  The best known classical algorithms are sub-exponential but still impractical for thousand-digit numbers.  This is the basis of RSA encryption: pick two large prime numbers, multiply them together, publish the product — anyone can verify the product is composite, no one can recover the factors.

The day this gap closes is the day the internet's payment and identity systems need to be rebuilt.  Two threats: classical algorithmic progress (none in fifty years) and quantum computers running Shor's algorithm (no machine large enough exists yet, but the threat is real enough that post-quantum cryptography is an active research area).

For Rust, the num-prime library handles both primality testing and factoring.  Primality is fast.  Factoring is slow for the same reason that protects every encrypted transaction on the internet.

Cheap to check.  Expensive to break.  That gap is the foundation.`
  },
  {
    title: 'When the answer is a matrix',
    steps: [
      {
        prose: `PageRank in twenty lines of \`nalgebra\` — build the column-stochastic transition matrix, run power iteration, return the dominant eigenvector.  The same shape solves spectral clustering, recommendation scoring, and influence ranking.`,
        code: `use nalgebra::{DMatrix, DVector};

fn pagerank(links: &DMatrix<f64>, damping: f64, iterations: usize) -> DVector<f64> {
    let n = links.ncols();
    let teleport = DVector::from_element(n, (1.0 - damping) / n as f64);
    let mut r = DVector::from_element(n, 1.0 / n as f64);
    for _ in 0..iterations {
        r = links * (&r * damping) + &teleport;
    }
    r
}`,
        lang: 'rust'
      }
    ],
    tldr: 'PageRank, recommendation systems, search ranking, image compression — all secretly matrix problems.  All solvable with off-the-shelf libraries.',
    gesture: 'When the problem has a matrix at its heart, the answer is in the linear algebra library — and the work is cheap.',
    body: `Many business problems that look combinatorial collapse into a matrix computation once the structure is spotted.  Google's PageRank ranks web pages as the principal eigenvector of a link-graph matrix.  Recommendation systems use matrix factorization to predict missing entries in a user-item matrix.  Search ranking, image compression (JPEG, SVD), principal component analysis, spectral clustering, network centrality — all matrix operations.  Linear algebra is in the cheap category.  Matrix multiplication, eigenvalue computation, matrix factorization all run in polynomial time, and Rust has multiple production-grade libraries — nalgebra for general use, faer for high-performance dense problems, ndarray for NumPy-like array operations.  When a problem can be expressed in matrix form, the engineering work is in the data preparation, not the computation.`,
    citation: 'Page, L., Brin, S. (1998) *The PageRank Citation Ranking.*  One of the most cited papers in computing.',
    link: 'https://docs.rs/faer/latest/faer/',
    eli5: `Linear algebra is the secret hammer for an enormous class of business problems that do not look like math problems at first glance.

PageRank is the classic example.  Google's original ranking algorithm models the web as a giant graph where each page is a node and each link is an edge.  The "importance" of each page is defined as the principal eigenvector of a transition matrix derived from the link structure.  Computing eigenvectors of huge matrices is a well-studied problem in linear algebra with fast iterative algorithms (power iteration).  The famous PageRank paper from 1998 essentially says: pose the web ranking problem as a matrix problem, then use the linear algebra textbook.

Recommendation systems use the same trick.  The user-item matrix records every interaction.  Predicting missing entries — what would this user rate this movie — is matrix completion, solvable by low-rank factorization (SVD, alternating least squares, neural collaborative filtering).  All matrix operations.

Spectral clustering uses the eigenvectors of the graph Laplacian to find groups in a network with few edges between them.  Search ranking uses singular value decomposition to project queries and documents into a shared low-dimensional space.  Image compression — JPEG — uses the discrete cosine transform, another matrix operation.

For business planning, the discipline is to ask: can I express this problem as a matrix?  If yes, the work is cheap — Rust has three production-grade linear algebra libraries (nalgebra for general use, faer for high performance on dense problems, ndarray for NumPy-like operations on multi-dimensional arrays).  The estimate is days.  If no, the work might still be tractable but the toolbox shrinks.

The reason this matters is that recognizing the matrix is often the hardest part.  Once you see that a problem is "find the eigenvector," "factor the matrix," "solve the linear system," "compute the SVD," you have moved the work from research to engineering.  The libraries are decades old, fast, and well-maintained.

Reach for the matrix.  The library does the rest.`
  },

  // ────────── Part III — Problems that are genuinely hard ──────────
  {
    title: 'Boolean satisfiability — the original hard problem',
    steps: [
      {
        prose: `\`splr\` accepts CNF as a \`Vec<Vec<i32>>\` — positive integers are variables, negatives are negations.  The solver returns a satisfying assignment or \`UNSAT\`.  Encode your configuration validator this way and let three decades of CDCL engineering do the search.`,
        code: `use splr::*;

fn satisfy(clauses: Vec<Vec<i32>>) -> Option<Vec<i32>> {
    let mut solver = Solver::try_from((SolverConfig::default(), clauses.as_ref()))
        .expect("valid CNF");
    match solver.solve() {
        Ok(Certificate::SAT(assignment)) => Some(assignment),
        Ok(Certificate::UNSAT) => None,
        Err(_) => None,
    }
}`,
        lang: 'rust'
      }
    ],
    tldr: 'SAT is the canonical hard problem.  But modern industrial solvers crack million-variable instances in seconds.  Use one; do not write one.',
    gesture: 'SAT is famously hard.  Industrial solvers are famously good.  The right move is to encode and dispatch.',
    body: `Boolean satisfiability — does this logical formula have a true assignment — was the first problem proven NP-complete (Cook, 1971).  Every other NP-complete problem reduces to it.  By every theoretical measure, SAT is hard.  And yet modern industrial SAT solvers routinely handle instances with millions of variables in seconds.  The trick is conflict-driven clause learning (CDCL), a search strategy that learns from each dead-end and prunes the future search aggressively.  Modern SAT solvers are the product of three decades of competitive benchmarking and engineering refinement.  For business problems that can be encoded as logical constraints — scheduling, configuration, verification, planning — the right path is to encode in standard format (DIMACS) and call a solver.  Rust has splr (pure Rust) and varisat.  For maximum performance, the C++ solver CaDiCaL via FFI is hard to beat.`,
    citation: 'Cook, S. (1971) proved SAT is NP-complete.  Marques-Silva (1996) introduced CDCL.',
    link: 'https://docs.rs/splr/latest/splr/',
    eli5: `SAT is the canonical hard problem.  Cook proved it NP-complete in 1971; every other NP-complete problem reduces to it.  By every theoretical measure it is genuinely hard.  And yet, decades of engineering have produced industrial SAT solvers that crack instances with millions of variables in seconds.  This contradiction — theoretically hard, practically tractable on real inputs — is one of the most important lessons in applied complexity.

The reason modern SAT solvers work is that real-world SAT instances almost always have hidden structure that adversarial worst-case instances do not.  Configuration constraints have local clustering.  Scheduling problems have weak coupling between distant variables.  Verification queries have natural decompositions.  The conflict-driven clause learning (CDCL) architecture of modern solvers exploits this structure by learning from every dead-end and pruning the search aggressively.

The first business implication: when a problem can be encoded as Boolean logic — configuration validation, planning under constraints, verification, model checking — the right move is to encode it as CNF (the standard SAT format) and hand it to a solver.  Do not write your own search.  Modern SAT solvers are the product of three decades of competitive benchmarking and tens of thousands of engineering hours.  You will not beat them in a quarter.

The second implication: even though SAT is "hard" in the worst case, the practical cost of using a SAT solver on real problems is often less than the cost of writing custom search code.  Reach for the solver, see if it works, only commit to a bespoke approach if it does not.

In Rust, splr is the pure-Rust CDCL solver.  Varisat is another option.  For maximum performance, the C++ solver CaDiCaL is the current state of the art and is callable from Rust via FFI.  All of them accept DIMACS-format input and return either a satisfying assignment or UNSAT.

The teaching: "NP-complete in theory" and "tractable in practice with the right solver" are both true for SAT.  Plan around both.`
  },
  {
    title: 'Why three variables per rule changes everything',
    steps: [
      {
        prose: `Three-piece clauses look one character longer in the encoding and live in a different complexity class.  Same crate, same call — the worst-case runtime is the only thing that changed.  In practice splr still cracks most real instances in seconds.`,
        code: `use splr::*;

// 3-SAT clauses — three literals each.  NP-complete in the worst case.
fn three_sat(clauses: Vec<[i32; 3]>) -> Option<Vec<i32>> {
    let cnf: Vec<Vec<i32>> = clauses.into_iter().map(|c| c.to_vec()).collect();
    let mut s = Solver::try_from((SolverConfig::default(), cnf.as_ref())).ok()?;
    match s.solve().ok()? {
        Certificate::SAT(a) => Some(a),
        Certificate::UNSAT => None,
    }
}`,
        lang: 'rust'
      }
    ],
    tldr: 'Two-variable constraints are cheap.  Three-variable constraints are NP-complete.  The same SAT solver handles both — but the cost picture changes.',
    gesture: 'The boundary between cheap and hard constraint problems is at three variables per rule.  Knowing this saves the wrong estimate.',
    body: `When every rule in a logical constraint system involves exactly two variables, the system can be checked for satisfiability in linear time using a graph-based technique (page 15).  When some rule involves three or more variables, the problem becomes 3-SAT and is NP-complete — the same complexity class as every other hard problem.  The transition from two to three is the sharpest complexity boundary in computer science.  In practice, modern SAT solvers handle both flavors with the same machinery and often the same speed on real inputs — but the worst-case picture is dramatically different.  For planning purposes, the question to ask is whether the constraints genuinely require three or more variables per rule.  If they do, accept that the problem is in the expensive category and budget for a solver.  If they do not, model it as 2-SAT and stay in the cheap category.`,
    citation: 'Karp, R. (1972) proved 3-SAT NP-complete by reduction from SAT.',
    link: 'https://en.wikipedia.org/wiki/Boolean_satisfiability_problem#3-satisfiability',
    eli5: `The two-versus-three boundary in logical constraints is the most studied and most useful complexity boundary in computer science.  When every constraint involves exactly two variables, the problem is in the cheap category and solvable in linear time by a graph-based method.  When constraints involve three or more variables, the problem is NP-complete.

The transition is genuinely a cliff, not a slope.  No clever encoding makes a three-variable constraint problem secretly two-variable.  The boundary has been studied for fifty years and never been crossed.

In practice, this matters most at the planning stage.  When a product manager describes a constraint system in plain language, the key question is whether each rule could be stated as "if X then Y" — exactly two pieces — or whether each rule fundamentally requires three or more variables to express.

If two variables per rule are enough, the problem is 2-SAT and your team should ship the feature in a week using a graph library (page 15).

If three or more are required, the problem is at least 3-SAT and lives in the expensive category.  The right move is to encode it as CNF and dispatch to an industrial SAT solver (page 23).  The solver might handle it in seconds on real instances despite the worst-case theoretical hardness, but the engineering effort is the encoding, not the search.

The same SAT solvers handle both 2-SAT and 3-SAT through the same machinery — they do not specialize based on clause width.  This means the modeling decision is entirely about how you express the constraints, not which tool you call.

In planning meetings, watch for constraints that try to relate three things at once: "the project lead must be in the same office as the project location and must speak the local language."  That is a three-variable constraint and pushes the problem into the expensive category.  If the requirement can be split into two two-variable constraints — "lead and location must be in the same office" and "lead must speak the local language" — you stay cheap.

Three variables is the cliff.  Watch for it in requirements.`
  },
  {
    title: 'Traveling Salesman — the poster problem',
    steps: [
      {
        prose: `Held-Karp dynamic programming for up to about twenty cities — bitmask the visited set, memoize on (last-city, set).  The work is \`n² · 2ⁿ\`, fast for n ≤ 20 and infeasible beyond.  Past that, switch to LKH via FFI or hand the problem to Vroom.`,
        code: `fn tsp_held_karp(dist: &[Vec<u32>]) -> u32 {
    let n = dist.len();
    assert!(n <= 20, "use LKH or a SaaS for n > 20");
    let mut dp = vec![vec![u32::MAX; n]; 1 << n];
    dp[1][0] = 0;
    for mask in 1u32..(1 << n) {
        for last in 0..n {
            if (mask >> last) & 1 == 0 || dp[mask as usize][last] == u32::MAX { continue; }
            for next in 0..n {
                if (mask >> next) & 1 == 1 { continue; }
                let m = (mask | (1 << next)) as usize;
                let cand = dp[mask as usize][last].saturating_add(dist[last][next]);
                if cand < dp[m][next] { dp[m][next] = cand; }
            }
        }
    }
    let full = (1 << n) - 1;
    (1..n).map(|i| dp[full][i].saturating_add(dist[i][0])).min().unwrap()
}`,
        lang: 'rust'
      }
    ],
    tldr: 'Visit every location once and return — the famous hard problem.  Exact answers for small N, approximations for medium, SaaS for production.',
    gesture: 'The most famous NP-complete problem in the world.  Real solvers are mature; build them yourself only if you have a reason.',
    body: `The Traveling Salesman Problem (TSP) asks for the shortest tour visiting every location once.  It is the most famous NP-complete problem and the workhorse of vehicle routing, circuit board drilling, DNA sequencing, and many other domains.  For small instances (up to about twenty locations), exact algorithms (Held-Karp 1962) find the optimal answer in seconds.  For metric TSP (distances satisfy the triangle inequality), Christofides' 1976 algorithm produces a solution within 50% of optimal in polynomial time.  In practice, the heuristic Lin-Kernighan and its descendants (the LKH solver) get within a fraction of a percent of optimal on instances with thousands of cities.  The state-of-the-art commercial solver Concorde has cracked exact-optimal tours on instances with tens of thousands of cities.  For business use, the right move is almost always to call an existing solver or use a SaaS (Vroom, OptaPlanner) rather than build from scratch.`,
    citation: 'Held, M., Karp, R. (1962) for exact DP.  Christofides, N. (1976) for the 3/2 approximation.',
    link: 'https://en.wikipedia.org/wiki/Travelling_salesman_problem',
    eli5: `The Traveling Salesman Problem is so famous that it has its own jokes, t-shirts, and a Wikipedia article that opens with a Pulitzer Prize-winning novel about a TSP-obsessed character.  It is the most studied NP-complete problem in history.  The reason for the attention is that it has a clean statement, real industrial applications (vehicle routing, circuit board drilling, DNA sequencing, microscopy), and a remarkable diversity of attack methods.

For your business, the relevant fact is that TSP is well-tooled.  Decades of research have produced solvers that handle realistic problem sizes far beyond what naive analysis would suggest.

For small instances — up to about twenty stops — the Held-Karp dynamic programming algorithm from 1962 finds the optimal answer in seconds on a laptop.  Beyond twenty, the work doubles with each added stop and becomes infeasible past about thirty.

For medium and large instances, exact methods using integer programming with cutting planes (Concorde is the state-of-the-art) routinely solve problems with thousands of cities to optimality.  These solvers are available, though Concorde itself requires academic licensing for non-research use.

For real-time use cases — vehicle routing at delivery scale — the right move is almost always heuristic.  Lin-Kernighan and its descendants produce tours within a fraction of a percent of optimal on instances with tens of thousands of cities.  The LKH solver is the production heuristic.  For multi-vehicle problems with capacity and time-window constraints, open-source SaaS solvers like Vroom and OR-Tools handle realistic operational problems.

For business planning: TSP is in the expensive category but the tooling is mature.  Engineering effort goes into modeling the problem (what counts as a stop, what counts as a constraint, what counts as a cost) and choosing the right solver, not into writing search algorithms.  When a routing problem appears on the roadmap, the procurement question dominates the engineering question.

The problem is hard.  The tools are good.  Use the tools.`
  },
  {
    title: 'Knapsack — which items fit in the budget',
    steps: [
      {
        prose: `The classic DP runs in \`O(items · budget)\` — fast whenever the budget is a small integer.  For an engineering portfolio of a hundred features and a budget in story points, this is microseconds.  Reach for \`good_lp\` when the budget is huge.`,
        code: `fn knapsack(weights: &[u32], values: &[u32], capacity: u32) -> u32 {
    let n = weights.len();
    let cap = capacity as usize;
    let mut dp = vec![0u32; cap + 1];
    for i in 0..n {
        let w = weights[i] as usize;
        let v = values[i];
        if w > cap { continue; }
        for c in (w..=cap).rev() {
            dp[c] = dp[c].max(dp[c - w] + v);
        }
    }
    dp[cap]
}`,
        lang: 'rust'
      }
    ],
    tldr: 'Picking the best subset of items within a budget is technically NP-complete but practically tractable — solvable by dynamic programming when budgets are reasonable.',
    gesture: 'Knapsack is NP-complete but practically cheap when the numbers are small.  One of the friendliest hard problems.',
    body: `The 0/1 knapsack problem: given items each with weight and value and a budget, pick the subset that maximizes value without exceeding budget.  Engineering portfolio selection, ad slot allocation, feature shipping under engineering budget, asset selection for a fund — all knapsack.  Classified as NP-complete (Karp 1972), but with a critical practical caveat: the dynamic programming solution runs in time proportional to the number of items times the budget value.  When the budget is small (hundreds or thousands), this is microseconds.  When the budget is cryptographically large, the same algorithm is infeasible.  This is called "weakly NP-complete" — hard in the worst case but tractable for typical business inputs.  Knapsack also has a fully polynomial-time approximation scheme: a tunable knob trading speed for closeness to optimal.  In Rust, hand-roll the DP for exact answers or use good_lp for the integer programming formulation.`,
    citation: 'Karp, R. (1972).  Bellman, R. (1957) for the DP.',
    link: 'https://en.wikipedia.org/wiki/Knapsack_problem',
    eli5: `Knapsack is one of the friendliest NP-complete problems.  Technically it is in the expensive category, but in practice it is almost always tractable for business use.

The problem: you have items, each with a weight (cost, time, capacity used) and a value.  You have a budget (total cost, total time, total capacity).  Pick the subset of items that maximizes total value without exceeding the budget.  This shape shows up everywhere in business — engineering portfolio selection (which features to ship under a fixed engineering budget), advertising slot allocation, fund construction, server packing, freight loading.

The dynamic programming solution from 1957 fills a table where each cell represents "the maximum value achievable using only the first i items, with budget at most j."  The work is proportional to the product of items and budget.  For a typical business problem with a hundred items and a budget in the thousands, this is microseconds.  The optimal answer comes back in negligible time.

The catch is that "budget" here means the numeric value, not the bit-length of the value.  If the budget is one billion (typical for financial portfolios in dollars), the work is a hundred items times one billion — too slow.  This is the technical sense in which knapsack is NP-complete: when the budget is cryptographically large, the DP becomes infeasible.

For most business uses, the budget is small enough that the DP works.  When it does not, the fallback is to model the problem as an integer linear program and call HiGHS via Rust's good_lp library.  This handles much larger problems in seconds.

Knapsack also has one of the best approximation algorithms in the field — a "fully polynomial-time approximation scheme" (FPTAS).  You set a quality knob (95% of optimal? 99%?) and the algorithm produces a solution at that quality in time polynomial in both items and the inverse of the quality gap.  This is the gold standard of approximability.

For planning: knapsack is "expensive in theory but cheap in practice" for typical business inputs.  Engineering estimate is a few days for an in-house implementation or a few hours to wire up good_lp.

When the budget is huge, the problem really is expensive.  When the budget is reasonable, the problem is solved.  Read the numbers before sizing the work.`
  },
  {
    title: 'Picking the right subset under constraints',
    steps: [
      {
        prose: `Model minimum vertex cover as an ILP — a binary variable per node, a constraint per edge requiring at least one endpoint covered, an objective summing the variables.  Dispatch to HiGHS via \`good_lp\`.  Exact answers on graphs with thousands of nodes in seconds.`,
        code: `use good_lp::{constraint, default_solver, ProblemVariables, SolverModel, Solution, variable};

fn min_vertex_cover(n: usize, edges: &[(usize, usize)]) -> Vec<usize> {
    let mut vars = ProblemVariables::new();
    let x: Vec<_> = (0..n).map(|_| vars.add(variable().binary())).collect();
    let mut model = vars
        .minimise(x.iter().sum::<good_lp::Expression>())
        .using(default_solver);
    for &(u, v) in edges {
        model = model.with(constraint!(x[u] + x[v] >= 1));
    }
    let sol = model.solve().expect("ILP solved");
    (0..n).filter(|&i| sol.value(x[i]) > 0.5).collect()
}`,
        lang: 'rust'
      }
    ],
    tldr: 'Choosing a minimum (or maximum) subset that meets some structural requirement is the cluster of vertex cover, independent set, and clique — all NP-complete and all secretly the same problem.',
    gesture: 'Three of the most-cited NP-complete problems are actually the same coin viewed from three angles.',
    body: `Three classic NP-complete problems show up in business in slightly different forms.  Vertex cover: pick the minimum-size set of items that "touches" every relation.  Independent set: pick the maximum-size set with no relations among them.  Clique: pick the maximum-size set where every pair is related.  All three are equivalent — solving one solves the others.  Use cases include minimum-staff coverage (vertex cover), fraud-ring detection (clique), conflict-free scheduling (independent set), security policy auditing (vertex cover).  All NP-complete.  Vertex cover has a fast 2-approximation (greedy edge picking) and is one of the friendliest hard problems when the optimal cover is small (a parameterized algorithm runs in time exponential only in the cover size).  Independent set and clique are much harder to approximate.  In Rust, model as integer programming via good_lp for exact answers on moderate instances.`,
    citation: 'Karp, R. (1972) put all three on the original NP-complete list.',
    link: 'https://en.wikipedia.org/wiki/Vertex_cover',
    eli5: `Vertex cover, independent set, and clique are three NP-complete problems that look different but are the same problem in disguise.  Each one is a way of picking the right subset of items from a network of relationships.

Vertex cover: pick the smallest set of items such that every relationship has at least one of its endpoints in the set.  Business use: minimum-staff coverage (cover every shift with the fewest people), security policy auditing (cover every required permission with the fewest roles), influencer marketing (reach every community with the fewest seeders).

Independent set: pick the largest set of items with no relationships among them.  Business use: conflict-free scheduling (the maximum set of jobs that can run simultaneously without competing for the same resource), team formation (the largest group of people with no interpersonal conflicts).

Clique: pick the largest set of items all mutually related.  Business use: fraud-ring detection (the largest group of accounts all transacting with each other), tightly-knit community discovery, sales territory consolidation.

All three are equivalent — a fast algorithm for any one solves all three.  Vertex cover and independent set are complements (a set is independent if and only if everything else is a vertex cover).  Clique becomes independent set when you flip the graph (replace every edge with non-edge and vice versa).  None of them has a known fast algorithm.

The approximability picture is different across the three.  Vertex cover has a simple algorithm that gets within a factor of two of optimal — pick any uncovered edge, add both endpoints to the cover, repeat.  Twenty lines of code, two-times-optimal guarantee.  Independent set and clique are much worse — no constant-factor approximation exists unless P = NP.

Vertex cover is also one of the most parameterized-friendly NP-complete problems.  When the optimal cover is small (parameter k), the work grows exponentially only in k, not in the input size.  For a graph with millions of nodes and a cover of size twenty, exact solutions are fast.

In Rust, model as integer programming via good_lp and dispatch to HiGHS for exact solutions on moderate instances.  For larger or worst-case instances, accept approximation or use a SaaS.

When you see a "pick the best subset" problem, it is probably one of these three.  Treat the estimate accordingly.`
  },
  {
    title: 'Coloring — the two-versus-three cliff',
    steps: [
      {
        prose: `petgraph's \`is_bipartite_undirected\` answers the two-color question in linear time — a BFS that two-colors as it walks.  For three or more colors, encode "vertex v gets color c" as Boolean variables and hand the formula to splr.`,
        code: `use petgraph::algo::is_bipartite_undirected;
use petgraph::graph::UnGraph;

fn two_colorable(g: &UnGraph<&str, ()>) -> bool {
    if let Some(start) = g.node_indices().next() {
        is_bipartite_undirected(g, start)
    } else { true }
}

// Three or more colors: build CNF and dispatch to splr (page 23).
// At least one color per vertex, at most one color per vertex,
// adjacent vertices differ.  Linear in the encoding, exponential
// in the search — but solvers handle real instances at scale.`,
        lang: 'rust'
      }
    ],
    tldr: 'Coloring with two categories (bipartite check) is fast.  Three or more categories is NP-complete.  Sometimes the right move is to redesign to need only two.',
    gesture: 'Two-coloring is cheap.  Three-coloring is famously expensive.  The boundary appears in scheduling, register allocation, and frequency assignment.',
    body: `Graph coloring asks: can every item be assigned one of k categories such that related items get different categories?  Two categories is bipartite testing and is in the cheap category.  Three or more is NP-complete.  Business uses: register allocation in compilers, frequency assignment in wireless networks, exam scheduling (no student takes two exams at the same time), conflict-free room assignment, manufacturing line scheduling.  When the constraint graph is sparse enough to be two-colorable, the work is linear.  When it is not, you are in the expensive category.  The right responses to a three-or-more coloring problem are: model as a SAT problem and use an industrial solver; model as integer programming via good_lp; use the DSATUR heuristic which works well in practice on many real graphs; or redesign the requirement to need fewer categories.`,
    citation: 'Karp, R. (1972) proved 3-coloring NP-complete.  Stockmeyer, L. (1973) extended to planar graphs.',
    link: 'https://en.wikipedia.org/wiki/Graph_coloring',
    eli5: `Coloring problems show up in scheduling, allocation, and configuration — anywhere you need to assign things to categories such that conflicting things get different categories.  Examination scheduling: students cannot take two exams at the same time.  Wireless frequency assignment: nearby towers cannot use the same frequency.  Compiler register allocation: variables alive at the same time need different registers.  Operating-room scheduling: conflicting surgeries need different rooms.

The cliff in difficulty is between two categories and three.  With two categories, the problem is bipartite testing — does the conflict graph have any odd cycles?  This is linear time.  Your team ships the feature in days.

With three or more categories, the problem becomes NP-complete.  No polynomial-time algorithm is known.  In practice, three responses work:

First, use a SAT solver.  Encode "vertex v gets color c" as a Boolean variable, add clauses enforcing exactly-one-color-per-vertex and different-colors-on-edge, dispatch to splr.  Modern SAT solvers handle graphs with thousands of vertices and dozens of colors.

Second, model as integer programming.  Binary variables for vertex-color pairs, constraints for exclusivity and conflict.  Call HiGHS via good_lp.  Comparable scale.

Third, accept a heuristic.  The DSATUR algorithm (degree-of-saturation) works well in practice: at each step, color the vertex that has the most distinct colors among its neighbors, choosing the smallest available color.  Not guaranteed optimal but often produces optimal or near-optimal colorings on real graphs.

The fourth response, often the right one, is to redesign the requirement.  Two categories cover a surprising number of conflict structures.  When you find yourself with a coloring problem that has three or more categories, ask whether the requirement can be relaxed.  Can the exams be scheduled in two slots (morning and afternoon)?  Can the frequency band be split into two bands per region?  If you can collapse to two categories, you collapse to linear time.

When you cannot, the problem is genuinely in the expensive category.  Use the solvers.  Plan accordingly.`
  },
  {
    title: 'The Hamilton trap',
    steps: [
      {
        prose: `Hierholzer's algorithm for an Euler circuit (every edge once) is fifteen lines and linear time.  Hamilton (every vertex once) is brute force on permutations of vertices — \`O(n!)\` and exponential beyond about twelve nodes.  Read the requirement carefully.`,
        code: `use itertools::Itertools;

fn hamilton_circuit_brute(n: usize, edges: &[(usize, usize)]) -> Option<Vec<usize>> {
    let mut adj = vec![vec![false; n]; n];
    for &(u, v) in edges { adj[u][v] = true; adj[v][u] = true; }
    (1..n).permutations(n - 1).find_map(|perm| {
        let mut tour = vec![0];
        tour.extend(perm);
        let ok = tour.windows(2).all(|w| adj[w[0]][w[1]])
            && adj[*tour.last().unwrap()][0];
        ok.then_some(tour)
    })
}`,
        lang: 'rust'
      }
    ],
    tldr: 'Visit every location once is hard.  Visit every connection once is cheap.  The two sound the same and are not.',
    gesture: 'The most famous "looks easy, is actually hard" problem in graph theory.  Read the requirement carefully.',
    body: `Two problems sound identical and are not.  Euler circuit: traverse every connection in a network exactly once and return to the start.  Solvable in linear time — connected network where every node has even degree.  Hamilton circuit: visit every node in a network exactly once and return to the start.  NP-complete.  The change from "every edge" to "every vertex" is one word and a complexity-class cliff.  Business uses of Hamilton circuit appear in DNA sequencing, snowplow routing (with twists), and various puzzle and game contexts.  Business uses of Euler circuit appear in postal delivery (visit every street), inspection routing, and any visit-every-link problem.  When sizing a routing feature, the first question is whether the requirement is visit-every-link or visit-every-stop.  The first is days.  The second is a quarter (or a SaaS).`,
    citation: 'Karp, R. (1972) for Hamiltonian.  Hierholzer, C. (1873) for Euler.',
    link: 'https://en.wikipedia.org/wiki/Hamiltonian_path_problem',
    eli5: `The Euler-versus-Hamilton confusion is one of the most expensive mistakes in graph-problem planning.  The two problems sound nearly identical and are in different complexity classes.

Euler circuit: walk through the network and traverse every edge (connection) exactly once, returning to where you started.  Euler proved in 1735 that this is possible exactly when the network is connected and every node has an even number of edges.  Hierholzer in 1873 gave a linear-time algorithm to construct the path.  This is the original Königsberg bridges problem, the founding example of graph theory.

Hamilton circuit: walk through the network and visit every node exactly once, returning to where you started.  This is NP-complete.  No polynomial-time algorithm is known.  Held-Karp dynamic programming solves it exactly for up to about twenty nodes.  Beyond that, you need SAT or integer programming.

The change from "every edge" to "every vertex" is the difference between a half-day feature and a quarter-long project.  In business requirements, the same change can hide in plain sight.

Visit every street in a neighborhood: every-edge problem.  Euler.  Cheap.

Visit every customer in a territory: every-vertex problem.  Hamilton (or, if you also want shortest, TSP).  Expensive.

The reason the difference exists is structural.  Edge-traversal can be checked locally — every node has even degree.  Vertex-traversal cannot — visiting every vertex requires global coordination, and no local property determines whether the global walk exists.

For business planning, the discipline is to read routing requirements carefully and identify whether the cost is in the edges or the vertices.  "Inspect every road segment" is edges.  "Visit every store" is vertices.  Same shape of requirement, two different complexity classes.

When in doubt, ask the requester: what counts as a unit of work — the road, or the stop?  Their answer determines your sprint plan.`
  },
  {
    title: 'Find a subset that sums right',
    steps: [
      {
        prose: `Same DP shape as knapsack — a Boolean reachability table indexed by sum.  For a financial-netting problem with trades up to a million dollars, this is microseconds.  When the target gets cryptographically large, switch to meet-in-the-middle or ILP.`,
        code: `fn subset_sums_to(items: &[u32], target: u32) -> bool {
    let t = target as usize;
    let mut reachable = vec![false; t + 1];
    reachable[0] = true;
    for &v in items {
        let v = v as usize;
        if v > t { continue; }
        for s in (v..=t).rev() {
            if reachable[s - v] { reachable[s] = true; }
        }
    }
    reachable[t]
}`,
        lang: 'rust'
      }
    ],
    tldr: 'Picking items that sum to exactly the target is NP-complete but practically tractable when numbers are reasonable.',
    gesture: 'The simplest NP-complete arithmetic problem.  Shows up in finance, scheduling, and resource allocation.',
    body: `Subset sum: given a set of numbers and a target, find a subset summing exactly to the target.  Partition: split a set into two equal-sum halves.  Both NP-complete.  Business uses include change-making with constraints, financial netting (find a subset of trades summing to a specific cash position), inventory balancing (split warehouse contents into equal-value shipments), workload partitioning across machines.  Like knapsack, these are weakly NP-complete — the standard dynamic programming algorithm runs in time proportional to items times target value, fast for typical business inputs.  For problems where the numbers are very large (cryptocurrency, exact dollar amounts), the meet-in-the-middle technique handles up to around sixty items.  In Rust, hand-roll the DP for small target values, or model as integer programming.`,
    citation: 'Karp, R. (1972).  Horowitz, E., Sahni, S. (1974) for meet-in-the-middle.',
    link: 'https://en.wikipedia.org/wiki/Subset_sum_problem',
    eli5: `Subset sum is the simplest NP-complete arithmetic problem and shows up in business more often than you would expect.  Given a set of numbers and a target, find a subset that sums exactly to the target.

Business uses: change-making with denomination constraints (find the smallest set of bills summing to a specific amount).  Financial netting (find a subset of trades summing to a target cash position).  Inventory balancing (split a warehouse into two equal-value shipments, or split a portfolio into two equal-risk halves).  Workload partitioning (assign jobs to identical machines to equalize total processing time).

Like knapsack, this problem is "weakly" NP-complete.  The standard dynamic programming algorithm runs in time proportional to the number of items times the target value.  For business problems where the target is in the thousands or low millions, this is fast — seconds on a laptop.  For cryptographically large targets, the same algorithm is infeasible.

When the number of items is moderate (around forty to sixty) but the target is huge, the right technique is meet-in-the-middle.  Split the items into two halves.  Enumerate all possible subset sums of each half (about a million subsets per half for thirty items each).  Sort one list and binary-search the other for complements.  This handles up to about sixty items even with arbitrary-precision arithmetic.

For larger or more complex variants — multiple targets, constraints on subset size, mixed coverage requirements — model as integer programming.  Binary variables for "include this item or not," sum constraint, dispatch to HiGHS via good_lp.  Modern MIP solvers handle thousands of items in reasonable time.

The teaching for business planning: subset sum is "expensive in theory but cheap in practice" for typical inputs.  The expensive case is when the target value is genuinely large in absolute terms — billions or more.  Read the numbers before sizing the work.

This is also the simplest reduction target.  Many other NP-complete problems can be turned into subset sum problems.  Spotting it under a different name is a leveraged engineering move.`
  },
  {
    title: 'Bin packing — fit the items into the fewest containers',
    steps: [
      {
        prose: `First-Fit-Decreasing — sort items by descending size, place each in the first bin that fits.  At most 11/9 of optimal, usually within a few percent on real workloads.  Twenty lines of Rust replaces a quarter of bespoke search code.`,
        code: `fn first_fit_decreasing(sizes: &[u32], capacity: u32) -> Vec<Vec<u32>> {
    let mut items = sizes.to_vec();
    items.sort_unstable_by(|a, b| b.cmp(a));
    let mut bins: Vec<Vec<u32>> = Vec::new();
    for size in items {
        let used: Vec<u32> = bins.iter().map(|b| b.iter().sum()).collect();
        match used.iter().position(|&u| u + size <= capacity) {
            Some(i) => bins[i].push(size),
            None => bins.push(vec![size]),
        }
    }
    bins
}`,
        lang: 'rust'
      }
    ],
    tldr: 'Packing items into the fewest fixed-capacity containers is NP-complete but has great approximations.  Most business uses are well-served by First-Fit-Decreasing.',
    gesture: 'Bin packing is the workhorse hard problem.  When it shows up, the approximation is usually good enough.',
    body: `Bin packing: given items with various sizes and bins with fixed capacity, pack everything into the fewest bins.  Business uses include packing virtual machines onto physical servers, packing files onto storage volumes, packing cargo into containers, packing ad creatives into broadcast time slots, packing software jobs onto compute clusters.  Strongly NP-complete.  But the approximation picture is excellent.  First-Fit-Decreasing (FFD) — sort items by decreasing size, place each in the first bin that fits — uses at most 11/9 of the optimal bin count.  On real workloads, the result is typically within a few percent of optimal.  For business problems where the approximation gap matters, model as integer programming and call HiGHS.  Most operational bin packing in production uses FFD as the workhorse and reserves exact solvers for offline planning.`,
    citation: 'Johnson, D. (1973).  Garey, M., Johnson, D. (1979).',
    link: 'https://en.wikipedia.org/wiki/Bin_packing_problem',
    eli5: `Bin packing is one of the most useful "hard" problems in business operations.  It shows up everywhere you have fixed-capacity containers to fill: virtual machines on physical servers, files on disks, cargo in shipping containers, ads in television breaks, compute jobs on cluster nodes, parts in shipping pallets.

The problem is strongly NP-complete — even when all the sizes are bounded by polynomially in the number of items, no polynomial-time exact algorithm is known.  But the approximation picture is unusually good.

The simplest heuristic that works is First-Fit: process items in arrival order, put each one in the first bin that has room, open a new bin only when none does.  First-Fit uses at most 70% more bins than optimal.

First-Fit-Decreasing is the same algorithm with items sorted in decreasing size first.  This is the workhorse approximation.  It uses at most 11/9 of the optimal bin count — about 22% worse than optimal in the worst case.  On typical operational workloads, the result is within a few percent of optimal, often within one bin.

For business problems where the few-percent gap matters — long-term capacity planning, billing where overprovisioning is expensive — model as integer programming.  Variables for "item i in bin j," a constraint that every bin's total size is under capacity, an objective to minimize the number of used bins.  Hand to HiGHS via good_lp.  Modern MIP solvers handle hundreds of items in seconds for exact answers.

The pattern that works in production: use FFD as the default for real-time decisions (server packing on incoming requests, real-time logistics).  Use exact integer programming for offline planning (quarterly capacity, route design).  The combination gives you good decisions fast and great decisions overnight.

For planning estimates: bin packing requests should be sized as days, not weeks, because the algorithm is well-understood and the libraries handle the work.  The engineering effort is in defining sizes correctly (what is the "capacity"?  what is the "size"?), not in the packing.

The category is "hard but well-tooled."  Use the tools.`
  },
  {
    title: 'When the variables must be whole numbers',
    steps: [
      {
        prose: `Facility location with discrete decisions — for each candidate site, build or do not — is ILP.  Same \`good_lp\` API as page 19, the only change is \`.binary()\` on the variables.  Modern solvers handle hundreds of thousands of binaries in seconds.`,
        code: `use good_lp::{constraint, default_solver, ProblemVariables, SolverModel, Solution, variable};

fn pick_warehouses(open_cost: &[f64], demand: &[Vec<f64>]) -> Vec<bool> {
    let n = open_cost.len();
    let m = demand.len();
    let mut vars = ProblemVariables::new();
    let open: Vec<_> = (0..n).map(|_| vars.add(variable().binary())).collect();
    let model = vars
        .minimise(open.iter().zip(open_cost).map(|(v, &c)| v * c).sum::<good_lp::Expression>())
        .using(default_solver);
    let mut model = model;
    for j in 0..m {
        let coverage: good_lp::Expression = (0..n).map(|i| demand[j][i] * open[i]).sum();
        model = model.with(constraint!(coverage >= 1.0));
    }
    let sol = model.solve().expect("ILP solved");
    (0..n).map(|i| sol.value(open[i]) > 0.5).collect()
}`,
        lang: 'rust'
      }
    ],
    tldr: 'Linear programming with integer variables is NP-complete.  But modern solvers handle hundreds of thousands of variables on practical instances.',
    gesture: 'Integer programming is NP-complete in theory and the most useful framework in operations research in practice.  Buy the solver.',
    body: `Integer linear programming (ILP) is linear programming with the requirement that some or all variables take integer values.  This single addition pushes the problem from polynomial to NP-complete.  It also makes it the most useful framework in operations research.  Vehicle routing, crew scheduling, capacity planning, network design, facility location, production planning — all most naturally expressed as integer programs.  Modern solvers (HiGHS, Gurobi, CPLEX) combine branch-and-bound, cutting-plane methods, primal heuristics, and presolve into engineering monuments that solve hundreds-of-thousands-of-variable problems in seconds.  Rust's good_lp library exposes ILP with the same modeling interface as LP — declare some variables as integer or binary, add constraints, set objective, solve.  HiGHS is the recommended open-source backend.  For competitive performance on the largest problems, Gurobi or CPLEX (commercial) are state of the art.`,
    citation: 'Karp, R. (1972).  Gomory, R. (1958) introduced cutting planes.  Land, A., Doig, A. (1960) introduced branch-and-bound.',
    link: 'https://docs.rs/good_lp/latest/good_lp/',
    eli5: `Integer linear programming is linear programming with one extra rule: some variables must be whole numbers (or, in the binary case, 0 or 1).  That single rule transforms the problem from polynomial-time (LP, page 19) to NP-complete.  It also transforms it into the most useful framework in operations research.

The reason ILP shows up so often is that real business decisions are discrete.  Either you build the warehouse or you do not.  Either this employee works the shift or they do not.  Either the truck makes the stop or it does not.  Continuous variables cannot model these decisions; integer variables can.

The reason ILP is NP-complete is that the feasible set is no longer a smooth shape but a discrete lattice inside one.  The fast algorithms that work for LP — walking vertices of the polyhedron, interior-point methods — do not apply.  In the worst case, you have to search an exponential tree of "this variable rounds up or down."

In practice, modern ILP solvers are engineering monuments.  They combine branch-and-bound (the exponential tree), cutting planes (added valid inequalities that tighten the relaxation without removing integer points), primal heuristics (find good feasible solutions quickly to bound the search), and presolve (eliminate redundant variables and constraints).  The result is that practical ILPs with hundreds of thousands of binary variables routinely solve in seconds.

In Rust, good_lp is the modeling library.  Declare variables (.binary(), .integer(), or continuous), add constraints with operator overloading, set the objective, call solve, pick a backend.  HiGHS is the recommended open-source backend.  For the largest problems, Gurobi and CPLEX (commercial) remain state of the art and are worth the license cost when the optimization is core to the business.

The teaching for planning: when your problem has discrete decisions and linear cost structure, model it as ILP and try the solver.  Modern MIP solvers handle a startling range of operational problems on commodity hardware.  The engineering effort is in modeling the problem correctly (right variables, right constraints, right objective), not in writing search code.

ILP is NP-complete.  ILP solvers are great.  Both facts are true.`
  },

  // ──────── Part IV — When "hard" hits your roadmap ────────
  {
    title: 'Approximation — provably close to optimal',
    steps: [
      {
        prose: `The classic 2-approximation for vertex cover: pick any uncovered edge, add both endpoints, repeat.  Twenty lines, formal guarantee of at most twice the optimal cover size.  Faster than the ILP from page 27 — use it when 2× is good enough.`,
        code: `use std::collections::HashSet;

fn vertex_cover_2approx(n: usize, edges: &[(usize, usize)]) -> HashSet<usize> {
    let mut covered = vec![false; edges.len()];
    let mut cover = HashSet::new();
    for (i, &(u, v)) in edges.iter().enumerate() {
        if covered[i] { continue; }
        cover.insert(u);
        cover.insert(v);
        let _ = n; // unused; kept for signature parity
        for (j, &(a, b)) in edges.iter().enumerate() {
            if cover.contains(&a) || cover.contains(&b) { covered[j] = true; }
        }
    }
    cover
}`,
        lang: 'rust'
      }
    ],
    tldr: 'When exact is too expensive, the right replacement is "provably within a known factor of optimal."  The bound is the contract.',
    gesture: 'An approximation algorithm trades exactness for speed — with a number attached to how much you sacrificed.',
    body: `When exact methods are too slow for a hard problem, an approximation algorithm is the next layer of the toolkit.  An approximation is a polynomial-time algorithm with a proven bound on how far its answer can be from optimal — for example, "always within a factor of two."  Classic results: 2-approximation for vertex cover (greedy edge picking), 3/2-approximation for metric TSP (Christofides 1976), about-1.22 for bin packing (First-Fit-Decreasing), 1+log(n) for set cover (greedy).  The bound is the contract: your team knows exactly how much they are sacrificing.  Some problems are not even approximable — independent set, clique, graph coloring all resist constant-factor approximations.  When sizing a hard-problem feature, the relevant question is not "can we solve this" but "what approximation ratio is acceptable to the business and what algorithm achieves it."`,
    citation: 'Vazirani, V. (2001) *Approximation Algorithms.*  Williamson, D., Shmoys, D. (2011) *The Design of Approximation Algorithms.*',
    link: 'https://www.designofapproxalgs.com/',
    eli5: `An approximation algorithm is the honest reply to NP-completeness.  Instead of finding the optimal answer to a hard problem (which takes forever), you find an answer that is provably close — within a known factor — in polynomial time.  The bound is the contract.

The textbook starter is the 2-approximation for vertex cover.  Pick any uncovered relationship, add both of its endpoints to your cover, repeat.  The result is at most twice the optimal cover size.  Twenty lines of code, formal guarantee.

Christofides' 3/2-approximation for metric Traveling Salesman uses a more elaborate construction — a minimum spanning tree, a matching on its odd-degree nodes, an Euler tour, shortcuts — and produces a tour at most 50% longer than optimal.  This was the best known bound for forty-four years, finally improved to 3/2 − ε in 2020.

First-Fit-Decreasing for bin packing uses at most 22% more bins than optimal.  Greedy set cover gets within a logarithmic factor of optimal.  These bounds matter because they let you tell the business exactly what you are giving up.

For some problems, no good approximation is possible.  Independent set, clique, and graph coloring all resist constant-factor approximation — under standard assumptions, no polynomial-time algorithm can guarantee better than a roughly-input-size factor.  For these problems, the right reply to "what can we promise" is "nothing, but here is what works in practice."

The PCP theorem from 1998 is the theoretical engine that proves these limits.  It is one of the most consequential results in modern computer science: it shows that many NP-hard problems are also hard to approximate beyond specific thresholds.  The thresholds vary by problem and they are tight.

For business planning, the question to ask once you have identified a problem as NP-hard is: what approximation ratio does the business accept?  10% off optimal?  50%?  Half-orders-of-magnitude?  The answer determines whether you need an exact solver (page 32), an approximation algorithm (this page), or a heuristic with no guarantees (page 36).

The bound is the negotiation.  Use it.`
  },
  {
    title: 'The approximation hierarchy — how good can you get',
    steps: [
      {
        prose: `The knapsack FPTAS — set an \`epsilon\` tolerance, scale every value down, run the DP on the smaller numbers, round back up.  The result is within \`(1 − ε)\` of optimal in time polynomial in both the input and \`1/ε\`.  A quality knob you actually get to turn.`,
        code: `fn knapsack_fptas(weights: &[u32], values: &[u32], capacity: u32, epsilon: f64) -> u64 {
    let v_max = *values.iter().max().unwrap_or(&1) as f64;
    let n = values.len() as f64;
    let k = (epsilon * v_max / n).max(1.0);
    let scaled: Vec<u32> = values.iter().map(|&v| (v as f64 / k) as u32).collect();
    let total: u32 = scaled.iter().sum();
    let mut dp = vec![u32::MAX; (total + 1) as usize];
    dp[0] = 0;
    for (i, &v) in scaled.iter().enumerate() {
        for s in (v..=total).rev() {
            if dp[(s - v) as usize] != u32::MAX {
                dp[s as usize] = dp[s as usize].min(dp[(s - v) as usize] + weights[i]);
            }
        }
    }
    (0..=total)
        .filter(|&s| dp[s as usize] <= capacity)
        .map(|s| (s as f64 * k) as u64)
        .max()
        .unwrap_or(0)
}`,
        lang: 'rust'
      }
    ],
    tldr: 'Some hard problems have arbitrarily tight approximations (FPTAS).  Some have only constant-factor (APX).  Some are hopeless.',
    gesture: 'The second layer of the complexity map: not all "approximable" problems are equally approximable.',
    body: `Approximation algorithms have their own complexity hierarchy.  FPTAS — Fully Polynomial-Time Approximation Scheme — is the gold standard: tunable closeness to optimal with polynomial cost in both input size and the tightness.  Knapsack has an FPTAS.  PTAS is the next tier: polynomial cost in input size, but the polynomial may explode as the tightness increases.  Euclidean TSP has a PTAS.  APX is the class of problems with constant-factor approximations.  APX-hard means no PTAS exists unless P = NP — vertex cover, metric TSP, set cover are APX-hard.  Some problems (independent set, clique) cannot even be approximated within constant factors.  For business planning, knowing where a problem sits in this hierarchy determines how much approximation budget you have.  An FPTAS lets you trade compute for quality smoothly.  APX-hard problems have a fixed quality ceiling — you can hit the bound but not improve below it without breaking complexity assumptions.`,
    citation: 'Arora, Lund, Motwani, Sudan, Szegedy (1998) the PCP theorem — the theoretical engine behind approximation limits.',
    link: 'https://en.wikipedia.org/wiki/Polynomial-time_approximation_scheme',
    eli5: `Not all NP-hard problems are equally approximable.  The field has a hierarchy of labels that tells you, for any given hard problem, how close to optimal you can hope to get in polynomial time.

The gold standard is FPTAS — Fully Polynomial-Time Approximation Scheme.  This means: for any quality target you specify (90% of optimal, 99%, 99.9%), there is an algorithm that achieves it in time polynomial in both the input size and the inverse of the gap.  You get a quality knob to turn, and turning it tighter only costs polynomially more.  Knapsack has an FPTAS — for any tolerance, an algorithm exists.

One step down is PTAS — Polynomial-Time Approximation Scheme.  Same idea, but the polynomial can have the inverse gap in the exponent.  This means tightening the approximation makes the algorithm exponentially slower in the tightness, even though it stays polynomial in input size.  Euclidean TSP has a PTAS.  PTAS is good news but with a caveat — production users typically pick a fixed tolerance and stick with it.

APX is the class of problems with some constant-factor approximation — within 2 of optimal, or 50% of optimal, or whatever.  No quality knob, just one fixed ratio.  Many practical hard problems sit here.

APX-hard is the bad news.  These problems cannot be approximated arbitrarily closely unless P = NP.  Vertex cover is APX-hard at the 2-approximation barrier (no PTAS unless P = NP, though small improvements below 2 are not ruled out yet).  Metric TSP is APX-hard.  Set cover is APX-hard at the logarithmic barrier.

Then there are problems that resist constant-factor approximation entirely.  Independent set, clique, graph coloring — these have no polynomial-time approximation within any constant factor unless P = NP.  For these problems, the right approach is heuristic with no guarantees (page 36).

For business planning, the hierarchy tells you the engineering reality.  An FPTAS problem is one where the quality-versus-compute trade-off is yours to tune.  A PTAS problem requires committing to a tolerance upfront.  An APX problem has one ratio and you take it or leave it.  An APX-hard problem cannot improve below its known bound without a breakthrough.  An inapproximable problem has no theoretical floor at all.

The engine behind all of this is the PCP theorem from 1998, which characterizes NP via probabilistic verification and lets you prove inapproximability bounds.  Most working engineers do not need the details, but knowing the labels exist is enough to size the work correctly.`
  },
  {
    title: 'When one dimension is small',
    steps: [
      {
        prose: `Fixed-parameter vertex cover — branch on each uncovered edge, recurse with \`k − 1\`.  Worst case \`2ᵏ\` branches, polynomial in \`n\`.  For a graph with millions of nodes and a target cover of size 30, the work is feasible.`,
        code: `fn vertex_cover_fpt(edges: &[(usize, usize)], k: i32) -> Option<Vec<(usize, usize)>> {
    if k < 0 { return None; }
    let uncovered = edges.iter().copied().next();
    let Some((u, v)) = uncovered else { return Some(vec![]); };
    let without_u: Vec<_> = edges.iter().filter(|e| e.0 != u && e.1 != u).copied().collect();
    if let Some(mut sol) = vertex_cover_fpt(&without_u, k - 1) {
        sol.push((u, u));
        return Some(sol);
    }
    let without_v: Vec<_> = edges.iter().filter(|e| e.0 != v && e.1 != v).copied().collect();
    if let Some(mut sol) = vertex_cover_fpt(&without_v, k - 1) {
        sol.push((v, v));
        return Some(sol);
    }
    None
}`,
        lang: 'rust'
      }
    ],
    tldr: 'Some hard problems become cheap when one part of the input is small — even if the rest is huge.  Look for the small parameter.',
    gesture: 'NP-hard does not mean uniformly hard.  Real problems often have a small dimension you can exploit.',
    body: `Many NP-hard problems become polynomial when one structural parameter of the input is small, even if the rest is huge.  Vertex cover on a graph with millions of nodes is fast when the optimal cover is small (work grows exponentially only in the cover size, not the graph size).  Problems on graphs with bounded treewidth (a measure of how tree-like the graph is) are polynomial via dynamic programming on a tree decomposition — and most NP-complete graph problems collapse this way.  This area is called parameterized complexity.  In practice, real business problems often have small structural parameters that the team can exploit: small kernel size after preprocessing, small treewidth, small number of conflicting items, small number of distinct values.  Identifying the small parameter is the engineering win.`,
    citation: 'Downey, R., Fellows, M. (1999) *Parameterized Complexity.*  Cygan, M. et al. (2015) *Parameterized Algorithms.*',
    link: 'https://www.springer.com/gp/book/9783319212746',
    eli5: `Classical complexity is binary: a problem is in P or it is not, where "in P" means polynomial-time as a function of total input size.  Real business problems have more structure than that.  A network may have millions of nodes but a small "feedback" — a small set of nodes whose removal eliminates all cycles.  A scheduling problem may have many jobs but few machines.  A constraint problem may have many variables but small interaction depth.

Parameterized complexity exploits these structural facts.  You identify a parameter — call it k — that captures the relevant smallness.  You then ask whether the problem can be solved in time polynomial in the total input size, with all the exponential cost confined to k.  If yes, the problem is "fixed-parameter tractable" in k, and you can solve it efficiently as long as k stays small.

Vertex cover is the textbook example.  Branching algorithm: pick any uncovered edge, branch on which endpoint to include in the cover, recurse with k decreased by one.  Worst case branches 2^k times.  Combined with kernelization rules — preprocessing that removes parts of the graph that obviously must or must not be in the cover — the algorithm runs in roughly 1.27^k times the graph size.  For a graph with millions of nodes and a target cover of size 30, this is fast.

Treewidth is the structural parameter for graphs.  It measures how "tree-like" a graph is.  Trees have treewidth 1; series-parallel graphs have treewidth 2.  Most NP-complete graph problems — vertex cover, independent set, Hamiltonian cycle, graph coloring — become polynomial on graphs of bounded treewidth via dynamic programming on a "tree decomposition."  Courcelle's theorem from 1990 generalizes this: any graph property expressible in a specific logical language is solvable in linear time on bounded-treewidth graphs.

The teaching for business planning is to look for the small parameter before treating an NP-hard problem as hopeless.  Real graphs often have small treewidth.  Real scheduling problems have few machines.  Real constraint systems have low interaction depth.  When you find the parameter, the work shrinks dramatically.

In Rust, parameterized algorithms are typically hand-rolled — the ecosystem for treewidth and kernelization is thinner than for SAT or MIP.  But the algorithms are usually short (branching plus bookkeeping) and the win is real.

Hardness is not uniform.  Find the small dimension.  Exploit it.`
  },
  {
    title: 'When everything else fails — heuristics',
    steps: [
      {
        prose: `Simulated annealing in plain Rust — pick a neighbor, accept improvements always, accept regressions with temperature-dependent probability, cool gradually.  For a real codebase reach for \`argmin\` to get logging, restarts, and the Metropolis criterion already wired up.`,
        code: `use rand::Rng;

fn anneal<S: Clone>(
    mut state: S,
    cost: impl Fn(&S) -> f64,
    neighbor: impl Fn(&S, &mut dyn rand::RngCore) -> S,
    mut temp: f64,
    cooling: f64,
    iterations: usize,
) -> S {
    let mut rng = rand::thread_rng();
    let mut best = state.clone();
    let mut best_cost = cost(&best);
    for _ in 0..iterations {
        let candidate = neighbor(&state, &mut rng);
        let delta = cost(&candidate) - cost(&state);
        if delta < 0.0 || rng.gen::<f64>() < (-delta / temp).exp() {
            state = candidate;
            let c = cost(&state);
            if c < best_cost { best_cost = c; best = state.clone(); }
        }
        temp *= cooling;
    }
    best
}`,
        lang: 'rust'
      }
    ],
    tldr: 'When exact solvers are too slow, approximations are too loose, and parameterization does not apply, you reach for heuristic search.  No guarantees, but often the right answer.',
    gesture: 'The last layer: search frameworks with no quality bounds, frequently the most useful at production scale.',
    body: `When exact methods fail, approximations are too loose, and parameterized algorithms do not apply, the last layer is heuristic search.  Simulated annealing accepts worsening moves with temperature-dependent probability, cooling toward greedy.  Tabu search maintains a memory of recently visited solutions to force exploration.  Genetic algorithms evolve populations.  Large neighborhood search alternates destruction and repair.  None come with worst-case quality guarantees.  All routinely produce strong solutions on real instances when nothing else fits.  Modern vehicle-routing solvers are heuristic-based.  Modern scheduling SaaS like OptaPlanner combine heuristics with constraint solvers.  Rust's argmin library provides a framework for several gradient-free methods.  At this layer of the stack, you are doing engineering, not theory.  Measure on representative instances.  Tune the parameters.  Accept that the work is empirical.`,
    citation: 'Kirkpatrick, Gelatt, Vecchi (1983) simulated annealing.  Glover, F. (1986) tabu search.',
    link: 'https://docs.rs/argmin/latest/argmin/',
    eli5: `When exact methods are too slow, approximation algorithms have ratios too loose, parameterized complexity does not apply, and the problem is too unstructured for specialized algorithms, you reach for heuristic search.  This is the bottom layer of the optimization toolkit, the place where engineers admit there is no theoretical bound on solution quality and just measure performance on real inputs.

The classics:

Simulated annealing imitates the physical process of cooling a metal.  Start at high temperature, accept any neighboring solution including worse ones.  Cool gradually, become more selective.  At low temperature, behave like greedy descent.  The cooling schedule is the art.  Originally applied to VLSI layout and TSP; now used across operations research.

Tabu search keeps a list of recently visited solutions and forbids returning to them, forcing the search to explore beyond local optima.  Aspiration criteria allow forbidden moves when they would improve the global best.  Tabu search is the production workhorse for many scheduling and routing systems.

Genetic algorithms encode candidate solutions as "chromosomes," select parents by fitness, combine them by crossover, mutate, and iterate.  The biological metaphor is overstated; most successful genetic algorithms are essentially stochastic local search with a population.

Large neighborhood search (LNS) is the modern workhorse for vehicle routing.  Take a current solution, destroy a piece of it (remove a subset of routes), repair the destroyed piece with an exact or heuristic subroutine, iterate.  When the destroy-and-repair subproblem is small enough for exact methods, LNS combines the best of both worlds.  Production VRP solvers like Vroom and OR-Tools are LNS-based.

In Rust, the argmin library provides a framework for several gradient-free methods including simulated annealing and particle swarm.  For specific metaheuristics tailored to your problem, hand-rolling is common — the algorithms are short and the customization needed is usually problem-specific.

The honest reality at this layer: you are doing engineering, not theory.  Bounds do not exist.  Quality is an empirical question.  The pattern that works is to set up a benchmark of representative real instances, try several methods, tune parameters, measure, ship the best.

When a problem has gone past every theoretical category — past exact, past approximation, past parameterization — accept that you are in the engineering layer and plan accordingly.  This is where most production optimization actually lives.`
  },

  // ─────────── Part V — The diagnostic, in a meeting ───────────
  {
    title: 'Is this in the cheap category — a checklist',
    steps: [
      {
        prose: `The six tests as an enum the codebase carries.  Each branch points at the right crate.  Wire this into your planning template and the procurement question becomes a constructor argument, not a debate.`,
        code: `enum CheapTest {
    GreedyWithExchange,   // sorting, scheduling, MST
    DynamicProgramming,   // counting, alignment, DAGs
    NetworkFlow,          // matching, allocation, partition
    TwoPieceConstraint,   // 2-SAT via SCC
    LinearProgramming,    // continuous vars + linear constraints
    LinearAlgebra,        // matrices, eigenvalues, factorization
}

fn crate_for(test: CheapTest) -> &'static str {
    match test {
        CheapTest::GreedyWithExchange => "std::slice::sort_unstable + a loop",
        CheapTest::DynamicProgramming => "hand-rolled table",
        CheapTest::NetworkFlow        => "petgraph::algo::ford_fulkerson",
        CheapTest::TwoPieceConstraint => "petgraph::algo::tarjan_scc on implication graph",
        CheapTest::LinearProgramming  => "good_lp with the HiGHS backend",
        CheapTest::LinearAlgebra      => "nalgebra or faer",
    }
}`,
        lang: 'rust'
      }
    ],
    tldr: 'Six structural tests.  If any passes, your problem is in the cheap category and a library exists.  Run them before sizing the work.',
    gesture: 'Before you size an engineering effort, run the six tests.  Half the time the problem is already solved.',
    body: `Six structural tests determine whether a problem is in the cheap category.  Greedy with exchange argument — does picking the best local choice provably lead to optimal?  (Many sorting, scheduling, allocation problems.)  Dynamic programming — is there a small set of subproblems that combine into the answer?  (Most counting, optimization, alignment problems.)  Network flow — does the problem reduce to "maximum flow through a network with capacities"?  (Many matching, allocation, partition problems.)  Two-piece constraints — are all the constraints expressible as "if X then Y" with exactly two variables?  (Many configuration, scheduling problems.)  Linear programming — are constraints and objective linear with continuous variables?  (Most operational planning.)  Linear algebra — does the problem reduce to matrix factorization, eigenvalues, or linear systems?  (Many ranking, recommendation, signal processing problems.)  If any test passes, you have a settled problem and a library.  Run the checklist in the meeting.`,
    citation: 'Cormen, Leiserson, Rivest, Stein (2009) *Introduction to Algorithms.*',
    link: 'https://github.com/andygauge',
    eli5: `The trap that motivated this book is reaching for hard-problem tools — SAT solvers, ILP modeling, heuristic search — on problems that are actually in the cheap category.  The counter is a checklist run at the planning stage.  Six structural tests cover most of the cheap category.

Test one: greedy with exchange argument.  Can the problem be solved by sorting and picking in order?  Interval scheduling (maximize non-overlapping appointments), fractional knapsack, Huffman coding, minimum spanning tree, and dozens of others all have this shape.  If yes, the work is a sort plus a loop.  Days.

Test two: dynamic programming.  Is there a small set of subproblems whose answers combine into the answer?  Most counting problems, most optimization on sequences or DAGs, most alignment problems.  Edit distance, shortest path on DAGs, matrix chain multiplication, knapsack DP all fit.  If yes, the work is a table and a recurrence.  Days.

Test three: network flow.  Can the problem be expressed as "maximize the amount that can flow from source to sink through a capacitated network"?  Many matching, allocation, partition, and assignment problems reduce to flow.  Bipartite matching, project selection, image segmentation, baseball elimination — all flow.  If yes, the work is to define the network and call the flow algorithm.  Days.

Test four: two-piece constraints.  Are all the rules expressible as "if X then Y" with exactly two variables each?  Many configuration and scheduling problems have this shape.  If yes, the work is to build the implication graph and run strongly connected components.  Days.

Test five: linear programming.  Are the constraints and objective all linear, and do the variables only need to be continuous?  Most operational planning, blending, transportation, portfolio allocation.  If yes, the work is to model in good_lp and call HiGHS.  Days.

Test six: linear algebra.  Does the problem reduce to matrix factorization, eigenvalues, or solving a linear system?  PageRank, recommendation systems via matrix factorization, principal component analysis, spectral clustering.  If yes, the work is to set up the matrix and call nalgebra or faer.  Days.

If any test passes, you have a settled problem.  Reach for the library and ship.

If no test passes, you may be in the expensive category — see page 38 for the lookalikes that fool teams and page 39 for the common mistakes.`
  },
  {
    title: 'Eight twins — one cheap, one expensive',
    steps: [
      {
        prose: `The eight pairs, encoded as types.  Each pair has the same input shape and a different return shape — one falls to a one-line library call, the other needs a solver.  Read the pair before sizing the ticket.`,
        code: `// Cheap twin — Euler, visit every edge.  Linear time.
fn inspect_every_road(roads: &[(usize, usize)]) -> Option<Vec<usize>> { todo!("Hierholzer") }
// Expensive twin — Hamilton, visit every node.  NP-complete.
fn visit_every_store(roads: &[(usize, usize)]) -> Option<Vec<usize>> { todo!("SAT or brute force") }

// Cheap — 2-SAT.  Linear via SCC on the implication graph.
fn two_piece_rules(clauses: &[(i32, i32)]) -> bool { todo!("tarjan_scc") }
// Expensive — 3-SAT.  NP-complete.
fn three_piece_rules(clauses: &[[i32; 3]]) -> bool { todo!("splr") }

// Cheap — bipartite check.  Linear.
fn two_categories(g: &[(usize, usize)]) -> bool { todo!("BFS two-coloring") }
// Expensive — k-coloring for k ≥ 3.  NP-complete.
fn three_categories(g: &[(usize, usize)]) -> Option<Vec<u8>> { todo!("splr") }

// Cheap — shortest path with positive weights.  Dijkstra.
fn shortest(g: &[(usize, usize, u32)]) -> u32 { todo!("petgraph::dijkstra") }
// Expensive — longest simple path.  NP-complete.
fn longest_no_repeat(g: &[(usize, usize, u32)]) -> u32 { todo!("brute force or ILP") }

// Cheap — MST, connect every node.  Greedy.
fn connect_all(sites: &[(usize, usize, u32)]) -> u32 { todo!("min_spanning_tree") }
// Expensive — Steiner tree, connect a subset using relays.  NP-complete.
fn connect_subset(sites: &[(usize, usize, u32)], terminals: &[usize]) -> u32 { todo!("ILP") }

// Cheap — bipartite matching.  Hungarian.
fn match_two_sides(cost: &[Vec<i32>]) -> Vec<usize> { todo!("kuhn_munkres") }
// Expensive — 3-dimensional matching.  NP-complete.
fn match_three_sides(triples: &[(usize, usize, usize)]) -> Vec<(usize, usize, usize)> { todo!("ILP") }

// Cheap — LP, continuous variables.
fn allocate_fractional(c: &[f64]) -> Vec<f64> { todo!("good_lp + HiGHS, continuous") }
// Expensive — ILP, integer variables.
fn allocate_whole(c: &[f64]) -> Vec<i32> { todo!("good_lp + HiGHS, binary or integer") }

// Cheap — fractional knapsack.  Greedy by ratio.
fn take_fractions(items: &[(u32, u32)], cap: u32) -> f64 { todo!("sort by value/weight, fill") }
// Expensive — 0/1 knapsack.  DP for small budgets, ILP otherwise.
fn take_whole_items(items: &[(u32, u32)], cap: u32) -> u32 { todo!("knapsack DP") }`,
        lang: 'rust'
      }
    ],
    tldr: 'Eight pairs of business problems that sound nearly identical.  In each pair, one twin is days; the other is a quarter.  This is the page to bookmark.',
    gesture: 'The single most useful page in this book — eight lookalikes that distinguish "a sprint" from "a SaaS contract."',
    body: `Eight pairs of problems sound nearly identical and live in different complexity classes.  Visit every link (cheap, Euler) vs visit every stop (expensive, Hamilton).  Two-piece constraints (cheap, 2-SAT) vs three-piece (expensive, 3-SAT).  Two categories (cheap, bipartite test) vs three or more (expensive, coloring).  Shortest path (cheap, Dijkstra) vs longest path that does not repeat (expensive).  Connect everything (cheap, MST) vs connect a subset using others as relays (expensive, Steiner tree).  Match two sides (cheap, bipartite matching) vs match three sides (expensive, 3D matching).  Linear programming (cheap) vs integer linear programming (expensive).  Take items in fractions (cheap, greedy by ratio) vs take items whole (expensive, 0/1 knapsack).  In every pair, the difference is one specification detail — and the engineering cost varies by an order of magnitude.  Read requirements carefully.`,
    citation: 'Karp, R. (1972) *Reducibility Among Combinatorial Problems.*  Garey, M., Johnson, D. (1979) *Computers and Intractability.*',
    link: 'https://github.com/andygauge',
    eli5: `This is the page to bookmark.  Eight pairs of business problems that sound nearly identical and live in opposite complexity classes.  In each pair, one twin is a sprint; the other is a quarter (or a SaaS contract).

**Visit every link versus visit every stop.**  Inspect every road segment — cheap, days.  Visit every customer in a territory — expensive, weeks at best with heuristics.  The difference: edges versus nodes.

**Two-piece rules versus three-piece rules.**  Every constraint involves exactly two variables — cheap, linear time.  Some constraint involves three or more — expensive, SAT solver.  The difference: rule width.

**Two categories versus three or more.**  Assign each item to one of two buckets with conflict constraints — cheap, bipartite test.  Three or more categories — expensive, NP-complete graph coloring.  The difference: bucket count.

**Shortest versus longest.**  Shortest path with positive costs — cheap, Dijkstra.  Longest path without repeats — expensive, NP-complete.  The difference: min versus max with the no-repeat constraint.

**Connect every location versus connect a subset using others as relays.**  Every location must be on the network — cheap, MST in days.  Only a subset must be connected, others optional — expensive, Steiner tree in weeks.  The difference: optional intermediate nodes.

**Match two sides versus match three sides.**  Pair drivers with deliveries — cheap, Hopcroft-Karp.  Pair driver with delivery with time slot — expensive, 3D matching.  The difference: number of dimensions.

**Continuous values versus whole numbers.**  Plan with continuous quantities (money, hours, units in fractional amounts) — cheap, linear programming.  Plan with discrete decisions (build or not, hire or not, ship or not) — expensive, integer programming.  The difference: integrality.

**Items in fractions versus items whole.**  Take 0.7 of this item and 0.3 of that — cheap, fractional knapsack greedy.  Take items as wholes only — expensive, 0/1 knapsack DP or ILP.  The difference: divisibility.

The pattern across all eight is the same.  A continuity assumption — fractional values, two categories, two dimensions, every-node requirement, edge-traversal — keeps the problem in the cheap category.  An integrality or discreteness assumption — whole items, three or more categories, additional dimensions, subset-only requirements, vertex-traversal — pushes it into the expensive category.

When a requirement feels like it belongs on the right side, check whether you can reframe it for the left side.  Often you can.  Often you have been needlessly heuristic.

Bookmark this page.  Run it in every planning meeting that involves an optimization problem.`
  },
  {
    title: 'Six places teams reach for the wrong category',
    steps: [
      {
        prose: `A detector that flags an estimate against the six recurring traps.  Run it on the planning doc.  Every \`true\` is a sprint that has probably been quoted as a quarter.`,
        code: `struct Estimate {
    description: String,
    proposed_tool: &'static str,
    has_positive_weights_only: bool,
    is_two_sided_matching: bool,
    has_only_continuous_vars: bool,
    every_constraint_has_two_vars: bool,
    data_is_dag: bool,
    has_matroid_structure: bool,
}

fn wrong_category(e: &Estimate) -> Vec<&'static str> {
    let mut flags = Vec::new();
    if e.has_positive_weights_only && !e.proposed_tool.contains("dijkstra") {
        flags.push("shortest path with positive weights — use Dijkstra, not SAT");
    }
    if e.is_two_sided_matching && e.proposed_tool.contains("ILP") {
        flags.push("two-sided matching — Hopcroft-Karp or Hungarian, not ILP");
    }
    if e.has_only_continuous_vars && e.proposed_tool.contains("search") {
        flags.push("continuous LP — model in good_lp, don't search");
    }
    if e.every_constraint_has_two_vars && e.proposed_tool.contains("SAT") {
        flags.push("2-SAT — implication graph + SCC, not CDCL");
    }
    if e.data_is_dag && e.proposed_tool.contains("heuristic") {
        flags.push("DAG — toposort + DP, not heuristic search");
    }
    if e.has_matroid_structure && e.proposed_tool.contains("ILP") {
        flags.push("matroid — greedy is provably optimal");
    }
    flags
}`,
        lang: 'rust'
      }
    ],
    tldr: 'Six recurring patterns where engineers overestimate problem difficulty.  Each one is a place this book\'s thesis pays for itself.',
    gesture: 'The six traps that cause teams to size a sprint as a quarter.  Read them; recognize the patterns; redirect the work.',
    body: `Six recurring misidentifications.  Treating shortest-path-with-positive-costs as hard because the network is large — Dijkstra handles millions of nodes.  Treating bipartite matching as hard because the count is large — Hopcroft-Karp handles tens of thousands per second.  Treating linear programming as hard because there are many variables — HiGHS handles millions.  Treating two-piece constraint problems as SAT problems — they are linear-time via graph methods.  Treating problems on DAGs as if cycles were possible — the acyclic structure collapses many NP-hard problems to polynomial.  Treating problems with matroid structure as needing search when greedy is provably optimal.  In every case the fix is the same: name the structural property, look up the named algorithm, find the Rust crate.  See page 37 for the checklist and page 38 for the lookalikes.`,
    citation: 'Schrijver, A. (2003) *Combinatorial Optimization: Polyhedra and Efficiency.*',
    link: 'https://github.com/andygauge',
    eli5: `This page is the mirror — the six places where, in your team's planning meetings, the wrong category has probably been chosen.

**Mistake one: big input means hard.**  No.  Input size is one parameter.  A shortest-path query over a network of ten million points is still Dijkstra, still a millisecond per query with the right data structure.  Reach for SAT or heuristics only when the structure is genuinely combinatorial — not when the problem is just big.

**Mistake two: matching looks like assignment looks like ILP.**  Yes, the assignment problem can be modeled as ILP.  No, you do not need ILP.  Bipartite matching is Hopcroft-Karp for unweighted and the Hungarian algorithm for weighted, both polynomial, both one library call in Rust's pathfinding.

**Mistake three: linear programming sounds expensive.**  It is not.  HiGHS solves LPs with millions of variables in seconds.  When your problem has linear constraints and a linear objective with continuous variables, model it and dispatch.  Do not search the solution space yourself.

**Mistake four: implication constraints look like SAT.**  When every constraint has the form "if X then Y" with two variables, you are in the 2-SAT category and the answer is linear time via strongly connected components on the implication graph.  Do not encode in CNF and call a SAT solver for what petgraph solves in fifty lines.

**Mistake five: cycles complicate everything.**  When your data is a DAG — build dependencies, workflow steps, version histories — many NP-hard problems collapse to polynomial dynamic programming on the topological order.  Confirm the acyclicity, then do the DP.

**Mistake six: greedy is a hack.**  When the underlying structure is a matroid — forests in a graph, bipartite transversals, linearly independent vectors — greedy is provably optimal.  Sort, pick, verify the matroid property.  No search needed.  MST is the textbook example.

The common thread across all six mistakes is the same.  The structural property of the problem determines the category, and the category determines the tool.  Name the property and the tool declares itself.  The crates are listed in the Part II pages.

This book exists to make this reflex automatic in planning meetings.  Page 37 is the checklist for "is this in the cheap category."  Page 38 is the lookalikes that fool experienced teams.  This page is the mirror — what your team has probably been doing wrong, in case any of it sounds familiar.

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
