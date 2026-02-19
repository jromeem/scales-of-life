const videoSections = [
  {
    id: 'predator',
    title: 'Predator',
    subtitle: 'Bird of Prey',
    dataPoints: {
      bloodSugar: 0,
      speed: 0,
      reactionTime: 0,
      sensoryConfidence: 0,
      successProbability: 0,
      timeToStrike: 0
    },
    scale: 'meter'
  },
  {
    id: 'flock',
    title: 'Flock',
    subtitle: 'Collective Behavior',
    dataPoints: {
      groupKineticEnergy: 0,
      meanInterIndividualDistance: 0,
      directionalAlignmentVariance: 0,
      obstacleAvoidance: 0,
      responseLatency: 0
    },
    scale: 'meter'
  },
  {
    id: 'heart',
    title: 'Heart',
    subtitle: 'Heart Cells',
    dataPoints: {
      metabolicFlux: { label: "Metabolic Flux", rest: 0, active: 100, recover: 50 },
      functionalOutput: { label: "Functional Output", rest: 0, active: 100, recover: 50 },
      activationTiming: { label: "Activation Timing", rest: 0, active: 100, recover: 50 },
      mechanicalCompliance: { label: "Mechanical Compliance", rest: 0, active: 100, recover: 50 },
      structuralAlignment: { label: "Structural Alignment", rest: 0, active: 100, recover: 50 },
      signalFidelity: { label: "Signal Fidelity", rest: 0, active: 100, recover: 50 }
    },
    dataPoints2: [
      { label: "Metabolic Flux", rest: 0, active: 100, recover: 50 },
      { label: "Functional Output", rest: 0, active: 100, recover: 50 },
      { label: "Activation Timing", rest: 0, active: 100, recover: 50 },
      { label: "Mechanical Compliance", rest: 0, active: 100, recover: 50 },
      { label: "Structural Alignment", rest: 0, active: 100, recover: 50 },
      { label: "Signal Fidelity", rest: 0, active: 100, recover: 50 }
    ],
    scale: 'cm'
  },
  {
    id: 'swarm',
    title: 'Swarm',
    subtitle: 'Microtubule Swarms',
    dataPoints: {
      forceProduction: 0,
      controlSignal: 0,
      compliance: 0,
      configurationalEntropy: 0
    },
    scale: 'μm'
  },
  {
    id: 'myosin',
    title: 'Myosin',
    subtitle: 'Myosin Motors',
    dataPoints: {
      crossBridgeTurnover: 0,
      atpRegeneration: 0,
      extentOfReaction: 0,
      molecularFatigue: 0,
      externalLoad: 0,
      susceptibility: 0
    },
    scale: 'nm'
  }
];