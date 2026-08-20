// OCR English Language (J351) — lectures-data.js
// Built from sync-report.txt ORPHAN list (78 lectures, generated_lectures\OCR)
// Explicit {slug, title} objects used throughout — same reasoning as AQA/Edexcel builds.
//
// OCR's spec is structured differently from AQA/Edexcel: two Components (not two Papers),
// each testing BOTH reading and writing on TWO unseen texts (non-fiction in Component 1,
// fiction in Component 2), confirmed against OCR's own J351 spec — not guessed:
// - Component 1: Communicating Information and Ideas (non-fiction, J351/01)
// - Component 2: Exploring Effects and Impact (fiction, J351/02)
// Component 2's Q3/Q4 combine comparison AND evaluation in one question (per OCR examiner
// reports), which is why p9 is one pillar rather than split like Edexcel's evaluation/
// comparison split.
//
// ASSUMPTION TO CONFIRM: rqc-l19 and the tk-l21–28 set are identical in content to the
// versions already used for AQA/Edexcel — worth a quick diff if you want to be sure before
// treating them as truly shared/reused rather than OCR-specific rewrites.

var papersData = [

  {
    type: "single",
    title: "Foundations",
    pillars: [
      {
        tag: "Foundations",
        title: "Getting Started",
        lectures: [
          { slug: "ocr-lang-p0-l1-what-english-language-gcse-actually-tests", title: "What English Language GCSE Actually Tests" },
          { slug: "ocr-lang-p0-l2-why-there-is-no-book-to-revise", title: "Why There Is No Book to Revise" },
          { slug: "ocr-lang-p0-l3-what-the-two-components-look-like-non-fiction-and-fiction", title: "What the Two Components Look Like Non Fiction and Fiction" },
          { slug: "ocr-lang-p0-l4-what-the-examiner-is-actually-marking-ao1-to-ao6-in-plain-english", title: "What the Examiner Is Actually Marking AO1 to AO6 in Plain English" },
          { slug: "ocr-lang-p0-l5-what-a-grade-9-answer-looks-like-and-how-you-get-there", title: "What a Grade 9 Answer Looks Like and How You Get There" },
          { slug: "ocr-lang-p0-l6-how-to-use-this-platform", title: "How to Use This Platform" },
          { slug: "ocr-lang-p0-l7-the-spoken-language-endorsement-and-why-it-doesnt-affect-your-grade", title: "The Spoken Language Endorsement and Why It Doesnt Affect Your Grade" },
          { slug: "ocr-lang-p0-l8-how-to-read-anything-with-intention", title: "How to Read Anything with Intention" },
          { slug: "ocr-lang-p0-l9-why-every-paper-here-uses-two-texts-not-one", title: "Why Every Paper Here Uses Two Texts not One" }
        ]
      }
    ]
  },

  {
    type: "single",
    title: "Reading Skills Toolkit",
    pillars: [
      {
        tag: "Reading Skills",
        title: "Reading Question Craft",
        lectures: [
          { slug: "rqc-l19-reading-two-unseen-texts-under-time-pressure-every-single-time", title: "Reading Two Unseen Texts Under Time Pressure Every Single Time" }
        ]
      }
    ]
  },

  {
    type: "single",
    title: "Component 1: Communicating Information and Ideas (Non-Fiction)",
    pillars: [
      {
        tag: "Component 1 · Section A · Q1",
        title: "The 4-Mark Retrieval Question",
        lectures: [
          { slug: "ocr-lang-p1-l1-the-4-mark-question-and-its-two-part-format", title: "The 4 Mark Question and Its Two Part Format" },
          { slug: "ocr-lang-p1-l2-copying-not-explaining-what-part-a-actually-wants", title: "Copying not Explaining What Part a Actually Wants" },
          { slug: "ocr-lang-p1-l3-the-pitfall-writing-explanations-when-a-copy-is-enough", title: "The Pitfall Writing Explanations When a Copy Is Enough" }
        ]
      },
      {
        tag: "Component 1 · Section A · Q2",
        title: "Connections Between Two Texts",
        lectures: [
          { slug: "ocr-lang-p2-l1-what-connects-two-texts-written-100-years-apart", title: "What Connects Two Texts Written 100 Years Apart" },
          { slug: "ocr-lang-p2-l2-explaining-a-connection-in-your-own-words", title: "Explaining a Connection in Your Own Words" },
          { slug: "ocr-lang-p2-l3-why-this-question-matters-for-question-4-later", title: "Why This Question Matters for Question 4 Later" },
          { slug: "ocr-lang-p2-l4-the-pitfall-only-half-explaining-the-connection", title: "The Pitfall Only Half Explaining the Connection" }
        ]
      },
      {
        tag: "Component 1 · Section A · Q3",
        title: "Language Analysis (Non-Fiction)",
        lectures: [
          { slug: "ocr-lang-p3-l1-language-analysis-in-19th-century-non-fiction", title: "Language Analysis in 19th Century Non Fiction" },
          { slug: "ocr-lang-p3-l2-language-analysis-in-modern-non-fiction", title: "Language Analysis in Modern Non Fiction" },
          { slug: "ocr-lang-p3-l3-structural-choices-writers-make-in-factual-writing", title: "Structural Choices Writers Make in Factual Writing" },
          { slug: "ocr-lang-p3-l4-handling-unfamiliar-or-old-fashioned-vocabulary-with-confidence", title: "Handling Unfamiliar or Old Fashioned Vocabulary with Confidence" },
          { slug: "ocr-lang-p3-l5-the-pitfall-only-analysing-content-not-language", title: "The Pitfall Only Analysing Content not Language" }
        ]
      },
      {
        tag: "Component 1 · Section A · Q4",
        title: "Comparison",
        lectures: [
          { slug: "ocr-lang-p4-l1-what-changes-between-finding-connections-and-finding-differences", title: "What Changes Between Finding Connections and Finding Differences" },
          { slug: "ocr-lang-p4-l2-comparative-connectives-whereas-similarly-in-contrast", title: "Comparative Connectives Whereas Similarly in Contrast" },
          { slug: "ocr-lang-p4-l3-comparing-attitude-and-tone-not-just-topic", title: "Comparing Attitude and Tone not Just Topic" },
          { slug: "ocr-lang-p4-l4-interweaving-quotes-from-both-texts-in-one-paragraph", title: "Interweaving Quotes from Both Texts in One Paragraph" },
          { slug: "ocr-lang-p4-l5-the-pitfall-describing-each-text-separately-instead-of-comparing", title: "The Pitfall Describing Each Text Separately Instead of Comparing" }
        ]
      },
      {
        tag: "Component 1 · Section B",
        title: "Informative / Non-Fiction Writing",
        lectures: [
          { slug: "ocr-lang-p5-l1-reading-the-task-and-using-the-reading-sections-themes", title: "Reading the Task and Using the Reading Sections Themes" },
          { slug: "ocr-lang-p5-l2-structuring-an-informative-piece-clearly", title: "Structuring an Informative Piece Clearly" },
          { slug: "ocr-lang-p5-l3-facts-statistics-and-the-appeal-to-logic", title: "Facts Statistics and the Appeal to Logic" },
          { slug: "ocr-lang-p5-l4-matching-tone-to-a-specified-audience-and-purpose", title: "Matching Tone to a Specified Audience and Purpose" },
          { slug: "ocr-lang-p5-l5-planning-in-two-minutes", title: "Planning in Two Minutes" },
          { slug: "ocr-lang-p5-l6-the-pitfall-drifting-into-persuasion-when-the-task-asks-to-inform", title: "The Pitfall Drifting into Persuasion When the Task Asks to Inform" }
        ]
      },
      {
        tag: "Component 1 · Section B · Technical Accuracy",
        title: "SPaG & Sentence Control",
        lectures: [
          { slug: "ocr-lang-p6-l1-punctuation-for-effect-not-just-correctness", title: "Punctuation for Effect not Just Correctness" },
          { slug: "ocr-lang-p6-l2-sentence-variety-on-command", title: "Sentence Variety on Command" },
          { slug: "ocr-lang-p6-l3-the-most-common-gcse-spag-errors", title: "The Most Common GCSE SPaG Errors" },
          { slug: "ocr-lang-p6-l4-proofreading-in-the-last-five-minutes", title: "Proofreading in the Last Five Minutes" }
        ]
      }
    ]
  },

  {
    type: "single",
    title: "Non-Fiction Techniques Toolkit",
    pillars: [
      {
        tag: "Techniques Toolkit",
        title: "Persuasive & Rhetorical Techniques",
        lectures: [
          { slug: "tk-l21-direct-address-and-the-reader", title: "Direct Address and the Reader" },
          { slug: "tk-l22-anecdote-and-personal-experience-as-evidence", title: "Anecdote and Personal Experience as Evidence" },
          { slug: "tk-l23-facts-statistics-and-the-appeal-to-logic", title: "Facts Statistics and the Appeal to Logic" },
          { slug: "tk-l24-emotive-language-and-the-appeal-to-emotion", title: "Emotive Language and the Appeal to Emotion" },
          { slug: "tk-l25-ethos-and-appealing-to-authority-or-expertise", title: "Ethos and Appealing to Authority or Expertise" },
          { slug: "tk-l26-the-rule-of-three-and-listing-for-effect", title: "The Rule of Three and Listing for Effect" },
          { slug: "tk-l27-non-fiction-structure-anecdote-to-argument", title: "Non Fiction Structure Anecdote to Argument" },
          { slug: "tk-l28-escalating-evidence-and-the-call-to-action-close", title: "Escalating Evidence and the Call to Action Close" }
        ]
      }
    ]
  },

  {
    type: "single",
    title: "Component 2: Exploring Effects and Impact (Fiction)",
    pillars: [
      {
        tag: "Component 2 · Section A · Q1",
        title: "Retrieval From Text 1",
        lectures: [
          { slug: "ocr-lang-p7-l1-retrieval-from-the-opening-of-text-1", title: "Retrieval from the Opening of Text 1" },
          { slug: "ocr-lang-p7-l2-the-pitfall-searching-the-whole-text-when-the-question-points-you-to-one-section", title: "The Pitfall Searching the Whole Text When the Question Points You to One Section" }
        ]
      },
      {
        tag: "Component 2 · Section A · Q2",
        title: "Language Analysis (Across Both Texts)",
        lectures: [
          { slug: "ocr-lang-p8-l1-why-this-skill-gets-tested-twice-not-once", title: "Why This Skill Gets Tested Twice not Once" },
          { slug: "ocr-lang-p8-l2-analysing-a-short-extract-from-text-1", title: "Analysing a Short Extract from Text 1" },
          { slug: "ocr-lang-p8-l3-analysing-a-longer-extract-from-text-2", title: "Analysing a Longer Extract from Text 2" },
          { slug: "ocr-lang-p8-l4-adjusting-depth-when-the-second-extract-is-longer", title: "Adjusting Depth When the Second Extract Is Longer" },
          { slug: "ocr-lang-p8-l5-structural-techniques-in-literary-prose", title: "Structural Techniques in Literary Prose" },
          { slug: "ocr-lang-p8-l6-the-pitfall-running-out-of-energy-by-the-second-question", title: "The Pitfall Running Out of Energy By the Second Question" }
        ]
      },
      {
        tag: "Component 2 · Section A · Q3 & Q4",
        title: "Comparison & Evaluation",
        lectures: [
          { slug: "ocr-lang-p9-l1-what-this-question-actually-asks-for-three-things-at-once", title: "What This Question Actually Asks for Three Things at Once" },
          { slug: "ocr-lang-p9-l2-identifying-similarities-and-contrasts-together", title: "Identifying Similarities and Contrasts Together" },
          { slug: "ocr-lang-p9-l3-comparative-connectives-whereas-similarly-in-contrast", title: "Comparative Connectives Whereas Similarly in Contrast" },
          { slug: "ocr-lang-p9-l4-evaluating-impact-not-just-describing-technique", title: "Evaluating Impact not Just Describing Technique" },
          { slug: "ocr-lang-p9-l5-tracking-a-writers-methods-across-a-whole-extract", title: "Tracking a Writers Methods Across a Whole Extract" },
          { slug: "ocr-lang-p9-l6-structuring-an-answer-that-does-all-three-parts", title: "Structuring an Answer That Does All Three Parts" },
          { slug: "ocr-lang-p9-l7-the-grade-9-comparison-and-evaluation-paragraph", title: "The Grade 9 Comparison and Evaluation Paragraph" },
          { slug: "ocr-lang-p9-l8-the-pitfall-doing-only-comparison-or-only-evaluation-not-both", title: "The Pitfall Doing Only Comparison or Only Evaluation not Both" }
        ]
      },
      {
        tag: "Component 2 · Section B",
        title: "Creative & Personal Writing",
        lectures: [
          { slug: "ocr-lang-p10-l1-how-the-choice-works-and-how-to-decide-in-60-seconds", title: "How the Choice Works and How to Decide in 60 Seconds" },
          { slug: "ocr-lang-p10-l2-reading-the-task-and-using-the-reading-sections-themes", title: "Reading the Task and Using the Reading Sections Themes" },
          { slug: "ocr-lang-p10-l3-when-the-task-doesnt-give-you-a-form-choosing-your-own", title: "When the Task Doesnt Give You a Form Choosing Your Own" },
          { slug: "ocr-lang-p10-l4-story-or-personal-writing-deciding-which-one-suits-a-prompt", title: "Story or Personal Writing Deciding Which One Suits a Prompt" },
          { slug: "ocr-lang-p10-l5-the-five-senses-and-choosing-telling-details", title: "The Five Senses and Choosing Telling Details" },
          { slug: "ocr-lang-p10-l6-show-dont-tell-in-practice", title: "Show Dont Tell in Practice" },
          { slug: "ocr-lang-p10-l7-building-tension-and-voice-if-you-choose-narrative", title: "Building Tension and Voice If You Choose Narrative" },
          { slug: "ocr-lang-p10-l8-writing-reflectively-if-you-choose-personal-writing", title: "Writing Reflectively If You Choose Personal Writing" },
          { slug: "ocr-lang-p10-l9-planning-a-full-response-not-just-an-opening", title: "Planning a Full Response not Just an Opening" },
          { slug: "ocr-lang-p10-l10-the-pitfall-picking-the-open-task-and-then-freezing-with-no-form", title: "The Pitfall Picking the Open Task and Then Freezing with No Form" },
          { slug: "ocr-lang-p10-l11-the-pitfall-cliche-openings-and-predictable-twists", title: "The Pitfall Cliche Openings and Predictable Twists" }
        ]
      },
      {
        tag: "Component 2 · Section B · Technical Accuracy",
        title: "SPaG & Sentence Control",
        lectures: [
          { slug: "ocr-lang-p11-l1-punctuation-for-effect-not-just-correctness", title: "Punctuation for Effect not Just Correctness" },
          { slug: "ocr-lang-p11-l2-sentence-variety-in-creative-writing", title: "Sentence Variety in Creative Writing" },
          { slug: "ocr-lang-p11-l3-proofreading-in-the-last-five-minutes", title: "Proofreading in the Last Five Minutes" }
        ]
      }
    ]
  },

  {
    type: "single",
    title: "Spoken Language Endorsement (NEA)",
    pillars: [
      {
        tag: "Non-Exam Assessment",
        title: "Spoken Language Endorsement",
        lectures: [
          { slug: "ocr-lang-p12-l1-what-is-actually-being-assessed-presentation-and-questions", title: "What Is Actually Being Assessed Presentation and Questions" },
          { slug: "ocr-lang-p12-l2-pass-merit-distinction-what-separates-them", title: "Pass Merit Distinction What Separates Them" },
          { slug: "ocr-lang-p12-l3-planning-and-delivering-with-confidence", title: "Planning and Delivering with Confidence" }
        ]
      }
    ]
  }
];
