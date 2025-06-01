const mentalAgeQuestionnaire = {
  spiritualAnchoring: {
    weight: "25%",
    subjective: [
      {
        id: "Q1",
        question: "What does 'letting go' mean to you at this stage of life?",
        weight: 12,
        criteria: ["depth of thought", "peace", "non-attachment", "gratitude"]
      },
      {
        id: "Q2",
        question: "Have you ever felt divine presence or energy guiding your life? Please share an incident.",
        weight: 8,
        criteria: ["reflective ability", "transcendental thinking", "calm tone"]
      },
      {
        id: "Q3",
        question: "What gives your life meaning at this stage?",
        weight: 5
      }
    ],
    objective: [
      {
        question: "Do you reflect on your actions daily (through prayer/journal)?",
        weight: 3,
        options: {
          A: { text: "Yes, daily", score: 3 },
          B: { text: "Sometimes", score: 2 },
          C: { text: "Rarely", score: 1 },
          D: { text: "Never", score: 0 }
        }
      },
      {
        question: "Do you participate in bhajans, meditation, or reading of scriptures?",
        weight: 5,
        options: {
          A: { text: "Regularly", score: 5 },
          B: { text: "Occasionally", score: 3 },
          C: { text: "Not interested", score: 0 }
        }
      }
    ]
  },

  communityInvolvement: {
    weight: "20%",
    subjective: [
      {
        id: "Q1",
        question: "What does 'being useful to others' mean to you now? Share a moment.",
        weight: 10
      },
      {
        id: "Q2",
        question: "Describe a moment when you helped a stranger or neighbor without expecting anything.",
        weight: 10
      }
    ],
    objective: [
      {
        question: "Do you talk to strangers (vendors, neighbors, children) with joy or curiosity?",
        weight: 5,
        options: {
          A: { text: "Yes, regularly", score: 5 },
          B: { text: "Sometimes", score: 3 },
          C: { text: "No", score: 0 }
        }
      },
      {
        question: "Do you guide or mentor younger generations (e.g., grandkids, colony youth)?",
        weight: 5,
        options: {
          A: { text: "Yes, often", score: 5 },
          B: { text: "Sometimes", score: 3 },
          C: { text: "Never", score: 0 }
        }
      }
    ]
  },

  cognitiveFunction: {
    weight: "15%",
    subjective: [
      {
        id: "Q1",
        question: "Describe your last week’s routine in order.",
        weight: 7,
        criteria: ["flow", "memory", "attention to detail"]
      },
      {
        id: "Q2",
        question: "Describe one memory from your childhood that still guides you today.",
        weight: 5,
        criteria: ["emotional recall", "narrative detail"]
      }
    ],
    objective: [
      {
        question: "Do you remember today’s date and day?",
        weight: 3,
        options: {
          A: { text: "Yes", score: 3 },
          B: { text: "No", score: 0 }
        }
      },
      {
        question: "Can you recall 3 events from last month?",
        weight: 5,
        options: {
          A: { text: "Yes", score: 5 },
          B: { text: "Only 1 or 2", score: 2 },
          C: { text: "Can’t recall", score: 0 }
        }
      }
    ]
  },

  emotionalFlexibility: {
    weight: "15%",
    subjective: [
      {
        id: "Q1",
        question: "Describe a recent situation where your plan didn’t go as expected. How did you respond?",
        weight: 10,
        criteria: ["acceptance", "humour", "problem-solving"]
      },
      {
        id: "Q2",
        question: "How do you feel when someone disagrees with your ideas or decisions?",
        weight: 5,
        criteria: ["openness", "self-reflection"]
      }
    ],
    objective: [
      {
        question: "If someone younger corrects you, what’s your reaction?",
        weight: 5,
        options: {
          A: { text: "I accept and thank them", score: 5 },
          B: { text: "I argue first, but reflect later", score: 3 },
          C: { text: "I don’t like being corrected", score: 0 }
        }
      }
    ]
  },

  thematicAppreciation: {
    weight: "15%",
    subjective: [
      {
        id: "Q1",
        question: "A man walks alone on a village path at dusk holding a lantern. Write a 5-line story based on this image.",
        weight: 10,
        criteria: ["empathy", "symbolic interpretation", "meaning"]
      },
      {
        id: "Q2",
        question: "If life were a river, what would be your role in it now?",
        weight: 5,
        criteria: ["metaphor understanding", "self-placement"]
      }
    ],
    objective: [
      {
        question: "What does a banyan tree symbolize to you?",
        weight: 5,
        options: {
          A: { text: "Strength, Wisdom, Legacy", score: 5 },
          B: { text: "Old age and shade", score: 3 },
          C: { text: "Just a tree", score: 1 },
          D: { text: "No idea", score: 0 }
        }
      }
    ]
  }
};
export default mentalAgeQuestionnaire;