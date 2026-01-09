// BiologicalFSM - Finite State Machine for autonomous biological level transitions
// Each level monitors its own data and transitions based on internal thresholds

class BiologicalFSM {
  constructor(config = {}) {
    this.states = config.states || {
      NORMAL: 'NORMAL',
      EXCITED: 'EXCITED',
      DEAD: 'DEAD'
    };

    this.transitions = config.transitions || {
      NORMAL_TO_EXCITED: 'NORMAL_TO_EXCITED',
      EXCITED_TO_NORMAL: 'EXCITED_TO_NORMAL',
      EXCITED_TO_DEAD: 'EXCITED_TO_DEAD',
      NORMAL_TO_DEAD: 'NORMAL_TO_DEAD'
    };

    // Current state for each level
    this.levelStates = {};

    // Transition rules: conditions for NORMAL → EXCITED
    this.transitionRules = config.transitionRules || {};

    // Data coupling: how levels influence each other's data
    this.couplingRules = config.couplingRules || {};

    // Valid state transitions graph
    this.validTransitions = {
      [this.states.NORMAL]: [this.states.EXCITED, this.states.DEAD],
      [this.states.EXCITED]: [this.states.NORMAL, this.states.DEAD],
      [this.states.DEAD]: [] // Terminal state
    };

    // Event subscribers
    this.subscribers = [];

    // Initialize levels
    this.levels = config.levels || [];
    this.levels.forEach(level => {
      this.levelStates[level] = this.states.NORMAL;
    });
  }

  // Get current state for a level
  getState(levelId) {
    return this.levelStates[levelId];
  }

  // Get all states
  getAllStates() {
    return { ...this.levelStates };
  }

  // Check if a transition is valid
  canTransition(levelId, fromState, toState) {
    if (fromState === this.states.DEAD) return false; // Dead is terminal
    return this.validTransitions[fromState]?.includes(toState) || false;
  }

  // Perform a state transition
  transition(levelId, toState, options = {}) {
    const fromState = this.levelStates[levelId];

    if (!this.canTransition(levelId, fromState, toState)) {
      console.warn(`Invalid transition: ${levelId} ${fromState} → ${toState}`);
      return null;
    }

    // Determine transition type
    let transitionType = null;
    if (fromState === this.states.NORMAL && toState === this.states.EXCITED) {
      transitionType = this.transitions.NORMAL_TO_EXCITED;
    } else if (fromState === this.states.EXCITED && toState === this.states.NORMAL) {
      transitionType = this.transitions.EXCITED_TO_NORMAL;
    } else if (fromState === this.states.EXCITED && toState === this.states.DEAD) {
      transitionType = this.transitions.EXCITED_TO_DEAD;
    } else if (fromState === this.states.NORMAL && toState === this.states.DEAD) {
      transitionType = this.transitions.NORMAL_TO_DEAD;
    }

    // Update state
    this.levelStates[levelId] = toState;

    // Create transition event
    const event = {
      levelId,
      fromState,
      toState,
      transitionType,
      timestamp: new Date().toLocaleTimeString(),
      playTransition: options.playTransition !== false
    };

    // Notify subscribers
    this.notifySubscribers('transition', event);

    return event;
  }

  // Evaluate all levels and auto-transition based on data thresholds
  evaluateTransitions(dataValues) {
    const transitions = [];

    this.levels.forEach(levelId => {
      const currentState = this.levelStates[levelId];

      // Only evaluate if in NORMAL state (autonomous activation)
      if (currentState === this.states.NORMAL) {
        const rule = this.transitionRules[levelId];

        if (rule && rule.shouldActivate) {
          const shouldActivate = rule.shouldActivate(dataValues, levelId);

          if (shouldActivate) {
            const event = this.transition(levelId, this.states.EXCITED, { playTransition: true });
            if (event) {
              transitions.push(event);
            }
          }
        }
      }

      // TODO: Add logic for EXCITED → NORMAL (recovery)
      // TODO: Add logic for EXCITED → DEAD (failure conditions)
    });

    return transitions;
  }

  // Apply data coupling effects between levels
  applyDataCoupling(dataValues, levelStates) {
    const modifiedData = { ...dataValues };

    // Apply coupling rules
    Object.entries(this.couplingRules).forEach(([sourceLevel, rules]) => {
      const sourceState = levelStates[sourceLevel];

      rules.forEach(rule => {
        const { targetLevel, targetDataPoint, influence } = rule;

        // Only apply influence if conditions are met
        if (rule.condition && !rule.condition(sourceState, levelStates)) {
          return;
        }

        const key = `${targetLevel}-${targetDataPoint}`;
        const currentValue = parseFloat(modifiedData[key]) || 0;

        // Apply influence (additive or multiplicative)
        if (rule.mode === 'add') {
          modifiedData[key] = (currentValue + influence).toFixed(1);
        } else if (rule.mode === 'multiply') {
          modifiedData[key] = (currentValue * influence).toFixed(1);
        } else if (rule.mode === 'set') {
          modifiedData[key] = influence.toFixed(1);
        }
      });
    });

    return modifiedData;
  }

  // Subscribe to FSM events
  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  // Notify all subscribers
  notifySubscribers(eventType, data) {
    this.subscribers.forEach(callback => {
      callback(eventType, data);
    });
  }

  // Force a state change (for testing/debugging)
  forceState(levelId, state) {
    const oldState = this.levelStates[levelId];
    this.levelStates[levelId] = state;

    this.notifySubscribers('stateChange', {
      levelId,
      oldState,
      newState: state,
      forced: true
    });
  }

  // Reset all levels to NORMAL
  reset() {
    this.levels.forEach(level => {
      this.levelStates[level] = this.states.NORMAL;
    });
    this.notifySubscribers('reset', { levels: this.levels });
  }
}

// Export for use in app.jsx
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BiologicalFSM;
} else if (typeof window !== 'undefined') {
  window.BiologicalFSM = BiologicalFSM;
}
