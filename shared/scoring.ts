// Assessment scoring constants
const ASSESSMENT_SCORING_KEYS: Record<string, Record<string, number>> = {
  anxiety: {
    "Not at all": 0,
    "Several days": 1,
    "More than half the days": 2,
    "Nearly every day": 3
  },
  depression: {
    "Not at all": 0,
    "Several days": 1,
    "More than half the days": 2,
    "Nearly every day": 3
  },
  stress: {
    "Never": 0,
    "Almost never": 1,
    "Sometimes": 2,
    "Fairly often": 3,
    "Very often": 4
  },
  sleep: {
    "Very good": 0,
    "Fairly good": 1,
    "Fairly bad": 2,
    "Very bad": 3,
    "≤15 minutes": 0,
    "16-30 minutes": 1,
    "31-60 minutes": 2,
    ">60 minutes": 3,
    ">7 hours": 0,
    "6-7 hours": 1,
    "5-6 hours": 2,
    "<5 hours": 3,
    "Not during the past month": 0,
    "Less than once a week": 1,
    "Once or twice a week": 2,
    "Three or more times a week": 3
  }
};

export interface ScoringResult {
  score: number;
  severity: string;
}

export function calculateAssessmentScore(
  type: string, 
  responses: Record<string, string>
): ScoringResult {
  const scoringKey = ASSESSMENT_SCORING_KEYS[type];
  if (!scoringKey) {
    throw new Error(`Unknown assessment type: ${type}`);
  }

  // Calculate score
  let totalScore = 0;
  Object.entries(responses).forEach(([questionId, answer]) => {
    const scoreValue = scoringKey[answer];
    if (scoreValue !== undefined) {
      totalScore += scoreValue;
    }
  });

  // Calculate severity
  const severity = getSeverityLevel(totalScore, type);

  return { score: totalScore, severity };
}

function getSeverityLevel(score: number, type: string): string {
  switch (type) {
    case "anxiety":
      if (score <= 4) return "Minimal";
      if (score <= 9) return "Mild";
      if (score <= 14) return "Moderate";
      return "Severe";
    case "depression":
      // PHQ-9 standard thresholds
      if (score <= 4) return "Minimal";
      if (score <= 9) return "Mild";
      if (score <= 14) return "Moderate";
      if (score <= 19) return "Moderately Severe";
      return "Severe";
    case "stress":
      // Fixed thresholds for 4-question assessment (max score 16)
      if (score <= 5) return "Low";
      if (score <= 11) return "Moderate";
      return "High";
    case "sleep":
      if (score <= 5) return "Good";
      if (score <= 10) return "Fair";
      return "Poor";
    default:
      return "Unknown";
  }
}