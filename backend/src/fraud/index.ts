export interface FraudEvaluationInput {
  amount: number;
  ip?: string;
  cardBin?: string;
  customerAvgAmount?: number;
  velocityCountWindow?: number; // Txns in last 3 mins
  isNewPaymentMethod?: boolean;
  isNewDevice?: boolean;
  isUnusualLocation?: boolean;
  failedAttemptsCount?: number;
  historicalFraudPattern?: boolean;
  transactionHour?: number;
}

export interface FraudEvaluationResult {
  score: number;
  level: 'low' | 'medium' | 'high' | 'critical';
  factors: string[];
  recommendedAction: string;
  potentialImpact: string;
  breakdown: Record<string, number>;
}

/**
 * Deterministic Rule-Based Fraud Risk Engine for RPAI
 * Evaluates payment telemetry against objective risk rules.
 */
export function calculateRiskScore(input: FraudEvaluationInput): FraudEvaluationResult {
  let rawScore = 0;
  const factors: string[] = [];
  const breakdown: Record<string, number> = {};

  const {
    amount,
    customerAvgAmount = 15000,
    velocityCountWindow = 1,
    isNewPaymentMethod = false,
    isNewDevice = false,
    isUnusualLocation = false,
    failedAttemptsCount = 0,
    historicalFraudPattern = false,
    transactionHour = new Date().getHours(),
  } = input;

  // 1. Amount Anomaly Rule (+25)
  if (amount > customerAvgAmount * 3 || amount > 100000) {
    const pts = 25;
    rawScore += pts;
    breakdown['Amount Anomaly'] = pts;
    factors.push(`Amount (₹${amount.toLocaleString('en-IN')}) significantly exceeds customer historical average (₹${customerAvgAmount.toLocaleString('en-IN')}).`);
  } else if (amount > customerAvgAmount * 1.8) {
    const pts = 12;
    rawScore += pts;
    breakdown['Moderate Amount Spike'] = pts;
    factors.push(`Amount is 1.8x higher than customer average.`);
  }

  // 2. Transaction Velocity Rule (+10)
  if (velocityCountWindow >= 4) {
    const pts = 10;
    rawScore += pts;
    breakdown['High Velocity'] = pts;
    factors.push(`High velocity burst detected: ${velocityCountWindow} payment attempts within 3 minutes.`);
  }

  // 3. New Payment Method / Device Rule (+20)
  if (isNewPaymentMethod || isNewDevice) {
    const pts = 20;
    rawScore += pts;
    breakdown['Unrecognized Device/Method'] = pts;
    factors.push(`Transaction initiated from a new device footprint or unverified payment method.`);
  }

  // 4. Unusual Location / Anonymized VPN Rule (+20)
  if (isUnusualLocation) {
    const pts = 20;
    rawScore += pts;
    breakdown['Location Anomaly'] = pts;
    factors.push(`IP routing originates from an unusual geographic region or anonymized VPN node.`);
  }

  // 5. Multiple Failed Attempts Rule (+15)
  if (failedAttemptsCount >= 2) {
    const pts = 15;
    rawScore += pts;
    breakdown['Repeated Failed Attempts'] = pts;
    factors.push(`Multiple prior failed payment attempts (${failedAttemptsCount} drops) recorded.`);
  }

  // 6. Historical Fraud Pattern Rule (+25)
  if (historicalFraudPattern) {
    const pts = 25;
    rawScore += pts;
    breakdown['Historical Fraud Match'] = pts;
    factors.push(`Card BIN or customer email matches high-risk dispute pattern.`);
  }

  // 7. Unusual Transaction Time Rule (+10)
  if (transactionHour >= 1 && transactionHour <= 4) {
    const pts = 10;
    rawScore += pts;
    breakdown['Off-peak Hours'] = pts;
    factors.push(`Transaction placed during off-peak velocity window (01:00 - 04:00 AM).`);
  }

  // Base score minimum
  if (factors.length === 0) {
    rawScore = 8;
    factors.push('Normal purchasing velocity and verified device footprint.');
  }

  // Normalize score between 0 and 100
  const score = Math.min(Math.max(rawScore, 0), 100);

  // Categorize Risk Level strictly according to spec
  let level: 'low' | 'medium' | 'high' | 'critical' = 'low';
  let recommendedAction = 'Approve payment transaction';
  let potentialImpact = 'Minimal risk. Proceed with standard merchant capture.';

  if (score >= 81) {
    level = 'critical';
    recommendedAction = 'Hold for manual review / Require 2FA re-verification';
    potentialImpact = 'High probability of unauthorized chargeback or fraudulent card test.';
  } else if (score >= 61) {
    level = 'high';
    recommendedAction = 'Challenge step-up 2FA / Review BIN security telemetry';
    potentialImpact = 'Elevated payment drop risk due to velocity or device mismatch.';
  } else if (score >= 31) {
    level = 'medium';
    recommendedAction = 'Proceed with automated Razorpay Test Mode monitoring';
    potentialImpact = 'Moderate risk variance. Monitor for retry bursts.';
  }

  return {
    score,
    level,
    factors,
    recommendedAction,
    potentialImpact,
    breakdown,
  };
}
