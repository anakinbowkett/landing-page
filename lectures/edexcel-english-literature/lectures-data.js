/* ════════════════════════════════════════════
   Montura Learn — AQA English Literature
   Single source of truth for the full course structure.
   Loaded by both lectures.html and every Pillar Decks page —
   nothing below should ever be hand-copied elsewhere again.
════════════════════════════════════════════ */
function slugToTitle(slug) {
    return slug
        .replace(/^aqa-[a-z-]+-(?:intro-|p\d+-)?l\d+-/, '')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
}

const papersData = [

/* ══════════════════════════════════════
       FOUNDATION — UNIVERSAL (Phases 0–3)
    ══════════════════════════════════════ */
    {
        tag: "Foundation",
        title: "Start Here — Universal Skills",
        type: "single",
        pillars: [
            {
                tag: "Phase 0", title: "Orientation — What Is This Course?",
                lectures: [
                    { slug: "p0-l1-what-is-gcse-english-literature",         title: "What is GCSE English Literature?" },
                    { slug: "p0-l2-what-does-the-exam-look-like",            title: "What Does the Exam Look Like?" },
                    { slug: "p0-l3-what-is-the-examiner-actually-marking",   title: "What is the Examiner Actually Marking?" },
                    { slug: "p0-l4-why-your-opinion-matters",                title: "Why Your Opinion Matters" },
                    { slug: "p0-l5-what-is-a-grade-9-and-how-do-you-get-there", title: "What is a Grade 9 and How Do You Get There?" },
                    { slug: "p0-l6-how-to-use-this-platform",               title: "How to Use This Platform" },
                    { slug: "p0-l7-what-texts-will-you-study-and-why",      title: "What Texts Will You Study and Why?" },
                    { slug: "p0-l8-how-to-read-anything-with-intention",    title: "How to Read Anything with Intention" }
                ]
            },
            {
                tag: "Phase 1", title: "Close Reading Skills",
                lectures: [
                    { slug: "cr-l1-what-a-word-is-actually-doing",               title: "What a Word is Actually Doing" },
                    { slug: "cr-l2-denotation-vs-connotation",                   title: "Denotation vs Connotation" },
                    { slug: "cr-l3-why-writers-choose-words",                    title: "Why Writers Choose Words" },
                    { slug: "cr-l4-what-a-sentence-is-doing-vs-what-it-says",   title: "What a Sentence is Doing vs What it Says" },
                    { slug: "cr-l5-how-to-zoom-in-from-paragraph-to-word",      title: "How to Zoom In — From Paragraph to Word" },
                    { slug: "cr-l6-what-mood-is-and-how-it-is-created",         title: "What Mood is and How it is Created" },
                    { slug: "cr-l7-what-tone-is-and-how-it-differs-from-mood",  title: "What Tone is and How it Differs from Mood" },
                    { slug: "cr-l8-how-to-read-a-character",                    title: "How to Read a Character" },
                    { slug: "cr-l9-how-to-read-a-theme",                        title: "How to Read a Theme" },
                    { slug: "cr-l10-what-an-audience-is-and-why-it-matters",    title: "What an Audience is and Why it Matters" },
                    { slug: "cr-l11-how-context-changes-meaning",               title: "How Context Changes Meaning" },
                    { slug: "cr-l12-reading-a-short-extract-from-scratch",      title: "Reading a Short Extract from Scratch" }
                ]
            },
            {
                tag: "Phase 2", title: "The Writer's Toolkit — Techniques",
                lectures: [
                    { slug: "tk-l1-metaphor",                                  title: "Metaphor" },
                    { slug: "tk-l2-simile",                                    title: "Simile" },
                    { slug: "tk-l3-personification",                           title: "Personification" },
                    { slug: "tk-l4-repetition",                                title: "Repetition" },
                    { slug: "tk-l5-contrast",                                  title: "Contrast" },
                    { slug: "tk-l6-oxymoron",                                  title: "Oxymoron" },
                    { slug: "tk-l7-semantic-field",                            title: "Semantic Field" },
                    { slug: "tk-l8-imagery",                                   title: "Imagery" },
                    { slug: "tk-l9-foreshadowing",                             title: "Foreshadowing" },
                    { slug: "tk-l10-dramatic-irony",                           title: "Dramatic Irony" },
                    { slug: "tk-l11-soliloquy-and-aside",                      title: "Soliloquy and Aside" },
                    { slug: "tk-l12-symbolism",                                title: "Symbolism" },
                    { slug: "tk-l13-hyperbole",                                title: "Hyperbole" },
                    { slug: "tk-l14-rhetorical-questions",                     title: "Rhetorical Questions" },
                    { slug: "tk-l15-alliteration-and-sound",                   title: "Alliteration and Sound" },
                    { slug: "tk-l16-structure-how-shape-creates-meaning",      title: "Structure — How Shape Creates Meaning" },
                    { slug: "tk-l17-form-why-it-matters-what-type-of-text-this-is", title: "Form — Why it Matters What Type of Text This Is" },
                    { slug: "tk-l18-narrative-voice",                          title: "Narrative Voice" },
                    { slug: "tk-l19-sentence-structure",                       title: "Sentence Structure" },
                    { slug: "tk-l20-putting-it-all-together",                  title: "Putting it All Together" }
                ]
            },
            {
                tag: "Phase 3", title: "Exam Writing Skills",
                lectures: [
                    { slug: "ew-l1-what-ao1-looks-like-written-down",                    title: "What AO1 Looks Like Written Down" },
                    { slug: "ew-l2-what-ao2-looks-like-written-down",                    title: "What AO2 Looks Like Written Down" },
                    { slug: "ew-l3-what-ao3-looks-like-written-down",                    title: "What AO3 Looks Like Written Down" },
                    { slug: "ew-l4-the-sir-verbs-suggests-implies-reveals",              title: "The SIR Verbs — Suggests, Implies, Reveals" },
                    { slug: "ew-l5-peel-point-evidence-explain-link",                    title: "PEEL — Point, Evidence, Explain, Link" },
                    { slug: "ew-l6-pemew-point-evidence-method-explain-writers-purpose", title: "PEMEW — Point, Evidence, Method, Explain, Writer's Purpose" },
                    { slug: "ew-l7-how-to-read-an-exam-question",                        title: "How to Read an Exam Question" },
                    { slug: "ew-l8-how-to-plan-an-answer-in-two-minutes",               title: "How to Plan an Answer in Two Minutes" },
                    { slug: "ew-l9-how-to-write-under-time-pressure",                   title: "How to Write Under Time Pressure" },
                    { slug: "ew-l10-what-a-grade-9-paragraph-looks-like-and-why",       title: "What a Grade 9 Paragraph Looks Like and Why" }
                ]
            }
        ]
    },  
  
  
  
    /* ══════════════════════════════════════
       PAPER 1 · SECTION A — SHAKESPEARE
    ══════════════════════════════════════ */
    {
        tag: "Paper 1 · Section A",
        title: "Shakespeare",
        type: "multi",
        texts: [
            {
                id: "macbeth",
                name: "Macbeth",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["aqa-macbeth-intro-l1-meet-the-world-of-macbeth","aqa-macbeth-intro-l2-the-full-story-of-macbeth"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["aqa-macbeth-p1-l1-the-opening-scotland-and-the-witches","aqa-macbeth-p1-l2-the-murder-of-duncan-and-the-spiral-begins","aqa-macbeth-p1-l3-the-collapse-banquo-macduff-and-the-ending"] },
                    { tag: "Pillar 2", title: "Meet the Characters", lectures: ["aqa-macbeth-p2-l1-macbeth-hero-to-tyrant","aqa-macbeth-p2-l2-lady-macbeth-ambition-and-guilt","aqa-macbeth-p2-l3-the-witches-and-their-power","aqa-macbeth-p2-l4-banquo-macduff-and-the-forces-of-good","aqa-macbeth-p2-l5-top-10-must-know-quotes"] },
                    { tag: "Pillar 3", title: "The Deep Stuff", lectures: ["aqa-macbeth-p3-l1-ambition-and-its-consequences","aqa-macbeth-p3-l2-power-and-corruption","aqa-macbeth-p3-l3-guilt-and-the-human-conscience","aqa-macbeth-p3-l4-appearance-vs-reality","aqa-macbeth-p3-l5-gender-and-masculinity","aqa-macbeth-p3-l6-the-supernatural-and-fate"] },
                    { tag: "Pillar 4", title: "The Writer's Tricks", lectures: ["aqa-macbeth-p4-l1-the-language-of-darkness-and-blood","aqa-macbeth-p4-l2-soliloquies-and-what-they-reveal","aqa-macbeth-p4-l3-the-witches-language-and-prophecy","aqa-macbeth-p4-l4-structure-and-stagecraft"] },
                    { tag: "Pillar 5", title: "The Real World (AO3)", lectures: ["aqa-macbeth-p5-l1-jacobean-england-and-king-james","aqa-macbeth-p5-l2-witchcraft-and-the-supernatural-in-1606","aqa-macbeth-p5-l3-divine-right-of-kings-and-gender-roles"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["aqa-macbeth-p6-l1-cracking-the-extract-question","aqa-macbeth-p6-l2-linking-extract-to-the-whole-play","aqa-macbeth-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "romeo",
                name: "Romeo & Juliet",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["aqa-romeo-intro-l1-meet-the-world-of-romeo-and-juliet","aqa-romeo-intro-l2-the-full-story-of-romeo-and-juliet"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["aqa-romeo-p1-l1-the-feud-and-the-first-meeting","aqa-romeo-p1-l2-the-marriage-tybalt-and-the-turning-point","aqa-romeo-p1-l3-the-plan-the-tomb-and-the-tragic-ending"] },
                    { tag: "Pillar 2", title: "Meet the Characters", lectures: ["aqa-romeo-p2-l1-romeo-impulsive-lover-and-tragic-hero","aqa-romeo-p2-l2-juliet-strength-and-sacrifice","aqa-romeo-p2-l3-tybalt-mercutio-and-the-violence-of-verona","aqa-romeo-p2-l4-the-friar-and-the-nurse-adult-failures","aqa-romeo-p2-l5-lord-and-lady-capulet-parental-power"] },
                    { tag: "Pillar 3", title: "The Deep Stuff", lectures: ["aqa-romeo-p3-l1-love-and-its-many-forms","aqa-romeo-p3-l2-fate-and-free-will","aqa-romeo-p3-l3-conflict-and-violence","aqa-romeo-p3-l4-family-honour-and-obedience","aqa-romeo-p3-l5-youth-vs-age-and-power"] },
                    { tag: "Pillar 4", title: "The Writer's Tricks", lectures: ["aqa-romeo-p4-l1-light-and-dark-imagery","aqa-romeo-p4-l2-the-use-of-time-and-speed","aqa-romeo-p4-l3-dramatic-irony-and-the-prologue","aqa-romeo-p4-l4-verse-prose-and-the-sonnet-form"] },
                    { tag: "Pillar 5", title: "The Real World (AO3)", lectures: ["aqa-romeo-p5-l1-elizabethan-society-patriarchy-and-marriage","aqa-romeo-p5-l2-religion-fate-and-the-stars","aqa-romeo-p5-l3-what-shakespeare-was-saying-about-society"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["aqa-romeo-p6-l1-cracking-the-extract-question","aqa-romeo-p6-l2-linking-extract-to-the-whole-play","aqa-romeo-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "tempest",
                name: "The Tempest",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["aqa-tempest-intro-l1-meet-the-world-of-the-tempest","aqa-tempest-intro-l2-the-full-story-of-the-tempest"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["aqa-tempest-p1-l1-the-shipwreck-and-prosperos-island","aqa-tempest-p1-l2-the-plots-love-and-conspiracy","aqa-tempest-p1-l3-forgiveness-and-the-return-to-milan"] },
                    { tag: "Pillar 2", title: "Meet the Characters", lectures: ["aqa-tempest-p2-l1-prospero-power-and-forgiveness","aqa-tempest-p2-l2-miranda-innocence-and-identity","aqa-tempest-p2-l3-caliban-the-dispossessed-and-the-colonial","aqa-tempest-p2-l4-ariel-freedom-and-servitude","aqa-tempest-p2-l5-antonio-alonso-and-the-corrupt-nobility"] },
                    { tag: "Pillar 3", title: "The Deep Stuff", lectures: ["aqa-tempest-p3-l1-power-and-control","aqa-tempest-p3-l2-colonialism-and-otherness","aqa-tempest-p3-l3-freedom-and-servitude","aqa-tempest-p3-l4-forgiveness-and-justice","aqa-tempest-p3-l5-magic-and-the-natural-world"] },
                    { tag: "Pillar 4", title: "The Writer's Tricks", lectures: ["aqa-tempest-p4-l1-prosperos-language-of-command","aqa-tempest-p4-l2-caliban-and-the-beauty-of-his-language","aqa-tempest-p4-l3-masque-and-theatrical-spectacle","aqa-tempest-p4-l4-structure-island-as-a-controlled-space"] },
                    { tag: "Pillar 5", title: "The Real World (AO3)", lectures: ["aqa-tempest-p5-l1-jacobean-exploration-and-colonialism","aqa-tempest-p5-l2-renaissance-ideas-of-power-and-magic","aqa-tempest-p5-l3-shakespeares-final-play-and-his-purpose"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["aqa-tempest-p6-l1-cracking-the-extract-question","aqa-tempest-p6-l2-linking-extract-to-the-whole-play","aqa-tempest-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "merchant",
                name: "Merchant of Venice",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["aqa-merchant-intro-l1-meet-the-world-of-the-merchant-of-venice","aqa-merchant-intro-l2-the-full-story-of-the-merchant-of-venice"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["aqa-merchant-p1-l1-the-bond-antonio-shylock-and-the-deal","aqa-merchant-p1-l2-portia-bassanio-and-the-casket-plot","aqa-merchant-p1-l3-the-trial-and-the-resolution"] },
                    { tag: "Pillar 2", title: "Meet the Characters", lectures: ["aqa-merchant-p2-l1-shylock-villain-or-victim","aqa-merchant-p2-l2-portia-intelligence-and-female-power","aqa-merchant-p2-l3-antonio-and-bassanio-friendship-and-loyalty","aqa-merchant-p2-l4-jessica-and-launcelot-belonging-and-identity","aqa-merchant-p2-l5-the-duke-and-the-minor-characters"] },
                    { tag: "Pillar 3", title: "The Deep Stuff", lectures: ["aqa-merchant-p3-l1-prejudice-and-antisemitism","aqa-merchant-p3-l2-justice-and-mercy","aqa-merchant-p3-l3-wealth-and-greed","aqa-merchant-p3-l4-appearance-vs-reality","aqa-merchant-p3-l5-gender-and-disguise"] },
                    { tag: "Pillar 4", title: "The Writer's Tricks", lectures: ["aqa-merchant-p4-l1-the-language-of-money-and-trade","aqa-merchant-p4-l2-shylocks-powerful-speeches","aqa-merchant-p4-l3-comedy-and-its-dark-edges","aqa-merchant-p4-l4-structure-courtroom-as-climax"] },
                    { tag: "Pillar 5", title: "The Real World (AO3)", lectures: ["aqa-merchant-p5-l1-elizabethan-attitudes-to-jews-and-outsiders","aqa-merchant-p5-l2-venetian-society-trade-and-law","aqa-merchant-p5-l3-what-shakespeare-intended-and-modern-readings"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["aqa-merchant-p6-l1-cracking-the-extract-question","aqa-merchant-p6-l2-linking-extract-to-the-whole-play","aqa-merchant-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "much-ado",
                name: "Much Ado",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["aqa-much-ado-intro-l1-meet-the-world-of-much-ado-about-nothing","aqa-much-ado-intro-l2-the-full-story-of-much-ado-about-nothing"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["aqa-much-ado-p1-l1-the-soldiers-return-and-the-two-plots","aqa-much-ado-p1-l2-the-deception-hero-shamed-and-beatrice-acts","aqa-much-ado-p1-l3-the-truth-revealed-and-the-double-wedding"] },
                    { tag: "Pillar 2", title: "Meet the Characters", lectures: ["aqa-much-ado-p2-l1-beatrice-wit-and-independence","aqa-much-ado-p2-l2-benedick-pride-and-transformation","aqa-much-ado-p2-l3-hero-and-claudio-idealistic-love","aqa-much-ado-p2-l4-don-john-the-villain-and-his-motive","aqa-much-ado-p2-l5-dogberry-and-the-comic-watchmen"] },
                    { tag: "Pillar 3", title: "The Deep Stuff", lectures: ["aqa-much-ado-p3-l1-love-and-courtship","aqa-much-ado-p3-l2-honour-and-reputation","aqa-much-ado-p3-l3-deception-and-appearance-vs-reality","aqa-much-ado-p3-l4-gender-and-the-expectations-of-women","aqa-much-ado-p3-l5-wit-and-language-as-power"] },
                    { tag: "Pillar 4", title: "The Writer's Tricks", lectures: ["aqa-much-ado-p4-l1-prose-vs-verse-and-what-it-tells-us","aqa-much-ado-p4-l2-wit-wordplay-and-the-battle-of-the-sexes","aqa-much-ado-p4-l3-dramatic-irony-and-the-eavesdropping-scenes","aqa-much-ado-p4-l4-structure-comedy-conventions-subverted"] },
                    { tag: "Pillar 5", title: "The Real World (AO3)", lectures: ["aqa-much-ado-p5-l1-elizabethan-marriage-honour-and-women","aqa-much-ado-p5-l2-social-hierarchy-and-military-culture","aqa-much-ado-p5-l3-shakespeares-purpose-and-the-comedic-form"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["aqa-much-ado-p6-l1-cracking-the-extract-question","aqa-much-ado-p6-l2-linking-extract-to-the-whole-play","aqa-much-ado-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "julius-caesar",
                name: "Julius Caesar",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["aqa-julius-caesar-intro-l1-meet-the-world-of-julius-caesar","aqa-julius-caesar-intro-l2-the-full-story-of-julius-caesar"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["aqa-julius-caesar-p1-l1-rome-the-conspiracy-and-the-assassination","aqa-julius-caesar-p1-l2-the-funeral-speeches-and-civil-war","aqa-julius-caesar-p1-l3-the-battle-of-philippi-and-the-aftermath"] },
                    { tag: "Pillar 2", title: "Meet the Characters", lectures: ["aqa-julius-caesar-p2-l1-brutus-honour-and-fatal-idealism","aqa-julius-caesar-p2-l2-cassius-manipulation-and-envy","aqa-julius-caesar-p2-l3-mark-antony-rhetoric-and-revenge","aqa-julius-caesar-p2-l4-julius-caesar-power-and-ambition","aqa-julius-caesar-p2-l5-portia-calpurnia-and-the-women-of-rome"] },
                    { tag: "Pillar 3", title: "The Deep Stuff", lectures: ["aqa-julius-caesar-p3-l1-power-and-ambition","aqa-julius-caesar-p3-l2-loyalty-and-betrayal","aqa-julius-caesar-p3-l3-rhetoric-and-the-power-of-language","aqa-julius-caesar-p3-l4-honour-and-integrity","aqa-julius-caesar-p3-l5-fate-omens-and-the-supernatural"] },
                    { tag: "Pillar 4", title: "The Writer's Tricks", lectures: ["aqa-julius-caesar-p4-l1-the-power-of-the-speeches-brutus-vs-antony","aqa-julius-caesar-p4-l2-imagery-of-storms-blood-and-omens","aqa-julius-caesar-p4-l3-soliloquy-and-aside-inner-conflict","aqa-julius-caesar-p4-l4-structure-from-triumph-to-tragedy"] },
                    { tag: "Pillar 5", title: "The Real World (AO3)", lectures: ["aqa-julius-caesar-p5-l1-roman-republic-politics-and-power","aqa-julius-caesar-p5-l2-elizabethan-fears-of-tyranny-and-succession","aqa-julius-caesar-p5-l3-what-shakespeare-was-really-exploring"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["aqa-julius-caesar-p6-l1-cracking-the-extract-question","aqa-julius-caesar-p6-l2-linking-extract-to-the-whole-play","aqa-julius-caesar-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            }
        ]
    },

    /* ══════════════════════════════════════
       PAPER 1 · SECTION B — 19TH CENTURY NOVEL
    ══════════════════════════════════════ */
    {
        tag: "Paper 1 · Section B",
        title: "19th Century Novel",
        type: "multi",
        texts: [
            {
                id: "christmas-carol",
                name: "A Christmas Carol",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["aqa-christmas-carol-intro-l1-meet-the-world-of-a-christmas-carol","aqa-christmas-carol-intro-l2-the-full-story-of-a-christmas-carol"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["aqa-christmas-carol-p1-l1-stave-1-scrooge-and-marleys-ghost","aqa-christmas-carol-p1-l2-staves-2-and-3-the-past-and-present","aqa-christmas-carol-p1-l3-staves-4-and-5-the-future-and-redemption"] },
                    { tag: "Pillar 2", title: "Character Profiles", lectures: ["aqa-christmas-carol-p2-l1-scrooge-the-transformation","aqa-christmas-carol-p2-l2-the-three-spirits-and-what-they-represent","aqa-christmas-carol-p2-l3-bob-cratchit-and-tiny-tim-the-poor","aqa-christmas-carol-p2-l4-fred-and-belle-warmth-vs-greed","aqa-christmas-carol-p2-l5-marley-warning-and-consequence"] },
                    { tag: "Pillar 3", title: "Big Ideas", lectures: ["aqa-christmas-carol-p3-l1-poverty-and-social-responsibility","aqa-christmas-carol-p3-l2-redemption-and-transformation","aqa-christmas-carol-p3-l3-greed-and-the-corruption-of-wealth","aqa-christmas-carol-p3-l4-family-and-generosity","aqa-christmas-carol-p3-l5-time-memory-and-regret"] },
                    { tag: "Pillar 4", title: "The Novelist's Voice", lectures: ["aqa-christmas-carol-p4-l1-the-gothic-and-supernatural-atmosphere","aqa-christmas-carol-p4-l2-symbolism-chains-cold-and-fire","aqa-christmas-carol-p4-l3-narrative-voice-and-direct-address","aqa-christmas-carol-p4-l4-structure-the-five-staves"] },
                    { tag: "Pillar 5", title: "Victorian Values (AO3)", lectures: ["aqa-christmas-carol-p5-l1-victorian-poverty-and-the-workhouse","aqa-christmas-carol-p5-l2-the-poor-law-and-social-reform","aqa-christmas-carol-p5-l3-dickens-purpose-and-personal-history"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["aqa-christmas-carol-p6-l1-mastering-the-extract-question","aqa-christmas-carol-p6-l2-linking-extract-to-whole-text","aqa-christmas-carol-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "jekyll-hyde",
                name: "Jekyll & Hyde",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["aqa-jekyll-hyde-intro-l1-meet-the-world-of-jekyll-and-hyde","aqa-jekyll-hyde-intro-l2-the-full-story-of-jekyll-and-hyde"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["aqa-jekyll-hyde-p1-l1-utterson-and-the-mystery-begins","aqa-jekyll-hyde-p1-l2-hyde-unleashed-carew-murder-and-panic","aqa-jekyll-hyde-p1-l3-the-letters-the-truth-and-the-ending"] },
                    { tag: "Pillar 2", title: "Character Profiles", lectures: ["aqa-jekyll-hyde-p2-l1-jekyll-respectability-and-repression","aqa-jekyll-hyde-p2-l2-hyde-pure-evil-and-what-he-represents","aqa-jekyll-hyde-p2-l3-utterson-the-loyal-observer","aqa-jekyll-hyde-p2-l4-lanyon-science-and-moral-shock","aqa-jekyll-hyde-p2-l5-poole-and-the-servants-society-watching"] },
                    { tag: "Pillar 3", title: "Big Ideas", lectures: ["aqa-jekyll-hyde-p3-l1-duality-of-human-nature","aqa-jekyll-hyde-p3-l2-repression-and-victorian-respectability","aqa-jekyll-hyde-p3-l3-science-and-the-dangers-of-ambition","aqa-jekyll-hyde-p3-l4-secrecy-and-the-danger-of-silence","aqa-jekyll-hyde-p3-l5-appearance-vs-reality"] },
                    { tag: "Pillar 4", title: "The Novelist's Voice", lectures: ["aqa-jekyll-hyde-p4-l1-gothic-setting-and-atmosphere","aqa-jekyll-hyde-p4-l2-hydes-disturbing-language-and-description","aqa-jekyll-hyde-p4-l3-narrative-structure-multiple-perspectives","aqa-jekyll-hyde-p4-l4-symbolism-doors-mirrors-and-fog"] },
                    { tag: "Pillar 5", title: "Victorian Values (AO3)", lectures: ["aqa-jekyll-hyde-p5-l1-victorian-society-class-and-reputation","aqa-jekyll-hyde-p5-l2-darwin-and-the-fear-of-degeneration","aqa-jekyll-hyde-p5-l3-stevensons-purpose-and-the-novella-form"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["aqa-jekyll-hyde-p6-l1-mastering-the-extract-question","aqa-jekyll-hyde-p6-l2-linking-extract-to-whole-text","aqa-jekyll-hyde-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "great-expectations",
                name: "Great Expectations",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["aqa-great-expectations-intro-l1-meet-the-world-of-great-expectations","aqa-great-expectations-intro-l2-the-full-story-of-great-expectations"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["aqa-great-expectations-p1-l1-pip-magwitch-and-the-marshes","aqa-great-expectations-p1-l2-satis-house-london-and-the-mystery-benefactor","aqa-great-expectations-p1-l3-the-truth-about-magwitch-and-pips-transformation"] },
                    { tag: "Pillar 2", title: "Character Profiles", lectures: ["aqa-great-expectations-p2-l1-pip-ambition-shame-and-growth","aqa-great-expectations-p2-l2-miss-havisham-bitterness-and-obsession","aqa-great-expectations-p2-l3-estella-cruelty-and-its-origins","aqa-great-expectations-p2-l4-magwitch-and-joe-true-goodness","aqa-great-expectations-p2-l5-jaggers-and-wemmick-law-and-double-life"] },
                    { tag: "Pillar 3", title: "Big Ideas", lectures: ["aqa-great-expectations-p3-l1-class-and-social-mobility","aqa-great-expectations-p3-l2-wealth-and-its-corruption","aqa-great-expectations-p3-l3-ambition-and-self-improvement","aqa-great-expectations-p3-l4-love-and-its-distortions","aqa-great-expectations-p3-l5-crime-justice-and-redemption"] },
                    { tag: "Pillar 4", title: "The Novelist's Voice", lectures: ["aqa-great-expectations-p4-l1-first-person-narrative-and-retrospect","aqa-great-expectations-p4-l2-gothic-setting-satis-house-and-the-marshes","aqa-great-expectations-p4-l3-humour-and-caricature","aqa-great-expectations-p4-l4-symbolism-and-imagery-throughout"] },
                    { tag: "Pillar 5", title: "Victorian Values (AO3)", lectures: ["aqa-great-expectations-p5-l1-victorian-class-system-and-gentlemen","aqa-great-expectations-p5-l2-crime-punishment-and-transportation","aqa-great-expectations-p5-l3-dickens-own-life-and-his-purpose"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["aqa-great-expectations-p6-l1-mastering-the-extract-question","aqa-great-expectations-p6-l2-linking-extract-to-whole-text","aqa-great-expectations-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "jane-eyre",
                name: "Jane Eyre",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["aqa-jane-eyre-intro-l1-meet-the-world-of-jane-eyre","aqa-jane-eyre-intro-l2-the-full-story-of-jane-eyre"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["aqa-jane-eyre-p1-l1-childhood-lowood-and-finding-thornfield","aqa-jane-eyre-p1-l2-rochester-bertha-and-the-wedding-that-fails","aqa-jane-eyre-p1-l3-moor-house-the-inheritance-and-the-return"] },
                    { tag: "Pillar 2", title: "Character Profiles", lectures: ["aqa-jane-eyre-p2-l1-jane-independence-and-moral-strength","aqa-jane-eyre-p2-l2-rochester-passion-and-deception","aqa-jane-eyre-p2-l3-bertha-mason-the-madwoman-and-what-she-represents","aqa-jane-eyre-p2-l4-st-john-rivers-cold-duty-vs-warm-love","aqa-jane-eyre-p2-l5-brocklehurst-and-the-red-room-oppression"] },
                    { tag: "Pillar 3", title: "Big Ideas", lectures: ["aqa-jane-eyre-p3-l1-independence-and-female-autonomy","aqa-jane-eyre-p3-l2-class-and-social-belonging","aqa-jane-eyre-p3-l3-religion-and-morality","aqa-jane-eyre-p3-l4-love-and-equality-in-relationships","aqa-jane-eyre-p3-l5-the-gothic-and-the-supernatural"] },
                    { tag: "Pillar 4", title: "The Novelist's Voice", lectures: ["aqa-jane-eyre-p4-l1-first-person-voice-and-direct-address","aqa-jane-eyre-p4-l2-gothic-atmosphere-and-symbolism","aqa-jane-eyre-p4-l3-pathetic-fallacy-and-natural-imagery","aqa-jane-eyre-p4-l4-structure-bildungsroman-and-janes-journey"] },
                    { tag: "Pillar 5", title: "Victorian Values (AO3)", lectures: ["aqa-jane-eyre-p5-l1-victorian-women-marriage-and-independence","aqa-jane-eyre-p5-l2-class-religion-and-charity-schools","aqa-jane-eyre-p5-l3-colonialism-and-the-empire-bertha-mason"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["aqa-jane-eyre-p6-l1-mastering-the-extract-question","aqa-jane-eyre-p6-l2-linking-extract-to-whole-text","aqa-jane-eyre-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "frankenstein",
                name: "Frankenstein",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["aqa-frankenstein-intro-l1-meet-the-world-of-frankenstein","aqa-frankenstein-intro-l2-the-full-story-of-frankenstein"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["aqa-frankenstein-p1-l1-walton-victor-and-the-creation","aqa-frankenstein-p1-l2-the-creatures-awakening-and-rejection","aqa-frankenstein-p1-l3-pursuit-destruction-and-the-arctic-ending"] },
                    { tag: "Pillar 2", title: "Character Profiles", lectures: ["aqa-frankenstein-p2-l1-victor-frankenstein-ambition-and-responsibility","aqa-frankenstein-p2-l2-the-creature-sympathy-and-monstrosity","aqa-frankenstein-p2-l3-walton-the-framing-narrator","aqa-frankenstein-p2-l4-elizabeth-and-justine-female-victims","aqa-frankenstein-p2-l5-de-lacey-family-and-what-the-creature-learns"] },
                    { tag: "Pillar 3", title: "Big Ideas", lectures: ["aqa-frankenstein-p3-l1-ambition-and-the-dangers-of-playing-god","aqa-frankenstein-p3-l2-responsibility-and-abandonment","aqa-frankenstein-p3-l3-prejudice-and-appearance","aqa-frankenstein-p3-l4-nature-vs-nurture","aqa-frankenstein-p3-l5-knowledge-and-its-consequences"] },
                    { tag: "Pillar 4", title: "The Novelist's Voice", lectures: ["aqa-frankenstein-p4-l1-the-gothic-sublime-and-natural-imagery","aqa-frankenstein-p4-l2-the-creatures-eloquent-voice","aqa-frankenstein-p4-l3-frame-narrative-and-multiple-perspectives","aqa-frankenstein-p4-l4-symbolism-fire-light-and-ice"] },
                    { tag: "Pillar 5", title: "Victorian Values (AO3)", lectures: ["aqa-frankenstein-p5-l1-the-scientific-revolution-and-galvanism","aqa-frankenstein-p5-l2-romanticism-and-the-sublime","aqa-frankenstein-p5-l3-shelleys-life-and-the-birth-of-the-novel"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["aqa-frankenstein-p6-l1-mastering-the-extract-question","aqa-frankenstein-p6-l2-linking-extract-to-whole-text","aqa-frankenstein-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "pride-prejudice",
                name: "Pride & Prejudice",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["aqa-pride-prejudice-intro-l1-meet-the-world-of-pride-and-prejudice","aqa-pride-prejudice-intro-l2-the-full-story-of-pride-and-prejudice"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["aqa-pride-prejudice-p1-l1-the-bennets-bingley-and-first-impressions","aqa-pride-prejudice-p1-l2-wickham-darcy-and-misunderstandings","aqa-pride-prejudice-p1-l3-the-truth-revealed-and-two-proposals"] },
                    { tag: "Pillar 2", title: "Character Profiles", lectures: ["aqa-pride-prejudice-p2-l1-elizabeth-bennet-wit-and-independence","aqa-pride-prejudice-p2-l2-darcy-pride-and-transformation","aqa-pride-prejudice-p2-l3-jane-and-bingley-uncomplicated-love","aqa-pride-prejudice-p2-l4-wickham-lydia-and-moral-failure","aqa-pride-prejudice-p2-l5-mrs-bennet-collins-and-social-comedy"] },
                    { tag: "Pillar 3", title: "Big Ideas", lectures: ["aqa-pride-prejudice-p3-l1-marriage-and-financial-security","aqa-pride-prejudice-p3-l2-class-and-social-hierarchy","aqa-pride-prejudice-p3-l3-pride-and-prejudice-as-flaws","aqa-pride-prejudice-p3-l4-women-independence-and-limited-choices","aqa-pride-prejudice-p3-l5-reputation-and-social-judgement"] },
                    { tag: "Pillar 4", title: "The Novelist's Voice", lectures: ["aqa-pride-prejudice-p4-l1-free-indirect-discourse-and-narrative-voice","aqa-pride-prejudice-p4-l2-irony-wit-and-social-satire","aqa-pride-prejudice-p4-l3-dialogue-as-character-revelation","aqa-pride-prejudice-p4-l4-structure-and-the-comedy-of-manners"] },
                    { tag: "Pillar 5", title: "Victorian Values (AO3)", lectures: ["aqa-pride-prejudice-p5-l1-regency-society-marriage-and-women","aqa-pride-prejudice-p5-l2-entailment-inheritance-and-financial-reality","aqa-pride-prejudice-p5-l3-austens-purpose-and-the-novel-of-manners"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["aqa-pride-prejudice-p6-l1-mastering-the-extract-question","aqa-pride-prejudice-p6-l2-linking-extract-to-whole-text","aqa-pride-prejudice-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "sign-of-four",
                name: "The Sign of Four",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["aqa-sign-of-four-intro-l1-meet-the-world-of-the-sign-of-four","aqa-sign-of-four-intro-l2-the-full-story-of-the-sign-of-four"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["aqa-sign-of-four-p1-l1-holmes-watson-and-mary-morstan","aqa-sign-of-four-p1-l2-tonga-jonathan-small-and-the-treasure","aqa-sign-of-four-p1-l3-the-chase-the-capture-and-the-resolution"] },
                    { tag: "Pillar 2", title: "Character Profiles", lectures: ["aqa-sign-of-four-p2-l1-sherlock-holmes-genius-and-detachment","aqa-sign-of-four-p2-l2-watson-the-narrator-and-the-everyman","aqa-sign-of-four-p2-l3-mary-morstan-and-the-female-role","aqa-sign-of-four-p2-l4-jonathan-small-and-the-colonial-backstory","aqa-sign-of-four-p2-l5-athelney-jones-and-official-incompetence"] },
                    { tag: "Pillar 3", title: "Big Ideas", lectures: ["aqa-sign-of-four-p3-l1-justice-and-the-law","aqa-sign-of-four-p3-l2-empire-and-colonialism","aqa-sign-of-four-p3-l3-greed-and-its-consequences","aqa-sign-of-four-p3-l4-reason-vs-emotion","aqa-sign-of-four-p3-l5-friendship-and-loyalty"] },
                    { tag: "Pillar 4", title: "The Novelist's Voice", lectures: ["aqa-sign-of-four-p4-l1-first-person-narrative-and-watsons-voice","aqa-sign-of-four-p4-l2-gothic-and-sensation-elements","aqa-sign-of-four-p4-l3-holmes-deductive-language","aqa-sign-of-four-p4-l4-structure-mystery-and-revelation"] },
                    { tag: "Pillar 5", title: "Victorian Values (AO3)", lectures: ["aqa-sign-of-four-p5-l1-victorian-empire-india-and-the-raj","aqa-sign-of-four-p5-l2-victorian-attitudes-to-crime-and-class","aqa-sign-of-four-p5-l3-doyles-purpose-and-the-detective-genre"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["aqa-sign-of-four-p6-l1-mastering-the-extract-question","aqa-sign-of-four-p6-l2-linking-extract-to-whole-text","aqa-sign-of-four-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            }
        ]
    },

    /* ══════════════════════════════════════
       PAPER 2 · SECTION A — MODERN DRAMA
    ══════════════════════════════════════ */
    {
        tag: "Paper 2 · Section A",
        title: "Modern Drama",
        type: "multi",
        texts: [
            {
                id: "inspector-calls",
                name: "An Inspector Calls",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["aqa-inspector-calls-intro-l1-meet-the-world-of-an-inspector-calls","aqa-inspector-calls-intro-l2-the-full-story-of-an-inspector-calls"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["aqa-inspector-calls-p1-l1-the-birlings-the-engagement-and-the-inspector","aqa-inspector-calls-p1-l2-the-interrogations-and-each-persons-guilt","aqa-inspector-calls-p1-l3-the-twist-the-reactions-and-the-final-call"] },
                    { tag: "Pillar 2", title: "Meet the Characters", lectures: ["aqa-inspector-calls-p2-l1-inspector-goole-voice-of-social-conscience","aqa-inspector-calls-p2-l2-mr-birling-capitalism-and-arrogance","aqa-inspector-calls-p2-l3-mrs-birling-snobbery-and-denial","aqa-inspector-calls-p2-l4-sheila-and-eric-the-younger-generation","aqa-inspector-calls-p2-l5-eva-smith-the-invisible-victim"] },
                    { tag: "Pillar 3", title: "The Deep Stuff", lectures: ["aqa-inspector-calls-p3-l1-social-responsibility-and-community","aqa-inspector-calls-p3-l2-class-and-inequality","aqa-inspector-calls-p3-l3-generational-conflict-and-change","aqa-inspector-calls-p3-l4-guilt-and-collective-responsibility","aqa-inspector-calls-p3-l5-gender-and-the-treatment-of-women"] },
                    { tag: "Pillar 4", title: "The Writer's Tricks", lectures: ["aqa-inspector-calls-p4-l1-the-inspectors-powerful-language","aqa-inspector-calls-p4-l2-dramatic-irony-and-time","aqa-inspector-calls-p4-l3-symbolism-lighting-and-staging","aqa-inspector-calls-p4-l4-structure-unity-of-time-and-place"] },
                    { tag: "Pillar 5", title: "The Real World (AO3)", lectures: ["aqa-inspector-calls-p5-l1-1912-vs-1945-two-time-periods","aqa-inspector-calls-p5-l2-socialism-capitalism-and-the-welfare-state","aqa-inspector-calls-p5-l3-priestleys-purpose-and-political-message"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["aqa-inspector-calls-p6-l1-cracking-the-extract-question","aqa-inspector-calls-p6-l2-linking-extract-to-the-whole-play","aqa-inspector-calls-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "blood-brothers",
                name: "Blood Brothers",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["aqa-blood-brothers-intro-l1-meet-the-world-of-blood-brothers","aqa-blood-brothers-intro-l2-the-full-story-of-blood-brothers"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["aqa-blood-brothers-p1-l1-the-twins-separated-at-birth","aqa-blood-brothers-p1-l2-childhood-friendship-and-growing-apart","aqa-blood-brothers-p1-l3-the-final-confrontation-and-tragic-ending"] },
                    { tag: "Pillar 2", title: "Meet the Characters", lectures: ["aqa-blood-brothers-p2-l1-mickey-poverty-and-its-effects","aqa-blood-brothers-p2-l2-edward-privilege-and-ignorance","aqa-blood-brothers-p2-l3-mrs-johnstone-sacrifice-and-superstition","aqa-blood-brothers-p2-l4-mrs-lyons-manipulation-and-guilt","aqa-blood-brothers-p2-l5-linda-and-the-narrator-fate-and-commentary"] },
                    { tag: "Pillar 3", title: "The Deep Stuff", lectures: ["aqa-blood-brothers-p3-l1-class-and-social-inequality","aqa-blood-brothers-p3-l2-fate-and-superstition","aqa-blood-brothers-p3-l3-nature-vs-nurture","aqa-blood-brothers-p3-l4-friendship-and-loyalty","aqa-blood-brothers-p3-l5-the-impact-of-poverty-on-opportunity"] },
                    { tag: "Pillar 4", title: "The Writer's Tricks", lectures: ["aqa-blood-brothers-p4-l1-the-narrator-as-dramatic-device","aqa-blood-brothers-p4-l2-music-song-and-emotion","aqa-blood-brothers-p4-l3-language-and-class-dialect","aqa-blood-brothers-p4-l4-structure-and-the-mirror-effect"] },
                    { tag: "Pillar 5", title: "The Real World (AO3)", lectures: ["aqa-blood-brothers-p5-l1-thatcherism-unemployment-and-1980s-britain","aqa-blood-brothers-p5-l2-class-in-post-war-britain","aqa-blood-brothers-p5-l3-russells-purpose-and-the-musical-form"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["aqa-blood-brothers-p6-l1-cracking-the-extract-question","aqa-blood-brothers-p6-l2-linking-extract-to-the-whole-play","aqa-blood-brothers-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "dna",
                name: "DNA",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["aqa-dna-intro-l1-meet-the-world-of-dna","aqa-dna-intro-l2-the-full-story-of-dna"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["aqa-dna-p1-l1-the-death-the-cover-up-and-the-group","aqa-dna-p1-l2-the-plan-unravels-and-cathy-takes-control","aqa-dna-p1-l3-the-consequences-and-the-aftermath"] },
                    { tag: "Pillar 2", title: "Meet the Characters", lectures: ["aqa-dna-p2-l1-phil-passive-control-and-silent-power","aqa-dna-p2-l2-leah-anxiety-morality-and-being-ignored","aqa-dna-p2-l3-cathy-violence-and-moral-collapse","aqa-dna-p2-l4-adam-the-victim-and-what-he-represents","aqa-dna-p2-l5-the-group-mob-mentality-and-individual-guilt"] },
                    { tag: "Pillar 3", title: "The Deep Stuff", lectures: ["aqa-dna-p3-l1-morality-and-the-consequences-of-inaction","aqa-dna-p3-l2-mob-mentality-and-group-pressure","aqa-dna-p3-l3-leadership-and-power","aqa-dna-p3-l4-guilt-and-responsibility","aqa-dna-p3-l5-loss-of-innocence"] },
                    { tag: "Pillar 4", title: "The Writer's Tricks", lectures: ["aqa-dna-p4-l1-minimal-dialogue-and-silence-as-power","aqa-dna-p4-l2-leahs-monologues-anxiety-in-action","aqa-dna-p4-l3-four-act-structure-and-deterioration","aqa-dna-p4-l4-sparse-staging-and-dramatic-tension"] },
                    { tag: "Pillar 5", title: "The Real World (AO3)", lectures: ["aqa-dna-p5-l1-youth-culture-bullying-and-moral-panic","aqa-dna-p5-l2-social-breakdown-and-responsibility-in-modern-britain","aqa-dna-p5-l3-kellys-purpose-and-the-play-in-performance"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["aqa-dna-p6-l1-cracking-the-extract-question","aqa-dna-p6-l2-linking-extract-to-the-whole-play","aqa-dna-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "taste-of-honey",
                name: "A Taste of Honey",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["aqa-taste-of-honey-intro-l1-meet-the-world-of-a-taste-of-honey","aqa-taste-of-honey-intro-l2-the-full-story-of-a-taste-of-honey"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["aqa-taste-of-honey-p1-l1-jo-helen-and-the-flat","aqa-taste-of-honey-p1-l2-jimmie-peter-and-the-pregnancy","aqa-taste-of-honey-p1-l3-geoff-helens-return-and-the-ending"] },
                    { tag: "Pillar 2", title: "Meet the Characters", lectures: ["aqa-taste-of-honey-p2-l1-jo-resilience-and-vulnerability","aqa-taste-of-honey-p2-l2-helen-neglect-and-complexity","aqa-taste-of-honey-p2-l3-geoff-kindness-and-rejection","aqa-taste-of-honey-p2-l4-jimmie-and-peter-the-men-who-leave","aqa-taste-of-honey-p2-l5-the-unborn-child-and-what-it-represents"] },
                    { tag: "Pillar 3", title: "The Deep Stuff", lectures: ["aqa-taste-of-honey-p3-l1-class-poverty-and-northern-life","aqa-taste-of-honey-p3-l2-race-and-attitudes-to-difference","aqa-taste-of-honey-p3-l3-gender-and-the-role-of-women","aqa-taste-of-honey-p3-l4-motherhood-and-its-failures","aqa-taste-of-honey-p3-l5-loneliness-and-belonging"] },
                    { tag: "Pillar 4", title: "The Writer's Tricks", lectures: ["aqa-taste-of-honey-p4-l1-naturalistic-dialogue-and-voice","aqa-taste-of-honey-p4-l2-humour-as-a-coping-mechanism","aqa-taste-of-honey-p4-l3-staging-and-the-kitchen-sink-tradition","aqa-taste-of-honey-p4-l4-structure-and-the-two-act-form"] },
                    { tag: "Pillar 5", title: "The Real World (AO3)", lectures: ["aqa-taste-of-honey-p5-l1-1950s-britain-class-and-race","aqa-taste-of-honey-p5-l2-the-kitchen-sink-drama-movement","aqa-taste-of-honey-p5-l3-delaneys-age-and-her-groundbreaking-purpose"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["aqa-taste-of-honey-p6-l1-cracking-the-extract-question","aqa-taste-of-honey-p6-l2-linking-extract-to-the-whole-play","aqa-taste-of-honey-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "princess-hustler",
                name: "Princess & The Hustler",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["aqa-princess-hustler-intro-l1-meet-the-world-of-princess-and-the-hustler","aqa-princess-hustler-intro-l2-the-full-story-of-princess-and-the-hustler"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["aqa-princess-hustler-p1-l1-the-family-in-bristol-and-the-setting","aqa-princess-hustler-p1-l2-the-conflict-identity-and-the-march","aqa-princess-hustler-p1-l3-resolution-and-what-it-means"] },
                    { tag: "Pillar 2", title: "Meet the Characters", lectures: ["aqa-princess-hustler-p2-l1-princess-identity-and-belonging","aqa-princess-hustler-p2-l2-mavis-strength-and-sacrifice","aqa-princess-hustler-p2-l3-uncle-winston-and-the-hustle","aqa-princess-hustler-p2-l4-clifton-and-junior-different-responses-to-racism","aqa-princess-hustler-p2-l5-the-community-and-its-role"] },
                    { tag: "Pillar 3", title: "The Deep Stuff", lectures: ["aqa-princess-hustler-p3-l1-race-and-identity-in-1960s-britain","aqa-princess-hustler-p3-l2-family-and-resilience","aqa-princess-hustler-p3-l3-belonging-and-otherness","aqa-princess-hustler-p3-l4-activism-and-political-change","aqa-princess-hustler-p3-l5-gender-and-the-strength-of-women"] },
                    { tag: "Pillar 4", title: "The Writer's Tricks", lectures: ["aqa-princess-hustler-p4-l1-language-dialect-and-voice","aqa-princess-hustler-p4-l2-humour-as-resistance","aqa-princess-hustler-p4-l3-staging-and-the-bristol-setting","aqa-princess-hustler-p4-l4-structure-and-dramatic-tension"] },
                    { tag: "Pillar 5", title: "The Real World (AO3)", lectures: ["aqa-princess-hustler-p5-l1-the-bristol-bus-boycott-and-civil-rights","aqa-princess-hustler-p5-l2-windrush-generation-and-1960s-britain","aqa-princess-hustler-p5-l3-odimbas-purpose-and-modern-relevance"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["aqa-princess-hustler-p6-l1-cracking-the-extract-question","aqa-princess-hustler-p6-l2-linking-extract-to-the-whole-play","aqa-princess-hustler-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "leave-taking",
                name: "Leave Taking",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["aqa-leave-taking-intro-l1-meet-the-world-of-leave-taking","aqa-leave-taking-intro-l2-the-full-story-of-leave-taking"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["aqa-leave-taking-p1-l1-enid-del-viv-and-the-obeah-woman","aqa-leave-taking-p1-l2-identity-conflict-and-the-two-generations","aqa-leave-taking-p1-l3-the-resolution-and-letting-go"] },
                    { tag: "Pillar 2", title: "Meet the Characters", lectures: ["aqa-leave-taking-p2-l1-enid-sacrifice-and-the-immigrant-experience","aqa-leave-taking-p2-l2-del-caught-between-two-cultures","aqa-leave-taking-p2-l3-viv-ambition-and-assimilation","aqa-leave-taking-p2-l4-mai-the-obeah-woman-and-tradition","aqa-leave-taking-p2-l5-broderick-and-the-male-absence"] },
                    { tag: "Pillar 3", title: "The Deep Stuff", lectures: ["aqa-leave-taking-p3-l1-identity-and-belonging","aqa-leave-taking-p3-l2-the-immigrant-experience-and-sacrifice","aqa-leave-taking-p3-l3-generational-conflict-and-cultural-tension","aqa-leave-taking-p3-l4-tradition-vs-assimilation","aqa-leave-taking-p3-l5-motherhood-and-letting-go"] },
                    { tag: "Pillar 4", title: "The Writer's Tricks", lectures: ["aqa-leave-taking-p4-l1-caribbean-dialect-and-standard-english","aqa-leave-taking-p4-l2-the-obeah-ritual-and-symbolism","aqa-leave-taking-p4-l3-staging-and-the-domestic-setting","aqa-leave-taking-p4-l4-structure-time-and-memory"] },
                    { tag: "Pillar 5", title: "The Real World (AO3)", lectures: ["aqa-leave-taking-p5-l1-windrush-generation-and-caribbean-migration","aqa-leave-taking-p5-l2-black-british-identity-in-the-1980s","aqa-leave-taking-p5-l3-pinnocks-purpose-and-representation"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["aqa-leave-taking-p6-l1-cracking-the-extract-question","aqa-leave-taking-p6-l2-linking-extract-to-the-whole-play","aqa-leave-taking-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            }
        ]
    },

    /* ══════════════════════════════════════
       PAPER 2 · SECTION A — MODERN PROSE
    ══════════════════════════════════════ */
    {
        tag: "Paper 2 · Section A",
        title: "Modern Prose",
        type: "multi",
        texts: [
            {
                id: "lord-of-the-flies",
                name: "Lord of the Flies",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["aqa-lord-of-the-flies-intro-l1-meet-the-world","aqa-lord-of-the-flies-intro-l2-the-full-story"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["aqa-lord-of-the-flies-p1-l1-arrival-order-and-the-first-fire","aqa-lord-of-the-flies-p1-l2-hunters-fear-and-the-beast","aqa-lord-of-the-flies-p1-l3-simons-death-piggys-death-and-rescue"] },
                    { tag: "Pillar 2", title: "Meet the Characters", lectures: ["aqa-lord-of-the-flies-p2-l1-ralph-democracy-and-decline","aqa-lord-of-the-flies-p2-l2-jack-savagery-and-power","aqa-lord-of-the-flies-p2-l3-piggy-reason-and-vulnerability","aqa-lord-of-the-flies-p2-l4-simon-goodness-and-sacrifice","aqa-lord-of-the-flies-p2-l5-top-10-must-know-quotes"] },
                    { tag: "Pillar 3", title: "The Deep Stuff", lectures: ["aqa-lord-of-the-flies-p3-l1-civilisation-vs-savagery","aqa-lord-of-the-flies-p3-l2-power-and-leadership","aqa-lord-of-the-flies-p3-l3-fear-and-its-effects","aqa-lord-of-the-flies-p3-l4-loss-of-innocence","aqa-lord-of-the-flies-p3-l5-the-nature-of-evil"] },
                    { tag: "Pillar 4", title: "The Novelist's Voice", lectures: ["aqa-lord-of-the-flies-p4-l1-who-is-telling-the-story","aqa-lord-of-the-flies-p4-l2-sensory-word-choices","aqa-lord-of-the-flies-p4-l3-metaphors-and-symbolism","aqa-lord-of-the-flies-p4-l4-chapter-structure-tricks"] },
                    { tag: "Pillar 5", title: "The Real World (AO3)", lectures: ["aqa-lord-of-the-flies-p5-l1-post-war-pessimism-and-goldings-experience","aqa-lord-of-the-flies-p5-l2-cold-war-fears-and-british-empire","aqa-lord-of-the-flies-p5-l3-what-the-writer-was-attacking"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["aqa-lord-of-the-flies-p6-l1-structuring-the-memory-based-essay","aqa-lord-of-the-flies-p6-l2-planning-for-any-character-or-theme","aqa-lord-of-the-flies-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "animal-farm",
                name: "Animal Farm",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["aqa-animal-farm-intro-l1-meet-the-world-of-animal-farm","aqa-animal-farm-intro-l2-the-full-story-of-animal-farm"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["aqa-animal-farm-p1-l1-the-rebellion-and-the-seven-commandments","aqa-animal-farm-p1-l2-the-pigs-rise-to-power-and-squealer","aqa-animal-farm-p1-l3-the-corruption-completes-and-the-ending"] },
                    { tag: "Pillar 2", title: "Meet the Characters", lectures: ["aqa-animal-farm-p2-l1-napoleon-tyranny-and-power","aqa-animal-farm-p2-l2-snowball-idealism-and-exile","aqa-animal-farm-p2-l3-boxer-loyalty-and-exploitation","aqa-animal-farm-p2-l4-squealer-propaganda-and-language","aqa-animal-farm-p2-l5-old-major-benjamin-and-the-other-animals"] },
                    { tag: "Pillar 3", title: "The Deep Stuff", lectures: ["aqa-animal-farm-p3-l1-power-and-corruption","aqa-animal-farm-p3-l2-propaganda-and-the-manipulation-of-truth","aqa-animal-farm-p3-l3-equality-and-its-betrayal","aqa-animal-farm-p3-l4-revolution-and-what-it-becomes","aqa-animal-farm-p3-l5-the-corruption-of-ideals"] },
                    { tag: "Pillar 4", title: "The Novelist's Voice", lectures: ["aqa-animal-farm-p4-l1-allegory-and-how-it-works","aqa-animal-farm-p4-l2-the-commandments-and-their-distortion","aqa-animal-farm-p4-l3-simple-language-and-powerful-effect","aqa-animal-farm-p4-l4-chapter-structure-tricks"] },
                    { tag: "Pillar 5", title: "The Real World (AO3)", lectures: ["aqa-animal-farm-p5-l1-the-russian-revolution-and-stalinism","aqa-animal-farm-p5-l2-totalitarianism-and-orwells-warning","aqa-animal-farm-p5-l3-orwells-life-purpose-and-the-fable-form"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["aqa-animal-farm-p6-l1-mastering-the-memory-based-essay","aqa-animal-farm-p6-l2-planning-for-any-character-or-theme","aqa-animal-farm-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "anita-and-me",
                name: "Anita and Me",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["aqa-anita-and-me-intro-l1-meet-the-world-of-anita-and-me","aqa-anita-and-me-intro-l2-the-full-story-of-anita-and-me"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["aqa-anita-and-me-p1-l1-meena-and-tollington","aqa-anita-and-me-p1-l2-anitas-influence-and-the-summers-events","aqa-anita-and-me-p1-l3-growing-up-and-moving-on"] },
                    { tag: "Pillar 2", title: "Meet the Characters", lectures: ["aqa-anita-and-me-p2-l1-meena-identity-and-belonging","aqa-anita-and-me-p2-l2-anita-danger-and-fascination","aqa-anita-and-me-p2-l3-meenas-parents-and-the-sikh-community","aqa-anita-and-me-p2-l4-nanima-heritage-and-wisdom","aqa-anita-and-me-p2-l5-sam-and-the-white-working-class"] },
                    { tag: "Pillar 3", title: "The Deep Stuff", lectures: ["aqa-anita-and-me-p3-l1-identity-and-belonging","aqa-anita-and-me-p3-l2-race-and-racism-in-1970s-britain","aqa-anita-and-me-p3-l3-growing-up-and-loss-of-innocence","aqa-anita-and-me-p3-l4-friendship-and-betrayal","aqa-anita-and-me-p3-l5-growing-up-and-social-class"] },
                    { tag: "Pillar 4", title: "The Novelist's Voice", lectures: ["aqa-anita-and-me-p4-l1-humour-and-the-first-person-voice","aqa-anita-and-me-p4-l2-the-mixing-of-cultures-in-language","aqa-anita-and-me-p4-l3-nostalgia-and-the-adult-narrator","aqa-anita-and-me-p4-l4-setting-as-symbol"] },
                    { tag: "Pillar 5", title: "The Real World (AO3)", lectures: ["aqa-anita-and-me-p5-l1-1970s-britain-race-relations-and-the-nf","aqa-anita-and-me-p5-l2-south-asian-diaspora-and-second-generation-identity","aqa-anita-and-me-p5-l3-syals-purpose-and-autobiographical-elements"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["aqa-anita-and-me-p6-l1-mastering-the-memory-based-essay","aqa-anita-and-me-p6-l2-planning-for-any-character-or-theme","aqa-anita-and-me-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "pigeon-english",
                name: "Pigeon English",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["aqa-pigeon-english-intro-l1-meet-the-world-of-pigeon-english","aqa-pigeon-english-intro-l2-the-full-story-of-pigeon-english"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["aqa-pigeon-english-p1-l1-harri-arrives-the-estate-and-the-murder","aqa-pigeon-english-p1-l2-the-investigation-and-gang-pressure","aqa-pigeon-english-p1-l3-the-tragedy-and-its-meaning"] },
                    { tag: "Pillar 2", title: "Meet the Characters", lectures: ["aqa-pigeon-english-p2-l1-harri-innocence-and-the-outsider","aqa-pigeon-english-p2-l2-dean-friendship-and-peer-pressure","aqa-pigeon-english-p2-l3-harriet-family-and-protection","aqa-pigeon-english-p2-l4-the-dell-farm-crew-and-gang-culture","aqa-pigeon-english-p2-l5-the-pigeon-symbol-and-freedom"] },
                    { tag: "Pillar 3", title: "The Deep Stuff", lectures: ["aqa-pigeon-english-p3-l1-innocence-and-its-destruction","aqa-pigeon-english-p3-l2-gang-culture-and-urban-violence","aqa-pigeon-english-p3-l3-immigration-and-belonging","aqa-pigeon-english-p3-l4-poverty-and-inequality","aqa-pigeon-english-p3-l5-hope-vs-reality"] },
                    { tag: "Pillar 4", title: "The Novelist's Voice", lectures: ["aqa-pigeon-english-p4-l1-harris-naive-voice-and-its-effect","aqa-pigeon-english-p4-l2-humour-in-a-dark-setting","aqa-pigeon-english-p4-l3-the-pigeon-chapters-as-contrast","aqa-pigeon-english-p4-l4-structure-and-the-tragic-ending"] },
                    { tag: "Pillar 5", title: "The Real World (AO3)", lectures: ["aqa-pigeon-english-p5-l1-gang-culture-and-knife-crime-in-modern-britain","aqa-pigeon-english-p5-l2-immigration-and-the-ghanaian-community","aqa-pigeon-english-p5-l3-kelmans-purpose-and-the-real-case"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["aqa-pigeon-english-p6-l1-mastering-the-memory-based-essay","aqa-pigeon-english-p6-l2-planning-for-any-character-or-theme","aqa-pigeon-english-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "my-name-is-leon",
                name: "My Name is Leon",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["aqa-my-name-is-leon-intro-l1-meet-the-world-of-my-name-is-leon","aqa-my-name-is-leon-intro-l2-the-full-story-of-my-name-is-leon"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["aqa-my-name-is-leon-p1-l1-leon-jake-and-the-care-system","aqa-my-name-is-leon-p1-l2-silvias-home-cyril-and-belonging","aqa-my-name-is-leon-p1-l3-the-search-for-jake-and-the-ending"] },
                    { tag: "Pillar 2", title: "Meet the Characters", lectures: ["aqa-my-name-is-leon-p2-l1-leon-resilience-and-love","aqa-my-name-is-leon-p2-l2-jake-innocence-and-separation","aqa-my-name-is-leon-p2-l3-silvia-warmth-and-the-surrogate-family","aqa-my-name-is-leon-p2-l4-cyril-and-the-allotment-community","aqa-my-name-is-leon-p2-l5-carol-and-the-failures-of-the-system"] },
                    { tag: "Pillar 3", title: "The Deep Stuff", lectures: ["aqa-my-name-is-leon-p3-l1-family-and-belonging","aqa-my-name-is-leon-p3-l2-race-and-identity-in-1980s-britain","aqa-my-name-is-leon-p3-l3-the-care-system-and-its-failures","aqa-my-name-is-leon-p3-l4-community-and-support","aqa-my-name-is-leon-p3-l5-hope-and-determination"] },
                    { tag: "Pillar 4", title: "The Novelist's Voice", lectures: ["aqa-my-name-is-leon-p4-l1-leons-child-perspective-and-voice","aqa-my-name-is-leon-p4-l2-simple-language-and-emotional-power","aqa-my-name-is-leon-p4-l3-the-allotment-as-symbol","aqa-my-name-is-leon-p4-l4-structure-and-childlike-understanding"] },
                    { tag: "Pillar 5", title: "The Real World (AO3)", lectures: ["aqa-my-name-is-leon-p5-l1-1980s-britain-thatcherism-and-the-riots","aqa-my-name-is-leon-p5-l2-mixed-race-identity-and-transracial-adoption","aqa-my-name-is-leon-p5-l3-de-waals-purpose-and-social-commentary"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["aqa-my-name-is-leon-p6-l1-mastering-the-memory-based-essay","aqa-my-name-is-leon-p6-l2-planning-for-any-character-or-theme","aqa-my-name-is-leon-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "telling-tales",
                name: "Telling Tales",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["aqa-telling-tales-intro-l1-what-is-telling-tales","aqa-telling-tales-intro-l2-how-to-approach-the-anthology"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["aqa-telling-tales-p1-l1-stories-one-to-three-summaries","aqa-telling-tales-p1-l2-stories-four-to-six-summaries","aqa-telling-tales-p1-l3-stories-seven-and-eight-summaries"] },
                    { tag: "Pillar 2", title: "Meet the Characters", lectures: ["aqa-telling-tales-p2-l1-main-characters-across-stories","aqa-telling-tales-p2-l2-outsiders-and-insiders","aqa-telling-tales-p2-l3-families-and-relationships","aqa-telling-tales-p2-l4-victims-and-survivors","aqa-telling-tales-p2-l5-top-10-must-know-quotes"] },
                    { tag: "Pillar 3", title: "The Deep Stuff", lectures: ["aqa-telling-tales-p3-l1-identity-and-belonging","aqa-telling-tales-p3-l2-family-relationships","aqa-telling-tales-p3-l3-social-class-and-inequality","aqa-telling-tales-p3-l4-memory-and-the-past","aqa-telling-tales-p3-l5-common-themes-across-stories"] },
                    { tag: "Pillar 4", title: "The Novelist's Voice", lectures: ["aqa-telling-tales-p4-l1-narrative-perspectives-across-stories","aqa-telling-tales-p4-l2-sensory-and-descriptive-language","aqa-telling-tales-p4-l3-metaphors-and-imagery-patterns","aqa-telling-tales-p4-l4-structure-and-short-story-form"] },
                    { tag: "Pillar 5", title: "The Real World (AO3)", lectures: ["aqa-telling-tales-p5-l1-different-time-periods-and-contexts","aqa-telling-tales-p5-l2-cultural-backgrounds-represented","aqa-telling-tales-p5-l3-what-the-writers-were-exploring"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["aqa-telling-tales-p6-l1-structuring-the-memory-based-essay","aqa-telling-tales-p6-l2-planning-for-any-character-or-theme","aqa-telling-tales-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            }
        ]
    },

    /* ══════════════════════════════════════
       PAPER 2 · SECTION B — LOVE & RELATIONSHIPS
    ══════════════════════════════════════ */
    {
        tag: "Paper 2 · Section B",
        title: "Love and Relationships",
        type: "single",
        pillars: [
            {
                tag: "Pillar 1", title: "First Impressions (Grade 3–5)",
                lectures: [
                    { slug: "aqa-lr-p1-l1-when-we-two-parted",       title: "When We Two Parted" },
                    { slug: "aqa-lr-p1-l2-loves-philosophy",          title: "Love's Philosophy" },
                    { slug: "aqa-lr-p1-l3-porphyrias-lover",          title: "Porphyria's Lover" },
                    { slug: "aqa-lr-p1-l4-sonnet-29",                 title: "Sonnet 29" },
                    { slug: "aqa-lr-p1-l5-neutral-tones",             title: "Neutral Tones" },
                    { slug: "aqa-lr-p1-l6-letters-from-yorkshire",    title: "Letters from Yorkshire" },
                    { slug: "aqa-lr-p1-l7-the-farmers-bride",         title: "The Farmer's Bride" },
                    { slug: "aqa-lr-p1-l8-walking-away",              title: "Walking Away" },
                    { slug: "aqa-lr-p1-l9-eden-rock",                 title: "Eden Rock" },
                    { slug: "aqa-lr-p1-l10-follower",                 title: "Follower" },
                    { slug: "aqa-lr-p1-l11-mother-any-distance",      title: "Mother, Any Distance" },
                    { slug: "aqa-lr-p1-l12-before-you-were-mine",     title: "Before You Were Mine" },
                    { slug: "aqa-lr-p1-l13-winter-swans",             title: "Winter Swans" },
                    { slug: "aqa-lr-p1-l14-singh-song",               title: "Singh Song!" },
                    { slug: "aqa-lr-p1-l15-climbing-my-grandfather",  title: "Climbing My Grandfather" }
                ]
            },
            {
                tag: "Pillar 2", title: "Language & Imagery (Grade 6–7)",
                lectures: [
                    { slug: "aqa-lr-p2-l1-when-we-two-parted-language",      title: "When We Two Parted — Language" },
                    { slug: "aqa-lr-p2-l2-loves-philosophy-language",         title: "Love's Philosophy — Language" },
                    { slug: "aqa-lr-p2-l3-porphyrias-lover-language",         title: "Porphyria's Lover — Language" },
                    { slug: "aqa-lr-p2-l4-sonnet-29-language",                title: "Sonnet 29 — Language" },
                    { slug: "aqa-lr-p2-l5-neutral-tones-language",            title: "Neutral Tones — Language" },
                    { slug: "aqa-lr-p2-l6-letters-from-yorkshire-language",   title: "Letters from Yorkshire — Language" },
                    { slug: "aqa-lr-p2-l7-the-farmers-bride-language",        title: "The Farmer's Bride — Language" },
                    { slug: "aqa-lr-p2-l8-walking-away-language",             title: "Walking Away — Language" },
                    { slug: "aqa-lr-p2-l9-eden-rock-language",                title: "Eden Rock — Language" },
                    { slug: "aqa-lr-p2-l10-follower-language",                title: "Follower — Language" },
                    { slug: "aqa-lr-p2-l11-mother-any-distance-language",     title: "Mother, Any Distance — Language" },
                    { slug: "aqa-lr-p2-l12-before-you-were-mine-language",    title: "Before You Were Mine — Language" },
                    { slug: "aqa-lr-p2-l13-winter-swans-language",            title: "Winter Swans — Language" },
                    { slug: "aqa-lr-p2-l14-singh-song-language",              title: "Singh Song! — Language" },
                    { slug: "aqa-lr-p2-l15-climbing-my-grandfather-language", title: "Climbing My Grandfather — Language" }
                ]
            },
            {
                tag: "Pillar 3", title: "Form & Structure (Grade 8–9)",
                lectures: [
                    { slug: "aqa-lr-p3-l1-beats-rhythm-and-metre",                    title: "Beats, Rhythm and Metre" },
                    { slug: "aqa-lr-p3-l2-why-line-breaks-and-stanza-breaks-matter",   title: "Why Line Breaks and Stanza Breaks Matter" },
                    { slug: "aqa-lr-p3-l3-traditional-vs-free-verse",                  title: "Traditional vs Free Verse" },
                    { slug: "aqa-lr-p3-l4-visual-layout-on-the-page",                  title: "Visual Layout on the Page" },
                    { slug: "aqa-lr-p3-l5-the-volta-the-turning-point",                title: "The Volta — The Turning Point" },
                    { slug: "aqa-lr-p3-l6-circular-structure-and-repetition",          title: "Circular Structure and Repetition" },
                    { slug: "aqa-lr-p3-l7-how-a-poem-sounds-aloud",                    title: "How a Poem Sounds Aloud" }
                ]
            },
            {
                tag: "Pillar 4", title: "Context & Intent (AO3)",
                lectures: [
                    { slug: "aqa-lr-p4-l1-the-poets-life-and-purpose",        title: "The Poet's Life and Purpose" },
                    { slug: "aqa-lr-p4-l2-romantic-love-vs-possessive-love",  title: "Romantic Love vs Possessive Love" },
                    { slug: "aqa-lr-p4-l3-parent-and-child-relationships",    title: "Parent and Child Relationships" },
                    { slug: "aqa-lr-p4-l4-loss-grief-and-absence",            title: "Loss, Grief and Absence" },
                    { slug: "aqa-lr-p4-l5-identity-within-relationships",     title: "Identity Within Relationships" },
                    { slug: "aqa-lr-p4-l6-time-memory-and-change",            title: "Time, Memory and Change" },
                    { slug: "aqa-lr-p4-l7-gender-power-and-control",          title: "Gender, Power and Control" },
                    { slug: "aqa-lr-p4-l8-the-big-picture-cluster-summary",   title: "The Big Picture — Cluster Summary" }
                ]
            },
            {
                tag: "Pillar 5", title: "Comparison Skills",
                lectures: [
                    { slug: "aqa-lr-p5-l1-finding-thematic-links-between-poems",   title: "Finding Thematic Links Between Poems" },
                    { slug: "aqa-lr-p5-l2-comparing-language-choices-across-poems", title: "Comparing Language Choices Across Poems" },
                    { slug: "aqa-lr-p5-l3-comparing-context-and-poets-purpose",     title: "Comparing Context and Poet's Purpose" }
                ]
            },
            {
                tag: "Pillar 6", title: "Exam Mastery",
                lectures: [
                    { slug: "aqa-lr-p6-l1-the-perfect-essay-plan-30-marks",  title: "The Perfect Essay Plan — 30 Marks" },
                    { slug: "aqa-lr-p6-l2-grade-9-vs-grade-5-the-showdown",  title: "Grade 9 vs Grade 5 — The Showdown" }
                ]
            }
        ]
    },

    /* ══════════════════════════════════════
       PAPER 2 · SECTION B — POWER & CONFLICT
    ══════════════════════════════════════ */
    {
        tag: "Paper 2 · Section B",
        title: "Power and Conflict",
        type: "single",
        pillars: [
            {
                tag: "Pillar 1", title: "First Impressions (Grade 3–5)",
                lectures: [
                    { slug: "aqa-pc-p1-l1-ozymandias",                       title: "Ozymandias" },
                    { slug: "aqa-pc-p1-l2-london",                            title: "London" },
                    { slug: "aqa-pc-p1-l3-extract-from-the-prelude",          title: "Extract from The Prelude" },
                    { slug: "aqa-pc-p1-l4-my-last-duchess",                   title: "My Last Duchess" },
                    { slug: "aqa-pc-p1-l5-the-charge-of-the-light-brigade",   title: "The Charge of the Light Brigade" },
                    { slug: "aqa-pc-p1-l6-exposure",                          title: "Exposure" },
                    { slug: "aqa-pc-p1-l7-storm-on-the-island",               title: "Storm on the Island" },
                    { slug: "aqa-pc-p1-l8-bayonet-charge",                    title: "Bayonet Charge" },
                    { slug: "aqa-pc-p1-l9-remains",                           title: "Remains" },
                    { slug: "aqa-pc-p1-l10-poppies",                          title: "Poppies" },
                    { slug: "aqa-pc-p1-l11-war-photographer",                 title: "War Photographer" },
                    { slug: "aqa-pc-p1-l12-tissue",                           title: "Tissue" },
                    { slug: "aqa-pc-p1-l13-the-emigree",                      title: "The Émigrée" },
                    { slug: "aqa-pc-p1-l14-checking-out-me-history",          title: "Checking Out Me History" },
                    { slug: "aqa-pc-p1-l15-kamikaze",                         title: "Kamikaze" }
                ]
            },
            {
                tag: "Pillar 2", title: "Language & Imagery (Grade 6–7)",
                lectures: [
                    { slug: "aqa-pc-p2-l1-ozymandias-language",                     title: "Ozymandias — Language" },
                    { slug: "aqa-pc-p2-l2-london-language",                          title: "London — Language" },
                    { slug: "aqa-pc-p2-l3-extract-from-the-prelude-language",        title: "Extract from The Prelude — Language" },
                    { slug: "aqa-pc-p2-l4-my-last-duchess-language",                 title: "My Last Duchess — Language" },
                    { slug: "aqa-pc-p2-l5-the-charge-of-the-light-brigade-language", title: "The Charge of the Light Brigade — Language" },
                    { slug: "aqa-pc-p2-l6-exposure-language",                        title: "Exposure — Language" },
                    { slug: "aqa-pc-p2-l7-storm-on-the-island-language",             title: "Storm on the Island — Language" },
                    { slug: "aqa-pc-p2-l8-bayonet-charge-language",                  title: "Bayonet Charge — Language" },
                    { slug: "aqa-pc-p2-l9-remains-language",                         title: "Remains — Language" },
                    { slug: "aqa-pc-p2-l10-poppies-language",                        title: "Poppies — Language" },
                    { slug: "aqa-pc-p2-l11-war-photographer-language",               title: "War Photographer — Language" },
                    { slug: "aqa-pc-p2-l12-tissue-language",                         title: "Tissue — Language" },
                    { slug: "aqa-pc-p2-l13-the-emigree-language",                    title: "The Émigrée — Language" },
                    { slug: "aqa-pc-p2-l14-checking-out-me-history-language",        title: "Checking Out Me History — Language" },
                    { slug: "aqa-pc-p2-l15-kamikaze-language",                       title: "Kamikaze — Language" }
                ]
            },
            {
                tag: "Pillar 3", title: "Form & Structure (Grade 8–9)",
                lectures: [
                    { slug: "aqa-pc-p3-l1-beats-rhythm-and-metre",                   title: "Beats, Rhythm and Metre" },
                    { slug: "aqa-pc-p3-l2-why-line-breaks-and-stanza-breaks-matter",  title: "Why Line Breaks and Stanza Breaks Matter" },
                    { slug: "aqa-pc-p3-l3-traditional-vs-free-verse",                 title: "Traditional vs Free Verse" },
                    { slug: "aqa-pc-p3-l4-visual-layout-on-the-page",                 title: "Visual Layout on the Page" },
                    { slug: "aqa-pc-p3-l5-the-volta-the-turning-point",               title: "The Volta — The Turning Point" },
                    { slug: "aqa-pc-p3-l6-circular-structure-and-repetition",         title: "Circular Structure and Repetition" },
                    { slug: "aqa-pc-p3-l7-how-a-poem-sounds-aloud",                   title: "How a Poem Sounds Aloud" }
                ]
            },
            {
                tag: "Pillar 4", title: "Context & Intent (AO3)",
                lectures: [
                    { slug: "aqa-pc-p4-l1-the-poets-life-and-purpose",       title: "The Poet's Life and Purpose" },
                    { slug: "aqa-pc-p4-l2-war-politics-and-the-state",       title: "War, Politics and the State" },
                    { slug: "aqa-pc-p4-l3-rebellion-resistance-and-power",   title: "Rebellion, Resistance and Power" },
                    { slug: "aqa-pc-p4-l4-nature-vs-human-destruction",      title: "Nature vs Human Destruction" },
                    { slug: "aqa-pc-p4-l5-identity-belonging-and-exile",     title: "Identity, Belonging and Exile" },
                    { slug: "aqa-pc-p4-l6-time-memory-and-loss",             title: "Time, Memory and Loss" },
                    { slug: "aqa-pc-p4-l7-hidden-meanings-and-political-subtext", title: "Hidden Meanings and Political Subtext" },
                    { slug: "aqa-pc-p4-l8-the-big-picture-cluster-summary",  title: "The Big Picture — Cluster Summary" }
                ]
            },
            {
                tag: "Pillar 5", title: "Comparison Skills",
                lectures: [
                    { slug: "aqa-pc-p5-l1-finding-thematic-links-between-poems",    title: "Finding Thematic Links Between Poems" },
                    { slug: "aqa-pc-p5-l2-comparing-language-choices-across-poems",  title: "Comparing Language Choices Across Poems" },
                    { slug: "aqa-pc-p5-l3-comparing-context-and-poets-purpose",      title: "Comparing Context and Poet's Purpose" }
                ]
            },
            {
                tag: "Pillar 6", title: "Exam Mastery",
                lectures: [
                    { slug: "aqa-pc-p6-l1-the-perfect-essay-plan-30-marks", title: "The Perfect Essay Plan — 30 Marks" },
                    { slug: "aqa-pc-p6-l2-grade-9-vs-grade-5-the-showdown", title: "Grade 9 vs Grade 5 — The Showdown" }
                ]
            }
        ]
    },

    /* ══════════════════════════════════════
       PAPER 2 · SECTION B — WORLDS & LIVES
    ══════════════════════════════════════ */
    {
        tag: "Paper 2 · Section B",
        title: "Worlds and Lives",
        type: "single",
        pillars: [
            {
                tag: "Pillar 1", title: "First Impressions (Grade 3–5)",
                lectures: [
                    { slug: "aqa-wl-p1-l1-lines-written-in-early-spring",                    title: "Lines Written in Early Spring" },
                    { slug: "aqa-wl-p1-l2-england-in-1819",                                  title: "England in 1819" },
                    { slug: "aqa-wl-p1-l3-shall-earth-no-more-inspire-thee",                 title: "Shall Earth no More Inspire Thee" },
                    { slug: "aqa-wl-p1-l4-in-a-london-drawingroom",                          title: "In a London Drawingroom" },
                    { slug: "aqa-wl-p1-l5-on-an-afternoon-train-from-purley-to-victoria",    title: "On an Afternoon Train from Purley to Victoria" },
                    { slug: "aqa-wl-p1-l6-name-journeys",                                    title: "Name Journeys" },
                    { slug: "aqa-wl-p1-l7-pot",                                              title: "Pot" },
                    { slug: "aqa-wl-p1-l8-a-wider-view",                                     title: "A Wider View" },
                    { slug: "aqa-wl-p1-l9-homing",                                           title: "Homing" },
                    { slug: "aqa-wl-p1-l10-a-century-later",                                 title: "A Century Later" },
                    { slug: "aqa-wl-p1-l11-the-jewellery-maker",                             title: "The Jewellery Maker" },
                    { slug: "aqa-wl-p1-l12-with-birds-youre-never-lonely",                   title: "With Birds You're Never Lonely" },
                    { slug: "aqa-wl-p1-l13-a-portable-paradise",                             title: "A Portable Paradise" },
                    { slug: "aqa-wl-p1-l14-like-an-heiress",                                 title: "Like an Heiress" },
                    { slug: "aqa-wl-p1-l15-thirteen",                                        title: "Thirteen" }
                ]
            },
            {
                tag: "Pillar 2", title: "Language & Imagery (Grade 6–7)",
                lectures: [
                    { slug: "aqa-wl-p2-l1-lines-written-in-early-spring-language",                 title: "Lines Written in Early Spring — Language" },
                    { slug: "aqa-wl-p2-l2-england-in-1819-language",                               title: "England in 1819 — Language" },
                    { slug: "aqa-wl-p2-l3-shall-earth-no-more-inspire-thee-language",              title: "Shall Earth no More Inspire Thee — Language" },
                    { slug: "aqa-wl-p2-l4-in-a-london-drawingroom-language",                       title: "In a London Drawingroom — Language" },
                    { slug: "aqa-wl-p2-l5-on-an-afternoon-train-from-purley-to-victoria-language", title: "On an Afternoon Train — Language" },
                    { slug: "aqa-wl-p2-l6-name-journeys-language",                                 title: "Name Journeys — Language" },
                    { slug: "aqa-wl-p2-l7-pot-language",                                           title: "Pot — Language" },
                    { slug: "aqa-wl-p2-l8-a-wider-view-language",                                  title: "A Wider View — Language" },
                    { slug: "aqa-wl-p2-l9-homing-language",                                        title: "Homing — Language" },
                    { slug: "aqa-wl-p2-l10-a-century-later-language",                              title: "A Century Later — Language" },
                    { slug: "aqa-wl-p2-l11-the-jewellery-maker-language",                          title: "The Jewellery Maker — Language" },
                    { slug: "aqa-wl-p2-l12-with-birds-youre-never-lonely-language",                title: "With Birds You're Never Lonely — Language" },
                    { slug: "aqa-wl-p2-l13-a-portable-paradise-language",                          title: "A Portable Paradise — Language" },
                    { slug: "aqa-wl-p2-l14-like-an-heiress-language",                              title: "Like an Heiress — Language" },
                    { slug: "aqa-wl-p2-l15-thirteen-language",                                     title: "Thirteen — Language" }
                ]
            },
            {
                tag: "Pillar 3", title: "Form & Structure (Grade 8–9)",
                lectures: [
                    { slug: "aqa-wl-p3-l1-beats-rhythm-and-metre",                   title: "Beats, Rhythm and Metre" },
                    { slug: "aqa-wl-p3-l2-why-line-breaks-and-stanza-breaks-matter",  title: "Why Line Breaks and Stanza Breaks Matter" },
                    { slug: "aqa-wl-p3-l3-traditional-vs-free-verse",                 title: "Traditional vs Free Verse" },
                    { slug: "aqa-wl-p3-l4-visual-layout-on-the-page",                 title: "Visual Layout on the Page" },
                    { slug: "aqa-wl-p3-l5-the-volta-the-turning-point",               title: "The Volta — The Turning Point" },
                    { slug: "aqa-wl-p3-l6-circular-structure-and-repetition",         title: "Circular Structure and Repetition" },
                    { slug: "aqa-wl-p3-l7-how-a-poem-sounds-aloud",                   title: "How a Poem Sounds Aloud" }
                ]
            },
            {
                tag: "Pillar 4", title: "Context & Intent (AO3)",
                lectures: [
                    { slug: "aqa-wl-p4-l1-the-poets-life-and-purpose",          title: "The Poet's Life and Purpose" },
                    { slug: "aqa-wl-p4-l2-nature-and-the-environment",          title: "Nature and the Environment" },
                    { slug: "aqa-wl-p4-l3-migration-displacement-and-home",     title: "Migration, Displacement and Home" },
                    { slug: "aqa-wl-p4-l4-identity-culture-and-belonging",      title: "Identity, Culture and Belonging" },
                    { slug: "aqa-wl-p4-l5-politics-protest-and-injustice",      title: "Politics, Protest and Injustice" },
                    { slug: "aqa-wl-p4-l6-time-ageing-and-change",              title: "Time, Ageing and Change" },
                    { slug: "aqa-wl-p4-l7-community-connection-and-isolation",  title: "Community, Connection and Isolation" },
                    { slug: "aqa-wl-p4-l8-the-big-picture-cluster-summary",     title: "The Big Picture — Cluster Summary" }
                ]
            },
            {
                tag: "Pillar 5", title: "Comparison Skills",
                lectures: [
                    { slug: "aqa-wl-p5-l1-finding-thematic-links-between-poems",    title: "Finding Thematic Links Between Poems" },
                    { slug: "aqa-wl-p5-l2-comparing-language-choices-across-poems",  title: "Comparing Language Choices Across Poems" },
                    { slug: "aqa-wl-p5-l3-comparing-context-and-poets-purpose",      title: "Comparing Context and Poet's Purpose" }
                ]
            },
            {
                tag: "Pillar 6", title: "Exam Mastery",
                lectures: [
                    { slug: "aqa-wl-p6-l1-the-perfect-essay-plan-30-marks", title: "The Perfect Essay Plan — 30 Marks" },
                    { slug: "aqa-wl-p6-l2-grade-9-vs-grade-5-the-showdown", title: "Grade 9 vs Grade 5 — The Showdown" }
                ]
            }
        ]
    },

    /* ══════════════════════════════════════
       PAPER 2 · SECTION C — UNSEEN POETRY
    ══════════════════════════════════════ */
    {
        tag: "Paper 2 · Section C",
        title: "Unseen Poetry",
        type: "single",
        pillars: [
            {
                tag: "Pillar 1", title: "First Impressions",
                lectures: [
                    { slug: "aqa-unseen-l1-how-to-read-a-poem-for-the-first-time", title: "How to Read a Poem for the First Time" },
                    { slug: "aqa-unseen-l2-decoding-the-title-and-opening-line",   title: "Decoding the Title and Opening Line" },
                    { slug: "aqa-unseen-l3-identifying-who-what-where-when-why",   title: "Identifying Who, What, Where, When, Why" }
                ]
            },
            {
                tag: "Pillar 2", title: "Language & Methods",
                lectures: [
                    { slug: "aqa-unseen-l4-spotting-techniques-under-exam-pressure",   title: "Spotting Techniques Under Exam Pressure" },
                    { slug: "aqa-unseen-l5-analysing-word-choices-and-connotations",   title: "Analysing Word Choices and Connotations" },
                    { slug: "aqa-unseen-l6-unpacking-imagery-without-context",         title: "Unpacking Imagery Without Context" }
                ]
            },
            {
                tag: "Pillar 3", title: "Structure & Form",
                lectures: [
                    { slug: "aqa-unseen-l7-noticing-shifts-in-tone-and-pacing",              title: "Noticing Shifts in Tone and Pacing" },
                    { slug: "aqa-unseen-l8-structural-analysis-stanzas-and-line-breaks",     title: "Structural Analysis — Stanzas and Line Breaks" }
                ]
            },
            {
                tag: "Pillar 4", title: "Exam Mastery",
                lectures: [
                    { slug: "aqa-unseen-l9-the-24-mark-single-poem-strategy",     title: "The 24-Mark Single Poem Strategy" },
                    { slug: "aqa-unseen-l10-the-8-mark-comparison-strategy",      title: "The 8-Mark Comparison Strategy" },
                    { slug: "aqa-unseen-l11-model-answer-walkthrough-a",          title: "Model Answer Walkthrough A" },
                    { slug: "aqa-unseen-l12-model-answer-walkthrough-b",          title: "Model Answer Walkthrough B" },
                    { slug: "aqa-unseen-l13-common-pitfalls-in-unseen-analysis",  title: "Common Pitfalls in Unseen Analysis" },
                    { slug: "aqa-unseen-l14-grade-gallery-unseen-comparison",     title: "Grade Gallery — Unseen Comparison" },
                    { slug: "aqa-unseen-l15-final-timed-practice-and-confidence", title: "Final Timed Practice and Confidence" }
                ]
            }
        ]
    }
];
