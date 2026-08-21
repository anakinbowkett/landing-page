/* ════════════════════════════════════════════
   Montura Learn — OCR GCSE Combined Science (Foundation)
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
                tag: "P1", title: "Matter",
                lectures: [
                    { slug: "sci-physics-p1-l1-development-of-the-atomic-model-thomson-rutherford-and-bohr", title: "Development of the Atomic Model Thomson Rutherford and Bohr" },
                    { slug: "sci-physics-p1-l2-structure-of-the-atom-nucleus-electrons-and-subatomic-particles", title: "Structure of the Atom Nucleus Electrons and Subatomic Particles" },
                    { slug: "sci-physics-p1-l3-atoms-molecules-compounds-and-particle-model", title: "Atoms Molecules Compounds and Particle Model" },
                    { slug: "sci-physics-p1-l4-atomic-size-and-order-of-magnitude", title: "Atomic Size and Order of Magnitude" },
                    { slug: "sci-physics-p1-l5-density-definition-equation-and-units", title: "Density Definition Equation and Units" },
                    { slug: "sci-physics-p1-l6-density-calculations-and-conservation-of-mass", title: "Density Calculations and Conservation of Mass" },
                    { slug: "sci-physics-p1-l7-particle-arrangements-in-solids-liquids-and-gases", title: "Particle Arrangements in Solids Liquids and Gases" },
                    { slug: "sci-physics-p1-l8-changes-of-state-temperature-and-internal-energy", title: "Changes of State Temperature and Internal Energy" }
                ]
            },
            {
                tag: "P2", title: "Motion and Forces",
                lectures: [
                    { slug: "sci-physics-p2-l1-distance-displacement-speed-and-velocity", title: "Distance Displacement Speed and Velocity" },
                    { slug: "sci-physics-p2-l2-distance-time-graphs-and-calculating-speed", title: "Distance Time Graphs and Calculating Speed" },
                    { slug: "sci-physics-p2-l3-acceleration-and-acceleration-calculations", title: "Acceleration and Acceleration Calculations" },
                    { slug: "sci-physics-p2-l4-velocity-time-graphs-and-interpreting-motion", title: "Velocity Time Graphs and Interpreting Motion" },
                    { slug: "sci-physics-p2-l5-resultant-forces-and-free-body-diagrams", title: "Resultant Forces and Free Body Diagrams" },
                    { slug: "sci-physics-p2-l6-newtons-first-law-and-balanced-forces", title: "Newtons First Law and Balanced Forces" },
                    { slug: "sci-physics-p2-l7-newtons-second-law-and-f-ma", title: "Newtons Second Law and F Ma" },
                    { slug: "sci-physics-p2-l8-newtons-third-law-and-force-pairs", title: "Newtons Third Law and Force Pairs" },
                    { slug: "sci-physics-p2-l9-mass-weight-and-gravitational-field-strength", title: "Mass Weight and Gravitational Field Strength" },
                    { slug: "sci-physics-p2-l10-momentum-and-momentum-calculations", title: "Momentum and Momentum Calculations" },
                    { slug: "sci-physics-p2-l11-momentum-in-collisions", title: "Momentum in Collisions" },
                    { slug: "sci-physics-p2-l12-forces-that-change-shape-elastic-and-plastic-deformation", title: "Forces That Change Shape Elastic and Plastic Deformation" },
                    { slug: "sci-physics-p2-l13-hookes-law-force-extension-and-spring-constant", title: "Hooke's Law — Force, Extension and Spring Constant" },
                    { slug: "sci-physics-p2-l14-energy-transferred-when-springs-are-stretched", title: "Energy Transferred When Springs Are Stretched" },
                    { slug: "sci-physics-p2-l15-moments-turning-effects-levers-and-gears", title: "Moments Turning Effects Levers and Gears" },
                    { slug: "sci-physics-p2-l16-pressure-in-fluids-force-area-and-pressure", title: "Pressure in Fluids Force Area and Pressure" }
                ]
            },
            {
                tag: "P3", title: "Electricity and Magnetism",
                lectures: [
                    { slug: "sci-physics-p3-l1-static-electricity-positive-and-negative-charge", title: "Static Electricity Positive and Negative Charge" },
                    { slug: "sci-physics-p3-l2-charging-by-friction-and-electrostatic-forces", title: "Charging by Friction and Electrostatic Forces" },
                    { slug: "sci-physics-p3-l3-electric-fields-and-field-lines", title: "Electric Fields and Field Lines" },
                    { slug: "sci-physics-p3-l4-current-charge-and-potential-difference", title: "Current Charge and Potential Difference" },
                    { slug: "sci-physics-p3-l5-resistance-and-ohms-law", title: "Resistance and Ohm's Law" },
                    { slug: "sci-physics-p3-l6-series-circuits-current-and-potential-difference", title: "Series Circuits Current and Potential Difference" },
                    { slug: "sci-physics-p3-l7-parallel-circuits-current-and-potential-difference", title: "Parallel Circuits Current and Potential Difference" },
                    { slug: "sci-physics-p3-l8-resistance-in-series-and-parallel-circuits", title: "Resistance in Series and Parallel Circuits" },
                    { slug: "sci-physics-p3-l9-i-v-characteristics-and-circuit-components", title: "I-V Characteristics and Circuit Components" },
                    { slug: "sci-physics-p3-l10-electrical-power-and-energy", title: "Electrical Power and Energy" },
                    { slug: "sci-physics-p3-l11-permanent-and-induced-magnets", title: "Permanent and Induced Magnets" },
                    { slug: "sci-physics-p3-l12-magnetic-fields-and-field-lines", title: "Magnetic Fields and Field Lines" },
                    { slug: "sci-physics-p3-l13-magnetic-fields-around-current-carrying-wires", title: "Magnetic Fields Around Current Carrying Wires" },
                    { slug: "sci-physics-p3-l14-the-motor-effect", title: "The Motor Effect" },
                    { slug: "sci-physics-p3-l15-flemings-left-hand-rule-and-force-direction", title: "Fleming's Left-Hand Rule and Force Direction" },
                    { slug: "sci-physics-p3-l16-electric-motors-and-their-applications", title: "Electric Motors and Their Applications" },
                    { slug: "sci-physics-p3-l17-electromagnetic-induction-and-the-generator-effect", title: "Electromagnetic Induction and the Generator Effect" },
                    { slug: "sci-physics-p3-l18-transformers-and-changing-potential-difference", title: "Transformers and Changing Potential Difference" }
                ]
            },
            {
                tag: "P4", title: "Waves in Matter",
                lectures: [
                    { slug: "sci-physics-p4-l1-transverse-and-longitudinal-waves", title: "Transverse and Longitudinal Waves" },
                    { slug: "sci-physics-p4-l2-amplitude-wavelength-frequency-and-period", title: "Amplitude Wavelength Frequency and Period" },
                    { slug: "sci-physics-p4-l3-wave-speed-frequency-and-wavelength-equation", title: "Wave Speed Frequency and Wavelength Equation" },
                    { slug: "sci-physics-p4-l4-wave-behaviour-reflection-and-refraction", title: "Wave Behaviour Reflection and Refraction" },
                    { slug: "sci-physics-p4-l5-sound-waves-hearing-and-ultrasound", title: "Sound Waves Hearing and Ultrasound" },
                    { slug: "sci-physics-p4-l6-ultrasound-imaging-and-its-applications", title: "Ultrasound Imaging and Its Applications" },
                    { slug: "sci-physics-p4-l7-electromagnetic-spectrum-order-and-properties", title: "Electromagnetic Spectrum Order and Properties" },
                    { slug: "sci-physics-p4-l8-uses-of-electromagnetic-radiation", title: "Uses of Electromagnetic Radiation" },
                    { slug: "sci-physics-p4-l9-hazards-and-risks-of-electromagnetic-radiation", title: "Hazards and Risks of Electromagnetic Radiation" },
                    { slug: "sci-physics-p4-l10-atomic-structure-and-nuclear-radiation", title: "Atomic Structure and Nuclear Radiation" },
                    { slug: "sci-physics-p4-l11-alpha-beta-and-gamma-radiation", title: "Alpha Beta and Gamma Radiation" },
                    { slug: "sci-physics-p4-l12-properties-and-penetrating-power-of-nuclear-radiation", title: "Properties and Penetrating Power of Nuclear Radiation" },
                    { slug: "sci-physics-p4-l13-nuclear-equations-and-radioactive-decay", title: "Nuclear Equations and Radioactive Decay" },
                    { slug: "sci-physics-p4-l14-half-life-background-radiation-and-radioactive-hazards", title: "Half Life Background Radiation and Radioactive Hazards" }
                ]
            },
            {
                tag: "P5", title: "Energy",
                lectures: [
                    { slug: "sci-physics-p5-l1-work-done-and-energy-transfer", title: "Work Done and Energy Transfer" },
                    { slug: "sci-physics-p5-l2-calculating-work-done", title: "Calculating Work Done" },
                    { slug: "sci-physics-p5-l3-energy-transferred-by-forces", title: "Energy Transferred by Forces" },
                    { slug: "sci-physics-p5-l4-power-definition-and-calculations", title: "Power Definition and Calculations" },
                    { slug: "sci-physics-p5-l5-efficiency-definition-and-calculations", title: "Efficiency Definition and Calculations" },
                    { slug: "sci-physics-p5-l6-energy-dissipation-and-unwanted-energy-transfers", title: "Energy Dissipation and Unwanted Energy Transfers" },
                    { slug: "sci-physics-p5-l7-reducing-energy-wastage-and-improving-efficiency", title: "Reducing Energy Wastage and Improving Efficiency" },
                    { slug: "sci-physics-p5-l8-energy-transfer-calculations-and-applications", title: "Energy Transfer Calculations and Applications" }
                ]
            },
            {
                tag: "P6", title: "Global Challenges",
                lectures: [
                    { slug: "sci-physics-p6-l1-thinking-distance-and-reaction-time", title: "Thinking Distance and Reaction Time" },
                    { slug: "sci-physics-p6-l2-factors-affecting-thinking-distance", title: "Factors Affecting Thinking Distance" },
                    { slug: "sci-physics-p6-l3-braking-distance-and-factors-affecting-it", title: "Braking Distance and Factors Affecting It" },
                    { slug: "sci-physics-p6-l4-stopping-distance-and-road-safety", title: "Stopping Distance and Road Safety" },
                    { slug: "sci-physics-p6-l5-large-decelerations-and-their-dangers", title: "Large Decelerations and Their Dangers" },
                    { slug: "sci-physics-p6-l6-renewable-and-non-renewable-energy-resources", title: "Renewable and Non Renewable Energy Resources" },
                    { slug: "sci-physics-p6-l7-fossil-fuels-nuclear-fuel-and-biofuels", title: "Fossil Fuels Nuclear Fuel and Biofuels" },
                    { slug: "sci-physics-p6-l8-wind-hydroelectric-tidal-and-solar-energy", title: "Wind Hydroelectric Tidal and Solar Energy" },
                    { slug: "sci-physics-p6-l9-changing-patterns-in-energy-resource-use", title: "Changing Patterns in Energy Resource Use" },
                    { slug: "sci-physics-p6-l10-the-national-grid-and-high-voltage-transmission", title: "The National Grid and High Voltage Transmission" },
                    { slug: "sci-physics-p6-l11-step-up-and-step-down-transformers-in-the-national-grid", title: "Step Up and Step Down Transformers in the National Grid" },
                    { slug: "sci-physics-p6-l12-mains-electricity-ac-dc-and-electrical-safety", title: "Mains Electricity Ac Dc and Electrical Safety" }
                ]
            }
        ]
    }
];