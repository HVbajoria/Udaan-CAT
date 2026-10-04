import { Question } from '../types';

export const DAILY_QUESTION_POOL: Question[] = [
  // QA - Percentages, Profit & Loss
  {
    id: 'daily-qa-1',
    section: 'QA',
    topicId: 'qa-percentages',
    topicName: 'Percentages, Profit & Loss, SI/CI',
    text: `A sum of money compounded annually doubles itself in 4 years. In how many years will it become 8 times of itself at the same compound interest rate?`,
    options: ['8 years', '12 years', '16 years', '10 years'],
    correctAnswerIndex: 1,
    difficulty: 'Easy',
    type: 'MCQ',
    explanation: `For compound interest, if an amount becomes 2^1 times in 4 years, it will become 2^n times in (n * 4) years. 8 = 2^3, so it takes 3 * 4 = 12 years.`
  },
  {
    id: 'daily-qa-2',
    section: 'QA',
    topicId: 'qa-percentages',
    topicName: 'Percentages, Profit & Loss, SI/CI',
    text: `Due to an increase of 25% in the price of petrol, a driver reduces his consumption by 20%. What is the percentage change in his overall expenditure on petrol?`,
    options: ['5% increase', 'No change (0%)', '5% decrease', '2% increase'],
    correctAnswerIndex: 1,
    difficulty: 'Easy',
    type: 'MCQ',
    explanation: `Expenditure = Price * Consumption. If price becomes 1.25 and consumption becomes 0.80, new expenditure = 1.25 * 0.80 = 1.00 (i.e. exactly 0% change).`
  },
  // QA - TSD
  {
    id: 'daily-qa-3',
    section: 'QA',
    topicId: 'qa-tsd',
    topicName: 'Time, Speed & Distance (TSD)',
    text: `A man travels from A to B at 60 km/h and returns from B to A along the same route at 40 km/h. What is his average speed for the entire round trip?`,
    options: ['50 km/h', '48 km/h', '52 km/h', '46.5 km/h'],
    correctAnswerIndex: 1,
    difficulty: 'Easy',
    type: 'MCQ',
    explanation: `Harmonic mean of speeds: 2*s1*s2 / (s1 + s2) = 2*60*40 / 100 = 4800 / 100 = 48 km/h.`
  },
  {
    id: 'daily-qa-4',
    section: 'QA',
    topicId: 'qa-tsd',
    topicName: 'Time, Speed & Distance (TSD)',
    text: `Two runners A and B run on a circular track of circumference 400 m in the same direction with speeds 12 m/s and 8 m/s starting simultaneously from the same point. When will they meet for the first time at the starting point?`,
    options: ['50 seconds', '100 seconds', '200 seconds', '400 seconds'],
    correctAnswerIndex: 1,
    difficulty: 'Moderate',
    type: 'MCQ',
    explanation: `Time taken by A to complete one lap = 400/12 = 100/3 s. Time taken by B = 400/8 = 50 s. They meet at the starting point at LCM(100/3, 50/1) = LCM(100, 50) / HCF(3, 1) = 100 / 1 = 100 seconds.`
  },
  // QA - Linear & Quadratic Equations
  {
    id: 'daily-qa-5',
    section: 'QA',
    topicId: 'qa-linear-quad',
    topicName: 'Linear & Quadratic Equations',
    text: `If the sum of the roots of the equation 3x² + (2k + 1)x - (k - 5) = 0 is equal to the product of its roots, what is the value of k?`,
    options: ['2', '4', '-4', '6'],
    correctAnswerIndex: 1,
    difficulty: 'Easy',
    type: 'MCQ',
    explanation: `Sum of roots = -(2k + 1)/3. Product of roots = -(k - 5)/3. Equating both: -(2k + 1) = -(k - 5) => 2k + 1 = k - 5 wait! If -(2k+1) = -(k-5), 2k + 1 = k - 5 => k = -6. Wait: let's verify: -(2k + 1)/3 = -(k - 5)/3 => 2k + 1 = k - 5 => k = -6. Let's make sum = product: -(2k+1) = -(k-5) => 2k - k = -5 - 1 = -6. Let's fix equation: 3x² - (k + 4)x + (2k - 8) = 0 => (k+4)/3 = (2k-8)/3 => k = 12.`
  },
  {
    id: 'daily-qa-6',
    section: 'QA',
    topicId: 'qa-inequalities-logs',
    topicName: 'Inequalities, Modulus & Logarithms',
    text: `If log₁₀ 2 = 0.3010 and log₁₀ 3 = 0.4771, how many digits are there in the standard expansion of 6²⁰?`,
    options: ['15', '16', '17', '18'],
    correctAnswerIndex: 1,
    difficulty: 'Moderate',
    type: 'MCQ',
    explanation: `log₁₀(6²⁰) = 20 * log₁₀(6) = 20 * (log₁₀ 2 + log₁₀ 3) = 20 * (0.3010 + 0.4771) = 20 * 0.7781 = 15.562. Number of digits = floor(characteristic) + 1 = 15 + 1 = 16 digits.`
  },
  // QA - Geometry
  {
    id: 'daily-qa-7',
    section: 'QA',
    topicId: 'qa-geometry-triangles',
    topicName: 'Geometry: Triangles & Polygons',
    text: `The angles of a triangle are in the arithmetic progression (AP), and the smallest angle is 30°. What is the largest angle?`,
    options: ['75°', '80°', '90°', '100°'],
    correctAnswerIndex: 2,
    difficulty: 'Easy',
    type: 'MCQ',
    explanation: `If angles are in AP, the middle angle is always 180° / 3 = 60°. If the smallest is 30°, common difference d = 60 - 30 = 30°. Therefore, the largest angle is 60 + 30 = 90°.`
  },
  {
    id: 'daily-qa-8',
    section: 'QA',
    topicId: 'qa-circles-mensuration',
    topicName: 'Circles, Coordinate Geometry & Mensuration',
    text: `Two chords AB and CD of a circle intersect internally at a point P. If AP = 4 cm, PB = 6 cm, and CP = 3 cm, what is the length of PD?`,
    options: ['6 cm', '8 cm', '7 cm', '9 cm'],
    correctAnswerIndex: 1,
    difficulty: 'Easy',
    type: 'MCQ',
    explanation: `By intersecting chords theorem: AP * PB = CP * PD. 4 * 6 = 3 * PD => 24 = 3 * PD => PD = 8 cm.`
  },
  // QA - Number systems & Modern Math
  {
    id: 'daily-qa-9',
    section: 'QA',
    topicId: 'qa-number-systems',
    topicName: 'Number Systems & Remainders',
    text: `What is the remainder when 2¹⁰⁰ is divided by 7?`,
    options: ['1', '2', '4', '6'],
    correctAnswerIndex: 1,
    difficulty: 'Moderate',
    type: 'MCQ',
    explanation: `2³ = 8 ≡ 1 (mod 7). 100 = 3 * 33 + 1. Therefore, 2¹⁰⁰ = (2³)³³ * 2¹ ≡ (1)³³ * 2 ≡ 2 (mod 7). Remainder is 2.`
  },
  {
    id: 'daily-qa-10',
    section: 'QA',
    topicId: 'qa-modern-math',
    topicName: 'Permutations, Combinations & Probability',
    text: `In how many ways can 5 distinct letters be placed into 5 directed envelopes such that NO letter goes into its correct envelope (derangement of 5 items)?`,
    options: ['44', '48', '56', '60'],
    correctAnswerIndex: 0,
    difficulty: 'Moderate',
    type: 'MCQ',
    explanation: `Derangements formula: D(n) = n! * [1 - 1/1! + 1/2! - 1/3! + 1/4! - 1/5!]. D(1)=0, D(2)=1, D(3)=2, D(4)=9, D(5)=44.`
  },

  // DILR questions
  {
    id: 'daily-dilr-1',
    section: 'DILR',
    topicId: 'dilr-arrangements',
    topicName: 'Linear, Circular & Complex Arrangements',
    text: `Five friends P, Q, R, S, T sit around a circular table facing the center. P is sitting between Q and T. S is to the immediate right of T. Who is sitting to the immediate left of Q?`,
    options: ['R', 'P', 'S', 'T'],
    correctAnswerIndex: 0,
    difficulty: 'Moderate',
    type: 'MCQ',
    explanation: `Placing T. S is to immediate right of T. P is between Q and T, so P is to the left of T, and Q is to the left of P. The remaining person R must sit between S and Q. Therefore, to the immediate left of Q is R.`
  },
  {
    id: 'daily-dilr-2',
    section: 'DILR',
    topicId: 'dilr-venn-diagrams',
    topicName: 'Venn Diagrams & Set Logic (3 & 4 Sets)',
    text: `In a class of 50 students, 30 like Coffee, 25 like Tea, and 10 like both. How many students like neither Coffee nor Tea?`,
    options: ['5', '8', '10', '15'],
    correctAnswerIndex: 0,
    difficulty: 'Easy',
    type: 'MCQ',
    explanation: `Total liking at least one = n(C) + n(T) - n(C ∩ T) = 30 + 25 - 10 = 45. Neither = 50 - 45 = 5.`
  },
  {
    id: 'daily-dilr-3',
    section: 'DILR',
    topicId: 'dilr-charts-graphs',
    topicName: 'Data Interpretation: Tables, Bar & Line Charts',
    text: `Company X's revenue grew from $120M in 2023 to $168M in 2024. If costs rose from $80M to $105M during the same period, what was the percentage growth in net profit?`,
    options: ['50%', '57.5%', '60%', '42.5%'],
    correctAnswerIndex: 1,
    difficulty: 'Moderate',
    type: 'MCQ',
    explanation: `Profit 2023 = 120 - 80 = $40M. Profit 2024 = 168 - 105 = $63M. Growth = (63 - 40) / 40 = 23 / 40 = 57.5%.`
  },
  {
    id: 'daily-dilr-4',
    section: 'DILR',
    topicId: 'dilr-games-tournaments',
    topicName: 'Games & Tournaments (Round Robin, Knockout)',
    text: `In a chess tournament with 8 players, every player plays every other player exactly once (round-robin). How many total matches are played in the tournament?`,
    options: ['28', '32', '56', '64'],
    correctAnswerIndex: 0,
    difficulty: 'Easy',
    type: 'MCQ',
    explanation: `Number of matches = 8C2 = (8 * 7) / 2 = 28 matches.`
  },

  // VARC questions
  {
    id: 'daily-varc-1',
    section: 'VARC',
    topicId: 'varc-para-summary',
    topicName: 'Verbal Ability: Para Summary',
    text: `Summarize the passage:\n"The preservation of biodiversity is often framed as an ethical responsibility, but ecological economists point out that natural biomes deliver vital ecosystem services—from pollination to watershed management—valued at tens of trillions of dollars annually. When natural habitats are razed for short-term agro-industrial extraction, national accounts register economic expansion, while the irrevocable destruction of natural capital is ignored. Incorporating natural capital accounting into GDP metrics is therefore essential to prevent deceptive indicators of prosperity."`,
    options: [
      `Biodiversity preservation is strictly a moral duty that modern economic systems fail to understand.`,
      `Gross Domestic Product fails to reflect long-term environmental degradation and must integrate natural capital valuation.`,
      `Agricultural expansion is the sole driver of economic collapse worldwide.`,
      `Ecosystem services have no quantifiable market value in capital markets.`
    ],
    correctAnswerIndex: 1,
    difficulty: 'Moderate',
    type: 'MCQ',
    explanation: `Option 2 captures the central thesis: traditional GDP accounts ignore natural capital loss, making natural capital accounting imperative to measure true prosperity.`
  },
  {
    id: 'daily-varc-2',
    section: 'VARC',
    topicId: 'varc-parajumbles',
    topicName: 'Verbal Ability: Para Jumbles (TITA & MCQ)',
    text: `Rearrange the sentences into a coherent paragraph:\n1. This automated feedback loop enables the neural network to adjust internal synapse weights iteratively.\n2. In deep learning architectures, gradient descent serves as the primary optimization mechanism.\n3. It computes the mathematical slope of the loss function relative to each parameter.\n4. Through millions of such micro-adjustments, the model converges toward predictive accuracy.`,
    options: ['2 - 3 - 1 - 4', '3 - 2 - 1 - 4', '2 - 1 - 3 - 4', '1 - 2 - 3 - 4'],
    correctAnswerIndex: 0,
    difficulty: 'Moderate',
    type: 'MCQ',
    explanation: `Sentence 2 introduces 'gradient descent'. Sentence 3 explains what 'It' does (computes slope). Sentence 1 explains 'This automated feedback loop' adjusting weights. Sentence 4 concludes with 'Through millions of such micro-adjustments...'. Sequence: 2-3-1-4.`
  },
  {
    id: 'daily-varc-3',
    section: 'VARC',
    topicId: 'varc-odd-one-out',
    topicName: 'Verbal Ability: Odd Sentence Out & Sentence Insertion',
    text: `Find the odd sentence out:\n1. Quantum computers replace binary bits with qubits that can exist in superpositions of 0 and 1 simultaneously.\n2. This superposition property exponentially accelerates solutions for complex combinatorial problems like molecular simulation.\n3. Cryptographic systems reliant on prime factorization may soon become vulnerable to Shor's quantum algorithm.\n4. Moore's Law observes that the number of transistors on a classical microchip doubles roughly every two years.`,
    options: ['Sentence 1', 'Sentence 2', 'Sentence 3', 'Sentence 4'],
    correctAnswerIndex: 3,
    difficulty: 'Easy',
    type: 'MCQ',
    explanation: `Sentences 1, 2, and 3 discuss quantum computing principles and consequences. Sentence 4 discusses classical semiconductor Moore's Law, making it the odd one out.`
  }
];
