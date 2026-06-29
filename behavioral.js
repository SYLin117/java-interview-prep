// Garmin behavioral interview prep — question "chains" tailored to Ian Lin.
// Loaded as a classic <script src="behavioral.js"></script> before the inline
// renderer in index.html; `behavioral` becomes available in the shared realm.
//
// Each entry is ONE chain = a main behavioral question + the follow-up questions
// an interviewer is likely to ask off the back of it, each with a suggested
// STAR-structured answer. Grounded in the real resume + the two stories Ian gave:
//   • Story A — led the new-site setup in Oracle Agile PLM, incl. mentoring.
//   • Story B — first time leading the history-data migration into Agile PLM;
//     his initial design didn't match his manager's, cost some time, recovered
//     with extra effort to stay on schedule.
//
// Answers use HTML (rendered via innerHTML): <strong>, <ul><li>, <em>.
// [Personalize: ...] notes mark spots to drop in a real number or detail.

const behavioral = [
  {
    id: 1,
    category: 'Intro & Motivation',
    q: 'Tell me about yourself.',
    a: `<strong>Present.</strong> I'm a software engineer with about five years of experience building and supporting enterprise web applications, mostly in Java and Spring Boot with some C#/.NET. Right now I'm at Foxconn as an Oracle Agile PLM developer and administrator — I gather requirements from non-technical business users in manufacturing and operations, then build custom Java extensions, secure REST APIs, and scheduled batch jobs that automate their product-data workflows. I was actually the first member of our PLM team in North America: I helped stand the function up from scratch — starting with a plant transfer from IBM — and I've grown into effectively leading the NA PLM team.<br><br>
<strong>Past.</strong> Before that I spent a couple of years at SYSTEX in Taipei building production web systems with Java, Spring Boot, and Hibernate — including a government household-registration platform that integrated several central-government APIs, and an ERP system for Taiwan's largest gym chain. I also earned my Master's in Computer Science along the way.<br><br>
<strong>Strengths.</strong> What I'm known for is being the bridge between business users and engineering — turning vague business needs into reliable, well-documented software — and I care a lot about data integrity and getting integrations right.<br><br>
<strong>Why here.</strong> I want to move into a stronger, product-focused engineering team, and Garmin really appeals to me — you build hardware people love, and my product-data background feels like a natural fit.<br><br>
<em>Delivery tip: keep this to ~60–90 seconds and end on "why Garmin" so it invites the next question.</em>`,
    followups: [
      {
        q: 'Why are you looking to leave your current role?',
        a: `I've learned a lot at Foxconn, especially on the PLM and data-integrity side, but the day-to-day is fairly narrow — mostly Agile PLM customizations. I want to grow as a broader backend engineer on a product team that ships software to real users, with a modern Java/Spring stack and strong engineering practices. It's about reaching for the next step, not running from anything — I'd leave on good terms. <em>Tip: stay positive; never criticize your current employer.</em>`
      },
      {
        q: 'What are you looking for in your next role?',
        a: `Three things: meaningful product impact, a strong engineering culture I can learn from, and room to grow toward more ownership and eventually technical leadership. I enjoy owning a feature end to end — from talking with stakeholders through design, build, and support — and I want more of that on software that reaches customers.`
      },
      {
        q: 'What is your biggest accomplishment or proudest project?',
        a: `Leading the end-to-end setup of a new site on our Oracle Agile PLM system. I owned the whole delivery — all of the Agile PLM configuration (classes, roles, workflows, and lifecycles), multiple customization APIs and Process Extensions (PX), and the piece I'm proudest of: a full BOM import automation that replaced a slow, manual way of loading parts and bills of materials. I also led four newcomers on the team — I planned and split the work, mentored them, and jumped in to unblock or take over a piece whenever someone got stuck, so the whole team delivered on schedule. It stretched me technically and as a leader at the same time. <em>Tip: give this as a tight highlight, then offer to go deep — it sets up your strongest story.</em>`
      }
    ]
  },

  {
    id: 2,
    category: 'Ownership & Leadership',
    q: 'Tell me about a project you owned or led from start to finish.',
    a: `<strong>Situation.</strong> At Foxconn we needed to stand up a new site on our Oracle Agile PLM system so a new business unit could manage its parts, BOMs, and change processes on the same platform as the rest of the company.<br><br>
<strong>Task.</strong> I was given ownership of the whole setup, asked to mentor and coordinate four newcomers to the team, and to keep the project on schedule.<br><br>
<strong>Action.</strong><ul>
<li>I started by sitting down with the business users to understand their part/BOM structure and workflow rules, and documented the requirements so everyone was aligned.</li>
<li>I broke the work into clear pieces — the full Agile PLM configuration (classes, roles, workflows, and lifecycles), the customization APIs and Process Extensions (PX) that automate the part and BOM workflows, and the full BOM import automation that replaced manual data loading — and assigned chunks to the four newcomers based on their strengths.</li>
<li>I mentored as we went: pairing on the Agile SDK and extension code, reviewing their work, and running short check-ins so I caught blockers early.</li>
<li>Whenever a newcomer hit a wall, I kicked in right away — pairing, debugging alongside them, or temporarily taking the piece over — so nobody stayed stuck and the team held the timeline.</li>
<li>I kept the riskier custom pieces myself and tracked everything against a checklist tied to the deadline.</li>
</ul>
<strong>Result.</strong> We brought the new site live on Agile PLM on schedule, with the part and BOM workflows automated — including the full BOM import automation that replaced a manual loading process — and the team able to maintain it themselves afterward. [Personalize: add a number if you can — e.g., BOM import time cut from X hours to Y, or M part/BOM records loaded, or N users onboarded.]<br><br>
<em>Tip: hit both halves — the leadership (planning, mentoring) and the hands-on technical ownership.</em>`,
    followups: [
      {
        q: 'How did you keep the project on schedule and track progress?',
        a: `I broke it into milestones with clear owners and rough dates, and ran short, regular check-ins instead of waiting for one big status meeting. That let me see slippage early and rebalance — if someone was stuck, I'd pair with them or take the piece myself. A shared checklist kept everyone's progress visible.`
      },
      {
        q: 'How did you handle mentoring the four newcomers?',
        a: `I matched each task to the person, then gave them context and a starting point rather than just the answer. For Agile PLM extension work I'd pair the first time, review their code, and explain the "why" so the lesson carried forward. I let them own real pieces, not busywork — people grow faster when the work matters.`
      },
      {
        q: 'What was the hardest part technically, and how did you handle it?',
        a: `The custom Java extensions and getting the data load exactly right. Part and BOM data has to be precise and Agile's rules are strict, so I put extra care into validation and tested every load in a lower environment before touching production — correctness mattered more than speed there.`
      },
      {
        q: 'What would you do differently next time?',
        a: `I'd lock down the workflow requirements with the business users even earlier and in more detail — a couple of small reworks came from assumptions we made up front. I've learned that an hour of alignment early saves days later.`
      },
      {
        q: 'How did you come to lead the NA PLM team?',
        a: `I was the first member of our PLM team in North America, so I helped build the function from the ground up — it started with the Argos plant transfer from IBM to Foxconn, which for the first six months was just me and my supervisor visiting from Taiwan. As we onboarded more people, I naturally took on the planning, mentoring, and coordination, and grew into effectively leading the NA PLM team — taking on the responsibility well before the title.`
      }
    ]
  },

  {
    id: 3,
    category: 'Teamwork & Conflict',
    q: 'Tell me about a time you mentored or helped a teammate grow.',
    a: `<strong>Situation.</strong> During the new-site Agile PLM project, four newcomers joined the team — all new to Oracle Agile and to writing customization APIs and Process Extensions (PX) against its SDK.<br><br>
<strong>Task.</strong> I needed them productive on real parts of the project — not just watching — while we still hit our deadline.<br><br>
<strong>Action.</strong><ul>
<li>I gave each of them a real, ownable slice of the work matched to their level.</li>
<li>The first time on something new, we paired — I'd walk through how the Agile SDK and our extension framework worked, then hand them the keyboard.</li>
<li>I reviewed their code and aimed my feedback at the "why," so the lesson stuck for the next task.</li>
<li>I made it safe to ask questions and to fail in the test environment.</li>
</ul>
<strong>Result.</strong> By the end they were independently building and maintaining their parts of the system — which is the real goal: for them not to need me. It also freed me up for the riskier pieces.<br><br>
<em>Tip: the strongest mentoring answers end with the mentee becoming independent.</em>`,
    followups: [
      {
        q: 'How did you adapt your approach for different people?',
        a: `Some people want to be shown once and then left alone; others want to talk through the design first. I paid attention to that and adjusted — more pairing for one, more autonomy plus code review for another. The constant was giving context and the "why," not just instructions.`
      },
      {
        q: 'How did you balance mentoring with your own deliverables?',
        a: `I treated mentoring as an investment that pays back fast — a little upfront pairing meant they stopped being blocked on me later. I still kept the highest-risk pieces myself and time-boxed help so I protected enough focus time to hit my own tasks.`
      },
      {
        q: 'Did anyone push back on your guidance? How did you handle it?',
        a: `Occasionally someone preferred their own approach. If it was reasonable and safe, I let them try it — ownership matters and people learn from their own choices. If it risked the data or the timeline, I'd explain the specific risk and we'd decide together. Mostly it came down to listening first.`
      }
    ]
  },

  {
    id: 4,
    category: 'Teamwork & Conflict',
    q: 'Tell me about a time you disagreed with your manager or a senior engineer.',
    a: `<strong>Situation.</strong> I was put in charge of a history-data migration into Agile PLM for the first time. I came in with a design I thought was cleaner, but it didn't match how my manager wanted the migration approached.<br><br>
<strong>Task.</strong> I had to land on the right path — make my case or align with his — without derailing the project.<br><br>
<strong>Action.</strong><ul>
<li>I laid out my approach and the reasoning, and genuinely listened to his concerns instead of just defending mine.</li>
<li>It turned out his approach accounted for constraints I hadn't fully weighed — data integrity and how downstream processes expected the history to look.</li>
<li>Once I understood that, I aligned with his direction and adjusted my design rather than digging in.</li>
</ul>
<strong>Result.</strong> I'd already spent time down my original path, so I had to put in extra effort afterward to make up the ground — but we delivered the migration correctly and on time. The bigger win was the lesson: I now validate my design with stakeholders early, before I build, especially on something I'm doing for the first time.<br><br>
<em>Tip: this is the classic "disagree, then commit" — and being honest about the cost makes it credible.</em>`,
    followups: [
      {
        q: 'How did you raise your concern in the first place?',
        a: `Respectfully and with reasoning — I explained what I thought was better and why, and asked about the parts I might be missing. I framed it as "help me understand the trade-offs," not "my way is right."`
      },
      {
        q: 'What happened when your approach did not win out — were you overruled?',
        a: `Effectively yes, and it was the right call. Once I understood his constraints I agreed with him. To me the mark of a good engineer is being able to argue your case and then fully commit to the decision, even when it isn't yours.`
      },
      {
        q: 'How do you handle being told you are wrong?',
        a: `I try not to take it personally — the goal is the best outcome, not being right. Here, being wrong cost me some time, so I owned it, fixed it, and changed how I work so it wouldn't repeat. Honestly, being told you're wrong early is a gift; it's far cheaper than finding out late.`
      },
      {
        q: 'Looking back, whose approach was actually right?',
        a: `His was — it protected data integrity and matched what the downstream processes needed. Mine was cleaner in isolation but didn't account for those constraints. That's exactly why I now socialize designs early instead of building in a vacuum.`
      }
    ]
  },

  {
    id: 5,
    category: 'Failure & Growth',
    q: 'Tell me about a time you failed or made a mistake.',
    a: `<strong>Situation.</strong> The first time I led a history-data migration into Agile PLM, I jumped into building around my own design before fully aligning with my manager and the downstream constraints.<br><br>
<strong>Task.</strong> The migration had to be accurate and delivered on a fixed timeline.<br><br>
<strong>What went wrong / Action.</strong> My initial design didn't match what the project actually needed, so some of that early work had to be redone — I lost time. Once I realized it, I:<ul>
<li>Owned the miss with my manager rather than hiding it.</li>
<li>Re-aligned the design with his approach and the real constraints.</li>
<li>Put in extra focused effort to recover the lost time and protect the deadline.</li>
</ul>
<strong>Result.</strong> We delivered the migration correctly and on schedule with the data integrity intact. The lasting change is in how I work: I now validate a design with stakeholders before I build, especially on anything I'm doing for the first time, and I prototype the riskiest part first.<br><br>
<em>Tip: pick a real, contained failure, take ownership fast, and spend most of the answer on the lesson and the recovery — not the mistake.</em>`,
    followups: [
      {
        q: 'How did you recover the lost time and still hit the deadline?',
        a: `I re-planned around the corrected design, focused on the critical path first, and put in extra hours on the risky data pieces. I also leaned on my manager's input to avoid a second wrong turn — once we were aligned, the work went much faster.`
      },
      {
        q: 'What did you change about how you work afterward?',
        a: `Two things: I socialize a design — even a rough sketch — with stakeholders before I build, and I prototype the riskiest assumption first so I find out early if I'm wrong. It's basically "measure twice, cut once" applied to design.`
      },
      {
        q: 'How did you communicate the setback to your manager?',
        a: `Directly and early, with a plan attached — not just "I'm behind," but "here's what happened, here's the corrected approach, and here's how I'll make up the time." Bringing a path forward keeps it constructive instead of just bad news.`
      }
    ]
  },

  {
    id: 6,
    category: 'Ambiguity & Pressure',
    q: 'Tell me about a time you dealt with unclear or changing requirements.',
    a: `<strong>Situation.</strong> The clearest example is the Argos project — the plant transfer of part and BOM management from IBM to Foxconn in Guadalajara. I was the first member of our PLM team in North America, so for the first six months it was essentially just me and my supervisor, who flew in from Taiwan — the two of us migrated the whole thing, and the requirements stayed fuzzy and kept shifting the entire way.<br><br>
<strong>Task.</strong> I had to turn vague, moving requirements into something I could actually build, without the data integrity slipping during the transition.<br><br>
<strong>Action.</strong><ul>
<li>I asked a lot of questions and translated business language into concrete examples — "so when a part changes, you expect X to happen" — and confirmed it back in writing.</li>
<li>I documented the agreed process so there was a shared source of truth, which cut down on "that's not what I meant" later.</li>
<li>I built in small increments and showed the users early, so changes surfaced while they were still cheap to make.</li>
<li>I kept extra focus on data integrity — validating parts and BOMs throughout the transfer.</li>
</ul>
<strong>Result.</strong> We supported the transfer with the process documented and the data intact, and the early demos meant the inevitable changes were small adjustments instead of big rework.<br><br>
<em>Tip: ambiguity questions are really about communication — show how you manufacture clarity.</em>`,
    followups: [
      {
        q: 'How did you get to clarity when the user could not specify what they wanted?',
        a: `Concrete examples and playbacks. I'd restate their need as a specific scenario and confirm it, or show a quick mockup. People are far better at reacting to something concrete than describing it from a blank page.`
      },
      {
        q: 'How did you handle requirements changing mid-project?',
        a: `I expect some change, so I build incrementally and keep the design flexible where I know things are uncertain. When a change comes, I assess its impact on scope and timeline, communicate that, and re-prioritize — rather than quietly absorbing it and blowing the schedule.`
      },
      {
        q: 'How do you prioritize when everything is labeled "urgent"?',
        a: `I get the stakeholders to rank by impact and deadline — usually data integrity and anything blocking another team comes first. I make the trade-off visible: "if we do A now, B slips to next week — okay?" That turns "everything's urgent" into an actual decision.`
      }
    ]
  },

  {
    id: 7,
    category: 'Ambiguity & Pressure',
    q: 'Tell me about a time you worked under pressure or against a tight deadline.',
    a: `<strong>Situation.</strong> The Argos project — the plant transfer of part and BOM management from IBM to Foxconn in Guadalajara — ran on a firm cut-over date, with zero room to corrupt production part/BOM data. As the first PLM hire in North America, for the first six months it was just me and my supervisor from Taiwan running the migration: a hard deadline with a two-person team.<br><br>
<strong>Task.</strong> Support the transfer, keep data integrity intact, and hit the cut-over date.<br><br>
<strong>Action.</strong><ul>
<li>I focused on the critical path first — the part and BOM data and the workflows other teams depended on.</li>
<li>I validated every migration in a lower environment before touching production, so moving fast never cost us correctness.</li>
<li>I documented the process as we went so nothing lived only in my head — which let my supervisor and me divide and conquer, and made it easy to hand off as the team grew.</li>
<li>When the crunch hit I put in extra hours on the highest-risk pieces and kept my manager updated, so there were no surprises.</li>
</ul>
<strong>Result.</strong> We supported the transfer on time with the part and BOM data intact. [Personalize: add scale if you can — e.g., volume of parts/BOMs migrated or systems integrated.]<br><br>
<em>Tip: under pressure, interviewers want prioritization and protecting quality — not just "I worked late."</em>`,
    followups: [
      {
        q: 'How did you decide what to prioritize?',
        a: `Critical path and blast radius — anything other teams were blocked on, and anything touching data integrity, came first. Nice-to-haves I deferred. I made those trade-offs explicit with my manager so we agreed on what "done for cut-over" actually meant.`
      },
      {
        q: 'How did you keep quality up under time pressure?',
        a: `I refused to skip validation on the data — that's the one place a shortcut would've been catastrophic, so I tested loads in a lower environment first. I'd rather cut scope than cut correctness on production part/BOM data.`
      },
      {
        q: 'Did you ask for help, and how do you know when to escalate?',
        a: `Yes — I documented the process so teammates could take parallel pieces, and I escalated early to my manager the moment a risk to the date appeared, with options rather than just a problem. Escalating late is how deadlines actually get missed.`
      }
    ]
  },

  {
    id: 8,
    category: 'Intro & Motivation',
    q: 'Why do you want to work at Garmin?',
    a: `<strong>The products.</strong> I'm genuinely a fan — Garmin makes hardware people rely on across fitness, the outdoors, aviation, marine, and automotive. Working on software that ships inside products like that, instead of internal-only tools, is exactly the direction I want to go. [Personalize: name a Garmin product you actually use — e.g., a Forerunner or fēnix watch — and one line on why you like it.]<br><br>
<strong>The fit.</strong> My current work is deep in product data — parts, BOMs, change management, and a large business-transfer migration in Oracle Agile PLM. Garmin is a product company that lives and breathes that kind of engineering and product data, so my background lines up unusually well, and I'd bring solid Java/Spring backend skills plus a real respect for data integrity.<br><br>
<strong>The growth.</strong> I want to grow as a backend engineer on a strong team with good engineering practices, and eventually take on more technical leadership — and Garmin has the scale and product depth to be a long-term home. I'm also open to relocating to Olathe for the right team.<br><br>
<em>Tip: tie it to THEIR products plus YOUR background; specifics about a product you use make this land.</em>`,
    followups: [
      {
        q: 'Why this role specifically?',
        a: `It's a Java backend role on a product team, which is exactly the step I want — broader software engineering on customer-facing products, with a modern stack and room to own features end to end. It builds on what I do well (Java, APIs, integrations, data) while moving me beyond PLM-only work.`
      },
      {
        q: 'What do you know about our products?',
        a: `Garmin is best known for GPS and wearables — fitness watches and cycling computers, outdoor handhelds — plus whole business lines in aviation, marine, and automotive. [Personalize: mention a product you actually use, like a Forerunner/fēnix/Edge, and a sentence on why you like it — it shows genuine interest.]`
      },
      {
        q: 'Why should we hire you? What makes you a good fit?',
        a: `Three things: solid Java/Spring backend skills with real production experience; a track record of turning fuzzy business needs into reliable software and owning it end to end, including leading and mentoring; and a product-data background that fits a hardware company like Garmin. I'm low-drama, I document well, and I care about getting the data right.`
      },
      {
        q: 'How do you feel about relocating to Olathe?',
        a: `I'm open to it — I'm relocation-ready, and for the right team and product I see this as a long-term move, not a short stop. [Personalize: add anything genuine — cost of living, the outdoors, being closer to family, etc.]`
      }
    ]
  },

  {
    id: 9,
    category: 'Intro & Motivation',
    q: 'You are currently in a management role — why apply for a hands-on (individual-contributor) engineering role?',
    a: `<strong>The short version.</strong> I came into Foxconn as the first member of our PLM team in North America, helped build the function from scratch, and grew into effectively leading the NA PLM team — so I've carried real team-lead responsibility, not just a title. That experience clarified something valuable for me: the part of the work I care about most, and where I add the most value, is hands-on engineering. Leading the team showed me I genuinely enjoy mentoring and owning outcomes — but I'm at my best when I'm close to the code, designing and building. So moving into a strong individual-contributor role isn't a step back for me; it's me leaning into the technical track on purpose.<br><br>
<strong>What management gave me.</strong> I grew a lot from it, and I'm grateful for the experience. I learned to see the bigger picture, communicate with non-technical stakeholders, plan and unblock work, and bring people along — and I'll carry all of that into an engineering seat. A team gets a force-multiplier: someone who mentors naturally, owns things end to end, and can lead by influence without needing the title.<br><br>
<strong>Why now, and why Garmin.</strong> I'm about five years in, and this is the right moment to deepen my technical craft rather than drift away from it. I want to build real products on a strong engineering team, and Garmin is exactly that kind of place — great products, a genuine technical career ladder, and room to grow toward senior and eventually staff-level engineering. That long-term technical path is what excites me.<br><br>
<em>Delivery tip: lean on the strength here — you took on the lead role (first NA hire, built and ran the team) well before you took the title, which signals real ownership. Stay 100% positive and frame the move as choosing the technical track, never as "stepping down." Keep your real push factors private (heavy workload for a small raise, no authority over your team's pay, the constant-overtime culture, and holding off on the promotion because the pay did not match the responsibility) — those read as complaints / flight risk. Lead only with the pull toward hands-on building.</em>`,
    followups: [
      {
        q: 'Will you miss managing people, or want to move back into management later?',
        a: `I'll still get the parts of leadership I value most — mentoring, helping set technical direction, and owning outcomes — just as an engineer rather than a full-time people manager. I'm not closing the door on leadership forever, but right now I'm clear that I want to be hands-on building, and I'm choosing that deliberately. If anything, staying close to the technology keeps me sharp enough to lead well down the road.`
      },
      {
        q: 'How do we know you will not get bored as an IC or leave?',
        a: `Because being hands-on is exactly what energizes me — it's the reason I'm making this move, not something I'm settling for. And the technical track has real room to grow: senior, staff, principal. I can keep leveling up by deepening my impact and scope as an engineer, so I see this as a long-term home, not a temporary stop.`
      },
      {
        q: 'Will it be hard for you to take direction instead of giving it?',
        a: `Not at all. I've always been happiest collaborating and building, and even as a manager I led by listening and aligning rather than command-and-control. I'm comfortable disagreeing, committing, and getting fully behind a decision. Having sat on the other side, I think I'm easy to work with — I understand why priorities shift and what a lead needs from their engineers.`
      },
      {
        q: 'What did you learn as a manager that you will bring as an engineer?',
        a: `Three things. The bigger picture — I think in terms of impact and stakeholders, not just my own ticket. Communication — I can translate between business users and engineering, which I did constantly in my PLM work. And ownership — I naturally pick up loose ends and unblock people. Those make me a more reliable engineer and a multiplier for the team, not just someone heads-down on their own tasks.`
      }
    ]
  }
];
