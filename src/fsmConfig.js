// FSM Configuration - Defines transition rules and data coupling for biological levels

const STATES = {
  NORMAL: 'NORMAL',
  EXCITED: 'EXCITED',
  DEAD: 'DEAD'
};

const TRANSITIONS = {
  NORMAL_TO_EXCITED: 'NORMAL_TO_EXCITED',
  EXCITED_TO_NORMAL: 'EXCITED_TO_NORMAL',
  EXCITED_TO_DEAD: 'EXCITED_TO_DEAD',
  NORMAL_TO_DEAD: 'NORMAL_TO_DEAD'
};

const LEVELS = ['predator', 'flock', 'individual', 'muscle', 'microscopic'];

// Transition rules: Define when each level should activate (NORMAL → EXCITED)
const TRANSITION_RULES = {
  predator: {
    shouldActivate: (dataValues, levelId) => {
      const hunger = parseFloat(dataValues[`${levelId}-Hunger`]) || 0;
      return hunger > 80;
    }
  },
  flock: {
    shouldActivate: (dataValues, levelId) => {
      const cohesion = parseFloat(dataValues[`${levelId}-Cohesion`]) || 0;
      const variance = parseFloat(dataValues[`${levelId}-Variance`]) || 0;
      return cohesion < 50 && variance > 50;
    }
  },
  individual: {
    shouldActivate: (dataValues, levelId) => {
      const fearLevel = parseFloat(dataValues[`${levelId}-Fear Level`]) || 0;
      return fearLevel > 40;
    }
  },
  muscle: {
    shouldActivate: (dataValues, levelId) => {
      const electricalActivation = parseFloat(dataValues[`${levelId}-Electrical Activation`]) || 0;
      return electricalActivation > 60;
    }
  },
  microscopic: {
    shouldActivate: (dataValues, levelId) => {
      const atpConsumption = parseFloat(dataValues[`${levelId}-ATP Consumption`]) || 0;
      return atpConsumption > 70;
    }
  }
};

// Data coupling rules: How levels influence each other's data points
// Format: { sourceLevel: [{ targetLevel, targetDataPoint, influence, mode, condition }] }
const COUPLING_RULES = {
  predator: [
    {
      targetLevel: 'flock',
      targetDataPoint: 'Collective Energy',
      influence: 15,
      mode: 'add',
      condition: (sourceState) => sourceState === STATES.EXCITED
    },
    {
      targetLevel: 'individual',
      targetDataPoint: 'Fear Level',
      influence: 20,
      mode: 'add',
      condition: (sourceState) => sourceState === STATES.EXCITED
    }
  ],
  flock: [
    {
      targetLevel: 'individual',
      targetDataPoint: 'Neighbor Proximity',
      influence: -10,
      mode: 'add',
      condition: (sourceState) => sourceState === STATES.EXCITED
    },
    {
      targetLevel: 'muscle',
      targetDataPoint: 'Force Production',
      influence: 10,
      mode: 'add',
      condition: (sourceState) => sourceState === STATES.EXCITED
    }
  ],
  individual: [
    {
      targetLevel: 'muscle',
      targetDataPoint: 'Electrical Activation',
      influence: 15,
      mode: 'add',
      condition: (sourceState) => sourceState === STATES.EXCITED
    },
    {
      targetLevel: 'muscle',
      targetDataPoint: 'Lactic Acid',
      influence: 8,
      mode: 'add',
      condition: (sourceState) => sourceState === STATES.EXCITED
    }
  ],
  muscle: [
    {
      targetLevel: 'microscopic',
      targetDataPoint: 'ATP Consumption',
      influence: 12,
      mode: 'add',
      condition: (sourceState) => sourceState === STATES.EXCITED
    },
    {
      targetLevel: 'microscopic',
      targetDataPoint: 'Cross-bridge Attach/Detach',
      influence: 10,
      mode: 'add',
      condition: (sourceState) => sourceState === STATES.EXCITED
    }
  ],
  microscopic: [
    {
      targetLevel: 'muscle',
      targetDataPoint: 'Heat',
      influence: 5,
      mode: 'add',
      condition: (sourceState) => sourceState === STATES.EXCITED
    }
  ]
};

// FSM configuration object
const FSM_CONFIG = {
  states: STATES,
  transitions: TRANSITIONS,
  levels: LEVELS,
  transitionRules: TRANSITION_RULES,
  couplingRules: COUPLING_RULES
};

// Export for use in app.jsx
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FSM_CONFIG, STATES, TRANSITIONS, LEVELS };
} else if (typeof window !== 'undefined') {
  window.FSM_CONFIG = FSM_CONFIG;
  window.STATES = STATES;
  window.TRANSITIONS = TRANSITIONS;
  window.LEVELS = LEVELS;
}
