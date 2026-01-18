export interface DataPoint {
  x: number;
  y: number;
}

// Lagrange Interpolation
export function lagrangeInterpolation(points: DataPoint[], x: number): number {
  let result = 0;
  const n = points.length;

  for (let i = 0; i < n; i++) {
    let term = points[i].y;
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        term *= (x - points[j].x) / (points[i].x - points[j].x);
      }
    }
    result += term;
  }

  return result;
}

// Newton's Forward Interpolation (for equally spaced points)
export function newtonForwardInterpolation(points: DataPoint[], x: number): number {
  const n = points.length;
  if (n < 2) return points[0]?.y ?? 0;

  // Build difference table
  const diffTable: number[][] = [];
  diffTable[0] = points.map(p => p.y);

  for (let i = 1; i < n; i++) {
    diffTable[i] = [];
    for (let j = 0; j < n - i; j++) {
      diffTable[i][j] = diffTable[i - 1][j + 1] - diffTable[i - 1][j];
    }
  }

  const h = points[1].x - points[0].x;
  const u = (x - points[0].x) / h;

  let result = diffTable[0][0];
  let uProduct = 1;

  for (let i = 1; i < n; i++) {
    uProduct *= (u - (i - 1)) / i;
    result += uProduct * diffTable[i][0];
  }

  return result;
}

// Newton's Backward Interpolation (for equally spaced points)
export function newtonBackwardInterpolation(points: DataPoint[], x: number): number {
  const n = points.length;
  if (n < 2) return points[0]?.y ?? 0;

  // Build difference table
  const diffTable: number[][] = [];
  diffTable[0] = points.map(p => p.y);

  for (let i = 1; i < n; i++) {
    diffTable[i] = [];
    for (let j = 0; j < n - i; j++) {
      diffTable[i][j] = diffTable[i - 1][j + 1] - diffTable[i - 1][j];
    }
  }

  const h = points[1].x - points[0].x;
  const u = (x - points[n - 1].x) / h;

  let result = diffTable[0][n - 1];
  let uProduct = 1;

  for (let i = 1; i < n; i++) {
    uProduct *= (u + (i - 1)) / i;
    result += uProduct * diffTable[i][n - 1 - i];
  }

  return result;
}

// Newton's Divided Difference Interpolation
export function newtonDividedDifferenceInterpolation(points: DataPoint[], x: number): number {
  const n = points.length;
  if (n < 1) return 0;

  // Build divided difference table
  const divDiff: number[][] = [];
  divDiff[0] = points.map(p => p.y);

  for (let i = 1; i < n; i++) {
    divDiff[i] = [];
    for (let j = 0; j < n - i; j++) {
      divDiff[i][j] = (divDiff[i - 1][j + 1] - divDiff[i - 1][j]) / 
                       (points[j + i].x - points[j].x);
    }
  }

  let result = divDiff[0][0];
  let product = 1;

  for (let i = 1; i < n; i++) {
    product *= (x - points[i - 1].x);
    result += product * divDiff[i][0];
  }

  return result;
}

// Generate interpolated curve points
export function generateCurvePoints(
  dataPoints: DataPoint[],
  method: 'lagrange' | 'newton-forward' | 'newton-backward' | 'newton-divided',
  resolution: number = 100
): DataPoint[] {
  if (dataPoints.length < 2) return [];

  const sortedPoints = [...dataPoints].sort((a, b) => a.x - b.x);
  const minX = sortedPoints[0].x;
  const maxX = sortedPoints[sortedPoints.length - 1].x;
  const range = maxX - minX;
  const padding = range * 0.1;

  const curvePoints: DataPoint[] = [];
  const start = minX - padding;
  const end = maxX + padding;
  const step = (end - start) / resolution;

  const interpolate = method === 'lagrange' 
    ? lagrangeInterpolation 
    : method === 'newton-forward'
    ? newtonForwardInterpolation
    : method === 'newton-backward'
    ? newtonBackwardInterpolation
    : newtonDividedDifferenceInterpolation;

  for (let x = start; x <= end; x += step) {
    const y = interpolate(sortedPoints, x);
    if (isFinite(y) && Math.abs(y) < 1e6) {
      curvePoints.push({ x, y });
    }
  }

  return curvePoints;
}

// Calculate error metrics
export function calculateError(
  dataPoints: DataPoint[],
  method: 'lagrange' | 'newton-forward' | 'newton-backward' | 'newton-divided'
): { maxError: number; avgError: number; rmsError: number } {
  if (dataPoints.length < 2) {
    return { maxError: 0, avgError: 0, rmsError: 0 };
  }

  const interpolate = method === 'lagrange' 
    ? lagrangeInterpolation 
    : method === 'newton-forward'
    ? newtonForwardInterpolation
    : method === 'newton-backward'
    ? newtonBackwardInterpolation
    : newtonDividedDifferenceInterpolation;

  const sortedPoints = [...dataPoints].sort((a, b) => a.x - b.x);
  const errors = sortedPoints.map(p => Math.abs(p.y - interpolate(sortedPoints, p.x)));

  const maxError = Math.max(...errors);
  const avgError = errors.reduce((a, b) => a + b, 0) / errors.length;
  const rmsError = Math.sqrt(errors.reduce((a, b) => a + b * b, 0) / errors.length);

  return { maxError, avgError, rmsError };
}
