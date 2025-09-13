export interface AnonymousSession {
  id: string;
  anonymousId: string;
  createdAt: Date;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  options: string[];
}

export interface AssessmentType {
  id: string;
  name: string;
  description: string;
  icon: string;
  duration: string;
  questions: AssessmentQuestion[];
  scoringKey: Record<string, number>;
}

export const ASSESSMENT_TYPES: Record<string, AssessmentType> = {
  anxiety: {
    id: "anxiety",
    name: "Anxiety Assessment",
    description: "GAD-7 questionnaire designed for college students to identify anxiety symptoms and their severity. Commonly used in campus mental health services.",
    icon: "fas fa-brain",
    duration: "5 minutes",
    questions: [
      {
        id: "1",
        question: "Over the last 2 weeks, how often have you been bothered by feeling nervous, anxious, or on edge?",
        options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
      },
      {
        id: "2", 
        question: "Over the last 2 weeks, how often have you been bothered by not being able to stop or control worrying?",
        options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
      },
      {
        id: "3",
        question: "Over the last 2 weeks, how often have you been bothered by worrying too much about different things?",
        options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
      },
      {
        id: "4",
        question: "Over the last 2 weeks, how often have you been bothered by trouble relaxing?",
        options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
      },
      {
        id: "5",
        question: "Over the last 2 weeks, how often have you been bothered by being so restless that it's hard to sit still?",
        options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
      },
      {
        id: "6",
        question: "Over the last 2 weeks, how often have you been bothered by becoming easily annoyed or irritable?",
        options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
      },
      {
        id: "7",
        question: "Over the last 2 weeks, how often have you been bothered by feeling afraid as if something awful might happen?",
        options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
      }
    ],
    scoringKey: {
      "Not at all": 0,
      "Several days": 1,
      "More than half the days": 2,
      "Nearly every day": 3
    }
  },
  depression: {
    id: "depression",
    name: "Depression Screening",
    description: "PHQ-9 questionnaire for depression screening among college students. Widely validated for young adult populations in academic settings.",
    icon: "fas fa-cloud-rain",
    duration: "7 minutes",
    questions: [
      {
        id: "1",
        question: "Over the last 2 weeks, how often have you been bothered by little interest or pleasure in doing things?",
        options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
      },
      {
        id: "2",
        question: "Over the last 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?",
        options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
      },
      {
        id: "3",
        question: "Over the last 2 weeks, how often have you been bothered by trouble falling or staying asleep, or sleeping too much?",
        options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
      },
      {
        id: "4",
        question: "Over the last 2 weeks, how often have you been bothered by feeling tired or having little energy?",
        options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
      },
      {
        id: "5",
        question: "Over the last 2 weeks, how often have you been bothered by poor appetite or overeating?",
        options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
      },
      {
        id: "6",
        question: "Over the last 2 weeks, how often have you been bothered by feeling bad about yourself - or that you are a failure or have let yourself or your family down?",
        options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
      },
      {
        id: "7",
        question: "Over the last 2 weeks, how often have you been bothered by trouble concentrating on things, such as reading the newspaper or watching television?",
        options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
      },
      {
        id: "8",
        question: "Over the last 2 weeks, how often have you been bothered by moving or speaking so slowly that other people could have noticed? Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual?",
        options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
      },
      {
        id: "9",
        question: "Over the last 2 weeks, how often have you been bothered by thoughts that you would be better off dead, or of hurting yourself?",
        options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
      }
    ],
    scoringKey: {
      "Not at all": 0,
      "Several days": 1,
      "More than half the days": 2,
      "Nearly every day": 3
    }
  },
  stress: {
    id: "stress",
    name: "Stress Level Check",
    description: "Perceived Stress Scale adapted for college students to assess stress levels related to academic and personal challenges.",
    icon: "fas fa-thermometer-half",
    duration: "4 minutes",
    questions: [
      {
        id: "1",
        question: "In the last month, how often have you been upset because of something that happened unexpectedly?",
        options: ["Never", "Almost never", "Sometimes", "Fairly often", "Very often"]
      },
      {
        id: "2",
        question: "In the last month, how often have you felt that you were unable to control the important things in your life?",
        options: ["Never", "Almost never", "Sometimes", "Fairly often", "Very often"]
      },
      {
        id: "3",
        question: "In the last month, how often have you felt nervous and stressed?",
        options: ["Never", "Almost never", "Sometimes", "Fairly often", "Very often"]
      },
      {
        id: "4",
        question: "In the last month, how often have you felt confident about your ability to handle your personal problems?",
        options: ["Never", "Almost never", "Sometimes", "Fairly often", "Very often"]
      }
    ],
    scoringKey: {
      "Never": 0,
      "Almost never": 1,
      "Sometimes": 2,
      "Fairly often": 3,
      "Very often": 4
    }
  },
  sleep: {
    id: "sleep",
    name: "Sleep Quality Index",
    description: "Sleep Quality Assessment specifically relevant for college students dealing with academic schedules and campus life demands.",
    icon: "fas fa-bed",
    duration: "6 minutes",
    questions: [
      {
        id: "1",
        question: "During the past month, how would you rate your sleep quality overall?",
        options: ["Very good", "Fairly good", "Fairly bad", "Very bad"]
      },
      {
        id: "2",
        question: "During the past month, how long (in minutes) has it usually taken you to fall asleep each night?",
        options: ["≤15 minutes", "16-30 minutes", "31-60 minutes", ">60 minutes"]
      },
      {
        id: "3",
        question: "During the past month, how many hours of actual sleep did you get at night?",
        options: [">7 hours", "6-7 hours", "5-6 hours", "<5 hours"]
      },
      {
        id: "4",
        question: "During the past month, how often have you had trouble sleeping because you wake up in the middle of the night or early morning?",
        options: ["Not during the past month", "Less than once a week", "Once or twice a week", "Three or more times a week"]
      }
    ],
    scoringKey: {
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
  }
};
