/**
 * RPAI Alternative Credit Scoring Engine
 * 
 * Architecture: RuleBasedCreditScoringEngine (transparent, weighted, deterministic)
 * Interface: CreditScoringEngine (future: MLCreditScoringEngine can replace)
 * 
 * Score range: 300 - 900 (matching standard credit score conventions)
 * 
 * RESPONSIBLE LENDING:
 * - Does NOT use race, religion, caste, gender, sexual orientation, health conditions
 * - Does NOT guarantee loan approval
 * - All factor weights are configurable
 */

import { ICreditProfile } from '../models/CreditProfile.js';
import { IBehaviorAssessment } from '../models/BehaviorAssessment.js';
import { ICreditApplication } from '../models/CreditApplication.js';
import { IScoreComponent, RiskLevel, RecommendationType } from '../models/CreditAssessment.js';

// ─── Configurable Scoring Weights ─────────────────────────────────────────────
// These weights must sum to 1.0. Adjust here for recalibration.
export const SCORING_WEIGHTS = {
  cashFlowStability:      0.28,
  paymentConsistency:     0.22,
  businessActivity:       0.18,
  repaymentBehavior:      0.15,
  merchantReputation:     0.10,
  financialBehavior:      0.07,
} as const;

// ─── Interface for future ML engine replacement ────────────────────────────────
export interface CreditScoringEngine {
  score(profile: ICreditProfile, behavior: IBehaviorAssessment | null, application: ICreditApplication): CreditScoreResult;
}

export interface CreditScoreResult {
  alternativeCreditScore: number;          // 300-900
  riskLevel: RiskLevel;
  confidence: number;                      // 0-100
  components: IScoreComponent[];
  positiveFactors: string[];
  riskFactors: string[];
  missingData: string[];
  aiExplanation: string;
  recommendation: RecommendationType;
}

// ─── Rule-Based Engine Implementation ─────────────────────────────────────────
export class RuleBasedCreditScoringEngine implements CreditScoringEngine {

  score(
    profile: ICreditProfile,
    behavior: IBehaviorAssessment | null,
    application: ICreditApplication
  ): CreditScoreResult {

    const positiveFactors: string[] = [];
    const riskFactors: string[] = [];
    const missingData: string[] = [];
    const components: IScoreComponent[] = [];

    // ── Component 1: Cash Flow Stability (28%) ──────────────────────────────
    const cashFlowRaw = profile.cashFlowStabilityScore ?? 0;
    const cashFlowPositive: string[] = [];
    const cashFlowNegative: string[] = [];

    if (cashFlowRaw >= 75) cashFlowPositive.push('Stable and consistent monthly cash flows');
    else if (cashFlowRaw >= 50) cashFlowPositive.push('Moderate cash flow consistency');
    else cashFlowNegative.push('High cash flow volatility observed');

    if (profile.netMonthlyCashFlow > 0) cashFlowPositive.push('Positive net monthly cash flow');
    else if (profile.netMonthlyCashFlow < 0) cashFlowNegative.push('Negative net monthly cash flow');

    if (cashFlowPositive.length) positiveFactors.push(...cashFlowPositive);
    if (cashFlowNegative.length) riskFactors.push(...cashFlowNegative);

    const cashFlowWeighted = SCORING_WEIGHTS.cashFlowStability * cashFlowRaw;
    components.push({
      name: 'Cash Flow Stability',
      weight: SCORING_WEIGHTS.cashFlowStability,
      rawScore: cashFlowRaw,
      weightedScore: cashFlowWeighted,
      positiveFactors: cashFlowPositive,
      negativeFactors: cashFlowNegative,
    });

    // ── Component 2: Payment Consistency (22%) ──────────────────────────────
    const paymentRaw = profile.paymentConsistencyScore ?? 0;
    const paymentPositive: string[] = [];
    const paymentNegative: string[] = [];

    if (profile.successfulPaymentRatio >= 0.95) paymentPositive.push('Very high payment success rate (≥95%)');
    else if (profile.successfulPaymentRatio >= 0.85) paymentPositive.push('High payment success rate (≥85%)');
    else paymentNegative.push('Below-average payment success rate');

    if (profile.failedPaymentRatio > 0.1) paymentNegative.push('Elevated failed payment ratio');
    if (profile.refundRatio > 0.15) paymentNegative.push('High refund ratio detected');
    if (profile.transactionFrequency >= 10) paymentPositive.push('Active and frequent transaction history');
    else if (profile.transactionFrequency < 3) missingData.push('Limited transaction history available');

    if (paymentPositive.length) positiveFactors.push(...paymentPositive);
    if (paymentNegative.length) riskFactors.push(...paymentNegative);

    const paymentWeighted = SCORING_WEIGHTS.paymentConsistency * paymentRaw;
    components.push({
      name: 'Payment Consistency',
      weight: SCORING_WEIGHTS.paymentConsistency,
      rawScore: paymentRaw,
      weightedScore: paymentWeighted,
      positiveFactors: paymentPositive,
      negativeFactors: paymentNegative,
    });

    // ── Component 3: Business Activity (18%) ───────────────────────────────
    const businessPositive: string[] = [];
    const businessNegative: string[] = [];
    let businessRaw = profile.businessStabilityScore ?? 50;

    if (application.businessAgeMonths && application.businessAgeMonths >= 24) {
      businessPositive.push('Business operating for 2+ years');
      businessRaw = Math.min(100, businessRaw + 10);
    } else if (application.businessAgeMonths && application.businessAgeMonths < 6) {
      businessNegative.push('Business operating less than 6 months');
      businessRaw = Math.max(0, businessRaw - 15);
    }

    if (profile.avgMonthlyInflow > 50000) businessPositive.push('Significant monthly revenue activity');
    if (profile.incomeConsistencyScore >= 70) businessPositive.push('Consistent monthly income pattern');

    if (businessPositive.length) positiveFactors.push(...businessPositive);
    if (businessNegative.length) riskFactors.push(...businessNegative);

    const businessWeighted = SCORING_WEIGHTS.businessActivity * businessRaw;
    components.push({
      name: 'Business Activity',
      weight: SCORING_WEIGHTS.businessActivity,
      rawScore: businessRaw,
      weightedScore: businessWeighted,
      positiveFactors: businessPositive,
      negativeFactors: businessNegative,
    });

    // ── Component 4: Repayment Behavior (15%) ──────────────────────────────
    const repayPositive: string[] = [];
    const repayNegative: string[] = [];
    let repayRaw = 60; // Default neutral when no repayment history

    if (behavior) {
      repayRaw = behavior.repaymentDisciplineScore ?? 60;
      if (repayRaw >= 80) repayPositive.push('Strong repayment discipline (self-reported)');
      else if (repayRaw < 50) repayNegative.push('Repayment discipline concerns indicated');
    } else {
      missingData.push('Repayment behavior questionnaire not completed');
    }

    if (repayPositive.length) positiveFactors.push(...repayPositive);
    if (repayNegative.length) riskFactors.push(...repayNegative);

    const repayWeighted = SCORING_WEIGHTS.repaymentBehavior * repayRaw;
    components.push({
      name: 'Repayment Behavior',
      weight: SCORING_WEIGHTS.repaymentBehavior,
      rawScore: repayRaw,
      weightedScore: repayWeighted,
      positiveFactors: repayPositive,
      negativeFactors: repayNegative,
    });

    // ── Component 5: Merchant Reputation (10%) ─────────────────────────────
    const reputationRaw = profile.merchantReputationScore ?? 0;
    const reputationPositive: string[] = [];
    const reputationNegative: string[] = [];

    if (reputationRaw === 0) {
      missingData.push('Merchant reputation data not connected');
    } else if (reputationRaw >= 75) {
      reputationPositive.push('Strong merchant reputation indicators');
    } else if (reputationRaw < 40) {
      reputationNegative.push('Below-average merchant reputation signals');
    }

    const reputationWeighted = SCORING_WEIGHTS.merchantReputation * (reputationRaw || 50);
    components.push({
      name: 'Merchant Reputation',
      weight: SCORING_WEIGHTS.merchantReputation,
      rawScore: reputationRaw || 50,
      weightedScore: reputationWeighted,
      positiveFactors: reputationPositive,
      negativeFactors: reputationNegative,
    });

    // ── Component 6: Financial Behavior Assessment (7%) ─────────────────────
    const behaviorPositive: string[] = [];
    const behaviorNegative: string[] = [];
    let behaviorRaw = 60;

    if (behavior) {
      behaviorRaw = behavior.overallBehaviorScore ?? 60;
      if (behaviorRaw >= 75) behaviorPositive.push('Positive financial behavior & planning profile');
      else if (behaviorRaw < 50) behaviorNegative.push('Financial behavior questionnaire indicates areas of concern');
    } else {
      missingData.push('Financial behavior questionnaire not completed');
    }

    if (behaviorPositive.length) positiveFactors.push(...behaviorPositive);
    if (behaviorNegative.length) riskFactors.push(...behaviorNegative);

    const behaviorWeighted = SCORING_WEIGHTS.financialBehavior * behaviorRaw;
    components.push({
      name: 'Financial Behavior Assessment',
      weight: SCORING_WEIGHTS.financialBehavior,
      rawScore: behaviorRaw,
      weightedScore: behaviorWeighted,
      positiveFactors: behaviorPositive,
      negativeFactors: behaviorNegative,
    });

    // ── Composite Score: Map 0-100 weighted sum → 300-900 ──────────────────
    const totalWeightedRaw =
      cashFlowWeighted +
      paymentWeighted +
      businessWeighted +
      repayWeighted +
      (reputationRaw || 50) * SCORING_WEIGHTS.merchantReputation +
      behaviorWeighted;

    // Scale: raw 0-100 → 300-900 (range 600)
    const alternativeCreditScore = Math.round(300 + (totalWeightedRaw / 100) * 600);
    const clampedScore = Math.max(300, Math.min(900, alternativeCreditScore));

    // ── Risk Level Classification ───────────────────────────────────────────
    let riskLevel: RiskLevel;
    if (clampedScore >= 800)      riskLevel = 'LOW';
    else if (clampedScore >= 700) riskLevel = 'LOW_MODERATE';
    else if (clampedScore >= 580) riskLevel = 'MODERATE';
    else if (clampedScore >= 450) riskLevel = 'HIGH';
    else                          riskLevel = 'VERY_HIGH';

    // ── Confidence: Based on data completeness ──────────────────────────────
    const confidence = Math.round(profile.dataCompleteness * 0.9);

    // ── Recommendation ──────────────────────────────────────────────────────
    let recommendation: RecommendationType;
    if (riskLevel === 'LOW' || riskLevel === 'LOW_MODERATE') {
      recommendation = 'PROCEED_TO_LENDER_REVIEW';
    } else if (riskLevel === 'MODERATE') {
      recommendation = missingData.length > 2 ? 'ADDITIONAL_INFORMATION_REQUIRED' : 'MANUAL_REVIEW_RECOMMENDED';
    } else {
      recommendation = 'HIGH_RISK_FURTHER_ASSESSMENT_REQUIRED';
    }

    // ── AI Explanation (Grounded in derived features, no raw data to LLM) ──
    const topPositive = positiveFactors.slice(0, 3);
    const topRisk = riskFactors.slice(0, 2);

    const aiExplanation = `RPAI Alternative Credit Score: ${clampedScore}/900 (${riskLevel.replace('_', '-')})

This assessment is based on ${profile.dataCompleteness}% data completeness across ${profile.availableSources.length} connected data sources.

${topPositive.length ? `Positive Signals:\n${topPositive.map(f => `• ${f}`).join('\n')}` : ''}

${topRisk.length ? `Areas of Concern:\n${topRisk.map(f => `• ${f}`).join('\n')}` : ''}

${missingData.length ? `Missing Information:\n${missingData.map(m => `• ${m}`).join('\n')}` : ''}

IMPORTANT: This is an AI-assisted financial risk assessment for informational and lender-review purposes only. It does not constitute a loan approval, credit guarantee, or financial advice.`;

    return {
      alternativeCreditScore: clampedScore,
      riskLevel,
      confidence,
      components,
      positiveFactors: [...new Set(positiveFactors)],
      riskFactors: [...new Set(riskFactors)],
      missingData: [...new Set(missingData)],
      aiExplanation,
      recommendation,
    };
  }
}

// Singleton export
export const creditScoringEngine: CreditScoringEngine = new RuleBasedCreditScoringEngine();
