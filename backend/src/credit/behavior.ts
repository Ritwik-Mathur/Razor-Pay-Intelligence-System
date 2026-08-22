/**
 * RPAI Behavioral Feature Extraction
 * Derives behavioral dimension scores from questionnaire responses.
 * 
 * IMPORTANT: This is a "Financial Behavior & Risk Questionnaire", NOT a clinically validated
 * psychometric test. Results should be used as one input only, never as sole basis for assessment.
 */

export interface QuestionnaireAnswer {
  questionId: string;
  answer: number; // 1-5 scale (1=Never/Strongly Disagree, 5=Always/Strongly Agree)
}

export interface BehaviorScores {
  financialPlanningScore: number;        // 0-100
  repaymentDisciplineScore: number;      // 0-100
  emergencyPreparednessScore: number;    // 0-100
  incomeStabilityScore: number;          // 0-100
  businessContinuityScore: number;       // 0-100
  riskAwarenessScore: number;            // 0-100
  financialDecisionConsistencyScore: number; // 0-100
  overallBehaviorScore: number;          // 0-100 weighted composite
}

/**
 * Questionnaire question map: questionId → dimension + direction
 * direction: 1 = agree is positive, -1 = agree is negative
 */
const QUESTION_MAP: Record<string, { dimension: keyof Omit<BehaviorScores, 'overallBehaviorScore'>; direction: 1 | -1 }> = {
  q1:  { dimension: 'financialPlanningScore',           direction: 1  },
  q2:  { dimension: 'financialPlanningScore',           direction: 1  },
  q3:  { dimension: 'repaymentDisciplineScore',         direction: 1  },
  q4:  { dimension: 'repaymentDisciplineScore',         direction: -1 }, // Reversed: "I sometimes delay payments"
  q5:  { dimension: 'emergencyPreparednessScore',       direction: 1  },
  q6:  { dimension: 'emergencyPreparednessScore',       direction: 1  },
  q7:  { dimension: 'incomeStabilityScore',             direction: 1  },
  q8:  { dimension: 'incomeStabilityScore',             direction: -1 }, // Reversed: "Income varies greatly month to month"
  q9:  { dimension: 'businessContinuityScore',          direction: 1  },
  q10: { dimension: 'businessContinuityScore',          direction: 1  },
  q11: { dimension: 'riskAwarenessScore',               direction: 1  },
  q12: { dimension: 'riskAwarenessScore',               direction: 1  },
  q13: { dimension: 'financialDecisionConsistencyScore', direction: 1  },
  q14: { dimension: 'financialDecisionConsistencyScore', direction: -1 },
};

const DIMENSION_WEIGHTS: Record<keyof Omit<BehaviorScores, 'overallBehaviorScore'>, number> = {
  financialPlanningScore:           0.20,
  repaymentDisciplineScore:         0.25,
  emergencyPreparednessScore:       0.15,
  incomeStabilityScore:             0.15,
  businessContinuityScore:          0.10,
  riskAwarenessScore:               0.10,
  financialDecisionConsistencyScore: 0.05,
};

export function computeBehaviorScores(answers: QuestionnaireAnswer[]): BehaviorScores {
  const dimensionSums: Record<string, { total: number; count: number }> = {};

  for (const { questionId, answer } of answers) {
    const mapping = QUESTION_MAP[questionId];
    if (!mapping) continue;
    const { dimension, direction } = mapping;
    const normalizedScore = direction === 1 ? answer : (6 - answer); // reverse scoring
    if (!dimensionSums[dimension]) dimensionSums[dimension] = { total: 0, count: 0 };
    dimensionSums[dimension].total += normalizedScore;
    dimensionSums[dimension].count += 1;
  }

  // Convert 1-5 scale to 0-100
  const toScore = (dim: string) => {
    const d = dimensionSums[dim];
    if (!d || d.count === 0) return 50; // Neutral default for missing answers
    const avg = d.total / d.count; // 1-5
    return Math.round(((avg - 1) / 4) * 100);
  };

  const fp   = toScore('financialPlanningScore');
  const rd   = toScore('repaymentDisciplineScore');
  const ep   = toScore('emergencyPreparednessScore');
  const is_  = toScore('incomeStabilityScore');
  const bc   = toScore('businessContinuityScore');
  const ra   = toScore('riskAwarenessScore');
  const fdc  = toScore('financialDecisionConsistencyScore');

  const overall = Math.round(
    fp  * DIMENSION_WEIGHTS.financialPlanningScore +
    rd  * DIMENSION_WEIGHTS.repaymentDisciplineScore +
    ep  * DIMENSION_WEIGHTS.emergencyPreparednessScore +
    is_ * DIMENSION_WEIGHTS.incomeStabilityScore +
    bc  * DIMENSION_WEIGHTS.businessContinuityScore +
    ra  * DIMENSION_WEIGHTS.riskAwarenessScore +
    fdc * DIMENSION_WEIGHTS.financialDecisionConsistencyScore
  );

  return {
    financialPlanningScore:            fp,
    repaymentDisciplineScore:          rd,
    emergencyPreparednessScore:        ep,
    incomeStabilityScore:              is_,
    businessContinuityScore:           bc,
    riskAwarenessScore:                ra,
    financialDecisionConsistencyScore: fdc,
    overallBehaviorScore:              overall,
  };
}

/**
 * Return questionnaire questions for display
 */
export const QUESTIONNAIRE_QUESTIONS = [
  { id: 'q1',  text: 'I maintain a monthly budget and track my expenses.', dimension: 'Financial Planning' },
  { id: 'q2',  text: 'I set financial goals and work towards them regularly.', dimension: 'Financial Planning' },
  { id: 'q3',  text: 'I always pay my bills and EMIs on time.', dimension: 'Repayment Discipline' },
  { id: 'q4',  text: 'I sometimes delay payments when cash is tight.', dimension: 'Repayment Discipline' },
  { id: 'q5',  text: 'I have savings set aside for emergencies.', dimension: 'Emergency Preparedness' },
  { id: 'q6',  text: 'My business can survive at least 3 months without new revenue.', dimension: 'Emergency Preparedness' },
  { id: 'q7',  text: 'My monthly income is relatively predictable.', dimension: 'Income Stability' },
  { id: 'q8',  text: 'My income varies greatly from month to month.', dimension: 'Income Stability' },
  { id: 'q9',  text: 'My business has consistent customer demand.', dimension: 'Business Continuity' },
  { id: 'q10', text: 'I have multiple revenue streams or customers.', dimension: 'Business Continuity' },
  { id: 'q11', text: 'I understand the risks before taking on new financial commitments.', dimension: 'Risk Awareness' },
  { id: 'q12', text: 'I review my financial position before making major decisions.', dimension: 'Risk Awareness' },
  { id: 'q13', text: 'My financial decisions are consistent with my long-term goals.', dimension: 'Decision Consistency' },
  { id: 'q14', text: 'I have made impulsive financial decisions I later regretted.', dimension: 'Decision Consistency' },
];
