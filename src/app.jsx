const { useState, useEffect, useRef } = React;

// ============================================================================
// BiologicalFSM - Finite State Machine for autonomous biological transitions
// ============================================================================

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


// ============================================================================
// FSM Configuration - Transition rules and data coupling
// ============================================================================


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



// Debug configuration
const DEBUG_CONFIG = {
  INITIAL_STATE: false,  // Start with debug off
  SHOW_FPS: true,        // Show FPS counter
  SHOW_STATES: true,     // Show state badges on videos
  SHOW_LERP_RATES: true, // Show lerp rates on data points
  SHOW_VIDEO_PATHS: true,// Show video file paths
  SHOW_HISTORY: true,    // Show transition history
};

const VideoInstallation = () => {
  const [predatorActive, setPredatorActive] = useState(false);
  const [dataValues, setDataValues] = useState({});
  const [debugMode, setDebugMode] = useState(DEBUG_CONFIG.INITIAL_STATE);

  // Store target values and lerp rates for smooth transitions
  const targetValuesRef = useRef({});
  const lerpRatesRef = useRef({});

  // Debug metrics
  const [fps, setFps] = useState(0);
  const [transitionHistory, setTransitionHistory] = useState([]);
  const frameTimesRef = useRef([]);
  const lastFrameTimeRef = useRef(performance.now());

  // Initialize FSM instance
  const fsmRef = useRef(null);
  if (!fsmRef.current) {
    fsmRef.current = new BiologicalFSM(FSM_CONFIG);
  }
  const fsm = fsmRef.current;

  // State machine for each biological level (synced with FSM)
  const [levelStates, setLevelStates] = useState(fsm.getAllStates());

  // Track if we're playing a transition video
  const [transitioningLevels, setTransitioningLevels] = useState({
    predator: null,
    flock: null,
    individual: null,
    muscle: null,
    microscopic: null
  });

  // Subscribe to FSM events
  useEffect(() => {
    const unsubscribe = fsm.subscribe((eventType, data) => {
      if (eventType === 'transition') {
        // Update transition history for debug
        if (debugMode && DEBUG_CONFIG.SHOW_HISTORY) {
          setTransitionHistory(prev => [
            data,
            ...prev.slice(0, 9)
          ]);
        }

        // Handle transition video playback
        if (data.playTransition) {
          setTransitioningLevels(prev => ({
            ...prev,
            [data.levelId]: data.transitionType
          }));

          // After 3 seconds, clear transition and sync states
          setTimeout(() => {
            setTransitioningLevels(prev => ({
              ...prev,
              [data.levelId]: null
            }));
            setLevelStates(fsm.getAllStates());
          }, 3000);
        } else {
          // Immediate state sync
          setLevelStates(fsm.getAllStates());
        }
      }
    });

    return unsubscribe;
  }, [fsm, debugMode]);

  const videoSections = [
    {
      id: 'predator',
      title: 'PREDATOR',
      subtitle: 'Bird of prey in high-tension waiting',
      dataPoints: ['Hunger', 'Energy', 'Tilt/Orientation', 'Prey Proximity', 'Sensory Confidence', 'Success Probability']
    },
    {
      id: 'flock',
      title: 'POPULATION',
      subtitle: 'Flock moving as one',
      dataPoints: ['Collective Energy', 'Cohesion', 'Variance', 'Obstacles', 'Signal Propagation Delay']
    },
    {
      id: 'individual',
      title: 'INDIVIDUAL',
      subtitle: 'Single bird in flight',
      dataPoints: ['Experience Level', 'Fear Level', 'Fatigue', 'Calories Expended', 'Neighbor Proximity', 'Reaction Latency', 'Survival Probability']
    },
    {
      id: 'muscle',
      title: 'ORGAN',
      subtitle: 'Muscle contracting',
      dataPoints: ['Force Production', 'Electrical Activation', 'Intracellular Calcium', 'Stiffness', 'Lactic Acid', 'Heat']
    },
    {
      id: 'microscopic',
      title: 'MICROSCOPIC',
      subtitle: 'Molecular cross-bridge cycling',
      dataPoints: ['Cross-bridge Attach/Detach', 'ATP Consumption', 'Binding Probability', 'Molecular Fatigue', 'Thermal Noise']
    }
  ];

  // Get video path based on current state using new directory structure
  const getVideoPath = (levelId, currentState, transition = null) => {
    // New structure: videos/[level]/[file].mp4
    if (transition) {
      // Playing the single transition video
      return `videos/${levelId}/transition.mp4`;
    }

    if (currentState === STATES.DEAD) {
      // For DEAD state, freeze on last frame of excited or show static
      // Since we don't have a dead.mp4, we'll pause the excited video
      return `videos/${levelId}/excited.mp4`;
    }

    // Playing a state video (normal or excited)
    return `videos/${levelId}/${currentState.toLowerCase()}.mp4`;
  };

  // Wrapper for FSM transition (for backwards compatibility)
  const transitionState = (levelId, toState, playTransition = true) => {
    fsm.transition(levelId, toState, { playTransition });
  };

  // Get data range multiplier based on state
  const getDataMultiplier = (levelId, dataPoint) => {
    const state = levelStates[levelId];

    if (state === STATES.DEAD) {
      // Dead state: most values near zero, some decay indicators high
      if (dataPoint.includes('Heat') || dataPoint.includes('Lactic Acid')) {
        return 0.3; // Residual
      }
      return 0.1; // Mostly dead
    }

    if (state === STATES.EXCITED) {
      // Excited state: high values, lots of activity
      if (dataPoint.includes('Fear') || dataPoint.includes('Energy') ||
        dataPoint.includes('Force') || dataPoint.includes('ATP')) {
        return 1.5; // Amplified
      }
      return 1.2; // Generally higher
    }

    // Normal state: baseline values
    return 0.7;
  };

  // Initialize lerp rates for each data point (only once)
  useEffect(() => {
    const rates = {};
    videoSections.forEach(section => {
      section.dataPoints.forEach(point => {
        const key = `${section.id}-${point}`;
        // Random lerp rate between 0.02 (very slow) and 0.3 (very fast)
        rates[key] = 0.02 + Math.random() * 0.28;
      });
    });
    lerpRatesRef.current = rates;
  }, []);

  // Generate new target values periodically
  useEffect(() => {
    const targetInterval = setInterval(() => {
      const newTargets = {};
      videoSections.forEach(section => {
        section.dataPoints.forEach(point => {
          const key = `${section.id}-${point}`;
          const multiplier = getDataMultiplier(section.id, point);
          const baseValue = Math.random() * 100;
          newTargets[key] = baseValue * multiplier;
        });
      });
      targetValuesRef.current = newTargets;
    }, 800); // Generate new targets every 800ms

    return () => clearInterval(targetInterval);
  }, [levelStates]);

  // Smooth lerping animation loop (runs at ~60fps)
  useEffect(() => {
    let animationFrameId;
    let evaluationCounter = 0;

    const lerp = (start, end, rate) => {
      return start + (end - start) * rate;
    };

    const animate = () => {
      // Calculate FPS for debug
      if (debugMode && DEBUG_CONFIG.SHOW_FPS) {
        const now = performance.now();
        const deltaTime = now - lastFrameTimeRef.current;
        lastFrameTimeRef.current = now;

        frameTimesRef.current.push(deltaTime);
        if (frameTimesRef.current.length > 60) {
          frameTimesRef.current.shift();
        }

        // Update FPS every 30 frames
        if (frameTimesRef.current.length === 60) {
          const avgFrameTime = frameTimesRef.current.reduce((a, b) => a + b) / frameTimesRef.current.length;
          setFps(Math.round(1000 / avgFrameTime));
        }
      }

      setDataValues(prevValues => {
        const newValues = {};

        videoSections.forEach(section => {
          section.dataPoints.forEach(point => {
            const key = `${section.id}-${point}`;
            const currentValue = parseFloat(prevValues[key]) || 0;
            const targetValue = targetValuesRef.current[key] || currentValue;
            const lerpRate = lerpRatesRef.current[key] || 0.1;

            // Lerp towards target value
            const newValue = lerp(currentValue, targetValue, lerpRate);
            newValues[key] = newValue.toFixed(1);
          });
        });

        // Apply data coupling from FSM
        const coupledValues = fsm.applyDataCoupling(newValues, fsm.getAllStates());

        // Evaluate transitions every 30 frames (~2 times per second at 60fps)
        evaluationCounter++;
        if (evaluationCounter >= 30) {
          fsm.evaluateTransitions(coupledValues);
          evaluationCounter = 0;
        }

        return coupledValues;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [fsm, debugMode]);

  // Predator activation - inject hunger spike to trigger autonomous cascade
  const handlePredatorActivation = () => {
    setPredatorActive(true);

    // Instead of forcing state transitions, spike predator's Hunger data
    // This will trigger the autonomous FSM evaluation
    const hungerKey = 'predator-Hunger';
    targetValuesRef.current[hungerKey] = 95; // Spike above threshold (>80)

    // Visual feedback clears after 2 seconds
    setTimeout(() => {
      setPredatorActive(false);
    }, 2000);
  };

  // Listen for keyboard shortcuts (for testing different scenarios)
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        handlePredatorActivation();
      }

      // Toggle debug mode with 'D' key
      if (e.code === 'KeyD') {
        setDebugMode(prev => !prev);
      }

      // Testing shortcuts for state transitions
      if (e.code === 'Digit1') {
        // Force all to NORMAL
        Object.keys(levelStates).forEach(level => {
          if (levelStates[level] !== STATES.NORMAL) {
            transitionState(level, STATES.NORMAL, false);
          }
        });
      }
      if (e.code === 'Digit2') {
        // Force all to EXCITED
        Object.keys(levelStates).forEach(level => {
          if (levelStates[level] !== STATES.DEAD) {
            transitionState(level, STATES.EXCITED, false);
          }
        });
      }
      if (e.code === 'Digit3') {
        // Force individual to DEAD (demonstration)
        transitionState('individual', STATES.DEAD);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [levelStates]);

  return (
    <div className="w-full h-screen bg-black text-white font-mono overflow-hidden">
      {/* Main Grid Container */}
      <div className="h-full flex flex-col p-3 gap-2">
        {videoSections.map((section, index) => {
          const currentState = levelStates[section.id];
          const transition = transitioningLevels[section.id];
          const videoPath = getVideoPath(section.id, currentState, transition);
          const isDead = currentState === STATES.DEAD;
          // const isExcited = currentState === STATES.EXCITED || predatorActive;
          const isExcited = false;

          return (
            <div
              key={section.id}
              className={`flex-1 flex gap-3 border transition-all duration-300 ${isExcited ? 'border-red-500 border-2' : isDead ? 'border-gray-600' : 'border-gray-800'
                }`}
            >
              {/* Video Section */}
              <div className={`flex-[2] bg-gray-900 relative overflow-hidden ${isDead ? 'opacity-50' : ''}`}>
                {/* Video Element */}
                <video
                  key={videoPath} // Force re-render when video changes
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    filter: isDead ? 'grayscale(100%) contrast(0.5) brightness(0.3)' : 'grayscale(100%) contrast(1.2)',
                    mixBlendMode: 'screen'
                  }}
                  src={videoPath}
                  autoPlay
                  loop={!transition && !isDead} // Don't loop transition videos or dead state
                  muted
                  playsInline
                />

                {/* Grainy overlay effect */}
                <div
                  className="absolute inset-0 opacity-30 pointer-events-none mix-blend-overlay"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
                    backgroundSize: 'cover'
                  }}
                />

                {/* Video Title Overlay */}
                {debugMode && DEBUG_CONFIG.SHOW_STATES && <div className="absolute top-4 left-4 z-10 bg-black bg-opacity-80 px-3 py-2 rounded">
                  <h2 className="text-sm font-bold tracking-wider">{section.title}</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{section.subtitle}</p>
                  {/* State indicator */}
                  <div className="mt-2 flex gap-2 items-center">
                    <span className={`text-xs px-2 py-0.5 rounded ${currentState === STATES.DEAD ? 'bg-gray-700 text-gray-400' :
                      currentState === STATES.EXCITED ? 'bg-red-600 text-white' :
                        'bg-blue-600 text-white'
                      }`}>
                      {transition ? '→ TRANSITION' : currentState}
                    </span>
                  </div>
                </div>}

                {/* Video placeholder if file not found */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-700 text-xs pointer-events-none">
                  <div className="text-center">
                    <div className="font-mono">{debugMode && DEBUG_CONFIG.SHOW_VIDEO_PATHS && videoPath}</div>
                  </div>
                </div>
              </div>

              {/* Data Display Section */}
              <div className="flex-1 bg-black border-l border-gray-800 p-3 overflow-hidden">
                <div className="space-y-1.5">
                  {section.dataPoints.map((dataPoint, dpIndex) => {
                    const key = `${section.id}-${dataPoint}`;
                    const value = dataValues[key] || '0.0';
                    const width = parseFloat(value);
                    const lerpRate = lerpRatesRef.current[key];
                    const targetValue = targetValuesRef.current[key];

                    return (
                      <div key={dpIndex} className="flex items-center justify-between text-xs">
                        <span className="text-gray-400 uppercase tracking-wide text-[10px] flex-1 pr-2">
                          {dataPoint}
                          {debugMode && DEBUG_CONFIG.SHOW_LERP_RATES && lerpRate && (
                            <span className="text-[8px] text-gray-600 ml-1">
                              ({lerpRate.toFixed(2)})
                            </span>
                          )}
                        </span>
                        <div className="flex items-center gap-2 flex-1">
                          <div className="flex-1 h-1 bg-gray-800 relative overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${isDead ? 'bg-gray-600' :
                                isExcited ? 'bg-red-500' : 'bg-white'
                                }`}
                              style={{ width: `${width}%` }}
                            />
                          </div>
                          <span className={`font-mono w-12 text-right text-[11px] ${isDead ? 'text-gray-600' : 'text-white'
                            }`}>
                            {value}
                            {debugMode && DEBUG_CONFIG.SHOW_LERP_RATES && targetValue !== undefined && (
                              <span className="text-[8px] text-yellow-500">→{targetValue.toFixed(0)}</span>
                            )}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Predator Status Indicator */}
      {predatorActive && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-8 py-3 text-xl font-bold tracking-widest animate-pulse z-50">
          PREDATOR ACTIVE
        </div>
      )}

      {/* Debug Panel */}
      {debugMode && (
        <div className="fixed top-4 right-4 bg-black bg-opacity-90 border border-gray-700 rounded p-4 text-xs space-y-3 max-w-md z-50">
          <div className="flex items-center justify-between border-b border-gray-700 pb-2">
            <span className="text-green-400 font-bold">DEBUG MODE</span>
            <span className="text-gray-500">Press D to toggle</span>
          </div>

          {/* FPS Counter */}
          {DEBUG_CONFIG.SHOW_FPS && (
            <div className="flex items-center justify-between">
              <span className="text-gray-400">FPS:</span>
              <span className={`font-mono font-bold ${fps >= 55 ? 'text-green-400' : fps >= 30 ? 'text-yellow-400' : 'text-red-400'}`}>
                {fps}
              </span>
            </div>
          )}

          {/* Current States */}
          <div className="space-y-1">
            <div className="text-gray-400 font-bold">Current States:</div>
            {Object.entries(levelStates).map(([level, state]) => (
              <div key={level} className="flex items-center justify-between text-[10px]">
                <span className="text-gray-500 uppercase">{level}:</span>
                <span className={`px-2 py-0.5 rounded ${state === STATES.DEAD ? 'bg-gray-700 text-gray-400' :
                  state === STATES.EXCITED ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
                  }`}>
                  {state}
                </span>
              </div>
            ))}
          </div>

          {/* Transition History */}
          {DEBUG_CONFIG.SHOW_HISTORY && transitionHistory.length > 0 && (
            <div className="space-y-1">
              <div className="text-gray-400 font-bold">Recent Transitions:</div>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {transitionHistory.map((transition, idx) => (
                  <div key={idx} className="text-[9px] text-gray-500 font-mono">
                    <span className="text-gray-600">{transition.timestamp}</span>
                    {' '}
                    <span className="text-blue-400">{transition.levelId}</span>
                    {' '}
                    <span className="text-gray-600">{transition.fromState}</span>
                    →
                    <span className="text-yellow-400">{transition.toState}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="fixed bottom-4 left-4 text-gray-700 text-xs space-y-1">
        <div>Press SPACE to activate predator | D for debug | ESC to exit</div>
        <div>Press 1: Reset to NORMAL | 2: All EXCITED | 3: Kill individual</div>
      </div>
    </div>
  );
};

// Render the app
ReactDOM.render(<VideoInstallation />, document.getElementById('root'));