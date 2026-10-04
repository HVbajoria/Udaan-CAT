import { RoadmapDay, CATSection, MasteryLevel, StudySegment } from '../types';

/**
 * Realistic CAT Score to Percentile Mapping based on recent CAT normalized statistics
 * Total raw marks = 198 (66 questions x 3 marks)
 */
export function estimatePercentile(rawScore: number): number {
  if (rawScore >= 110) return 99.9;
  if (rawScore >= 95) return 99.5;
  if (rawScore >= 85) return 99.0;
  if (rawScore >= 75) return 98.0;
  if (rawScore >= 66) return 96.5;
  if (rawScore >= 58) return 95.0;
  if (rawScore >= 50) return 92.0;
  if (rawScore >= 44) return 88.0;
  if (rawScore >= 38) return 82.0;
  if (rawScore >= 32) return 75.0;
  if (rawScore >= 26) return 65.0;
  if (rawScore >= 20) return 55.0;
  if (rawScore >= 14) return 40.0;
  if (rawScore >= 8) return 25.0;
  return Math.max(5.0, +(rawScore * 2).toFixed(1));
}

export function getMasteryLevel(score: number): MasteryLevel {
  if (score >= 70) return 'Strong';
  if (score >= 45) return 'Developing';
  return 'Weak';
}

/**
 * Generates the tailored 45-Day CAT preparation roadmap.
 * Dynamically reweights topics, targets, and study priorities based on user strengths & weaknesses!
 */
export function generateAdaptiveRoadmap(
  weakTopicIds: string[] = [],
  strongTopicIds: string[] = []
): RoadmapDay[] {
  const isWeak = (topicId: string) => weakTopicIds.includes(topicId);

  const rawDays: Array<Omit<RoadmapDay, 'isCompleted' | 'isToday'>> = [
    // ==========================================
    // PHASE 1: DAYS 1 - 18: FOUNDATION & HIGH-WEIGHTAGE SYLLABUS MASTERY
    // ==========================================
    {
      dayNumber: 1,
      phase: 1,
      phaseTitle: 'Phase 1: Foundation & High-Weightage Core',
      title: 'Diagnostic Test & Baseline Skill Gap Analysis',
      focusSection: 'ALL',
      primaryTopics: ['All Sections Diagnostic', 'Mindset Setup', 'Target Percentile Goal-Setting'],
      goals: [
        'Complete the 18-question comprehensive baseline CAT test',
        'Identify specific topic deficits across QA, DILR & VARC',
        'Lock daily study slot (minimum 3-4 hours required for 45-day crunch)',
      ],
      practiceTarget: '1 Baseline Assessment (18 Qs) + Error Review',
      testScheduled: {
        type: 'DAILY_DRILL',
        name: 'Initial Diagnostic Assessment',
        durationMinutes: 35,
        recommendedTime: 'Morning / Slot 1',
      },
      keyTips: ['Do not guess in baseline test; leave questions you do not know to get an accurate weakness map.'],
    },
    {
      dayNumber: 2,
      phase: 1,
      phaseTitle: 'Phase 1: Foundation & High-Weightage Core',
      title: 'QA: Percentages & Profit/Loss + VARC: Philosophy RC',
      focusSection: 'QA',
      primaryTopics: ['qa-percentages', 'varc-rc-philosophy'],
      goals: [
        'Master fraction-to-percentage conversions (1/2 through 1/20)',
        'Solve dishonest dealer and successive markup problems',
        'Read 2 philosophy articles (Aeon / The Atlantic) and summarize core thesis',
      ],
      practiceTarget: isWeak('qa-percentages') ? '35 QA Questions (Heavy Drill) + 2 RC Passages' : '25 QA Questions + 2 RC Passages',
      testScheduled: {
        type: 'DAILY_DRILL',
        name: 'Day 2 Drill: Percentages & RC Deep Read',
        durationMinutes: 20,
        recommendedTime: 'Evening 8:00 PM',
      },
      keyTips: ['Use multiplier method: 15% increase is x 1.15; 20% discount is x 0.80.'],
    },
    {
      dayNumber: 3,
      phase: 1,
      phaseTitle: 'Phase 1: Foundation & High-Weightage Core',
      title: 'QA: Simple & Compound Interest + DILR: Linear Arrangements',
      focusSection: 'DILR',
      primaryTopics: ['qa-percentages', 'dilr-arrangements'],
      goals: [
        'Memorize 2-year and 3-year CI - SI difference formulas',
        'Learn directional anchoring for linear arrangement sets',
        'Solve 3 linear arrangement sets without looking at hints',
      ],
      practiceTarget: '20 QA Interest problems + 3 DILR Sets (15 Qs)',
      testScheduled: {
        type: 'DAILY_DRILL',
        name: 'Day 3 Drill: DILR Linear Grid & Interest',
        durationMinutes: 25,
        recommendedTime: 'Post Dinner',
      },
      keyTips: ['In linear arrangement, anchor definite clues first before branching conditional cases.'],
    },
    {
      dayNumber: 4,
      phase: 1,
      phaseTitle: 'Phase 1: Foundation & High-Weightage Core',
      title: 'QA: Ratios, Proportions & Alligations + VARC: Para Jumbles',
      focusSection: 'QA',
      primaryTopics: ['qa-ratio-averages', 'varc-parajumbles'],
      goals: [
        'Master the Alligation Cross-Method for weighted averages and mixtures',
        'Repeated replacement formula for dilution: Final = Initial * (1 - x/V)^n',
        'Learn 4 mandatory pair identifiers for Para Jumbles',
      ],
      practiceTarget: '25 QA Alligation problems + 12 Para Jumbles',
      testScheduled: {
        type: 'DAILY_DRILL',
        name: 'Day 4 Drill: Alligations & VA Jumbles',
        durationMinutes: 20,
        recommendedTime: 'Evening',
      },
      keyTips: ['Para Jumbles have no negative marking if TITA in CAT—attempt every single one!'],
    },
    {
      dayNumber: 5,
      phase: 1,
      phaseTitle: 'Phase 1: Foundation & High-Weightage Core',
      title: 'QA: Time & Work, Pipes + DILR: Circular Arrangements',
      focusSection: 'DILR',
      primaryTopics: ['qa-time-work', 'dilr-arrangements'],
      goals: [
        'Convert all work & pipe problems into total LCM units instead of fractions',
        'Handle alternate days and negative pipe emptying work',
        'Circular seating: distinguish facing inward vs facing outward directions',
      ],
      practiceTarget: '25 QA Work problems + 3 Circular DILR Sets',
      testScheduled: {
        type: 'DAILY_DRILL',
        name: 'Day 5 Drill: Time-Work & Circular Seating',
        durationMinutes: 25,
        recommendedTime: 'Evening',
      },
      keyTips: ['Facing center: clockwise is left, counter-clockwise is right.'],
    },
    {
      dayNumber: 6,
      phase: 1,
      phaseTitle: 'Phase 1: Foundation & High-Weightage Core',
      title: 'WEEK 1 TEST: Sectional Test 1 (VARC) + Deep Review',
      focusSection: 'VARC',
      primaryTopics: ['varc-rc-philosophy', 'varc-rc-science-tech', 'varc-parajumbles', 'varc-para-summary'],
      goals: [
        'Take full 40-minute VARC Sectional Test under strict timer',
        'Target: Attempt at least 16-18 questions with >= 80% accuracy',
        'Spend 60 minutes analyzing missed questions and identifying passage trap types',
      ],
      practiceTarget: '1 Full VARC Sectional (24 Qs) + In-depth Error Analysis',
      testScheduled: {
        type: 'SECTIONAL_MOCK',
        name: 'Sectional Mock 1: VARC Standard (40 Mins)',
        durationMinutes: 40,
        recommendedTime: 'Morning 10:00 AM',
      },
      keyTips: ['Allocate 8-9 minutes per RC passage. If a question takes >90 seconds, mark and move.'],
    },
    {
      dayNumber: 7,
      phase: 1,
      phaseTitle: 'Phase 1: Foundation & High-Weightage Core',
      title: 'QA: Time, Speed & Distance (TSD) + VARC: Para Summary',
      focusSection: 'QA',
      primaryTopics: ['qa-tsd', 'varc-para-summary'],
      goals: [
        'Master relative speed formulas for trains and linear races',
        'Solve 5 boat & stream problems (upstream vs downstream)',
        'Practice 8 Para Summary questions with option elimination logic',
      ],
      practiceTarget: isWeak('qa-tsd') ? '35 TSD Problems + 8 Para Summaries' : '25 TSD Problems + 6 Para Summaries',
      testScheduled: {
        type: 'DAILY_DRILL',
        name: 'Day 7 Drill: TSD Rel Speed & Summary',
        durationMinutes: 20,
        recommendedTime: 'Evening',
      },
      keyTips: ['In Para Summary, eliminate options that add outside information or use extreme modifiers.'],
    },
    {
      dayNumber: 8,
      phase: 1,
      phaseTitle: 'Phase 1: Foundation & High-Weightage Core',
      title: 'MILESTONE TEST: Full Mock 1 (Baseline Simulation) + Score Log',
      focusSection: 'ALL',
      primaryTopics: ['All Sections', 'Stamina Testing', 'Time Division'],
      goals: [
        'Simulate full 2-hour CAT exam environment (40m VARC + 40m DILR + 40m QA)',
        'Log complete sectional scores and percentile in the Mock Tracker',
        'Categorize all mistakes in the Error Log (Silly vs Conceptual)',
      ],
      practiceTarget: 'Full Mock 1 (66 Qs) + 2 Hours Post-Mock Analysis',
      testScheduled: {
        type: 'FULL_MOCK',
        name: 'Full Mock 1: Comprehensive Baseline (120 Mins)',
        durationMinutes: 120,
        recommendedTime: '10:00 AM - 12:00 PM',
      },
      keyTips: ['Never pause a mock. The mental fatigue in QA after 80 minutes of VARC/DILR is what you are training for.'],
    },
    {
      dayNumber: 9,
      phase: 1,
      phaseTitle: 'Phase 1: Foundation & High-Weightage Core',
      title: 'QA: TSD (Circular Tracks & Escalators) + DILR: Matrix Puzzles',
      focusSection: 'QA',
      primaryTopics: ['qa-tsd', 'dilr-arrangements'],
      goals: [
        'Circular tracks meeting points and lap times formulas',
        'Escalators step-counting and relative movement problems',
        'Complex 3-parameter matrix grid matching in DILR',
      ],
      practiceTarget: '20 TSD Advanced problems + 3 DILR Matrix Sets',
      testScheduled: {
        type: 'DAILY_DRILL',
        name: 'Day 9 Drill: Circular Tracks & Matrix',
        durationMinutes: 25,
        recommendedTime: 'Evening',
      },
      keyTips: ['Treat escalators as: Total Steps = (Walking Speed ± Escalator Speed) * Time.'],
    },
    {
      dayNumber: 10,
      phase: 1,
      phaseTitle: 'Phase 1: Foundation & High-Weightage Core',
      title: 'QA: Linear & Quadratic Equations + VARC: Science/Tech RC',
      focusSection: 'QA',
      primaryTopics: ['qa-linear-quad', 'varc-rc-science-tech'],
      goals: [
        'Vieta relations between roots and coefficients for polynomials',
        'Sign of discriminant D and nature of real/imaginary roots',
        'Read 2 scientific papers / evolutionary biology articles',
      ],
      practiceTarget: '30 Quadratic problems + 2 Science RC Passages',
      testScheduled: {
        type: 'DAILY_DRILL',
        name: 'Day 10 Drill: Algebra Roots & Science RC',
        durationMinutes: 20,
        recommendedTime: 'Night',
      },
      keyTips: ['Look for root conditions: if roots are positive, D >= 0, Sum > 0, Product > 0.'],
    },
    {
      dayNumber: 11,
      phase: 1,
      phaseTitle: 'Phase 1: Foundation & High-Weightage Core',
      title: 'QA: Polynomials & Vieta Rules + DILR: Games & Tournaments',
      focusSection: 'DILR',
      primaryTopics: ['qa-linear-quad', 'dilr-games-tournaments'],
      goals: [
        'Understand round-robin tournament points table deduction',
        'Knockout tournament seeding matchups (Seed k plays Seed 2^m + 1 - k)',
        'Polynomial division algorithm and remainder theorem',
      ],
      practiceTarget: isWeak('dilr-games-tournaments') ? '4 DILR Tournament Sets + 15 Algebra Qs' : '3 DILR Sets + 15 Algebra Qs',
      testScheduled: {
        type: 'DAILY_DRILL',
        name: 'Day 11 Drill: Tournaments & Polynomials',
        durationMinutes: 30,
        recommendedTime: 'Evening',
      },
      keyTips: ['Games & Tournaments is guaranteed in CAT DILR—master the seeding table!'],
    },
    {
      dayNumber: 12,
      phase: 1,
      phaseTitle: 'Phase 1: Foundation & High-Weightage Core',
      title: 'WEEK 2 TEST: Sectional Test 2 (DILR) + Set Selection Audit',
      focusSection: 'DILR',
      primaryTopics: ['dilr-arrangements', 'dilr-games-tournaments', 'dilr-charts-graphs'],
      goals: [
        'Take 40-minute DILR Sectional under timer (4 sets of 5 questions)',
        'Practice the Golden 4-Minute Rule: Scan all sets first, rank easiest to hardest',
        'Target: Complete 2 full sets with 100% accuracy = 30 marks (~95%ile in DILR!)',
      ],
      practiceTarget: '1 Full DILR Sectional (20 Qs) + Detailed Set Breakdown',
      testScheduled: {
        type: 'SECTIONAL_MOCK',
        name: 'Sectional Mock 2: DILR Pressure Drill (40 Mins)',
        durationMinutes: 40,
        recommendedTime: 'Morning 11:00 AM',
      },
      keyTips: ['Never spend more than 12 minutes on a set if no progress is made. Bail early.'],
    },
    {
      dayNumber: 13,
      phase: 1,
      phaseTitle: 'Phase 1: Foundation & High-Weightage Core',
      title: 'QA: Inequalities & Modulus + VARC: Odd Sentence Out',
      focusSection: 'QA',
      primaryTopics: ['qa-inequalities-logs', 'varc-odd-one-out'],
      goals: [
        'Wavy curve method (sign scheme) for rational inequalities',
        'Modulus equation graphs and distance interpretation |x - a| + |x - b|',
        'Solve 10 Odd Sentence Out questions',
      ],
      practiceTarget: '25 QA Inequalities + 10 Odd Sentence Out',
      testScheduled: {
        type: 'DAILY_DRILL',
        name: 'Day 13 Drill: Inequalities & Odd One Out',
        durationMinutes: 20,
        recommendedTime: 'Evening',
      },
      keyTips: ['The minimum value of |x - a| + |x - b| occurs everywhere between a and b, and equals |b - a|.'],
    },
    {
      dayNumber: 14,
      phase: 1,
      phaseTitle: 'Phase 1: Foundation & High-Weightage Core',
      title: 'QA: Logarithms & Indices + DILR: Venn Diagrams (3 Sets)',
      focusSection: 'QA',
      primaryTopics: ['qa-inequalities-logs', 'dilr-venn-diagrams'],
      goals: [
        'Master change of base: log_b(a) * log_c(b) = log_c(a)',
        'Characteristic and mantissa of logarithms to count digits',
        '3-set Venn maximization and minimization problems',
      ],
      practiceTarget: '25 Logarithms problems + 3 DILR Venn Sets',
      testScheduled: {
        type: 'DAILY_DRILL',
        name: 'Day 14 Drill: Logs & Venn Diagrams',
        durationMinutes: 25,
        recommendedTime: 'Night',
      },
      keyTips: ['Check domain constraints for logarithms first before solving! Base > 0, Base != 1, Argument > 0.'],
    },
    {
      dayNumber: 15,
      phase: 1,
      phaseTitle: 'Phase 1: Foundation & High-Weightage Core',
      title: 'MID-PHASE TEST: Full Mock 2 + Negative Marking Reduction',
      focusSection: 'ALL',
      primaryTopics: ['All Sections', 'Negative Mark Audit', 'Strategy Refinement'],
      goals: [
        'Take Full Mock 2 in an unfamiliar or quiet study space',
        'Track "Unforced Errors" in Mock Tracker: questions where you guessed impulsively',
        'Verify if raw score increased from Mock 1',
      ],
      practiceTarget: 'Full Mock 2 (66 Qs) + 2.5 Hours Exhaustive Analysis',
      testScheduled: {
        type: 'FULL_MOCK',
        name: 'Full Mock 2: Standard CAT Simulation (120 Mins)',
        durationMinutes: 120,
        recommendedTime: '2:00 PM - 4:00 PM',
      },
      keyTips: ['In CAT, each wrong MCQ is -1 mark AND costs ~1.5 minutes. Skipping a doubtful question is a net gain.'],
    },
    {
      dayNumber: 16,
      phase: 1,
      phaseTitle: 'Phase 1: Foundation & High-Weightage Core',
      title: 'QA: Sequences, Series & Progressions + VARC: Economics RC',
      focusSection: 'QA',
      primaryTopics: ['qa-sequences-functions', 'varc-rc-economy-business'],
      goals: [
        'AP and GP nth terms, sums, and infinite GP convergence S = a / (1 - r)',
        'Arithmetico-Geometric Progressions (AGP) and telescoping series',
        'Read 2 economic policy editorials (The Economist / Project Syndicate)',
      ],
      practiceTarget: '25 QA Series problems + 2 Economics RC Passages',
      testScheduled: {
        type: 'DAILY_DRILL',
        name: 'Day 16 Drill: AP/GP Series & Econ RC',
        durationMinutes: 20,
        recommendedTime: 'Evening',
      },
      keyTips: ['Look for telescoping series where adjacent terms cancel: 1/(n(n+1)) = 1/n - 1/(n+1).'],
    },
    {
      dayNumber: 17,
      phase: 1,
      phaseTitle: 'Phase 1: Foundation & High-Weightage Core',
      title: 'QA: Geometry Triangles & Polygons + DILR: Bar/Line Charts',
      focusSection: 'QA',
      primaryTopics: ['qa-geometry-triangles', 'dilr-charts-graphs'],
      goals: [
        'Centroid, Incenter, Circumcenter and Orthocenter key properties',
        'Apollonius theorem for median lengths',
        'Rapid percentage growth calculations without full long division',
      ],
      practiceTarget: isWeak('qa-geometry-triangles') ? '30 Geometry problems + 3 DI Sets' : '20 Geometry problems + 3 DI Sets',
      testScheduled: {
        type: 'DAILY_DRILL',
        name: 'Day 17 Drill: Geometry Triangles & DI Speed',
        durationMinutes: 25,
        recommendedTime: 'Evening',
      },
      keyTips: ['Area of triangle = r * s = (abc)/(4R). In a right triangle, inradius r = (a + b - c) / 2.'],
    },
    {
      dayNumber: 18,
      phase: 1,
      phaseTitle: 'Phase 1: Foundation & High-Weightage Core',
      title: 'WEEK 3 TEST: Sectional Test 3 (QA) + Phase 1 Audit',
      focusSection: 'QA',
      primaryTopics: ['qa-percentages', 'qa-tsd', 'qa-time-work', 'qa-linear-quad', 'qa-geometry-triangles'],
      goals: [
        'Take 40-minute QA Sectional Test (22 questions)',
        'Target: Complete Round 1 (easy questions) in 25 mins, Round 2 in 15 mins',
        'Target: 10-12 correct questions = 30-36 marks (~95%ile in QA)',
        'Check Phase 1 syllabus coverage across all sections',
      ],
      practiceTarget: '1 Full QA Sectional (22 Qs) + Phase 1 Checklist Audit',
      testScheduled: {
        type: 'SECTIONAL_MOCK',
        name: 'Sectional Mock 3: QA Core Speed (40 Mins)',
        durationMinutes: 40,
        recommendedTime: 'Morning 10:00 AM',
      },
      keyTips: ['Round 1: Glance and solve only 1-minute arithmetic/algebra problems. Round 2: Tackle moderate geometry/equations.'],
    },

    // ==========================================
    // PHASE 2: DAYS 19 - 32: SPEED, SECTIONAL MASTERY & HARD PROBLEM SELECTION
    // ==========================================
    {
      dayNumber: 19,
      phase: 2,
      phaseTitle: 'Phase 2: Speed, Accuracy & Sectional Mastery',
      title: 'QA: Circles & Tangents + VARC: Art & History RC',
      focusSection: 'QA',
      primaryTopics: ['qa-circles-mensuration', 'varc-rc-art-history'],
      goals: [
        'Intersecting chords theorem and tangent-secant theorem (PT² = PA * PB)',
        'Alternate segment theorem and cyclic quadrilaterals',
        'Handle subjective, artistic and historical passage tone questions',
      ],
      practiceTarget: '25 Circle problems + 2 Art/History Passages',
      testScheduled: {
        type: 'DAILY_DRILL',
        name: 'Day 19 Drill: Circles & Art RC',
        durationMinutes: 20,
        recommendedTime: 'Evening',
      },
      keyTips: ['For cyclic quadrilateral, opposite angles sum to 180°, and Ptolemy theorem applies: AC*BD = AB*CD + BC*AD.'],
    },
    {
      dayNumber: 20,
      phase: 2,
      phaseTitle: 'Phase 2: Speed, Accuracy & Sectional Mastery',
      title: 'QA: Coordinate Geometry & Mensuration + DILR: Knockout Tournaments',
      focusSection: 'DILR',
      primaryTopics: ['qa-circles-mensuration', 'dilr-games-tournaments'],
      goals: [
        'Distance between parallel lines, point to line distance formula',
        'Frustum of cone, prism and pyramid surface areas and volumes',
        'Knockout tournament upsets and seeded bracket analysis',
      ],
      practiceTarget: '20 Coordinate/Mensuration Qs + 3 Knockout Sets',
      testScheduled: {
        type: 'DAILY_DRILL',
        name: 'Day 20 Drill: Mensuration & Tournaments',
        durationMinutes: 25,
        recommendedTime: 'Evening',
      },
      keyTips: ['In knockout with 64 players: total matches = 63. Number of matches to reach final = 6.'],
    },
    {
      dayNumber: 21,
      phase: 2,
      phaseTitle: 'Phase 2: Speed, Accuracy & Sectional Mastery',
      title: 'QA: Number Systems (Remainders, Factors) + VARC: Inferences',
      focusSection: 'QA',
      primaryTopics: ['qa-number-systems', 'varc-rc-philosophy'],
      goals: [
        'Fermat Little Theorem: a^(p-1) ≡ 1 (mod p)',
        'Euler Totient function and remainder computation',
        'Number of factors and sum of factors formulas',
        'Practice identifying unstated assumptions in RC questions',
      ],
      practiceTarget: '25 Number Systems problems + 2 Advanced RC Passages',
      testScheduled: {
        type: 'DAILY_DRILL',
        name: 'Day 21 Drill: Number Systems & Inferences',
        durationMinutes: 25,
        recommendedTime: 'Night',
      },
      keyTips: ['Power of prime p in n! = floor(n/p) + floor(n/p²) + floor(n/p³) + ... (Legendre formula).'],
    },
    {
      dayNumber: 22,
      phase: 2,
      phaseTitle: 'Phase 2: Speed, Accuracy & Sectional Mastery',
      title: 'WEEK 4 TEST: Full Mock 3 + Strict Error Categorization',
      focusSection: 'ALL',
      primaryTopics: ['All Sections', 'Speed vs Accuracy', 'Error Log Update'],
      goals: [
        'Take Full Mock 3 adhering to strict slot time (e.g. Slot 1 8:30 AM or Slot 2 12:30 PM)',
        'Enter scores into Mock Tracker and review updated percentile projection',
        'Fill at least 5 entries in the Error Log notebook',
      ],
      practiceTarget: 'Full Mock 3 (66 Qs) + 2.5 Hours Sectional Review',
      testScheduled: {
        type: 'FULL_MOCK',
        name: 'Full Mock 3: Proctored Slot Simulation (120 Mins)',
        durationMinutes: 120,
        recommendedTime: '8:30 AM - 10:30 AM',
      },
      keyTips: ['Check your time per correct question. In QA, a good pace is 2.5 mins per correct attempt.'],
    },
    {
      dayNumber: 23,
      phase: 2,
      phaseTitle: 'Phase 2: Speed, Accuracy & Sectional Mastery',
      title: 'QA: Permutations, Combinations & Probability + DILR: Routes',
      focusSection: 'QA',
      primaryTopics: ['qa-modern-math', 'dilr-routes-networks'],
      goals: [
        'Stars and bars formula (identical items into distinct groups): (n + r - 1) C (r - 1)',
        'Derangements formula D(n)',
        'Shortest paths on grids and pipeline flow networks in DILR',
      ],
      practiceTarget: isWeak('qa-modern-math') ? '30 P&C problems + 3 Network DILR sets' : '20 P&C problems + 3 Network DILR sets',
      testScheduled: {
        type: 'DAILY_DRILL',
        name: 'Day 23 Drill: Modern Math & Flow Networks',
        durationMinutes: 25,
        recommendedTime: 'Evening',
      },
      keyTips: ['Circular permutation of n distinct items = (n - 1)!. For necklace/garland = (n - 1)! / 2.'],
    },
    {
      dayNumber: 24,
      phase: 2,
      phaseTitle: 'Phase 2: Speed, Accuracy & Sectional Mastery',
      title: 'SECTIONAL DRILL: Sectional Test 4 (VARC) + Speed Calibration',
      focusSection: 'VARC',
      primaryTopics: ['varc-rc-philosophy', 'varc-rc-science-tech', 'varc-para-summary'],
      goals: [
        '40-minute VARC sectional under time pressure',
        'Strict strategy: 4 RCs in 30 minutes, 10 minutes for Verbal Ability',
        'Target: >= 38 marks in VARC',
      ],
      practiceTarget: '1 VARC Sectional (24 Qs) + Detailed Option Traps Review',
      testScheduled: {
        type: 'SECTIONAL_MOCK',
        name: 'Sectional Mock 4: VARC High-Speed Drill (40 Mins)',
        durationMinutes: 40,
        recommendedTime: 'Morning 10:00 AM',
      },
      keyTips: ['Read the first sentence of every paragraph of an RC to get the roadmap before diving into deep reading.'],
    },
    {
      dayNumber: 25,
      phase: 2,
      phaseTitle: 'Phase 2: Speed, Accuracy & Sectional Mastery',
      title: 'QA: Probability & Conditional Logic + DILR: Spider/Radar Charts',
      focusSection: 'DILR',
      primaryTopics: ['qa-modern-math', 'dilr-scatter-radars'],
      goals: [
        'Conditional probability P(A|B) = P(A ∩ B) / P(B)',
        'Independent events and coin/dice toss distributions',
        'Interpreting multi-axis radar charts and scatter plots in DILR',
      ],
      practiceTarget: '20 Probability problems + 3 Radar/Scatter Sets',
      testScheduled: {
        type: 'DAILY_DRILL',
        name: 'Day 25 Drill: Probability & Radar Charts',
        durationMinutes: 25,
        recommendedTime: 'Evening',
      },
      keyTips: ['In scatter plots, slope of ray from origin represents ratio (y / x) - highly useful in CAT!'],
    },
    {
      dayNumber: 26,
      phase: 2,
      phaseTitle: 'Phase 2: Speed, Accuracy & Sectional Mastery',
      title: 'SECTIONAL DRILL: Sectional Test 5 (DILR) + Set Selection',
      focusSection: 'DILR',
      primaryTopics: ['dilr-arrangements', 'dilr-venn-diagrams', 'dilr-charts-graphs'],
      goals: [
        '40-minute DILR Sectional under timer',
        'Select the 2 best sets within 3 minutes; execute with zero calculation slips',
        'Target: >= 32 marks in DILR',
      ],
      practiceTarget: '1 DILR Sectional (20 Qs) + Set Difficulty Post-Mortem',
      testScheduled: {
        type: 'SECTIONAL_MOCK',
        name: 'Sectional Mock 5: DILR Set Selection (40 Mins)',
        durationMinutes: 40,
        recommendedTime: 'Morning 11:00 AM',
      },
      keyTips: ['If a set has 5 questions with long conditions, read the question stems first to see if partial deduction solves 2 questions!'],
    },
    {
      dayNumber: 27,
      phase: 2,
      phaseTitle: 'Phase 2: Speed, Accuracy & Sectional Mastery',
      title: 'WEEK 5 TEST: Full Mock 4 + Scaled Score Trajectory Check',
      focusSection: 'ALL',
      primaryTopics: ['All Sections', 'Score Trajectory', 'Target Percentile Comparison'],
      goals: [
        'Take Full Mock 4 with strict CAT conditions',
        'Compare accuracy against target percentile (Aim for >= 82% accuracy)',
        'Check time wasted on un-attempted or wrong questions',
      ],
      practiceTarget: 'Full Mock 4 (66 Qs) + Comprehensive 2.5-hour Review',
      testScheduled: {
        type: 'FULL_MOCK',
        name: 'Full Mock 4: Mid-Season Benchmark (120 Mins)',
        durationMinutes: 120,
        recommendedTime: '2:00 PM - 4:00 PM',
      },
      keyTips: ['Notice which 15 minutes of the test you feel lowest energy. Keep water and practice deep breathing.'],
    },
    {
      dayNumber: 28,
      phase: 2,
      phaseTitle: 'Phase 2: Speed, Accuracy & Sectional Mastery',
      title: 'SECTIONAL DRILL: Sectional Test 6 (QA) + Question Skipping Drill',
      focusSection: 'QA',
      primaryTopics: ['qa-percentages', 'qa-tsd', 'qa-linear-quad', 'qa-inequalities-logs'],
      goals: [
        '40-minute QA Sectional Test',
        'Ruthlessly skip any question that requires more than 3 steps on initial reading',
        'Target: Zero negative marks from hasty guesses',
      ],
      practiceTarget: '1 QA Sectional (22 Qs) + Formula Refresh',
      testScheduled: {
        type: 'SECTIONAL_MOCK',
        name: 'Sectional Mock 6: QA Ruthless Selection (40 Mins)',
        durationMinutes: 40,
        recommendedTime: 'Morning 10:00 AM',
      },
      keyTips: ['In CAT QA, answering 12 questions with 100% accuracy yields 36 marks (~95%ile). Quality > Quantity!'],
    },
    {
      dayNumber: 29,
      phase: 2,
      phaseTitle: 'Phase 2: Speed, Accuracy & Sectional Mastery',
      title: 'QA: High-Yield Mixed Arithmetic & Algebra Sprint',
      focusSection: 'QA',
      primaryTopics: ['qa-percentages', 'qa-tsd', 'qa-time-work', 'qa-linear-quad'],
      goals: [
        'Rapid 30-question sprint across past 5 years CAT Arithmetic & Algebra questions',
        'Measure average time per question (Target: < 2 minutes)',
        'Review on-screen calculator shortcuts',
      ],
      practiceTarget: '30 Mixed QA Past Paper Questions',
      testScheduled: {
        type: 'DAILY_DRILL',
        name: 'Day 29 Drill: QA Past Year Sprint',
        durationMinutes: 30,
        recommendedTime: 'Evening',
      },
      keyTips: ['Use CAT virtual calculator only for tedious decimals, never for basic mental arithmetic.'],
    },
    {
      dayNumber: 30,
      phase: 2,
      phaseTitle: 'Phase 2: Speed, Accuracy & Sectional Mastery',
      title: 'WEEK 6 TEST: Full Mock 5 + Section-wise Stamina Evaluation',
      focusSection: 'ALL',
      primaryTopics: ['All Sections', 'Stamina Audit', 'Sectional Balance'],
      goals: [
        'Simulate Full Mock 5 in actual CAT afternoon slot',
        'Log marks in dashboard and check skill matrix updates',
        'Ensure balanced performance (no section under 85%ile)',
      ],
      practiceTarget: 'Full Mock 5 (66 Qs) + Detailed Analysis',
      testScheduled: {
        type: 'FULL_MOCK',
        name: 'Full Mock 5: Afternoon Slot Simulation (120 Mins)',
        durationMinutes: 120,
        recommendedTime: '12:30 PM - 2:30 PM',
      },
      keyTips: ['Sectional cut-offs matter for top IIMs (usually ~80-85%ile per section). Do not abandon your weakest section.'],
    },
    {
      dayNumber: 31,
      phase: 2,
      phaseTitle: 'Phase 2: Speed, Accuracy & Sectional Mastery',
      title: 'DILR Hard Sets Workshop + VARC Tone Elimination',
      focusSection: 'DILR',
      primaryTopics: ['dilr-games-tournaments', 'dilr-arrangements', 'varc-rc-philosophy'],
      goals: [
        'Solve 4 advanced CAT DILR sets (2020-2024 actual exam sets)',
        'Differentiate author tones: Objective vs Cynical vs Sarcastic vs Eulogistic',
        'Master the art of abandoning dead ends in DILR within 6 minutes',
      ],
      practiceTarget: '4 Advanced DILR Sets + 3 Abstract RC Passages',
      testScheduled: {
        type: 'DAILY_DRILL',
        name: 'Day 31 Drill: CAT Level DILR & RC Tones',
        durationMinutes: 35,
        recommendedTime: 'Evening',
      },
      keyTips: ['If a set requires writing down >4 nested possibilities, look for a hidden mathematical constraint.'],
    },
    {
      dayNumber: 32,
      phase: 2,
      phaseTitle: 'Phase 2: Speed, Accuracy & Sectional Mastery',
      title: 'SECTIONAL MARATHON: Triple Sectional Drill in Sequence',
      focusSection: 'ALL',
      primaryTopics: ['VARC Sectional', 'DILR Sectional', 'QA Sectional'],
      goals: [
        'Complete VARC (40m) -> 10m break -> DILR (40m) -> 10m break -> QA (40m)',
        'Compare performance against standard continuous mocks',
        'Identify whether fatigue is the primary factor limiting QA scores',
      ],
      practiceTarget: '3 Back-to-Back Sectionals (66 Qs total)',
      testScheduled: {
        type: 'SECTIONAL_MOCK',
        name: 'Triple Sectional Challenge (120 Mins)',
        durationMinutes: 120,
        recommendedTime: 'Morning 9:00 AM',
      },
      keyTips: ['Hydrate during the 10 minute breaks. Stretch your neck and shoulders to reset mental focus.'],
    },

    // ==========================================
    // PHASE 3: DAYS 33 - 45: FULL-LENGTH WAR ROOM, ACCURACY LOCKING & PEAK PERFORMANCE
    // ==========================================
    {
      dayNumber: 33,
      phase: 3,
      phaseTitle: 'Phase 3: War Room & Peak Performance',
      title: 'FINAL SPRINT TEST: Full Mock 6 (Exact Slot Simulation)',
      focusSection: 'ALL',
      primaryTopics: ['All Sections', 'Pre-Mock Routine', 'Exam Strategy Lock'],
      goals: [
        'Take Full Mock 6 at your exact scheduled CAT exam time',
        'Eat the exact breakfast you plan to have on D-Day',
        'Target: Break your previous high score in at least 2 sections',
      ],
      practiceTarget: 'Full Mock 6 + 3-Hour Post-Mock Dissection',
      testScheduled: {
        type: 'FULL_MOCK',
        name: 'Full Mock 6: Exact Slot Simulation (120 Mins)',
        durationMinutes: 120,
        recommendedTime: 'Your CAT Slot Time',
      },
      keyTips: ['Treat every full mock from now on as the real exam. No distractions, no notifications, no interruptions.'],
    },
    {
      dayNumber: 34,
      phase: 3,
      phaseTitle: 'Phase 3: War Room & Peak Performance',
      title: 'Targeted Weak Spot Annihilation Drill (Adaptive Live Focus)',
      focusSection: 'QA',
      primaryTopics: weakTopicIds.length > 0 ? weakTopicIds.slice(0, 3) : ['qa-inequalities-logs', 'qa-geometry-triangles'],
      goals: [
        'Dedicate 4 solid hours exclusively to your lowest-scoring topics from Mock 6',
        'Solve 40 targeted practice questions in those exact weak areas',
        'Update skill matrix to turn Weak tags into Moderate',
      ],
      practiceTarget: '40 Targeted Weak-Topic Questions + Formula Revision',
      testScheduled: {
        type: 'REVISION_DRILL',
        name: 'Day 34 Weakness Blitz Drill',
        durationMinutes: 30,
        recommendedTime: 'Evening 6:00 PM',
      },
      keyTips: ['You do not need to master 100% of hard topics; you only need to recognize and solve the easy 40% of them.'],
    },
    {
      dayNumber: 35,
      phase: 3,
      phaseTitle: 'Phase 3: War Room & Peak Performance',
      title: 'FULL MOCK 7: Negative Marking Prevention Drill',
      focusSection: 'ALL',
      primaryTopics: ['All Sections', 'Zero Unforced Guessing', 'High Accuracy'],
      goals: [
        'Target: Achieve > 85% overall test accuracy across all sections',
        'Cap unattempted doubts: do not gamble on 50-50 options',
        'Log scaled score and evaluate percentile stability',
      ],
      practiceTarget: 'Full Mock 7 (66 Qs) + Error Analysis',
      testScheduled: {
        type: 'FULL_MOCK',
        name: 'Full Mock 7: High-Accuracy Focus (120 Mins)',
        durationMinutes: 120,
        recommendedTime: 'Slot Time',
      },
      keyTips: ['In CAT, 35 correct answers with 3 wrong = 102 marks (~99.7%ile!). Accuracy is your ultimate superpower.'],
    },
    {
      dayNumber: 36,
      phase: 3,
      phaseTitle: 'Phase 3: War Room & Peak Performance',
      title: 'VARC 4-RC Timed Marathon + DILR Set Selection Audit',
      focusSection: 'VARC',
      primaryTopics: ['varc-rc-philosophy', 'varc-rc-science-tech', 'varc-rc-economy-business', 'varc-rc-art-history'],
      goals: [
        'Solve 4 authentic CAT Reading Comprehension passages under 32-minute clock',
        'Check accuracy on main idea questions vs detail questions',
        'Review 50 flashcards of key CAT vocabulary and tone definitions',
      ],
      practiceTarget: '4 Timed RC Passages (16 Qs) + 2 DILR Sets',
      testScheduled: {
        type: 'DAILY_DRILL',
        name: 'Day 36 Drill: 4-RC Timed Blitz',
        durationMinutes: 35,
        recommendedTime: 'Morning 9:00 AM',
      },
      keyTips: ['In RC, always verify whether an option is true in general life vs true ACCORDING TO THE PASSAGE.'],
    },
    {
      dayNumber: 37,
      phase: 3,
      phaseTitle: 'Phase 3: War Room & Peak Performance',
      title: 'FULL MOCK 8: Speed Optimization & Pressure Drill',
      focusSection: 'ALL',
      primaryTopics: ['All Sections', 'Pressure Handling', 'Score Maximization'],
      goals: [
        'Take Full Mock 8 in a slightly noisy or challenging setting (simulates real exam hall)',
        'Maintain composure if Section 1 feels unusually difficult (CAT 2023 VARC was tough for everyone!)',
        'Log results and update percentile trends',
      ],
      practiceTarget: 'Full Mock 8 (66 Qs) + 2 Hours Post-Mortem',
      testScheduled: {
        type: 'FULL_MOCK',
        name: 'Full Mock 8: Stress Resistance (120 Mins)',
        durationMinutes: 120,
        recommendedTime: 'Slot Time',
      },
      keyTips: ['If a section feels brutal, remember the percentile normalizer: tough papers mean lower cutoff marks!'],
    },
    {
      dayNumber: 38,
      phase: 3,
      phaseTitle: 'Phase 3: War Room & Peak Performance',
      title: 'QA Speed & Shortcuts Workshop + Formula Sheet Mastery',
      focusSection: 'QA',
      primaryTopics: ['qa-percentages', 'qa-tsd', 'qa-geometry-triangles', 'qa-inequalities-logs'],
      goals: [
        'Memorize all 24 formulas in the built-in CAT Formula Sheet',
        'Practice mental calculations (squares up to 30, cubes up to 15, powers of 2 up to 10)',
        'Speed test on 20 QA questions with 1.5 min per question timer',
      ],
      practiceTarget: '20 Speed QA Questions + Complete Formula Revision',
      testScheduled: {
        type: 'REVISION_DRILL',
        name: 'Day 38 Formula & Mental Math Blitz',
        durationMinutes: 25,
        recommendedTime: 'Evening',
      },
      keyTips: ['Squaring numbers ending in 5: for 75², 7 * 8 = 56, append 25 -> 5625. Use mental shortcuts!'],
    },
    {
      dayNumber: 39,
      phase: 3,
      phaseTitle: 'Phase 3: War Room & Peak Performance',
      title: 'PENULTIMATE TEST: Full Mock 9 (High-Confidence Run)',
      focusSection: 'ALL',
      primaryTopics: ['All Sections', 'Peak Accuracy', 'Strategy Consistency'],
      goals: [
        'Execute your standardized exam protocol: question selection, round 1, round 2',
        'Verify if total score meets your target IIM threshold',
        'Celebrate high-yield strengths and lock your test strategy permanently',
      ],
      practiceTarget: 'Full Mock 9 (66 Qs) + Error Review',
      testScheduled: {
        type: 'FULL_MOCK',
        name: 'Full Mock 9: Standardized Execution (120 Mins)',
        durationMinutes: 120,
        recommendedTime: 'Slot Time',
      },
      keyTips: ['Do not change your test-taking strategy now. Stick to the approach that worked in Mocks 5-8.'],
    },
    {
      dayNumber: 40,
      phase: 3,
      phaseTitle: 'Phase 3: War Room & Peak Performance',
      title: 'DILR Masterclass (Missing Data & Complex Logic)',
      focusSection: 'DILR',
      primaryTopics: ['dilr-charts-graphs', 'dilr-arrangements', 'dilr-venn-diagrams'],
      goals: [
        'Solve 3 missing data tables and multi-variable scheduling puzzles',
        'Calibrate internal clock: know instinctively when 8 minutes have passed on a set',
        'Review DILR error log entries from past 40 days',
      ],
      practiceTarget: '3 High-Difficulty DILR Sets + Error Notebook Review',
      testScheduled: {
        type: 'DAILY_DRILL',
        name: 'Day 40 Drill: DILR Tough Sets Mastery',
        durationMinutes: 30,
        recommendedTime: 'Evening',
      },
      keyTips: ['In missing data tables, find row or column sums that constrain values to only 1 or 2 options.'],
    },
    {
      dayNumber: 41,
      phase: 3,
      phaseTitle: 'Phase 3: War Room & Peak Performance',
      title: 'THE FINAL TEST: Full Mock 10 (Last Comprehensive Mock)',
      focusSection: 'ALL',
      primaryTopics: ['All Sections', 'Final Simulation', 'Confidence Capstone'],
      goals: [
        'Final full-length mock simulation before CAT',
        'No heavy mocks after today to prevent mental burnout',
        'Enter final mock score and review the complete 45-day trajectory',
      ],
      practiceTarget: 'Full Mock 10 (66 Qs) + Celebrate 45-Day Discipline!',
      testScheduled: {
        type: 'FULL_MOCK',
        name: 'Full Mock 10: Final Dress Rehearsal (120 Mins)',
        durationMinutes: 120,
        recommendedTime: 'Slot Time',
      },
      keyTips: ['Whatever the score today, trust your preparation. 40 days of consistent work cannot be undone by one mock.'],
    },
    {
      dayNumber: 42,
      phase: 3,
      phaseTitle: 'Phase 3: War Room & Peak Performance',
      title: 'Master Error Notebook & Formula Deep Revision',
      focusSection: 'ALL',
      primaryTopics: ['Complete Error Log', 'All QA Formulas', 'DILR Quick Approaches'],
      goals: [
        'Read through every single error logged over the 45 days',
        'Confirm you will never repeat those specific calculation or trap errors',
        'Test yourself on the Formula Sheet',
      ],
      practiceTarget: 'Review All Error Log Items + 1 Lightweight Topic Test',
      testScheduled: {
        type: 'REVISION_DRILL',
        name: 'Day 42 Error Log Mastery Drill',
        durationMinutes: 20,
        recommendedTime: 'Afternoon',
      },
      keyTips: ['The aspirant who makes the fewest unforced errors gets the top 99.5 percentile.'],
    },
    {
      dayNumber: 43,
      phase: 3,
      phaseTitle: 'Phase 3: War Room & Peak Performance',
      title: 'Lightweight Sectional Booster + TITA Strategy Review',
      focusSection: 'ALL',
      primaryTopics: ['TITA Questions', 'Rapid Scanning', 'Confidence Building'],
      goals: [
        'Solve 15 easy-moderate questions strictly to boost confidence and feel rhythm',
        'Reiterate TITA (Type-In-The-Answer) rules: no negative marking, double-check spelling/digits',
        'Get a solid 8 hours of sleep',
      ],
      practiceTarget: '15 Confidence-Building Easy Questions',
      testScheduled: {
        type: 'SECTIONAL_MOCK',
        name: 'Confidence Booster Drill (30 Mins)',
        durationMinutes: 30,
        recommendedTime: 'Morning',
      },
      keyTips: ['Keep study hours light today (<3 hours). Your brain needs recovery for optimal neuro-plastic speed.'],
    },
    {
      dayNumber: 44,
      phase: 3,
      phaseTitle: 'Phase 3: War Room & Peak Performance',
      title: 'Exam Logistics, Slot Routine & Mental Conditioning',
      focusSection: 'ALL',
      primaryTopics: ['Admit Card Check', 'Exam Center Route', 'Sleep & Mindset'],
      goals: [
        'Print 2 copies of CAT Admit Card with affixed photographs',
        'Check original ID card (Aadhaar / Passport / Voter ID)',
        'Map commute to test center, account for traffic and arrival 90 mins prior',
        'No heavy problem solving—just browse formulas for 1 hour',
      ],
      practiceTarget: '1 Hour Formula Glance + Logistics Checklist',
      keyTips: ['No mock tests today. Protect your emotional and nervous energy. You are ready.'],
    },
    {
      dayNumber: 45,
      phase: 3,
      phaseTitle: 'Phase 3: War Room & Peak Performance',
      title: 'CAT D-DAY: Execute with Cold Precision & Confidence!',
      focusSection: 'ALL',
      primaryTopics: ['Final Victory Protocol', 'Stay Calm', 'Crush the Exam'],
      goals: [
        'Arrive at test center relaxed and early',
        'Section 1 VARC (40 mins): Read calmly, do not rush the first passage',
        'Section 2 DILR (40 mins): Golden 4-minute selection, execute 2 full sets cleanly',
        'Section 3 QA (40 mins): Round 1 arithmetic speed, Round 2 algebra/geometry',
        'Walk out proud knowing you executed a world-class 45-day preparation!',
      ],
      practiceTarget: 'THE ACTUAL CAT EXAM! 🎯🏆',
      keyTips: ['One question at a time. The past question does not exist. Focus 100% on the screen in front of you!'],
    },
  ];

  return rawDays.map((d) => ({
    ...d,
    isCompleted: false,
    isToday: d.dayNumber === 1,
  }));
}

/**
 * Pre-seeded mock templates representing popular CAT mock series (AIMCAT, SimCAT, Cracku, CL)
 */
export const SAMPLE_MOCKS = [
  {
    name: 'SimCAT 1 (All India Open)',
    type: 'Full Mock' as const,
    date: '2026-09-10',
    varcScore: 32,
    dilrScore: 21,
    qaScore: 27,
    totalScore: 80,
    maxScore: 198,
    percentile: 98.4,
    accuracy: 82,
    timeTakenMinutes: 120,
    analysisNotes: 'Strong VARC; slipped in DILR 2nd set calculation; QA arithmetic was solid.',
    mistakesSummary: {
      conceptual: 2,
      sillyMistake: 3,
      timeManagement: 1,
      unforcedGuess: 1,
    }
  },
  {
    name: 'AIMCAT 2502 (National Mock)',
    type: 'Full Mock' as const,
    date: '2026-09-18',
    varcScore: 28,
    dilrScore: 27,
    qaScore: 33,
    totalScore: 88,
    maxScore: 198,
    percentile: 99.1,
    accuracy: 86,
    timeTakenMinutes: 120,
    analysisNotes: 'Exceptional QA round 1. DILR tournament set was fully cracked. VARC tone traps cost 2 questions.',
    mistakesSummary: {
      conceptual: 1,
      sillyMistake: 2,
      timeManagement: 2,
      unforcedGuess: 0,
    }
  }
];

export interface DailyMotivationBriefing {
  dayNumber: number;
  daysRemaining: number;
  greeting: string;
  focusSummary: string;
  actionItems: string[];
  keyWarning?: string;
  quote: string;
}

export function generateDailyBriefing(
  userName: string = 'Aspirant',
  currentDayNum: number = 1,
  roadmap: RoadmapDay[] = [],
  weakTopicNames: string[] = []
): DailyMotivationBriefing {
  const dayData = roadmap.find((d) => d.dayNumber === currentDayNum) || roadmap[0];
  const daysRemaining = Math.max(0, 45 - currentDayNum);
  const firstName = userName.split(' ')[0] || 'Aspirant';

  const motivationalQuotes = [
    'Small daily improvements over time lead to stunning CAT percentiles.',
    'Champions do not rely on luck; they rely on calibrated mock strategy.',
    'Accuracy over speed. Every +3 without a negative is pure percentile gold.',
    'You do not need to solve all questions; you only need to pick the right ones.',
    '45 days of focused discipline can rewrite your business school trajectory.'
  ];
  const quote = motivationalQuotes[(currentDayNum - 1) % motivationalQuotes.length];

  let focusSummary = '';
  if (dayData?.testScheduled?.type === 'FULL_MOCK') {
    focusSummary = `Today is a big mock day: ${dayData.testScheduled.name}. Treat this like the actual CAT exam hall—stay calm and focus on question selection.`;
  } else if (dayData?.testScheduled?.type === 'SECTIONAL_MOCK') {
    focusSummary = `Today features a 40-minute ${dayData.focusSection} pressure sectional. Aim for steady pacing and zero negative guesses.`;
  } else {
    focusSummary = `Focus area today is ${dayData?.title || 'Core Syllabus Modules'}. Target: ${dayData?.practiceTarget || '25 practice questions'}.`;
  }

  const actionItems: string[] = [];
  if (dayData?.goals && dayData.goals.length > 0) {
    actionItems.push(dayData.goals[0]);
    if (dayData.goals.length > 1) {
      actionItems.push(dayData.goals[1]);
    }
  } else {
    actionItems.push('Review concept notes and complete your daily practice target.');
  }

  const keyWarning = weakTopicNames.length > 0
    ? `Keep an extra eye on: ${weakTopicNames.slice(0, 2).join(' & ')}.`
    : undefined;

  return {
    dayNumber: currentDayNum,
    daysRemaining,
    greeting: `Good day, ${firstName}!`,
    focusSummary,
    actionItems,
    keyWarning,
    quote,
  };
}

/**
 * Parses a 45-day roadmap day into bite-sized 30-minute actionable segments.
 * Makes large CAT preparation topics manageable and non-overwhelming for students.
 */
export function parseDayIntoSegments(
  day: RoadmapDay,
  completedSegmentIds: string[] = [],
  dailyHours: number = 3
): StudySegment[] {
  const isMockDay = day.testScheduled?.type === 'FULL_MOCK';
  const isSectionalDay = day.testScheduled?.type === 'SECTIONAL_MOCK';
  const dayNum = day.dayNumber;
  const primaryTopicId =
    day.primaryTopics.find((t) => t.startsWith('qa-') || t.startsWith('dilr-') || t.startsWith('varc-')) ||
    'qa-percentages';
  const defaultSection: CATSection = day.focusSection === 'ALL' ? 'QA' : day.focusSection;

  const segments: StudySegment[] = [];

  const isDone = (id: string) => completedSegmentIds.includes(id);

  if (isMockDay) {
    // 6 segments = 3 hours (Simulation + Review)
    segments.push(
      {
        id: `day-${dayNum}-seg-1`,
        slotNumber: 1,
        title: 'Pre-Mock Protocol & Mental Setup',
        task: 'Glance at top 10 formulas, organize water and blank scratch pads, review time checkpoints.',
        durationMinutes: 30,
        category: 'Concept Review',
        isCompleted: isDone(`day-${dayNum}-seg-1`),
        topicId: 'qa-percentages',
        topicName: 'Formula Vault & Strategy',
        section: 'QA',
      },
      {
        id: `day-${dayNum}-seg-2`,
        slotNumber: 2,
        title: 'Full Mock: Section 1 (VARC)',
        task: 'Execute 40-min VARC: read 4 passages, attempt easiest 3 first, tackle 4 VA questions.',
        durationMinutes: 30,
        category: 'Full Mock',
        isCompleted: isDone(`day-${dayNum}-seg-2`),
        topicId: 'varc-rc-philosophy',
        topicName: 'Reading Comprehension (VARC)',
        section: 'VARC',
      },
      {
        id: `day-${dayNum}-seg-3`,
        slotNumber: 3,
        title: 'Full Mock: Section 2 (DILR)',
        task: 'Execute 40-min DILR: Spend first 4 minutes scanning all 4 sets, solve the 2 highest-confidence sets completely.',
        durationMinutes: 30,
        category: 'Full Mock',
        isCompleted: isDone(`day-${dayNum}-seg-3`),
        topicId: 'dilr-arrangements',
        topicName: 'Logic Puzzles & Grids (DILR)',
        section: 'DILR',
      },
      {
        id: `day-${dayNum}-seg-4`,
        slotNumber: 4,
        title: 'Full Mock: Section 3 (QA)',
        task: 'Execute 40-min QA: Round 1 for quick 1-minute arithmetic wins, Round 2 for moderate algebra questions.',
        durationMinutes: 30,
        category: 'Full Mock',
        isCompleted: isDone(`day-${dayNum}-seg-4`),
        topicId: 'qa-percentages',
        topicName: 'Quant Problem Solving (QA)',
        section: 'QA',
      },
      {
        id: `day-${dayNum}-seg-5`,
        slotNumber: 5,
        title: 'Scorecard & Sectional Cutoff Check',
        task: 'Log total and sectional scores in the Mock Tracker; check normalized percentile trajectory.',
        durationMinutes: 30,
        category: 'Error Analysis',
        isCompleted: isDone(`day-${dayNum}-seg-5`),
        topicId: 'qa-percentages',
        topicName: 'Mock Percentile Analytics',
        section: 'QA',
      },
      {
        id: `day-${dayNum}-seg-6`,
        slotNumber: 6,
        title: 'Root-Cause Error Audit',
        task: 'Classify each incorrect question into Conceptual, Calculation, or Guessing; write correction rules in Error Notebook.',
        durationMinutes: 30,
        category: 'Error Analysis',
        isCompleted: isDone(`day-${dayNum}-seg-6`),
        topicId: 'qa-percentages',
        topicName: 'Error Log Consolidation',
        section: 'QA',
      }
    );
  } else if (isSectionalDay) {
    const sec = day.focusSection === 'ALL' ? 'QA' : day.focusSection;
    segments.push(
      {
        id: `day-${dayNum}-seg-1`,
        slotNumber: 1,
        title: `${day.focusSection} Speed Formula Review`,
        task: `Review short tricks and key theorems for ${day.focusSection} before taking the timed sectional test.`,
        durationMinutes: 30,
        category: 'Concept Review',
        isCompleted: isDone(`day-${dayNum}-seg-1`),
        topicId: primaryTopicId,
        topicName: `${day.focusSection} Review`,
        section: sec,
      },
      {
        id: `day-${dayNum}-seg-2`,
        slotNumber: 2,
        title: `Timed Sectional Mock: First Half`,
        task: `Start official 40-minute test. Strict pacing: aim for 50% attempts with 90%+ accuracy in first 20 minutes.`,
        durationMinutes: 30,
        category: 'Timed Test',
        isCompleted: isDone(`day-${dayNum}-seg-2`),
        topicId: primaryTopicId,
        topicName: `${day.focusSection} Sectional Drill`,
        section: sec,
      },
      {
        id: `day-${dayNum}-seg-3`,
        slotNumber: 3,
        title: `Timed Sectional Mock: Second Half & Finish`,
        task: `Wrap up remaining questions, answer TITA questions without hesitation, submit test.`,
        durationMinutes: 30,
        category: 'Timed Test',
        isCompleted: isDone(`day-${dayNum}-seg-3`),
        topicId: primaryTopicId,
        topicName: `${day.focusSection} Sectional Drill`,
        section: sec,
      },
      {
        id: `day-${dayNum}-seg-4`,
        slotNumber: 4,
        title: 'Untimed Re-attempt of Missed Questions',
        task: 'Re-solve questions you skipped or got wrong without the clock running to identify logic gaps.',
        durationMinutes: 30,
        category: 'Practice Drill',
        isCompleted: isDone(`day-${dayNum}-seg-4`),
        topicId: primaryTopicId,
        topicName: `${day.focusSection} Error Review`,
        section: sec,
      },
      {
        id: `day-${dayNum}-seg-5`,
        slotNumber: 5,
        title: 'Cross-Section Complementary Practice',
        task: 'Solve 1 RC passage or 1 reasoning puzzle set to maintain cross-sectional stamina.',
        durationMinutes: 30,
        category: 'Practice Drill',
        isCompleted: isDone(`day-${dayNum}-seg-5`),
        topicId: sec === 'VARC' ? 'dilr-arrangements' : 'varc-rc-philosophy',
        topicName: sec === 'VARC' ? 'DILR Puzzle Set' : 'VARC Reading Passage',
        section: sec === 'VARC' ? 'DILR' : 'VARC',
      },
      {
        id: `day-${dayNum}-seg-6`,
        slotNumber: 6,
        title: 'Update Error Log & Review Traps',
        task: 'Log the 2 most tricky options or traps encountered into your Error Notebook.',
        durationMinutes: 30,
        category: 'Error Analysis',
        isCompleted: isDone(`day-${dayNum}-seg-6`),
        topicId: primaryTopicId,
        topicName: 'Mistake Trap Logging',
        section: sec,
      }
    );
  } else {
    // Standard Day: 30-minute structured blocks
    const topicLabel = day.title.split('+')[0] || day.title;
    const secondaryTopic = day.title.split('+')[1] || 'Complementary Practice';
    const secondaryTopicId =
      day.primaryTopics[1] || (defaultSection === 'QA' ? 'varc-rc-philosophy' : 'qa-percentages');
    const secondarySection: CATSection = secondaryTopicId.startsWith('varc')
      ? 'VARC'
      : secondaryTopicId.startsWith('dilr')
      ? 'DILR'
      : 'QA';

    segments.push(
      {
        id: `day-${dayNum}-seg-1`,
        slotNumber: 1,
        title: 'Theory & Core Concept Revision',
        task: `Review formulas and fundamental principles for ${topicLabel}. Note down any new shortcuts.`,
        durationMinutes: 30,
        category: 'Concept Review',
        isCompleted: isDone(`day-${dayNum}-seg-1`),
        topicId: primaryTopicId,
        topicName: topicLabel.trim(),
        section: defaultSection,
      },
      {
        id: `day-${dayNum}-seg-2`,
        slotNumber: 2,
        title: 'Foundation Practice (Untimed)',
        task: `Solve 5 to 7 textbook-level questions step-by-step to solidify mechanical understanding.`,
        durationMinutes: 30,
        category: 'Practice Drill',
        isCompleted: isDone(`day-${dayNum}-seg-2`),
        topicId: primaryTopicId,
        topicName: topicLabel.trim(),
        section: defaultSection,
      },
      {
        id: `day-${dayNum}-seg-3`,
        slotNumber: 3,
        title: 'Speed & Trap-Prevention Drill',
        task: `Solve 8 moderate CAT-style questions setting an internal target of under 2 minutes per question.`,
        durationMinutes: 30,
        category: 'Practice Drill',
        isCompleted: isDone(`day-${dayNum}-seg-3`),
        topicId: primaryTopicId,
        topicName: topicLabel.trim(),
        section: defaultSection,
      },
      {
        id: `day-${dayNum}-seg-4`,
        slotNumber: 4,
        title: 'Daily Adaptive Booster Test',
        task: `Take today's 6-question Daily Test to upgrade your live syllabus topic mastery score.`,
        durationMinutes: 30,
        category: 'Timed Test',
        isCompleted: isDone(`day-${dayNum}-seg-4`),
        topicId: primaryTopicId,
        topicName: topicLabel.trim(),
        section: defaultSection,
      },
      {
        id: `day-${dayNum}-seg-5`,
        slotNumber: 5,
        title: `Cross-Module: ${secondaryTopic.trim()}`,
        task: `Complete practice target: ${day.practiceTarget.split('+')[1] || day.practiceTarget}`,
        durationMinutes: 30,
        category: 'Practice Drill',
        isCompleted: isDone(`day-${dayNum}-seg-5`),
        topicId: secondaryTopicId,
        topicName: secondaryTopic.trim(),
        section: secondarySection,
      },
      {
        id: `day-${dayNum}-seg-6`,
        slotNumber: 6,
        title: 'Day Wrap-up & Mistake Consolidation',
        task: 'Review any questions missed today, add takeaways to Error Notebook, and check off today’s roadmap day.',
        durationMinutes: 30,
        category: 'Error Analysis',
        isCompleted: isDone(`day-${dayNum}-seg-6`),
        topicId: primaryTopicId,
        topicName: topicLabel.trim(),
        section: defaultSection,
      }
    );
  }

  // If student bandwidth is 2 hours, cap at 4 segments; if 3+ hours, return 6 segments
  const maxSegments = dailyHours <= 2 ? 4 : 6;
  return segments.slice(0, maxSegments);
}


