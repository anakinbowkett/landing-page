/* ════════════════════════════════════════════
   Montura Learn — AQA GCSE Combined Science (Foundation)
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
                tag: "P1", title: "Energy",
                lectures: [
                    { slug: "sci-phys-p1-l1-energy-stores-and-energy-transfers", title: "Energy Stores and Energy Transfers" },
                    { slug: "sci-phys-p1-l2-kinetic-energy-calculations", title: "Kinetic Energy Calculations" },
                    { slug: "sci-phys-p1-l3-gravitational-potential-energy-calculations", title: "Gravitational Potential Energy Calculations" },
                    { slug: "sci-phys-p1-l4-elastic-potential-energy-calculations", title: "Elastic Potential Energy Calculations" },
                    { slug: "sci-phys-p1-l5-specific-heat-capacity-and-energy-transfers", title: "Specific Heat Capacity and Energy Transfers" },
                    { slug: "sci-phys-p1-l6-power-and-power-calculations", title: "Power and Power Calculations" },
                    { slug: "sci-phys-p1-l7-conservation-of-energy-and-energy-dissipation", title: "Conservation of Energy and Energy Dissipation" },
                    { slug: "sci-phys-p1-l8-reducing-unwanted-energy-transfers", title: "Reducing Unwanted Energy Transfers" },
                    { slug: "sci-phys-p1-l9-efficiency-calculations", title: "Efficiency Calculations" },
                    { slug: "sci-phys-p1-l10-renewable-and-non-renewable-energy-resources", title: "Renewable and Non Renewable Energy Resources" },
                    { slug: "sci-phys-p1-l11-comparing-energy-resources-and-environmental-impact", title: "Comparing Energy Resources and Environmental Impact" }
                ]
            },
            {
                tag: "P2", title: "Electricity",
                lectures: [
                    { slug: "sci-phys-p2-l1-circuit-diagrams-and-standard-circuit-symbols", title: "Circuit Diagrams and Standard Circuit Symbols" },
                    { slug: "sci-phys-p2-l2-electric-charge-current-and-charge-flow", title: "Electric Charge Current and Charge Flow" },
                    { slug: "sci-phys-p2-l3-potential-difference-current-and-resistance", title: "Potential Difference Current and Resistance" },
                    { slug: "sci-phys-p2-l4-resistance-and-factors-affecting-resistance", title: "Resistance and Factors Affecting Resistance" },
                    { slug: "sci-phys-p2-l5-ohmic-and-non-ohmic-components", title: "Ohmic and Non Ohmic Components" },
                    { slug: "sci-phys-p2-l6-filament-lamps-diodes-thermistors-and-ldrs", title: "Filament Lamps Diodes Thermistors and Ldrs" },
                    { slug: "sci-phys-p2-l7-series-circuits-rules-and-calculations", title: "Series Circuits Rules and Calculations" },
                    { slug: "sci-phys-p2-l8-parallel-circuits-rules-and-calculations", title: "Parallel Circuits Rules and Calculations" },
                    { slug: "sci-phys-p2-l9-direct-and-alternating-potential-difference", title: "Direct and Alternating Potential Difference" },
                    { slug: "sci-phys-p2-l10-mains-electricity-live-neutral-and-earth-wires", title: "Mains Electricity Live Neutral and Earth Wires" },
                    { slug: "sci-phys-p2-l11-electrical-power-and-energy-calculations", title: "Electrical Power and Energy Calculations" },
                    { slug: "sci-phys-p2-l12-energy-transfers-in-electrical-appliances", title: "Energy Transfers in Electrical Appliances" },
                    { slug: "sci-phys-p2-l13-the-national-grid-and-electricity-transmission", title: "The National Grid and Electricity Transmission" },
                    { slug: "sci-phys-p2-l14-static-electricity-and-electric-fields", title: "Static Electricity and Electric Fields" }
                ]
            },
            {
                tag: "P3", title: "Particle Model of Matter",
                lectures: [
                    { slug: "sci-phys-p3-l1-density-and-density-calculations", title: "Density and Density Calculations" },
                    { slug: "sci-phys-p3-l2-particle-model-and-changes-of-state", title: "Particle Model and Changes of State" },
                    { slug: "sci-phys-p3-l3-conservation-of-mass-during-changes-of-state", title: "Conservation of Mass During Changes of State" },
                    { slug: "sci-phys-p3-l4-internal-energy-and-temperature", title: "Internal Energy and Temperature" },
                    { slug: "sci-phys-p3-l5-specific-heat-capacity", title: "Specific Heat Capacity" },
                    { slug: "sci-phys-p3-l6-specific-latent-heat", title: "Specific Latent Heat" }
                ]
            },
            {
                tag: "P4", title: "Atomic Structure",
                lectures: [
                    { slug: "sci-phys-p4-l1-structure-of-the-atom", title: "Structure of the Atom" },
                    { slug: "sci-phys-p4-l2-mass-number-atomic-number-and-isotopes", title: "Mass Number Atomic Number and Isotopes" },
                    { slug: "sci-phys-p4-l3-electrons-and-energy-levels", title: "Electrons and Energy Levels" },
                    { slug: "sci-phys-p4-l4-development-of-the-atomic-model", title: "Development of the Atomic Model" },
                    { slug: "sci-phys-p4-l5-radioactive-decay-and-ionising-radiation", title: "Radioactive Decay and Ionising Radiation" },
                    { slug: "sci-phys-p4-l6-alpha-beta-and-gamma-radiation", title: "Alpha Beta and Gamma Radiation" },
                    { slug: "sci-phys-p4-l7-nuclear-equations-for-alpha-and-beta-decay", title: "Nuclear Equations for Alpha and Beta Decay" },
                    { slug: "sci-phys-p4-l8-half-life-and-random-radioactive-decay", title: "Half Life and Random Radioactive Decay" },
                    { slug: "sci-phys-p4-l9-radioactive-contamination-and-irradiation", title: "Radioactive Contamination and Irradiation" },
                    { slug: "sci-phys-p4-l10-background-radiation-and-its-sources", title: "Background Radiation and Its Sources" },
                    { slug: "sci-phys-p4-l11-uses-and-hazards-of-ionising-radiation", title: "Uses and Hazards of Ionising Radiation" },
                    { slug: "sci-phys-p4-l12-nuclear-fission-and-fusion", title: "Nuclear Fission and Fusion" }
                ]
            },
            {
                tag: "P5", title: "Forces",
                lectures: [
                    { slug: "sci-phys-p5-l7-moments-levers-and-turning-effects", title: "Moments Levers and Turning Effects" },
                    { slug: "sci-phys-p5-l8-pressure-in-fluids", title: "Pressure in Fluids" },
                    { slug: "sci-phys-p5-l9-atmospheric-pressure", title: "Atmospheric Pressure" },
                    { slug: "sci-phys-p5-l10-distance-displacement-speed-and-velocity", title: "Distance Displacement Speed and Velocity" },
                    { slug: "sci-phys-p5-l11-distance-time-graphs", title: "Distance Time Graphs" },
                    { slug: "sci-phys-p5-l12-acceleration-and-velocity-time-graphs", title: "Acceleration and Velocity Time Graphs" },
                    { slug: "sci-phys-p5-l13-newtons-first-law-and-balanced-forces", title: "Newtons First Law and Balanced Forces" },
                    { slug: "sci-phys-p5-l14-newtons-second-law-and-f-ma", title: "Newtons Second Law and F Ma" },
                    { slug: "sci-phys-p5-l15-newtons-third-law", title: "Newtons Third Law" },
                    { slug: "sci-phys-p5-l16-stopping-distances-thinking-and-braking-distance", title: "Stopping Distances Thinking and Braking Distance" }
                ]
            },
            {
                tag: "P6", title: "Waves",
                lectures: [
                    { slug: "sci-phys-p6-l1-transverse-and-longitudinal-waves", title: "Transverse and Longitudinal Waves" },
                    { slug: "sci-phys-p6-l2-wave-properties-amplitude-wavelength-frequency-and-period", title: "Wave Properties Amplitude Wavelength Frequency and Period" },
                    { slug: "sci-phys-p6-l3-the-wave-equation-and-wave-speed", title: "The Wave Equation and Wave Speed" },
                    { slug: "sci-phys-p6-l4-reflection-and-refraction", title: "Reflection and Refraction" },
                    { slug: "sci-phys-p6-l5-sound-waves-and-hearing", title: "Sound Waves and Hearing" },
                    { slug: "sci-phys-p6-l6-ultrasound-and-its-uses", title: "Ultrasound and Its Uses" },
                    { slug: "sci-phys-p6-l7-seismic-waves", title: "Seismic Waves" },
                    { slug: "sci-phys-p6-l8-the-electromagnetic-spectrum", title: "The Electromagnetic Spectrum" },
                    { slug: "sci-phys-p6-l9-properties-and-uses-of-radio-waves-and-microwaves", title: "Properties and Uses of Radio Waves and Microwaves" },
                    { slug: "sci-phys-p6-l10-properties-and-uses-of-infrared-and-visible-light", title: "Properties and Uses of Infrared and Visible Light" },
                    { slug: "sci-phys-p6-l11-properties-and-uses-of-ultraviolet-x-rays-and-gamma-rays", title: "Properties and Uses of Ultraviolet X Rays and Gamma Rays" },
                    { slug: "sci-phys-p6-l12-hazards-of-electromagnetic-radiation", title: "Hazards of Electromagnetic Radiation" },
                    { slug: "sci-phys-p6-l13-lenses-and-ray-diagrams", title: "Lenses and Ray Diagrams" },
                    { slug: "sci-phys-p6-l14-visible-light-colour-and-filters", title: "Visible Light Colour and Filters" },
                    { slug: "sci-phys-p6-l15-infrared-emission-and-absorption", title: "Infrared Emission and Absorption" }
                ]
            },
            {
                tag: "P7", title: "Magnetism and Electromagnetism",
                lectures: [
                    { slug: "sci-phys-p7-l1-permanent-and-induced-magnets", title: "Permanent and Induced Magnets" },
                    { slug: "sci-phys-p7-l2-magnetic-fields-and-field-lines", title: "Magnetic Fields and Field Lines" },
                    { slug: "sci-phys-p7-l3-the-motor-effect-and-magnetic-forces", title: "The Motor Effect and Magnetic Forces" },
                    { slug: "sci-phys-p7-l4-electric-motors", title: "Electric Motors" },
                    { slug: "sci-phys-p7-l5-loudspeakers", title: "Loudspeakers" },
                    { slug: "sci-phys-p7-l6-the-generator-effect-and-induced-potential", title: "The Generator Effect and Induced Potential" },
                    { slug: "sci-phys-p7-l7-microphones", title: "Microphones" },
                    { slug: "sci-phys-p7-l8-alternating-current-generators", title: "Alternating Current Generators" },
                    { slug: "sci-phys-p7-l9-transformers-and-transformer-calculations", title: "Transformers and Transformer Calculations" }
                ]
            }
        ]
    }
];