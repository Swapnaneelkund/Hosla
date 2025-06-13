const mentalAgeQuestionnaire = {
  SpiritualAnchoring: {
    weight: "25%",
    Subjective: [
      {
        id: "Q1",
        question: {
          en: "What does 'letting go' mean to you at this stage of life?",
          hi: "इस जीवन के चरण में 'छोड़ देना' आपके लिए क्या मायने रखता है?",
          bn: "এই জীবনের পর্যায়ে 'ছেড়ে দেওয়া' আপনার জন্য কী অর্থ বহন করে?"
        },
        weight: 12,
        criteria: ["depth of thought", "peace", "non-attachment", "gratitude"]
      },
      {
        id: "Q2",
        question: {
          en: "Have you ever felt divine presence or energy guiding your life? Please share an incident.",
          hi: "क्या आपने कभी अपने जीवन में दिव्य उपस्थिति या ऊर्जा का मार्गदर्शन महसूस किया है? कृपया एक घटना साझा करें।",
          bn: "আপনি কি কখনও আপনার জীবনে ঐশ্বরিক উপস্থিতি বা শক্তির নির্দেশনা অনুভব করেছেন? একটি ঘটনা শেয়ার করুন।"
        },
        weight: 8,
        criteria: ["reflective ability", "transcendental thinking", "calm tone"]
      },
      {
        id: "Q3",
        question: {
          en: "What gives your life meaning at this stage?",
          hi: "इस जीवन के चरण में आपके जीवन को क्या अर्थ देता है?",
          bn: "এই পর্যায়ে আপনার জীবনে কী অর্থ নিয়ে আসে?"
        },
        weight: 5
      }
    ],
    Objective: [
      {
        question: {
          en: "Do you reflect on your actions daily (through prayer/journal)?",
          hi: "क्या आप प्रतिदिन अपने कार्यों पर विचार करते हैं (प्रार्थना/जर्नल के माध्यम से)?",
          bn: "আপনি কি প্রতিদিন আপনার কাজ নিয়ে ভাবেন (প্রার্থনা/জার্নালের মাধ্যমে)?"
        },
        weight: 3,
        options: {
          A: { text: { en: "Yes, daily", hi: "हाँ, रोज़", bn: "হ্যাঁ, প্রতিদিন" }, score: 3 },
          B: { text: { en: "Sometimes", hi: "कभी-कभी", bn: "মাঝে মাঝে" }, score: 2 },
          C: { text: { en: "Rarely", hi: "कभी-कभार", bn: "কদাচিৎ" }, score: 1 },
          D: { text: { en: "Never", hi: "कभी नहीं", bn: "কখনও না" }, score: 0 }
        }
      },
      {
        question: {
          en: "Do you participate in bhajans, meditation, or reading of scriptures?",
          hi: "क्या आप भजन, ध्यान या शास्त्रों के पठन में भाग लेते हैं?",
          bn: "আপনি কি ভজন, ধ্যান বা শাস্ত্র পাঠে অংশগ্রহণ করেন?"
        },
        weight: 5,
        options: {
          A: { text: { en: "Regularly", hi: "नियमित रूप से", bn: "নিয়মিত" }, score: 5 },
          B: { text: { en: "Occasionally", hi: "कभी-कभी", bn: "মাঝে মাঝে" }, score: 3 },
          C: { text: { en: "Not interested", hi: "रुचि नहीं है", bn: "আগ্রহ নেই" }, score: 0 }
        }
      }
    ]
  },

  CommunityInvolvement: {
    weight: "20%",
    Subjective: [
      {
        id: "Q1",
        question: {
          en: "What does 'being useful to others' mean to you now? Share a moment.",
          hi: "अब आपके लिए 'दूसरों के लिए उपयोगी होना' क्या मायने रखता है? कोई पल साझा करें।",
          bn: "এখন আপনার কাছে 'অন্যদের জন্য উপকারী হওয়া' কী অর্থ বহন করে? একটি মুহূর্ত শেয়ার করুন।"
        },
        weight: 10
      },
      {
        id: "Q2",
        question: {
          en: "Describe a moment when you helped a stranger or neighbor without expecting anything.",
          hi: "ऐसा कोई पल बताएं जब आपने किसी अजनबी या पड़ोसी की बिना किसी अपेक्षा के मदद की हो।",
          bn: "একটি মুহূর্ত বর্ণনা করুন যখন আপনি কোনো অপরিচিত বা প্রতিবেশীকে কিছু প্রত্যাশা না করেই সাহায্য করেছিলেন।"
        },
        weight: 10
      }
    ],
    Objective: [
      {
        question: {
          en: "Do you talk to strangers (vendors, neighbors, children) with joy or curiosity?",
          hi: "क्या आप अजनबियों (विक्रेताओं, पड़ोसियों, बच्चों) से खुशी या जिज्ञासा के साथ बात करते हैं?",
          bn: "আপনি কি অপরিচিতদের (বিক্রেতা, প্রতিবেশী, শিশু) সঙ্গে আনন্দ বা কৌতূহল নিয়ে কথা বলেন?"
        },
        weight: 5,
        options: {
          A: { text: { en: "Yes, regularly", hi: "हाँ, नियमित रूप से", bn: "হ্যাঁ, নিয়মিত" }, score: 5 },
          B: { text: { en: "Sometimes", hi: "कभी-कभी", bn: "মাঝে মাঝে" }, score: 3 },
          C: { text: { en: "No", hi: "नहीं", bn: "না" }, score: 0 }
        }
      },
      {
        question: {
          en: "Do you guide or mentor younger generations (e.g., grandkids, colony youth)?",
          hi: "क्या आप छोटी पीढ़ी (जैसे, पोते-पोतियाँ, कॉलोनी के युवा) का मार्गदर्शन या सलाह देते हैं?",
          bn: "আপনি কি ছোটদের (যেমন, নাতি-নাতনি, কলোনির যুবক) পথনির্দেশ বা পরামর্শ দেন?"
        },
        weight: 5,
        options: {
          A: { text: { en: "Yes, often", hi: "हाँ, अक्सर", bn: "হ্যাঁ, প্রায়ই" }, score: 5 },
          B: { text: { en: "Sometimes", hi: "कभी-कभी", bn: "মাঝে মাঝে" }, score: 3 },
          C: { text: { en: "Never", hi: "कभी नहीं", bn: "কখনও না" }, score: 0 }
        }
      }
    ]
  },

  CognitiveFunction: {
    weight: "15%",
    Subjective: [
      {
        id: "Q1",
        question: {
          en: "Describe your last week’s routine in order.",
          hi: "पिछले सप्ताह की अपनी दिनचर्या क्रम में बताएं।",
          bn: "গত সপ্তাহের আপনার রুটিনটি ক্রমানুসারে বর্ণনা করুন।"
        },
        weight: 7,
        criteria: ["flow", "memory", "attention to detail"]
      },
      {
        id: "Q2",
        question: {
          en: "Describe one memory from your childhood that still guides you today.",
          hi: "अपने बचपन की कोई एक याद बताएं जो आज भी आपको मार्गदर्शन देती है।",
          bn: "আপনার শৈশবের এমন একটি স্মৃতি বর্ণনা করুন যা আজও আপনাকে পথ দেখায়।"
        },
        weight: 5,
        criteria: ["emotional recall", "narrative detail"]
      }
    ],
    Objective: [
      {
        question: {
          en: "Do you remember today’s date and day?",
          hi: "क्या आपको आज की तारीख और दिन याद है?",
          bn: "আপনি কি আজকের তারিখ ও দিন মনে রাখতে পারেন?"
        },
        weight: 3,
        options: {
          A: { text: { en: "Yes", hi: "हाँ", bn: "হ্যাঁ" }, score: 3 },
          B: { text: { en: "No", hi: "नहीं", bn: "না" }, score: 0 }
        }
      },
      {
        question: {
          en: "Can you recall 3 events from last month?",
          hi: "क्या आप पिछले महीने की 3 घटनाएँ याद कर सकते हैं?",
          bn: "আপনি কি গত মাসের ৩টি ঘটনা মনে করতে পারেন?"
        },
        weight: 5,
        options: {
          A: { text: { en: "Yes", hi: "हाँ", bn: "হ্যাঁ" }, score: 5 },
          B: { text: { en: "Only 1 or 2", hi: "सिर्फ 1 या 2", bn: "শুধু ১ বা ২টি" }, score: 2 },
          C: { text: { en: "Can’t recall", hi: "याद नहीं कर सकता", bn: "মনে করতে পারছি না" }, score: 0 }
        }
      }
    ]
  },

  EmotionalFlexibility: {
    weight: "15%",
    Subjective: [
      {
        id: "Q1",
        question: {
          en: "Describe a recent situation where your plan didn’t go as expected. How did you respond?",
          hi: "हाल ही में कोई ऐसी स्थिति बताएं जब आपकी योजना के अनुसार कुछ नहीं हुआ। आपने कैसे प्रतिक्रिया दी?",
          bn: "সম্প্রতি এমন একটি পরিস্থিতি বর্ণনা করুন যেখানে আপনার পরিকল্পনা অনুযায়ী কিছু হয়নি। আপনি কীভাবে প্রতিক্রিয়া জানিয়েছেন?"
        },
        weight: 10,
        criteria: ["acceptance", "humour", "problem-solving"]
      },
      {
        id: "Q2",
        question: {
          en: "How do you feel when someone disagrees with your ideas or decisions?",
          hi: "जब कोई आपके विचारों या निर्णयों से असहमत होता है तो आपको कैसा लगता है?",
          bn: "যখন কেউ আপনার ধারণা বা সিদ্ধান্তের সঙ্গে একমত নয় তখন আপনার কেমন লাগে?"
        },
        weight: 5,
        criteria: ["openness", "self-reflection"]
      }
    ],
    Objective: [
      {
        question: {
          en: "If someone younger corrects you, what’s your reaction?",
          hi: "अगर कोई आपसे छोटा आपको सही करता है, तो आपकी प्रतिक्रिया क्या होती है?",
          bn: "যদি কেউ ছোট আপনাকে সংশোধন করে, আপনার প্রতিক্রিয়া কী?"
        },
        weight: 5,
        options: {
          A: { text: { en: "I accept and thank them", hi: "मैं स्वीकार करता हूँ और धन्यवाद कहता हूँ", bn: "আমি গ্রহণ করি এবং ধন্যবাদ জানাই" }, score: 5 },
          B: { text: { en: "I argue first, but reflect later", hi: "पहले बहस करता हूँ, बाद में सोचता हूँ", bn: "আমি প্রথমে তর্ক করি, পরে ভাবি" }, score: 3 },
          C: { text: { en: "I don’t like being corrected", hi: "मुझे सही किया जाना पसंद नहीं", bn: "আমি সংশোধিত হতে পছন্দ করি না" }, score: 0 }
        }
      }
    ]
  },

  ThematicAppreciation: {
    weight: "15%",
    Subjective: [
      {
        id: "Q1",
        question: {
          en: "A man walks alone on a village path at dusk holding a lantern. Write a 5-line story based on this image.",
          hi: "एक आदमी सांझ के समय गाँव के रास्ते पर अकेला लालटेन लेकर चल रहा है। इस चित्र के आधार पर 5 पंक्तियों की कहानी लिखें।",
          bn: "একজন মানুষ সন্ধ্যায় গ্রাম্য পথে একা লণ্ঠন হাতে হাঁটছে। এই ছবির উপর ভিত্তি করে ৫ লাইনের গল্প লিখুন।"
        },
        weight: 10,
        criteria: ["empathy", "symbolic interpretation", "meaning"]
      },
      {
        id: "Q2",
        question: {
          en: "If life were a river, what would be your role in it now?",
          hi: "अगर जीवन एक नदी होता, तो उसमें अब आपकी क्या भूमिका होती?",
          bn: "যদি জীবন একটি নদী হত, তাহলে এখন আপনার ভূমিকা কী হত?"
        },
        weight: 5,
        criteria: ["metaphor understanding", "self-placement"]
      }
    ],
    Objective: [
      {
        question: {
          en: "What does a banyan tree symbolize to you?",
          hi: "बरगद का पेड़ आपके लिए क्या प्रतीक है?",
          bn: "আপনার কাছে একটি বটগাছ কী প্রতীক?"
        },
        weight: 5,
        options: {
          A: { text: { en: "Strength, Wisdom, Legacy", hi: "शक्ति, ज्ञान, विरासत", bn: "শক্তি, জ্ঞান, উত্তরাধিকার" }, score: 5 },
          B: { text: { en: "Old age and shade", hi: "बुढ़ापा और छाया", bn: "বার্ধক্য ও ছায়া" }, score: 3 },
          C: { text: { en: "Just a tree", hi: "सिर्फ एक पेड़", bn: "শুধু একটি গাছ" }, score: 1 },
          D: { text: { en: "No idea", hi: "पता नहीं", bn: "কিছুই মনে হয় না" }, score: 0 }
        }
      }
    ]
  }
};
export default mentalAgeQuestionnaire;