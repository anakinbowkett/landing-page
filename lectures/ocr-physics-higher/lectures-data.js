// OCR Combined Science A (Gateway): Physics (Higher Tier) — lectures-data.js
// Built from 183 real files: 152 Physics-specific + 31 shared Foundations/Working Scientifically
// lectures (identical set reused from Biology/Chemistry — confirmed byte-for-byte identical
// filenames across zips, not subject-specific).
// sci-phys-p1-p6 map to OCR's real condensed Combined Science Physics topics (folded down from
// the 8-topic separate Physics spec): Paper 1 = P1 Matter, P2 Forces, P3 Electricity and
// Magnetism. Paper 2 = P4 Waves and Radioactivity, P5 Energy, P6 Global Challenges.

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
    title: "Physics Paper 1",
    pillars: [
      {
        tag: "Topic P1",
        title: "Matter",
        lectures: [
          { slug: "sci-phys-p1-l1-development-of-the-atomic-model", title: "Development of the Atomic Model" },
          { slug: "sci-phys-p1-l2-thomson-rutherford-geiger-marsden-and-bohr-models", title: "Thomson Rutherford Geiger Marsden and Bohr Models" },
          { slug: "sci-phys-p1-l3-structure-of-the-atom-nucleus-and-electrons", title: "Structure of the Atom Nucleus and Electrons" },
          { slug: "sci-phys-p1-l4-atomic-size-and-order-of-magnitude", title: "Atomic Size and Order of Magnitude" },
          { slug: "sci-phys-p1-l5-density-definition-equation-and-units", title: "Density Definition Equation and Units" },
          { slug: "sci-phys-p1-l6-density-of-solids-liquids-and-gases", title: "Density of Solids Liquids and Gases" },
          { slug: "sci-phys-p1-l7-density-mass-and-volume-calculations", title: "Density Mass and Volume Calculations" },
          { slug: "sci-phys-p1-l8-particle-arrangement-and-density-in-different-states", title: "Particle Arrangement and Density in Different States" },
          { slug: "sci-phys-p1-l9-conservation-of-mass-during-changes-of-state", title: "Conservation of Mass During Changes of State" },
          { slug: "sci-phys-p1-l10-physical-versus-chemical-changes", title: "Physical Versus Chemical Changes" },
          { slug: "sci-phys-p1-l11-heating-and-internal-energy", title: "Heating and Internal Energy" },
          { slug: "sci-phys-p1-l12-specific-heat-capacity-definition-and-calculations", title: "Specific Heat Capacity Definition and Calculations" },
          { slug: "sci-phys-p1-l13-specific-latent-heat-definition-and-calculations", title: "Specific Latent Heat Definition and Calculations" },
          { slug: "sci-phys-p1-l14-gas-particles-temperature-and-pressure", title: "Gas Particles Temperature and Pressure" },
          { slug: "sci-phys-p1-l15-temperature-and-pressure-at-constant-volume", title: "Temperature and Pressure at Constant Volume" }
        ]
      },
      {
        tag: "Topic P2",
        title: "Forces",
        lectures: [
          { slug: "sci-phys-p2-l1-measuring-distance-and-time", title: "Measuring Distance and Time" },
          { slug: "sci-phys-p2-l2-speed-distance-and-time", title: "Speed Distance and Time" },
          { slug: "sci-phys-p2-l3-average-speed-and-non-uniform-motion", title: "Average Speed and Non Uniform Motion" },
          { slug: "sci-phys-p2-l4-scalar-and-vector-quantities", title: "Scalar and Vector Quantities" },
          { slug: "sci-phys-p2-l5-distance-displacement-speed-and-velocity", title: "Distance Displacement Speed and Velocity" },
          { slug: "sci-phys-p2-l6-converting-units-and-proportional-reasoning", title: "Converting Units and Proportional Reasoning" },
          { slug: "sci-phys-p2-l7-distance-time-graphs", title: "Distance Time Graphs" },
          { slug: "sci-phys-p2-l8-velocity-time-graphs", title: "Velocity Time Graphs" },
          { slug: "sci-phys-p2-l9-acceleration-and-acceleration-calculations", title: "Acceleration and Acceleration Calculations" },
          { slug: "sci-phys-p2-l10-v2-u2-2ax-equation", title: "V2 U2 2ax Equation" },
          { slug: "sci-phys-p2-l11-area-under-velocity-time-graphs-higher", title: "Area Under Velocity Time Graphs Higher" },
          { slug: "sci-phys-p2-l12-contact-and-non-contact-forces", title: "Contact and Non Contact Forces" },
          { slug: "sci-phys-p2-l13-force-vectors-and-free-body-diagrams", title: "Force Vectors and Free Body Diagrams" },
          { slug: "sci-phys-p2-l14-newtons-first-law", title: "Newtons First Law" },
          { slug: "sci-phys-p2-l15-resultant-force-and-equilibrium", title: "Resultant Force and Equilibrium" },
          { slug: "sci-phys-p2-l16-resolution-of-forces-higher", title: "Resolution of Forces Higher" },
          { slug: "sci-phys-p2-l17-newtons-second-law-and-f-ma", title: "Newtons Second Law and F Ma" },
          { slug: "sci-phys-p2-l18-inertia-and-inertial-mass-higher", title: "Inertia and Inertial Mass Higher" },
          { slug: "sci-phys-p2-l19-newtons-third-law-and-force-pairs", title: "Newtons Third Law and Force Pairs" },
          { slug: "sci-phys-p2-l20-momentum-and-momentum-calculations-higher", title: "Momentum and Momentum Calculations Higher" },
          { slug: "sci-phys-p2-l21-conservation-of-momentum-in-collisions-higher", title: "Conservation of Momentum in Collisions Higher" },
          { slug: "sci-phys-p2-l22-work-done-by-a-force", title: "Work Done By a Force" },
          { slug: "sci-phys-p2-l23-energy-transfer-by-work-done", title: "Energy Transfer By Work Done" },
          { slug: "sci-phys-p2-l24-power-as-rate-of-energy-transfer", title: "Power as Rate of Energy Transfer" },
          { slug: "sci-phys-p2-l25-elastic-and-plastic-deformation", title: "Elastic and Plastic Deformation" },
          { slug: "sci-phys-p2-l26-force-and-extension", title: "Force and Extension" },
          { slug: "sci-phys-p2-l27-hookes-law-and-spring-constant", title: "Hookes Law and Spring Constant" },
          { slug: "sci-phys-p2-l28-linear-and-non-linear-force-extension", title: "Linear and Non Linear Force Extension" },
          { slug: "sci-phys-p2-l29-work-done-stretching-a-spring", title: "Work Done Stretching a Spring" },
          { slug: "sci-phys-p2-l30-elastic-potential-energy-of-a-spring", title: "Elastic Potential Energy of a Spring" },
          { slug: "sci-phys-p2-l31-gravitational-fields-and-gravitational-attraction", title: "Gravitational Fields and Gravitational Attraction" },
          { slug: "sci-phys-p2-l32-weight-mass-and-gravitational-field-strength", title: "Weight Mass and Gravitational Field Strength" },
          { slug: "sci-phys-p2-l33-weight-on-different-planets", title: "Weight on Different Planets" },
          { slug: "sci-phys-p2-l34-free-fall-and-gravitational-acceleration", title: "Free Fall and Gravitational Acceleration" },
          { slug: "sci-phys-p2-l35-circular-motion-and-changing-velocity-higher", title: "Circular Motion and Changing Velocity Higher" }
        ]
      },
      {
        tag: "Topic P3",
        title: "Electricity and Magnetism",
        lectures: [
          { slug: "sci-phys-p3-l1-electric-charge-positive-and-negative", title: "Electric Charge Positive and Negative" },
          { slug: "sci-phys-p3-l2-static-electricity-and-electron-transfer", title: "Static Electricity and Electron Transfer" },
          { slug: "sci-phys-p3-l3-attraction-repulsion-and-electric-fields", title: "Attraction Repulsion and Electric Fields" },
          { slug: "sci-phys-p3-l4-current-as-rate-of-flow-of-charge", title: "Current as Rate of Flow of Charge" },
          { slug: "sci-phys-p3-l5-conditions-required-for-charge-to-flow", title: "Conditions Required for Charge to Flow" },
          { slug: "sci-phys-p3-l6-charge-current-and-time-calculations", title: "Charge Current and Time Calculations" },
          { slug: "sci-phys-p3-l7-series-and-parallel-circuits", title: "Series and Parallel Circuits" },
          { slug: "sci-phys-p3-l8-circuit-symbols-and-circuit-diagrams", title: "Circuit Symbols and Circuit Diagrams" },
          { slug: "sci-phys-p3-l9-current-and-potential-difference-in-circuits", title: "Current and Potential Difference in Circuits" },
          { slug: "sci-phys-p3-l10-potential-difference-and-resistance", title: "Potential Difference and Resistance" },
          { slug: "sci-phys-p3-l11-ohms-law-and-resistance-calculations", title: "Ohms Law and Resistance Calculations" },
          { slug: "sci-phys-p3-l12-resistance-in-series-and-parallel-circuits", title: "Resistance in Series and Parallel Circuits" },
          { slug: "sci-phys-p3-l13-equivalent-resistance-calculations-higher", title: "Equivalent Resistance Calculations Higher" },
          { slug: "sci-phys-p3-l14-i-v-characteristics-and-linear-and-non-linear-components", title: "I V Characteristics and Linear and Non Linear Components" },
          { slug: "sci-phys-p3-l15-filament-lamps-and-diodes", title: "Filament Lamps and Diodes" },
          { slug: "sci-phys-p3-l16-thermistors-and-temperature", title: "Thermistors and Temperature" },
          { slug: "sci-phys-p3-l17-ldrs-and-light-intensity", title: "Ldrs and Light Intensity" },
          { slug: "sci-phys-p3-l18-designing-circuits-for-measurement-and-testing", title: "Designing Circuits for Measurement and Testing" },
          { slug: "sci-phys-p3-l19-electrical-power-and-energy-transfer", title: "Electrical Power and Energy Transfer" },
          { slug: "sci-phys-p3-l20-electrical-energy-and-kwh", title: "Electrical Energy and Kwh" },
          { slug: "sci-phys-p3-l21-electrical-equation-calculations", title: "Electrical Equation Calculations" },
          { slug: "sci-phys-p3-l22-magnetic-poles-and-magnetic-attraction-and-repulsion", title: "Magnetic Poles and Magnetic Attraction and Repulsion" },
          { slug: "sci-phys-p3-l23-permanent-and-induced-magnets", title: "Permanent and Induced Magnets" },
          { slug: "sci-phys-p3-l24-magnetic-fields-and-field-lines", title: "Magnetic Fields and Field Lines" },
          { slug: "sci-phys-p3-l25-the-earths-magnetic-field", title: "The Earths Magnetic Field" },
          { slug: "sci-phys-p3-l26-magnetic-fields-around-current-carrying-wires", title: "Magnetic Fields Around Current Carrying Wires" },
          { slug: "sci-phys-p3-l27-factors-affecting-magnetic-field-strength", title: "Factors Affecting Magnetic Field Strength" },
          { slug: "sci-phys-p3-l28-solenoids-and-electromagnets", title: "Solenoids and Electromagnets" },
          { slug: "sci-phys-p3-l29-motor-effect-and-force-on-a-conductor-higher", title: "Motor Effect and Force on a Conductor Higher" },
          { slug: "sci-phys-p3-l30-flemings-left-hand-rule-higher", title: "Flemings Left Hand Rule Higher" },
          { slug: "sci-phys-p3-l31-f-bil-force-calculations-higher", title: "F Bil Force Calculations Higher" },
          { slug: "sci-phys-p3-l32-electric-motors-and-the-motor-effect-higher", title: "Electric Motors and the Motor Effect Higher" }
        ]
      }
    ]
  },
  {
    type: "single",
    tag: "PAPER 2",
    title: "Physics Paper 2",
    pillars: [
      {
        tag: "Topic P4",
        title: "Waves and Radioactivity",
        lectures: [
          { slug: "sci-phys-p4-l1-wave-motion-and-wave-properties", title: "Wave Motion and Wave Properties" },
          { slug: "sci-phys-p4-l2-amplitude-wavelength-frequency-and-period", title: "Amplitude Wavelength Frequency and Period" },
          { slug: "sci-phys-p4-l3-wave-speed-frequency-and-wavelength", title: "Wave Speed Frequency and Wavelength" },
          { slug: "sci-phys-p4-l4-transverse-and-longitudinal-waves", title: "Transverse and Longitudinal Waves" },
          { slug: "sci-phys-p4-l5-water-ripples-and-sound-as-wave-models", title: "Water Ripples and Sound as Wave Models" },
          { slug: "sci-phys-p4-l6-evidence-that-waves-transfer-energy-not-matter", title: "Evidence That Waves Transfer Energy not Matter" },
          { slug: "sci-phys-p4-l7-electromagnetic-waves-are-transverse", title: "Electromagnetic Waves Are Transverse" },
          { slug: "sci-phys-p4-l8-electromagnetic-waves-and-energy-transfer", title: "Electromagnetic Waves and Energy Transfer" },
          { slug: "sci-phys-p4-l9-electromagnetic-spectrum-and-order", title: "Electromagnetic Spectrum and Order" },
          { slug: "sci-phys-p4-l10-frequency-and-wavelength-across-the-em-spectrum", title: "Frequency and Wavelength Across the Em Spectrum" },
          { slug: "sci-phys-p4-l11-visible-light-and-the-visible-spectrum", title: "Visible Light and the Visible Spectrum" },
          { slug: "sci-phys-p4-l12-uses-of-radio-microwave-infrared-and-visible-radiation", title: "Uses of Radio Microwave Infrared and Visible Radiation" },
          { slug: "sci-phys-p4-l13-uses-of-ultraviolet-x-rays-and-gamma-rays", title: "Uses of Ultraviolet X Rays and Gamma Rays" },
          { slug: "sci-phys-p4-l14-hazards-of-ultraviolet-x-rays-and-gamma-rays", title: "Hazards of Ultraviolet X Rays and Gamma Rays" },
          { slug: "sci-phys-p4-l15-radio-waves-and-electrical-oscillations-higher", title: "Radio Waves and Electrical Oscillations Higher" },
          { slug: "sci-phys-p4-l16-wavelength-dependent-absorption-transmission-reflection-and-refraction-higher", title: "Wavelength Dependent Absorption Transmission Reflection and Refraction Higher" },
          { slug: "sci-phys-p4-l17-electromagnetic-wave-speed-in-different-substances-higher", title: "Electromagnetic Wave Speed in Different Substances Higher" },
          { slug: "sci-phys-p4-l18-atomic-nuclei-protons-and-neutrons", title: "Atomic Nuclei Protons and Neutrons" },
          { slug: "sci-phys-p4-l19-isotopes-and-nuclear-notation", title: "Isotopes and Nuclear Notation" },
          { slug: "sci-phys-p4-l20-unstable-nuclei-and-radioactive-decay", title: "Unstable Nuclei and Radioactive Decay" },
          { slug: "sci-phys-p4-l21-alpha-beta-neutron-and-gamma-radiation", title: "Alpha Beta Neutron and Gamma Radiation" },
          { slug: "sci-phys-p4-l22-changes-in-nuclear-mass-and-charge-during-decay", title: "Changes in Nuclear Mass and Charge During Decay" },
          { slug: "sci-phys-p4-l23-balancing-nuclear-decay-equations", title: "Balancing Nuclear Decay Equations" },
          { slug: "sci-phys-p4-l24-electron-energy-levels-and-excitation", title: "Electron Energy Levels and Excitation" },
          { slug: "sci-phys-p4-l25-ionisation-and-formation-of-ions", title: "Ionisation and Formation of Ions" },
          { slug: "sci-phys-p4-l26-radiation-from-atoms-and-nuclei", title: "Radiation from Atoms and Nuclei" },
          { slug: "sci-phys-p4-l27-random-radioactive-decay", title: "Random Radioactive Decay" },
          { slug: "sci-phys-p4-l28-half-life-and-half-life-graphs", title: "Half Life and Half Life Graphs" },
          { slug: "sci-phys-p4-l29-half-life-ratio-calculations-higher", title: "Half Life Ratio Calculations Higher" },
          { slug: "sci-phys-p4-l30-penetration-and-ionisation-of-alpha-beta-and-gamma", title: "Penetration and Ionisation of Alpha Beta and Gamma" },
          { slug: "sci-phys-p4-l31-contamination-versus-irradiation", title: "Contamination Versus Irradiation" },
          { slug: "sci-phys-p4-l32-radiation-hazards", title: "Radiation Hazards" }
        ]
      },
      {
        tag: "Topic P5",
        title: "Energy",
        lectures: [
          { slug: "sci-phys-p5-l1-energy-stores-and-energy-transfers", title: "Energy Stores and Energy Transfers" },
          { slug: "sci-phys-p5-l2-conservation-of-energy-in-closed-systems", title: "Conservation of Energy in Closed Systems" },
          { slug: "sci-phys-p5-l3-energy-changes-in-common-systems", title: "Energy Changes in Common Systems" },
          { slug: "sci-phys-p5-l4-energy-transfer-by-heating", title: "Energy Transfer By Heating" },
          { slug: "sci-phys-p5-l5-energy-transfer-by-work-done", title: "Energy Transfer By Work Done" },
          { slug: "sci-phys-p5-l6-energy-transfer-in-electrical-circuits", title: "Energy Transfer in Electrical Circuits" },
          { slug: "sci-phys-p5-l7-kinetic-energy-calculations", title: "Kinetic Energy Calculations" },
          { slug: "sci-phys-p5-l8-gravitational-potential-energy-calculations", title: "Gravitational Potential Energy Calculations" },
          { slug: "sci-phys-p5-l9-elastic-potential-energy-calculations", title: "Elastic Potential Energy Calculations" },
          { slug: "sci-phys-p5-l10-energy-calculations-across-mechanical-electrical-and-thermal-processes", title: "Energy Calculations Across Mechanical Electrical and Thermal Processes" },
          { slug: "sci-phys-p5-l11-dissipation-and-less-useful-energy", title: "Dissipation and Less Useful Energy" },
          { slug: "sci-phys-p5-l12-energy-transfers-in-domestic-devices", title: "Energy Transfers in Domestic Devices" },
          { slug: "sci-phys-p5-l13-power-ratings-of-domestic-appliances", title: "Power Ratings of Domestic Appliances" },
          { slug: "sci-phys-p5-l14-efficiency-and-efficiency-calculations", title: "Efficiency and Efficiency Calculations" },
          { slug: "sci-phys-p5-l15-increasing-efficiency-higher", title: "Increasing Efficiency Higher" },
          { slug: "sci-phys-p5-l16-reducing-unwanted-energy-transfers", title: "Reducing Unwanted Energy Transfers" },
          { slug: "sci-phys-p5-l17-thermal-insulation-and-lubrication", title: "Thermal Insulation and Lubrication" },
          { slug: "sci-phys-p5-l18-building-wall-thickness-and-thermal-conductivity", title: "Building Wall Thickness and Thermal Conductivity" }
        ]
      },
      {
        tag: "Topic P6",
        title: "Global Challenges",
        lectures: [
          { slug: "sci-phys-p6-l1-typical-speeds-in-everyday-life", title: "Typical Speeds in Everyday Life" },
          { slug: "sci-phys-p6-l2-estimating-everyday-accelerations", title: "Estimating Everyday Accelerations" },
          { slug: "sci-phys-p6-l3-unit-conversions-and-rates-in-real-world-contexts", title: "Unit Conversions and Rates in Real World Contexts" },
          { slug: "sci-phys-p6-l4-measuring-human-reaction-time", title: "Measuring Human Reaction Time" },
          { slug: "sci-phys-p6-l5-thinking-distance-and-reaction-time", title: "Thinking Distance and Reaction Time" },
          { slug: "sci-phys-p6-l6-braking-distance-and-factors-affecting-it", title: "Braking Distance and Factors Affecting It" },
          { slug: "sci-phys-p6-l7-stopping-distance-and-road-safety", title: "Stopping Distance and Road Safety" },
          { slug: "sci-phys-p6-l8-large-decelerations-and-collision-safety", title: "Large Decelerations and Collision Safety" },
          { slug: "sci-phys-p6-l9-energy-resources-on-earth", title: "Energy Resources on Earth" },
          { slug: "sci-phys-p6-l10-renewable-and-non-renewable-energy-resources", title: "Renewable and Non Renewable Energy Resources" },
          { slug: "sci-phys-p6-l11-patterns-and-trends-in-energy-resource-use", title: "Patterns and Trends in Energy Resource Use" },
          { slug: "sci-phys-p6-l12-electricity-generation-and-power-stations", title: "Electricity Generation and Power Stations" },
          { slug: "sci-phys-p6-l13-national-grid-and-high-voltage-transmission", title: "National Grid and High Voltage Transmission" },
          { slug: "sci-phys-p6-l14-step-up-and-step-down-transformers", title: "Step Up and Step Down Transformers" },
          { slug: "sci-phys-p6-l15-transformer-power-equation-higher", title: "Transformer Power Equation Higher" },
          { slug: "sci-phys-p6-l16-why-high-voltage-transmission-is-efficient", title: "Why High Voltage Transmission Is Efficient" },
          { slug: "sci-phys-p6-l17-uk-domestic-ac-supply-50-hz-and-230-v", title: "Uk Domestic Ac Supply 50 Hz and 230 V" },
          { slug: "sci-phys-p6-l18-direct-and-alternating-voltage", title: "Direct and Alternating Voltage" },
          { slug: "sci-phys-p6-l19-live-neutral-and-earth-wires", title: "Live Neutral and Earth Wires" },
          { slug: "sci-phys-p6-l20-mains-electrical-safety", title: "Mains Electrical Safety" }
        ]
      }
    ]
  }
];
