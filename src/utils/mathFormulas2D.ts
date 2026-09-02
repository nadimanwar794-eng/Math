import { Geometry2DParams } from '../types';

export interface Geometry2DResult {
  area: number;
  perimeter: number;
  diagonal1?: number;
  diagonal2?: number;
  altitude?: number;
  inradius?: number;
  circumradius?: number;
  angles?: number[];
  stepsHi: string[];
  stepsEn: string[];
  formulasHi: Record<string, string>;
  formulasEn: Record<string, string>;
  propertiesHi: string[];
  propertiesEn: string[];
}

export function calculateGeometry2D(params: Geometry2DParams): Geometry2DResult {
  const {
    type,
    sideA,
    sideB = sideA,
    sideC = sideA,
    sideD = sideB,
    diagonal1,
    diagonal2,
    angleDeg = 60,
    height,
  } = params;

  const PI = Math.PI;
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  switch (type) {
    case 'square': {
      // वर्ग (Square)
      const a = Math.max(0.1, sideA);
      const area = a * a;
      const perimeter = 4 * a;
      const d = a * Math.SQRT2;
      const inradius = a / 2;
      const circumradius = (a * Math.SQRT2) / 2;

      return {
        area,
        perimeter,
        diagonal1: d,
        diagonal2: d,
        inradius,
        circumradius,
        angles: [90, 90, 90, 90],
        stepsHi: [
          `भुजा (Side a) = ${a} सेमी`,
          `क्षेत्रफल (Area) = a² = ${a}² = ${area.toFixed(2)} वर्ग सेमी`,
          `परिमाप (Perimeter) = 4 × a = 4 × ${a} = ${perimeter.toFixed(2)} सेमी`,
          `विकर्ण (Diagonal d) = a × √2 = ${a} × 1.414 = ${d.toFixed(2)} सेमी`,
          `अंतःवृत्त की त्रिज्या (Inradius r) = a / 2 = ${(a / 2).toFixed(2)} सेमी`,
          `परिवृत्त की त्रिज्या (Circumradius R) = a / √2 = ${circumradius.toFixed(2)} सेमी`,
        ],
        stepsEn: [
          `Side (a) = ${a} cm`,
          `Area (A) = a² = ${a}² = ${area.toFixed(2)} cm²`,
          `Perimeter (P) = 4a = 4 × ${a} = ${perimeter.toFixed(2)} cm`,
          `Diagonal (d) = a√2 = ${a} × 1.414 = ${d.toFixed(2)} cm`,
          `Inradius (r) = a / 2 = ${(a / 2).toFixed(2)} cm`,
          `Circumradius (R) = a / √2 = ${circumradius.toFixed(2)} cm`,
        ],
        formulasHi: {
          'क्षेत्रफल (Area)': 'A = a² = (d²) / 2',
          'परिमाप (Perimeter)': 'P = 4 · a',
          'विकर्ण (Diagonal)': 'd = a · √2',
          'अंतःवृत्त त्रिज्या (r)': 'r = a / 2',
          'परिवृत्त त्रिज्या (R)': 'R = a / √2',
        },
        formulasEn: {
          'Area': 'A = a² = d² / 2',
          'Perimeter': 'P = 4a',
          'Diagonal': 'd = a√2',
          'Inradius': 'r = a / 2',
          'Circumradius': 'R = a / √2',
        },
        propertiesHi: [
          'सभी चारों भुजाएं बराबर और समानांतर होती हैं।',
          'प्रत्येक आंतरिक कोण 90° का होता है।',
          'दोनों विकर्ण बराबर होते हैं और एक-दूसरे को 90° पर समद्विभाजित (Bisect at 90°) करते हैं।',
        ],
        propertiesEn: [
          'All 4 sides are equal and opposite sides are parallel.',
          'Each interior angle is exactly 90°.',
          'Diagonals are equal and bisect each other perpendicularly at 90°.',
        ],
      };
    }

    case 'rectangle': {
      // आयत (Rectangle)
      const l = Math.max(0.1, sideA);
      const b = Math.max(0.1, sideB);
      const area = l * b;
      const perimeter = 2 * (l + b);
      const d = Math.sqrt(l * l + b * b);
      const circumradius = d / 2;

      return {
        area,
        perimeter,
        diagonal1: d,
        diagonal2: d,
        circumradius,
        angles: [90, 90, 90, 90],
        stepsHi: [
          `लंबाई (Length l) = ${l} सेमी, चौड़ाई (Breadth b) = ${b} सेमी`,
          `क्षेत्रफल (Area) = l × b = ${l} × ${b} = ${area.toFixed(2)} वर्ग सेमी`,
          `परिमाप (Perimeter) = 2 × (l + b) = 2 × (${l} + ${b}) = ${perimeter.toFixed(2)} सेमी`,
          `विकर्ण (Diagonal d) = √(l² + b²) = √(${l}² + ${b}²) = √(${(l * l + b * b).toFixed(2)}) = ${d.toFixed(2)} सेमी`,
          `परिवृत्त त्रिज्या (Circumradius R) = d / 2 = ${(d / 2).toFixed(2)} सेमी`,
        ],
        stepsEn: [
          `Length (l) = ${l} cm, Breadth (b) = ${b} cm`,
          `Area (A) = l × b = ${l} × ${b} = ${area.toFixed(2)} cm²`,
          `Perimeter (P) = 2(l + b) = 2 × (${l} + ${b}) = ${perimeter.toFixed(2)} cm`,
          `Diagonal (d) = √(l² + b²) = √(${l}² + ${b}²) = ${d.toFixed(2)} cm`,
          `Circumradius (R) = d / 2 = ${(d / 2).toFixed(2)} cm`,
        ],
        formulasHi: {
          'क्षेत्रफल (Area)': 'A = l · b',
          'परिमाप (Perimeter)': 'P = 2 · (l + b)',
          'विकर्ण (Diagonal)': 'd = √(l² + b²)',
          'लंबाई (l)': 'l = √(d² - b²) = A / b',
          'चौड़ाई (b)': 'b = √(d² - l²) = A / l',
        },
        formulasEn: {
          'Area': 'A = l · b',
          'Perimeter': 'P = 2(l + b)',
          'Diagonal': 'd = √(l² + b²)',
          'Length': 'l = √(d² - b²)',
          'Breadth': 'b = √(d² - l²)',
        },
        propertiesHi: [
          'आमने-सामने की भुजाएं बराबर और समानांतर होती हैं।',
          'चारों आंतरिक कोण 90° के होते हैं।',
          'दोनों विकर्ण लंबाई में बराबर होते हैं और एक-दूसरे को समद्विभाजित करते हैं।',
        ],
        propertiesEn: [
          'Opposite sides are equal and parallel.',
          'All four internal angles are 90°.',
          'Diagonals are equal in length and bisect each other.',
        ],
      };
    }

    case 'parallelogram': {
      // समानांतर चतुर्भुज (Parallelogram)
      const a = Math.max(0.1, sideA); // side
      const b = Math.max(0.1, sideB); // base
      const theta = Math.min(170, Math.max(10, angleDeg));
      const rad = toRad(theta);
      const h = height !== undefined ? height : a * Math.sin(rad);
      const area = b * h;
      const perimeter = 2 * (a + b);
      // Diagonals by law of cosines:
      const d1 = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(rad));
      const d2 = Math.sqrt(a * a + b * b + 2 * a * b * Math.cos(rad));

      return {
        area,
        perimeter,
        diagonal1: d1,
        diagonal2: d2,
        altitude: h,
        angles: [theta, 180 - theta, theta, 180 - theta],
        stepsHi: [
          `आधार (Base b) = ${b} सेमी, पार्श्व भुजा (Side a) = ${a} सेमी, कोण (θ) = ${theta}°`,
          `ऊंचाई (Height h) = a × sin(θ) = ${a} × sin(${theta}°) = ${h.toFixed(2)} सेमी`,
          `क्षेत्रफल (Area) = आधार × ऊंचाई = ${b} × ${h.toFixed(2)} = ${area.toFixed(2)} वर्ग सेमी`,
          `क्षेत्रफल (त्रिकोणमिति) = a × b × sin(θ) = ${a} × ${b} × sin(${theta}°) = ${area.toFixed(2)} वर्ग सेमी`,
          `परिमाप (Perimeter) = 2 × (a + b) = 2 × (${a} + ${b}) = ${perimeter.toFixed(2)} सेमी`,
          `विकर्ण 1 (d₁) = √(a² + b² - 2ab cos θ) = ${d1.toFixed(2)} सेमी`,
          `विकर्ण 2 (d₂) = √(a² + b² + 2ab cos θ) = ${d2.toFixed(2)} सेमी`,
          `अपोलोनियस प्रमेय: d₁² + d₂² = 2(a² + b²) = ${(d1 * d1 + d2 * d2).toFixed(1)} ≈ ${(2 * (a * a + b * b)).toFixed(1)}`,
        ],
        stepsEn: [
          `Base (b) = ${b} cm, Side (a) = ${a} cm, Angle (θ) = ${theta}°`,
          `Height (h) = a × sin(θ) = ${a} × sin(${theta}°) = ${h.toFixed(2)} cm`,
          `Area (A) = Base × Height = ${b} × ${h.toFixed(2)} = ${area.toFixed(2)} cm²`,
          `Area (Trig) = ab sin(θ) = ${a} × ${b} × sin(${theta}°) = ${area.toFixed(2)} cm²`,
          `Perimeter (P) = 2(a + b) = 2 × (${a} + ${b}) = ${perimeter.toFixed(2)} cm`,
          `Diagonal 1 (d₁) = ${d1.toFixed(2)} cm, Diagonal 2 (d₂) = ${d2.toFixed(2)} cm`,
          `Apollonius Identity: d₁² + d₂² = 2(a² + b²)`,
        ],
        formulasHi: {
          'क्षेत्रफल (आधार × ऊंचाई)': 'A = b · h',
          'क्षेत्रफल (कोण विधि)': 'A = a · b · sin(θ)',
          'परिमाप (Perimeter)': 'P = 2 · (a + b)',
          'विकर्ण संबंध': 'd₁² + d₂² = 2 · (a² + b²)',
        },
        formulasEn: {
          'Area (Base × Height)': 'A = b · h',
          'Area (Trig formula)': 'A = a · b · sin(θ)',
          'Perimeter': 'P = 2(a + b)',
          'Diagonals Identity': 'd₁² + d₂² = 2(a² + b²)',
        },
        propertiesHi: [
          'सम्मुख भुजाएं समान और समानांतर होती हैं (AB = CD, AD = BC)।',
          'सम्मुख कोण बराबर होते हैं (∠A = ∠C, ∠B = ∠D) और आसन्न कोणों का योग 180° होता है।',
          'विकर्ण एक-दूसरे को समद्विभाजित करते हैं (परंतु लंबवत या बराबर नहीं होते)।',
        ],
        propertiesEn: [
          'Opposite sides are parallel and congruent.',
          'Opposite angles are equal; adjacent angles sum to 180°.',
          'Diagonals bisect each other (not necessarily perpendicular or equal).',
        ],
      };
    }

    case 'rhombus': {
      // समचतुर्भुज (Rhombus)
      let a = Math.max(0.1, sideA);
      let d1 = diagonal1 || 8;
      let d2 = diagonal2 || 6;

      // If diagonals provided, calculate side
      if (diagonal1 && diagonal2) {
        d1 = diagonal1;
        d2 = diagonal2;
        a = 0.5 * Math.sqrt(d1 * d1 + d2 * d2);
      } else {
        d1 = 2 * a * Math.sin(toRad(angleDeg / 2));
        d2 = 2 * a * Math.cos(toRad(angleDeg / 2));
      }

      const area = 0.5 * d1 * d2;
      const perimeter = 4 * a;
      const inradius = (d1 * d2) / (4 * a); // h / 2
      const altitude = (d1 * d2) / (2 * a);

      return {
        area,
        perimeter,
        diagonal1: d1,
        diagonal2: d2,
        altitude,
        inradius,
        angles: [angleDeg, 180 - angleDeg, angleDeg, 180 - angleDeg],
        stepsHi: [
          `विकर्ण 1 (d₁) = ${d1.toFixed(2)} सेमी, विकर्ण 2 (d₂) = ${d2.toFixed(2)} सेमी`,
          `भुजा (Side a) = ½ × √(d₁² + d₂²) = ½ × √(${d1.toFixed(1)}² + ${d2.toFixed(1)}²) = ${a.toFixed(2)} सेमी`,
          `क्षेत्रफल (Area) = ½ × d₁ × d₂ = ½ × ${d1.toFixed(2)} × ${d2.toFixed(2)} = ${area.toFixed(2)} वर्ग सेमी`,
          `परिमाप (Perimeter) = 4 × a = 4 × ${a.toFixed(2)} = ${perimeter.toFixed(2)} सेमी`,
          `ऊंचाई (Altitude h) = Area / a = ${area.toFixed(2)} / ${a.toFixed(2)} = ${altitude.toFixed(2)} सेमी`,
          `अंतःवृत्त त्रिज्या (Inradius r) = h / 2 = ${(altitude / 2).toFixed(2)} सेमी`,
        ],
        stepsEn: [
          `Diagonal 1 (d₁) = ${d1.toFixed(2)} cm, Diagonal 2 (d₂) = ${d2.toFixed(2)} cm`,
          `Side (a) = ½√(d₁² + d₂²) = ${a.toFixed(2)} cm`,
          `Area (A) = ½ × d₁ × d₂ = ${area.toFixed(2)} cm²`,
          `Perimeter (P) = 4a = ${perimeter.toFixed(2)} cm`,
          `Altitude (h) = Area / a = ${altitude.toFixed(2)} cm`,
          `Inradius (r) = h / 2 = ${(altitude / 2).toFixed(2)} cm`,
        ],
        formulasHi: {
          'क्षेत्रफल (Area)': 'A = ½ · d₁ · d₂ = a · h = a² · sin(θ)',
          'भुजा (Side a)': 'a = ½ · √(d₁² + d₂²)',
          'परिमाप (Perimeter)': 'P = 4 · a',
          'ऊंचाई (Altitude)': 'h = (d₁ · d₂) / (2 · a)',
          'विकर्ण संबंध': '4 · a² = d₁² + d₂²',
        },
        formulasEn: {
          'Area': 'A = ½ · d₁ · d₂ = a · h',
          'Side': 'a = ½ · √(d₁² + d₂²)',
          'Perimeter': 'P = 4a',
          'Altitude': 'h = (d₁ · d₂) / (2a)',
          'Diagonals Identity': '4a² = d₁² + d₂²',
        },
        propertiesHi: [
          'सभी चारों भुजाएं बराबर होती हैं (AB = BC = CD = DA)।',
          'दोनों विकर्ण एक-दूसरे को 90° (समकोण) पर समद्विभाजित करते हैं।',
          'विकर्ण शीर्ष कोणों (Vertex angles) को भी समद्विभाजित करते हैं।',
        ],
        propertiesEn: [
          'All 4 sides are equal.',
          'Diagonals bisect each other perpendicularly at 90°.',
          'Diagonals bisect the vertex angles.',
        ],
      };
    }

    case 'trapezium': {
      // समलंब चतुर्भुज (Trapezium / Trapezoid)
      const a = Math.max(0.1, sideA); // parallel top
      const b = Math.max(0.1, sideB); // parallel bottom
      const c = Math.max(0.1, sideC); // non-parallel left
      const d = Math.max(0.1, sideD); // non-parallel right
      const h = height !== undefined ? Math.max(0.1, height) : 4;
      const area = 0.5 * (a + b) * h;
      const perimeter = a + b + c + d;
      const median = (a + b) / 2; // मध्यिका

      return {
        area,
        perimeter,
        altitude: h,
        stepsHi: [
          `समानांतर भुजाएं: a = ${a} सेमी, b = ${b} सेमी`,
          `असमानांतर भुजाएं: c = ${c} सेमी, d = ${d} सेमी`,
          `ऊंचाई / लंबवत दूरी (h) = ${h} सेमी`,
          `मध्यिका (Median / Midline) = (a + b) / 2 = (${a} + ${b}) / 2 = ${median.toFixed(2)} सेमी`,
          `क्षेत्रफल (Area) = ½ × (समानांतर भुजाओं का योग) × ऊंचाई`,
          `= ½ × (${a} + ${b}) × ${h} = ½ × ${(a + b).toFixed(2)} × ${h} = ${area.toFixed(2)} वर्ग सेमी`,
          `परिमाप (Perimeter) = a + b + c + d = ${a} + ${b} + ${c} + ${d} = ${perimeter.toFixed(2)} सेमी`,
        ],
        stepsEn: [
          `Parallel sides: a = ${a} cm, b = ${b} cm`,
          `Non-parallel sides: c = ${c} cm, d = ${d} cm`,
          `Height / Distance (h) = ${h} cm`,
          `Median (Mid-segment) = (a + b) / 2 = ${median.toFixed(2)} cm`,
          `Area (A) = ½ × (a + b) × h = ½ × ${(a + b).toFixed(2)} × ${h} = ${area.toFixed(2)} cm²`,
          `Perimeter (P) = a + b + c + d = ${perimeter.toFixed(2)} cm`,
        ],
        formulasHi: {
          'क्षेत्रफल (Area)': 'A = ½ · (a + b) · h = मध्यिका × h',
          'परिमाप (Perimeter)': 'P = a + b + c + d',
          'मध्यिका (Mid-segment)': 'm = (a + b) / 2',
          'समद्विबाहु समलंब विकर्ण': 'd = √(ab + c²)',
        },
        formulasEn: {
          'Area': 'A = ½(a + b)h = Median × h',
          'Perimeter': 'P = a + b + c + d',
          'Median': 'm = (a + b) / 2',
          'Isosceles Diagonal': 'd = √(ab + c²)',
        },
        propertiesHi: [
          'भुजाओं का केवल एक जोड़ा समानांतर होता है (AB || CD)।',
          'मध्यिका की लंबाई समानांतर भुजाओं के समांतर माध्य (a+b)/2 के बराबर होती है।',
          'समद्विबाहु समलंब (Isosceles Trapezium) में असमानांतर भुजाएं और विकर्ण बराबर होते हैं।',
        ],
        propertiesEn: [
          'Exactly one pair of opposite sides is parallel (AB || CD).',
          'The mid-segment (median) connects the midpoints of non-parallel legs and equals (a+b)/2.',
          'In an isosceles trapezium, non-parallel sides are equal and base angles are equal.',
        ],
      };
    }

    case 'kite': {
      // पतंग (Kite)
      const a = Math.max(0.1, sideA);
      const b = Math.max(0.1, sideB);
      const d1 = diagonal1 || 8;
      const d2 = diagonal2 || 6;
      const area = 0.5 * d1 * d2;
      const perimeter = 2 * (a + b);

      return {
        area,
        perimeter,
        diagonal1: d1,
        diagonal2: d2,
        stepsHi: [
          `आसन्न भुजाएं: a = ${a} सेमी, b = ${b} सेमी`,
          `विकर्ण: d₁ = ${d1} सेमी, d₂ = ${d2} सेमी`,
          `क्षेत्रफल (Area) = ½ × d₁ × d₂ = ½ × ${d1} × ${d2} = ${area.toFixed(2)} वर्ग सेमी`,
          `परिमाप (Perimeter) = 2 × (a + b) = 2 × (${a} + ${b}) = ${perimeter.toFixed(2)} सेमी`,
        ],
        stepsEn: [
          `Adjacent pairs: a = ${a} cm, b = ${b} cm`,
          `Diagonals: d₁ = ${d1} cm, d₂ = ${d2} cm`,
          `Area (A) = ½ × d₁ × d₂ = ${area.toFixed(2)} cm²`,
          `Perimeter (P) = 2(a + b) = ${perimeter.toFixed(2)} cm`,
        ],
        formulasHi: {
          'क्षेत्रफल (Area)': 'A = ½ · d₁ · d₂',
          'परिमाप (Perimeter)': 'P = 2 · (a + b)',
        },
        formulasEn: {
          'Area': 'A = ½ · d₁ · d₂',
          'Perimeter': 'P = 2(a + b)',
        },
        propertiesHi: [
          'आसन्न भुजाओं के दो जोड़े बराबर होते हैं।',
          'दोनों विकर्ण एक-दूसरे को 90° पर काटते हैं।',
          'मुख्य विकर्ण दूसरे विकर्ण को समद्विभाजित करता है।',
        ],
        propertiesEn: [
          'Two distinct pairs of adjacent equal sides.',
          'Diagonals intersect perpendicularly at 90°.',
          'The main diagonal bisects the other diagonal.',
        ],
      };
    }

    case 'cyclic_quadrilateral': {
      // चक्रीय चतुर्भुज (Cyclic Quadrilateral)
      const a = Math.max(0.1, sideA);
      const b = Math.max(0.1, sideB);
      const c = Math.max(0.1, sideC);
      const d = Math.max(0.1, sideD);
      const perimeter = a + b + c + d;
      const s = perimeter / 2; // Semi-perimeter

      // Brahmagupta's Formula: Area = sqrt((s-a)(s-b)(s-c)(s-d))
      const diffProduct = (s - a) * (s - b) * (s - c) * (s - d);
      const area = diffProduct > 0 ? Math.sqrt(diffProduct) : 0;

      // Diagonals by Brahmagupta's diagonals formula:
      const d1 = Math.sqrt(((a * c + b * d) * (a * b + c * d)) / (a * d + b * c));
      const d2 = Math.sqrt(((a * c + b * d) * (a * d + b * c)) / (a * b + c * d));

      // Circumradius R = 1/(4*Area) * sqrt((ab+cd)(ac+bd)(ad+bc))
      const circumradius =
        area > 0
          ? (1 / (4 * area)) *
            Math.sqrt((a * b + c * d) * (a * c + b * d) * (a * d + b * c))
          : undefined;

      return {
        area,
        perimeter,
        diagonal1: d1,
        diagonal2: d2,
        circumradius,
        stepsHi: [
          `चारों भुजाएं: a = ${a}, b = ${b}, c = ${c}, d = ${d} सेमी`,
          `अर्ध-परिमाप (s) = (a + b + c + d) / 2 = ${s.toFixed(2)} सेमी`,
          `ब्रह्मगुप्त सूत्र (Brahmagupta Formula): Area = √[(s-a)(s-b)(s-c)(s-d)]`,
          `= √[(${s - a})(${s - b})(${s - c})(${s - d})] = ${area.toFixed(2)} वर्ग सेमी`,
          `परिमाप (Perimeter) = a + b + c + d = ${perimeter.toFixed(2)} सेमी`,
          `टॉलेमी प्रमेय (Ptolemy Theorem): d₁ × d₂ = (a × c) + (b × d) = ${(a * c + b * d).toFixed(2)}`,
          `परिवृत्त त्रिज्या (R) = ${circumradius ? circumradius.toFixed(2) + ' सेमी' : 'N/A'}`,
        ],
        stepsEn: [
          `Sides: a = ${a}, b = ${b}, c = ${c}, d = ${d} cm`,
          `Semi-perimeter (s) = (a+b+c+d)/2 = ${s.toFixed(2)} cm`,
          `Brahmagupta's Area = √[(s-a)(s-b)(s-c)(s-d)] = ${area.toFixed(2)} cm²`,
          `Perimeter (P) = ${perimeter.toFixed(2)} cm`,
          `Ptolemy's Theorem: d₁ · d₂ = ac + bd = ${(a * c + b * d).toFixed(2)}`,
          `Circumradius (R) = ${circumradius ? circumradius.toFixed(2) + ' cm' : 'N/A'}`,
        ],
        formulasHi: {
          'क्षेत्रफल (ब्रह्मगुप्त सूत्र)': 'A = √[(s-a)(s-b)(s-c)(s-d)]',
          'टॉलेमी प्रमेय': 'd₁ · d₂ = (a · c) + (b · d)',
          'सम्मुख कोण योग': '∠A + ∠C = 180°, ∠B + ∠D = 180°',
          'परिवृत्त त्रिज्या (R)': 'R = ¼A · √[(ab+cd)(ac+bd)(ad+bc)]',
        },
        formulasEn: {
          'Area (Brahmagupta)': 'A = √[(s-a)(s-b)(s-c)(s-d)]',
          'Ptolemy Theorem': 'd₁ · d₂ = ac + bd',
          'Opposite Angles': '∠A + ∠C = 180°, ∠B + ∠D = 180°',
          'Circumradius (R)': 'R = ¼A · √[(ab+cd)(ac+bd)(ad+bc)]',
        },
        propertiesHi: [
          'सभी चारों शीर्ष (Vertices) एक ही वृत्त की परिधि पर स्थित होते हैं।',
          'सम्मुख कोण संपूरक (Supplementary) होते हैं, अर्थात ∠A + ∠C = 180° और ∠B + ∠D = 180°।',
          'टॉलेमी प्रमेय: विकर्णों का गुणनफल = सम्मुख भुजाओं के गुणनफलों का योग (d₁·d₂ = ac + bd)।',
        ],
        propertiesEn: [
          'All four vertices lie on the circumference of a single circle.',
          'Opposite angles are supplementary: ∠A + ∠C = 180° and ∠B + ∠D = 180°.',
          'Ptolemy Theorem: Product of diagonals equals sum of products of opposite sides (d₁·d₂ = ac + bd).',
        ],
      };
    }

    case 'equilateral_triangle': {
      // समबाहु त्रिभुज (Equilateral Triangle)
      const a = Math.max(0.1, sideA);
      const area = (Math.sqrt(3) / 4) * a * a;
      const perimeter = 3 * a;
      const h = (Math.sqrt(3) / 2) * a;
      const inradius = a / (2 * Math.sqrt(3));
      const circumradius = a / Math.sqrt(3);

      return {
        area,
        perimeter,
        altitude: h,
        inradius,
        circumradius,
        angles: [60, 60, 60],
        stepsHi: [
          `भुजा (Side a) = ${a} सेमी`,
          `ऊंचाई / शीर्षलंब (h) = (√3 / 2) × a = 0.866 × ${a} = ${h.toFixed(2)} सेमी`,
          `क्षेत्रफल (Area) = (√3 / 4) × a² = 0.433 × ${a}² = ${area.toFixed(2)} वर्ग सेमी`,
          `परिमाप (Perimeter) = 3 × a = 3 × ${a} = ${perimeter.toFixed(2)} सेमी`,
          `अंतःवृत्त त्रिज्या (Inradius r) = a / (2√3) = ${inradius.toFixed(2)} सेमी`,
          `परिवृत्त त्रिज्या (Circumradius R) = a / √3 = ${circumradius.toFixed(2)} सेमी (R = 2r)`,
        ],
        stepsEn: [
          `Side (a) = ${a} cm`,
          `Altitude (h) = (√3 / 2)a = ${h.toFixed(2)} cm`,
          `Area (A) = (√3 / 4)a² = ${area.toFixed(2)} cm²`,
          `Perimeter (P) = 3a = ${perimeter.toFixed(2)} cm`,
          `Inradius (r) = a / (2√3) = ${inradius.toFixed(2)} cm`,
          `Circumradius (R) = a / √3 = ${circumradius.toFixed(2)} cm (R = 2r)`,
        ],
        formulasHi: {
          'क्षेत्रफल (Area)': 'A = (√3 / 4) · a²',
          'ऊंचाई (Height)': 'h = (√3 / 2) · a',
          'परिमाप (Perimeter)': 'P = 3 · a',
          'अंतःवृत्त त्रिज्या (r)': 'r = a / (2√3) = h / 3',
          'परिवृत्त त्रिज्या (R)': 'R = a / √3 = 2h / 3',
        },
        formulasEn: {
          'Area': 'A = (√3 / 4)a²',
          'Altitude': 'h = (√3 / 2)a',
          'Perimeter': 'P = 3a',
          'Inradius (r)': 'r = a / (2√3) = h / 3',
          'Circumradius (R)': 'R = a / √3 = 2h / 3',
        },
        propertiesHi: [
          'तीनों भुजाएं बराबर और तीनों आंतरिक कोण 60° के होते हैं।',
          'माध्यिका, शीर्षलंब, कोण समद्विभाजक और लंब समद्विभाजक सभी संपाती (coincident) होते हैं।',
          'परिवृत्त की त्रिज्या अंतःवृत्त की त्रिज्या की दोगुनी (R = 2r) होती है।',
        ],
        propertiesEn: [
          'All 3 sides equal, all 3 angles equal to 60°.',
          'Median, altitude, and angle bisectors are all identical lines.',
          'Circumradius is exactly twice the inradius (R = 2r).',
        ],
      };
    }

    case 'right_triangle': {
      // समकोण त्रिभुज (Right-angled Triangle)
      const b = Math.max(0.1, sideA); // base
      const p = Math.max(0.1, sideB); // perpendicular
      const h = Math.sqrt(b * b + p * p); // hypotenuse (karn)
      const area = 0.5 * b * p;
      const perimeter = b + p + h;
      const inradius = (b + p - h) / 2;
      const circumradius = h / 2;
      const altitudeOnHypotenuse = (b * p) / h;

      return {
        area,
        perimeter,
        altitude: altitudeOnHypotenuse,
        inradius,
        circumradius,
        angles: [90, Math.round((Math.asin(p / h) * 180) / PI), Math.round((Math.asin(b / h) * 180) / PI)],
        stepsHi: [
          `आधार (Base) = ${b} सेमी, लंब (Perpendicular) = ${p} सेमी`,
          `पाइथागोरस प्रमेय: कर्ण (Hypotenuse) = √(आधार² + लंब²) = √(${b}² + ${p}²) = ${h.toFixed(2)} सेमी`,
          `क्षेत्रफल (Area) = ½ × आधार × लंब = ½ × ${b} × ${p} = ${area.toFixed(2)} वर्ग सेमी`,
          `परिमाप (Perimeter) = आधार + लंब + कर्ण = ${b} + ${p} + ${h.toFixed(2)} = ${perimeter.toFixed(2)} सेमी`,
          `कर्ण पर डाले गए लंब की लंबाई = (आधार × लंब) / कर्ण = ${altitudeOnHypotenuse.toFixed(2)} सेमी`,
          `अंतःवृत्त त्रिज्या (Inradius r) = (P + B - H) / 2 = ${inradius.toFixed(2)} सेमी`,
          `परिवृत्त त्रिज्या (Circumradius R) = H / 2 = ${(h / 2).toFixed(2)} सेमी`,
        ],
        stepsEn: [
          `Base (b) = ${b} cm, Perpendicular (p) = ${p} cm`,
          `Pythagoras Theorem: Hypotenuse (h) = √(b² + p²) = ${h.toFixed(2)} cm`,
          `Area (A) = ½ × b × p = ${area.toFixed(2)} cm²`,
          `Perimeter (P) = b + p + h = ${perimeter.toFixed(2)} cm`,
          `Altitude on Hypotenuse = (b × p) / h = ${altitudeOnHypotenuse.toFixed(2)} cm`,
          `Inradius (r) = (p + b - h) / 2 = ${inradius.toFixed(2)} cm`,
          `Circumradius (R) = h / 2 = ${(h / 2).toFixed(2)} cm`,
        ],
        formulasHi: {
          'पाइथागोरस प्रमेय': 'कर्ण² = आधार² + लंब²',
          'क्षेत्रफल (Area)': 'A = ½ · आधार · लंब',
          'परिमाप (Perimeter)': 'P = b + p + h',
          'अंतःवृत्त त्रिज्या (r)': 'r = (b + p - h) / 2 = A / s',
          'परिवृत्त त्रिज्या (R)': 'R = कर्ण / 2',
        },
        formulasEn: {
          'Pythagorean Theorem': 'h² = b² + p²',
          'Area': 'A = ½ · b · p',
          'Perimeter': 'P = b + p + h',
          'Inradius (r)': 'r = (b + p - h) / 2',
          'Circumradius (R)': 'R = h / 2',
        },
        propertiesHi: [
          'एक कोण 90° का होता है और अन्य दो कोण न्यूनकोण व पूरक (Complementary) होते हैं।',
          'परिकेंद्र (Circumcenter) हमेशा कर्ण के मध्य बिंदु पर स्थित होता है।',
        ],
        propertiesEn: [
          'One angle is 90°; the other two are complementary acute angles.',
          'The circumcenter is the exact midpoint of the hypotenuse.',
        ],
      };
    }

    case 'isosceles_triangle': {
      // समद्विबाहु त्रिभुज (Isosceles Triangle)
      const a = Math.max(0.1, sideA); // equal side
      const b = Math.max(0.1, sideB); // base
      const h = Math.sqrt(Math.max(0.01, a * a - (b * b) / 4));
      const area = (b / 4) * Math.sqrt(Math.max(0.01, 4 * a * a - b * b));
      const perimeter = 2 * a + b;

      return {
        area,
        perimeter,
        altitude: h,
        stepsHi: [
          `समान भुजाएं (a) = ${a} सेमी, आधार (b) = ${b} सेमी`,
          `ऊंचाई (h) = √(a² - b²/4) = ${h.toFixed(2)} सेमी`,
          `क्षेत्रफल (Area) = (b / 4) × √(4a² - b²) = ${area.toFixed(2)} वर्ग सेमी`,
          `परिमाप (Perimeter) = 2a + b = 2 × ${a} + ${b} = ${perimeter.toFixed(2)} सेमी`,
        ],
        stepsEn: [
          `Equal sides (a) = ${a} cm, Base (b) = ${b} cm`,
          `Altitude (h) = √(a² - b²/4) = ${h.toFixed(2)} cm`,
          `Area (A) = (b / 4)√(4a² - b²) = ${area.toFixed(2)} cm²`,
          `Perimeter (P) = 2a + b = ${perimeter.toFixed(2)} cm`,
        ],
        formulasHi: {
          'क्षेत्रफल (Area)': 'A = (b / 4) · √(4a² - b²)',
          'ऊंचाई (Altitude)': 'h = √(a² - b²/4)',
          'परिमाप (Perimeter)': 'P = 2a + b',
        },
        formulasEn: {
          'Area': 'A = (b / 4)√(4a² - b²)',
          'Altitude': 'h = √(a² - b²/4)',
          'Perimeter': 'P = 2a + b',
        },
        propertiesHi: [
          'दो भुजाएं बराबर होती हैं और उनके सम्मुख कोण भी बराबर होते हैं।',
          'शीर्ष से आधार पर डाला गया लंब आधार को समद्विभाजित करता है।',
        ],
        propertiesEn: [
          'Two sides are equal, and angles opposite to equal sides are equal.',
          'The altitude to the base bisects the base and the vertex angle.',
        ],
      };
    }

    case 'scalene_triangle': {
      // विषमबाहु त्रिभुज (Scalene Triangle - Heron's formula)
      const a = Math.max(0.1, sideA);
      const b = Math.max(0.1, sideB);
      const c = Math.max(0.1, sideC);
      const perimeter = a + b + c;
      const s = perimeter / 2;
      const diffProduct = s * (s - a) * (s - b) * (s - c);
      const area = diffProduct > 0 ? Math.sqrt(diffProduct) : 0;
      const inradius = s > 0 ? area / s : 0;
      const circumradius = area > 0 ? (a * b * c) / (4 * area) : 0;

      return {
        area,
        perimeter,
        inradius,
        circumradius,
        stepsHi: [
          `भुजाएं: a = ${a}, b = ${b}, c = ${c} सेमी`,
          `अर्ध-परिमाप (s) = (a + b + c) / 2 = ${s.toFixed(2)} सेमी`,
          `हीरोन का सूत्र (Heron's Formula): Area = √[s(s-a)(s-b)(s-c)]`,
          `= √[${s.toFixed(1)} × ${(s - a).toFixed(1)} × ${(s - b).toFixed(1)} × ${(s - c).toFixed(1)}] = ${area.toFixed(2)} वर्ग सेमी`,
          `परिमाप (Perimeter) = a + b + c = ${perimeter.toFixed(2)} सेमी`,
          `अंतःवृत्त त्रिज्या (r) = Area / s = ${inradius.toFixed(2)} सेमी`,
          `परिवृत्त त्रिज्या (R) = (abc) / (4 × Area) = ${circumradius.toFixed(2)} सेमी`,
        ],
        stepsEn: [
          `Sides: a = ${a}, b = ${b}, c = ${c} cm`,
          `Semi-perimeter (s) = (a+b+c)/2 = ${s.toFixed(2)} cm`,
          `Heron's Formula: Area = √[s(s-a)(s-b)(s-c)] = ${area.toFixed(2)} cm²`,
          `Perimeter (P) = a + b + c = ${perimeter.toFixed(2)} cm`,
          `Inradius (r) = Area / s = ${inradius.toFixed(2)} cm`,
          `Circumradius (R) = abc / (4 × Area) = ${circumradius.toFixed(2)} cm`,
        ],
        formulasHi: {
          'क्षेत्रफल (हीरोन सूत्र)': 'A = √[s · (s-a) · (s-b) · (s-c)]',
          'अर्ध-परिमाप (s)': 's = (a + b + c) / 2',
          'अंतःवृत्त त्रिज्या (r)': 'r = A / s',
          'परिवृत्त त्रिज्या (R)': 'R = (a · b · c) / (4 · A)',
        },
        formulasEn: {
          'Area (Heron Formula)': 'A = √[s(s-a)(s-b)(s-c)]',
          'Semi-perimeter (s)': 's = (a + b + c) / 2',
          'Inradius (r)': 'r = A / s',
          'Circumradius (R)': 'R = abc / (4A)',
        },
        propertiesHi: [
          'तीनों भुजाएं और तीनों कोण असमान होते हैं।',
          'किन्हीं दो भुजाओं का योग हमेशा तीसरी भुजा से बड़ा होता है (a + b > c)।',
        ],
        propertiesEn: [
          'All three sides and angles are unequal.',
          'Triangle Inequality: Sum of any two sides is strictly greater than the third side (a + b > c).',
        ],
      };
    }

    case 'circle': {
      // वृत्त (Circle)
      const r = Math.max(0.1, sideA);
      const area = PI * r * r;
      const perimeter = 2 * PI * r; // Circumference
      const diameter = 2 * r;

      return {
        area,
        perimeter,
        stepsHi: [
          `त्रिज्या (Radius r) = ${r} सेमी, व्यास (Diameter d) = ${diameter} सेमी`,
          `क्षेत्रफल (Area) = π × r² = 3.1416 × ${r}² = ${area.toFixed(2)} वर्ग सेमी`,
          `परिधि / परिमाप (Circumference) = 2 × π × r = 2 × 3.1416 × ${r} = ${perimeter.toFixed(2)} सेमी`,
        ],
        stepsEn: [
          `Radius (r) = ${r} cm, Diameter (d) = ${diameter} cm`,
          `Area (A) = πr² = π × ${r}² = ${area.toFixed(2)} cm²`,
          `Circumference (C) = 2πr = 2 × π × ${r} = ${perimeter.toFixed(2)} cm`,
        ],
        formulasHi: {
          'क्षेत्रफल (Area)': 'A = π · r² = (π · d²) / 4',
          'परिधि (Circumference)': 'C = 2 · π · r = π · d',
          'व्यास (Diameter)': 'd = 2 · r',
        },
        formulasEn: {
          'Area': 'A = πr² = (πd²) / 4',
          'Circumference': 'C = 2πr = πd',
          'Diameter': 'd = 2r',
        },
        propertiesHi: [
          'केंद्र से परिधि की दूरी हमेशा समान (त्रिज्या r) होती है।',
          'व्यास वृत्त की सबसे बड़ी जीवा (Longest Chord) होती है।',
          'अर्धवृत्त में बना कोण हमेशा समकोण (90°) होता है।',
        ],
        propertiesEn: [
          'All points on circumference are equidistant (radius r) from center.',
          'Diameter is the longest chord of the circle.',
          'Angle inscribed in a semicircle is always a right angle (90°).',
        ],
      };
    }

    case 'semicircle': {
      // अर्धवृत्त (Semicircle)
      const r = Math.max(0.1, sideA);
      const area = 0.5 * PI * r * r;
      const perimeter = PI * r + 2 * r; // πr + 2r (or r(π + 2) = 36/7 * r)

      return {
        area,
        perimeter,
        stepsHi: [
          `त्रिज्या (r) = ${r} सेमी`,
          `क्षेत्रफल (Area) = ½ × π × r² = ½ × 3.1416 × ${r}² = ${area.toFixed(2)} वर्ग सेमी`,
          `परिमाप (Perimeter) = πr + 2r = (22/7 + 2) × r = (36/7) × ${r} = ${perimeter.toFixed(2)} सेमी`,
        ],
        stepsEn: [
          `Radius (r) = ${r} cm`,
          `Area (A) = ½πr² = ${area.toFixed(2)} cm²`,
          `Perimeter (P) = πr + 2r = r(π + 2) ≈ (36/7)r = ${perimeter.toFixed(2)} cm`,
        ],
        formulasHi: {
          'क्षेत्रफल (Area)': 'A = ½ · π · r²',
          'परिमाप (Perimeter)': 'P = π · r + 2 · r = (36 / 7) · r',
        },
        formulasEn: {
          'Area': 'A = ½πr²',
          'Perimeter': 'P = πr + 2r = (36/7)r',
        },
        propertiesHi: [
          'अर्धवृत्त का परिमाप केवल वक्र भाग नहीं, बल्कि व्यास (2r) सहित होता है: (π+2)r.',
        ],
        propertiesEn: [
          'Perimeter includes the curved arc (πr) plus the diameter base (2r): r(π+2).',
        ],
      };
    }

    case 'ring': {
      // वलय (Circular Ring / Annulus)
      const R = Math.max(0.2, sideA); // outer radius
      const r = Math.min(R - 0.1, Math.max(0.1, sideB || R / 2)); // inner radius
      const area = PI * (R * R - r * r);
      const perimeter = 2 * PI * (R + r);
      const width = R - r;

      return {
        area,
        perimeter,
        stepsHi: [
          `बाह्य त्रिज्या (Outer Radius R) = ${R} सेमी, आंतरिक त्रिज्या (Inner Radius r) = ${r} सेमी`,
          `चौड़ाई (Width w) = R - r = ${width.toFixed(2)} सेमी`,
          `क्षेत्रफल (Area) = π × (R² - r²) = π × (R + r)(R - r) = ${area.toFixed(2)} वर्ग सेमी`,
          `कुल परिमाप (Total Boundary) = 2πR + 2πr = 2π(R + r) = ${perimeter.toFixed(2)} सेमी`,
        ],
        stepsEn: [
          `Outer radius (R) = ${R} cm, Inner radius (r) = ${r} cm`,
          `Ring width = R - r = ${width.toFixed(2)} cm`,
          `Area (A) = π(R² - r²) = π(R + r)(R - r) = ${area.toFixed(2)} cm²`,
          `Total Boundary = 2π(R + r) = ${perimeter.toFixed(2)} cm`,
        ],
        formulasHi: {
          'क्षेत्रफल (Area)': 'A = π · (R² - r²) = π · (R + r) · (R - r)',
          'चौड़ाई (Width)': 'w = R - r',
          'कुल परिमाप': 'P = 2 · π · (R + r)',
        },
        formulasEn: {
          'Area': 'A = π(R² - r²)',
          'Width': 'w = R - r',
          'Total Perimeter': 'P = 2π(R + r)',
        },
        propertiesHi: [
          'दो संकेंद्रीय वृत्तों (Concentric circles) के बीच का वृत्ताकार क्षेत्र वलय कहलाता है।',
        ],
        propertiesEn: [
          'The region between two concentric circles with a common center.',
        ],
      };
    }

    case 'sector': {
      // त्रिज्यखंड (Sector of a circle)
      const r = Math.max(0.1, sideA);
      const theta = Math.min(360, Math.max(1, angleDeg));
      const arcLength = (theta / 360) * (2 * PI * r);
      const area = (theta / 360) * (PI * r * r); // or 0.5 * arcLength * r
      const perimeter = arcLength + 2 * r;

      return {
        area,
        perimeter,
        stepsHi: [
          `त्रिज्या (r) = ${r} सेमी, कोण (θ) = ${theta}°`,
          `चाप की लंबाई (Arc Length L) = (θ / 360) × 2πr = (${theta} / 360) × 2 × 3.1416 × ${r} = ${arcLength.toFixed(2)} सेमी`,
          `क्षेत्रफल (Area) = (θ / 360) × πr² = (${theta} / 360) × 3.1416 × ${r}² = ${area.toFixed(2)} वर्ग सेमी`,
          `क्षेत्रफल (चाप विधि) = ½ × L × r = ½ × ${arcLength.toFixed(2)} × ${r} = ${area.toFixed(2)} वर्ग सेमी`,
          `परिमाप (Perimeter) = चाप की लंबाई + 2r = ${arcLength.toFixed(2)} + 2(${r}) = ${perimeter.toFixed(2)} सेमी`,
        ],
        stepsEn: [
          `Radius (r) = ${r} cm, Sector Angle (θ) = ${theta}°`,
          `Arc Length (L) = (θ / 360) × 2πr = ${arcLength.toFixed(2)} cm`,
          `Area (A) = (θ / 360) × πr² = ½ × L × r = ${area.toFixed(2)} cm²`,
          `Perimeter (P) = L + 2r = ${perimeter.toFixed(2)} cm`,
        ],
        formulasHi: {
          'क्षेत्रफल (Area)': 'A = (θ / 360) · π · r² = ½ · L · r',
          'चाप की लंबाई (Arc Length L)': 'L = (θ / 360) · 2 · π · r',
          'परिमाप (Perimeter)': 'P = L + 2 · r',
        },
        formulasEn: {
          'Area': 'A = (θ / 360) · πr² = ½ · L · r',
          'Arc Length': 'L = (θ / 360) · 2πr',
          'Perimeter': 'P = L + 2r',
        },
        propertiesHi: [
          'वृत्त की दो त्रिज्याओं और उनके बीच के चाप से घिरा क्षेत्र त्रिज्यखंड कहलाता है।',
        ],
        propertiesEn: [
          'The portion of a circle enclosed by two radii and an arc.',
        ],
      };
    }
  }
}
