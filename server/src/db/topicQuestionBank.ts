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
// (multiple-choice with a correct_answer) per curriculum topic — 5 questions each, so
// instructors have real variety across repeat cohorts/years instead of using the same 3
// every time. Topics 18-25 — Competitive English through Career Planning, the
// exam-prep/aptitude stretch that typically lands in the programme's closing days — get
// genuinely harder, exam-style quiz questions rather than simple comprehension checks.
export const TOPIC_QUESTION_BANK: TopicBankEntry[] = [
  {
    topicTitle: "Discovering My Interests",
    discussionPoll: {
      title: "Discussion: Discovering My Interests",
      type: "poll",
      questions: [
        {
          text: "What's something you enjoy doing in your free time?",
          options: ["Building or fixing things", "Reading or writing", "Playing sports/being active", "Hanging out with friends"],
        },
        {
          text: "Which of these sounds most like you?",
          options: ["I like figuring out how things work", "I like creating things (art, music, stories)", "I like helping or teaching others", "I like being in charge of a group"],
        },
        {
          text: "How much have you thought about what you enjoy, versus what you're good at?",
          options: ["A lot — I know both", "Mostly what I'm good at", "Mostly what I enjoy", "Haven't thought about either much"],
        },
        {
          text: "Do you think your interests will change as you grow older?",
          options: ["Yes, a lot", "Yes, a little", "No, they'll stay the same", "Not sure"],
        },
        {
          text: "Which corner would you have picked in today's activity?",
          options: ["Hands-On", "Creative", "Helping Others", "Leading & Organizing"],
        },
      ],
    },
    quizPoll: {
      title: "Quiz: Discovering My Interests",
      type: "quiz",
      questions: [
        {
          text: "An 'interest' is best described as:",
          options: ["Something you're forced to do", "Something that makes you want to keep doing or learning more about it", "Something you're already the best at", "Something your parents chose for you"],
          correct_answer: "Something that makes you want to keep doing or learning more about it",
        },
        {
          text: "According to today's session, how many broad 'flavors' of interest were introduced?",
          options: ["Three", "Four", "Six", "Ten"],
          correct_answer: "Six",
        },
        {
          text: "Someone who enjoys building, fixing, and being outdoors fits which flavor?",
          options: ["Creative", "Hands-on", "Organizing things", "Leading others"],
          correct_answer: "Hands-on",
        },
        {
          text: "Which is TRUE about interests?",
          options: ["Everyone has only one interest", "Most people have a mix of a few interest flavors", "Interests never change", "You must already be good at something to be interested in it"],
          correct_answer: "Most people have a mix of a few interest flavors",
        },
        {
          text: "Why is it useful to notice your interests early?",
          options: ["It guarantees a specific job", "It helps you pay attention to yourself on purpose", "It's required for school", "It has no real use"],
          correct_answer: "It helps you pay attention to yourself on purpose",
        },
      ],
    },
  },
  {
    topicTitle: "The World of Work",
    discussionPoll: {
      title: "Discussion: The World of Work",
      type: "poll",
      questions: [
        {
          text: "Which industry sounds most interesting to you?",
          options: ["Healthcare", "Technology", "Creative & Media", "Business"],
        },
        {
          text: "How many different jobs do you think exist in the world?",
          options: ["Under 100", "A few hundred", "A few thousand", "Tens of thousands or more"],
        },
        {
          text: "Have you ever met someone with a job you didn't know existed before?",
          options: ["Yes, several times", "Yes, once or twice", "No, but I'd like to", "No, not that I remember"],
        },
        {
          text: "Which job would you want to try for just one day?",
          options: ["Something hands-on/outdoors", "Something creative", "Something with technology", "Something helping people"],
        },
        {
          text: "Do you think a job you might do someday exists yet?",
          options: ["Yes, definitely", "Maybe", "Probably not", "Not sure"],
        },
      ],
    },
    quizPoll: {
      title: "Quiz: The World of Work",
      type: "quiz",
      questions: [
        {
          text: "An 'industry' is best described as:",
          options: ["A single company", "A big category that groups similar kinds of jobs together", "A type of school subject", "A government department only"],
          correct_answer: "A big category that groups similar kinds of jobs together",
        },
        {
          text: "Which of these is an example of the Technology industry?",
          options: ["App developer", "Farmer", "Postal worker", "Chef"],
          correct_answer: "App developer",
        },
        {
          text: "Which statement is TRUE about jobs today?",
          options: ["All jobs that exist today have always existed", "New jobs are being created all the time as the world changes", "Only a few dozen jobs exist in total", "Every job fits into exactly one industry with no overlap"],
          correct_answer: "New jobs are being created all the time as the world changes",
        },
        {
          text: "A drone pilot or app developer are examples of:",
          options: ["Jobs that have existed for over 100 years", "Jobs that didn't exist a generation ago", "Government-only jobs", "Jobs that don't require any skill"],
          correct_answer: "Jobs that didn't exist a generation ago",
        },
        {
          text: "Almost everything around you — chairs, lights, buildings — was:",
          options: ["Made by machines with no humans involved", "Designed, built, or run by someone doing a job", "Always there, nobody made it", "Irrelevant to careers"],
          correct_answer: "Designed, built, or run by someone doing a job",
        },
      ],
    },
  },
  {
    topicTitle: "Everyone Has a Talent",
    discussionPoll: {
      title: "Discussion: Everyone Has a Talent",
      type: "poll",
      questions: [
        {
          text: "What's one thing you think you're genuinely good at?",
          options: ["A hands-on skill", "A creative skill", "Helping or listening to others", "Staying organized or focused"],
        },
        {
          text: "How comfortable are you naming your own strengths out loud?",
          options: ["Very comfortable", "Somewhat comfortable", "A little uncomfortable", "Very uncomfortable"],
        },
        {
          text: "Has someone ever pointed out a talent in you that you hadn't noticed yourself?",
          options: ["Yes, definitely", "Maybe, a little", "Not that I recall", "No, never"],
        },
        {
          text: "Which non-academic talent do you value most in a friend?",
          options: ["Kindness", "Humor", "Reliability", "Creativity"],
        },
        {
          text: "Do you think talents can be improved with practice?",
          options: ["Yes, all of them", "Some of them", "Not really", "Not sure"],
        },
      ],
    },
    quizPoll: {
      title: "Quiz: Everyone Has a Talent",
      type: "quiz",
      questions: [
        {
          text: "Which of these is a talent that usually does NOT show up on a report card?",
          options: ["Being kind and patient", "Maths test scores", "Spelling test results", "Attendance record"],
          correct_answer: "Being kind and patient",
        },
        {
          text: "A great team is best described as:",
          options: ["A group where everyone has the exact same strength", "A group where different strengths combine together", "A group with only one leader and no other roles", "A group that never disagrees"],
          correct_answer: "A group where different strengths combine together",
        },
        {
          text: "Why do people sometimes not notice their own talents?",
          options: ["Because they don't have any", "Because talents that come naturally can feel unremarkable to the person who has them", "Because talents are always obvious to everyone", "Because only rare people have talents"],
          correct_answer: "Because talents that come naturally can feel unremarkable to the person who has them",
        },
        {
          text: "Which is an example of a leadership-related talent?",
          options: ["Organizing a group activity", "Solving a maths problem alone", "Reading quietly", "Memorizing facts"],
          correct_answer: "Organizing a group activity",
        },
        {
          text: "Recognizing everyone's different talents in a team helps mainly by:",
          options: ["Making one person do all the work", "Letting the team use each person's strengths effectively", "Making the team smaller", "Avoiding teamwork altogether"],
          correct_answer: "Letting the team use each person's strengths effectively",
        },
      ],
    },
  },
  {
    topicTitle: "Speaking Up with Confidence",
    discussionPoll: {
      title: "Discussion: Speaking Up with Confidence",
      type: "poll",
      questions: [
        {
          text: "How nervous do you feel speaking in front of the class?",
          options: ["Not nervous at all", "A little nervous", "Quite nervous", "Very nervous"],
        },
        {
          text: "What worries you most about speaking up?",
          options: ["Forgetting what to say", "Being laughed at", "My voice shaking", "Nothing really worries me"],
        },
        {
          text: "How often do you get chances to speak in front of others?",
          options: ["Often", "Sometimes", "Rarely", "Never"],
        },
        {
          text: "Which of the three tools do you think would help you most?",
          options: ["Breathing first", "Picking one friendly face", "Slowing down", "I don't need help"],
        },
        {
          text: "How did the pair practice feel?",
          options: ["Easy and comfortable", "A little awkward at first, then okay", "Quite uncomfortable", "I'd rather not say"],
        },
      ],
    },
    quizPoll: {
      title: "Quiz: Speaking Up with Confidence",
      type: "quiz",
      questions: [
        {
          text: "Feeling nervous before speaking in public is:",
          options: ["A sign you shouldn't speak", "Completely normal and manageable with practice", "Something only beginners feel", "Impossible to overcome"],
          correct_answer: "Completely normal and manageable with practice",
        },
        {
          text: "Taking one slow breath before speaking mainly helps by:",
          options: ["Wasting time", "Calming your voice and nerves", "Making you forget your words", "Making the audience nervous too"],
          correct_answer: "Calming your voice and nerves",
        },
        {
          text: "Why does picking 'one friendly face' in the audience help?",
          options: ["It's less overwhelming than trying to look at everyone", "It guarantees a perfect speech", "It's a rule you must follow exactly", "It has no real effect"],
          correct_answer: "It's less overwhelming than trying to look at everyone",
        },
        {
          text: "Nervous speaking often makes people:",
          options: ["Speak too slowly", "Speak too fast without noticing", "Stop talking completely", "Speak too quietly always"],
          correct_answer: "Speak too fast without noticing",
        },
        {
          text: "The best way to build speaking confidence is to:",
          options: ["Avoid all speaking opportunities", "Practice, starting with small and low-pressure situations", "Only speak once you're perfectly ready", "Memorize without understanding"],
          correct_answer: "Practice, starting with small and low-pressure situations",
        },
      ],
    },
  },
  {
    topicTitle: "Working Together",
    discussionPoll: {
      title: "Discussion: Working Together",
      type: "poll",
      questions: [
        {
          text: "In a group project, what role do you usually take?",
          options: ["Leader/organizer", "Idea person", "Helper/supporter", "Peacemaker"],
        },
        {
          text: "What's the hardest part about working in a group for you?",
          options: ["Getting my ideas heard", "Listening to others", "Sharing tasks fairly", "Handling disagreements"],
        },
        {
          text: "How did the silent planning minute feel during the Tower Challenge?",
          options: ["Strange but useful", "Frustrating", "Fine, no big deal", "I didn't mind it"],
        },
        {
          text: "How do you feel about working in teams generally?",
          options: ["I love it", "I'm okay with it", "I prefer working alone", "Depends on the team"],
        },
        {
          text: "What matters most for a team to work well?",
          options: ["Everyone being friends already", "Clear communication", "One strong leader", "Working fast"],
        },
      ],
    },
    quizPoll: {
      title: "Quiz: Working Together",
      type: "quiz",
      questions: [
        {
          text: "A real team (not just a group standing together) needs:",
          options: ["Everyone doing the exact same task", "Everyone being heard and sharing tasks fairly", "One person doing all the work", "No talking allowed ever"],
          correct_answer: "Everyone being heard and sharing tasks fairly",
        },
        {
          text: "When people disagree in a team, the best approach is to:",
          options: ["Ignore the disagreement", "Work it out together instead of giving up or fighting", "Let the loudest person win", "Split into two separate teams"],
          correct_answer: "Work it out together instead of giving up or fighting",
        },
        {
          text: "In the Tower Challenge, the silent planning minute was meant to show:",
          options: ["That talking is never useful", "How communication changes teamwork", "That silence always works better", "That planning doesn't matter"],
          correct_answer: "How communication changes teamwork",
        },
        {
          text: "Communicating without words (like in Silent Line-Up) mainly requires:",
          options: ["Giving up", "Careful gestures and paying attention to others", "Shouting louder", "Working alone instead"],
          correct_answer: "Careful gestures and paying attention to others",
        },
        {
          text: "Good teamwork is important because:",
          options: ["It's only useful in sports", "It's a skill needed in school, friendships, and future jobs", "It's not actually useful", "Only adults need it"],
          correct_answer: "It's a skill needed in school, friendships, and future jobs",
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
        {
          text: "Which emerging trend do you think will affect India the most in the next decade?",
          options: ["Automation/AI", "Climate/renewable energy", "Digital economy/e-commerce", "Healthcare innovation"],
        },
        {
          text: "Would you be willing to move to a new city for an emerging-field career?",
          options: ["Yes, definitely", "Maybe, if needed", "Only within my state", "No, I'd rather stay local"],
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
        {
          text: "'Gig economy' refers to:",
          options: ["Permanent full-time-only jobs", "Short-term, flexible, project-based work", "Government jobs only", "Unpaid internships"],
          correct_answer: "Short-term, flexible, project-based work",
        },
        {
          text: "Which of these is an emerging trend directly created by growing internet access in smaller towns?",
          options: ["Decline of all online business", "Rise of regional-language content creators", "Fewer digital payment users", "Less demand for delivery services"],
          correct_answer: "Rise of regional-language content creators",
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
          options: ["Excited about new opportunities", "Worried about job loss", "Both excited and worried", "Haven't thought about it much"],
        },
        {
          text: "Have you personally used an AI tool (like a chatbot)?",
          options: ["Yes, often", "Yes, a few times", "No, but I know what it is", "No, never heard of it"],
        },
        {
          text: "Which industry do you think AI will change the most?",
          options: ["Healthcare", "Education", "Transportation", "Entertainment"],
        },
        {
          text: "Have you ever worried that AI could replace the career you want?",
          options: ["Yes, often", "Yes, occasionally", "Rarely", "Never"],
        },
        {
          text: "Would you want to learn how to build/use AI tools yourself?",
          options: ["Yes, very interested", "Maybe, if it's easy to learn", "Not particularly", "No interest at all"],
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
        {
          text: "Which best describes 'automation'?",
          options: ["Using machines/software to perform tasks with minimal human input", "Any use of electricity", "A type of career field", "A government scheme"],
          correct_answer: "Using machines/software to perform tasks with minimal human input",
        },
        {
          text: "AI is generally weakest at tasks requiring:",
          options: ["Fast calculations", "Repetitive data processing", "Genuine empathy and nuanced human judgment", "Pattern recognition in large datasets"],
          correct_answer: "Genuine empathy and nuanced human judgment",
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
        {
          text: "Which industry do you know the LEAST about?",
          options: ["Engineering/Technology", "Healthcare/Medicine", "Commerce/Business", "Arts/Creative fields"],
        },
        {
          text: "Have you ever spoken to someone working in a field you're curious about?",
          options: ["Yes, several people", "Yes, one person", "No, but I'd like to", "No, and not planning to"],
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
        {
          text: "Which pair correctly matches an industry with a career within it?",
          options: ["Agriculture — Agronomist", "Retail — Radiologist", "Defence — Choreographer", "Aviation — Pathologist"],
          correct_answer: "Agriculture — Agronomist",
        },
        {
          text: "A career that spans MULTIPLE industries at once is best exemplified by:",
          options: ["A data analyst working across healthcare, finance, and retail projects", "A job that only exists in one factory", "A role banned from changing sectors", "None of the above"],
          correct_answer: "A data analyst working across healthcare, finance, and retail projects",
        },
      ],
    },
  },
  {
    topicTitle: "Choosing a Stream",
    discussionPoll: {
      title: "Discussion: Choosing a Stream",
      type: "poll",
      questions: [
        {
          text: "How clear are you about which stream you want after Class 10?",
          options: ["Very clear", "Somewhat clear", "Not really", "No idea yet"],
        },
        {
          text: "What's influencing your stream choice most right now?",
          options: ["My own interests", "My marks in certain subjects", "Family expectations", "What my friends are choosing"],
        },
        {
          text: "Have you ever heard the myth that 'Science is for smart students'?",
          options: ["Yes, often", "Yes, a few times", "No, never heard it", "Not sure"],
        },
        {
          text: "Who would you most want to talk to before deciding your stream?",
          options: ["Parents/family", "Teachers", "Seniors who've already chosen", "A career counsellor"],
        },
        {
          text: "How much does this decision worry you right now?",
          options: ["A lot", "Somewhat", "A little", "Not at all"],
        },
      ],
    },
    quizPoll: {
      title: "Quiz: Choosing a Stream",
      type: "quiz",
      questions: [
        {
          text: "Choosing a stream mainly changes:",
          options: ["Your personality permanently", "Your subjects, relevant exams, and eligible college courses", "Nothing at all", "Only your friend group"],
          correct_answer: "Your subjects, relevant exams, and eligible college courses",
        },
        {
          text: "The idea that 'Science is for smart students, Commerce and Arts are for the rest' is:",
          options: ["Completely true", "A damaging myth — streams reflect interests, not intelligence", "Only true in some schools", "An official rule"],
          correct_answer: "A damaging myth — streams reflect interests, not intelligence",
        },
        {
          text: "Switching streams after choosing one is:",
          options: ["Completely impossible", "Harder, but not impossible", "Always easy", "Illegal"],
          correct_answer: "Harder, but not impossible",
        },
        {
          text: "Which is the best foundation for choosing a stream?",
          options: ["Copying a friend's choice", "Combining genuine interest, self-reflection, and research", "Picking randomly", "Choosing whatever is easiest"],
          correct_answer: "Combining genuine interest, self-reflection, and research",
        },
        {
          text: "JEE and NEET are examples of:",
          options: ["School subjects", "Competitive exams linked to specific streams", "Stream names", "Career counselling programmes"],
          correct_answer: "Competitive exams linked to specific streams",
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
        {
          text: "How often do you set aside quiet time to think about your own goals?",
          options: ["Regularly", "Occasionally", "Rarely", "Never"],
        },
        {
          text: "Which is closer to how you make choices?",
          options: ["Based on logic/facts", "Based on feelings/values", "A mix of both", "I usually let others decide"],
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
        {
          text: "Which of these is an example of a value (not a skill or interest)?",
          options: ["Typing speed", "Fairness", "Drawing ability", "Football"],
          correct_answer: "Fairness",
        },
        {
          text: "Understanding yourself helps career planning mainly by:",
          options: ["Making the process harder", "Narrowing choices toward what genuinely fits you", "Guaranteeing a specific job", "Replacing the need for research"],
          correct_answer: "Narrowing choices toward what genuinely fits you",
        },
      ],
    },
  },
  {
    topicTitle: "Understanding Your Results",
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
        {
          text: "Would you want your parents to see your results too?",
          options: ["Yes, definitely", "Maybe, with explanation", "I'd rather they didn't", "Not sure"],
        },
        {
          text: "How much weight should a single test carry in a big decision like stream choice?",
          options: ["It should decide everything", "It should be one important input", "It should be ignored completely", "Not sure"],
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
        {
          text: "A high score on a single RIASEC dimension mainly suggests:",
          options: ["A guaranteed career match", "A relative preference compared to other dimensions", "You have no other interests", "You will succeed only in that field"],
          correct_answer: "A relative preference compared to other dimensions",
        },
        {
          text: "The most useful next step after getting your results is usually to:",
          options: ["File them away and forget them", "Research careers linked to your top dimensions", "Immediately pick a final career", "Compare scores competitively with friends"],
          correct_answer: "Research careers linked to your top dimensions",
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
        {
          text: "Do you tend to decide quickly or take your time on big decisions?",
          options: ["Quickly", "I take my time", "Depends on the decision", "I often avoid deciding"],
        },
        {
          text: "What would help you make better decisions right now?",
          options: ["More information", "More confidence", "More support from others", "More time"],
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
        {
          text: "Long-term goals are best supported by:",
          options: ["Ignoring short-term steps", "A series of connected short-term goals", "Waiting until the goal is close", "Random unrelated actions"],
          correct_answer: "A series of connected short-term goals",
        },
        {
          text: "Which is a sign of a poorly made decision-making process (not necessarily outcome)?",
          options: ["Considering multiple options", "Deciding based on complete guesswork with no reflection", "Asking for advice", "Weighing pros and cons"],
          correct_answer: "Deciding based on complete guesswork with no reflection",
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
        {
          text: "Have you ever chosen an activity/subject purely because you enjoyed it, not because it was 'useful'?",
          options: ["Yes, often", "Yes, sometimes", "Rarely", "Never"],
        },
        {
          text: "If your top interest and your family's top choice for you don't match, what would you do?",
          options: ["Follow my interest", "Follow family's choice", "Try to find a middle ground", "Not sure yet"],
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
        {
          text: "A 'career cluster' groups together:",
          options: ["Unrelated jobs randomly", "Careers sharing similar skills/interests/work environments", "Only government jobs", "Jobs in one company"],
          correct_answer: "Careers sharing similar skills/interests/work environments",
        },
        {
          text: "When interests and skills don't perfectly align, a sensible approach is to:",
          options: ["Ignore skills entirely", "Ignore interests entirely", "Look for careers that blend both, or build the missing skill", "Give up on planning"],
          correct_answer: "Look for careers that blend both, or build the missing skill",
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
        {
          text: "In your friend group, are you usually the one who talks or listens more?",
          options: ["I talk more", "I listen more", "Balanced", "Depends on the group"],
        },
        {
          text: "How comfortable are you giving feedback to someone else?",
          options: ["Very comfortable", "Somewhat comfortable", "A little uncomfortable", "Very uncomfortable"],
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
        {
          text: "The sender-message-receiver model shows that communication breaks down when:",
          options: ["The message is misunderstood at any stage", "Only when the sender makes a mistake", "Communication never breaks down", "Only in written communication"],
          correct_answer: "The message is misunderstood at any stage",
        },
        {
          text: "'Feedback' in communication is most useful when it is:",
          options: ["Vague and general", "Specific and constructive", "Purely negative", "Given only once a year"],
          correct_answer: "Specific and constructive",
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
        {
          text: "What's the biggest speaking opportunity you've had so far in life?",
          options: ["A school event/stage", "A classroom presentation", "A small group conversation", "I haven't had one yet"],
        },
        {
          text: "Would you volunteer to speak first in a group activity, or wait?",
          options: ["Volunteer first", "Wait and watch others", "Depends on the topic", "Avoid it if I can"],
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
        {
          text: "Nervousness before speaking is:",
          options: ["A sign you shouldn't speak", "A normal physical response that can be managed with practice", "Something only beginners feel", "Impossible to overcome"],
          correct_answer: "A normal physical response that can be managed with practice",
        },
        {
          text: "Which technique specifically helps calm speaking nerves in the moment?",
          options: ["Speaking as fast as possible", "Slow, deep breaths before starting", "Avoiding eye contact completely", "Memorizing word-for-word with no flexibility"],
          correct_answer: "Slow, deep breaths before starting",
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
        {
          text: "In a disagreement within a group, what do you usually do?",
          options: ["Push my point strongly", "Compromise quickly", "Try to understand the other side first", "Stay quiet"],
        },
        {
          text: "Do you prefer smaller or larger group discussions?",
          options: ["Smaller groups", "Larger groups", "No preference", "I prefer working alone"],
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
        {
          text: "A 'groupthink' problem happens when:",
          options: ["The group makes decisions too slowly", "Members avoid disagreement and don't challenge weak ideas", "Everyone works independently", "The group has too many leaders"],
          correct_answer: "Members avoid disagreement and don't challenge weak ideas",
        },
        {
          text: "Constructive conflict in a team is:",
          options: ["Always harmful and to be avoided", "Can lead to better ideas when handled respectfully", "The same as personal conflict", "A sign the team has failed"],
          correct_answer: "Can lead to better ideas when handled respectfully",
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
        {
          text: "Have you ever had to represent your class/school somewhere?",
          options: ["Yes, more than once", "Yes, once", "No, but I'd like to", "No, and not interested"],
        },
        {
          text: "How do you usually dress/prepare for something 'important'?",
          options: ["I plan it carefully in advance", "I decide last minute but it works out", "I don't think about it much", "I get anxious about it"],
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
        {
          text: "Punctuality in a professional setting mainly signals:",
          options: ["Nothing important", "Respect for others' time and reliability", "That you're anxious", "That you dislike the job"],
          correct_answer: "Respect for others' time and reliability",
        },
        {
          text: "A presentation's visuals/slides should mainly:",
          options: ["Contain every word you'll say", "Support and clarify your spoken points", "Be as colorful as possible regardless of content", "Be skipped entirely"],
          correct_answer: "Support and clarify your spoken points",
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
        {
          text: "How many new English words do you think you learn in an average week?",
          options: ["Many (10+)", "A few (3-9)", "1-2", "Almost none"],
        },
        {
          text: "Do you enjoy reading in English outside of school requirements?",
          options: ["Yes, regularly", "Sometimes", "Rarely", "Not at all"],
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
        {
          text: "Choose the synonym of 'Meticulous':",
          options: ["Careless", "Careful and precise", "Fast", "Loud"],
          correct_answer: "Careful and precise",
        },
        {
          text: "Choose the antonym of 'Reluctant':",
          options: ["Hesitant", "Willing", "Unsure", "Slow"],
          correct_answer: "Willing",
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
        {
          text: "Do you find spoken or written English grammar harder?",
          options: ["Spoken", "Written", "Both equally", "Neither is hard for me"],
        },
        {
          text: "How do you check your own grammar mistakes?",
          options: ["Re-read carefully", "Ask someone else", "Use an app/tool", "I don't usually check"],
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
        {
          text: "Choose the grammatically correct sentence:",
          options: ["He go to school daily.", "He goes to school daily.", "He going to school daily.", "He gone to school daily."],
          correct_answer: "He goes to school daily.",
        },
        {
          text: "In reading comprehension, an 'inference' question asks you to:",
          options: ["Find information stated word-for-word", "Conclude something implied but not directly stated", "Guess randomly", "Ignore the passage"],
          correct_answer: "Conclude something implied but not directly stated",
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
        {
          text: "Which do you find easier: percentages or ratios?",
          options: ["Percentages", "Ratios", "Both equally easy", "Both equally hard"],
        },
        {
          text: "How do you usually double-check a maths answer?",
          options: ["Redo the calculation", "Estimate to see if it's reasonable", "Ask someone else", "I usually don't check"],
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
        {
          text: "What is 40% of 150?",
          options: ["50", "60", "65", "70"],
          correct_answer: "60",
        },
        {
          text: "Two numbers are in the ratio 4:5. If the smaller number is 20, what is the larger number?",
          options: ["24", "25", "28", "30"],
          correct_answer: "25",
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
        {
          text: "Do you enjoy solving riddles/puzzles in your free time?",
          options: ["Yes, often", "Sometimes", "Rarely", "Never"],
        },
        {
          text: "When stuck on a reasoning problem, what do you do first?",
          options: ["Re-read the question carefully", "Try to eliminate wrong options", "Guess and move on", "Skip it entirely"],
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
        {
          text: "Find the odd one out: Apple, Banana, Carrot, Mango",
          options: ["Apple", "Banana", "Carrot", "Mango"],
          correct_answer: "Carrot",
        },
        {
          text: "If today is Wednesday, what day will it be after 17 days?",
          options: ["Saturday", "Sunday", "Friday", "Monday"],
          correct_answer: "Saturday",
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
        {
          text: "How often do you encounter charts/graphs outside school (news, apps, etc.)?",
          options: ["Very often", "Sometimes", "Rarely", "Never"],
        },
        {
          text: "Which data interpretation format do you find easiest?",
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
        {
          text: "A bar graph shows 4 cities' populations. Which is the best first step to answer 'which city has the highest population'?",
          options: ["Guess based on city size reputation", "Compare bar heights directly", "Ignore the graph and estimate", "Add all bars together"],
          correct_answer: "Compare bar heights directly",
        },
        {
          text: "If a car travels 240 km using 20 litres of fuel, what is its mileage?",
          options: ["10 km/l", "12 km/l", "14 km/l", "16 km/l"],
          correct_answer: "12 km/l",
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
        {
          text: "Do you personally know anyone who freelances or runs their own business?",
          options: ["Yes, a family member", "Yes, a friend/acquaintance", "No, but I've heard of it", "No, not really"],
        },
        {
          text: "What kind of business/service would you consider starting someday?",
          options: ["Something tech-related", "Something creative/artistic", "Something service-based (tutoring, repair, etc.)", "Not sure/not interested"],
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
        {
          text: "A 'business plan' primarily helps an entrepreneur:",
          options: ["Avoid ever having to adapt", "Think through the idea, market, and finances before starting", "Guarantee success", "Impress people with no real substance"],
          correct_answer: "Think through the idea, market, and finances before starting",
        },
        {
          text: "Which is a common early-stage challenge for freelancers?",
          options: ["Too much job security", "Irregular income and finding clients", "No need to market themselves", "Guaranteed paid leave"],
          correct_answer: "Irregular income and finding clients",
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
        {
          text: "How often do you think you'll need to revisit/update your career plan?",
          options: ["Never, once decided it's final", "Every few years", "Constantly", "Not sure"],
        },
        {
          text: "What's one thing you're going to do differently starting this week because of this programme?",
          options: ["Research a career option", "Talk to someone about my plans", "Focus on a specific skill", "Nothing different yet"],
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
        {
          text: "A realistic career roadmap should account for:",
          options: ["Only your dream outcome, ignoring obstacles", "Both your goals and realistic steps/obstacles along the way", "Only what your family wants", "Nothing beyond the next year"],
          correct_answer: "Both your goals and realistic steps/obstacles along the way",
        },
        {
          text: "The best time to start building a career roadmap is:",
          options: ["Only after finishing college", "Now, even if it will change over time", "Never, plans are pointless", "Only once you're completely certain"],
          correct_answer: "Now, even if it will change over time",
        },
      ],
    },
  },
];
