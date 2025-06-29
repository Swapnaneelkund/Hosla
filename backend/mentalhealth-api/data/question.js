const mentalAgeQuestionnaire = {
  Depression: {
    weight: "20%",
    Subjective: [
      {
        id: "Q1",
        question: {
          en: "How have you been feeling about your mood and energy levels lately?",
          hi: "हाल ही में आपका मूड और ऊर्जा का स्तर कैसा रहा है?",
          bn: "সম্প্রতি আপনার মেজাজ এবং শক্তির মাত্রা কেমন লাগছে?",
        },
        weight: 8,
        criteria: ["emotional awareness", "self-reflection", "energy assessment"]
      },
      {
        id: "Q2",
        question: {
          en: "Describe any changes in your sleep patterns or appetite.",
          hi: "अपनी नींद के पैटर्न या भूख में कोई बदलाव का वर्णन करें।",
          bn: "আপনার ঘুমের ধরন বা ক্ষুধায় কোনো পরিবর্তনের বর্ণনা দিন।",
        },
        weight: 7,
        criteria: ["physical symptoms awareness", "behavioral changes", "detail orientation"]
      },
    ],
    Objective: [
      {
        question: {
          en: "Over the past two weeks, how often have you felt down, depressed, or hopeless?",
          hi: "पिछले दो हफ्तों में, आपने कितनी बार उदास, अवसादग्रस्त या निराश महसूस किया है?",
          bn: "গত দুই সপ্তাহে, আপনি কতবার হতাশ, বিষণ্ণ বা আশাহীন বোধ করেছেন?",
        },
        weight: 10,
        options: {
          A: {
            text: { en: "Not at all", hi: "बिल्कुल नहीं", bn: "একদমই নয়" },
            score: 0,
          },
          B: {
            text: { en: "Several days", hi: "कई दिन", bn: "কয়েক দিন" },
            score: 1,
          },
          C: {
            text: {
              en: "More than half the days",
              hi: "आधे से अधिक दिन",
              bn: "অর্ধেকের বেশি দিন",
            },
            score: 2,
          },
          D: {
            text: {
              en: "Nearly every day",
              hi: "लगभग हर दिन",
              bn: "প্রায় প্রতিদিন",
            },
            score: 3,
          },
        },
      },
      {
        question: {
          en: "How often have you had little interest or pleasure in doing things?",
          hi: "आपको काम করने में कितनी बार कम रुचि या खुशी महसूस हुई है?",
          bn: "কাজকর্মে আগ্রহ বা আনন্দ কম লাগার অভিজ্ঞতা কতবার হয়েছে?",
        },
        weight: 10,
        options: {
          A: {
            text: { en: "Not at all", hi: "बिल्कुल नहीं", bn: "একদমই নয়" },
            score: 0,
          },
          B: {
            text: { en: "Several days", hi: "कई दिन", bn: "কয়েক দিন" },
            score: 1,
          },
          C: {
            text: {
              en: "More than half the days",
              hi: "आধे से अধিক दিন",
              bn: "অর্ধেকের বেশি দিন",
            },
            score: 2,
          },
          D: {
            text: {
              en: "Nearly every day",
              hi: "लगभग हর दিन",
              bn: "প্রায় প্রতিদিন",
            },
            score: 3,
          },
        },
      },
    ],
  },

  Anxiety: {
    weight: "20%",
    Subjective: [
      {
        id: "Q1",
        question: {
          en: "What situations or thoughts tend to make you feel most anxious?",
          hi: "कौन सी परिस्थितियां या विचार आपको सबसे अधिक चिंतित करते हैं?",
          bn: "কোন পরিস্থিতি বা চিন্তা আপনাকে সবচেয়ে বেশি উদ্বিগ্ন করে তোলে?",
        },
        weight: 8,
        criteria: ["trigger awareness", "self-insight", "anxiety patterns"]
      },
      {
        id: "Q2",
        question: {
          en: "How do you typically cope with feelings of worry or stress?",
          hi: "आप आमतौर पर चिंता या तनाव की भावनाओं से कैसे निपटते हैं?",
          bn: "আপনি সাধারণত দুশ্চিন্তা বা চাপের অনুভূতির সাথে কীভাবে মোকাবিলা করেন?",
        },
        weight: 7,
        criteria: ["coping strategies", "stress management", "adaptive behaviors"]
      },
    ],
    Objective: [
      {
        question: {
          en: "Over the past two weeks, how often have you been bothered by feeling nervous, anxious, or on edge?",
          hi: "पिछले दो हफ्तों में, घबराहट, चिंता या बेचैनी की भावना से आप कितनी बार परेशान हुए हैं?",
          bn: "গত দুই সপ্তাহে, নার্ভাস, উদ্বিগ্ন বা অস্থির অনুভব করে কতবার বিরক্ত হয়েছেন?",
        },
        weight: 10,
        options: {
          A: {
            text: { en: "Not at all", hi: "बिल्कुल नहीं", bn: "একদমই নয়" },
            score: 0,
          },
          B: {
            text: { en: "Several days", hi: "कई दिन", bn: "কয়েক দিন" },
            score: 1,
          },
          C: {
            text: {
              en: "More than half the days",
              hi: "आधे से अधिक दিन",
              bn: "অর্ধেকের বেশি দিন",
            },
            score: 2,
          },
          D: {
            text: {
              en: "Nearly every day",
              hi: "लगभग हर दिन",
              bn: "প্রায় প্রতিদিন",
            },
            score: 3,
          },
        },
      },
      {
        question: {
          en: "How often have you been unable to stop or control worrying?",
          hi: "कितनी बार आप चिंता को रोकने या नियंत्रित करने में असमर्थ रहे हैं?",
          bn: "কতবার আপনি দুশ্চিন্তা বন্ধ বা নিয়ন্ত্রণ করতে অক্ষম হয়েছেন?",
        },
        weight: 10,
        options: {
          A: {
            text: { en: "Not at all", hi: "बिल्कुल नहीं", bn: "একদমই নয়" },
            score: 0,
          },
          B: {
            text: { en: "Several days", hi: "कई दिन", bn: "কয়েক দিন" },
            score: 1,
          },
          C: {
            text: {
              en: "More than half the days",
              hi: "आধে से अधिक दিন",
              bn: "অর্ধেকের বেশি দিন",
            },
            score: 2,
          },
          D: {
            text: {
              en: "Nearly every day",
              hi: "लगभग हर दिन",
              bn: "প্রায় প্রতিদিন",
            },
            score: 3,
          },
        },
      },
    ],
  },

  Cognitive: {
    weight: "20%",
    Subjective: [
      {
        id: "Q1",
        question: {
          en: "Have you noticed any changes in your memory or ability to concentrate?",
          hi: "क्या आपने अपनी याददाश्त या ध्यान केंद्रित करने की क्षमता में कोई बदलाव देखा है?",
          bn: "আপনার স্মৃতিশক্তি বা মনোযোগ দেওয়ার ক্ষমতায় কোনো পরিবর্তন লক্ষ্য করেছেন?",
        },
        weight: 8,
        criteria: ["cognitive awareness", "memory assessment", "attention evaluation"]
      },
      {
        id: "Q2",
        question: {
          en: "Describe any difficulties you have with daily tasks or decision-making.",
          hi: "दैनिक कार्यों या निर्णय लेने में आपको होने वाली कोई कठिनाइयों का वर्णन करें।",
          bn: "দৈনন্দিন কাজ বা সিদ্ধান্ত নেওয়ার ক্ষেত্রে আপনার কোনো অসুবিধার বর্ণনা দিন।",
        },
        weight: 7,
        criteria: ["functional assessment", "decision-making ability", "daily living skills"]
      },
    ],
    Objective: [
      {
        question: {
          en: "How often do you forget important appointments or events?",
          hi: "आप कितनी बार महत्वपूर्ण अपॉइंटमेंट या घटनाओं को भूल जाते हैं?",
          bn: "আপনি কত ঘন ঘন গুরুত্বপূর্ণ অ্যাপয়েন্টমেন্ট বা ঘটনা ভুলে যান?",
        },
        weight: 10,
        options: {
          A: {
            text: { en: "Never", hi: "कभी नहीं", bn: "কখনো না" },
            score: 0,
          },
          B: {
            text: { en: "Rarely", hi: "शायद ही कभी", bn: "খুব কমই" },
            score: 1,
          },
          C: {
            text: { en: "Sometimes", hi: "कभी कभी", bn: "মাঝে মাঝে" },
            score: 2,
          },
          D: {
            text: { en: "Often", hi: "अक्सर", bn: "প্রায়ই" },
            score: 3,
          },
        },
      },
      {
        question: {
          en: "How frequently do you have trouble finding the right words when speaking?",
          hi: "बात करते समय सही शब्द खोजने में आपको कितनी बार परेशानी होती है?",
          bn: "কথা বলার সময় সঠিক শব্দ খুঁজে পেতে কত ঘন ঘন সমস্যা হয়?",
        },
        weight: 10,
        options: {
          A: {
            text: { en: "Never", hi: "कभी नहीं", bn: "কখনো না" },
            score: 0,
          },
          B: {
            text: { en: "Rarely", hi: "शायद ही कभी", bn: "খুব কমই" },
            score: 1,
          },
          C: {
            text: { en: "Sometimes", hi: "कभी कभी", bn: "মাঝে মাঝে" },
            score: 2,
          },
          D: {
            text: { en: "Often", hi: "अक्सर", bn: "প্রায়ই" },
            score: 3,
          },
        },
      },
    ],
  },

  Social: {
    weight: "15%",
    Subjective: [
      {
        id: "Q1",
        question: {
          en: "How do you feel about your current social connections and relationships?",
          hi: "अपने वर्तमान सामाजिक संपर्कों और रिश्तों के बारे में आप कैसा महसूस करते हैं?",
          bn: "আপনার বর্তমান সামাজিক সংযোগ এবং সম্পর্কের বিষয়ে আপনি কেমন অনুভব করেন?",
        },
        weight: 8,
        criteria: ["relationship satisfaction", "social awareness", "emotional connection"]
      },
      {
        id: "Q2",
        question: {
          en: "What activities or hobbies do you engage in regularly?",
          hi: "आप नियमित रूप से किन गतिविधियों या शौकों में संलग्न रहते हैं?",
          bn: "আপনি নিয়মিত কোন কার্যকলাপ বা শখে নিযুক্ত থাকেন?",
        },
        weight: 7,
        criteria: ["activity engagement", "interest maintenance", "behavioral patterns"]
      },
    ],
    Objective: [
      {
        question: {
          en: "How often do you feel lonely or isolated?",
          hi: "आप कितनी बार अकेला या अलग-थलग महसूस करते हैं?",
          bn: "আপনি কত ঘন ঘন একাকী বা বিচ্ছিন্ন বোধ করেন?",
        },
        weight: 8,
        options: {
          A: {
            text: { en: "Never", hi: "कभी नहीं", bn: "কখনো না" },
            score: 0,
          },
          B: {
            text: { en: "Rarely", hi: "शायद ही कभी", bn: "খুব কমই" },
            score: 1,
          },
          C: {
            text: { en: "Sometimes", hi: "कभी कभी", bn: "মাঝে মাঝে" },
            score: 2,
          },
          D: {
            text: { en: "Often", hi: "अक्सर", bn: "প্রায়ই" },
            score: 3,
          },
        },
      },
      {
        question: {
          en: "How frequently do you participate in social activities or gatherings?",
          hi: "आप कितনी बার সামাজিক गतिविधियों या सभाओं में भाग लेते हैं?",
          bn: "আপনি কত ঘন ঘন সামাজিক ক্রিয়াকলাপ বা জমায়েতে অংশগ্রহণ করেন?",
        },
        weight: 7,
        options: {
          A: {
            text: { en: "Very often", hi: "बहुत बार", bn: "খুব ঘন ঘন" },
            score: 0,
          },
          B: {
            text: { en: "Sometimes", hi: "कभी कभी", bn: "মাঝে মাঝে" },
            score: 1,
          },
          C: {
            text: { en: "Rarely", hi: "शायद ही कभी", bn: "খুব কমই" },
            score: 2,
          },
          D: {
            text: { en: "Never", hi: "कभी नहीं", bn: "কখনো না" },
            score: 3,
          },
        },
      },
    ],
  },

  PhysicalWellbeing: {
    weight: "15%",
    Subjective: [
      {
        id: "Q1",
        question: {
          en: "How has your physical health been affecting your daily activities?",
          hi: "आपका शारीरिक स्वास्थ्य आपकी दैनिक गतिविधियों को कैसे प्रभावित कर रहा है?",
          bn: "আপনার শারীরিক স্বাস্থ্য আপনার দৈনন্দিন কার্যকলাপে কীভাবে প্রভাব ফেলছে?",
        },
        weight: 8,
        criteria: ["physical impact awareness", "functional limitation", "health insight"]
      },
      {
        id: "Q2",
        question: {
          en: "Describe your current exercise routine and how it makes you feel.",
          hi: "अपनी वर्तमान व्यायाम दिनचर्या और इससे आपको कैसा लगता है, इसका वर्णन करें।",
          bn: "আপনার বর্তমান ব্যায়াম রুটিন এবং এটি আপনাকে কেমন অনুভব করায় তার বর্ণনা দিন।",
        },
        weight: 7,
        criteria: ["activity awareness", "physical sensation", "motivation assessment"]
      },
    ],
    Objective: [
      {
        question: {
          en: "How often do you experience physical discomfort or pain that interferes with daily tasks?",
          hi: "दैनिक कार्यों में बाधा डालने वाली शारीरिक परेशानी या दर्द का अनुभव आप कितनी बार करते हैं?",
          bn: "দৈনন্দিন কাজে বাধা দেয় এমন শারীরিক অস্বস্তি বা ব্যথার অভিজ্ঞতা কত ঘন ঘন হয়?",
        },
        weight: 8,
        options: {
          A: {
            text: { en: "Never", hi: "कभी नहीं", bn: "কখনো না" },
            score: 0,
          },
          B: {
            text: { en: "Rarely", hi: "शायद ही कভी", bn: "খুব কমই" },
            score: 1,
          },
          C: {
            text: { en: "Sometimes", hi: "कभी कभी", bn: "মাঝে মাঝে" },
            score: 2,
          },
          D: {
            text: { en: "Often", hi: "अक्सर", bn: "প্রায়ই" },
            score: 3,
          },
        },
      },
      {
        question: {
          en: "How would you rate your current energy levels throughout the day?",
          hi: "पूरे दিन अपने वर्तमान ऊर्जा स्तर को आप कैसे रेट करेंगे?",
          bn: "সারাদিন ধরে আপনার বর্তমান শক্তির মাত্রা কীভাবে রেট করবেন?",
        },
        weight: 7,
        options: {
          A: {
            text: { en: "High energy", hi: "उच्च ऊर्जा", bn: "উচ্চ শক্তি" },
            score: 0,
          },
          B: {
            text: { en: "Moderate energy", hi: "मध्यम ऊर्जा", bn: "মাঝারি শক্তি" },
            score: 1,
          },
          C: {
            text: { en: "Low energy", hi: "कम ऊर্জা", bn: "কম শক্তি" },
            score: 2,
          },
          D: {
            text: { en: "Very low energy", hi: "बहुत कम ऊर्জا", bn: "খুব কম শক্তি" },
            score: 3,
          },
        },
      },
    ],
  },

  PurposeAndMeaning: {
    weight: "10%",
    Subjective: [
      {
        id: "Q1",
        question: {
          en: "What gives your life the most meaning and purpose right now?",
          hi: "अभी आपके जीवन को सबसे अधिक अर्थ और उद्देश्य क्या देता है?",
          bn: "এই মুহূর্তে আপনার জীবনে সবচেয়ে বেশি অর্থ ও উদ্দেশ্য কী নিয়ে আসে?",
        },
        weight: 8,
        criteria: ["purpose clarity", "meaning-making", "life satisfaction"]
      },
      {
        id: "Q2",
        question: {
          en: "How do you find hope or motivation during difficult times?",
          hi: "कठिन समय में आप आशा या प्रेरणा कैसे पाते हैं?",
          bn: "কঠিন সময়ে আপনি কীভাবে আশা বা অনুপ্রেরণা খুঁজে পান?",
        },
        weight: 7,
        criteria: ["resilience", "coping resources", "hope maintenance"]
      },
    ],
    Objective: [
      {
        question: {
          en: "How often do you feel that your life has direction and purpose?",
          hi: "आप कितनी बार महसूस करते हैं कि आपके जीवन में दिशा और उद्देश्य है?",
          bn: "আপনি কত ঘন ঘন অনুভব করেন যে আপনার জীবনের একটি দিশা ও উদ্দেশ্য আছে?",
        },
        weight: 8,
        options: {
          A: {
            text: { en: "Always", hi: "हमेशा", bn: "সর্বদা" },
            score: 0,
          },
          B: {
            text: { en: "Often", hi: "अक্সর", bn: "প্রায়ই" },
            score: 1,
          },
          C: {
            text: { en: "Sometimes", hi: "कभी कभی", bn: "মাঝে মাঝে" },
            score: 2,
          },
          D: {
            text: { en: "Rarely", hi: "शायद ही कभी", bn: "খুব কমই" },
            score: 3,
          },
        },
      },
      {
        question: {
          en: "How satisfied are you with your life overall?",
          hi: "समग्र रूप से अपने जीवन से आप कितने संतुष्ट हैं?",
          bn: "সামগ্রিকভাবে আপনার জীবন নিয়ে আপনি কতটা সন্তুষ্ট?",
        },
        weight: 7,
        options: {
          A: {
            text: { en: "Very satisfied", hi: "बहुत संतुष्ट", bn: "খুবই সন্তুষ্ট" },
            score: 0,
          },
          B: {
            text: { en: "Satisfied", hi: "संतुष্ট", bn: "সন্তুষ্ট" },
            score: 1,
          },
          C: {
            text: { en: "Somewhat satisfied", hi: "कुছ हद तक संतुষ্ট", bn: "কিছুটা সন্তুষ্ট" },
            score: 2,
          },
          D: {
            text: { en: "Dissatisfied", hi: "असंतुष्ট", bn: "অসন্তুষ্ট" },
            score: 3,
          },
        },
      },
    ],
  },
};

export default mentalAgeQuestionnaire;