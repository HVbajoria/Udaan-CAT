export interface FormulaCategory {
  title: string;
  section: 'QA' | 'DILR' | 'VARC';
  items: {
    name: string;
    formula: string;
    application: string;
    catTip: string;
  }[];
}

export const CAT_FORMULA_SHEET: FormulaCategory[] = [
  {
    title: 'Percentages & Profit/Loss',
    section: 'QA',
    items: [
      {
        name: 'Successive Percentage Change',
        formula: 'Net % = a + b + (ab / 100)',
        application: 'Use when a value is changed by a% and then further by b%.',
        catTip: 'If price increases by 25%, consumption must reduce by 20% to keep expenditure constant.'
      },
      {
        name: 'Faulty Weight / Dishonest Dealer',
        formula: 'Profit % = [ (Error) / (True Value - Error) ] * 100%',
        application: 'When trader uses 900g instead of 1000g: Error = 100g. Profit = (100 / 900) * 100 = 11.11%.',
        catTip: 'Combine with markup: Net Multiplier = (Marked Price / Cost Price) * (True Weight / Stated Weight).'
      },
      {
        name: 'CI - SI Difference for 2 & 3 Years',
        formula: '2 Years: D = P * (R/100)²  |  3 Years: D = P * (R/100)² * [ (300 + R) / 100 ]',
        application: 'Quickly find principal or interest rate when 2-year or 3-year CI-SI difference is given.',
        catTip: 'Directly saves 2 minutes in arithmetic questions.'
      }
    ]
  },
  {
    title: 'Time Speed Distance (TSD)',
    section: 'QA',
    items: [
      {
        name: 'After-Meeting Speed Ratio',
        formula: 'S₁ / S₂ = √(T₂ / T₁)',
        application: 'When two objects travel towards each other and take T₁ and T₂ hours after meeting to reach destinations.',
        catTip: 'Meeting time T = √(T₁ * T₂). Memorize this, appears often in CAT!'
      },
      {
        name: 'Circular Tracks First Meeting at Start Point',
        formula: 'Time = LCM ( L / S₁, L / S₂ )',
        application: 'Where L is track length and S₁, S₂ are speeds.',
        catTip: 'First meeting anywhere on track = L / (S₁ ± S₂) depending on same or opposite direction.'
      },
      {
        name: 'Escalator Formula',
        formula: 'Total Steps = (Speed of Person ± Speed of Escalator) * Time taken',
        application: 'Add speeds when walking in same direction as moving escalator; subtract when walking opposite.',
        catTip: 'Treat steps like distance and steps/sec like speed.'
      }
    ]
  },
  {
    title: 'Algebra & Equations',
    section: 'QA',
    items: [
      {
        name: 'Vieta Formulas (Cubic Equation)',
        formula: 'ax³ + bx² + cx + d = 0 => Σα = -b/a, Σαβ = c/a, αβγ = -d/a',
        application: 'Symmetric roots expressions like α² + β² + γ² = (Σα)² - 2(Σαβ).',
        catTip: 'For quadratic ax² + bx + c = 0: roots difference |α - β| = √D / |a|.'
      },
      {
        name: 'AM >= GM Inequality',
        formula: '(a₁ + a₂ + ... + aₙ) / n >= (a₁ * a₂ * ... * aₙ)^(1/n)',
        application: 'Finding minimum value of expressions like x + 1/x (min = 2 for x > 0) or x² + 16/x².',
        catTip: 'Equality holds if and only if all terms are equal.'
      },
      {
        name: 'Logarithm Base Change & Power Rule',
        formula: 'log_b(a) = log_c(a) / log_c(b)  and  a^(log_b c) = c^(log_b a)',
        application: 'Simplifying multi-base logarithmic chains.',
        catTip: 'Remember domain check: base > 0, base ≠ 1, argument > 0.'
      }
    ]
  },
  {
    title: 'Geometry & Mensuration',
    section: 'QA',
    items: [
      {
        name: 'Apollonius Theorem (Median Length)',
        formula: 'AB² + AC² = 2 * (AD² + BD²) where AD is the median to BC',
        application: 'Finds length of median when three sides are given.',
        catTip: 'Centroid divides each median in 2:1 ratio from vertex.'
      },
      {
        name: 'Inradius & Circumradius Formulas',
        formula: 'Inradius r = Area / Semi-perimeter = Δ / s  |  Circumradius R = (a * b * c) / (4 * Δ)',
        application: 'For right triangle: r = (a + b - c) / 2 and R = hypotenuse / 2.',
        catTip: 'Euler distance between incenter and circumcenter: d = √(R² - 2Rr).'
      },
      {
        name: 'Power of a Point (Circle Chords & Tangents)',
        formula: 'PA * PB = PC * PD (intersecting chords)  |  PT² = PA * PB (tangent PT and secant PAB)',
        application: 'Used in circle geometric intersections.',
        catTip: 'Applicable whether point P lies inside or outside the circle.'
      }
    ]
  },
  {
    title: 'Logical Reasoning & DI Frameworks',
    section: 'DILR',
    items: [
      {
        name: 'Round Robin Matches Calculation',
        formula: 'Total Matches = n * (n - 1) / 2 where n is number of teams',
        application: 'For 8 teams: 8 * 7 / 2 = 28 matches.',
        catTip: 'In knockout with n teams, total matches to decide winner is always n - 1.'
      },
      {
        name: '3-Set Venn Diagram Overlap Equation',
        formula: 'Total = n(A) + n(B) + n(C) - [Exactly 2] - 2*[All 3] + Neither',
        application: 'Rapidly find un-accounted regions without drawing messy circles.',
        catTip: 'Sum of components = Exactly 1 + 2*(Exactly 2) + 3*(All 3).'
      },
      {
        name: 'Binary Logic (Truth-Liar) Strategy',
        formula: 'Method: Assume one person is Truth-teller -> verify for contradictions.',
        application: 'In sets with Truth-tellers, Liars, and Alternators.',
        catTip: 'Look for contradictory statements: if A says "B is liar" and B says "A is liar", one is truth and one is liar!'
      }
    ]
  },
  {
    title: 'VARC Comprehension & Elimination Rules',
    section: 'VARC',
    items: [
      {
        name: 'The 4 Deadly RC Traps',
        formula: '1. Extreme Words (always, never, exclusively) | 2. Scope Distortion | 3. True but Irrelevant | 4. Opposite',
        application: 'Eliminate 3 wrong options rather than hunting the "perfect" answer.',
        catTip: 'CAT test-makers love options that quote verbatim text from the passage to answer a different question.'
      },
      {
        name: 'Para Jumble Mandatory Pairing',
        formula: 'Noun -> Pronoun | Acronym Introduction -> Acronym | Cause -> Effect | Chronology',
        application: 'Lock 2 sentences together first (e.g. BC), then find where BC fits with remaining sentences.',
        catTip: 'In TITA Para Jumbles, test pairs first before deciding the opener.'
      }
    ]
  }
];
