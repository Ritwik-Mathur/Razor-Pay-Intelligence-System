/**
 * RPAI Cash-Flow Intelligence Engine
 * Deterministic calculations only. No LLM involvement in financial computations.
 */

export interface CashFlowInput {
  monthlyInflows: number[];  // Last 6 months
  monthlyOutflows: number[]; // Last 6 months
}

export interface CashFlowResult {
  avgMonthlyInflow: number;
  avgMonthlyOutflow: number;
  netMonthlyCashFlow: number;
  cashFlowVolatility: number;       // 0-100, lower = more stable
  cashFlowStabilityScore: number;   // 0-100, higher = more stable
  incomeConsistencyScore: number;   // 0-100
  negativeCashFlowMonths: number;
  cashFlowTrend: 'IMPROVING' | 'STABLE' | 'DECLINING';
}

function average(arr: number[]): number {
  if (!arr.length) return 0;
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}

function standardDeviation(arr: number[]): number {
  if (arr.length < 2) return 0;
  const avg = average(arr);
  const variance = arr.reduce((s, v) => s + Math.pow(v - avg, 2), 0) / arr.length;
  return Math.sqrt(variance);
}

export function analyzeCashFlow(input: CashFlowInput): CashFlowResult {
  const { monthlyInflows, monthlyOutflows } = input;

  const avg_in = average(monthlyInflows);
  const avg_out = average(monthlyOutflows);
  const net = avg_in - avg_out;

  // Volatility: coefficient of variation on net flows (0-100)
  const nets = monthlyInflows.map((inf, i) => inf - (monthlyOutflows[i] || 0));
  const netStdDev = standardDeviation(nets);
  const avgNet = average(nets);
  const cv = avgNet !== 0 ? Math.min((netStdDev / Math.abs(avgNet)) * 100, 100) : 100;
  const volatility = Math.round(cv);

  // Stability score is inverse of volatility
  const stabilityScore = Math.max(0, Math.round(100 - volatility));

  // Income consistency: how stable are the inflows
  const inflowStdDev = standardDeviation(monthlyInflows);
  const inflowCV = avg_in !== 0 ? Math.min((inflowStdDev / avg_in) * 100, 100) : 100;
  const incomeConsistency = Math.max(0, Math.round(100 - inflowCV));

  // Negative cash-flow months
  const negativeCFMonths = nets.filter(n => n < 0).length;

  // Trend: compare last 3 months vs first 3 months
  const firstHalf = nets.slice(0, 3);
  const secondHalf = nets.slice(3);
  const firstAvg = average(firstHalf);
  const secondAvg = average(secondHalf);

  let trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
  if (secondAvg > firstAvg * 1.1) trend = 'IMPROVING';
  else if (secondAvg < firstAvg * 0.9) trend = 'DECLINING';
  else trend = 'STABLE';

  return {
    avgMonthlyInflow: Math.round(avg_in),
    avgMonthlyOutflow: Math.round(avg_out),
    netMonthlyCashFlow: Math.round(net),
    cashFlowVolatility: volatility,
    cashFlowStabilityScore: stabilityScore,
    incomeConsistencyScore: incomeConsistency,
    negativeCashFlowMonths: negativeCFMonths,
    cashFlowTrend: trend,
  };
}
