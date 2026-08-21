/* ════════════════════════════════════════════
   Montura Learn — OCR GCSE Combined Science (Foundation)
   Chemistry
   Single source of truth for the full course structure.

   NOTE: This zip contained no Phase 0–3 universal-science-skills files
   (unlike AQA's equivalent delivery, which had 32). Flagging so this
   isn't silently incomplete — same note as Edexcel Chemistry.
════════════════════════════════════════════ */
function slugToTitle(slug) {
    // NOTE: bare-string fallback only — every lecture below is written as
    // an explicit {slug,title} object, so this should rarely fire.
    return slug
        .replace(/^sci-(?:chem-)?p\d+-l\d+-/, '')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
}

const papersData = [

/* ══════════════════════════════════════
       CHEMISTRY
    ══════════════════════════════════════ */
    {
        tag: "Chemistry",
        title: "Chemistry",
        type: "single",
        pillars: [
            {
                tag: "C1", title: "Particles",
                lectures: [
                    { slug: "sci-chem-p1-l1-the-particle-model-and-states-of-matter", title: "The Particle Model and States of Matter" },
                    { slug: "sci-chem-p1-l2-changes-of-state-and-particle-behaviour", title: "Changes of State and Particle Behaviour" },
                    { slug: "sci-chem-p1-l3-how-the-atomic-model-changed-over-time", title: "How the Atomic Model Changed Over Time" },
                    { slug: "sci-chem-p1-l4-structure-of-the-atom-protons-neutrons-and-electrons", title: "Structure of the Atom Protons Neutrons and Electrons" },
                    { slug: "sci-chem-p1-l5-atomic-number-mass-number-and-isotopes", title: "Atomic Number Mass Number and Isotopes" }
                ]
            },
            {
                tag: "C2", title: "Elements, Compounds and Mixtures",
                lectures: [
                    { slug: "sci-chem-p2-l1-pure-substances-and-mixtures", title: "Pure Substances and Mixtures" },
                    { slug: "sci-chem-p2-l2-identifying-pure-substances-and-measuring-purity", title: "Identifying Pure Substances and Measuring Purity" },
                    { slug: "sci-chem-p2-l3-separating-mixtures-filtration-distillation-and-crystallisation", title: "Separating Mixtures Filtration Distillation and Crystallisation" },
                    { slug: "sci-chem-p2-l4-chromatography-and-rf-values", title: "Chromatography and Rf Values" },
                    { slug: "sci-chem-p2-l5-metals-and-non-metals-and-their-properties", title: "Metals and Non Metals and Their Properties" },
                    { slug: "sci-chem-p2-l6-the-periodic-table-and-electronic-configuration", title: "The Periodic Table and Electronic Configuration" },
                    { slug: "sci-chem-p2-l7-ionic-bonding-and-dot-and-cross-diagrams", title: "Ionic Bonding and Dot and Cross Diagrams" },
                    { slug: "sci-chem-p2-l8-covalent-bonding-and-dot-and-cross-diagrams", title: "Covalent Bonding and Dot and Cross Diagrams" },
                    { slug: "sci-chem-p2-l9-properties-of-ionic-compounds-and-simple-molecules", title: "Properties of Ionic Compounds and Simple Molecules" },
                    { slug: "sci-chem-p2-l10-giant-covalent-structures-diamond-graphite-and-graphene", title: "Giant Covalent Structures Diamond Graphite and Graphene" },
                    { slug: "sci-chem-p2-l11-metallic-bonding-metals-and-alloys", title: "Metallic Bonding Metals and Alloys" },
                    { slug: "sci-chem-p2-l12-relative-formula-mass-and-empirical-formulae", title: "Relative Formula Mass and Empirical Formulae" },
                    { slug: "sci-chem-p2-l13-conservation-of-mass-and-balancing-equations", title: "Conservation of Mass and Balancing Equations" },
                    { slug: "sci-chem-p2-l14-calculating-masses-from-balanced-equations", title: "Calculating Masses from Balanced Equations" }
                ]
            },
            {
                tag: "C3", title: "Chemical Reactions",
                lectures: [
                    { slug: "sci-chem-p3-l1-introducing-chemical-reactions-and-writing-symbol-equations", title: "Introducing Chemical Reactions and Writing Symbol Equations" },
                    { slug: "sci-chem-p3-l2-acids-alkalis-and-the-ph-scale", title: "Acids Alkalis and the pH Scale" },
                    { slug: "sci-chem-p3-l3-reactions-of-acids-with-metals", title: "Reactions of Acids with Metals" },
                    { slug: "sci-chem-p3-l4-reactions-of-acids-with-metal-oxides-and-hydroxides", title: "Reactions of Acids with Metal Oxides and Hydroxides" },
                    { slug: "sci-chem-p3-l5-reactions-of-acids-with-carbonates", title: "Reactions of Acids with Carbonates" },
                    { slug: "sci-chem-p3-l6-neutralisation-and-preparing-pure-soluble-salts", title: "Neutralisation and Preparing Pure Soluble Salts" },
                    { slug: "sci-chem-p3-l7-exothermic-and-endothermic-reactions", title: "Exothermic and Endothermic Reactions" },
                    { slug: "sci-chem-p3-l8-energy-transfer-and-temperature-change-in-reactions", title: "Energy Transfer and Temperature Change in Reactions" },
                    { slug: "sci-chem-p3-l9-reaction-profiles-and-activation-energy", title: "Reaction Profiles and Activation Energy" },
                    { slug: "sci-chem-p3-l10-electrolysis-principles-electrodes-electrolytes-and-ions", title: "Electrolysis Principles Electrodes Electrolytes and Ions" },
                    { slug: "sci-chem-p3-l11-products-of-electrolysis-and-predicting-electrode-products", title: "Products of Electrolysis and Predicting Electrode Products" },
                    { slug: "sci-chem-p3-l12-half-equations-and-electron-transfer-in-electrolysis", title: "Half Equations and Electron Transfer in Electrolysis" }
                ]
            },
            {
                tag: "C4", title: "Predicting and Identifying Reactions and Products",
                lectures: [
                    { slug: "sci-chem-p4-l1-groups-1-7-and-0-properties-and-periodic-trends", title: "Groups 1 7 and 0 Properties and Periodic Trends" },
                    { slug: "sci-chem-p4-l2-group-1-alkali-metals-and-reactivity-trends", title: "Group 1 Alkali Metals and Reactivity Trends" },
                    { slug: "sci-chem-p4-l3-group-7-halogen-properties-and-reactivity-trends", title: "Group 7 Halogen Properties and Reactivity Trends" },
                    { slug: "sci-chem-p4-l4-group-7-displacement-reactions", title: "Group 7 Displacement Reactions" },
                    { slug: "sci-chem-p4-l5-group-0-noble-gases-and-inertness", title: "Group 0 Noble Gases and Inertness" },
                    { slug: "sci-chem-p4-l6-the-reactivity-series-and-metal-reactivity", title: "The Reactivity Series and Metal Reactivity" },
                    { slug: "sci-chem-p4-l7-predicting-metal-reactions-with-water-and-dilute-acids", title: "Predicting Metal Reactions with Water and Dilute Acids" },
                    { slug: "sci-chem-p4-l8-displacement-reactions-of-metals-and-metal-salts", title: "Displacement Reactions of Metals and Metal Salts" },
                    { slug: "sci-chem-p4-l9-deducing-reactivity-from-experimental-results", title: "Deducing Reactivity from Experimental Results" },
                    { slug: "sci-chem-p4-l10-testing-for-common-gases", title: "Testing for Common Gases" }
                ]
            },
            {
                tag: "C5", title: "Monitoring and Controlling Chemical Reactions",
                lectures: [
                    { slug: "sci-chem-p5-l1-measuring-and-calculating-rate-of-reaction", title: "Measuring and Calculating Rate of Reaction" },
                    { slug: "sci-chem-p5-l2-interpreting-rate-of-reaction-graphs-and-gradients", title: "Interpreting Rate of Reaction Graphs and Gradients" },
                    { slug: "sci-chem-p5-l3-factors-affecting-rate-temperature-concentration-pressure-and-surface-area", title: "Factors Affecting Rate Temperature Concentration Pressure and Surface Area" },
                    { slug: "sci-chem-p5-l4-collision-theory-and-explaining-changes-in-reaction-rate", title: "Collision Theory and Explaining Changes in Reaction Rate" },
                    { slug: "sci-chem-p5-l5-catalysts-and-activation-energy", title: "Catalysts and Activation Energy" },
                    { slug: "sci-chem-p5-l6-reversible-reactions-and-dynamic-equilibrium", title: "Reversible Reactions and Dynamic Equilibrium" },
                    { slug: "sci-chem-p5-l7-le-chateliers-principle-and-equilibrium-position", title: "Le Chateliers Principle and Equilibrium Position" },
                    { slug: "sci-chem-p5-l8-choosing-conditions-to-maximise-product-yield", title: "Choosing Conditions to Maximise Product Yield" }
                ]
            },
            {
                tag: "C6", title: "Global Challenges",
                lectures: [
                    { slug: "sci-chem-p6-l1-extracting-metals-using-carbon", title: "Extracting Metals Using Carbon" },
                    { slug: "sci-chem-p6-l2-extracting-metals-by-electrolysis", title: "Extracting Metals by Electrolysis" },
                    { slug: "sci-chem-p6-l3-biological-methods-of-metal-extraction-bacterial-and-phytoextraction", title: "Biological Methods of Metal Extraction Bacterial and Phytoextraction" },
                    { slug: "sci-chem-p6-l4-life-cycle-assessments-and-evaluating-environmental-impact", title: "Life Cycle Assessments and Evaluating Environmental Impact" },
                    { slug: "sci-chem-p6-l5-recycling-materials-and-factors-affecting-recycling-decisions", title: "Recycling Materials and Factors Affecting Recycling Decisions" },
                    { slug: "sci-chem-p6-l6-crude-oil-and-fractional-distillation", title: "Crude Oil and Fractional Distillation" },
                    { slug: "sci-chem-p6-l7-hydrocarbon-fractions-alkanes-and-their-properties", title: "Hydrocarbon Fractions Alkanes and Their Properties" },
                    { slug: "sci-chem-p6-l8-crude-oil-as-a-finite-resource-and-petrochemical-feedstock", title: "Crude Oil as a Finite Resource and Petrochemical Feedstock" },
                    { slug: "sci-chem-p6-l9-cracking-and-producing-more-useful-hydrocarbons", title: "Cracking and Producing More Useful Hydrocarbons" },
                    { slug: "sci-chem-p6-l10-the-earths-early-atmosphere-and-how-it-formed", title: "The Earth's Early Atmosphere and How It Formed" },
                    { slug: "sci-chem-p6-l11-development-of-an-oxygen-rich-atmosphere", title: "Development of an Oxygen Rich Atmosphere" },
                    { slug: "sci-chem-p6-l12-the-greenhouse-effect-and-greenhouse-gases", title: "The Greenhouse Effect and Greenhouse Gases" },
                    { slug: "sci-chem-p6-l13-evidence-for-human-caused-climate-change-and-uncertainty", title: "Evidence for Human Caused Climate Change and Uncertainty" },
                    { slug: "sci-chem-p6-l14-effects-of-increased-carbon-dioxide-and-methane-and-mitigation", title: "Effects of Increased Carbon Dioxide and Methane and Mitigation" },
                    { slug: "sci-chem-p6-l15-combustion-pollutants-carbon-monoxide-sulfur-dioxide-nitrogen-oxides-and-particulates", title: "Combustion Pollutants Carbon Monoxide Sulfur Dioxide Nitrogen Oxides and Particulates" },
                    { slug: "sci-chem-p6-l16-potable-water-and-separation-methods-for-making-water-available", title: "Potable Water and Separation Methods for Making Water Available" }
                ]
            }
        ]
    }
];