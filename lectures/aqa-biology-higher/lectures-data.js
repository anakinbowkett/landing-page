/* ════════════════════════════════════════════
   Montura Learn — AQA GCSE Combined Science (Foundation)
   Biology
   Single source of truth for the full course structure.
════════════════════════════════════════════ */
function slugToTitle(slug) {
    // NOTE: bare-string fallback only — every lecture below is written as
    // an explicit {slug,title} object, so this should rarely fire.
    // Science slugs use sci-pN-lN- and sci-bio-pN-lN- prefixes, not aqa-...
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
                    { slug: "sci-p0-l2-what-foundation-tier-means-and-why-its-a-real-valid-path", title: "What Foundation Tier Means and Why Its a Real Valid Path" },
                    { slug: "sci-p0-l3-what-the-six-papers-look-like-and-which-covers-what", title: "What the Six Papers Look Like and Which Covers What" },
                    { slug: "sci-p0-l4-what-the-examiner-is-actually-marking-ao1-to-ao3-in-plain-english", title: "What the Examiner Is Actually Marking AO1 to AO3 in Plain English" },
                    { slug: "sci-p0-l5-why-required-practicals-matter-even-in-a-written-exam", title: "Why Required Practicals Matter Even in a Written Exam" },
                    { slug: "sci-p0-l6-what-a-strong-grade-5-answer-looks-like-and-how-you-get-there", title: "What a Strong Grade 5 Answer Looks Like and How You Get There" },
                    { slug: "sci-p0-l7-how-to-use-this-platform", title: "How to Use This Platform" },
                    { slug: "sci-p0-l8-how-to-divide-your-time-across-a-70-mark-75-minute-paper", title: "How to Divide Your Time Across a 70 Mark 75 Minute Paper" }
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
                tag: "B1", title: "Cell Biology",
                lectures: [
                    { slug: "sci-bio-p1-l1-eukaryotic-and-prokaryotic-cells", title: "Eukaryotic and Prokaryotic Cells" },
                    { slug: "sci-bio-p1-l2-animal-and-plant-cell-structures-and-functions", title: "Animal and Plant Cell Structures and Functions" },
                    { slug: "sci-bio-p1-l3-cell-specialisation-sperm-nerve-muscle-root-hair-xylem-and-phloem", title: "Cell Specialisation Sperm Nerve Muscle Root Hair Xylem and Phloem" },
                    { slug: "sci-bio-p1-l4-cell-differentiation-and-its-importance", title: "Cell Differentiation and Its Importance" },
                    { slug: "sci-bio-p1-l5-light-and-electron-microscopy-magnification-and-resolution", title: "Light and Electron Microscopy Magnification and Resolution" },
                    { slug: "sci-bio-p1-l6-magnification-calculations", title: "Magnification Calculations" },
                    { slug: "sci-bio-p1-l7-chromosomes-and-genes", title: "Chromosomes and Genes" },
                    { slug: "sci-bio-p1-l8-the-cell-cycle-and-mitosis", title: "The Cell Cycle and Mitosis" },
                    { slug: "sci-bio-p1-l9-stem-cells-embryonic-adult-and-meristems-in-plants", title: "Stem Cells Embryonic Adult and Meristems in Plants" },
                    { slug: "sci-bio-p1-l10-therapeutic-cloning-and-ethical-issues-of-stem-cell-use", title: "Therapeutic Cloning and Ethical Issues of Stem Cell Use" },
                    { slug: "sci-bio-p1-l11-diffusion-factors-affecting-rate-and-exchange-surfaces", title: "Diffusion Factors Affecting Rate and Exchange Surfaces" },
                    { slug: "sci-bio-p1-l12-surface-area-to-volume-ratio-in-multicellular-organisms", title: "Surface Area to Volume Ratio in Multicellular Organisms" },
                    { slug: "sci-bio-p1-l13-osmosis-investigating-effect-on-plant-tissue", title: "Osmosis Investigating Effect on Plant Tissue" },
                    { slug: "sci-bio-p1-l14-active-transport-differences-from-diffusion-and-osmosis", title: "Active Transport Differences from Diffusion and Osmosis" }
                ]
            },
            {
                tag: "B2", title: "Organisation",
                lectures: [
                    { slug: "sci-bio-p2-l1-cells-tissues-organs-and-organ-systems", title: "Cells Tissues Organs and Organ Systems" },
                    { slug: "sci-bio-p2-l2-enzymes-lock-and-key-model-and-active-site", title: "Enzymes Lock and Key Model and Active Site" },
                    { slug: "sci-bio-p2-l3-effect-of-temperature-and-ph-on-enzyme-activity", title: "Effect of Temperature and pH on Enzyme Activity" },
                    { slug: "sci-bio-p2-l4-the-human-digestive-system", title: "The Human Digestive System" },
                    { slug: "sci-bio-p2-l5-digestive-enzymes-amylase-proteases-and-lipases", title: "Digestive Enzymes Amylase Proteases and Lipases" },
                    { slug: "sci-bio-p2-l6-the-role-of-bile", title: "The Role of Bile" },
                    { slug: "sci-bio-p2-l7-food-tests-benedicts-iodine-and-biuret", title: "Food Tests Benedicts Iodine and Biuret" },
                    { slug: "sci-bio-p2-l8-investigating-the-effect-of-ph-on-amylase", title: "Investigating the Effect of pH on Amylase" },
                    { slug: "sci-bio-p2-l9-the-heart-and-double-circulatory-system", title: "The Heart and Double Circulatory System" },
                    { slug: "sci-bio-p2-l10-blood-vessels-arteries-veins-and-capillaries", title: "Blood Vessels Arteries Veins and Capillaries" },
                    { slug: "sci-bio-p2-l11-components-and-functions-of-blood", title: "Components and Functions of Blood" },
                    { slug: "sci-bio-p2-l12-coronary-heart-disease-stents-statins-and-heart-valves", title: "Coronary Heart Disease Stents Statins and Heart Valves" },
                    { slug: "sci-bio-p2-l13-health-disease-and-their-interactions", title: "Health Disease and Their Interactions" },
                    { slug: "sci-bio-p2-l14-lifestyle-factors-and-non-communicable-diseases", title: "Lifestyle Factors and Non-Communicable Diseases" },
                    { slug: "sci-bio-p2-l15-cancer-benign-and-malignant-tumours", title: "Cancer Benign and Malignant Tumours" },
                    { slug: "sci-bio-p2-l16-plant-tissues-and-their-functions", title: "Plant Tissues and Their Functions" },
                    { slug: "sci-bio-p2-l17-root-hair-cells-xylem-and-phloem-structure-and-function", title: "Root Hair Cells Xylem and Phloem Structure and Function" },
                    { slug: "sci-bio-p2-l18-transpiration-and-translocation", title: "Transpiration and Translocation" },
                    { slug: "sci-bio-p2-l19-stomata-guard-cells-and-factors-affecting-transpiration-rate", title: "Stomata Guard Cells and Factors Affecting Transpiration Rate" }
                ]
            },
            {
                tag: "B3", title: "Infection and Response",
                lectures: [
                    { slug: "sci-bio-p3-l1-pathogens-and-how-diseases-spread", title: "Pathogens and How Diseases Spread" },
                    { slug: "sci-bio-p3-l2-viral-diseases-measles-hiv-and-tobacco-mosaic-virus", title: "Viral Diseases Measles HIV and Tobacco Mosaic Virus" },
                    { slug: "sci-bio-p3-l3-bacterial-diseases-salmonella-and-gonorrhoea", title: "Bacterial Diseases Salmonella and Gonorrhoea" },
                    { slug: "sci-bio-p3-l4-fungal-diseases-rose-black-spot", title: "Fungal Diseases Rose Black Spot" },
                    { slug: "sci-bio-p3-l5-protist-diseases-malaria", title: "Protist Diseases Malaria" },
                    { slug: "sci-bio-p3-l6-the-bodys-non-specific-defence-systems", title: "The Body's Non-Specific Defence Systems" },
                    { slug: "sci-bio-p3-l7-the-immune-system-and-white-blood-cells", title: "The Immune System and White Blood Cells" },
                    { slug: "sci-bio-p3-l8-vaccination-and-how-it-works", title: "Vaccination and How It Works" },
                    { slug: "sci-bio-p3-l9-antibiotics-and-painkillers", title: "Antibiotics and Painkillers" },
                    { slug: "sci-bio-p3-l10-discovery-and-development-of-new-drugs", title: "Discovery and Development of New Drugs" },
                    { slug: "sci-bio-p3-l11-preclinical-and-clinical-drug-trials", title: "Preclinical and Clinical Drug Trials" }
                ]
            },
            {
                tag: "B4", title: "Bioenergetics",
                lectures: [
                    { slug: "sci-bio-p4-l1-photosynthesis-the-reaction-and-word-equation", title: "Photosynthesis — The Reaction and Word Equation" },
                    { slug: "sci-bio-p4-l2-photosynthesis-as-an-endothermic-reaction", title: "Photosynthesis As an Endothermic Reaction" },
                    { slug: "sci-bio-p4-l3-factors-affecting-the-rate-of-photosynthesis", title: "Factors Affecting the Rate of Photosynthesis" },
                    { slug: "sci-bio-p4-l4-investigating-light-intensity-and-photosynthesis", title: "Investigating Light Intensity and Photosynthesis" },
                    { slug: "sci-bio-p4-l5-uses-of-glucose-made-in-photosynthesis", title: "Uses of Glucose Made in Photosynthesis" },
                    { slug: "sci-bio-p4-l6-aerobic-respiration-reaction-and-word-equation", title: "Aerobic Respiration Reaction and Word Equation" },
                    { slug: "sci-bio-p4-l7-anaerobic-respiration-in-muscles", title: "Anaerobic Respiration in Muscles" },
                    { slug: "sci-bio-p4-l8-anaerobic-respiration-in-yeast-fermentation", title: "Anaerobic Respiration in Yeast Fermentation" },
                    { slug: "sci-bio-p4-l9-comparing-aerobic-and-anaerobic-respiration", title: "Comparing Aerobic and Anaerobic Respiration" },
                    { slug: "sci-bio-p4-l10-the-bodys-response-to-exercise", title: "The Body's Response to Exercise" },
                    { slug: "sci-bio-p4-l11-metabolism-and-metabolic-reactions", title: "Metabolism and Metabolic Reactions" }
                ]
            },
            {
                tag: "B5", title: "Homeostasis and Response",
                lectures: [
                    { slug: "sci-bio-p5-l1-what-homeostasis-is-and-why-it-matters", title: "What Homeostasis Is and Why It Matters" },
                    { slug: "sci-bio-p5-l2-the-nervous-system-structure-and-function", title: "The Nervous System Structure and Function" },
                    { slug: "sci-bio-p5-l3-reflex-arcs-and-reflex-actions", title: "Reflex Arcs and Reflex Actions" },
                    { slug: "sci-bio-p5-l4-the-brain-cerebral-cortex-cerebellum-and-medulla", title: "The Brain Cerebral Cortex Cerebellum and Medulla" },
                    { slug: "sci-bio-p5-l5-the-eye-structure-and-function", title: "The Eye Structure and Function" },
                    { slug: "sci-bio-p5-l6-accommodation-focusing-on-near-and-distant-objects", title: "Accommodation Focusing on Near and Distant Objects" },
                    { slug: "sci-bio-p5-l7-correcting-vision-defects", title: "Correcting Vision Defects" },
                    { slug: "sci-bio-p5-l8-control-of-body-temperature", title: "Control of Body Temperature" },
                    { slug: "sci-bio-p5-l9-the-endocrine-system-and-hormones", title: "The Endocrine System and Hormones" },
                    { slug: "sci-bio-p5-l10-blood-glucose-regulation-and-insulin", title: "Blood Glucose Regulation and Insulin" },
                    { slug: "sci-bio-p5-l11-type-1-and-type-2-diabetes", title: "Type 1 and Type 2 Diabetes" },
                    { slug: "sci-bio-p5-l12-water-and-nitrogen-balance-the-kidneys", title: "Water and Nitrogen Balance — The Kidneys" },
                    { slug: "sci-bio-p5-l13-kidney-dialysis-and-transplant", title: "Kidney Dialysis and Transplant" },
                    { slug: "sci-bio-p5-l14-hormones-in-reproduction-the-menstrual-cycle", title: "Hormones in Reproduction — The Menstrual Cycle" },
                    { slug: "sci-bio-p5-l15-fsh-lh-oestrogen-and-progesterone", title: "FSH LH Oestrogen and Progesterone" },
                    { slug: "sci-bio-p5-l16-contraception-hormonal-and-non-hormonal-methods", title: "Contraception Hormonal and Non Hormonal Methods" }
                ]
            },
            {
                tag: "B6", title: "Inheritance, Variation and Evolution",
                lectures: [
                    { slug: "sci-bio-p6-l1-sexual-and-asexual-reproduction", title: "Sexual and Asexual Reproduction" },
                    { slug: "sci-bio-p6-l2-meiosis-and-the-formation-of-gametes", title: "Meiosis and the Formation of Gametes" },
                    { slug: "sci-bio-p6-l3-dna-structure-and-the-genome", title: "DNA Structure and the Genome" },
                    { slug: "sci-bio-p6-l4-genetic-inheritance-key-terminology", title: "Genetic Inheritance Key Terminology" },
                    { slug: "sci-bio-p6-l5-dominant-and-recessive-alleles", title: "Dominant and Recessive Alleles" },
                    { slug: "sci-bio-p6-l6-punnett-squares-and-predicting-outcomes", title: "Punnett Squares and Predicting Outcomes" },
                    { slug: "sci-bio-p6-l7-inherited-disorders-polydactyly-and-cystic-fibrosis", title: "Inherited Disorders Polydactyly and Cystic Fibrosis" },
                    { slug: "sci-bio-p6-l8-sex-determination", title: "Sex Determination" },
                    { slug: "sci-bio-p6-l9-variation-genetic-and-environmental-causes", title: "Variation Genetic and Environmental Causes" },
                    { slug: "sci-bio-p6-l10-evolution-by-natural-selection", title: "Evolution by Natural Selection" },
                    { slug: "sci-bio-p6-l11-selective-breeding", title: "Selective Breeding" },
                    { slug: "sci-bio-p6-l12-genetic-engineering-and-gm-crops", title: "Genetic Engineering and GM Crops" },
                    { slug: "sci-bio-p6-l13-cloning-tissue-culture-cuttings-and-embryo-transplants", title: "Cloning Tissue Culture Cuttings and Embryo Transplants" },
                    { slug: "sci-bio-p6-l14-darwin-and-the-theory-of-evolution", title: "Darwin and the Theory of Evolution" },
                    { slug: "sci-bio-p6-l15-evidence-for-evolution-fossils-and-antibiotic-resistance", title: "Evidence for Evolution Fossils and Antibiotic Resistance" },
                    { slug: "sci-bio-p6-l16-extinction-and-its-causes", title: "Extinction and Its Causes" },
                    { slug: "sci-bio-p6-l17-antibiotic-resistant-bacteria-and-mrsa", title: "Antibiotic Resistant Bacteria and MRSA" },
                    { slug: "sci-bio-p6-l18-classification-linnaeus-and-the-three-domain-system", title: "Classification Linnaeus and the Three Domain System" }
                ]
            },
            {
                tag: "B7", title: "Ecology",
                lectures: [
                    { slug: "sci-bio-p7-l1-ecosystems-communities-and-interdependence", title: "Ecosystems Communities and Interdependence" },
                    { slug: "sci-bio-p7-l2-competition-in-animals-and-plants", title: "Competition in Animals and Plants" },
                    { slug: "sci-bio-p7-l3-abiotic-factors-and-their-effects-on-communities", title: "Abiotic Factors and Their Effects on Communities" },
                    { slug: "sci-bio-p7-l4-biotic-factors-and-their-effects-on-communities", title: "Biotic Factors and Their Effects on Communities" },
                    { slug: "sci-bio-p7-l5-adaptations-structural-behavioural-and-functional", title: "Adaptations Structural Behavioural and Functional" },
                    { slug: "sci-bio-p7-l6-predator-prey-relationships", title: "Predator Prey Relationships" },
                    { slug: "sci-bio-p7-l7-food-chains-food-webs-and-energy-transfer", title: "Food Chains Food Webs and Energy Transfer" },
                    { slug: "sci-bio-p7-l8-the-carbon-cycle", title: "The Carbon Cycle" },
                    { slug: "sci-bio-p7-l9-the-water-cycle", title: "The Water Cycle" },
                    { slug: "sci-bio-p7-l10-the-nitrogen-cycle-and-decomposition", title: "The Nitrogen Cycle and Decomposition" },
                    { slug: "sci-bio-p7-l11-factors-affecting-the-rate-of-decomposition", title: "Factors Affecting the Rate of Decomposition" },
                    { slug: "sci-bio-p7-l12-human-impacts-on-biodiversity", title: "Human Impacts on Biodiversity" },
                    { slug: "sci-bio-p7-l13-deforestation-and-land-use", title: "Deforestation and Land Use" },
                    { slug: "sci-bio-p7-l14-global-warming-and-climate-change", title: "Global Warming and Climate Change" },
                    { slug: "sci-bio-p7-l15-conservation-and-maintaining-biodiversity", title: "Conservation and Maintaining Biodiversity" },
                    { slug: "sci-bio-p7-l16-trophic-levels-and-the-efficiency-of-energy-transfer", title: "Trophic Levels and the Efficiency of Energy Transfer" },
                    { slug: "sci-bio-p7-l17-biomass-and-pyramids-of-biomass", title: "Biomass and Pyramids of Biomass" }
                ]
            }
        ]
    }
];
