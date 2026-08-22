/**
 * RPAI Affordability Engine
 * Deterministic affordability calculations.
 * Does NOT guarantee loan approval or repayment ability.
 */

export interface AffordabilityInput {
  avgMonthlyInflow: number;
  avgMonthlyExpenses: number;
  existingMonthlyObligations: number;
  requestedLoanAmount: number;
  preferredTenureMonths: number;
  illustrativeInterestRatePercent?: number; // Default 12% p.a. for illustrative purposes
}

export interface AffordabilityResult {
  monthlyIncome: number;
  monthlyExpenses: number;
  existingObligations: number;
  estimatedFreeCashFlow: number;
  estimatedRepaymentCapacity: number; // Conservative: 40% of free cash flow
  illustrativeMonthlyEMI: number;
  affordabilityLevel: 'HIGH' | 'MODERATE' | 'LOW';
  coverageRatio: number; // repayment capacity / illustrative EMI
  disclaimer: string;
}

export function calculateAffordability(input: AffordabilityInput): AffordabilityResult {
  const {
    avgMonthlyInflow,
    avgMonthlyExpenses,
    existingMonthlyObligations,
    requestedLoanAmount,
    preferredTenureMonths,
    illustrativeInterestRatePercent = 12,
  } = input;

  const freeCashFlow = Math.max(0, avgMonthlyInflow - avgMonthlyExpenses - existingMonthlyObligations);

  // Conservative repayment capacity = 40% of free cash flow
  const repaymentCapacity = Math.round(freeCashFlow * 0.4);

  // Illustrative EMI using standard PMT formula
  const monthlyRate = illustrativeInterestRatePercent / 100 / 12;
  let illustrativeEMI: number;
  if (monthlyRate === 0) {
    illustrativeEMI = Math.round(requestedLoanAmount / preferredTenureMonths);
  } else {
    illustrativeEMI = Math.round(
      (requestedLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, preferredTenureMonths)) /
        (Math.pow(1 + monthlyRate, preferredTenureMonths) - 1)
    );
  }

  const coverageRatio = illustrativeEMI > 0 ? repaymentCapacity / illustrativeEMI : 0;

  let affordabilityLevel: 'HIGH' | 'MODERATE' | 'LOW';
  if (coverageRatio >= 1.5) affordabilityLevel = 'HIGH';
  else if (coverageRatio >= 0.8) affordabilityLevel = 'MODERATE';
  else affordabilityLevel = 'LOW';

  return {
    monthlyIncome: Math.round(avgMonthlyInflow),
    monthlyExpenses: Math.round(avgMonthlyExpenses),
    existingObligations: Math.round(existingMonthlyObligations),
    estimatedFreeCashFlow: Math.round(freeCashFlow),
    estimatedRepaymentCapacity: repaymentCapacity,
    illustrativeMonthlyEMI: illustrativeEMI,
    affordabilityLevel,
    coverageRatio: Math.round(coverageRatio * 100) / 100,
    disclaimer:
      'This is an illustrative affordability estimate only. It does not guarantee loan approval or actual repayment ability. Final assessment requires licensed lender review.',
  };
}

/**
 * Loan Simulator - Pure illustrative calculations
 */
export interface SimulatorInput {
  loanAmount: number;
  tenureMonths: number;
  illustrativeInterestRatePercent: number;
}

export interface SimulatorResult {
  loanAmount: number;
  tenureMonths: number;
  interestRatePercent: number;
  illustrativeMonthlyEMI: number;
  totalRepayment: number;
  totalInterest: number;
  disclaimer: string;
}

export function simulateLoan(input: SimulatorInput): SimulatorResult {
  const { loanAmount, tenureMonths, illustrativeInterestRatePercent } = input;
  const monthlyRate = illustrativeInterestRatePercent / 100 / 12;

  let emi: number;
  if (monthlyRate === 0) {
    emi = Math.round(loanAmount / tenureMonths);
  } else {
    emi = Math.round(
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
        (Math.pow(1 + monthlyRate, tenureMonths) - 1)
    );
  }

  const totalRepayment = emi * tenureMonths;
  const totalInterest = totalRepayment - loanAmount;

  return {
    loanAmount,
    tenureMonths,
    interestRatePercent: illustrativeInterestRatePercent,
    illustrativeMonthlyEMI: emi,
    totalRepayment,
    totalInterest,
    disclaimer:
      'This simulation is for illustrative purposes only. Actual EMI, interest rate, and terms will be determined by a licensed lender. RPAI does not offer loans.',
  };
}
