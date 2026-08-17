/* ══════════════════════════════════════════
   Montura Learn — OCR English Literature
   Single source of truth for the full course structure.
   Loaded by both lectures.html and every Pillar Decks page —
   nothing below should ever be hand-copied elsewhere again.

   Built from the actual lecture files present in this repo. Foundation
   phases (p0/cr/tk) and the first 10 ew- lectures reuse AQA's exact
   titles since the slugs are identical/shared content. The 8 newer
   ew-l11..l18 lectures don't have an AQA equivalent to copy from, so
   their titles are left to auto-derive via slugToTitle() at render time
   — still correct, just less hand-polished wording until reviewed.

   Paper/section structure verified against the real OCR specification
   (J352), not assumed from AQA's layout — confirm against your own
   source material if anything looks off, and check pillar-title wording
   (e.g. "Meet the Characters" vs "Character Profiles") since AQA itself
   isn't fully consistent on this, so this is a best-effort default.
══════════════════════════════════════════ */
function slugToTitle(slug) {
    return slug
        .replace(/^ocr-[a-z-]+-(?:intro-|p\d+-)?l\d+-/, '')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
}

const papersData = [

    {
        tag: "Foundation",
        title: "Start Here — Universal Skills",
        type: "single",
        pillars: [
            {
                tag: "Phase 0", title: "Orientation — What Is This Course?",
                lectures: [
                    { slug: "p0-l1-what-is-gcse-english-literature", title: "What is GCSE English Literature?" },
                    { slug: "p0-l2-what-does-the-exam-look-like", title: "What Does the Exam Look Like?" },
                    { slug: "p0-l3-what-is-the-examiner-actually-marking", title: "What is the Examiner Actually Marking?" },
                    { slug: "p0-l4-why-your-opinion-matters", title: "Why Your Opinion Matters" },
                    { slug: "p0-l5-what-is-a-grade-9-and-how-do-you-get-there", title: "What is a Grade 9 and How Do You Get There?" },
                    { slug: "p0-l6-how-to-use-this-platform", title: "How to Use This Platform" },
                    { slug: "p0-l7-what-texts-will-you-study-and-why", title: "What Texts Will You Study and Why?" },
                    { slug: "p0-l8-how-to-read-anything-with-intention", title: "How to Read Anything with Intention" }
                ]
            },
            {
                tag: "Phase 1", title: "Close Reading Skills",
                lectures: [
                    { slug: "cr-l1-what-a-word-is-actually-doing", title: "What a Word is Actually Doing" },
                    { slug: "cr-l2-denotation-vs-connotation", title: "Denotation vs Connotation" },
                    { slug: "cr-l3-why-writers-choose-words", title: "Why Writers Choose Words" },
                    { slug: "cr-l4-what-a-sentence-is-doing-vs-what-it-says", title: "What a Sentence is Doing vs What it Says" },
                    { slug: "cr-l5-how-to-zoom-in-from-paragraph-to-word", title: "How to Zoom In — From Paragraph to Word" },
                    { slug: "cr-l6-what-mood-is-and-how-it-is-created", title: "What Mood is and How it is Created" },
                    { slug: "cr-l7-what-tone-is-and-how-it-differs-from-mood", title: "What Tone is and How it Differs from Mood" },
                    { slug: "cr-l8-how-to-read-a-character", title: "How to Read a Character" },
                    { slug: "cr-l9-how-to-read-a-theme", title: "How to Read a Theme" },
                    { slug: "cr-l10-what-an-audience-is-and-why-it-matters", title: "What an Audience is and Why it Matters" },
                    { slug: "cr-l11-how-context-changes-meaning", title: "How Context Changes Meaning" },
                    { slug: "cr-l12-reading-a-short-extract-from-scratch", title: "Reading a Short Extract from Scratch" }
                ]
            },
            {
                tag: "Phase 2", title: "The Writer's Toolkit — Techniques",
                lectures: [
                    { slug: "tk-l1-metaphor", title: "Metaphor" },
                    { slug: "tk-l2-simile", title: "Simile" },
                    { slug: "tk-l3-personification", title: "Personification" },
                    { slug: "tk-l4-repetition", title: "Repetition" },
                    { slug: "tk-l5-contrast", title: "Contrast" },
                    { slug: "tk-l6-oxymoron", title: "Oxymoron" },
                    { slug: "tk-l7-semantic-field", title: "Semantic Field" },
                    { slug: "tk-l8-imagery", title: "Imagery" },
                    { slug: "tk-l9-foreshadowing", title: "Foreshadowing" },
                    { slug: "tk-l10-dramatic-irony", title: "Dramatic Irony" },
                    { slug: "tk-l11-soliloquy-and-aside", title: "Soliloquy and Aside" },
                    { slug: "tk-l12-symbolism", title: "Symbolism" },
                    { slug: "tk-l13-hyperbole", title: "Hyperbole" },
                    { slug: "tk-l14-rhetorical-questions", title: "Rhetorical Questions" },
                    { slug: "tk-l15-alliteration-and-sound", title: "Alliteration and Sound" },
                    { slug: "tk-l16-structure-how-shape-creates-meaning", title: "Structure — How Shape Creates Meaning" },
                    { slug: "tk-l17-form-why-it-matters-what-type-of-text-this-is", title: "Form — Why it Matters What Type of Text This Is" },
                    { slug: "tk-l18-narrative-voice", title: "Narrative Voice" },
                    { slug: "tk-l19-sentence-structure", title: "Sentence Structure" },
                    { slug: "tk-l20-putting-it-all-together", title: "Putting it All Together" }
                ]
            },
            {
                tag: "Phase 3", title: "Exam Writing Skills",
                lectures: [
                    { slug: "ew-l1-what-ao1-looks-like-written-down", title: "What AO1 Looks Like Written Down" },
                    { slug: "ew-l2-what-ao2-looks-like-written-down", title: "What AO2 Looks Like Written Down" },
                    { slug: "ew-l3-what-ao3-looks-like-written-down", title: "What AO3 Looks Like Written Down" },
                    { slug: "ew-l4-the-sir-verbs-suggests-implies-reveals", title: "The SIR Verbs — Suggests, Implies, Reveals" },
                    { slug: "ew-l5-peel-point-evidence-explain-link", title: "PEEL — Point, Evidence, Explain, Link" },
                    { slug: "ew-l6-pemew-point-evidence-method-explain-writers-purpose", title: "PEMEW — Point, Evidence, Method, Explain, Writer's Purpose" },
                    { slug: "ew-l7-how-to-read-an-exam-question", title: "How to Read an Exam Question" },
                    { slug: "ew-l8-how-to-plan-an-answer-in-two-minutes", title: "How to Plan an Answer in Two Minutes" },
                    { slug: "ew-l9-how-to-write-under-time-pressure", title: "How to Write Under Time Pressure" },
                    { slug: "ew-l10-what-a-grade-9-paragraph-looks-like-and-why", title: "What a Grade 9 Paragraph Looks Like and Why" },
                    "ew-l11-choosing-the-best-quotation-for-the-question-not-the-first-one-you-remember",
                    "ew-l12-embedding-quotations-naturally-into-your-analysis",
                    "ew-l13-paragraph-cohesion-linking-ideas-so-your-essay-flows",
                    "ew-l14-understanding-exactly-what-the-question-is-asking-theme-vs-character-questions",
                    "ew-l15-quote-quality-okay-good-and-rich-enough-for-half-a-paragraph",
                    "ew-l16-alternative-interpretations-can-a-quotation-support-more-than-one-reading",
                    "ew-l17-writers-intention-why-did-they-choose-this-not-just-what-technique-is-it",
                    "ew-l18-building-an-argument-how-every-paragraph-proves-your-overall-case"
                ]
            }
        ]
    },

    /* ══════════════════════════════════════
       COMPONENT 2 · SECTION A — POETRY ACROSS TIME
       Anthology: "Towards a World Unknown" (OUP/OCR), current
       edition — first teaching Sept 2022, first exam summer 2024.
       Each cluster: 15 poems. Exam format (J352/02, Section A):
       Part a) compare your studied poem to a PRINTED unseen poem;
       Part b) explore ONE OTHER poem from your anthology, from
       memory, on a related theme. No separate "Unseen Poetry"
       section exists for OCR — the unseen-comparison skill is
       folded into Pillars 5–6 of each cluster below.
    ══════════════════════════════════════ */
    {
        tag: "Component 2 · Section A",
        title: "Love and Relationships",
        type: "single",
        pillars: [
            {
                tag: "Pillar 1", title: "First Impressions (Grade 3–5)",
                lectures: [
                    { slug: "ocr-lr-p1-l1-a-song",                              title: "A Song" },
                    { slug: "ocr-lr-p1-l2-bright-star",                         title: "Bright Star" },
                    { slug: "ocr-lr-p1-l3-now",                                 title: "Now" },
                    { slug: "ocr-lr-p1-l4-love-and-friendship",                 title: "Love and Friendship" },
                    { slug: "ocr-lr-p1-l5-love-after-love",                     title: "Love After Love" },
                    { slug: "ocr-lr-p1-l6-morning-song",                        title: "Morning Song" },
                    { slug: "ocr-lr-p1-l7-i-wouldnt-thank-you-for-a-valentine", title: "I Wouldn't Thank You for a Valentine" },
                    { slug: "ocr-lr-p1-l8-in-paris-with-you",                   title: "In Paris With You" },
                    { slug: "ocr-lr-p1-l9-warming-her-pearls",                  title: "Warming Her Pearls" },
                    { slug: "ocr-lr-p1-l10-dusting-the-phone",                  title: "Dusting the Phone" },
                    { slug: "ocr-lr-p1-l11-flirtation",                         title: "Flirtation" },
                    { slug: "ocr-lr-p1-l12-poem-for-my-love",                   title: "Poem for My Love" },
                    { slug: "ocr-lr-p1-l13-lullaby",                            title: "Lullaby" },
                    { slug: "ocr-lr-p1-l14-the-perseverance",                   title: "The Perseverance" },
                    { slug: "ocr-lr-p1-l15-looking-at-your-hands",              title: "Looking at Your Hands" }
                ]
            },
            {
                tag: "Pillar 2", title: "Language & Imagery (Grade 6–7)",
                lectures: [
                    { slug: "ocr-lr-p2-l1-a-song-language",                              title: "A Song — Language" },
                    { slug: "ocr-lr-p2-l2-bright-star-language",                         title: "Bright Star — Language" },
                    { slug: "ocr-lr-p2-l3-now-language",                                 title: "Now — Language" },
                    { slug: "ocr-lr-p2-l4-love-and-friendship-language",                 title: "Love and Friendship — Language" },
                    { slug: "ocr-lr-p2-l5-love-after-love-language",                     title: "Love After Love — Language" },
                    { slug: "ocr-lr-p2-l6-morning-song-language",                        title: "Morning Song — Language" },
                    { slug: "ocr-lr-p2-l7-i-wouldnt-thank-you-for-a-valentine-language", title: "I Wouldn't Thank You for a Valentine — Language" },
                    { slug: "ocr-lr-p2-l8-in-paris-with-you-language",                   title: "In Paris With You — Language" },
                    { slug: "ocr-lr-p2-l9-warming-her-pearls-language",                  title: "Warming Her Pearls — Language" },
                    { slug: "ocr-lr-p2-l10-dusting-the-phone-language",                  title: "Dusting the Phone — Language" },
                    { slug: "ocr-lr-p2-l11-flirtation-language",                         title: "Flirtation — Language" },
                    { slug: "ocr-lr-p2-l12-poem-for-my-love-language",                   title: "Poem for My Love — Language" },
                    { slug: "ocr-lr-p2-l13-lullaby-language",                            title: "Lullaby — Language" },
                    { slug: "ocr-lr-p2-l14-the-perseverance-language",                   title: "The Perseverance — Language" },
                    { slug: "ocr-lr-p2-l15-looking-at-your-hands-language",              title: "Looking at Your Hands — Language" }
                ]
            },
            {
                tag: "Pillar 3", title: "Form & Structure (Grade 8–9)",
                lectures: [
                    { slug: "ocr-lr-p3-l1-beats-rhythm-and-metre",                   title: "Beats, Rhythm and Metre" },
                    { slug: "ocr-lr-p3-l2-why-line-breaks-and-stanza-breaks-matter", title: "Why Line Breaks and Stanza Breaks Matter" },
                    { slug: "ocr-lr-p3-l3-traditional-vs-free-verse",                title: "Traditional vs Free Verse" },
                    { slug: "ocr-lr-p3-l4-visual-layout-on-the-page",                title: "Visual Layout on the Page" },
                    { slug: "ocr-lr-p3-l5-the-volta-the-turning-point",              title: "The Volta — The Turning Point" },
                    { slug: "ocr-lr-p3-l6-circular-structure-and-repetition",        title: "Circular Structure and Repetition" },
                    { slug: "ocr-lr-p3-l7-how-a-poem-sounds-aloud",                  title: "How a Poem Sounds Aloud" }
                ]
            },
            {
                tag: "Pillar 4", title: "Context & Intent (AO3)",
                lectures: [
                    { slug: "ocr-lr-p4-l1-the-poets-life-and-purpose",                        title: "The Poet's Life and Purpose" },
                    { slug: "ocr-lr-p4-l2-romantic-love-desire-and-longing",                   title: "Romantic Love, Desire and Longing" },
                    { slug: "ocr-lr-p4-l3-family-love-parents-children-and-grandparents",      title: "Family Love — Parents, Children and Grandparents" },
                    { slug: "ocr-lr-p4-l4-loss-grief-and-absence-in-relationships",             title: "Loss, Grief and Absence in Relationships" },
                    { slug: "ocr-lr-p4-l5-power-class-and-servitude-in-love",                   title: "Power, Class and Servitude in Love" },
                    { slug: "ocr-lr-p4-l6-identity-and-vulnerability-within-relationships",     title: "Identity and Vulnerability Within Relationships" },
                    { slug: "ocr-lr-p4-l7-diverse-voices-modern-and-global-perspectives-on-love", title: "Diverse Voices — Modern and Global Perspectives on Love" },
                    { slug: "ocr-lr-p4-l8-the-big-picture-cluster-summary",                     title: "The Big Picture — Cluster Summary" }
                ]
            },
            {
                tag: "Pillar 5", title: "Comparing to an Unseen Poem (Part a Skills)",
                lectures: [
                    { slug: "ocr-lr-p5-l1-how-the-comparison-question-works",              title: "How the Comparison Question Works (Part a)" },
                    { slug: "ocr-lr-p5-l2-finding-thematic-links-with-an-unseen-poem",      title: "Finding Thematic Links With an Unseen Poem" },
                    { slug: "ocr-lr-p5-l3-comparing-language-choices-with-an-unseen-poem",  title: "Comparing Language Choices With an Unseen Poem" },
                    { slug: "ocr-lr-p5-l4-comparing-structure-and-form-with-an-unseen-poem", title: "Comparing Structure and Form With an Unseen Poem" }
                ]
            },
            {
                tag: "Pillar 6", title: "Exam Mastery",
                lectures: [
                    { slug: "ocr-lr-p6-l1-mastering-part-a-the-comparison-question",                          title: "Mastering Part a — The Comparison Question" },
                    { slug: "ocr-lr-p6-l2-mastering-part-b-writing-from-memory-about-a-second-poem",          title: "Mastering Part b — Writing From Memory About a Second Poem" },
                    { slug: "ocr-lr-p6-l3-grade-9-vs-grade-5-the-showdown",                                   title: "Grade 9 vs Grade 5 — The Showdown" }
                ]
            }
        ]
    },

    {
        tag: "Component 2 · Section A",
        title: "Conflict",
        type: "single",
        pillars: [
            {
                tag: "Pillar 1", title: "First Impressions (Grade 3–5)",
                lectures: [
                    { slug: "ocr-cf-p1-l1-envy",                              title: "Envy" },
                    { slug: "ocr-cf-p1-l2-boat-stealing",                     title: "Boat Stealing (from The Prelude)" },
                    { slug: "ocr-cf-p1-l3-the-destruction-of-sennacherib",    title: "The Destruction of Sennacherib" },
                    { slug: "ocr-cf-p1-l4-theres-a-certain-slant-of-light",   title: "There's a Certain Slant of Light" },
                    { slug: "ocr-cf-p1-l5-vergissmeinnicht",                  title: "Vergissmeinnicht" },
                    { slug: "ocr-cf-p1-l6-what-were-they-like",               title: "What Were They Like?" },
                    { slug: "ocr-cf-p1-l7-lament",                            title: "Lament" },
                    { slug: "ocr-cf-p1-l8-flag",                              title: "Flag" },
                    { slug: "ocr-cf-p1-l9-honour-killing",                    title: "Honour Killing" },
                    { slug: "ocr-cf-p1-l10-partition",                        title: "Partition" },
                    { slug: "ocr-cf-p1-l11-papa-t",                           title: "Papa-T" },
                    { slug: "ocr-cf-p1-l12-songs-for-the-people",             title: "Songs for the People" },
                    { slug: "ocr-cf-p1-l13-we-lived-happily-during-the-war",  title: "We Lived Happily During the War" },
                    { slug: "ocr-cf-p1-l14-colonization-in-reverse",          title: "Colonization in Reverse" },
                    { slug: "ocr-cf-p1-l15-thirteen",                         title: "Thirteen" }
                ]
            },
            {
                tag: "Pillar 2", title: "Language & Imagery (Grade 6–7)",
                lectures: [
                    { slug: "ocr-cf-p2-l1-envy-language",                              title: "Envy — Language" },
                    { slug: "ocr-cf-p2-l2-boat-stealing-language",                     title: "Boat Stealing (from The Prelude) — Language" },
                    { slug: "ocr-cf-p2-l3-the-destruction-of-sennacherib-language",    title: "The Destruction of Sennacherib — Language" },
                    { slug: "ocr-cf-p2-l4-theres-a-certain-slant-of-light-language",   title: "There's a Certain Slant of Light — Language" },
                    { slug: "ocr-cf-p2-l5-vergissmeinnicht-language",                  title: "Vergissmeinnicht — Language" },
                    { slug: "ocr-cf-p2-l6-what-were-they-like-language",               title: "What Were They Like? — Language" },
                    { slug: "ocr-cf-p2-l7-lament-language",                            title: "Lament — Language" },
                    { slug: "ocr-cf-p2-l8-flag-language",                              title: "Flag — Language" },
                    { slug: "ocr-cf-p2-l9-honour-killing-language",                    title: "Honour Killing — Language" },
                    { slug: "ocr-cf-p2-l10-partition-language",                        title: "Partition — Language" },
                    { slug: "ocr-cf-p2-l11-papa-t-language",                           title: "Papa-T — Language" },
                    { slug: "ocr-cf-p2-l12-songs-for-the-people-language",             title: "Songs for the People — Language" },
                    { slug: "ocr-cf-p2-l13-we-lived-happily-during-the-war-language",  title: "We Lived Happily During the War — Language" },
                    { slug: "ocr-cf-p2-l14-colonization-in-reverse-language",          title: "Colonization in Reverse — Language" },
                    { slug: "ocr-cf-p2-l15-thirteen-language",                         title: "Thirteen — Language" }
                ]
            },
            {
                tag: "Pillar 3", title: "Form & Structure (Grade 8–9)",
                lectures: [
                    { slug: "ocr-cf-p3-l1-beats-rhythm-and-metre",                   title: "Beats, Rhythm and Metre" },
                    { slug: "ocr-cf-p3-l2-why-line-breaks-and-stanza-breaks-matter", title: "Why Line Breaks and Stanza Breaks Matter" },
                    { slug: "ocr-cf-p3-l3-traditional-vs-free-verse",                title: "Traditional vs Free Verse" },
                    { slug: "ocr-cf-p3-l4-visual-layout-on-the-page",                title: "Visual Layout on the Page" },
                    { slug: "ocr-cf-p3-l5-the-volta-the-turning-point",              title: "The Volta — The Turning Point" },
                    { slug: "ocr-cf-p3-l6-circular-structure-and-repetition",        title: "Circular Structure and Repetition" },
                    { slug: "ocr-cf-p3-l7-how-a-poem-sounds-aloud",                  title: "How a Poem Sounds Aloud" }
                ]
            },
            {
                tag: "Pillar 4", title: "Context & Intent (AO3)",
                lectures: [
                    { slug: "ocr-cf-p4-l1-the-poets-life-and-purpose",                  title: "The Poet's Life and Purpose" },
                    { slug: "ocr-cf-p4-l2-war-and-its-human-cost",                      title: "War and its Human Cost" },
                    { slug: "ocr-cf-p4-l3-empire-colonialism-and-partition",            title: "Empire, Colonialism and Partition" },
                    { slug: "ocr-cf-p4-l4-prejudice-persecution-and-injustice",         title: "Prejudice, Persecution and Injustice" },
                    { slug: "ocr-cf-p4-l5-inner-conflict-and-personal-struggle",        title: "Inner Conflict and Personal Struggle" },
                    { slug: "ocr-cf-p4-l6-nature-guilt-and-the-aftermath-of-conflict",  title: "Nature, Guilt and the Aftermath of Conflict" },
                    { slug: "ocr-cf-p4-l7-diverse-voices-global-perspectives-on-conflict", title: "Diverse Voices — Global Perspectives on Conflict" },
                    { slug: "ocr-cf-p4-l8-the-big-picture-cluster-summary",             title: "The Big Picture — Cluster Summary" }
                ]
            },
            {
                tag: "Pillar 5", title: "Comparing to an Unseen Poem (Part a Skills)",
                lectures: [
                    { slug: "ocr-cf-p5-l1-how-the-comparison-question-works",              title: "How the Comparison Question Works (Part a)" },
                    { slug: "ocr-cf-p5-l2-finding-thematic-links-with-an-unseen-poem",      title: "Finding Thematic Links With an Unseen Poem" },
                    { slug: "ocr-cf-p5-l3-comparing-language-choices-with-an-unseen-poem",  title: "Comparing Language Choices With an Unseen Poem" },
                    { slug: "ocr-cf-p5-l4-comparing-structure-and-form-with-an-unseen-poem", title: "Comparing Structure and Form With an Unseen Poem" }
                ]
            },
            {
                tag: "Pillar 6", title: "Exam Mastery",
                lectures: [
                    { slug: "ocr-cf-p6-l1-mastering-part-a-the-comparison-question",                 title: "Mastering Part a — The Comparison Question" },
                    { slug: "ocr-cf-p6-l2-mastering-part-b-writing-from-memory-about-a-second-poem", title: "Mastering Part b — Writing From Memory About a Second Poem" },
                    { slug: "ocr-cf-p6-l3-grade-9-vs-grade-5-the-showdown",                          title: "Grade 9 vs Grade 5 — The Showdown" }
                ]
            }
        ]
    },

    {
        tag: "Component 2 · Section A",
        title: "Youth and Age",
        type: "single",
        pillars: [
            {
                tag: "Pillar 1", title: "First Impressions (Grade 3–5)",
                lectures: [
                    { slug: "ocr-ya-p1-l1-holy-thursday",                title: "Holy Thursday" },
                    { slug: "ocr-ya-p1-l2-the-bluebell",                 title: "The Bluebell" },
                    { slug: "ocr-ya-p1-l3-midnight-on-the-great-western", title: "Midnight on the Great Western" },
                    { slug: "ocr-ya-p1-l4-out-out",                      title: "Out, Out–" },
                    { slug: "ocr-ya-p1-l5-baby-song",                    title: "Baby Song" },
                    { slug: "ocr-ya-p1-l6-youre",                        title: "You're" },
                    { slug: "ocr-ya-p1-l7-cold-knap-lake",               title: "Cold Knap Lake" },
                    { slug: "ocr-ya-p1-l8-my-first-weeks",               title: "My First Weeks" },
                    { slug: "ocr-ya-p1-l9-venuss-flytraps",              title: "Venus's-flytraps" },
                    { slug: "ocr-ya-p1-l10-love",                        title: "Love" },
                    { slug: "ocr-ya-p1-l11-equilibrium",                 title: "Equilibrium" },
                    { slug: "ocr-ya-p1-l12-prayer",                      title: "Prayer" },
                    { slug: "ocr-ya-p1-l13-happy-birthday-moon",         title: "Happy Birthday Moon" },
                    { slug: "ocr-ya-p1-l14-tea-with-our-grandmothers",   title: "Tea With Our Grandmothers" },
                    { slug: "ocr-ya-p1-l15-theme-for-english-b",         title: "Theme for English B" }
                ]
            },
            {
                tag: "Pillar 2", title: "Language & Imagery (Grade 6–7)",
                lectures: [
                    { slug: "ocr-ya-p2-l1-holy-thursday-language",                title: "Holy Thursday — Language" },
                    { slug: "ocr-ya-p2-l2-the-bluebell-language",                 title: "The Bluebell — Language" },
                    { slug: "ocr-ya-p2-l3-midnight-on-the-great-western-language", title: "Midnight on the Great Western — Language" },
                    { slug: "ocr-ya-p2-l4-out-out-language",                      title: "Out, Out– — Language" },
                    { slug: "ocr-ya-p2-l5-baby-song-language",                    title: "Baby Song — Language" },
                    { slug: "ocr-ya-p2-l6-youre-language",                        title: "You're — Language" },
                    { slug: "ocr-ya-p2-l7-cold-knap-lake-language",               title: "Cold Knap Lake — Language" },
                    { slug: "ocr-ya-p2-l8-my-first-weeks-language",               title: "My First Weeks — Language" },
                    { slug: "ocr-ya-p2-l9-venuss-flytraps-language",              title: "Venus's-flytraps — Language" },
                    { slug: "ocr-ya-p2-l10-love-language",                        title: "Love — Language" },
                    { slug: "ocr-ya-p2-l11-equilibrium-language",                 title: "Equilibrium — Language" },
                    { slug: "ocr-ya-p2-l12-prayer-language",                      title: "Prayer — Language" },
                    { slug: "ocr-ya-p2-l13-happy-birthday-moon-language",         title: "Happy Birthday Moon — Language" },
                    { slug: "ocr-ya-p2-l14-tea-with-our-grandmothers-language",   title: "Tea With Our Grandmothers — Language" },
                    { slug: "ocr-ya-p2-l15-theme-for-english-b-language",         title: "Theme for English B — Language" }
                ]
            },
            {
                tag: "Pillar 3", title: "Form & Structure (Grade 8–9)",
                lectures: [
                    { slug: "ocr-ya-p3-l1-beats-rhythm-and-metre",                   title: "Beats, Rhythm and Metre" },
                    { slug: "ocr-ya-p3-l2-why-line-breaks-and-stanza-breaks-matter", title: "Why Line Breaks and Stanza Breaks Matter" },
                    { slug: "ocr-ya-p3-l3-traditional-vs-free-verse",                title: "Traditional vs Free Verse" },
                    { slug: "ocr-ya-p3-l4-visual-layout-on-the-page",                title: "Visual Layout on the Page" },
                    { slug: "ocr-ya-p3-l5-the-volta-the-turning-point",              title: "The Volta — The Turning Point" },
                    { slug: "ocr-ya-p3-l6-circular-structure-and-repetition",        title: "Circular Structure and Repetition" },
                    { slug: "ocr-ya-p3-l7-how-a-poem-sounds-aloud",                  title: "How a Poem Sounds Aloud" }
                ]
            },
            {
                tag: "Pillar 4", title: "Context & Intent (AO3)",
                lectures: [
                    { slug: "ocr-ya-p4-l1-the-poets-life-and-purpose",                                     title: "The Poet's Life and Purpose" },
                    { slug: "ocr-ya-p4-l2-childhood-birth-and-early-life",                                  title: "Childhood, Birth and Early Life" },
                    { slug: "ocr-ya-p4-l3-growing-up-and-loss-of-innocence",                                title: "Growing Up and Loss of Innocence" },
                    { slug: "ocr-ya-p4-l4-old-age-time-and-mortality",                                      title: "Old Age, Time and Mortality" },
                    { slug: "ocr-ya-p4-l5-family-memory-and-inheritance",                                   title: "Family, Memory and Inheritance" },
                    { slug: "ocr-ya-p4-l6-identity-across-generations",                                     title: "Identity Across Generations" },
                    { slug: "ocr-ya-p4-l7-diverse-voices-modern-and-global-perspectives-on-youth-and-age",  title: "Diverse Voices — Modern and Global Perspectives on Youth and Age" },
                    { slug: "ocr-ya-p4-l8-the-big-picture-cluster-summary",                                 title: "The Big Picture — Cluster Summary" }
                ]
            },
            {
                tag: "Pillar 5", title: "Comparing to an Unseen Poem (Part a Skills)",
                lectures: [
                    { slug: "ocr-ya-p5-l1-how-the-comparison-question-works",              title: "How the Comparison Question Works (Part a)" },
                    { slug: "ocr-ya-p5-l2-finding-thematic-links-with-an-unseen-poem",      title: "Finding Thematic Links With an Unseen Poem" },
                    { slug: "ocr-ya-p5-l3-comparing-language-choices-with-an-unseen-poem",  title: "Comparing Language Choices With an Unseen Poem" },
                    { slug: "ocr-ya-p5-l4-comparing-structure-and-form-with-an-unseen-poem", title: "Comparing Structure and Form With an Unseen Poem" }
                ]
            },
            {
                tag: "Pillar 6", title: "Exam Mastery",
                lectures: [
                    { slug: "ocr-ya-p6-l1-mastering-part-a-the-comparison-question",                 title: "Mastering Part a — The Comparison Question" },
                    { slug: "ocr-ya-p6-l2-mastering-part-b-writing-from-memory-about-a-second-poem", title: "Mastering Part b — Writing From Memory About a Second Poem" },
                    { slug: "ocr-ya-p6-l3-grade-9-vs-grade-5-the-showdown",                          title: "Grade 9 vs Grade 5 — The Showdown" }
                ]
            }
        ]
    },

    {
        tag: "Component 2 · Section B",
        title: "Shakespeare",
        type: "multi",
        texts: [
            {
                id: "macbeth",
                name: "Macbeth",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["ocr-macbeth-intro-l1-meet-the-world-of-macbeth","ocr-macbeth-intro-l2-the-full-story-of-macbeth"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["ocr-macbeth-p1-l1-the-opening-scotland-and-the-witches","ocr-macbeth-p1-l2-the-murder-of-duncan-and-the-spiral-begins","ocr-macbeth-p1-l3-the-collapse-banquo-macduff-and-the-ending"] },
                    { tag: "Pillar 2", title: "Meet the Characters", lectures: ["ocr-macbeth-p2-l1-macbeth-hero-to-tyrant","ocr-macbeth-p2-l2-lady-macbeth-ambition-and-guilt","ocr-macbeth-p2-l3-the-witches-and-their-power","ocr-macbeth-p2-l4-banquo-the-foil-to-macbeth","ocr-macbeth-p2-l5-macduff-malcolm-and-the-restoration-of-order"] },
                    { tag: "Pillar 3", title: "The Deep Stuff", lectures: ["ocr-macbeth-p3-l1-ambition-and-its-consequences","ocr-macbeth-p3-l2-power-and-corruption","ocr-macbeth-p3-l3-guilt-and-the-human-conscience","ocr-macbeth-p3-l4-appearance-vs-reality","ocr-macbeth-p3-l5-gender-and-masculinity","ocr-macbeth-p3-l6-the-supernatural-and-fate"] },
                    { tag: "Pillar 4", title: "The Writer's Tricks", lectures: ["ocr-macbeth-p4-l1-the-language-of-darkness-and-blood","ocr-macbeth-p4-l2-soliloquies-and-what-they-reveal","ocr-macbeth-p4-l3-the-witches-language-and-prophecy","ocr-macbeth-p4-l4-structure-and-stagecraft"] },
                    { tag: "Pillar 5", title: "The Real World (AO3)", lectures: ["ocr-macbeth-p5-l1-jacobean-england-and-king-james","ocr-macbeth-p5-l3-divine-right-of-kings-and-gender-roles"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["ocr-macbeth-p6-l1-choosing-and-answering-the-extract-based-question","ocr-macbeth-p6-l2-choosing-and-answering-the-discursive-essay-question","ocr-macbeth-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "merchant",
                name: "The Merchant of Venice",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["ocr-merchant-intro-l1-meet-the-world-of-the-merchant-of-venice","ocr-merchant-intro-l2-the-full-story-of-the-merchant-of-venice"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["ocr-merchant-p1-l1-the-bond-antonio-shylock-and-the-deal","ocr-merchant-p1-l2-portia-bassanio-and-the-casket-plot","ocr-merchant-p1-l3-the-trial-and-the-resolution"] },
                    { tag: "Pillar 2", title: "Meet the Characters", lectures: ["ocr-merchant-p2-l1-shylock-villain-or-victim","ocr-merchant-p2-l2-portia-intelligence-and-female-power","ocr-merchant-p2-l3-antonio-and-bassanio-friendship-and-loyalty","ocr-merchant-p2-l4-jessica-and-launcelot-belonging-and-identity","ocr-merchant-p2-l5-the-duke-and-the-minor-characters"] },
                    { tag: "Pillar 3", title: "The Deep Stuff", lectures: ["ocr-merchant-p3-l1-prejudice-and-antisemitism","ocr-merchant-p3-l2-justice-and-mercy","ocr-merchant-p3-l3-wealth-and-greed","ocr-merchant-p3-l4-appearance-vs-reality","ocr-merchant-p3-l5-gender-and-disguise"] },
                    { tag: "Pillar 4", title: "The Writer's Tricks", lectures: ["ocr-merchant-p4-l1-the-language-of-money-and-trade","ocr-merchant-p4-l2-shylocks-powerful-speeches","ocr-merchant-p4-l3-comedy-and-its-dark-edges","ocr-merchant-p4-l4-structure-courtroom-as-climax"] },
                    { tag: "Pillar 5", title: "The Real World (AO3)", lectures: ["ocr-merchant-p5-l1-elizabethan-attitudes-to-jews-and-outsiders","ocr-merchant-p5-l2-venetian-society-trade-and-law","ocr-merchant-p5-l3-what-shakespeare-intended-and-modern-readings"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["ocr-merchant-p6-l1-choosing-and-answering-the-extract-based-question","ocr-merchant-p6-l2-choosing-and-answering-the-discursive-essay-question","ocr-merchant-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "much-ado",
                name: "Much Ado About Nothing",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["ocr-much-ado-intro-l1-meet-the-world-of-much-ado-about-nothing","ocr-much-ado-intro-l2-the-full-story-of-much-ado-about-nothing"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["ocr-much-ado-p1-l1-the-soldiers-return-and-the-two-plots","ocr-much-ado-p1-l2-the-deception-hero-shamed-and-beatrice-acts","ocr-much-ado-p1-l3-the-truth-revealed-and-the-double-wedding"] },
                    { tag: "Pillar 2", title: "Meet the Characters", lectures: ["ocr-much-ado-p2-l1-beatrice-wit-and-independence","ocr-much-ado-p2-l2-benedick-pride-and-transformation","ocr-much-ado-p2-l3-hero-and-claudio-idealistic-love","ocr-much-ado-p2-l4-don-john-the-villain-and-his-motive","ocr-much-ado-p2-l5-dogberry-and-the-comic-watchmen"] },
                    { tag: "Pillar 3", title: "The Deep Stuff", lectures: ["ocr-much-ado-p3-l1-love-and-courtship","ocr-much-ado-p3-l2-honour-and-reputation","ocr-much-ado-p3-l3-deception-and-appearance-vs-reality","ocr-much-ado-p3-l4-gender-and-the-expectations-of-women","ocr-much-ado-p3-l5-wit-and-language-as-power"] },
                    { tag: "Pillar 4", title: "The Writer's Tricks", lectures: ["ocr-much-ado-p4-l1-prose-vs-verse-and-what-it-tells-us","ocr-much-ado-p4-l2-wit-wordplay-and-the-battle-of-the-sexes","ocr-much-ado-p4-l3-dramatic-irony-and-the-eavesdropping-scenes","ocr-much-ado-p4-l4-structure-comedy-conventions-subverted"] },
                    { tag: "Pillar 5", title: "The Real World (AO3)", lectures: ["ocr-much-ado-p5-l1-elizabethan-marriage-honour-and-women","ocr-much-ado-p5-l2-social-hierarchy-and-military-culture","ocr-much-ado-p5-l3-shakespeares-purpose-and-the-comedic-form"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["ocr-much-ado-p6-l1-choosing-and-answering-the-extract-based-question","ocr-much-ado-p6-l2-choosing-and-answering-the-discursive-essay-question","ocr-much-ado-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "romeo",
                name: "Romeo & Juliet",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["ocr-romeo-intro-l1-meet-the-world-of-romeo-and-juliet","ocr-romeo-intro-l2-the-full-story-of-romeo-and-juliet"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["ocr-romeo-p1-l1-the-feud-and-the-first-meeting","ocr-romeo-p1-l2-the-marriage-tybalt-and-the-turning-point","ocr-romeo-p1-l3-the-plan-the-tomb-and-the-tragic-ending"] },
                    { tag: "Pillar 2", title: "Meet the Characters", lectures: ["ocr-romeo-p2-l1-romeo-impulsive-lover-and-tragic-hero","ocr-romeo-p2-l2-juliet-strength-and-sacrifice","ocr-romeo-p2-l3-tybalt-mercutio-and-the-violence-of-verona","ocr-romeo-p2-l4-the-friar-and-the-nurse-adult-failures","ocr-romeo-p2-l5-lord-and-lady-capulet-parental-power"] },
                    { tag: "Pillar 3", title: "The Deep Stuff", lectures: ["ocr-romeo-p3-l1-love-and-its-many-forms","ocr-romeo-p3-l2-fate-and-free-will","ocr-romeo-p3-l3-conflict-and-violence","ocr-romeo-p3-l4-family-honour-and-obedience","ocr-romeo-p3-l5-youth-vs-age-and-power"] },
                    { tag: "Pillar 4", title: "The Writer's Tricks", lectures: ["ocr-romeo-p4-l1-light-and-dark-imagery","ocr-romeo-p4-l2-the-use-of-time-and-speed","ocr-romeo-p4-l3-dramatic-irony-and-the-prologue","ocr-romeo-p4-l4-verse-prose-and-the-sonnet-form"] },
                    { tag: "Pillar 5", title: "The Real World (AO3)", lectures: ["ocr-romeo-p5-l1-elizabethan-society-patriarchy-and-marriage","ocr-romeo-p5-l2-religion-fate-and-the-stars","ocr-romeo-p5-l3-what-shakespeare-was-saying-about-society"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["ocr-romeo-p6-l1-choosing-and-answering-the-extract-based-question","ocr-romeo-p6-l2-choosing-and-answering-the-discursive-essay-question","ocr-romeo-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            }
        ]
    },

    {
        tag: "Component 1 · Section A",
        title: "Modern Prose or Drama",
        type: "multi",
        texts: [
            {
                id: "anita-and-me",
                name: "Anita and Me",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["ocr-anita-and-me-intro-l1-meet-the-world-of-anita-and-me","ocr-anita-and-me-intro-l2-the-full-story-of-anita-and-me"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["ocr-anita-and-me-p1-l1-meena-and-tollington","ocr-anita-and-me-p1-l2-anitas-influence-and-the-summers-events","ocr-anita-and-me-p1-l3-growing-up-and-moving-on"] },
                    { tag: "Pillar 2", title: "Character Profiles", lectures: ["ocr-anita-and-me-p2-l1-meena-identity-and-belonging","ocr-anita-and-me-p2-l2-anita-danger-and-fascination","ocr-anita-and-me-p2-l3-meenas-parents-and-the-sikh-community","ocr-anita-and-me-p2-l4-nanima-heritage-and-wisdom","ocr-anita-and-me-p2-l5-sam-and-the-white-working-class"] },
                    { tag: "Pillar 3", title: "Big Ideas", lectures: ["ocr-anita-and-me-p3-l1-identity-and-belonging","ocr-anita-and-me-p3-l2-race-and-racism-in-1970s-britain","ocr-anita-and-me-p3-l3-growing-up-and-loss-of-innocence","ocr-anita-and-me-p3-l4-community-and-outsiders","ocr-anita-and-me-p3-l5-the-immigrant-experience-and-assimilation"] },
                    { tag: "Pillar 4", title: "The Novelist's Voice", lectures: ["ocr-anita-and-me-p4-l1-humour-and-the-first-person-voice","ocr-anita-and-me-p4-l2-the-mixing-of-cultures-in-language","ocr-anita-and-me-p4-l3-nostalgia-and-the-adult-narrator","ocr-anita-and-me-p4-l4-setting-as-symbol"] },
                    { tag: "Pillar 5", title: "The Real World (AO3)", lectures: ["ocr-anita-and-me-p5-l1-1970s-britain-race-relations-and-the-nf","ocr-anita-and-me-p5-l2-south-asian-diaspora-and-second-generation-identity","ocr-anita-and-me-p5-l3-syals-purpose-and-autobiographical-elements"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["ocr-anita-and-me-p6-l1-mastering-the-memory-based-essay","ocr-anita-and-me-p6-l2-planning-for-any-character-or-theme","ocr-anita-and-me-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "never-let-me-go",
                name: "Never Let Me Go",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["ocr-never-let-me-go-intro-l1-meet-the-world-of-never-let-me-go","ocr-never-let-me-go-intro-l2-the-full-story-of-never-let-me-go"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["ocr-never-let-me-go-p1-l1-hailsham-and-the-strange-normal-childhood","ocr-never-let-me-go-p1-l2-the-cottages-growing-up-and-the-truth-emerging","ocr-never-let-me-go-p1-l3-donations-completion-and-the-ending"] },
                    { tag: "Pillar 2", title: "Character Profiles", lectures: ["ocr-never-let-me-go-p2-l1-kathy-quiet-acceptance-and-memory","ocr-never-let-me-go-p2-l2-ruth-performance-and-self-deception","ocr-never-let-me-go-p2-l3-tommy-anger-and-the-search-for-meaning","ocr-never-let-me-go-p2-l4-miss-lucy-and-miss-emily-truth-tellers-and-gatekeepers"] },
                    { tag: "Pillar 3", title: "Big Ideas", lectures: ["ocr-never-let-me-go-p3-l1-what-makes-us-human","ocr-never-let-me-go-p3-l2-memory-and-holding-onto-the-past","ocr-never-let-me-go-p3-l3-acceptance-vs-resistance-to-fate","ocr-never-let-me-go-p3-l4-love-and-whether-it-can-change-anything","ocr-never-let-me-go-p3-l5-institutions-and-controlled-childhoods"] },
                    { tag: "Pillar 4", title: "The Novelist's Voice", lectures: ["ocr-never-let-me-go-p4-l1-kathys-restrained-first-person-narration","ocr-never-let-me-go-p4-l2-euphemism-and-what-language-hides","ocr-never-let-me-go-p4-l3-dramatic-irony-the-reader-knows-before-they-do","ocr-never-let-me-go-p4-l4-structure-memory-fragments-and-non-linear-time"] },
                    { tag: "Pillar 5", title: "The Real World (AO3)", lectures: ["ocr-never-let-me-go-p5-l1-genetic-science-and-cloning-anxiety","ocr-never-let-me-go-p5-l2-english-boarding-school-tradition-and-its-inversion","ocr-never-let-me-go-p5-l3-ishiguros-purpose-and-speculative-fiction"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["ocr-never-let-me-go-p6-l1-comparing-a-studied-extract-to-an-unseen-modern-extract","ocr-never-let-me-go-p6-l2-answering-the-related-question-on-the-whole-text","ocr-never-let-me-go-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "animal-farm",
                name: "Animal Farm",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["ocr-animal-farm-intro-l1-meet-the-world-of-animal-farm","ocr-animal-farm-intro-l2-the-full-story-of-animal-farm"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["ocr-animal-farm-p1-l1-the-rebellion-and-the-seven-commandments","ocr-animal-farm-p1-l2-the-pigs-rise-to-power-and-squealer","ocr-animal-farm-p1-l3-the-corruption-completes-and-the-ending"] },
                    { tag: "Pillar 2", title: "Character Profiles", lectures: ["ocr-animal-farm-p2-l1-napoleon-tyranny-and-power","ocr-animal-farm-p2-l2-snowball-idealism-and-exile","ocr-animal-farm-p2-l3-boxer-loyalty-and-exploitation","ocr-animal-farm-p2-l4-squealer-propaganda-and-language","ocr-animal-farm-p2-l5-old-major-benjamin-and-the-other-animals"] },
                    { tag: "Pillar 3", title: "Big Ideas", lectures: ["ocr-animal-farm-p3-l1-power-and-corruption","ocr-animal-farm-p3-l2-propaganda-and-the-manipulation-of-truth","ocr-animal-farm-p3-l3-equality-and-its-betrayal","ocr-animal-farm-p3-l4-revolution-and-what-it-becomes","ocr-animal-farm-p3-l5-the-working-class-and-exploitation"] },
                    { tag: "Pillar 4", title: "The Novelist's Voice", lectures: ["ocr-animal-farm-p4-l1-allegory-and-how-it-works","ocr-animal-farm-p4-l2-the-commandments-and-their-distortion","ocr-animal-farm-p4-l3-simple-language-and-powerful-effect","ocr-animal-farm-p4-l4-structure-the-circular-ending"] },
                    { tag: "Pillar 5", title: "The Real World (AO3)", lectures: ["ocr-animal-farm-p5-l1-the-russian-revolution-and-stalinism","ocr-animal-farm-p5-l2-totalitarianism-and-orwells-warning","ocr-animal-farm-p5-l3-orwells-life-purpose-and-the-fable-form"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["ocr-animal-farm-p6-l1-mastering-the-memory-based-essay","ocr-animal-farm-p6-l2-planning-for-any-character-or-theme","ocr-animal-farm-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "inspector-calls",
                name: "An Inspector Calls",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["ocr-inspector-calls-intro-l1-meet-the-world-of-an-inspector-calls","ocr-inspector-calls-intro-l2-the-full-story-of-an-inspector-calls"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["ocr-inspector-calls-p1-l1-the-birlings-the-engagement-and-the-inspector","ocr-inspector-calls-p1-l2-the-interrogations-and-each-persons-guilt","ocr-inspector-calls-p1-l3-the-twist-the-reactions-and-the-final-call"] },
                    { tag: "Pillar 2", title: "Meet the Characters", lectures: ["ocr-inspector-calls-p2-l1-inspector-goole-voice-of-social-conscience","ocr-inspector-calls-p2-l2-mr-birling-capitalism-and-arrogance","ocr-inspector-calls-p2-l3-mrs-birling-snobbery-and-denial","ocr-inspector-calls-p2-l4-sheila-and-eric-the-younger-generation","ocr-inspector-calls-p2-l5-eva-smith-the-invisible-victim"] },
                    { tag: "Pillar 3", title: "The Deep Stuff", lectures: ["ocr-inspector-calls-p3-l1-social-responsibility-and-community","ocr-inspector-calls-p3-l2-class-and-inequality","ocr-inspector-calls-p3-l3-generational-conflict-and-change","ocr-inspector-calls-p3-l4-guilt-and-collective-responsibility","ocr-inspector-calls-p3-l5-gender-and-the-treatment-of-women"] },
                    { tag: "Pillar 4", title: "The Writer's Tricks", lectures: ["ocr-inspector-calls-p4-l1-the-inspectors-powerful-language","ocr-inspector-calls-p4-l2-dramatic-irony-and-time","ocr-inspector-calls-p4-l3-symbolism-lighting-and-staging","ocr-inspector-calls-p4-l4-structure-unity-of-time-and-place"] },
                    { tag: "Pillar 5", title: "The Real World (AO3)", lectures: ["ocr-inspector-calls-p5-l1-1912-vs-1945-two-time-periods","ocr-inspector-calls-p5-l2-socialism-capitalism-and-the-welfare-state","ocr-inspector-calls-p5-l3-priestleys-purpose-and-political-message"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["ocr-inspector-calls-p6-l1-comparing-a-studied-extract-to-an-unseen-modern-extract","ocr-inspector-calls-p6-l2-answering-the-related-question-on-the-whole-text","ocr-inspector-calls-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "leave-taking",
                name: "Leave Taking",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["ocr-leave-taking-intro-l1-meet-the-world-of-leave-taking","ocr-leave-taking-intro-l2-the-full-story-of-leave-taking"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["ocr-leave-taking-p1-l1-enid-del-viv-and-the-obeah-woman","ocr-leave-taking-p1-l2-identity-conflict-and-the-two-generations","ocr-leave-taking-p1-l3-the-resolution-and-letting-go"] },
                    { tag: "Pillar 2", title: "Meet the Characters", lectures: ["ocr-leave-taking-p2-l1-enid-sacrifice-and-the-immigrant-experience","ocr-leave-taking-p2-l2-del-caught-between-two-cultures","ocr-leave-taking-p2-l3-viv-ambition-and-assimilation","ocr-leave-taking-p2-l4-mai-the-obeah-woman-and-tradition","ocr-leave-taking-p2-l5-broderick-and-the-male-absence"] },
                    { tag: "Pillar 3", title: "The Deep Stuff", lectures: ["ocr-leave-taking-p3-l1-identity-and-belonging","ocr-leave-taking-p3-l2-the-immigrant-experience-and-sacrifice","ocr-leave-taking-p3-l3-generational-conflict-and-cultural-tension","ocr-leave-taking-p3-l4-tradition-vs-assimilation","ocr-leave-taking-p3-l5-motherhood-and-letting-go"] },
                    { tag: "Pillar 4", title: "The Writer's Tricks", lectures: ["ocr-leave-taking-p4-l1-caribbean-dialect-and-standard-english","ocr-leave-taking-p4-l2-the-obeah-ritual-and-symbolism","ocr-leave-taking-p4-l3-staging-and-the-domestic-setting","ocr-leave-taking-p4-l4-structure-time-and-memory"] },
                    { tag: "Pillar 5", title: "The Real World (AO3)", lectures: ["ocr-leave-taking-p5-l1-windrush-generation-and-caribbean-migration","ocr-leave-taking-p5-l2-black-british-identity-in-the-1980s","ocr-leave-taking-p5-l3-pinnocks-purpose-and-representation"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["ocr-leave-taking-p6-l1-comparing-a-studied-extract-to-an-unseen-modern-extract","ocr-leave-taking-p6-l2-answering-the-related-question-on-the-whole-text","ocr-leave-taking-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "dna",
                name: "DNA",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["ocr-dna-intro-l1-meet-the-world-of-dna","ocr-dna-intro-l2-the-full-story-of-dna"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["ocr-dna-p1-l1-the-death-the-cover-up-and-the-group","ocr-dna-p1-l2-the-plan-unravels-and-cathy-takes-control","ocr-dna-p1-l3-the-consequences-and-the-aftermath"] },
                    { tag: "Pillar 2", title: "Meet the Characters", lectures: ["ocr-dna-p2-l1-phil-passive-control-and-silent-power","ocr-dna-p2-l2-leah-anxiety-morality-and-being-ignored","ocr-dna-p2-l3-cathy-violence-and-moral-collapse","ocr-dna-p2-l4-adam-the-victim-and-what-he-represents","ocr-dna-p2-l5-the-group-mob-mentality-and-individual-guilt"] },
                    { tag: "Pillar 3", title: "The Deep Stuff", lectures: ["ocr-dna-p3-l1-morality-and-the-consequences-of-inaction","ocr-dna-p3-l2-mob-mentality-and-group-pressure","ocr-dna-p3-l3-leadership-and-power","ocr-dna-p3-l4-guilt-and-responsibility","ocr-dna-p3-l5-loss-of-innocence"] },
                    { tag: "Pillar 4", title: "The Writer's Tricks", lectures: ["ocr-dna-p4-l1-minimal-dialogue-and-silence-as-power","ocr-dna-p4-l2-leahs-monologues-anxiety-in-action","ocr-dna-p4-l3-four-act-structure-and-deterioration","ocr-dna-p4-l4-sparse-staging-and-dramatic-tension"] },
                    { tag: "Pillar 5", title: "The Real World (AO3)", lectures: ["ocr-dna-p5-l1-youth-culture-bullying-and-moral-panic","ocr-dna-p5-l2-social-breakdown-and-responsibility-in-modern-britain","ocr-dna-p5-l3-kellys-purpose-and-the-play-in-performance"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["ocr-dna-p6-l1-comparing-a-studied-extract-to-an-unseen-modern-extract","ocr-dna-p6-l2-answering-the-related-question-on-the-whole-text","ocr-dna-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            }
        ]
    },

    {
        tag: "Component 1 · Section B",
        title: "19th Century Prose",
        type: "multi",
        texts: [
            {
                id: "great-expectations",
                name: "Great Expectations",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["ocr-great-expectations-intro-l1-meet-the-world-of-great-expectations","ocr-great-expectations-intro-l2-the-full-story-of-great-expectations"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["ocr-great-expectations-p1-l1-pip-magwitch-and-the-marshes","ocr-great-expectations-p1-l2-satis-house-london-and-the-mystery-benefactor","ocr-great-expectations-p1-l3-the-truth-about-magwitch-and-pips-transformation"] },
                    { tag: "Pillar 2", title: "Character Profiles", lectures: ["ocr-great-expectations-p2-l1-pip-ambition-shame-and-growth","ocr-great-expectations-p2-l2-miss-havisham-bitterness-and-obsession","ocr-great-expectations-p2-l3-estella-cruelty-and-its-origins","ocr-great-expectations-p2-l4-magwitch-and-joe-true-goodness","ocr-great-expectations-p2-l5-jaggers-and-wemmick-law-and-double-life"] },
                    { tag: "Pillar 3", title: "Big Ideas", lectures: ["ocr-great-expectations-p3-l1-class-and-social-mobility","ocr-great-expectations-p3-l2-wealth-and-its-corruption","ocr-great-expectations-p3-l3-ambition-and-self-improvement","ocr-great-expectations-p3-l4-love-and-its-distortions","ocr-great-expectations-p3-l5-crime-justice-and-redemption"] },
                    { tag: "Pillar 4", title: "The Novelist's Voice", lectures: ["ocr-great-expectations-p4-l1-first-person-narrative-and-retrospect","ocr-great-expectations-p4-l2-gothic-setting-satis-house-and-the-marshes","ocr-great-expectations-p4-l3-humour-and-caricature","ocr-great-expectations-p4-l4-symbolism-and-imagery-throughout"] },
                    { tag: "Pillar 5", title: "Victorian Values (AO3)", lectures: ["ocr-great-expectations-p5-l1-victorian-class-system-and-gentlemen","ocr-great-expectations-p5-l2-crime-punishment-and-transportation","ocr-great-expectations-p5-l3-dickens-own-life-and-his-purpose"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["ocr-great-expectations-p6-l1-choosing-and-answering-the-extract-based-question","ocr-great-expectations-p6-l2-choosing-and-answering-the-discursive-essay-question","ocr-great-expectations-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "pride-prejudice",
                name: "Pride & Prejudice",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["ocr-pride-prejudice-intro-l1-meet-the-world-of-pride-and-prejudice","ocr-pride-prejudice-intro-l2-the-full-story-of-pride-and-prejudice"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["ocr-pride-prejudice-p1-l1-the-bennets-bingley-and-first-impressions","ocr-pride-prejudice-p1-l2-wickham-darcy-and-misunderstandings","ocr-pride-prejudice-p1-l3-the-truth-revealed-and-two-proposals"] },
                    { tag: "Pillar 2", title: "Character Profiles", lectures: ["ocr-pride-prejudice-p2-l1-elizabeth-bennet-wit-and-independence","ocr-pride-prejudice-p2-l2-darcy-pride-and-transformation","ocr-pride-prejudice-p2-l3-jane-and-bingley-uncomplicated-love","ocr-pride-prejudice-p2-l4-wickham-lydia-and-moral-failure","ocr-pride-prejudice-p2-l5-mrs-bennet-collins-and-social-comedy"] },
                    { tag: "Pillar 3", title: "Big Ideas", lectures: ["ocr-pride-prejudice-p3-l1-marriage-and-financial-security","ocr-pride-prejudice-p3-l2-class-and-social-hierarchy","ocr-pride-prejudice-p3-l3-pride-and-prejudice-as-flaws","ocr-pride-prejudice-p3-l4-women-independence-and-limited-choices","ocr-pride-prejudice-p3-l5-reputation-and-social-judgement"] },
                    { tag: "Pillar 4", title: "The Novelist's Voice", lectures: ["ocr-pride-prejudice-p4-l1-free-indirect-discourse-and-narrative-voice","ocr-pride-prejudice-p4-l2-irony-wit-and-social-satire","ocr-pride-prejudice-p4-l3-dialogue-as-character-revelation","ocr-pride-prejudice-p4-l4-structure-and-the-comedy-of-manners"] },
                    { tag: "Pillar 5", title: "Victorian Values (AO3)", lectures: ["ocr-pride-prejudice-p5-l1-regency-society-marriage-and-women","ocr-pride-prejudice-p5-l2-entailment-inheritance-and-financial-reality","ocr-pride-prejudice-p5-l3-austens-purpose-and-the-novel-of-manners"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["ocr-pride-prejudice-p6-l1-choosing-and-answering-the-extract-based-question","ocr-pride-prejudice-p6-l2-choosing-and-answering-the-discursive-essay-question","ocr-pride-prejudice-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "war-of-worlds",
                name: "The War of the Worlds",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["ocr-war-of-worlds-intro-l1-meet-the-world-of-the-war-of-the-worlds","ocr-war-of-worlds-intro-l2-the-full-story-of-the-war-of-the-worlds"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["ocr-war-of-worlds-p1-l1-the-landing-at-horsell-common-and-first-panic","ocr-war-of-worlds-p1-l2-the-heat-ray-the-black-smoke-and-the-exodus","ocr-war-of-worlds-p1-l3-the-curates-collapse-and-the-martians-defeat"] },
                    { tag: "Pillar 2", title: "Character Profiles", lectures: ["ocr-war-of-worlds-p2-l1-the-narrator-observer-and-survivor","ocr-war-of-worlds-p2-l2-the-curate-faith-collapsing-under-pressure","ocr-war-of-worlds-p2-l3-the-artilleryman-big-talk-and-empty-plans","ocr-war-of-worlds-p2-l4-the-narrators-brother-and-the-human-stampede"] },
                    { tag: "Pillar 3", title: "Big Ideas", lectures: ["ocr-war-of-worlds-p3-l1-imperialism-and-who-gets-to-be-the-invader","ocr-war-of-worlds-p3-l2-science-technology-and-human-arrogance","ocr-war-of-worlds-p3-l3-survival-and-what-it-strips-away","ocr-war-of-worlds-p3-l4-religion-and-faith-under-pressure","ocr-war-of-worlds-p3-l5-fear-and-the-collapse-of-social-order"] },
                    { tag: "Pillar 4", title: "The Novelist's Voice", lectures: ["ocr-war-of-worlds-p4-l1-first-person-eyewitness-narration","ocr-war-of-worlds-p4-l2-scientific-language-and-realism","ocr-war-of-worlds-p4-l3-the-martians-as-symbol-and-spectacle","ocr-war-of-worlds-p4-l4-structure-the-two-books-and-pacing-of-panic"] },
                    { tag: "Pillar 5", title: "Victorian Values (AO3)", lectures: ["ocr-war-of-worlds-p5-l1-victorian-imperialism-and-the-british-empire","ocr-war-of-worlds-p5-l2-darwinism-and-fear-of-the-unfit","ocr-war-of-worlds-p5-l3-wellss-purpose-and-early-science-fiction"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["ocr-war-of-worlds-p6-l1-mastering-the-extract-question","ocr-war-of-worlds-p6-l2-mastering-the-discursive-essay-question","ocr-war-of-worlds-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "jekyll-hyde",
                name: "Dr Jekyll and Mr Hyde",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["ocr-jekyll-hyde-intro-l1-meet-the-world-of-jekyll-and-hyde","ocr-jekyll-hyde-intro-l2-the-full-story-of-jekyll-and-hyde"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["ocr-jekyll-hyde-p1-l1-utterson-and-the-mystery-begins","ocr-jekyll-hyde-p1-l2-hyde-unleashed-carew-murder-and-panic","ocr-jekyll-hyde-p1-l3-the-letters-the-truth-and-the-ending"] },
                    { tag: "Pillar 2", title: "Character Profiles", lectures: ["ocr-jekyll-hyde-p2-l1-jekyll-respectability-and-repression","ocr-jekyll-hyde-p2-l2-hyde-pure-evil-and-what-he-represents","ocr-jekyll-hyde-p2-l3-utterson-the-loyal-observer","ocr-jekyll-hyde-p2-l4-lanyon-science-and-moral-shock","ocr-jekyll-hyde-p2-l5-poole-and-the-servants-society-watching"] },
                    { tag: "Pillar 3", title: "Big Ideas", lectures: ["ocr-jekyll-hyde-p3-l1-duality-of-human-nature","ocr-jekyll-hyde-p3-l2-repression-and-victorian-respectability","ocr-jekyll-hyde-p3-l3-science-and-the-dangers-of-ambition","ocr-jekyll-hyde-p3-l4-secrecy-and-the-danger-of-silence","ocr-jekyll-hyde-p3-l5-appearance-vs-reality"] },
                    { tag: "Pillar 4", title: "The Novelist's Voice", lectures: ["ocr-jekyll-hyde-p4-l1-gothic-setting-and-atmosphere","ocr-jekyll-hyde-p4-l2-hydes-disturbing-language-and-description","ocr-jekyll-hyde-p4-l3-narrative-structure-multiple-perspectives","ocr-jekyll-hyde-p4-l4-symbolism-doors-mirrors-and-fog"] },
                    { tag: "Pillar 5", title: "Victorian Values (AO3)", lectures: ["ocr-jekyll-hyde-p5-l1-victorian-society-class-and-reputation","ocr-jekyll-hyde-p5-l2-darwin-and-the-fear-of-degeneration","ocr-jekyll-hyde-p5-l3-stevensons-purpose-and-the-novella-form"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["ocr-jekyll-hyde-p6-l1-choosing-and-answering-the-extract-based-question","ocr-jekyll-hyde-p6-l2-choosing-and-answering-the-discursive-essay-question","ocr-jekyll-hyde-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "jane-eyre",
                name: "Jane Eyre",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["ocr-jane-eyre-intro-l1-meet-the-world-of-jane-eyre","ocr-jane-eyre-intro-l2-the-full-story-of-jane-eyre"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["ocr-jane-eyre-p1-l1-childhood-lowood-and-finding-thornfield","ocr-jane-eyre-p1-l2-rochester-bertha-and-the-wedding-that-fails","ocr-jane-eyre-p1-l3-moor-house-the-inheritance-and-the-return"] },
                    { tag: "Pillar 2", title: "Character Profiles", lectures: ["ocr-jane-eyre-p2-l1-jane-independence-and-moral-strength","ocr-jane-eyre-p2-l2-rochester-passion-and-deception","ocr-jane-eyre-p2-l3-bertha-mason-the-madwoman-and-what-she-represents","ocr-jane-eyre-p2-l4-st-john-rivers-cold-duty-vs-warm-love","ocr-jane-eyre-p2-l5-brocklehurst-and-the-red-room-oppression"] },
                    { tag: "Pillar 3", title: "Big Ideas", lectures: ["ocr-jane-eyre-p3-l1-independence-and-female-autonomy","ocr-jane-eyre-p3-l2-class-and-social-belonging","ocr-jane-eyre-p3-l3-religion-and-morality","ocr-jane-eyre-p3-l4-love-and-equality-in-relationships","ocr-jane-eyre-p3-l5-the-gothic-and-the-supernatural"] },
                    { tag: "Pillar 4", title: "The Novelist's Voice", lectures: ["ocr-jane-eyre-p4-l1-first-person-voice-and-direct-address","ocr-jane-eyre-p4-l2-gothic-atmosphere-and-symbolism","ocr-jane-eyre-p4-l3-pathetic-fallacy-and-natural-imagery","ocr-jane-eyre-p4-l4-structure-bildungsroman-and-janes-journey"] },
                    { tag: "Pillar 5", title: "Victorian Values (AO3)", lectures: ["ocr-jane-eyre-p5-l1-victorian-women-marriage-and-independence","ocr-jane-eyre-p5-l2-class-religion-and-charity-schools","ocr-jane-eyre-p5-l3-colonialism-and-the-empire-bertha-mason"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["ocr-jane-eyre-p6-l1-choosing-and-answering-the-extract-based-question","ocr-jane-eyre-p6-l2-choosing-and-answering-the-discursive-essay-question","ocr-jane-eyre-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "christmas-carol",
                name: "A Christmas Carol",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["ocr-christmas-carol-intro-l1-meet-the-world-of-a-christmas-carol","ocr-christmas-carol-intro-l2-the-full-story-of-a-christmas-carol"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["ocr-christmas-carol-p1-l1-stave-1-scrooge-and-marleys-ghost","ocr-christmas-carol-p1-l2-staves-2-and-3-the-past-and-present","ocr-christmas-carol-p1-l3-staves-4-and-5-the-future-and-redemption"] },
                    { tag: "Pillar 2", title: "Character Profiles", lectures: ["ocr-christmas-carol-p2-l1-scrooge-the-transformation","ocr-christmas-carol-p2-l2-the-three-spirits-and-what-they-represent","ocr-christmas-carol-p2-l3-bob-cratchit-and-tiny-tim-the-poor","ocr-christmas-carol-p2-l4-fred-and-belle-warmth-vs-greed","ocr-christmas-carol-p2-l5-marley-warning-and-consequence"] },
                    { tag: "Pillar 3", title: "Big Ideas", lectures: ["ocr-christmas-carol-p3-l1-poverty-and-social-responsibility","ocr-christmas-carol-p3-l2-redemption-and-transformation","ocr-christmas-carol-p3-l3-greed-and-the-corruption-of-wealth","ocr-christmas-carol-p3-l4-family-and-generosity","ocr-christmas-carol-p3-l5-time-memory-and-regret"] },
                    { tag: "Pillar 4", title: "The Novelist's Voice", lectures: ["ocr-christmas-carol-p4-l1-the-gothic-and-supernatural-atmosphere","ocr-christmas-carol-p4-l2-symbolism-chains-cold-and-fire","ocr-christmas-carol-p4-l3-narrative-voice-and-direct-address","ocr-christmas-carol-p4-l4-structure-the-five-staves"] },
                    { tag: "Pillar 5", title: "Victorian Values (AO3)", lectures: ["ocr-christmas-carol-p5-l1-victorian-poverty-and-the-workhouse","ocr-christmas-carol-p5-l2-the-poor-law-and-social-reform","ocr-christmas-carol-p5-l3-dickens-purpose-and-personal-history"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["ocr-christmas-carol-p6-l1-choosing-and-answering-the-extract-based-question","ocr-christmas-carol-p6-l2-choosing-and-answering-the-discursive-essay-question","ocr-christmas-carol-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            }
        ]
    }
];
