// OCR Combined Science A (Gateway): Chemistry (Higher Tier) — lectures-data.js
// Built from 151 real files: 120 Chemistry-specific + 31 shared Foundations/Working Scientifically
// lectures (identical set reused from Biology/Physics — confirmed byte-for-byte identical
// filenames across zips, not subject-specific).
// sci-chem-p1-p6 map to OCR's real topics: Paper 1 = C1 Particles, C2 Elements Compounds and
// Mixtures, C3 Chemical Reactions. Paper 2 = C4 Predicting and Identifying Reactions and
// Products, C5 Monitoring and Controlling Chemical Reactions, C6 Global Challenges.

var papersData = [
  {
    type: "single",
    tag: "FOUNDATION",
    title: "Foundations",
    pillars: [
      {
        tag: "Foundations",
        title: "Getting Started",
        lectures: [
          { slug: "sci-p0-l1-what-combined-science-actually-is-two-gcses-one-course", title: "What Combined Science Actually Is Two Gcses One Course" },
          { slug: "sci-p0-l2-what-foundation-tier-means-and-why-its-a-real-valid-path", title: "What Foundation Tier Means and Why Its a Real Valid Path" },
          { slug: "sci-p0-l3-what-the-six-papers-look-like-and-which-covers-what", title: "What the Six Papers Look Like and Which Covers What" },
          { slug: "sci-p0-l4-what-the-examiner-is-actually-marking-ao1-to-ao3-in-plain-english", title: "What the Examiner Is Actually Marking AO1 to AO3 in Plain English" },
          { slug: "sci-p0-l5-why-core-practicals-matter-even-in-a-written-exam", title: "Why Core Practicals Matter Even in a Written Exam" },
          { slug: "sci-p0-l6-what-a-strong-grade-5-answer-looks-like-and-how-you-get-there", title: "What a Strong Grade 5 Answer Looks Like and How You Get There" },
          { slug: "sci-p0-l7-how-to-use-this-platform", title: "How to Use This Platform" },
          { slug: "sci-p0-l8-how-to-divide-your-time-across-a-60-mark-70-minute-paper", title: "How to Divide Your Time Across a 60 Mark 70 Minute Paper" }
        ]
      }
    ]
  },
  {
    type: "single",
    tag: "SKILLS",
    title: "Working Scientifically",
    pillars: [
      {
        tag: "Skills · Command Words & Data",
        title: "Reading, Command Words & Data",
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
        tag: "Skills · Maths & Equations",
        title: "Maths, Equations & Diagrams",
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
        tag: "Skills · Exam Technique",
        title: "Exam Technique & Required Practicals",
        lectures: [
          { slug: "sci-p3-l1-the-6-mark-question-what-level-of-response-marking-means", title: "The 6 Mark Question What Level of Response Marking Means" },
          { slug: "sci-p3-l2-structuring-a-6-mark-answer-so-examiners-can-follow-it", title: "Structuring a 6 Mark Answer so Examiners Can Follow It" },
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
  {
    type: "single",
    tag: "PAPER 1",
    title: "Chemistry Paper 1",
    pillars: [
      {
        tag: "Topic C1",
        title: "Particles",
        lectures: [
          { slug: "sci-chem-p1-l3-changes-of-state-and-energy-transfers", title: "Changes of State and Energy Transfers" },
          { slug: "sci-chem-p1-l4-diffusion-and-particle-motion", title: "Diffusion and Particle Motion" },
          { slug: "sci-chem-p1-l7-structure-of-the-atom-protons-neutrons-and-electrons", title: "Structure of the Atom Protons Neutrons and Electrons" },
          { slug: "sci-chem-p1-l8-relative-charge-and-mass-of-subatomic-particles", title: "Relative Charge and Mass of Subatomic Particles" },
          { slug: "sci-chem-p1-l9-atomic-number-and-mass-number", title: "Atomic Number and Mass Number" },
          { slug: "sci-chem-p1-l10-isotopes-and-nuclear-notation", title: "Isotopes and Nuclear Notation" },
          { slug: "sci-chem-p1-l11-electronic-structure-of-atoms", title: "Electronic Structure of Atoms" },
          { slug: "sci-chem-p1-l12-electronic-configuration-and-the-periodic-table", title: "Electronic Configuration and the Periodic Table" },
          { slug: "sci-chem-p1-l13-relative-atomic-mass", title: "Relative Atomic Mass" },
          { slug: "sci-chem-p1-l14-calculating-relative-atomic-mass-from-isotope-abundances", title: "Calculating Relative Atomic Mass from Isotope Abundances" }
        ]
      },
      {
        tag: "Topic C2",
        title: "Elements, Compounds and Mixtures",
        lectures: [
          { slug: "sci-chem-p2-l1-pure-substances-and-mixtures", title: "Pure Substances and Mixtures" },
          { slug: "sci-chem-p2-l2-elements-compounds-and-mixtures", title: "Elements Compounds and Mixtures" },
          { slug: "sci-chem-p2-l3-purity-and-melting-point-data", title: "Purity and Melting Point Data" },
          { slug: "sci-chem-p2-l4-chromatography-and-separating-mixtures", title: "Chromatography and Separating Mixtures" },
          { slug: "sci-chem-p2-l5-interpreting-chromatograms-and-rf-values", title: "Interpreting Chromatograms and Rf Values" },
          { slug: "sci-chem-p2-l6-filtration-crystallisation-and-evaporation", title: "Filtration Crystallisation and Evaporation" },
          { slug: "sci-chem-p2-l7-simple-distillation", title: "Simple Distillation" },
          { slug: "sci-chem-p2-l8-fractional-distillation", title: "Fractional Distillation" },
          { slug: "sci-chem-p2-l9-atomic-bonding-and-chemical-bonds", title: "Atomic Bonding and Chemical Bonds" },
          { slug: "sci-chem-p2-l10-ionic-bonding-and-formation-of-ions", title: "Ionic Bonding and Formation of Ions" },
          { slug: "sci-chem-p2-l11-ionic-lattices-and-properties-of-ionic-compounds", title: "Ionic Lattices and Properties of Ionic Compounds" },
          { slug: "sci-chem-p2-l12-covalent-bonding-and-shared-electrons", title: "Covalent Bonding and Shared Electrons" },
          { slug: "sci-chem-p2-l13-simple-molecular-covalent-substances", title: "Simple Molecular Covalent Substances" },
          { slug: "sci-chem-p2-l14-giant-covalent-structures", title: "Giant Covalent Structures" },
          { slug: "sci-chem-p2-l15-metallic-bonding-and-properties-of-metals", title: "Metallic Bonding and Properties of Metals" },
          { slug: "sci-chem-p2-l16-comparing-bonding-and-properties-of-materials", title: "Comparing Bonding and Properties of Materials" },
          { slug: "sci-chem-p2-l17-polymers-and-their-properties", title: "Polymers and Their Properties" },
          { slug: "sci-chem-p2-l18-nanoparticles-and-their-properties", title: "Nanoparticles and Their Properties" },
          { slug: "sci-chem-p2-l19-properties-of-materials-and-their-uses", title: "Properties of Materials and Their Uses" },
          { slug: "sci-chem-p2-l20-graphene-and-other-carbon-structures", title: "Graphene and Other Carbon Structures" }
        ]
      },
      {
        tag: "Topic C3",
        title: "Chemical Reactions",
        lectures: [
          { slug: "sci-chem-p3-l1-chemical-reactions-and-chemical-equations", title: "Chemical Reactions and Chemical Equations" },
          { slug: "sci-chem-p3-l2-word-equations-and-symbol-equations", title: "Word Equations and Symbol Equations" },
          { slug: "sci-chem-p3-l3-balancing-chemical-equations", title: "Balancing Chemical Equations" },
          { slug: "sci-chem-p3-l4-conservation-of-mass-in-chemical-reactions", title: "Conservation of Mass in Chemical Reactions" },
          { slug: "sci-chem-p3-l5-oxidation-and-reduction", title: "Oxidation and Reduction" },
          { slug: "sci-chem-p3-l6-exothermic-and-endothermic-reactions", title: "Exothermic and Endothermic Reactions" },
          { slug: "sci-chem-p3-l7-energy-transfers-in-chemical-reactions", title: "Energy Transfers in Chemical Reactions" },
          { slug: "sci-chem-p3-l8-reaction-profiles-and-activation-energy", title: "Reaction Profiles and Activation Energy" },
          { slug: "sci-chem-p3-l9-bond-breaking-and-bond-making", title: "Bond Breaking and Bond Making" },
          { slug: "sci-chem-p3-l10-calculating-energy-changes-from-bond-energies", title: "Calculating Energy Changes from Bond Energies" },
          { slug: "sci-chem-p3-l11-acids-alkalis-and-neutralisation", title: "Acids Alkalis and Neutralisation" },
          { slug: "sci-chem-p3-l12-ph-scale-and-indicators", title: "Ph Scale and Indicators" },
          { slug: "sci-chem-p3-l13-acids-reacting-with-metals", title: "Acids Reacting with Metals" },
          { slug: "sci-chem-p3-l14-acids-reacting-with-metal-oxides-and-hydroxides", title: "Acids Reacting with Metal Oxides and Hydroxides" },
          { slug: "sci-chem-p3-l15-acids-reacting-with-carbonates", title: "Acids Reacting with Carbonates" },
          { slug: "sci-chem-p3-l16-tests-for-hydrogen-and-carbon-dioxide", title: "Tests for Hydrogen and Carbon Dioxide" },
          { slug: "sci-chem-p3-l17-preparing-soluble-salts", title: "Preparing Soluble Salts" },
          { slug: "sci-chem-p3-l18-purifying-and-crystallising-soluble-salts", title: "Purifying and Crystallising Soluble Salts" },
          { slug: "sci-chem-p3-l19-preparing-insoluble-salts-by-precipitation", title: "Preparing Insoluble Salts By Precipitation" },
          { slug: "sci-chem-p3-l20-electrolysis-and-the-movement-of-ions", title: "Electrolysis and the Movement of Ions" },
          { slug: "sci-chem-p3-l21-electrolysis-of-molten-ionic-compounds", title: "Electrolysis of Molten Ionic Compounds" },
          { slug: "sci-chem-p3-l22-electrolysis-of-aqueous-solutions", title: "Electrolysis of Aqueous Solutions" },
          { slug: "sci-chem-p3-l23-products-at-the-electrodes", title: "Products at the Electrodes" },
          { slug: "sci-chem-p3-l24-electrolysis-using-inert-and-non-inert-electrodes", title: "Electrolysis Using Inert and Non Inert Electrodes" },
          { slug: "sci-chem-p3-l25-half-equations-in-electrolysis", title: "Half Equations in Electrolysis" },
          { slug: "sci-chem-p3-l26-electrolysis-of-sodium-chloride-solution", title: "Electrolysis of Sodium Chloride Solution" },
          { slug: "sci-chem-p3-l27-electrolysis-of-copper-sulfate-solution", title: "Electrolysis of Copper Sulfate Solution" },
          { slug: "sci-chem-p3-l28-electrolysis-and-metal-purification", title: "Electrolysis and Metal Purification" }
        ]
      }
    ]
  },
  {
    type: "single",
    tag: "PAPER 2",
    title: "Chemistry Paper 2",
    pillars: [
      {
        tag: "Topic C4",
        title: "Predicting and Identifying Reactions and Products",
        lectures: [
          { slug: "sci-chem-p4-l1-the-periodic-table-and-predicting-chemical-reactions", title: "The Periodic Table and Predicting Chemical Reactions" },
          { slug: "sci-chem-p4-l2-properties-of-group-1-elements", title: "Properties of Group 1 Elements" },
          { slug: "sci-chem-p4-l3-properties-of-group-7-elements", title: "Properties of Group 7 Elements" },
          { slug: "sci-chem-p4-l4-properties-of-group-0-elements", title: "Properties of Group 0 Elements" },
          { slug: "sci-chem-p4-l5-electronic-structure-and-group-properties", title: "Electronic Structure and Group Properties" },
          { slug: "sci-chem-p4-l6-trends-in-reactivity-down-groups", title: "Trends in Reactivity Down Groups" },
          { slug: "sci-chem-p4-l7-predicting-reactions-from-periodic-table-position", title: "Predicting Reactions from Periodic Table Position" },
          { slug: "sci-chem-p4-l8-reactivity-of-metals-with-water", title: "Reactivity of Metals with Water" },
          { slug: "sci-chem-p4-l9-reactivity-of-metals-with-dilute-acids", title: "Reactivity of Metals with Dilute Acids" },
          { slug: "sci-chem-p4-l10-metal-reactivity-and-formation-of-positive-ions", title: "Metal Reactivity and Formation of Positive Ions" },
          { slug: "sci-chem-p4-l11-displacement-reactions-between-metals-and-metal-salts", title: "Displacement Reactions Between Metals and Metal Salts" },
          { slug: "sci-chem-p4-l12-deducing-the-reactivity-series-from-experimental-results", title: "Deducing the Reactivity Series from Experimental Results" },
          { slug: "sci-chem-p4-l13-halogen-displacement-reactions", title: "Halogen Displacement Reactions" },
          { slug: "sci-chem-p4-l14-predicting-products-of-displacement-reactions", title: "Predicting Products of Displacement Reactions" },
          { slug: "sci-chem-p4-l15-oxidation-and-reduction-in-displacement-reactions", title: "Oxidation and Reduction in Displacement Reactions" },
          { slug: "sci-chem-p4-l16-identifying-unknown-substances-from-reaction-results", title: "Identifying Unknown Substances from Reaction Results" }
        ]
      },
      {
        tag: "Topic C5",
        title: "Monitoring and Controlling Chemical Reactions",
        lectures: [
          { slug: "sci-chem-p5-l1-rate-of-reaction-and-how-it-is-measured", title: "Rate of Reaction and How It Is Measured" },
          { slug: "sci-chem-p5-l2-calculating-rate-from-time-and-measured-change", title: "Calculating Rate from Time and Measured Change" },
          { slug: "sci-chem-p5-l3-rate-of-reaction-graphs", title: "Rate of Reaction Graphs" },
          { slug: "sci-chem-p5-l4-gradients-and-initial-rates", title: "Gradients and Initial Rates" },
          { slug: "sci-chem-p5-l5-effect-of-temperature-on-reaction-rate", title: "Effect of Temperature on Reaction Rate" },
          { slug: "sci-chem-p5-l6-temperature-and-frequency-and-energy-of-collisions", title: "Temperature and Frequency and Energy of Collisions" },
          { slug: "sci-chem-p5-l7-effect-of-concentration-on-reaction-rate", title: "Effect of Concentration on Reaction Rate" },
          { slug: "sci-chem-p5-l8-concentration-and-particle-collisions", title: "Concentration and Particle Collisions" },
          { slug: "sci-chem-p5-l9-effect-of-pressure-on-reaction-rate", title: "Effect of Pressure on Reaction Rate" },
          { slug: "sci-chem-p5-l10-pressure-and-particle-collisions", title: "Pressure and Particle Collisions" },
          { slug: "sci-chem-p5-l11-effect-of-surface-area-on-reaction-rate", title: "Effect of Surface Area on Reaction Rate" },
          { slug: "sci-chem-p5-l12-surface-area-to-volume-ratio-and-reaction-rate", title: "Surface Area to Volume Ratio and Reaction Rate" },
          { slug: "sci-chem-p5-l13-collision-theory-and-successful-collisions", title: "Collision Theory and Successful Collisions" },
          { slug: "sci-chem-p5-l14-catalysts-and-their-effect-on-reaction-rate", title: "Catalysts and Their Effect on Reaction Rate" },
          { slug: "sci-chem-p5-l15-identifying-catalysts-in-reactions", title: "Identifying Catalysts in Reactions" },
          { slug: "sci-chem-p5-l16-catalysts-and-activation-energy", title: "Catalysts and Activation Energy" },
          { slug: "sci-chem-p5-l17-enzymes-as-biological-catalysts", title: "Enzymes as Biological Catalysts" },
          { slug: "sci-chem-p5-l18-reversible-reactions", title: "Reversible Reactions" },
          { slug: "sci-chem-p5-l19-dynamic-equilibrium-in-closed-systems", title: "Dynamic Equilibrium in Closed Systems" },
          { slug: "sci-chem-p5-l20-equilibrium-position-and-changing-conditions", title: "Equilibrium Position and Changing Conditions" },
          { slug: "sci-chem-p5-l21-le-chateliers-principle", title: "Le Chateliers Principle" },
          { slug: "sci-chem-p5-l22-effect-of-concentration-on-equilibrium", title: "Effect of Concentration on Equilibrium" },
          { slug: "sci-chem-p5-l23-effect-of-temperature-on-equilibrium", title: "Effect of Temperature on Equilibrium" },
          { slug: "sci-chem-p5-l24-effect-of-pressure-on-equilibrium", title: "Effect of Pressure on Equilibrium" },
          { slug: "sci-chem-p5-l25-choosing-conditions-to-maximise-product-yield", title: "Choosing Conditions to Maximise Product Yield" },
          { slug: "sci-chem-p5-l26-industrial-equilibrium-and-process-optimisation", title: "Industrial Equilibrium and Process Optimisation" }
        ]
      },
      {
        tag: "Topic C6",
        title: "Global Challenges",
        lectures: [
          { slug: "sci-chem-p6-l1-using-chemistry-to-improve-processes-and-products", title: "Using Chemistry to Improve Processes and Products" },
          { slug: "sci-chem-p6-l2-extraction-and-use-of-raw-materials", title: "Extraction and Use of Raw Materials" },
          { slug: "sci-chem-p6-l3-economic-environmental-and-social-factors-in-chemical-processes", title: "Economic Environmental and Social Factors in Chemical Processes" },
          { slug: "sci-chem-p6-l4-recycling-and-reusing-materials", title: "Recycling and Reusing Materials" },
          { slug: "sci-chem-p6-l5-sustainable-use-of-resources", title: "Sustainable Use of Resources" },
          { slug: "sci-chem-p6-l6-developing-new-materials-and-products", title: "Developing New Materials and Products" },
          { slug: "sci-chem-p6-l7-properties-of-materials-and-designing-for-a-purpose", title: "Properties of Materials and Designing for a Purpose" },
          { slug: "sci-chem-p6-l8-life-cycle-assessment-of-products", title: "Life Cycle Assessment of Products" },
          { slug: "sci-chem-p6-l9-evaluating-life-cycle-assessment-data", title: "Evaluating Life Cycle Assessment Data" },
          { slug: "sci-chem-p6-l10-atmosphere-and-chemical-composition", title: "Atmosphere and Chemical Composition" },
          { slug: "sci-chem-p6-l11-the-composition-of-earths-atmosphere", title: "The Composition of Earths Atmosphere" },
          { slug: "sci-chem-p6-l12-greenhouse-gases-and-the-greenhouse-effect", title: "Greenhouse Gases and the Greenhouse Effect" },
          { slug: "sci-chem-p6-l13-human-activities-and-climate-change", title: "Human Activities and Climate Change" },
          { slug: "sci-chem-p6-l14-evidence-for-human-induced-climate-change", title: "Evidence for Human Induced Climate Change" },
          { slug: "sci-chem-p6-l15-carbon-dioxide-and-global-temperature", title: "Carbon Dioxide and Global Temperature" },
          { slug: "sci-chem-p6-l16-pollutants-from-burning-fuels", title: "Pollutants from Burning Fuels" },
          { slug: "sci-chem-p6-l17-carbon-monoxide-sulfur-dioxide-and-nitrogen-oxides", title: "Carbon Monoxide Sulfur Dioxide and Nitrogen Oxides" },
          { slug: "sci-chem-p6-l18-particulates-and-their-environmental-effects", title: "Particulates and Their Environmental Effects" },
          { slug: "sci-chem-p6-l19-reducing-air-pollution", title: "Reducing Air Pollution" },
          { slug: "sci-chem-p6-l20-alternative-fuels-and-energy-sources", title: "Alternative Fuels and Energy Sources" }
        ]
      }
    ]
  }
];
