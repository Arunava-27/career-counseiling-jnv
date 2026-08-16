// A second, distinct hands-on activity per topic — an alternative to the one already baked
// into that topic's facilitator script in topicScripts.ts. Appended to each topic's
// content_markdown by seed.ts under an "## Alternate Activity" heading, so instructors running
// the same topic across different cohorts/years have a genuinely different activity to swap in
// (not just more MCQ questions). Each is designed for the same constraints as the rest of the
// app: no individual student devices, instructor-led, works on a bare classroom floor with a
// smartboard and whatever's already in the room (chart paper, chalk, or nothing at all).

export const TOPIC_ACTIVITIES: Record<string, string> = {
  "Discovering My Interests": `## Alternate Activity (~15 min)

**"Would You Rather?" Interest Game.**

1. Prepare 8-10 "Would you rather..." pairs, each contrasting two interest flavors (e.g. "Would you rather build a treehouse or write a story about one?", "Would you rather organize a class trip or lead a debate team?").
2. Read each pair aloud; students move to one side of the room (or raise a hand for their choice) to show which they'd pick.
3. After each round, ask 1-2 students why they picked their side.
4. Keep the pace fast and playful — this works well as a wake-up activity too.

*No materials needed beyond floor space or hands raised.*`,

  "The World of Work": `## Alternate Activity (~15 min)

**"Job Chain Reaction."**

1. Start with one job written on the board (e.g. "Farmer"). Ask: "Who does a farmer need help from to get their crops to a shop?" (e.g. a truck driver).
2. Continue the chain: the truck driver needs a mechanic, the mechanic needs a parts supplier, and so on — build a visual chain on the board as the class calls out each next link.
3. Keep going until the chain runs 8-10 jobs long, or the class runs out of ideas.
4. **Say:** "Notice how every single job connects to many others — nobody works completely alone."

*Materials: board space to draw the growing chain.*`,

  "Everyone Has a Talent": `## Alternate Activity (~12 min)

**"Strength Spotting Circle."**

1. Have students sit or stand in a rough circle (or go row by row if space is tight).
2. Pass an object around. Whoever holds it names ONE strength they've noticed in the person to their right — not themselves.
3. Continue until everyone has both given and received a compliment.
4. Debrief: "How did it feel to hear someone else name a strength in you that you might not have mentioned yourself?"

*No materials needed beyond any small object to pass around.*`,

  "Speaking Up with Confidence": `## Alternate Activity (~15 min)

**"Introduce Your Partner."**

1. Pair students up. Give 2 minutes for each partner to interview the other — name, one fun fact, one thing they're looking forward to this week.
2. Each student then stands and introduces their PARTNER to the class (not themselves) — talking about someone else is often much less scary than talking about yourself.
3. Keep each introduction short (15-20 seconds) and celebratory — applause after every single one.

*No materials needed beyond a way to keep time.*`,

  "Working Together": `## Alternate Activity (~15 min)

**"Paper Chain Relay."**

1. Split into teams. Give each team strips of paper and tape or glue.
2. Teams race to build the longest paper chain in 5 minutes, with a rule that every team member must add at least one link.
3. Measure and compare chains at time's up.
4. Debrief: "Did everyone get a turn to contribute? What happened if one person tried to do it all alone?"

*Materials: paper strips and tape/glue per team.*`,

  "Choosing a Stream": `## Alternate Activity (~18 min)

**"Two Paths" Decision Map.**

1. Give each student paper. **Say:** "Privately — this is just for you — sketch two possible stream paths you're considering, even if you're not sure yet. For each one, write one line for 'what excites me about this' and one line for 'what worries me about this.'"
2. Give 8 minutes to sketch individually; this is personal, so there's no requirement to share specifics.
3. In pairs, students can share as much or as little as they're comfortable with.
4. Close: **Say:** "Keep this paper. It's not a final decision — it's a starting point for a real conversation with your family or a teacher."

*Materials: paper for each student. Keeps the reflection private, which matters for a decision this personal.*`,

  "Emerging Career Trends": `## Alternate Activity (~18 min)

**"Future Job Fair."**

1. Split the class into groups of 4–5.
2. **Say:** "Each group is going to invent one career that you think will exist in 15 years but doesn't really exist yet — or exists but is tiny today. Give it a job title, describe what a typical day looks like, and say what skill matters most for it."
3. Give groups 8 minutes to sketch this out on chart paper (or just talk it through if no paper is available).
4. Each group pitches their invented career to the class in under a minute — "recruiting" for it.
5. After all groups present, take a quick show of hands: which invented career would the class most want to "apply" for?

*Materials: chart paper/markers if available, otherwise verbal pitches work fine.*`,

  "Artificial Intelligence (AI) & Automation": `## Alternate Activity (~12 min)

**"Human or Machine?" relay.**

1. **Say:** "I'll call out a task. If you think AI/automation can already do this well today, raise your hand. If you think it still needs a human, keep your hand down."
2. Call out tasks in quick succession: "Writing a news summary," "Comforting a grieving friend," "Driving a car on a highway," "Deciding a court verdict," "Diagnosing a rare illness," "Composing a pop song," "Negotiating a business deal," "Sorting warehouse packages."
3. After each, briefly reveal the real-world state of play (many of these are already partly automated, which usually surprises the room) and ask why the ones that need humans still do.
4. Close by asking: "What's the one thing on this list that you think will still need a human in 20 years?" — take a few verbal answers.

*No materials needed. Works well as a fast-paced, standing activity.*`,

  "Career Opportunities Across Industries": `## Alternate Activity (~15 min)

**"Industry Cards Sort."**

1. Before class, write 15–20 job titles on separate slips/cards (e.g. Nurse, Software Developer, Chef, Civil Engineer, Graphic Designer, Bank Officer, Journalist, Farmer, Pilot, Fashion Designer).
2. Split the class into small groups and give each group a mixed set of cards.
3. **Say:** "Sort these into industries — Healthcare, Technology, Business/Finance, Creative Arts, Government/Defence, Agriculture — whatever categories make sense to you. Some cards might fit more than one; that's fine, just pick one and be ready to defend it."
4. After 5 minutes, go group by group and ask for one card each group had trouble placing, and why — this naturally surfaces how many careers now cross industries.

*Materials: pre-written cards/slips (reusable across sessions once made).*`,

  "Knowing Yourself": `## Alternate Activity (~15 min)

**"Five Words" gallery walk.**

1. Give each student a small piece of paper. **Say:** "Write five words that describe who you are — not what you want to become, just who you are right now. Strengths, quirks, values, whatever feels true."
2. Stick the papers up around the room (or lay them on desks) anonymously.
3. Give students 3–4 minutes to silently walk around and read others' words.
4. Regroup and ask: "Did any word show up again and again? Did anything surprise you about how your classmates see themselves?"

*Materials: paper slips, tape if sticking to walls. If wall space isn't available, students can just pass their slip to the person next to them instead of a full gallery walk.*`,

  "Understanding Your Results": `## Alternate Activity (~15 min)

**"Result Detective" pair exercise.**

1. Put up a sample (anonymised/fictional) result summary on the smartboard — e.g. a bar chart showing high Social and Investigative scores, low Realistic score.
2. In pairs, students discuss: "If this were your result, what career directions might it point toward? What would you want to ask a counsellor about it?"
3. Give pairs 5 minutes, then take 2–3 pairs' answers aloud.
4. **Say:** "Notice we didn't jump to 'this means you should become X.' A result opens questions, it doesn't hand you an answer — that's exactly how you should treat your own."

*Materials: a sample results chart drawn on the board or displayed on the smartboard.*`,

  "Decision Making & Goal Identification": `## Alternate Activity (~15 min)

**"Decision Tree Sketch."**

1. **Say:** "Think of one real decision you're facing this year — stream choice, an extracurricular, anything real."
2. On paper, have students sketch a simple decision tree: the decision at the top, 2–3 branches for the options, and under each branch one line for 'what I'd gain' and one for 'what I'd risk.'
3. Give 6–7 minutes to sketch individually (this is personal, so no need to share the specific decision).
4. Ask for a show of hands: "Did sketching it out change how clear the decision feels — clearer, murkier, or the same?"

*Materials: paper for each student. Keeps decisions private, so it's safe even for sensitive family/personal choices.*`,

  "Matching Interests with Career Choices": `## Alternate Activity (~15 min)

**"Speed Matching."**

1. Before class, prepare two sets of cards: one set of "interests" (e.g. "Loves solving puzzles," "Enjoys persuading people," "Cares about fairness and justice," "Loves drawing/design") and one set of "careers" (e.g. Detective/Analyst, Sales/Marketing, Lawyer/Judge, Graphic Designer).
2. Shuffle both sets together and spread face-up on a table or the floor.
3. In pairs or small groups, students race to correctly match interest cards to the career card they think fits best, against a 3-minute timer.
4. Check answers together as a class — some matches are intentionally debatable, so use disagreements as discussion starters ("Why did your team match this differently?").

*Materials: pre-written interest and career cards (reusable — make a laminated set if running this programme repeatedly).*`,

  "Communication Skills - The Basics": `## Alternate Activity (~10 min)

**"Broken Telephone Plus."**

1. Split the class into lines/chains of 6–8 students.
2. Whisper a moderately detailed sentence to the first student in each chain (e.g. "The interview is at 3:15 pm in Room 204, and you should bring two copies of your resume and a valid ID.").
3. Each student whispers what they heard to the next, down the line, once only.
4. The last student says out loud what they received. Compare to the original — it's almost always garbled.
5. Debrief: "This is what happens to information without clear, active communication. What could this chain have done differently to preserve the message?"

*No materials needed. High energy, good for a post-lunch slot.*`,

  "Public Speaking & Confidence Building": `## Alternate Activity (~15 min)

**"One-Minute Wonder."**

1. Prepare 8–10 light, easy topics on slips of paper (e.g. "My favourite festival," "Why I like/dislike Mondays," "The best meal I've ever eaten," "If I could have one superpower...").
2. Call volunteers (or pick names) one at a time to draw a slip and speak for 60 seconds on it, with zero prep time.
3. Keep it light and generous with applause after each speaker, regardless of how it goes — the point is reps, not polish.
4. After 5–6 volunteers, ask the room: "What made it easier or harder when you had literally no time to prepare?"

*Materials: pre-written topic slips. Don't force anyone who's visibly distressed by public speaking to go — take volunteers first, then gently invite others.*`,

  "Group Discussion & Teamwork": `## Alternate Activity (~15 min)

**"Tower Build."**

1. Split students into teams of 4–5. Give each team a small stack of materials — sheets of paper, or anything reusable in the room (books, pens) — nothing needs to be bought specially.
2. **Say:** "You have 6 minutes to build the tallest free-standing structure you can, using only what's in front of you. No talking allowed for the first minute — plan silently, then you can talk."
3. Time it, then measure/compare the results.
4. Debrief: "What happened in that silent planning minute? Did having to communicate under pressure change how your team worked?"

*Materials: paper sheets or any reusable classroom objects — no need for special supplies.*`,

  "Presentation Skills & Professional Behaviour": `## Alternate Activity (~15 min)

**"Elevator Pitch Relay."**

1. **Say:** "You're about to introduce yourself in 30 seconds to someone important who can only spare that much time — imagine a scholarship interviewer or a company recruiter."
2. Give students 3 minutes to silently think through: name, one strength, one goal, why it matters — no writing required, just mental prep.
3. Pair students up. Partner A pitches for 30 seconds (time it), then Partner B gives one specific piece of feedback ("You sounded confident" / "Try starting with your goal instead of your name"). Then switch.
4. Ask 1–2 volunteers to pitch to the whole class.

*No materials needed beyond a way to keep time (phone/watch).*`,

  "Competitive English - Vocabulary Development": `## Alternate Activity (~12 min)

**"Word Chain Race."**

1. Split the class into teams. Write a starting word on the board (e.g. "Ambitious").
2. **Say:** "Each team has 3 minutes to build the longest chain of synonyms or related advanced words, each one a step 'harder'/more advanced than the last."
3. Teams write their chains on paper. At time's up, each team reads theirs aloud.
4. Award points for length and for words the rest of the class doesn't already know (crowd-verified) — this naturally teaches new vocabulary from peers, not just the instructor.

*Materials: paper per team. Keep a dictionary/phone handy in case of disputed words.*`,

  "Competitive English - Grammar & Comprehension": `## Alternate Activity (~12 min)

**"Spot the Error Race."**

1. Before class, write 5–6 sentences on the board, each with one grammar error planted (subject-verb agreement, tense, preposition, etc.).
2. Split the class into teams. On "go," teams race to identify and correct as many errors as they can in 4 minutes, writing corrections on paper.
3. Go through each sentence together, awarding a point per correct fix.
4. For the trickiest sentence, ask the team that got it right to explain the rule to the class in their own words.

*Materials: sentences pre-written on the board or smartboard.*`,

  "Quantitative Aptitude Fundamentals": `## Alternate Activity (~12 min)

**"Mental Math Relay."**

1. Split the class into 2–3 teams, lined up in rows.
2. One at a time, the first student in each row comes to the board, you give them a quick calculation (percentage, ratio, simple profit/loss), they solve it mentally/on the board, then tag the next teammate.
3. First team to correctly finish all their calculations wins. Keep problems short enough to solve in under 20 seconds each.
4. Debrief: "Which shortcut from earlier in the session did you actually use just now?"

*No materials needed beyond the board. Keep problems genuinely quick — this is about speed and confidence, not hard problems.*`,

  "Logical Reasoning & Analytical Thinking": `## Alternate Activity (~18 min)

**"Puzzle Stations."**

1. Set up 3–4 "stations" around the room (or just rows), each with a different type of reasoning puzzle written on paper: a pattern/series, a blood relation riddle, a coding-decoding problem, a seating arrangement.
2. Split the class into small groups. Each group spends 3–4 minutes at a station solving the puzzle, then rotates to the next on your signal.
3. After all groups have hit every station, reveal answers together and ask which station felt hardest and why.

*Materials: one puzzle written on paper/chart per station (reusable across sessions).*`,

  "Problem Solving & Data Interpretation": `## Alternate Activity (~15 min)

**"Data Story."**

1. Put up a simple chart or table on the smartboard (a bar chart of monthly sales, a pie chart of a household budget — anything with a few data points).
2. Split into small groups. **Say:** "You have 5 minutes to write a two-sentence 'story' explaining what's happening in this data — as if you're explaining it to someone who's never seen a chart before."
3. Groups share their story aloud. Compare how differently the same data got interpreted/framed by different groups.
4. **Say:** "This is exactly the skill behind data interpretation questions — the numbers don't explain themselves, you have to build the story."

*Materials: a chart/table displayed on the smartboard or drawn on the board.*`,

  "Entrepreneurship & Freelancing": `## Alternate Activity (~18 min)

**"Pitch Tank."**

1. Split the class into small teams. **Say:** "Each team has 6 minutes to invent a simple business idea — something that could realistically start small, even here in this town/city. What problem does it solve, who's the customer, how does it make money?"
2. Teams prepare a 1-minute pitch.
3. Each team pitches to the "investors" (the rest of the class + you). After each pitch, take a quick show-of-hands vote: would this room "invest" (support) this idea?
4. Debrief: "What made the most-voted pitch convincing? Was it the idea itself, or how it was pitched?"

*No materials needed beyond something to keep time. Keep the tone playful — this is a taste of the entrepreneurial mindset, not a real business plan.*`,

  "Career Planning & Personal Roadmap": `## Alternate Activity (~18 min)

**"Roadmap Poster."**

1. Give each student a sheet of paper. **Say:** "Draw a simple timeline from today to 5 years from now. Mark 3–4 milestones along it — real ones you actually intend to work toward, not fantasy ones."
2. Give 8 minutes to sketch individually — this can be a simple line with labels, doesn't need to be artistic.
3. In pairs, students briefly show (not necessarily explain every detail of) their roadmap to a partner and get one encouraging comment back.
4. **Say:** "Keep this. A roadmap is only useful if you actually look at it again — so take a photo of it on a phone if you can, or keep the paper somewhere you'll actually see it."

*Materials: paper for each student. This is the programme's capstone activity — give it the full time rather than rushing.*`,
};
