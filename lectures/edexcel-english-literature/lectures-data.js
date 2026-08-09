/* ══════════════════════════════════════════
   Montura Learn — Edexcel English Literature
   Single source of truth for the full course structure.
   Loaded by both lectures.html and every Pillar Decks page —
   nothing below should ever be hand-copied elsewhere again.

   Built from the actual lecture files present in this repo. Foundation
   phases (p0/cr/tk) and the first 10 ew- lectures reuse AQA's exact
   titles since the slugs are identical/shared content. The 8 newer
   ew-l11..l18 lectures don't have an AQA equivalent to copy from, so
   their titles are left to auto-derive via slugToTitle() at render time
   — still correct, just less hand-polished wording until reviewed.

   Paper/section structure verified against the real Edexcel specification
   (1ET0), not assumed from AQA's layout — confirm against your own
   source material if anything looks off, and check pillar-title wording
   (e.g. "Meet the Characters" vs "Character Profiles") since AQA itself
   isn't fully consistent on this, so this is a best-effort default.
══════════════════════════════════════════ */
function slugToTitle(slug) {
    return slug
        .replace(/^edx-[a-z-]+-(?:intro-|p\d+-)?l\d+-/, '')
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

    {
        tag: "Paper 1 · Section A",
        title: "Shakespeare",
        type: "multi",
        texts: [
            {
                id: "macbeth",
                name: "Macbeth",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["edx-macbeth-intro-l1-meet-the-world-of-macbeth","edx-macbeth-intro-l2-the-full-story-of-macbeth"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["edx-macbeth-p1-l1-the-opening-scotland-and-the-witches","edx-macbeth-p1-l2-the-murder-of-duncan-and-the-spiral-begins","edx-macbeth-p1-l3-the-collapse-banquo-macduff-and-the-ending"] },
                    { tag: "Pillar 2", title: "Meet the Characters", lectures: ["edx-macbeth-p2-l1-macbeth-hero-to-tyrant","edx-macbeth-p2-l2-lady-macbeth-ambition-and-guilt","edx-macbeth-p2-l3-the-witches-and-their-power","edx-macbeth-p2-l4-banquo-the-foil-to-macbeth","edx-macbeth-p2-l5-macduff-malcolm-and-the-restoration-of-order"] },
                    { tag: "Pillar 3", title: "The Deep Stuff", lectures: ["edx-macbeth-p3-l1-ambition-and-its-consequences","edx-macbeth-p3-l2-power-and-corruption","edx-macbeth-p3-l3-guilt-and-the-human-conscience","edx-macbeth-p3-l4-appearance-vs-reality","edx-macbeth-p3-l5-gender-and-masculinity","edx-macbeth-p3-l6-the-supernatural-and-fate"] },
                    { tag: "Pillar 4", title: "The Writer's Tricks", lectures: ["edx-macbeth-p4-l1-the-language-of-darkness-and-blood","edx-macbeth-p4-l2-soliloquies-and-what-they-reveal","edx-macbeth-p4-l3-the-witches-language-and-prophecy","edx-macbeth-p4-l4-structure-and-stagecraft"] },
                    { tag: "Pillar 5", title: "The Real World (AO3)", lectures: ["edx-macbeth-p5-l1-jacobean-england-and-king-james","edx-macbeth-p5-l2-witchcraft-and-the-supernatural-in-1606","edx-macbeth-p5-l3-divine-right-of-kings-and-gender-roles"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["edx-macbeth-p6-l1-cracking-the-extract-question","edx-macbeth-p6-l2-linking-extract-to-the-whole-play","edx-macbeth-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "tempest",
                name: "The Tempest",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["edx-tempest-intro-l1-meet-the-world-of-the-tempest","edx-tempest-intro-l2-the-full-story-of-the-tempest"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["edx-tempest-p1-l1-the-shipwreck-and-prosperos-island","edx-tempest-p1-l2-the-plots-love-and-conspiracy","edx-tempest-p1-l3-forgiveness-and-the-return-to-milan"] },
                    { tag: "Pillar 2", title: "Meet the Characters", lectures: ["edx-tempest-p2-l1-prospero-power-and-forgiveness","edx-tempest-p2-l2-miranda-innocence-and-identity","edx-tempest-p2-l3-caliban-the-dispossessed-and-the-colonial","edx-tempest-p2-l4-ariel-freedom-and-servitude","edx-tempest-p2-l5-antonio-alonso-and-the-corrupt-nobility"] },
                    { tag: "Pillar 3", title: "The Deep Stuff", lectures: ["edx-tempest-p3-l1-power-and-control","edx-tempest-p3-l2-colonialism-and-otherness","edx-tempest-p3-l3-freedom-and-servitude","edx-tempest-p3-l4-forgiveness-and-justice","edx-tempest-p3-l5-magic-and-the-natural-world"] },
                    { tag: "Pillar 4", title: "The Writer's Tricks", lectures: ["edx-tempest-p4-l1-prosperos-language-of-command","edx-tempest-p4-l2-caliban-and-the-beauty-of-his-language","edx-tempest-p4-l3-masque-and-theatrical-spectacle","edx-tempest-p4-l4-structure-island-as-a-controlled-space"] },
                    { tag: "Pillar 5", title: "The Real World (AO3)", lectures: ["edx-tempest-p5-l1-jacobean-exploration-and-colonialism","edx-tempest-p5-l2-renaissance-ideas-of-power-and-magic","edx-tempest-p5-l3-shakespeares-final-play-and-his-purpose"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["edx-tempest-p6-l1-cracking-the-extract-question","edx-tempest-p6-l2-linking-extract-to-the-whole-play","edx-tempest-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "romeo",
                name: "Romeo & Juliet",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["edx-romeo-intro-l1-meet-the-world-of-romeo-and-juliet","edx-romeo-intro-l2-the-full-story-of-romeo-and-juliet"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["edx-romeo-p1-l1-the-feud-and-the-first-meeting","edx-romeo-p1-l2-the-marriage-tybalt-and-the-turning-point","edx-romeo-p1-l3-the-plan-the-tomb-and-the-tragic-ending"] },
                    { tag: "Pillar 2", title: "Meet the Characters", lectures: ["edx-romeo-p2-l1-romeo-impulsive-lover-and-tragic-hero","edx-romeo-p2-l2-juliet-strength-and-sacrifice","edx-romeo-p2-l3-tybalt-mercutio-and-the-violence-of-verona","edx-romeo-p2-l4-the-friar-and-the-nurse-adult-failures","edx-romeo-p2-l5-lord-and-lady-capulet-parental-power"] },
                    { tag: "Pillar 3", title: "The Deep Stuff", lectures: ["edx-romeo-p3-l1-love-and-its-many-forms","edx-romeo-p3-l2-fate-and-free-will","edx-romeo-p3-l3-conflict-and-violence","edx-romeo-p3-l4-family-honour-and-obedience","edx-romeo-p3-l5-youth-vs-age-and-power"] },
                    { tag: "Pillar 4", title: "The Writer's Tricks", lectures: ["edx-romeo-p4-l1-light-and-dark-imagery","edx-romeo-p4-l2-the-use-of-time-and-speed","edx-romeo-p4-l3-dramatic-irony-and-the-prologue","edx-romeo-p4-l4-verse-prose-and-the-sonnet-form"] },
                    { tag: "Pillar 5", title: "The Real World (AO3)", lectures: ["edx-romeo-p5-l1-elizabethan-society-patriarchy-and-marriage","edx-romeo-p5-l2-religion-fate-and-the-stars"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["edx-romeo-p6-l1-cracking-the-extract-question","edx-romeo-p6-l2-linking-extract-to-the-whole-play","edx-romeo-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "much-ado",
                name: "Much Ado About Nothing",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["edx-much-ado-intro-l1-meet-the-world-of-much-ado-about-nothing","edx-much-ado-intro-l2-the-full-story-of-much-ado-about-nothing"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["edx-much-ado-p1-l1-the-soldiers-return-and-the-two-plots","edx-much-ado-p1-l2-the-deception-hero-shamed-and-beatrice-acts","edx-much-ado-p1-l3-the-truth-revealed-and-the-double-wedding"] },
                    { tag: "Pillar 2", title: "Meet the Characters", lectures: ["edx-much-ado-p2-l1-beatrice-wit-and-independence","edx-much-ado-p2-l2-benedick-pride-and-transformation","edx-much-ado-p2-l3-hero-and-claudio-idealistic-love","edx-much-ado-p2-l4-don-john-the-villain-and-his-motive","edx-much-ado-p2-l5-dogberry-and-the-comic-watchmen"] },
                    { tag: "Pillar 3", title: "The Deep Stuff", lectures: ["edx-much-ado-p3-l1-love-and-courtship","edx-much-ado-p3-l2-honour-and-reputation","edx-much-ado-p3-l3-deception-and-appearance-vs-reality","edx-much-ado-p3-l4-gender-and-the-expectations-of-women","edx-much-ado-p3-l5-wit-and-language-as-power"] },
                    { tag: "Pillar 4", title: "The Writer's Tricks", lectures: ["edx-much-ado-p4-l1-prose-vs-verse-and-what-it-tells-us","edx-much-ado-p4-l2-wit-wordplay-and-the-battle-of-the-sexes","edx-much-ado-p4-l3-dramatic-irony-and-the-eavesdropping-scenes","edx-much-ado-p4-l4-structure-comedy-conventions-subverted"] },
                    { tag: "Pillar 5", title: "The Real World (AO3)", lectures: ["edx-much-ado-p5-l1-elizabethan-marriage-honour-and-women","edx-much-ado-p5-l2-social-hierarchy-and-military-culture","edx-much-ado-p5-l3-shakespeares-purpose-and-the-comedic-form"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["edx-much-ado-p6-l1-cracking-the-extract-question","edx-much-ado-p6-l2-linking-extract-to-the-whole-play","edx-much-ado-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "twelfth-night",
                name: "Twelfth Night",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["edx-twelfth-night-intro-l1-meet-the-world-of-twelfth-night","edx-twelfth-night-intro-l2-the-full-story-of-twelfth-night"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["edx-twelfth-night-p1-l1-the-shipwreck-viola-becomes-cesario","edx-twelfth-night-p1-l2-the-love-triangle-and-malvolios-trick","edx-twelfth-night-p1-l3-the-reveal-twins-reunited-and-the-endings"] },
                    { tag: "Pillar 2", title: "Meet the Characters", lectures: ["edx-twelfth-night-p2-l1-viola-disguise-and-quiet-strength","edx-twelfth-night-p2-l2-orsino-self-obsession-and-real-love","edx-twelfth-night-p2-l3-olivia-grief-and-sudden-passion","edx-twelfth-night-p2-l4-malvolio-pride-and-public-humiliation","edx-twelfth-night-p2-l5-sir-toby-feste-and-the-comic-world"] },
                    { tag: "Pillar 3", title: "The Deep Stuff", lectures: ["edx-twelfth-night-p3-l1-love-obsession-and-self-delusion","edx-twelfth-night-p3-l2-disguise-and-mistaken-identity","edx-twelfth-night-p3-l3-gender-and-what-viola-reveals","edx-twelfth-night-p3-l4-class-and-malvolios-ambition","edx-twelfth-night-p3-l5-order-vs-misrule"] },
                    { tag: "Pillar 4", title: "The Writer's Tricks", lectures: ["edx-twelfth-night-p4-l1-comic-language-and-wordplay","edx-twelfth-night-p4-l2-dramatic-irony-and-the-disguise-plot","edx-twelfth-night-p4-l3-the-letter-scene-and-malvolios-language","edx-twelfth-night-p4-l4-structure-parallel-plots-and-the-ending"] },
                    { tag: "Pillar 5", title: "The Real World (AO3)", lectures: ["edx-twelfth-night-p5-l1-elizabethan-comedy-and-festive-misrule","edx-twelfth-night-p5-l2-cross-dressing-and-gender-on-the-stage","edx-twelfth-night-p5-l3-social-class-and-service-in-shakespeares-england"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["edx-twelfth-night-p6-l1-cracking-the-extract-question","edx-twelfth-night-p6-l2-linking-extract-to-the-whole-play","edx-twelfth-night-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "merchant",
                name: "The Merchant of Venice",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["edx-merchant-intro-l1-meet-the-world-of-the-merchant-of-venice","edx-merchant-intro-l2-the-full-story-of-the-merchant-of-venice"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["edx-merchant-p1-l1-the-bond-antonio-shylock-and-the-deal","edx-merchant-p1-l2-portia-bassanio-and-the-casket-plot","edx-merchant-p1-l3-the-trial-and-the-resolution"] },
                    { tag: "Pillar 2", title: "Meet the Characters", lectures: ["edx-merchant-p2-l1-shylock-villain-or-victim","edx-merchant-p2-l2-portia-intelligence-and-female-power","edx-merchant-p2-l3-antonio-and-bassanio-friendship-and-loyalty","edx-merchant-p2-l4-jessica-and-launcelot-belonging-and-identity","edx-merchant-p2-l5-the-duke-and-the-minor-characters"] },
                    { tag: "Pillar 3", title: "The Deep Stuff", lectures: ["edx-merchant-p3-l1-prejudice-and-antisemitism","edx-merchant-p3-l2-justice-and-mercy","edx-merchant-p3-l3-wealth-and-greed","edx-merchant-p3-l4-appearance-vs-reality","edx-merchant-p3-l5-gender-and-disguise"] },
                    { tag: "Pillar 4", title: "The Writer's Tricks", lectures: ["edx-merchant-p4-l1-the-language-of-money-and-trade","edx-merchant-p4-l2-shylocks-powerful-speeches","edx-merchant-p4-l3-comedy-and-its-dark-edges","edx-merchant-p4-l4-structure-courtroom-as-climax"] },
                    { tag: "Pillar 5", title: "The Real World (AO3)", lectures: ["edx-merchant-p5-l1-elizabethan-attitudes-to-jews-and-outsiders","edx-merchant-p5-l2-venetian-society-trade-and-law","edx-merchant-p5-l3-what-shakespeare-intended-and-modern-readings"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["edx-merchant-p6-l1-cracking-the-extract-question","edx-merchant-p6-l2-linking-extract-to-the-whole-play","edx-merchant-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            }
        ]
    },

    {
        tag: "Paper 1 · Section B",
        title: "Post-1914 Literature",
        type: "multi",
        texts: [
            {
                id: "animal-farm",
                name: "Animal Farm",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["edx-animal-farm-intro-l1-meet-the-world-of-animal-farm","edx-animal-farm-intro-l2-the-full-story-of-animal-farm"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["edx-animal-farm-p1-l1-the-rebellion-and-the-seven-commandments","edx-animal-farm-p1-l2-the-pigs-rise-to-power-and-squealer","edx-animal-farm-p1-l3-the-corruption-completes-and-the-ending"] },
                    { tag: "Pillar 2", title: "Character Profiles", lectures: ["edx-animal-farm-p2-l1-napoleon-tyranny-and-power","edx-animal-farm-p2-l2-snowball-idealism-and-exile","edx-animal-farm-p2-l3-boxer-loyalty-and-exploitation","edx-animal-farm-p2-l4-squealer-propaganda-and-language","edx-animal-farm-p2-l5-old-major-benjamin-and-the-other-animals"] },
                    { tag: "Pillar 3", title: "Big Ideas", lectures: ["edx-animal-farm-p3-l1-power-and-corruption","edx-animal-farm-p3-l2-propaganda-and-the-manipulation-of-truth","edx-animal-farm-p3-l3-equality-and-its-betrayal","edx-animal-farm-p3-l4-revolution-and-what-it-becomes","edx-animal-farm-p3-l5-the-working-class-and-exploitation"] },
                    { tag: "Pillar 4", title: "The Novelist's Voice", lectures: ["edx-animal-farm-p4-l1-allegory-and-how-it-works","edx-animal-farm-p4-l2-the-commandments-and-their-distortion","edx-animal-farm-p4-l3-simple-language-and-powerful-effect","edx-animal-farm-p4-l4-structure-the-circular-ending"] },
                    { tag: "Pillar 5", title: "The Real World (AO3)", lectures: ["edx-animal-farm-p5-l1-the-russian-revolution-and-stalinism","edx-animal-farm-p5-l2-totalitarianism-and-orwells-warning","edx-animal-farm-p5-l3-orwells-life-purpose-and-the-fable-form"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["edx-animal-farm-p6-l1-mastering-the-memory-based-essay","edx-animal-farm-p6-l2-planning-for-any-character-or-theme","edx-animal-farm-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "anita-and-me",
                name: "Anita and Me",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["edx-anita-and-me-intro-l1-meet-the-world-of-anita-and-me","edx-anita-and-me-intro-l2-the-full-story-of-anita-and-me"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["edx-anita-and-me-p1-l1-meena-and-tollington","edx-anita-and-me-p1-l2-anitas-influence-and-the-summers-events","edx-anita-and-me-p1-l3-growing-up-and-moving-on"] },
                    { tag: "Pillar 2", title: "Character Profiles", lectures: ["edx-anita-and-me-p2-l1-meena-identity-and-belonging","edx-anita-and-me-p2-l2-anita-danger-and-fascination","edx-anita-and-me-p2-l3-meenas-parents-and-the-sikh-community","edx-anita-and-me-p2-l4-nanima-heritage-and-wisdom","edx-anita-and-me-p2-l5-sam-and-the-white-working-class"] },
                    { tag: "Pillar 3", title: "Big Ideas", lectures: ["edx-anita-and-me-p3-l1-identity-and-belonging","edx-anita-and-me-p3-l2-race-and-racism-in-1970s-britain","edx-anita-and-me-p3-l3-growing-up-and-loss-of-innocence","edx-anita-and-me-p3-l4-community-and-outsiders","edx-anita-and-me-p3-l5-the-immigrant-experience-and-assimilation"] },
                    { tag: "Pillar 4", title: "The Novelist's Voice", lectures: ["edx-anita-and-me-p4-l1-humour-and-the-first-person-voice","edx-anita-and-me-p4-l2-the-mixing-of-cultures-in-language","edx-anita-and-me-p4-l3-nostalgia-and-the-adult-narrator","edx-anita-and-me-p4-l4-setting-as-symbol"] },
                    { tag: "Pillar 5", title: "The Real World (AO3)", lectures: ["edx-anita-and-me-p5-l1-1970s-britain-race-relations-and-the-nf","edx-anita-and-me-p5-l2-south-asian-diaspora-and-second-generation-identity","edx-anita-and-me-p5-l3-syals-purpose-and-autobiographical-elements"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["edx-anita-and-me-p6-l1-mastering-the-memory-based-essay","edx-anita-and-me-p6-l2-planning-for-any-character-or-theme","edx-anita-and-me-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "blood-brothers",
                name: "Blood Brothers",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["edx-blood-brothers-intro-l1-meet-the-world-of-blood-brothers","edx-blood-brothers-intro-l2-the-full-story-of-blood-brothers"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["edx-blood-brothers-p1-l1-the-twins-separated-at-birth","edx-blood-brothers-p1-l2-childhood-friendship-and-growing-apart","edx-blood-brothers-p1-l3-the-final-confrontation-and-tragic-ending"] },
                    { tag: "Pillar 2", title: "Meet the Characters", lectures: ["edx-blood-brothers-p2-l1-mickey-poverty-and-its-effects","edx-blood-brothers-p2-l2-edward-privilege-and-ignorance","edx-blood-brothers-p2-l3-mrs-johnstone-sacrifice-and-superstition","edx-blood-brothers-p2-l4-mrs-lyons-manipulation-and-guilt","edx-blood-brothers-p2-l5-linda-and-the-narrator-fate-and-commentary"] },
                    { tag: "Pillar 3", title: "The Deep Stuff", lectures: ["edx-blood-brothers-p3-l1-class-and-social-inequality","edx-blood-brothers-p3-l2-fate-and-superstition","edx-blood-brothers-p3-l3-nature-vs-nurture","edx-blood-brothers-p3-l4-friendship-and-loyalty","edx-blood-brothers-p3-l5-the-impact-of-poverty-on-opportunity"] },
                    { tag: "Pillar 4", title: "The Writer's Tricks", lectures: ["edx-blood-brothers-p4-l1-the-narrator-as-dramatic-device","edx-blood-brothers-p4-l2-music-song-and-emotion","edx-blood-brothers-p4-l3-language-and-class-dialect","edx-blood-brothers-p4-l4-structure-dramatic-irony-from-the-start"] },
                    { tag: "Pillar 5", title: "The Real World (AO3)", lectures: ["edx-blood-brothers-p5-l1-thatcherism-unemployment-and-1980s-britain","edx-blood-brothers-p5-l2-class-in-post-war-britain","edx-blood-brothers-p5-l3-russells-purpose-and-the-musical-form"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["edx-blood-brothers-p6-l1-cracking-the-extract-question","edx-blood-brothers-p6-l2-linking-extract-to-the-whole-play","edx-blood-brothers-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "boys-dont-cry",
                name: "Boys Don’t Cry",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["edx-boys-dont-cry-intro-l1-meet-the-world-of-boys-dont-cry","edx-boys-dont-cry-intro-l2-the-full-story-of-boys-dont-cry"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["edx-boys-dont-cry-p1-l1-dantes-exam-results-day-and-emma","edx-boys-dont-cry-p1-l2-learning-to-care-for-emma-and-growing-up-fast","edx-boys-dont-cry-p1-l3-adam-mercy-and-what-dante-decides"] },
                    { tag: "Pillar 2", title: "Character Profiles", lectures: ["edx-boys-dont-cry-p2-l1-dante-ambition-forced-to-change","edx-boys-dont-cry-p2-l2-adam-identity-and-the-parallel-story","edx-boys-dont-cry-p2-l3-melanie-and-the-absent-mother","edx-boys-dont-cry-p2-l4-dantes-dad-quiet-support-and-sacrifice","edx-boys-dont-cry-p2-l5-emma-and-what-she-represents"] },
                    { tag: "Pillar 3", title: "Big Ideas", lectures: ["edx-boys-dont-cry-p3-l1-responsibility-and-growing-up-too-soon","edx-boys-dont-cry-p3-l2-masculinity-and-boys-dont-cry-as-a-title","edx-boys-dont-cry-p3-l3-identity-and-sexuality","edx-boys-dont-cry-p3-l4-family-and-what-it-means-to-show-up","edx-boys-dont-cry-p3-l5-ambition-vs-duty"] },
                    { tag: "Pillar 4", title: "The Novelist's Voice", lectures: ["edx-boys-dont-cry-p4-l2-first-person-voice-and-teenage-authenticity","edx-boys-dont-cry-p4-l3-humour-alongside-serious-themes","edx-boys-dont-cry-p4-l4-structure-alternating-chapters-and-time"] },
                    { tag: "Pillar 5", title: "The Real World (AO3)", lectures: ["edx-boys-dont-cry-p5-l1-teenage-parenthood-in-modern-britain","edx-boys-dont-cry-p5-l2-attitudes-to-masculinity-and-emotion","edx-boys-dont-cry-p5-l3-blackmans-purpose-and-writing-for-young-readers"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["edx-boys-dont-cry-p6-l1-mastering-the-extract-question","edx-boys-dont-cry-p6-l2-linking-extract-to-whole-text","edx-boys-dont-cry-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "coram-boy",
                name: "Coram Boy",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["edx-coram-boy-intro-l1-meet-the-world-of-coram-boy","edx-coram-boy-intro-l2-the-full-story-of-coram-boy"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["edx-coram-boy-p1-l1-otis-meshak-and-the-coram-boy-scam","edx-coram-boy-p1-l2-aaron-alexander-and-the-hidden-truth","edx-coram-boy-p1-l3-meshaks-guilt-and-the-final-reunion"] },
                    { tag: "Pillar 2", title: "Meet the Characters", lectures: ["edx-coram-boy-p2-l1-aaron-identity-and-belonging","edx-coram-boy-p2-l2-alexander-music-freedom-and-family-duty","edx-coram-boy-p2-l3-otis-and-meshak-cruelty-and-conscience","edx-coram-boy-p2-l4-melissa-and-the-cost-placed-on-women","edx-coram-boy-p2-l5-thomas-coram-and-mercy-in-a-cruel-world"] },
                    { tag: "Pillar 3", title: "The Deep Stuff", lectures: ["edx-coram-boy-p3-l1-class-and-who-society-values","edx-coram-boy-p3-l2-slavery-cruelty-and-exploitation","edx-coram-boy-p3-l3-identity-and-the-search-for-belonging","edx-coram-boy-p3-l4-music-as-freedom-and-escape","edx-coram-boy-p3-l5-guilt-redemption-and-second-chances"] },
                    { tag: "Pillar 4", title: "The Writer's Tricks", lectures: ["edx-coram-boy-p4-l1-dual-timeframes-and-parallel-lives","edx-coram-boy-p4-l2-music-as-symbol-and-structure","edx-coram-boy-p4-l3-meshaks-visions-and-the-glory-motif","edx-coram-boy-p4-l4-structure-multiple-narrative-threads"] },
                    { tag: "Pillar 5", title: "The Real World (AO3)", lectures: ["edx-coram-boy-p5-l1-the-real-thomas-coram-and-the-foundling-hospital","edx-coram-boy-p5-l2-18th-century-attitudes-to-illegitimacy-and-class","edx-coram-boy-p5-l3-gavins-purpose-and-handels-music-in-the-novel"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["edx-coram-boy-p6-l1-mastering-the-extract-question","edx-coram-boy-p6-l2-linking-extract-to-whole-text","edx-coram-boy-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "hobsons-choice",
                name: "Hobson’s Choice",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["edx-hobsons-choice-intro-l1-meet-the-world-of-hobsons-choice","edx-hobsons-choice-intro-l2-the-full-story-of-hobsons-choice"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["edx-hobsons-choice-p1-l1-hobson-the-shop-and-maggies-plan","edx-hobsons-choice-p1-l2-maggie-and-willie-build-a-business","edx-hobsons-choice-p1-l3-hobsons-downfall-and-the-final-deal"] },
                    { tag: "Pillar 2", title: "Meet the Characters", lectures: ["edx-hobsons-choice-p2-l1-maggie-ambition-and-control","edx-hobsons-choice-p2-l2-willie-mossop-transformation-from-doormat-to-partner","edx-hobsons-choice-p2-l3-henry-hobson-pride-and-decline","edx-hobsons-choice-p2-l4-alice-and-vickey-the-other-hobson-sisters","edx-hobsons-choice-p2-l5-jim-heeler-and-the-salford-community"] },
                    { tag: "Pillar 3", title: "The Deep Stuff", lectures: ["edx-hobsons-choice-p3-l1-social-class-and-social-mobility","edx-hobsons-choice-p3-l2-gender-and-who-really-holds-the-power","edx-hobsons-choice-p3-l3-money-business-and-independence","edx-hobsons-choice-p3-l4-family-duty-and-rebellion","edx-hobsons-choice-p3-l5-pride-and-the-danger-of-underestimating-others"] },
                    { tag: "Pillar 4", title: "The Writer's Tricks", lectures: ["edx-hobsons-choice-p4-l1-comedy-and-the-role-of-humour","edx-hobsons-choice-p4-l2-lancashire-dialect-and-what-it-shows","edx-hobsons-choice-p4-l3-maggies-direct-language-and-control-of-scenes","edx-hobsons-choice-p4-l4-structure-the-three-act-shift-in-power"] },
                    { tag: "Pillar 5", title: "The Real World (AO3)", lectures: ["edx-hobsons-choice-p5-l1-victorian-salford-and-trade-life","edx-hobsons-choice-p5-l2-womens-limited-rights-in-1880s-england","edx-hobsons-choice-p5-l3-brighouses-purpose-and-the-comic-tradition"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["edx-hobsons-choice-p6-l1-cracking-the-extract-question","edx-hobsons-choice-p6-l2-linking-extract-to-the-whole-play","edx-hobsons-choice-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "inspector-calls",
                name: "An Inspector Calls",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["edx-inspector-calls-intro-l1-meet-the-world-of-an-inspector-calls","edx-inspector-calls-intro-l2-the-full-story-of-an-inspector-calls"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["edx-inspector-calls-p1-l1-the-birlings-the-engagement-and-the-inspector","edx-inspector-calls-p1-l2-the-interrogations-and-each-persons-guilt","edx-inspector-calls-p1-l3-the-twist-the-reactions-and-the-final-call"] },
                    { tag: "Pillar 2", title: "Meet the Characters", lectures: ["edx-inspector-calls-p2-l1-inspector-goole-voice-of-social-conscience","edx-inspector-calls-p2-l2-mr-birling-capitalism-and-arrogance","edx-inspector-calls-p2-l3-mrs-birling-snobbery-and-denial","edx-inspector-calls-p2-l4-sheila-and-eric-the-younger-generation","edx-inspector-calls-p2-l5-eva-smith-the-invisible-victim"] },
                    { tag: "Pillar 3", title: "The Deep Stuff", lectures: ["edx-inspector-calls-p3-l1-social-responsibility-and-community","edx-inspector-calls-p3-l2-class-and-inequality","edx-inspector-calls-p3-l3-generational-conflict-and-change","edx-inspector-calls-p3-l4-guilt-and-collective-responsibility","edx-inspector-calls-p3-l5-gender-and-the-treatment-of-women"] },
                    { tag: "Pillar 4", title: "The Writer's Tricks", lectures: ["edx-inspector-calls-p4-l1-the-inspectors-powerful-language","edx-inspector-calls-p4-l2-dramatic-irony-and-time","edx-inspector-calls-p4-l3-symbolism-lighting-and-staging","edx-inspector-calls-p4-l4-structure-unity-of-time-and-place"] },
                    { tag: "Pillar 5", title: "The Real World (AO3)", lectures: ["edx-inspector-calls-p5-l1-1912-vs-1945-two-time-periods","edx-inspector-calls-p5-l2-socialism-capitalism-and-the-welfare-state","edx-inspector-calls-p5-l3-priestleys-purpose-and-political-message"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["edx-inspector-calls-p6-l1-cracking-the-extract-question","edx-inspector-calls-p6-l2-linking-extract-to-the-whole-play","edx-inspector-calls-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "journeys-end",
                name: "Journey’s End",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["edx-journeys-end-intro-l1-meet-the-world-of-journeys-end","edx-journeys-end-intro-l2-the-full-story-of-journeys-end"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["edx-journeys-end-p1-l1-the-dugout-stanhope-and-raleighs-arrival","edx-journeys-end-p1-l2-the-raid-and-the-waiting-for-attack","edx-journeys-end-p1-l3-the-final-attack-and-the-deaths"] },
                    { tag: "Pillar 2", title: "Meet the Characters", lectures: ["edx-journeys-end-p2-l1-stanhope-leadership-and-collapse-under-pressure","edx-journeys-end-p2-l2-raleigh-innocence-meets-the-reality-of-war","edx-journeys-end-p2-l3-osborne-calm-fatherly-courage","edx-journeys-end-p2-l4-trotter-and-hibbert-different-ways-of-coping-with-fear","edx-journeys-end-p2-l5-the-colonel-and-the-cost-of-command"] },
                    { tag: "Pillar 3", title: "The Deep Stuff", lectures: ["edx-journeys-end-p3-l1-fear-and-courage","edx-journeys-end-p3-l2-the-loss-of-innocence","edx-journeys-end-p3-l3-class-and-leadership-in-the-army","edx-journeys-end-p3-l4-friendship-and-loyalty-under-pressure","edx-journeys-end-p3-l5-the-futility-and-waste-of-war"] },
                    { tag: "Pillar 4", title: "The Writer's Tricks", lectures: ["edx-journeys-end-p4-l1-understatement-and-what-characters-dont-say","edx-journeys-end-p4-l2-humour-as-a-defence-against-fear","edx-journeys-end-p4-l3-the-confined-setting-of-the-dugout","edx-journeys-end-p4-l4-structure-the-slow-build-to-the-attack"] },
                    { tag: "Pillar 5", title: "The Real World (AO3)", lectures: ["edx-journeys-end-p5-l1-world-war-one-and-trench-warfare","edx-journeys-end-p5-l2-officer-class-and-military-hierarchy","edx-journeys-end-p5-l3-sherriffs-own-war-experience-and-his-purpose"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["edx-journeys-end-p6-l1-cracking-the-extract-question","edx-journeys-end-p6-l2-linking-extract-to-the-whole-play","edx-journeys-end-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "lord-of-flies",
                name: "Lord of the Flies",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["edx-lord-of-flies-intro-l1-meet-the-world-of-lord-of-the-flies","edx-lord-of-flies-intro-l2-the-full-story-of-lord-of-the-flies"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["edx-lord-of-flies-p1-l1-the-island-the-conch-and-first-order","edx-lord-of-flies-p1-l2-the-hunters-the-fire-and-the-breakdown","edx-lord-of-flies-p1-l3-simons-death-piggys-death-and-rescue"] },
                    { tag: "Pillar 2", title: "Character Profiles", lectures: ["edx-lord-of-flies-p2-l1-ralph-democracy-and-civilisation","edx-lord-of-flies-p2-l2-jack-savagery-and-power","edx-lord-of-flies-p2-l3-simon-goodness-and-spiritual-truth","edx-lord-of-flies-p2-l4-piggy-intellect-and-rejection","edx-lord-of-flies-p2-l5-roger-and-the-beast-evil-within"] },
                    { tag: "Pillar 3", title: "Big Ideas", lectures: ["edx-lord-of-flies-p3-l1-civilisation-vs-savagery","edx-lord-of-flies-p3-l2-power-and-leadership","edx-lord-of-flies-p3-l3-the-loss-of-innocence","edx-lord-of-flies-p3-l4-fear-and-the-beast-as-symbol","edx-lord-of-flies-p3-l5-human-nature-and-inherent-evil"] },
                    { tag: "Pillar 4", title: "The Novelist's Voice", lectures: ["edx-lord-of-flies-p4-l1-the-island-as-symbol-and-microcosm","edx-lord-of-flies-p4-l2-language-of-violence-and-descent","edx-lord-of-flies-p4-l3-religious-and-mythological-imagery","edx-lord-of-flies-p4-l4-structure-order-to-chaos"] },
                    { tag: "Pillar 5", title: "The Real World (AO3)", lectures: ["edx-lord-of-flies-p5-l1-world-war-two-and-human-capacity-for-evil","edx-lord-of-flies-p5-l2-cold-war-fears-and-nuclear-anxiety","edx-lord-of-flies-p5-l3-goldings-purpose-and-the-allegorical-form"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["edx-lord-of-flies-p6-l1-mastering-the-memory-based-essay","edx-lord-of-flies-p6-l2-planning-for-any-character-or-theme","edx-lord-of-flies-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "woman-in-black",
                name: "The Woman in Black",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["edx-woman-in-black-intro-l1-meet-the-world-of-the-woman-in-black","edx-woman-in-black-intro-l2-the-full-story-of-the-woman-in-black"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["edx-woman-in-black-p1-l1-kipps-is-sent-to-eel-marsh-house","edx-woman-in-black-p1-l2-the-sightings-and-the-secret-of-jennet-humfrye","edx-woman-in-black-p1-l3-the-final-warning-and-the-tragic-ending"] },
                    { tag: "Pillar 2", title: "Character Profiles", lectures: ["edx-woman-in-black-p2-l1-arthur-kipps-rational-man-meets-the-supernatural","edx-woman-in-black-p2-l2-the-woman-in-black-grief-turned-to-vengeance","edx-woman-in-black-p2-l3-mr-jerome-and-the-village-of-silence","edx-woman-in-black-p2-l4-samuel-daily-and-spider-outsiders-who-understand"] },
                    { tag: "Pillar 3", title: "Big Ideas", lectures: ["edx-woman-in-black-p3-l1-grief-and-its-power-to-destroy","edx-woman-in-black-p3-l2-isolation-and-the-unknown","edx-woman-in-black-p3-l3-secrecy-and-a-community-protecting-itself","edx-woman-in-black-p3-l4-the-supernatural-vs-rational-belief","edx-woman-in-black-p3-l5-the-past-refusing-to-stay-buried"] },
                    { tag: "Pillar 4", title: "The Novelist's Voice", lectures: ["edx-woman-in-black-p4-l1-gothic-setting-and-atmosphere","edx-woman-in-black-p4-l2-pathetic-fallacy-the-marsh-mist-and-fear","edx-woman-in-black-p4-l3-narrative-voice-kipps-looking-back","edx-woman-in-black-p4-l4-structure-slow-build-and-the-frame-narrative"] },
                    { tag: "Pillar 5", title: "The Real World (AO3)", lectures: ["edx-woman-in-black-p5-l1-the-gothic-tradition-and-victorian-ghost-stories","edx-woman-in-black-p5-l2-edwardian-england-and-attitudes-to-grief","edx-woman-in-black-p5-l3-hills-purpose-and-writing-a-modern-ghost-story"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["edx-woman-in-black-p6-l1-mastering-the-extract-question","edx-woman-in-black-p6-l2-linking-extract-to-whole-text","edx-woman-in-black-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            }
        ]
    },

    {
        tag: "Paper 2 · Section A",
        title: "19th Century Novel",
        type: "multi",
        texts: [
            {
                id: "christmas-carol",
                name: "A Christmas Carol",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["edx-christmas-carol-intro-l1-meet-the-world-of-a-christmas-carol","edx-christmas-carol-intro-l2-the-full-story-of-a-christmas-carol"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["edx-christmas-carol-p1-l1-stave-1-scrooge-and-marleys-ghost","edx-christmas-carol-p1-l2-staves-2-and-3-the-past-and-present","edx-christmas-carol-p1-l3-staves-4-and-5-the-future-and-redemption"] },
                    { tag: "Pillar 2", title: "Character Profiles", lectures: ["edx-christmas-carol-p2-l1-scrooge-the-transformation","edx-christmas-carol-p2-l2-the-three-spirits-and-what-they-represent","edx-christmas-carol-p2-l3-bob-cratchit-and-tiny-tim-the-poor","edx-christmas-carol-p2-l4-fred-and-belle-warmth-vs-greed","edx-christmas-carol-p2-l5-marley-warning-and-consequence"] },
                    { tag: "Pillar 3", title: "Big Ideas", lectures: ["edx-christmas-carol-p3-l1-poverty-and-social-responsibility","edx-christmas-carol-p3-l2-redemption-and-transformation","edx-christmas-carol-p3-l3-greed-and-the-corruption-of-wealth","edx-christmas-carol-p3-l4-family-and-generosity","edx-christmas-carol-p3-l5-time-memory-and-regret"] },
                    { tag: "Pillar 4", title: "The Novelist's Voice", lectures: ["edx-christmas-carol-p4-l1-the-gothic-and-supernatural-atmosphere","edx-christmas-carol-p4-l2-symbolism-chains-cold-and-fire","edx-christmas-carol-p4-l3-narrative-voice-and-direct-address","edx-christmas-carol-p4-l4-structure-the-five-staves"] },
                    { tag: "Pillar 5", title: "Victorian Values (AO3)", lectures: ["edx-christmas-carol-p5-l1-victorian-poverty-and-the-workhouse","edx-christmas-carol-p5-l2-the-poor-law-and-social-reform","edx-christmas-carol-p5-l3-dickens-purpose-and-personal-history"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["edx-christmas-carol-p6-l1-mastering-the-extract-question","edx-christmas-carol-p6-l2-linking-extract-to-whole-text","edx-christmas-carol-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "frankenstein",
                name: "Frankenstein",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["edx-frankenstein-intro-l1-meet-the-world-of-frankenstein","edx-frankenstein-intro-l2-the-full-story-of-frankenstein"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["edx-frankenstein-p1-l1-walton-victor-and-the-creation","edx-frankenstein-p1-l2-the-creatures-awakening-and-rejection","edx-frankenstein-p1-l3-pursuit-destruction-and-the-arctic-ending"] },
                    { tag: "Pillar 2", title: "Character Profiles", lectures: ["edx-frankenstein-p2-l1-victor-frankenstein-ambition-and-responsibility","edx-frankenstein-p2-l2-the-creature-sympathy-and-monstrosity","edx-frankenstein-p2-l3-walton-the-framing-narrator","edx-frankenstein-p2-l4-elizabeth-and-justine-female-victims","edx-frankenstein-p2-l5-de-lacey-family-and-what-the-creature-learns"] },
                    { tag: "Pillar 3", title: "Big Ideas", lectures: ["edx-frankenstein-p3-l1-ambition-and-the-dangers-of-playing-god","edx-frankenstein-p3-l2-responsibility-and-abandonment","edx-frankenstein-p3-l3-prejudice-and-appearance","edx-frankenstein-p3-l4-nature-vs-nurture","edx-frankenstein-p3-l5-knowledge-and-its-consequences"] },
                    { tag: "Pillar 4", title: "The Novelist's Voice", lectures: ["edx-frankenstein-p4-l1-the-gothic-sublime-and-natural-imagery","edx-frankenstein-p4-l2-the-creatures-eloquent-voice","edx-frankenstein-p4-l3-frame-narrative-and-multiple-perspectives","edx-frankenstein-p4-l4-symbolism-fire-light-and-ice"] },
                    { tag: "Pillar 5", title: "Victorian Values (AO3)", lectures: ["edx-frankenstein-p5-l1-the-scientific-revolution-and-galvanism","edx-frankenstein-p5-l2-romanticism-and-the-sublime","edx-frankenstein-p5-l3-shelleys-life-and-the-birth-of-the-novel"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["edx-frankenstein-p6-l1-mastering-the-extract-question","edx-frankenstein-p6-l2-linking-extract-to-whole-text","edx-frankenstein-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "great-expectations",
                name: "Great Expectations",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["edx-great-expectations-intro-l1-meet-the-world-of-great-expectations","edx-great-expectations-intro-l2-the-full-story-of-great-expectations"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["edx-great-expectations-p1-l1-pip-magwitch-and-the-marshes","edx-great-expectations-p1-l2-satis-house-london-and-the-mystery-benefactor","edx-great-expectations-p1-l3-the-truth-about-magwitch-and-pips-transformation"] },
                    { tag: "Pillar 2", title: "Character Profiles", lectures: ["edx-great-expectations-p2-l1-pip-ambition-shame-and-growth","edx-great-expectations-p2-l2-miss-havisham-bitterness-and-obsession","edx-great-expectations-p2-l3-estella-cruelty-and-its-origins","edx-great-expectations-p2-l4-magwitch-and-joe-true-goodness","edx-great-expectations-p2-l5-jaggers-and-wemmick-law-and-double-life"] },
                    { tag: "Pillar 3", title: "Big Ideas", lectures: ["edx-great-expectations-p3-l1-class-and-social-mobility","edx-great-expectations-p3-l2-wealth-and-its-corruption","edx-great-expectations-p3-l3-ambition-and-self-improvement","edx-great-expectations-p3-l4-love-and-its-distortions","edx-great-expectations-p3-l5-crime-justice-and-redemption"] },
                    { tag: "Pillar 4", title: "The Novelist's Voice", lectures: ["edx-great-expectations-p4-l1-first-person-narrative-and-retrospect","edx-great-expectations-p4-l2-gothic-setting-satis-house-and-the-marshes","edx-great-expectations-p4-l3-humour-and-caricature","edx-great-expectations-p4-l4-symbolism-and-imagery-throughout"] },
                    { tag: "Pillar 5", title: "Victorian Values (AO3)", lectures: ["edx-great-expectations-p5-l1-victorian-class-system-and-gentlemen","edx-great-expectations-p5-l2-crime-punishment-and-transportation","edx-great-expectations-p5-l3-dickens-own-life-and-his-purpose"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["edx-great-expectations-p6-l1-mastering-the-extract-question","edx-great-expectations-p6-l2-linking-extract-to-whole-text","edx-great-expectations-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "jane-eyre",
                name: "Jane Eyre",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["edx-jane-eyre-intro-l1-meet-the-world-of-jane-eyre","edx-jane-eyre-intro-l2-the-full-story-of-jane-eyre"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["edx-jane-eyre-p1-l1-childhood-lowood-and-finding-thornfield","edx-jane-eyre-p1-l2-rochester-bertha-and-the-wedding-that-fails","edx-jane-eyre-p1-l3-moor-house-the-inheritance-and-the-return"] },
                    { tag: "Pillar 2", title: "Character Profiles", lectures: ["edx-jane-eyre-p2-l1-jane-independence-and-moral-strength","edx-jane-eyre-p2-l2-rochester-passion-and-deception","edx-jane-eyre-p2-l3-bertha-mason-the-madwoman-and-what-she-represents","edx-jane-eyre-p2-l4-st-john-rivers-cold-duty-vs-warm-love","edx-jane-eyre-p2-l5-brocklehurst-and-the-red-room-oppression"] },
                    { tag: "Pillar 3", title: "Big Ideas", lectures: ["edx-jane-eyre-p3-l1-independence-and-female-autonomy","edx-jane-eyre-p3-l2-class-and-social-belonging","edx-jane-eyre-p3-l3-religion-and-morality","edx-jane-eyre-p3-l4-love-and-equality-in-relationships","edx-jane-eyre-p3-l5-the-gothic-and-the-supernatural"] },
                    { tag: "Pillar 4", title: "The Novelist's Voice", lectures: ["edx-jane-eyre-p4-l1-first-person-voice-and-direct-address","edx-jane-eyre-p4-l2-gothic-atmosphere-and-symbolism","edx-jane-eyre-p4-l3-pathetic-fallacy-and-natural-imagery","edx-jane-eyre-p4-l4-structure-bildungsroman-and-janes-journey"] },
                    { tag: "Pillar 5", title: "Victorian Values (AO3)", lectures: ["edx-jane-eyre-p5-l1-victorian-women-marriage-and-independence","edx-jane-eyre-p5-l2-class-religion-and-charity-schools","edx-jane-eyre-p5-l3-colonialism-and-the-empire-bertha-mason"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["edx-jane-eyre-p6-l1-mastering-the-extract-question","edx-jane-eyre-p6-l2-linking-extract-to-whole-text","edx-jane-eyre-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "jekyll-hyde",
                name: "Dr Jekyll and Mr Hyde",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["edx-jekyll-hyde-intro-l1-meet-the-world-of-jekyll-and-hyde","edx-jekyll-hyde-intro-l2-the-full-story-of-jekyll-and-hyde"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["edx-jekyll-hyde-p1-l1-utterson-and-the-mystery-begins","edx-jekyll-hyde-p1-l2-hyde-unleashed-carew-murder-and-panic","edx-jekyll-hyde-p1-l3-the-letters-the-truth-and-the-ending"] },
                    { tag: "Pillar 2", title: "Character Profiles", lectures: ["edx-jekyll-hyde-p2-l1-jekyll-respectability-and-repression","edx-jekyll-hyde-p2-l2-hyde-pure-evil-and-what-he-represents","edx-jekyll-hyde-p2-l3-utterson-the-loyal-observer","edx-jekyll-hyde-p2-l4-lanyon-science-and-moral-shock","edx-jekyll-hyde-p2-l5-poole-and-the-servants-society-watching"] },
                    { tag: "Pillar 3", title: "Big Ideas", lectures: ["edx-jekyll-hyde-p3-l1-duality-of-human-nature","edx-jekyll-hyde-p3-l2-repression-and-victorian-respectability","edx-jekyll-hyde-p3-l3-science-and-the-dangers-of-ambition","edx-jekyll-hyde-p3-l4-secrecy-and-the-danger-of-silence","edx-jekyll-hyde-p3-l5-appearance-vs-reality"] },
                    { tag: "Pillar 4", title: "The Novelist's Voice", lectures: ["edx-jekyll-hyde-p4-l1-gothic-setting-and-atmosphere","edx-jekyll-hyde-p4-l2-hydes-disturbing-language-and-description","edx-jekyll-hyde-p4-l3-narrative-structure-multiple-perspectives","edx-jekyll-hyde-p4-l4-symbolism-doors-mirrors-and-fog"] },
                    { tag: "Pillar 5", title: "Victorian Values (AO3)", lectures: ["edx-jekyll-hyde-p5-l1-victorian-society-class-and-reputation","edx-jekyll-hyde-p5-l2-darwin-and-the-fear-of-degeneration","edx-jekyll-hyde-p5-l3-stevensons-purpose-and-the-novella-form"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["edx-jekyll-hyde-p6-l1-mastering-the-extract-question","edx-jekyll-hyde-p6-l2-linking-extract-to-whole-text","edx-jekyll-hyde-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "pride-prejudice",
                name: "Pride & Prejudice",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["edx-pride-prejudice-intro-l1-meet-the-world-of-pride-and-prejudice","edx-pride-prejudice-intro-l2-the-full-story-of-pride-and-prejudice"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["edx-pride-prejudice-p1-l1-the-bennets-bingley-and-first-impressions","edx-pride-prejudice-p1-l2-wickham-darcy-and-misunderstandings","edx-pride-prejudice-p1-l3-the-truth-revealed-and-two-proposals"] },
                    { tag: "Pillar 2", title: "Character Profiles", lectures: ["edx-pride-prejudice-p2-l1-elizabeth-bennet-wit-and-independence","edx-pride-prejudice-p2-l2-darcy-pride-and-transformation","edx-pride-prejudice-p2-l3-jane-and-bingley-uncomplicated-love","edx-pride-prejudice-p2-l4-wickham-lydia-and-moral-failure","edx-pride-prejudice-p2-l5-mrs-bennet-collins-and-social-comedy"] },
                    { tag: "Pillar 3", title: "Big Ideas", lectures: ["edx-pride-prejudice-p3-l1-marriage-and-financial-security","edx-pride-prejudice-p3-l2-class-and-social-hierarchy","edx-pride-prejudice-p3-l3-pride-and-prejudice-as-flaws","edx-pride-prejudice-p3-l4-women-independence-and-limited-choices","edx-pride-prejudice-p3-l5-reputation-and-social-judgement"] },
                    { tag: "Pillar 4", title: "The Novelist's Voice", lectures: ["edx-pride-prejudice-p4-l1-free-indirect-discourse-and-narrative-voice","edx-pride-prejudice-p4-l2-irony-wit-and-social-satire","edx-pride-prejudice-p4-l3-dialogue-as-character-revelation","edx-pride-prejudice-p4-l4-structure-and-the-comedy-of-manners"] },
                    { tag: "Pillar 5", title: "Victorian Values (AO3)", lectures: ["edx-pride-prejudice-p5-l1-regency-society-marriage-and-women","edx-pride-prejudice-p5-l2-entailment-inheritance-and-financial-reality","edx-pride-prejudice-p5-l3-austens-purpose-and-the-novel-of-manners"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["edx-pride-prejudice-p6-l1-mastering-the-extract-question","edx-pride-prejudice-p6-l2-linking-extract-to-whole-text","edx-pride-prejudice-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            },
            {
                id: "silas-marner",
                name: "Silas Marner",
                pillars: [
                    { tag: "Intro", title: "Meet the World", lectures: ["edx-silas-marner-intro-l1-meet-the-world-of-silas-marner","edx-silas-marner-intro-l2-the-full-story-of-silas-marner"] },
                    { tag: "Pillar 1", title: "The Storyline", lectures: ["edx-silas-marner-p1-l1-betrayal-in-lantern-yard-and-exile-to-raveloe","edx-silas-marner-p1-l2-the-stolen-gold-and-fifteen-years-alone","edx-silas-marner-p1-l3-eppies-arrival-and-the-return-of-the-past"] },
                    { tag: "Pillar 2", title: "Character Profiles", lectures: ["edx-silas-marner-p2-l1-silas-isolation-to-connection","edx-silas-marner-p2-l2-eppie-innocence-and-what-she-restores","edx-silas-marner-p2-l3-godfrey-cass-guilt-and-avoidance","edx-silas-marner-p2-l4-dunstan-cass-greed-and-cruelty","edx-silas-marner-p2-l5-dolly-winthrop-and-the-community-of-raveloe"] },
                    { tag: "Pillar 3", title: "Big Ideas", lectures: ["edx-silas-marner-p3-l1-isolation-and-belonging","edx-silas-marner-p3-l2-fate-chance-and-choice","edx-silas-marner-p3-l3-money-and-what-it-cannot-replace","edx-silas-marner-p3-l4-class-and-the-two-worlds-of-the-novel","edx-silas-marner-p3-l5-redemption-through-love-not-religion"] },
                    { tag: "Pillar 4", title: "The Novelist's Voice", lectures: ["edx-silas-marner-p4-l1-the-narrators-voice-and-moral-commentary","edx-silas-marner-p4-l2-symbolism-gold-and-golden-hair","edx-silas-marner-p4-l3-rural-dialect-and-the-raveloe-community","edx-silas-marner-p4-l4-structure-the-time-jump-and-parallel-lives"] },
                    { tag: "Pillar 5", title: "Victorian Values (AO3)", lectures: ["edx-silas-marner-p5-l1-the-industrial-revolution-and-rural-england","edx-silas-marner-p5-l2-religious-dissent-and-victorian-faith","edx-silas-marner-p5-l3-eliots-purpose-and-her-own-hidden-identity"] },
                    { tag: "Pillar 6", title: "Exam Hacks", lectures: ["edx-silas-marner-p6-l1-mastering-the-extract-question","edx-silas-marner-p6-l2-linking-extract-to-whole-text","edx-silas-marner-p6-l3-grade-9-vs-grade-5-the-showdown"] }
                ]
            }
        ]
    }
];
