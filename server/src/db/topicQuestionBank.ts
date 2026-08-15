interface BankQuestion {
  text: string;
  options: string[];
  correct_answer?: string;
}

interface BankPoll {
  title: string;
  type: "poll" | "quiz";
  questions: BankQuestion[];
}

export interface TopicBankEntry {
  topicTitle: string;
  discussionPoll: BankPoll;
  quizPoll: BankPoll;
}

// One discussion poll (opinion/engagement, no right answer) and one scored quiz
// (multiple-choice with a correct_answer) per curriculum topic. Topics 18-25 —
// Competitive English through Career Planning, the exam-prep/aptitude stretch that
// typically lands in the programme's closing days — get genuinely harder, exam-style
// quiz questions rather than simple comprehension checks.
export const TOPIC_QUESTION_BANK: TopicBankEntry[] = [
  {
    topicTitle: "Introduction to Career Counselling & Future of Careers",
    discussionPoll: {
      title: "Discussion: Introduction to Career Counselling",
      type: "poll",
      questions: [
        {
          text: "What do you hope to gain most from this career counselling programme?",
          options: ["Understanding my interests", "Learning about new career options", "Improving my communication skills", "Help with decision making"],
        },
        {
          text: "Which best describes how you currently feel about choosing a career?",
          options: ["Confident and clear", "Curious but unsure", "Confused or anxious", "Haven't thought about it much"],
        },
        {
          text: "Which source do you trust most for career information?",
          options: ["Teachers/counsellors", "Family members", "Internet/social media", "Friends/seniors"],
        },
      ],
    },
    quizPoll: {
      title: "Quiz: Introduction to Career Counselling",
      type: "quiz",
      questions: [
        {
          text: "Career counselling primarily helps students to:",
          options: ["Choose a career only based on marks", "Understand themselves and explore options", "Copy their parents' profession", "Avoid making any career decisions"],
          correct_answer: "Understand themselves and explore options",
        },
        {
          text: "Which of the following is NOT a benefit of early career planning?",
          options: ["Better subject/stream choices", "Reduced confusion later", "Guaranteed high salary", "More focused skill-building"],
          correct_answer: "Guaranteed high salary",
        },
        {
          text: "The 'future of work' is most shaped by:",
          options: ["Fixed job roles that never change", "Technology, globalization, and changing industries", "Only government policies", "Luck"],
          correct_answer: "Technology, globalization, and changing industries",
        },
      ],
    },
  },
  {
    topicTitle: "Traditional vs. Modern Career Paths",
    discussionPoll: {
      title: "Discussion: Traditional vs. Modern Career Paths",
      type: "poll",
      questions: [
        {
          text: "Which sounds more appealing to you?",
          options: ["A traditional stable job (govt/corporate)", "A modern flexible career (startup/freelance)", "Both equally", "Not sure yet"],
        },
        {
          text: "Has your family suggested a specific traditional career for you?",
          options: ["Yes, and I agree", "Yes, but I'm not sure", "No specific suggestion", "Haven't discussed it"],
        },
        {
          text: "What matters most to you in a career?",
          options: ["Job security", "Passion/interest", "High income", "Flexibility/freedom"],
        },
      ],
    },
    quizPoll: {
      title: "Quiz: Traditional vs. Modern Career Paths",
      type: "quiz",
      questions: [
        {
          text: "Which is an example of a 'modern' career path?",
          options: ["Bank clerk", "Content creator/influencer", "Government clerk", "Postal worker"],
          correct_answer: "Content creator/influencer",
        },
        {
          text: "A key advantage of traditional career paths is often:",
          options: ["High risk, high reward", "Job stability and structured growth", "No need for qualifications", "Constant career switching"],
          correct_answer: "Job stability and structured growth",
        },
        {
          text: "Modern career paths have grown mainly due to:",
          options: ["Decrease in population", "Internet and digital technology", "Fewer traditional jobs existing", "Government mandates"],
          correct_answer: "Internet and digital technology",
        },
      ],
    },
  },
  {
    topicTitle: "Emerging Career Trends",
    discussionPoll: {
      title: "Discussion: Emerging Career Trends",
      type: "poll",
      questions: [
        {
          text: "Which emerging field interests you the most?",
          options: ["Data Science/AI", "Renewable Energy", "Digital Marketing", "Healthcare Technology"],
        },
        {
          text: "Do you think your dream career even existed 10 years ago?",
          options: ["Yes, exactly the same", "Yes, but very different", "No, it's completely new", "Not sure what my dream career is"],
        },
        {
          text: "How do you usually learn about new career trends?",
          options: ["Social media", "News/articles", "School/teachers", "I don't follow trends"],
        },
      ],
    },
    quizPoll: {
      title: "Quiz: Emerging Career Trends",
      type: "quiz",
      questions: [
        {
          text: "Which of these is considered a fast-growing career field today?",
          options: ["Typewriter repair", "Data Analytics", "Telegram operator", "VHS rental"],
          correct_answer: "Data Analytics",
        },
        {
          text: "'Green jobs' refer to careers related to:",
          options: ["Gardening only", "Environment and sustainability", "Painting", "Agriculture only"],
          correct_answer: "Environment and sustainability",
        },
        {
          text: "Which skill is increasingly valuable across almost all emerging careers?",
          options: ["Handwriting speed", "Digital/computer literacy", "Memorizing facts", "None of the above"],
          correct_answer: "Digital/computer literacy",
        },
      ],
    },
  },
  {
    topicTitle: "Artificial Intelligence (AI) & Automation",
    discussionPoll: {
      title: "Discussion: AI & Automation",
      type: "poll",
      questions: [
        {
          text: "How do you feel about AI's impact on future jobs?",
          options: ["Excited about new opportunities", "Worried about job loss", "Both excited and worried", "Haven't thought about it"],
        },
        {
          text: "Have you personally used an AI tool (like a chatbot)?",
          options: ["Yes, often", "Yes, a few times", "No, but I know what it is", "No, never heard of it"],
        },
        {
          text: "Which industry do you think AI will change the most?",
          options: ["Healthcare", "Education", "Transportation", "Entertainment"],
        },
      ],
    },
    quizPoll: {
      title: "Quiz: AI & Automation",
      type: "quiz",
      questions: [
        {
          text: "AI is best described as:",
          options: ["A robot that looks like a human", "Technology that enables machines to perform human-like tasks", "A type of computer virus", "A social media app"],
          correct_answer: "Technology that enables machines to perform human-like tasks",
        },
        {
          text: "Which of these jobs is LEAST likely to be fully automated soon?",
          options: ["Data entry", "Counselling and therapy", "Toll collection", "Assembly line work"],
          correct_answer: "Counselling and therapy",
        },
        {
          text: "To stay relevant in an AI-driven job market, students should focus on:",
          options: ["Avoiding technology completely", "Building skills machines can't easily replace (creativity, empathy, critical thinking)", "Only memorizing textbooks", "Ignoring digital skills"],
          correct_answer: "Building skills machines can't easily replace (creativity, empathy, critical thinking)",
        },
      ],
    },
  },
  {
    topicTitle: "Career Opportunities Across Industries",
    discussionPoll: {
      title: "Discussion: Career Opportunities Across Industries",
      type: "poll",
      questions: [
        {
          text: "Which industry would you most like to work in?",
          options: ["Engineering/Technology", "Healthcare/Medicine", "Commerce/Business", "Arts/Creative fields"],
        },
        {
          text: "Would you consider a career in defence or government services?",
          options: ["Yes, definitely", "Maybe", "No, not interested", "Never thought about it"],
        },
        {
          text: "Which matters more when picking an industry?",
          options: ["Personal interest", "Salary potential", "Family expectations", "Job availability"],
        },
      ],
    },
    quizPoll: {
      title: "Quiz: Career Opportunities Across Industries",
      type: "quiz",
      questions: [
        {
          text: "Which of these is an example of the healthcare industry?",
          options: ["Nursing", "Software development", "Retail sales", "Interior design"],
          correct_answer: "Nursing",
        },
        {
          text: "A career in 'creative fields' could include:",
          options: ["Graphic design and animation", "Auditing", "Civil engineering", "Pharmacy"],
          correct_answer: "Graphic design and animation",
        },
        {
          text: "Entrepreneurship falls under which broad category?",
          options: ["Government service", "Self-employment", "Defence", "None of the above"],
          correct_answer: "Self-employment",
        },
      ],
    },
  },
  {
    topicTitle: "Skills for Future Careers",
    discussionPoll: {
      title: "Discussion: Skills for Future Careers",
      type: "poll",
      questions: [
        {
          text: "Which future-ready skill do you feel most confident in?",
          options: ["Digital literacy", "Communication", "Problem-solving", "Continuous learning"],
        },
        {
          text: "Which skill do you most want to improve?",
          options: ["Digital literacy", "Communication", "Problem-solving", "Teamwork"],
        },
        {
          text: "How do you usually pick up new skills?",
          options: ["Online courses/videos", "School lessons", "Practicing on my own", "Learning from friends/family"],
        },
      ],
    },
    quizPoll: {
      title: "Quiz: Skills for Future Careers",
      type: "quiz",
      questions: [
        {
          text: "Which of these is considered a 'soft skill'?",
          options: ["Coding in Python", "Communication", "Operating machinery", "Typing speed"],
          correct_answer: "Communication",
        },
        {
          text: "Digital literacy mainly means:",
          options: ["Owning the latest phone", "Ability to effectively use digital tools and information", "Watching videos online", "Playing video games"],
          correct_answer: "Ability to effectively use digital tools and information",
        },
        {
          text: "Why is 'continuous learning' important for future careers?",
          options: ["Because exams never end", "Because industries and technology keep changing", "Because it's required by law", "It isn't important"],
          correct_answer: "Because industries and technology keep changing",
        },
      ],
    },
  },
  {
    topicTitle: "Knowing Yourself",
    discussionPoll: {
      title: "Discussion: Knowing Yourself",
      type: "poll",
      questions: [
        {
          text: "How well do you feel you know your own strengths?",
          options: ["Very well", "Somewhat", "Not very well", "Not at all"],
        },
        {
          text: "What helps you understand yourself best?",
          options: ["Self-reflection", "Feedback from others", "Trying new activities", "Tests/assessments"],
        },
        {
          text: "Which best describes you?",
          options: ["I prefer working with people", "I prefer working with ideas", "I prefer working with things/tools", "I prefer working with data/numbers"],
        },
      ],
    },
    quizPoll: {
      title: "Quiz: Knowing Yourself",
      type: "quiz",
      questions: [
        {
          text: "Self-awareness in career planning means:",
          options: ["Knowing your interests, strengths, and values", "Knowing everyone else's career choices", "Memorizing career names", "Following trends blindly"],
          correct_answer: "Knowing your interests, strengths, and values",
        },
        {
          text: "Why is 'knowing yourself' considered the first step in career planning?",
          options: ["It guarantees a job", "It helps match your traits to suitable careers", "It's required for admission", "It has no real purpose"],
          correct_answer: "It helps match your traits to suitable careers",
        },
        {
          text: "Which is an example of a personal value (not a skill)?",
          options: ["Typing speed", "Honesty", "Coding ability", "Public speaking"],
          correct_answer: "Honesty",
        },
      ],
    },
  },
  {
    topicTitle: "Interests & Personality Assessment",
    discussionPoll: {
      title: "Discussion: Interests & Personality",
      type: "poll",
      questions: [
        {
          text: "Which type of activity do you enjoy most?",
          options: ["Hands-on/practical work", "Research and investigation", "Creative/artistic work", "Helping/teaching others"],
        },
        {
          text: "Are you more of an introvert or extrovert?",
          options: ["Introvert", "Extrovert", "A bit of both", "Not sure"],
        },
        {
          text: "Have you ever taken a personality test before?",
          options: ["Yes, and I found it accurate", "Yes, but I wasn't sure about it", "No, but I'm curious", "No, not interested"],
        },
      ],
    },
    quizPoll: {
      title: "Quiz: Interests & Personality Assessment",
      type: "quiz",
      questions: [
        {
          text: "A personality assessment is designed to help you understand:",
          options: ["Your exam marks", "Your behavioural traits and preferences", "Your family background", "Your height and weight"],
          correct_answer: "Your behavioural traits and preferences",
        },
        {
          text: "Interest inventories in career counselling are used to:",
          options: ["Rank students against each other", "Match personal interests to career fields", "Decide final exam grades", "Replace the need for hard work"],
          correct_answer: "Match personal interests to career fields",
        },
        {
          text: "Which is TRUE about personality and career fit?",
          options: ["Personality has no link to career satisfaction", "A good personality-career fit can improve job satisfaction", "Only one personality type can be successful", "Personality never changes with experience"],
          correct_answer: "A good personality-career fit can improve job satisfaction",
        },
      ],
    },
  },
  {
    topicTitle: "Strengths, Weaknesses & Learning Styles",
    discussionPoll: {
      title: "Discussion: Strengths, Weaknesses & Learning Styles",
      type: "poll",
      questions: [
        {
          text: "How do you learn best?",
          options: ["Seeing (visual)", "Hearing (auditory)", "Reading/writing", "Doing (hands-on)"],
        },
        {
          text: "What's one strength you're proud of?",
          options: ["Creativity", "Discipline/hard work", "Communication", "Problem-solving"],
        },
        {
          text: "How comfortable are you talking about your weaknesses?",
          options: ["Very comfortable", "Somewhat comfortable", "A little uncomfortable", "Very uncomfortable"],
        },
      ],
    },
    quizPoll: {
      title: "Quiz: Strengths, Weaknesses & Learning Styles",
      type: "quiz",
      questions: [
        {
          text: "Identifying your weaknesses is useful mainly because:",
          options: ["It helps you know what to improve", "It's meant to discourage you", "It has no real use", "It's only for teachers to judge you"],
          correct_answer: "It helps you know what to improve",
        },
        {
          text: "A 'kinesthetic' learner learns best through:",
          options: ["Listening to lectures", "Reading textbooks", "Hands-on activities and movement", "Watching diagrams only"],
          correct_answer: "Hands-on activities and movement",
        },
        {
          text: "Which statement about strengths and weaknesses is most accurate?",
          options: ["Everyone has the exact same strengths", "Strengths and weaknesses can change over time with effort", "Weaknesses can never be improved", "Only weaknesses matter in career planning"],
          correct_answer: "Strengths and weaknesses can change over time with effort",
        },
      ],
    },
  },
  {
    topicTitle: "Career Interest Assessment (Psychometric Test)",
    discussionPoll: {
      title: "Discussion: Taking the Psychometric Test",
      type: "poll",
      questions: [
        {
          text: "How are you feeling about taking this psychometric test?",
          options: ["Excited", "Nervous", "Curious", "Neutral"],
        },
        {
          text: "Do you think a test can accurately capture your interests?",
          options: ["Yes, fully", "Partly", "Not really", "Not sure"],
        },
        {
          text: "What do you hope the results will tell you?",
          options: ["Which career suits me", "Confirmation of what I already think", "My strengths and weaknesses", "Just curious to see the result"],
        },
      ],
    },
    quizPoll: {
      title: "Quiz: About Psychometric Testing",
      type: "quiz",
      questions: [
        {
          text: "A psychometric test in career counselling measures:",
          options: ["Physical fitness", "Interests, aptitudes, or personality traits", "Exam marks only", "Attendance record"],
          correct_answer: "Interests, aptitudes, or personality traits",
        },
        {
          text: "For accurate results, you should answer psychometric test questions:",
          options: ["Based on what your parents want", "Honestly, based on your own preferences", "Randomly", "Based on what seems impressive"],
          correct_answer: "Honestly, based on your own preferences",
        },
        {
          text: "Psychometric results are best used as:",
          options: ["The single final decision-maker", "One helpful input among several for decision-making", "Something to ignore completely", "A ranking against classmates"],
          correct_answer: "One helpful input among several for decision-making",
        },
      ],
    },
  },
  {
    topicTitle: "Understanding Psychometric Results",
    discussionPoll: {
      title: "Discussion: Understanding Your Results",
      type: "poll",
      questions: [
        {
          text: "How confident do you feel interpreting your own results?",
          options: ["Very confident", "Somewhat confident", "Need more guidance", "Not confident at all"],
        },
        {
          text: "Did any part of your result surprise you?",
          options: ["Yes, quite a bit", "Yes, a little", "No, it matched what I expected", "Not sure yet"],
        },
        {
          text: "What would help you most in understanding your results?",
          options: ["One-on-one discussion with a counsellor", "Written explanation", "Comparing with career options list", "Group discussion with classmates"],
        },
      ],
    },
    quizPoll: {
      title: "Quiz: Understanding Psychometric Results",
      type: "quiz",
      questions: [
        {
          text: "When interpreting psychometric results, it's important to:",
          options: ["Treat the result as 100% certain and final", "Use it as guidance alongside your own judgment", "Ignore it completely", "Compare scores with friends to compete"],
          correct_answer: "Use it as guidance alongside your own judgment",
        },
        {
          text: "If your result suggests an interest you didn't expect, you should:",
          options: ["Dismiss it immediately", "Explore it with curiosity before deciding", "Assume the test is wrong", "Panic"],
          correct_answer: "Explore it with curiosity before deciding",
        },
        {
          text: "Interpreting results with a counsellor is helpful because:",
          options: ["They can explain what the scores actually mean in context", "They will choose your career for you", "It's a school requirement only", "It replaces the need for self-reflection"],
          correct_answer: "They can explain what the scores actually mean in context",
        },
      ],
    },
  },
  {
    topicTitle: "Decision Making & Goal Identification",
    discussionPoll: {
      title: "Discussion: Decision Making & Goals",
      type: "poll",
      questions: [
        {
          text: "How do you usually make important decisions?",
          options: ["Logically weighing pros and cons", "Following my gut feeling", "Asking others for advice", "Avoiding the decision as long as possible"],
        },
        {
          text: "Do you have a clear academic/career goal right now?",
          options: ["Yes, very clear", "Somewhat clear", "Not really", "No goal yet"],
        },
        {
          text: "What's the biggest challenge in setting your goals?",
          options: ["Too many options", "Fear of choosing wrong", "Lack of information", "Pressure from others"],
        },
      ],
    },
    quizPoll: {
      title: "Quiz: Decision Making & Goal Identification",
      type: "quiz",
      questions: [
        {
          text: "A 'SMART' goal is best described as one that is:",
          options: ["Specific, Measurable, Achievable, Relevant, Time-bound", "Simple, Massive, Amazing, Random, Tough", "Slow, Minor, Average, Rare, Tricky", "None of the above"],
          correct_answer: "Specific, Measurable, Achievable, Relevant, Time-bound",
        },
        {
          text: "Which is a short-term goal example?",
          options: ["Becoming a doctor in 10 years", "Improving my maths score this term", "Retiring comfortably", "Starting a company someday"],
          correct_answer: "Improving my maths score this term",
        },
        {
          text: "Good decision-making in career planning involves:",
          options: ["Deciding based on one factor only", "Considering interests, abilities, and opportunities together", "Letting others decide for you", "Avoiding decisions altogether"],
          correct_answer: "Considering interests, abilities, and opportunities together",
        },
      ],
    },
  },
  {
    topicTitle: "Matching Interests with Career Choices",
    discussionPoll: {
      title: "Discussion: Matching Interests with Careers",
      type: "poll",
      questions: [
        {
          text: "How well do your current interests match your planned career?",
          options: ["Very well", "Somewhat", "Not sure yet", "Not well at all"],
        },
        {
          text: "Which matters more when choosing a career?",
          options: ["What I enjoy doing", "What pays well", "What my family wants", "What's easiest to get into"],
        },
        {
          text: "Have you researched career options that match your interests?",
          options: ["Yes, thoroughly", "Yes, a little", "Not yet, but I plan to", "No, not yet"],
        },
      ],
    },
    quizPoll: {
      title: "Quiz: Matching Interests with Career Choices",
      type: "quiz",
      questions: [
        {
          text: "Matching interests with career choices helps mainly with:",
          options: ["Guaranteeing top marks", "Long-term job satisfaction and motivation", "Avoiding all hard work", "Getting a higher salary automatically"],
          correct_answer: "Long-term job satisfaction and motivation",
        },
        {
          text: "If someone enjoys helping others and communicating well, a well-matched field might be:",
          options: ["Data entry", "Counselling or teaching", "Solo machine repair", "Accounting audits"],
          correct_answer: "Counselling or teaching",
        },
        {
          text: "A mismatch between interest and career often leads to:",
          options: ["Higher job satisfaction", "Lower motivation and job dissatisfaction", "Guaranteed promotion", "No effect at all"],
          correct_answer: "Lower motivation and job dissatisfaction",
        },
      ],
    },
  },
  {
    topicTitle: "Communication Skills - The Basics",
    discussionPoll: {
      title: "Discussion: Communication Skills",
      type: "poll",
      questions: [
        {
          text: "How confident are you speaking in front of others?",
          options: ["Very confident", "Somewhat confident", "A little nervous", "Very nervous"],
        },
        {
          text: "Which communication skill do you want to improve most?",
          options: ["Speaking clearly", "Listening actively", "Writing effectively", "Body language"],
        },
        {
          text: "In a conversation, do you focus more on talking or listening?",
          options: ["Mostly talking", "Mostly listening", "A balance of both", "Depends on the situation"],
        },
      ],
    },
    quizPoll: {
      title: "Quiz: Communication Skills Basics",
      type: "quiz",
      questions: [
        {
          text: "Effective communication includes:",
          options: ["Only speaking loudly", "Clear speaking, active listening, and appropriate body language", "Talking as much as possible", "Avoiding eye contact"],
          correct_answer: "Clear speaking, active listening, and appropriate body language",
        },
        {
          text: "'Active listening' means:",
          options: ["Waiting for your turn to speak", "Fully concentrating on and understanding the speaker", "Listening while doing something else", "Interrupting frequently"],
          correct_answer: "Fully concentrating on and understanding the speaker",
        },
        {
          text: "Non-verbal communication includes:",
          options: ["Body language and facial expressions", "Only written words", "Only spoken words", "None of the above"],
          correct_answer: "Body language and facial expressions",
        },
      ],
    },
  },
  {
    topicTitle: "Public Speaking & Confidence Building",
    discussionPoll: {
      title: "Discussion: Public Speaking & Confidence",
      type: "poll",
      questions: [
        {
          text: "What worries you most about public speaking?",
          options: ["Forgetting what to say", "Being judged", "Shaky voice/nerves", "Nothing, I enjoy it"],
        },
        {
          text: "How often do you get chances to practice public speaking?",
          options: ["Often", "Sometimes", "Rarely", "Never"],
        },
        {
          text: "What would help boost your confidence most?",
          options: ["More practice opportunities", "Positive feedback", "Preparation techniques", "Watching others speak well"],
        },
      ],
    },
    quizPoll: {
      title: "Quiz: Public Speaking & Confidence Building",
      type: "quiz",
      questions: [
        {
          text: "A good way to reduce public speaking anxiety is to:",
          options: ["Avoid preparing so you're 'natural'", "Practice and prepare your material well", "Speak as fast as possible to finish quickly", "Avoid eye contact with the audience"],
          correct_answer: "Practice and prepare your material well",
        },
        {
          text: "Confident body language while speaking includes:",
          options: ["Slouching and looking down", "Standing tall and making eye contact", "Crossing arms and turning away", "Speaking in a monotone whisper"],
          correct_answer: "Standing tall and making eye contact",
        },
        {
          text: "Which is the best way to start building public speaking confidence?",
          options: ["Avoiding all speaking opportunities", "Starting with small, low-pressure speaking situations", "Only speaking when perfectly ready", "Memorizing without understanding"],
          correct_answer: "Starting with small, low-pressure speaking situations",
        },
      ],
    },
  },
  {
    topicTitle: "Group Discussion & Teamwork",
    discussionPoll: {
      title: "Discussion: Group Discussion & Teamwork",
      type: "poll",
      questions: [
        {
          text: "In a group, what role do you usually take?",
          options: ["Leader/organizer", "Idea generator", "Listener/supporter", "Mediator/peacemaker"],
        },
        {
          text: "What's most challenging about group work for you?",
          options: ["Getting my point across", "Listening to differing opinions", "Staying on topic", "Sharing credit fairly"],
        },
        {
          text: "How do you feel about working in teams?",
          options: ["I love it", "I'm okay with it", "I prefer working alone", "Depends on the team"],
        },
      ],
    },
    quizPoll: {
      title: "Quiz: Group Discussion & Teamwork",
      type: "quiz",
      questions: [
        {
          text: "Effective teamwork requires:",
          options: ["One person doing all the work", "Clear communication and shared responsibility", "Avoiding all disagreement", "Working in isolation"],
          correct_answer: "Clear communication and shared responsibility",
        },
        {
          text: "In a group discussion, it's important to:",
          options: ["Dominate the conversation", "Listen respectfully and contribute constructively", "Stay silent the whole time", "Only agree with the loudest person"],
          correct_answer: "Listen respectfully and contribute constructively",
        },
        {
          text: "A sign of good leadership in a team is:",
          options: ["Making all decisions alone", "Helping the team collaborate and reach goals together", "Taking all the credit", "Ignoring team members' input"],
          correct_answer: "Helping the team collaborate and reach goals together",
        },
      ],
    },
  },
  {
    topicTitle: "Presentation Skills & Professional Behaviour",
    discussionPoll: {
      title: "Discussion: Presentation Skills & Professional Behaviour",
      type: "poll",
      questions: [
        {
          text: "How do you usually prepare for a presentation?",
          options: ["Write and practice a script", "Prepare key points only", "Wing it on the spot", "I usually avoid presenting"],
        },
        {
          text: "What matters most in a good presentation?",
          options: ["Clear content", "Confident delivery", "Good visuals/slides", "Engaging the audience"],
        },
        {
          text: "How would you rate your current presentation skills?",
          options: ["Excellent", "Good", "Average", "Needs improvement"],
        },
      ],
    },
    quizPoll: {
      title: "Quiz: Presentation Skills & Professional Behaviour",
      type: "quiz",
      questions: [
        {
          text: "Professional etiquette includes:",
          options: ["Being punctual and respectful", "Ignoring instructions", "Interrupting others frequently", "Dressing casually for all occasions"],
          correct_answer: "Being punctual and respectful",
        },
        {
          text: "A well-structured presentation typically has:",
          options: ["No clear order", "An introduction, main content, and conclusion", "Only a conclusion", "Random unrelated points"],
          correct_answer: "An introduction, main content, and conclusion",
        },
        {
          text: "Professional workplace behaviour includes:",
          options: ["Meeting deadlines and communicating clearly", "Avoiding all communication", "Ignoring team responsibilities", "Being unpredictable"],
          correct_answer: "Meeting deadlines and communicating clearly",
        },
      ],
    },
  },
  {
    topicTitle: "Competitive English - Vocabulary Development",
    discussionPoll: {
      title: "Discussion: Vocabulary Development",
      type: "poll",
      questions: [
        {
          text: "How comfortable are you with English vocabulary for competitive exams?",
          options: ["Very comfortable", "Somewhat comfortable", "Need more practice", "Struggling"],
        },
        {
          text: "How do you usually build your vocabulary?",
          options: ["Reading books/newspapers", "Vocabulary apps", "Word lists/flashcards", "I don't practice much"],
        },
        {
          text: "Which is harder for you?",
          options: ["Synonyms", "Antonyms", "Idioms", "Using words in context"],
        },
      ],
    },
    quizPoll: {
      title: "Exam-Style Quiz: Vocabulary",
      type: "quiz",
      questions: [
        {
          text: "Choose the synonym of 'Benevolent':",
          options: ["Kind", "Cruel", "Lazy", "Angry"],
          correct_answer: "Kind",
        },
        {
          text: "Choose the antonym of 'Abundant':",
          options: ["Plentiful", "Scarce", "Large", "Rich"],
          correct_answer: "Scarce",
        },
        {
          text: "'To beat around the bush' means:",
          options: ["To avoid saying something directly", "To work in a garden", "To win a competition", "To argue loudly"],
          correct_answer: "To avoid saying something directly",
        },
      ],
    },
  },
  {
    topicTitle: "Competitive English - Grammar & Comprehension",
    discussionPoll: {
      title: "Discussion: Grammar & Comprehension",
      type: "poll",
      questions: [
        {
          text: "Which grammar topic do you find hardest?",
          options: ["Tenses", "Subject-verb agreement", "Prepositions", "Sentence correction"],
        },
        {
          text: "How often do you read English passages for comprehension practice?",
          options: ["Daily", "A few times a week", "Rarely", "Never"],
        },
        {
          text: "What's your biggest challenge in reading comprehension?",
          options: ["Understanding vocabulary", "Understanding the main idea", "Answering inference questions", "Time management"],
        },
      ],
    },
    quizPoll: {
      title: "Exam-Style Quiz: Grammar & Comprehension",
      type: "quiz",
      questions: [
        {
          text: "Choose the correct sentence:",
          options: ["She don't like tea.", "She doesn't like tea.", "She not like tea.", "She didn't likes tea."],
          correct_answer: "She doesn't like tea.",
        },
        {
          text: "Identify the error: 'Neither of the boys have finished their homework.'",
          options: ["'Neither' is wrong", "'have' should be 'has'", "'their' should be 'his'", "No error"],
          correct_answer: "'have' should be 'has'",
        },
        {
          text: "Choose the correctly punctuated sentence:",
          options: ["Its a beautiful day, isnt it?", "It's a beautiful day, isn't it?", "Its a beautiful day, isn't it.", "It's a beautiful day isnt it"],
          correct_answer: "It's a beautiful day, isn't it?",
        },
      ],
    },
  },
  {
    topicTitle: "Quantitative Aptitude Fundamentals",
    discussionPoll: {
      title: "Discussion: Quantitative Aptitude",
      type: "poll",
      questions: [
        {
          text: "How confident are you with basic maths for competitive exams?",
          options: ["Very confident", "Somewhat confident", "Need practice", "Struggling"],
        },
        {
          text: "Which topic do you find hardest?",
          options: ["Percentages", "Ratios", "Profit & Loss", "Averages"],
        },
        {
          text: "How do you usually practice maths?",
          options: ["Textbook problems", "Online quizzes/apps", "Practice tests", "I rarely practice"],
        },
      ],
    },
    quizPoll: {
      title: "Exam-Style Quiz: Quantitative Aptitude",
      type: "quiz",
      questions: [
        {
          text: "What is 25% of 240?",
          options: ["60", "50", "70", "65"],
          correct_answer: "60",
        },
        {
          text: "If the ratio of boys to girls in a class is 3:2 and there are 30 students total, how many girls are there?",
          options: ["12", "18", "15", "10"],
          correct_answer: "12",
        },
        {
          text: "A shopkeeper buys an item for ₹200 and sells it for ₹250. What is the profit percentage?",
          options: ["20%", "25%", "30%", "50%"],
          correct_answer: "25%",
        },
      ],
    },
  },
  {
    topicTitle: "Speed Mathematics & Calculation Tricks",
    discussionPoll: {
      title: "Discussion: Speed Mathematics",
      type: "poll",
      questions: [
        {
          text: "How fast can you currently do calculations without a calculator?",
          options: ["Very fast", "Average speed", "A bit slow", "Very slow"],
        },
        {
          text: "Which calculation trick would help you most?",
          options: ["Fast multiplication", "Quick squares/cubes", "Percentage shortcuts", "Division shortcuts"],
        },
        {
          text: "How much time pressure do you feel during timed maths tests?",
          options: ["A lot", "Some", "A little", "None"],
        },
      ],
    },
    quizPoll: {
      title: "Exam-Style Quiz: Speed Mathematics",
      type: "quiz",
      questions: [
        {
          text: "Using shortcuts, what is 15 × 15?",
          options: ["215", "225", "235", "245"],
          correct_answer: "225",
        },
        {
          text: "What is the square of 21?",
          options: ["441", "431", "451", "421"],
          correct_answer: "441",
        },
        {
          text: "What is 99 × 99 using the shortcut for numbers near 100?",
          options: ["9801", "9701", "9601", "9901"],
          correct_answer: "9801",
        },
      ],
    },
  },
  {
    topicTitle: "Logical Reasoning & Analytical Thinking",
    discussionPoll: {
      title: "Discussion: Logical Reasoning",
      type: "poll",
      questions: [
        {
          text: "How do you feel about logical reasoning puzzles?",
          options: ["I enjoy them", "They're okay", "They're challenging", "I struggle with them"],
        },
        {
          text: "Which type of reasoning question is hardest for you?",
          options: ["Pattern/series", "Blood relations", "Coding-decoding", "Direction sense"],
        },
        {
          text: "How do you approach a tricky reasoning question?",
          options: ["Work through it step by step", "Look for patterns first", "Eliminate wrong options", "Guess if unsure"],
        },
      ],
    },
    quizPoll: {
      title: "Exam-Style Quiz: Logical Reasoning",
      type: "quiz",
      questions: [
        {
          text: "Find the next number in the series: 2, 4, 8, 16, ___",
          options: ["24", "32", "30", "20"],
          correct_answer: "32",
        },
        {
          text: "If 'CAT' is coded as 'DBU', how is 'DOG' coded?",
          options: ["EPH", "EPI", "FQH", "EQH"],
          correct_answer: "EPH",
        },
        {
          text: "Pointing to a photo, Ravi said, 'She is the daughter of my grandfather's only son.' How is the girl related to Ravi?",
          options: ["Sister", "Cousin", "Mother", "Aunt"],
          correct_answer: "Sister",
        },
      ],
    },
  },
  {
    topicTitle: "Problem Solving & Data Interpretation",
    discussionPoll: {
      title: "Discussion: Problem Solving & Data Interpretation",
      type: "poll",
      questions: [
        {
          text: "How comfortable are you reading charts and graphs?",
          options: ["Very comfortable", "Somewhat comfortable", "Need practice", "Not comfortable"],
        },
        {
          text: "What's your approach to a tough problem?",
          options: ["Break it into smaller steps", "Look for a similar solved example", "Ask for help", "Try random approaches"],
        },
        {
          text: "Which data format is hardest for you to interpret?",
          options: ["Bar graphs", "Pie charts", "Tables", "Line graphs"],
        },
      ],
    },
    quizPoll: {
      title: "Exam-Style Quiz: Problem Solving & Data Interpretation",
      type: "quiz",
      questions: [
        {
          text: "A pie chart shows expenses: Salaries 40%, Rent 20%, Marketing 25%, Others 15%. If total expenses are ₹2,00,000, how much is spent on Rent?",
          options: ["₹40,000", "₹50,000", "₹80,000", "₹30,000"],
          correct_answer: "₹40,000",
        },
        {
          text: "If a train travels 300 km in 5 hours, what is its average speed?",
          options: ["50 km/h", "60 km/h", "70 km/h", "55 km/h"],
          correct_answer: "60 km/h",
        },
        {
          text: "Monthly sales were Jan-100, Feb-150, Mar-120. What is the average monthly sales?",
          options: ["123.3", "120", "135", "140"],
          correct_answer: "123.3",
        },
      ],
    },
  },
  {
    topicTitle: "Entrepreneurship & Freelancing",
    discussionPoll: {
      title: "Discussion: Entrepreneurship & Freelancing",
      type: "poll",
      questions: [
        {
          text: "Have you ever thought about starting your own business someday?",
          options: ["Yes, definitely", "Maybe", "Not really", "No, never"],
        },
        {
          text: "What excites you most about entrepreneurship?",
          options: ["Being your own boss", "Creating something new", "Financial potential", "Solving real problems"],
        },
        {
          text: "What worries you most about starting a business?",
          options: ["Financial risk", "Fear of failure", "Lack of knowledge", "Uncertainty/instability"],
        },
      ],
    },
    quizPoll: {
      title: "Quiz: Entrepreneurship & Freelancing",
      type: "quiz",
      questions: [
        {
          text: "Freelancing is best described as:",
          options: ["Working for one employer permanently", "Working independently on a project/contract basis for multiple clients", "A type of government job", "Unpaid volunteer work"],
          correct_answer: "Working independently on a project/contract basis for multiple clients",
        },
        {
          text: "A key trait of successful entrepreneurs is:",
          options: ["Avoiding all risks", "Willingness to take calculated risks and learn from failure", "Never changing their plans", "Working alone without any team"],
          correct_answer: "Willingness to take calculated risks and learn from failure",
        },
        {
          text: "A 'startup' typically refers to:",
          options: ["Any large, established company", "A newly founded company solving a problem, often with growth potential", "A government office", "A school club"],
          correct_answer: "A newly founded company solving a problem, often with growth potential",
        },
      ],
    },
  },
  {
    topicTitle: "Career Planning & Personal Roadmap",
    discussionPoll: {
      title: "Discussion: Career Planning & Personal Roadmap",
      type: "poll",
      questions: [
        {
          text: "How clear is your career roadmap right now?",
          options: ["Very clear", "Somewhat clear", "Still figuring it out", "Not clear at all"],
        },
        {
          text: "What's your next concrete step after this programme?",
          options: ["Research career options further", "Talk to family about my plans", "Focus on specific subjects/skills", "Not sure yet"],
        },
        {
          text: "How has this programme changed your thinking about your career?",
          options: ["A lot", "Somewhat", "A little", "Not much"],
        },
      ],
    },
    quizPoll: {
      title: "Quiz: Career Planning & Personal Roadmap",
      type: "quiz",
      questions: [
        {
          text: "A personal career roadmap typically includes:",
          options: ["Only your final job title", "Short-term and long-term goals with action steps", "A list of famous people", "Nothing specific"],
          correct_answer: "Short-term and long-term goals with action steps",
        },
        {
          text: "The most reliable foundation for career planning is:",
          options: ["Copying a friend's choice", "Combining self-awareness, interests, and research", "Choosing randomly", "Waiting for someone else to decide"],
          correct_answer: "Combining self-awareness, interests, and research",
        },
        {
          text: "Why should a career roadmap be reviewed and updated over time?",
          options: ["Because plans should never be revisited", "Because interests, skills, and opportunities can change", "Because it's a strict legal requirement", "It shouldn't be updated"],
          correct_answer: "Because interests, skills, and opportunities can change",
        },
      ],
    },
  },
];
