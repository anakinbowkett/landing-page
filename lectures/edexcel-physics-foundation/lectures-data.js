/* ════════════════════════════════════════════
   Montura Learn — Edexcel GCSE Combined Science (Foundation)
   Physics
   Single source of truth for the full course structure.

   NOTE: No Phase 0–3 universal-science-skills files in this delivery.
   Flagging so this isn't silently incomplete.
════════════════════════════════════════════ */
function slugToTitle(slug) {
    return slug
        .replace(/^sci-(?:phys(?:ics)?-)?p\d+-l\d+-/, '')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
}

const papersData = [

/* ══════════════════════════════════════
       PHYSICS
    ══════════════════════════════════════ */
    {
        tag: "Physics",
        title: "Physics",
        type: "single",
        pillars: [
            {
                tag: "Topic 1", title: "Key Concepts of Physics",
                lectures: [
                    { slug: "sci-phys-p1-l1-si-units-and-common-physical-quantities", title: "SI Units and Common Physical Quantities" },
                    { slug: "sci-phys-p1-l2-si-prefixes-and-orders-of-magnitude", title: "SI Prefixes and Orders of Magnitude" },
                    { slug: "sci-phys-p1-l3-converting-between-physical-units", title: "Converting Between Physical Units" },
                    { slug: "sci-phys-p1-l4-hours-minutes-and-seconds-conversions", title: "Hours Minutes and Seconds Conversions" },
                    { slug: "sci-phys-p1-l5-significant-figures-in-physics", title: "Significant Figures in Physics" },
                    { slug: "sci-phys-p1-l6-standard-form-and-calculator-notation", title: "Standard Form and Calculator Notation" },
                    { slug: "sci-phys-p1-l7-ratios-proportional-reasoning-and-rates", title: "Ratios Proportional Reasoning and Rates" },
                    { slug: "sci-phys-p1-l8-selecting-equations-and-using-units-correctly", title: "Selecting Equations and Using Units Correctly" }
                ]
            },
            {
                tag: "Topic 2", title: "Motion and Forces",
                lectures: [
                    { slug: "sci-phys-p2-l1-scalars-and-vectors", title: "Scalars and Vectors" },
                    { slug: "sci-phys-p2-l2-vector-and-scalar-quantities-in-physics", title: "Vector and Scalar Quantities in Physics" },
                    { slug: "sci-phys-p2-l3-distance-displacement-speed-and-velocity", title: "Distance Displacement Speed and Velocity" },
                    { slug: "sci-phys-p2-l4-speed-distance-and-time-equations", title: "Speed Distance and Time Equations" },
                    { slug: "sci-phys-p2-l5-calculating-average-speed", title: "Calculating Average Speed" },
                    { slug: "sci-phys-p2-l6-distance-time-graphs", title: "Distance Time Graphs" },
                    { slug: "sci-phys-p2-l7-finding-speed-from-distance-time-graph-gradients", title: "Finding Speed from Distance Time Graph Gradients" },
                    { slug: "sci-phys-p2-l8-acceleration-and-change-in-velocity", title: "Acceleration and Change in Velocity" },
                    { slug: "sci-phys-p2-l9-calculating-acceleration", title: "Calculating Acceleration" },
                    { slug: "sci-phys-p2-l10-velocity-time-graphs", title: "Velocity Time Graphs" },
                    { slug: "sci-phys-p2-l11-finding-acceleration-from-velocity-time-graphs", title: "Finding Acceleration from Velocity Time Graphs" },
                    { slug: "sci-phys-p2-l12-distance-travelled-from-area-under-a-velocity-time-graph", title: "Distance Travelled from Area Under a Velocity Time Graph" },
                    { slug: "sci-phys-p2-l13-laboratory-methods-for-measuring-speed", title: "Laboratory Methods for Measuring Speed" },
                    { slug: "sci-phys-p2-l14-typical-speeds-and-accelerations", title: "Typical Speeds and Accelerations" },
                    { slug: "sci-phys-p2-l15-free-fall-and-gravitational-acceleration", title: "Free Fall and Gravitational Acceleration" },
                    { slug: "sci-phys-p2-l16-newtons-first-law", title: "Newtons First Law" },
                    { slug: "sci-phys-p2-l17-resultant-force-and-changes-in-motion", title: "Resultant Force and Changes in Motion" },
                    { slug: "sci-phys-p2-l18-newtons-second-law-and-f-ma", title: "Newtons Second Law and F Ma" },
                    { slug: "sci-phys-p2-l19-weight-mass-and-gravitational-field-strength", title: "Weight Mass and Gravitational Field Strength" },
                    { slug: "sci-phys-p2-l20-measuring-weight-and-gravitational-field-strength", title: "Measuring Weight and Gravitational Field Strength" },
                    { slug: "sci-phys-p2-l21-circular-motion-and-changing-velocity", title: "Circular Motion and Changing Velocity" },
                    { slug: "sci-phys-p2-l22-centripetal-force", title: "Centripetal Force" },
                    { slug: "sci-phys-p2-l23-inertial-mass", title: "Inertial Mass" },
                    { slug: "sci-phys-p2-l24-newtons-third-law-and-force-pairs", title: "Newtons Third Law and Force Pairs" },
                    { slug: "sci-phys-p2-l25-momentum-and-the-momentum-equation", title: "Momentum and the Momentum Equation" },
                    { slug: "sci-phys-p2-l26-momentum-in-collisions", title: "Momentum in Collisions" },
                    { slug: "sci-phys-p2-l27-force-as-rate-of-change-of-momentum", title: "Force as Rate of Change of Momentum" },
                    { slug: "sci-phys-p2-l28-human-reaction-time", title: "Human Reaction Time" },
                    { slug: "sci-phys-p2-l29-thinking-and-braking-distance", title: "Thinking and Braking Distance" },
                    { slug: "sci-phys-p2-l30-factors-affecting-stopping-distance", title: "Factors Affecting Stopping Distance" },
                    { slug: "sci-phys-p2-l31-drugs-distractions-and-reaction-time", title: "Drugs Distractions and Reaction Time" },
                    { slug: "sci-phys-p2-l32-large-decelerations-and-collision-forces", title: "Large Decelerations and Collision Forces" }
                ]
            },
            {
                tag: "Topic 3", title: "Conservation of Energy",
                lectures: [
                    { slug: "sci-phys-p3-l1-gravitational-potential-energy", title: "Gravitational Potential Energy" },
                    { slug: "sci-phys-p3-l2-calculating-gravitational-potential-energy", title: "Calculating Gravitational Potential Energy" },
                    { slug: "sci-phys-p3-l3-kinetic-energy", title: "Kinetic Energy" },
                    { slug: "sci-phys-p3-l4-calculating-kinetic-energy", title: "Calculating Kinetic Energy" },
                    { slug: "sci-phys-p3-l5-energy-stores-and-energy-transfers", title: "Energy Stores and Energy Transfers" },
                    { slug: "sci-phys-p3-l6-energy-transfer-diagrams", title: "Energy Transfer Diagrams" },
                    { slug: "sci-phys-p3-l7-conservation-of-energy", title: "Conservation of Energy" },
                    { slug: "sci-phys-p3-l8-energy-transfers-in-closed-systems", title: "Energy Transfers in Closed Systems" },
                    { slug: "sci-phys-p3-l9-energy-stores-during-system-changes", title: "Energy Stores During System Changes" },
                    { slug: "sci-phys-p3-l10-dissipation-and-wasted-energy", title: "Dissipation and Wasted Energy" },
                    { slug: "sci-phys-p3-l11-energy-dissipation-through-heating", title: "Energy Dissipation Through Heating" },
                    { slug: "sci-phys-p3-l12-reducing-unwanted-energy-transfers", title: "Reducing Unwanted Energy Transfers" },
                    { slug: "sci-phys-p3-l13-lubrication-and-reducing-friction", title: "Lubrication and Reducing Friction" },
                    { slug: "sci-phys-p3-l14-thermal-insulation-and-building-cooling", title: "Thermal Insulation and Building Cooling" },
                    { slug: "sci-phys-p3-l15-efficiency-and-efficiency-calculations", title: "Efficiency and Efficiency Calculations" },
                    { slug: "sci-phys-p3-l16-increasing-efficiency", title: "Increasing Efficiency" },
                    { slug: "sci-phys-p3-l17-renewable-and-non-renewable-energy-resources", title: "Renewable and Non Renewable Energy Resources" },
                    { slug: "sci-phys-p3-l18-fossil-fuels-nuclear-fuel-and-biofuel", title: "Fossil Fuels Nuclear Fuel and Biofuel" },
                    { slug: "sci-phys-p3-l19-wind-hydroelectric-tidal-and-solar-energy", title: "Wind Hydroelectric Tidal and Solar Energy" },
                    { slug: "sci-phys-p3-l20-energy-resource-use-patterns-and-trends", title: "Energy Resource Use Patterns and Trends" }
                ]
            },
            {
                tag: "Topic 4", title: "Waves",
                lectures: [
                    { slug: "sci-phys-p4-l1-waves-transfer-energy-and-information", title: "Waves Transfer Energy and Information" },
                    { slug: "sci-phys-p4-l2-waves-and-the-transfer-of-matter", title: "Waves and the Transfer of Matter" },
                    { slug: "sci-phys-p4-l3-frequency-and-wavelength", title: "Frequency and Wavelength" },
                    { slug: "sci-phys-p4-l4-amplitude-period-wave-velocity-and-wavefront", title: "Amplitude Period Wave Velocity and Wavefront" },
                    { slug: "sci-phys-p4-l5-transverse-and-longitudinal-waves", title: "Transverse and Longitudinal Waves" },
                    { slug: "sci-phys-p4-l6-sound-water-electromagnetic-and-seismic-waves", title: "Sound Water Electromagnetic and Seismic Waves" },
                    { slug: "sci-phys-p4-l7-wave-speed-frequency-and-wavelength-equation", title: "Wave Speed Frequency and Wavelength Equation" },
                    { slug: "sci-phys-p4-l8-wave-speed-distance-and-time-equation", title: "Wave Speed Distance and Time Equation" },
                    { slug: "sci-phys-p4-l9-measuring-the-speed-of-sound", title: "Measuring the Speed of Sound" },
                    { slug: "sci-phys-p4-l10-measuring-ripples-and-wave-speed", title: "Measuring Ripples and Wave Speed" },
                    { slug: "sci-phys-p4-l11-refraction-at-a-boundary", title: "Refraction at a Boundary" },
                    { slug: "sci-phys-p4-l12-wave-speed-and-change-of-direction", title: "Wave Speed and Change of Direction" },
                    { slug: "sci-phys-p4-l13-absorption-transmission-reflection-and-refraction", title: "Absorption Transmission Reflection and Refraction" },
                    { slug: "sci-phys-p4-l14-wavelength-and-how-materials-interact-with-waves", title: "Wavelength and How Materials Interact with Waves" }
                ]
            },
            {
                tag: "Topic 5", title: "Light and the Electromagnetic Spectrum",
                lectures: [
                    { slug: "sci-phys-p5-l1-electromagnetic-waves-are-transverse", title: "Electromagnetic Waves Are Transverse" },
                    { slug: "sci-phys-p5-l2-speed-of-electromagnetic-waves-in-a-vacuum", title: "Speed of Electromagnetic Waves in a Vacuum" },
                    { slug: "sci-phys-p5-l3-electromagnetic-waves-transfer-energy", title: "Electromagnetic Waves Transfer Energy" },
                    { slug: "sci-phys-p5-l4-the-electromagnetic-spectrum", title: "The Electromagnetic Spectrum" },
                    { slug: "sci-phys-p5-l5-radio-microwaves-infrared-visible-ultraviolet-x-rays-and-gamma-rays", title: "Radio Microwaves Infrared Visible Ultraviolet X Rays and Gamma Rays" },
                    { slug: "sci-phys-p5-l6-wavelength-frequency-and-the-electromagnetic-spectrum", title: "Wavelength Frequency and the Electromagnetic Spectrum" },
                    { slug: "sci-phys-p5-l7-visible-light-and-the-visible-spectrum", title: "Visible Light and the Visible Spectrum" },
                    { slug: "sci-phys-p5-l8-absorption-transmission-reflection-and-refraction-of-em-waves", title: "Absorption Transmission Reflection and Refraction of Em Waves" },
                    { slug: "sci-phys-p5-l9-refraction-of-electromagnetic-waves", title: "Refraction of Electromagnetic Waves" },
                    { slug: "sci-phys-p5-l10-dangers-of-electromagnetic-radiation", title: "Dangers of Electromagnetic Radiation" },
                    { slug: "sci-phys-p5-l11-microwave-and-infrared-hazards", title: "Microwave and Infrared Hazards" },
                    { slug: "sci-phys-p5-l12-ultraviolet-hazards", title: "Ultraviolet Hazards" },
                    { slug: "sci-phys-p5-l13-x-ray-and-gamma-ray-hazards", title: "X Ray and Gamma Ray Hazards" },
                    { slug: "sci-phys-p5-l14-uses-of-radio-waves", title: "Uses of Radio Waves" },
                    { slug: "sci-phys-p5-l15-uses-of-microwaves", title: "Uses of Microwaves" },
                    { slug: "sci-phys-p5-l16-uses-of-infrared", title: "Uses of Infrared" },
                    { slug: "sci-phys-p5-l17-uses-of-visible-light", title: "Uses of Visible Light" },
                    { slug: "sci-phys-p5-l18-uses-of-ultraviolet", title: "Uses of Ultraviolet" },
                    { slug: "sci-phys-p5-l19-uses-of-x-rays", title: "Uses of X Rays" },
                    { slug: "sci-phys-p5-l20-uses-of-gamma-rays", title: "Uses of Gamma Rays" },
                    { slug: "sci-phys-p5-l21-radio-waves-and-electrical-oscillations", title: "Radio Waves and Electrical Oscillations" },
                    { slug: "sci-phys-p5-l22-radiation-from-atoms-and-nuclei", title: "Radiation from Atoms and Nuclei" }
                ]
            },
            {
                tag: "Topic 6", title: "Radioactivity",
                lectures: [
                    { slug: "sci-phys-p6-l1-structure-of-the-atom-and-nucleus", title: "Structure of the Atom and Nucleus" },
                    { slug: "sci-phys-p6-l2-relative-mass-and-charge-of-subatomic-particles", title: "Relative Mass and Charge of Subatomic Particles" },
                    { slug: "sci-phys-p6-l3-atomic-number-and-mass-number", title: "Atomic Number and Mass Number" },
                    { slug: "sci-phys-p6-l4-isotopes-and-nuclear-notation", title: "Isotopes and Nuclear Notation" },
                    { slug: "sci-phys-p6-l5-typical-size-of-atoms-and-nuclei", title: "Typical Size of Atoms and Nuclei" },
                    { slug: "sci-phys-p6-l6-electrons-and-energy-levels", title: "Electrons and Energy Levels" },
                    { slug: "sci-phys-p6-l7-formation-of-positive-ions", title: "Formation of Positive Ions" },
                    { slug: "sci-phys-p6-l8-the-development-of-the-atomic-model", title: "The Development of the Atomic Model" },
                    { slug: "sci-phys-p6-l9-radioactive-decay-and-unstable-nuclei", title: "Radioactive Decay and Unstable Nuclei" },
                    { slug: "sci-phys-p6-l10-alpha-beta-and-gamma-radiation", title: "Alpha Beta and Gamma Radiation" },
                    { slug: "sci-phys-p6-l11-beta-minus-and-beta-plus-radiation", title: "Beta Minus and Beta Plus Radiation" },
                    { slug: "sci-phys-p6-l12-neutron-radiation", title: "Neutron Radiation" },
                    { slug: "sci-phys-p6-l13-ionising-radiation", title: "Ionising Radiation" },
                    { slug: "sci-phys-p6-l14-background-radiation", title: "Background Radiation" },
                    { slug: "sci-phys-p6-l15-sources-of-background-radiation", title: "Sources of Background Radiation" },
                    { slug: "sci-phys-p6-l16-detecting-and-measuring-radioactivity", title: "Detecting and Measuring Radioactivity" },
                    { slug: "sci-phys-p6-l17-penetration-and-ionisation-of-alpha-beta-and-gamma", title: "Penetration and Ionisation of Alpha Beta and Gamma" },
                    { slug: "sci-phys-p6-l18-alpha-decay", title: "Alpha Decay" },
                    { slug: "sci-phys-p6-l19-beta-minus-decay", title: "Beta Minus Decay" },
                    { slug: "sci-phys-p6-l20-beta-plus-decay", title: "Beta Plus Decay" },
                    { slug: "sci-phys-p6-l21-gamma-emission-and-nuclear-rearrangement", title: "Gamma Emission and Nuclear Rearrangement" },
                    { slug: "sci-phys-p6-l22-balancing-nuclear-equations", title: "Balancing Nuclear Equations" },
                    { slug: "sci-phys-p6-l23-activity-and-the-becquerel", title: "Activity and the Becquerel" },
                    { slug: "sci-phys-p6-l24-radioactive-decay-and-activity", title: "Radioactive Decay and Activity" },
                    { slug: "sci-phys-p6-l25-half-life-and-what-it-means", title: "Half Life and What It Means" },
                    { slug: "sci-phys-p6-l26-random-nature-of-radioactive-decay", title: "Random Nature of Radioactive Decay" },
                    { slug: "sci-phys-p6-l27-half-life-calculations-and-decay-graphs", title: "Half Life Calculations and Decay Graphs" },
                    { slug: "sci-phys-p6-l28-hazards-of-ionising-radiation", title: "Hazards of Ionising Radiation" },
                    { slug: "sci-phys-p6-l29-tissue-damage-and-mutations", title: "Tissue Damage and Mutations" },
                    { slug: "sci-phys-p6-l30-radiation-safety-and-dose", title: "Radiation Safety and Dose" },
                    { slug: "sci-phys-p6-l31-contamination-versus-irradiation", title: "Contamination Versus Irradiation" }
                ]
            },
            {
                tag: "Topic 7", title: "Energy — Forces Doing Work",
                lectures: [
                    { slug: "sci-phys-p7-l1-energy-stores-in-changing-systems", title: "Energy Stores in Changing Systems" },
                    { slug: "sci-phys-p7-l2-energy-transfer-diagrams", title: "Energy Transfer Diagrams" },
                    { slug: "sci-phys-p7-l3-energy-transfer-by-work-done", title: "Energy Transfer by Work Done" },
                    { slug: "sci-phys-p7-l4-work-done-and-energy-transferred", title: "Work Done and Energy Transferred" },
                    { slug: "sci-phys-p7-l5-work-done-equation", title: "Work Done Equation" },
                    { slug: "sci-phys-p7-l6-gravitational-potential-energy-from-work-done", title: "Gravitational Potential Energy from Work Done" },
                    { slug: "sci-phys-p7-l7-kinetic-energy-from-work-done", title: "Kinetic Energy from Work Done" },
                    { slug: "sci-phys-p7-l8-dissipation-of-energy", title: "Dissipation of Energy" },
                    { slug: "sci-phys-p7-l9-mechanical-energy-and-heating", title: "Mechanical Energy and Heating" },
                    { slug: "sci-phys-p7-l10-power-as-the-rate-of-energy-transfer", title: "Power as the Rate of Energy Transfer" },
                    { slug: "sci-phys-p7-l11-power-calculations", title: "Power Calculations" },
                    { slug: "sci-phys-p7-l12-efficiency-calculations", title: "Efficiency Calculations" }
                ]
            },
            {
                tag: "Topic 8", title: "Forces and Their Effects",
                lectures: [
                    { slug: "sci-phys-p8-l1-contact-and-non-contact-forces", title: "Contact and Non Contact Forces" },
                    { slug: "sci-phys-p8-l2-gravitational-electrostatic-and-magnetic-fields", title: "Gravitational Electrostatic and Magnetic Fields" },
                    { slug: "sci-phys-p8-l3-normal-contact-force-and-friction", title: "Normal Contact Force and Friction" },
                    { slug: "sci-phys-p8-l4-force-pairs-and-vector-representation", title: "Force Pairs and Vector Representation" },
                    { slug: "sci-phys-p8-l5-vector-diagrams-and-resultant-force", title: "Vector Diagrams and Resultant Force" },
                    { slug: "sci-phys-p8-l6-equilibrium-and-balanced-forces", title: "Equilibrium and Balanced Forces" },
                    { slug: "sci-phys-p8-l7-free-body-force-diagrams", title: "Free Body Force Diagrams" },
                    { slug: "sci-phys-p8-l8-resolution-of-forces-using-scale-drawings", title: "Resolution of Forces Using Scale Drawings" },
                    { slug: "sci-phys-p8-l9-reducing-unwanted-energy-transfer-by-lubrication", title: "Reducing Unwanted Energy Transfer by Lubrication" }
                ]
            },
            {
                tag: "Topic 9", title: "Electricity and Circuits",
                lectures: [
                    { slug: "sci-phys-p9-l1-atomic-structure-and-electric-charge", title: "Atomic Structure and Electric Charge" },
                    { slug: "sci-phys-p9-l2-circuit-diagram-conventions", title: "Circuit Diagram Conventions" },
                    { slug: "sci-phys-p9-l3-circuit-symbols-and-components", title: "Circuit Symbols and Components" },
                    { slug: "sci-phys-p9-l4-series-and-parallel-circuits", title: "Series and Parallel Circuits" },
                    { slug: "sci-phys-p9-l5-potential-difference-and-voltage", title: "Potential Difference and Voltage" },
                    { slug: "sci-phys-p9-l6-potential-difference-as-energy-per-unit-charge", title: "Potential Difference as Energy Per Unit Charge" },
                    { slug: "sci-phys-p9-l7-energy-transferred-charge-and-potential-difference", title: "Energy Transferred Charge and Potential Difference" },
                    { slug: "sci-phys-p9-l8-current-and-flow-of-charge", title: "Current and Flow of Charge" },
                    { slug: "sci-phys-p9-l9-ammeters-and-measuring-current", title: "Ammeters and Measuring Current" },
                    { slug: "sci-phys-p9-l10-charge-current-and-time", title: "Charge Current and Time" },
                    { slug: "sci-phys-p9-l11-current-in-closed-circuits", title: "Current in Closed Circuits" },
                    { slug: "sci-phys-p9-l12-current-at-junctions", title: "Current at Junctions" },
                    { slug: "sci-phys-p9-l13-resistance-and-current", title: "Resistance and Current" },
                    { slug: "sci-phys-p9-l14-ohms-law", title: "Ohm's Law" },
                    { slug: "sci-phys-p9-l15-series-circuit-resistance", title: "Series Circuit Resistance" },
                    { slug: "sci-phys-p9-l16-parallel-circuit-resistance", title: "Parallel Circuit Resistance" },
                    { slug: "sci-phys-p9-l17-filament-lamps-and-non-linear-resistance", title: "Filament Lamps and Non Linear Resistance" },
                    { slug: "sci-phys-p9-l18-diodes-and-their-i-v-characteristics", title: "Diodes and Their I-V Characteristics" },
                    { slug: "sci-phys-p9-l19-fixed-resistors-and-i-v-characteristics", title: "Fixed Resistors and I-V Characteristics" },
                    { slug: "sci-phys-p9-l20-thermistors-and-temperature", title: "Thermistors and Temperature" },
                    { slug: "sci-phys-p9-l21-ldrs-and-light-intensity", title: "Ldrs and Light Intensity" },
                    { slug: "sci-phys-p9-l22-electrical-heating-and-energy-dissipation", title: "Electrical Heating and Energy Dissipation" },
                    { slug: "sci-phys-p9-l23-electrical-energy-equation", title: "Electrical Energy Equation" },
                    { slug: "sci-phys-p9-l24-electrical-power", title: "Electrical Power" },
                    { slug: "sci-phys-p9-l25-electrical-power-equations", title: "Electrical Power Equations" },
                    { slug: "sci-phys-p9-l26-domestic-appliance-energy-transfers", title: "Domestic Appliance Energy Transfers" },
                    { slug: "sci-phys-p9-l27-direct-and-alternating-current", title: "Direct and Alternating Current" },
                    { slug: "sci-phys-p9-l28-uk-mains-electricity", title: "UK Mains Electricity" },
                    { slug: "sci-phys-p9-l29-live-neutral-and-earth-wires", title: "Live Neutral and Earth Wires" },
                    { slug: "sci-phys-p9-l30-fuses-circuit-breakers-and-electrical-safety", title: "Fuses Circuit Breakers and Electrical Safety" },
                    { slug: "sci-phys-p9-l31-mains-wire-potential-differences", title: "Mains Wire Potential Differences" },
                    { slug: "sci-phys-p9-l32-domestic-appliance-power-ratings", title: "Domestic Appliance Power Ratings" }
                ]
            },
            {
                tag: "Topic 10", title: "Magnetism and the Motor Effect",
                lectures: [
                    { slug: "sci-phys-p10-l1-magnetic-poles-and-attraction-and-repulsion", title: "Magnetic Poles and Attraction and Repulsion" },
                    { slug: "sci-phys-p10-l2-permanent-and-temporary-magnetic-materials", title: "Permanent and Temporary Magnetic Materials" },
                    { slug: "sci-phys-p10-l3-permanent-and-induced-magnets", title: "Permanent and Induced Magnets" },
                    { slug: "sci-phys-p10-l4-magnetic-fields-and-field-lines", title: "Magnetic Fields and Field Lines" },
                    { slug: "sci-phys-p10-l5-magnetic-field-strength-and-field-line-density", title: "Magnetic Field Strength and Field Line Density" },
                    { slug: "sci-phys-p10-l6-plotting-magnetic-fields", title: "Plotting Magnetic Fields" },
                    { slug: "sci-phys-p10-l7-the-earths-magnetic-field", title: "The Earths Magnetic Field" },
                    { slug: "sci-phys-p10-l8-current-and-magnetic-fields", title: "Current and Magnetic Fields" },
                    { slug: "sci-phys-p10-l9-magnetic-field-around-a-straight-conductor", title: "Magnetic Field Around a Straight Conductor" },
                    { slug: "sci-phys-p10-l10-strength-of-magnetic-fields-around-conductors", title: "Strength of Magnetic Fields Around Conductors" },
                    { slug: "sci-phys-p10-l11-solenoids-and-electromagnets", title: "Solenoids and Electromagnets" },
                    { slug: "sci-phys-p10-l12-magnetic-force-on-a-current-carrying-conductor", title: "Magnetic Force on a Current Carrying Conductor" },
                    { slug: "sci-phys-p10-l13-magnetic-fields-and-force", title: "Magnetic Fields and Force" },
                    { slug: "sci-phys-p10-l14-flemings-left-hand-rule", title: "Fleming's Left-Hand Rule" },
                    { slug: "sci-phys-p10-l15-force-on-a-conductor-equation", title: "Force on a Conductor Equation" },
                    { slug: "sci-phys-p10-l16-electric-motors", title: "Electric Motors" }
                ]
            },
            {
                tag: "Topic 11", title: "Electromagnetic Induction",
                lectures: [
                    { slug: "sci-phys-p11-l1-electromagnetic-induction", title: "Electromagnetic Induction" },
                    { slug: "sci-phys-p11-l2-induced-potential-difference", title: "Induced Potential Difference" },
                    { slug: "sci-phys-p11-l3-factors-affecting-induced-potential-difference", title: "Factors Affecting Induced Potential Difference" },
                    { slug: "sci-phys-p11-l4-lenzs-law-and-opposing-magnetic-effects", title: "Lenzs Law and Opposing Magnetic Effects" },
                    { slug: "sci-phys-p11-l5-alternating-current-and-electromagnetic-induction", title: "Alternating Current and Electromagnetic Induction" },
                    { slug: "sci-phys-p11-l6-transformers-and-electromagnetic-induction", title: "Transformers and Electromagnetic Induction" },
                    { slug: "sci-phys-p11-l7-step-up-and-step-down-transformers", title: "Step Up and Step Down Transformers" },
                    { slug: "sci-phys-p11-l8-the-national-grid-and-high-voltage-transmission", title: "The National Grid and High Voltage Transmission" },
                    { slug: "sci-phys-p11-l9-transformers-in-the-national-grid", title: "Transformers in the National Grid" },
                    { slug: "sci-phys-p11-l10-transformer-power-equation", title: "Transformer Power Equation" }
                ]
            },
            {
                tag: "Topic 12", title: "Particle Model",
                lectures: [
                    { slug: "sci-phys-p12-l1-kinetic-theory-and-states-of-matter", title: "Kinetic Theory and States of Matter" },
                    { slug: "sci-phys-p12-l2-particle-arrangement-in-solids-liquids-and-gases", title: "Particle Arrangement in Solids Liquids and Gases" },
                    { slug: "sci-phys-p12-l3-density-and-the-density-equation", title: "Density and the Density Equation" },
                    { slug: "sci-phys-p12-l4-density-of-solids-and-liquids", title: "Density of Solids and Liquids" },
                    { slug: "sci-phys-p12-l5-density-and-particle-arrangement", title: "Density and Particle Arrangement" },
                    { slug: "sci-phys-p12-l6-changes-of-state-and-conservation-of-mass", title: "Changes of State and Conservation of Mass" },
                    { slug: "sci-phys-p12-l7-physical-versus-chemical-change", title: "Physical Versus Chemical Change" },
                    { slug: "sci-phys-p12-l8-heating-and-internal-energy", title: "Heating and Internal Energy" },
                    { slug: "sci-phys-p12-l9-specific-heat-capacity", title: "Specific Heat Capacity" },
                    { slug: "sci-phys-p12-l10-specific-latent-heat", title: "Specific Latent Heat" },
                    { slug: "sci-phys-p12-l11-specific-heat-capacity-calculations", title: "Specific Heat Capacity Calculations" },
                    { slug: "sci-phys-p12-l12-specific-latent-heat-calculations", title: "Specific Latent Heat Calculations" },
                    { slug: "sci-phys-p12-l13-thermal-insulation", title: "Thermal Insulation" },
                    { slug: "sci-phys-p12-l14-gas-pressure-and-particle-motion", title: "Gas Pressure and Particle Motion" },
                    { slug: "sci-phys-p12-l15-temperature-and-gas-particle-speed", title: "Temperature and Gas Particle Speed" },
                    { slug: "sci-phys-p12-l16-gas-pressure-at-constant-volume", title: "Gas Pressure at Constant Volume" },
                    { slug: "sci-phys-p12-l17-absolute-zero-and-particle-motion", title: "Absolute Zero and Particle Motion" },
                    { slug: "sci-phys-p12-l18-kelvin-and-celsius-scales", title: "Kelvin and Celsius Scales" }
                ]
            },
            {
                tag: "Topic 13", title: "Forces and Matter",
                lectures: [
                    { slug: "sci-phys-p13-l1-elastic-and-inelastic-distortion", title: "Elastic and Inelastic Distortion" },
                    { slug: "sci-phys-p13-l2-forces-needed-to-stretch-bend-and-compress", title: "Forces Needed to Stretch Bend and Compress" },
                    { slug: "sci-phys-p13-l3-hookes-law", title: "Hooke's Law" },
                    { slug: "sci-phys-p13-l4-spring-constant-and-extension", title: "Spring Constant and Extension" },
                    { slug: "sci-phys-p13-l5-linear-and-non-linear-force-extension-relationships", title: "Linear and Non Linear Force Extension Relationships" },
                    { slug: "sci-phys-p13-l6-work-done-stretching-a-spring", title: "Work Done Stretching a Spring" },
                    { slug: "sci-phys-p13-l7-elastic-energy-and-spring-extension", title: "Elastic Energy and Spring Extension" }
                ]
            }
        ]
    }
];