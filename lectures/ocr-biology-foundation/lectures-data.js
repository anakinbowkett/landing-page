/* ════════════════════════════════════════════
   Montura Learn — OCR GCSE Combined Science (Foundation)
   Biology
   Single source of truth for the full course structure.
════════════════════════════════════════════ */
function slugToTitle(slug) {
    // NOTE: bare-string fallback only — every lecture below is written as
    // an explicit {slug,title} object, so this should rarely fire.
    return slug
        .replace(/^sci-(?:bio-)?p\d+-l\d+-/, '')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
}

const papersData = [

/* ══════════════════════════════════════
       FOUNDATION — UNIVERSAL SCIENCE SKILLS (Phases 0–3)
    ══════════════════════════════════════ */
    {
        tag: "Foundation",
        title: "Start Here — Universal Science Skills",
        type: "single",
        pillars: [
            {
                tag: "Phase 0", title: "Orientation — What Is This Course?",
                lectures: [
                    { slug: "sci-p0-l1-what-combined-science-actually-is-two-gcses-one-course", title: "What Combined Science Actually Is Two GCSEs One Course" },
                    { slug: "sci-p0-l2-what-foundation-tier-means-and-why-its-a-real-valid-path", title: "What Foundation Tier Means and Why It's a Real, Valid Path" },
                    { slug: "sci-p0-l3-what-the-six-papers-look-like-and-which-covers-what", title: "What the Six Papers Look Like and Which Covers What" },
                    { slug: "sci-p0-l4-what-the-examiner-is-actually-marking-ao1-to-ao3-in-plain-english", title: "What the Examiner Is Actually Marking AO1 to AO3 in Plain English" },
                    { slug: "sci-p0-l5-why-core-practicals-matter-even-in-a-written-exam", title: "Why Core Practicals Matter Even in a Written Exam" },
                    { slug: "sci-p0-l6-what-a-strong-grade-5-answer-looks-like-and-how-you-get-there", title: "What a Strong Grade 5 Answer Looks Like and How You Get There" },
                    { slug: "sci-p0-l7-how-to-use-this-platform", title: "How to Use This Platform" },
                    { slug: "sci-p0-l8-how-to-divide-your-time-across-a-60-mark-70-minute-paper", title: "How to Divide Your Time Across a 60 Mark 70 Minute Paper" }
                ]
            },
            {
                tag: "Phase 1", title: "Command Words and Data Skills",
                lectures: [
                    { slug: "sci-p1-l1-command-words-describe-vs-explain-the-most-confused-pair", title: "Command Words Describe vs Explain the Most Confused Pair" },
                    { slug: "sci-p1-l2-command-words-evaluate-suggest-predict-compare-determine", title: "Command Words Evaluate Suggest Predict Compare Determine" },
                    { slug: "sci-p1-l3-reading-a-graph-table-or-chart-accurately", title: "Reading a Graph Table or Chart Accurately" },
                    { slug: "sci-p1-l4-plotting-a-graph-from-a-data-table", title: "Plotting a Graph from a Data Table" },
                    { slug: "sci-p1-l5-independent-dependent-and-control-variables", title: "Independent Dependent and Control Variables" },
                    { slug: "sci-p1-l6-units-and-converting-between-them", title: "Units and Converting Between Them" },
                    { slug: "sci-p1-l7-significant-figures-and-sensible-rounding", title: "Significant Figures and Sensible Rounding" },
                    { slug: "sci-p1-l8-standard-form-for-very-large-and-very-small-numbers", title: "Standard Form for Very Large and Very Small Numbers" }
                ]
            },
            {
                tag: "Phase 2", title: "Maths in Science",
                lectures: [
                    { slug: "sci-p2-l1-rearranging-a-simple-equation-safely", title: "Rearranging a Simple Equation Safely" },
                    { slug: "sci-p2-l2-ratios-and-proportions-in-a-science-context", title: "Ratios and Proportions in a Science Context" },
                    { slug: "sci-p2-l3-using-the-physics-equation-sheet-effectively", title: "Using the Physics Equation Sheet Effectively" },
                    { slug: "sci-p2-l4-reading-and-drawing-scientific-diagrams", title: "Reading and Drawing Scientific Diagrams" },
                    { slug: "sci-p2-l5-word-equations-and-symbol-equations", title: "Word Equations and Symbol Equations" },
                    { slug: "sci-p2-l6-estimating-and-checking-an-answer-is-reasonable", title: "Estimating and Checking an Answer Is Reasonable" },
                    { slug: "sci-p2-l7-magnification-and-scale-calculations", title: "Magnification and Scale Calculations" }
                ]
            },
            {
                tag: "Phase 3", title: "Extended Answers and Required Practicals",
                lectures: [
                    { slug: "sci-p3-l1-the-6-mark-question-what-level-of-response-marking-means", title: "The 6 Mark Question What Level of Response Marking Means" },
                    { slug: "sci-p3-l2-structuring-a-6-mark-answer-so-examiners-can-follow-it", title: "Structuring a 6 Mark Answer So Examiners Can Follow It" },
                    { slug: "sci-p3-l3-required-practical-write-ups-aim-variables-and-method", title: "Required Practical Write Ups Aim Variables and Method" },
                    { slug: "sci-p3-l4-required-practical-write-ups-results-conclusion-and-evaluation", title: "Required Practical Write Ups Results Conclusion and Evaluation" },
                    { slug: "sci-p3-l5-spotting-and-explaining-an-anomalous-result", title: "Spotting and Explaining an Anomalous Result" },
                    { slug: "sci-p3-l6-writing-a-conclusion-that-actually-uses-the-data-given", title: "Writing a Conclusion That Actually Uses the Data Given" },
                    { slug: "sci-p3-l7-evaluating-a-method-sources-of-error-and-improvements", title: "Evaluating a Method Sources of Error and Improvements" },
                    { slug: "sci-p3-l8-the-foundation-pitfall-vague-command-words-like-things-happen-or-it-changes", title: "The Foundation Pitfall Vague Command Words Like Things Happen or It Changes" }
                ]
            }
        ]
    },

/* ══════════════════════════════════════
       BIOLOGY
    ══════════════════════════════════════ */
    {
        tag: "Biology",
        title: "Biology",
        type: "single",
        pillars: [
            {
                tag: "B1", title: "Cell Level Systems",
                lectures: [
                    { slug: "sci-bio-p1-l1-how-light-microscopes-and-staining-are-used-to-view-cells", title: "How Light Microscopes and Staining Are Used to View Cells" },
                    { slug: "sci-bio-p1-l2-magnification-calculations", title: "Magnification Calculations" },
                    { slug: "sci-bio-p1-l3-sub-cellular-structures-of-animal-and-plant-cells", title: "Sub Cellular Structures of Animal and Plant Cells" },
                    { slug: "sci-bio-p1-l4-sub-cellular-structures-of-prokaryotic-cells", title: "Sub Cellular Structures of Prokaryotic Cells" },
                    { slug: "sci-bio-p1-l5-how-sub-cellular-structures-relate-to-their-functions", title: "How Sub Cellular Structures Relate to Their Functions" },
                    { slug: "sci-bio-p1-l6-dna-structure-double-helix-and-base-pairs", title: "DNA Structure Double Helix and Base Pairs" },
                    { slug: "sci-bio-p1-l7-a-simple-description-of-protein-synthesis", title: "A Simple Description of Protein Synthesis" },
                    { slug: "sci-bio-p1-l8-the-mechanism-of-enzyme-action-lock-and-key", title: "The Mechanism of Enzyme Action Lock and Key" },
                    { slug: "sci-bio-p1-l9-factors-affecting-the-rate-of-enzyme-controlled-reactions", title: "Factors Affecting the Rate of Enzyme Controlled Reactions" },
                    { slug: "sci-bio-p1-l10-cellular-respiration-aerobic-and-anaerobic", title: "Cellular Respiration Aerobic and Anaerobic" },
                    { slug: "sci-bio-p1-l11-photosynthesis-reactants-products-and-location", title: "Photosynthesis Reactants Products and Location" },
                    { slug: "sci-bio-p1-l12-factors-affecting-the-rate-of-photosynthesis", title: "Factors Affecting the Rate of Photosynthesis" },
                    { slug: "sci-bio-p1-l13-investigating-photosynthesis-practical", title: "Investigating Photosynthesis Practical" }
                ]
            },
            {
                tag: "B2", title: "Scaling Up",
                lectures: [
                    { slug: "sci-bio-p2-l1-diffusion-osmosis-and-active-transport", title: "Diffusion Osmosis and Active Transport" },
                    { slug: "sci-bio-p2-l2-mitosis-and-the-cell-cycle", title: "Mitosis and the Cell Cycle" },
                    { slug: "sci-bio-p2-l3-cell-differentiation-and-stem-cells", title: "Cell Differentiation and Stem Cells" },
                    { slug: "sci-bio-p2-l4-surface-area-to-volume-ratio-and-exchange-surfaces", title: "Surface Area to Volume Ratio and Exchange Surfaces" },
                    { slug: "sci-bio-p2-l5-the-human-circulatory-system-heart-and-blood-vessels", title: "The Human Circulatory System Heart and Blood Vessels" },
                    { slug: "sci-bio-p2-l6-how-red-blood-cells-and-plasma-are-adapted-to-their-functions", title: "How Red Blood Cells and Plasma Are Adapted to Their Functions" },
                    { slug: "sci-bio-p2-l7-root-hair-cells-uptake-of-water-and-mineral-ions", title: "Root Hair Cells Uptake of Water and Mineral Ions" },
                    { slug: "sci-bio-p2-l8-xylem-and-phloem-structure-and-function", title: "Xylem and Phloem Structure and Function" },
                    { slug: "sci-bio-p2-l9-transpiration-stomata-and-environmental-factors", title: "Transpiration Stomata and Environmental Factors" },
                    { slug: "sci-bio-p2-l10-using-a-potometer-to-investigate-transpiration-practical", title: "Using a Potometer to Investigate Transpiration Practical" }
                ]
            },
            {
                tag: "B3", title: "Organism Level Systems",
                lectures: [
                    { slug: "sci-bio-p3-l1-structure-and-function-of-the-nervous-system", title: "Structure and Function of the Nervous System" },
                    { slug: "sci-bio-p3-l2-the-reflex-arc-structure-and-function", title: "The Reflex Arc Structure and Function" },
                    { slug: "sci-bio-p3-l3-structure-and-function-of-the-eye", title: "Structure and Function of the Eye" },
                    { slug: "sci-bio-p3-l4-common-defects-of-the-eye-and-corrections", title: "Common Defects of the Eye and Corrections" },
                    { slug: "sci-bio-p3-l5-structure-and-function-of-the-brain", title: "Structure and Function of the Brain" },
                    { slug: "sci-bio-p3-l6-the-endocrine-system-and-hormonal-coordination", title: "The Endocrine System and Hormonal Coordination" },
                    { slug: "sci-bio-p3-l7-the-roles-of-thyroxine-and-adrenaline", title: "The Roles of Thyroxine and Adrenaline" },
                    { slug: "sci-bio-p3-l8-hormones-in-reproduction-and-the-menstrual-cycle", title: "Hormones in Reproduction and the Menstrual Cycle" },
                    { slug: "sci-bio-p3-l9-contraception-hormonal-and-non-hormonal-methods", title: "Contraception Hormonal and Non Hormonal Methods" },
                    { slug: "sci-bio-p3-l10-plant-hormones-auxins-in-phototropism-and-gravitropism", title: "Plant Hormones Auxins in Phototropism and Gravitropism" },
                    { slug: "sci-bio-p3-l11-homeostasis-maintaining-a-constant-internal-environment", title: "Homeostasis Maintaining a Constant Internal Environment" },
                    { slug: "sci-bio-p3-l12-controlling-body-temperature", title: "Controlling Body Temperature" },
                    { slug: "sci-bio-p3-l13-insulin-and-blood-sugar-regulation", title: "Insulin and Blood Sugar Regulation" },
                    { slug: "sci-bio-p3-l14-type-1-and-type-2-diabetes-and-their-treatments", title: "Type 1 and Type 2 Diabetes and Their Treatments" },
                    { slug: "sci-bio-p3-l15-the-kidneys-and-water-balance", title: "The Kidneys and Water Balance" }
                ]
            },
            {
                tag: "B4", title: "Community Level Systems",
                lectures: [
                    { slug: "sci-bio-p4-l1-the-carbon-cycle-and-the-water-cycle", title: "The Carbon Cycle and the Water Cycle" },
                    { slug: "sci-bio-p4-l2-decomposition-and-factors-affecting-its-rate", title: "Decomposition and Factors Affecting Its Rate" },
                    { slug: "sci-bio-p4-l3-levels-of-organisation-in-an-ecosystem", title: "Levels of Organisation in an Ecosystem" },
                    { slug: "sci-bio-p4-l4-abiotic-and-biotic-factors-affecting-communities", title: "Abiotic and Biotic Factors Affecting Communities" },
                    { slug: "sci-bio-p4-l5-adaptations-of-organisms-to-their-environments", title: "Adaptations of Organisms to Their Environments" },
                    { slug: "sci-bio-p4-l6-predator-prey-relationships-and-population-size", title: "Predator Prey Relationships and Population Size" },
                    { slug: "sci-bio-p4-l7-food-chains-food-webs-and-energy-transfer", title: "Food Chains Food Webs and Energy Transfer" },
                    { slug: "sci-bio-p4-l8-the-nitrogen-cycle", title: "The Nitrogen Cycle" },
                    { slug: "sci-bio-p4-l9-investigating-distribution-using-quadrats-and-transects", title: "Investigating Distribution Using Quadrats and Transects" }
                ]
            },
            {
                tag: "B5", title: "Genes, Inheritance and Selection",
                lectures: [
                    { slug: "sci-bio-p5-l1-meiosis-and-the-production-of-gametes", title: "Meiosis and the Production of Gametes" },
                    { slug: "sci-bio-p5-l2-genetic-terminology-and-monohybrid-inheritance", title: "Genetic Terminology and Monohybrid Inheritance" },
                    { slug: "sci-bio-p5-l3-sex-determination-and-inherited-disorders", title: "Sex Determination and Inherited Disorders" },
                    { slug: "sci-bio-p5-l4-environmental-factors-affecting-phenotype", title: "Environmental Factors Affecting Phenotype" },
                    { slug: "sci-bio-p5-l5-darwins-theory-of-evolution-by-natural-selection", title: "Darwin's Theory of Evolution by Natural Selection" },
                    { slug: "sci-bio-p5-l6-evidence-for-evolution-fossils-and-antibiotic-resistance", title: "Evidence for Evolution Fossils and Antibiotic Resistance" },
                    { slug: "sci-bio-p5-l7-selective-breeding-and-genetic-engineering", title: "Selective Breeding and Genetic Engineering" },
                    { slug: "sci-bio-p5-l8-classification-the-three-domain-system", title: "Classification the Three Domain System" }
                ]
            },
            {
                tag: "B6", title: "Global Challenges",
                lectures: [
                    { slug: "sci-bio-p6-l1-human-impacts-on-biodiversity-and-conservation", title: "Human Impacts on Biodiversity and Conservation" },
                    { slug: "sci-bio-p6-l2-global-warming-causes-and-effects", title: "Global Warming Causes and Effects" },
                    { slug: "sci-bio-p6-l3-factors-affecting-food-security", title: "Factors Affecting Food Security" },
                    { slug: "sci-bio-p6-l4-increasing-food-production-sustainably", title: "Increasing Food Production Sustainably" },
                    { slug: "sci-bio-p6-l5-pathogens-and-how-diseases-spread", title: "Pathogens and How Diseases Spread" },
                    { slug: "sci-bio-p6-l6-the-bodys-defence-systems-and-the-immune-response", title: "The Body's Defence Systems and the Immune Response" },
                    { slug: "sci-bio-p6-l7-vaccination-and-antibiotics", title: "Vaccination and Antibiotics" },
                    { slug: "sci-bio-p6-l8-discovery-and-development-of-new-drugs", title: "Discovery and Development of New Drugs" },
                    { slug: "sci-bio-p6-l9-non-communicable-diseases-and-lifestyle-factors", title: "Non Communicable Diseases and Lifestyle Factors" }
                ]
            }
        ]
    }
];