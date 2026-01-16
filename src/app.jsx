const { useState, useEffect, useRef } = React;

// ============================================================================
// TWEAKS CONFIGURATION
// ============================================================================

// Import TWEAKS from tweaks.jsx (loaded first in index.html)
const tweaks = typeof TWEAKS !== 'undefined' ? TWEAKS : {
  fonts: {
    dataPointLabel: '9px',
    dataValue: '10px',
    sectionTitle: '14px',
    sectionSubtitle: '10px',
    stateBadge: '10px',
    lerpRate: '8px',
    targetValue: '8px'
  },
  overlay: {
    backgroundOpacity: 0.8,
    padding: '20px',
    borderRadius: '8px',
    minWidth: '300px',
    maxWidth: '300px',
    dataPointGap: '8px',
    dataValueWidth: '60px'
  },
  bars: {
    height: '4px',
    borderRadius: '2px',
    backgroundColor: '#333',
    fillColor: '#fff',
    deadColor: '#666'
  },
  colors: {
    labelColor: '#999',
    valueColor: '#fff',
    titleColor: '#fff',
    subtitleColor: '#999',
    lerpRateColor: '#666',
    targetValueColor: '#eab308'
  },
  stateBadges: {
    normal: { background: '#2563eb', text: '#fff' },
    excited: { background: '#dc2626', text: '#fff' },
    dead: { background: '#666', text: '#999' }
  }
};

// ============================================================================
// FINITE STATE MACHINE
// ============================================================================

const STATES = {
  NORMAL: 'NORMAL',
  EXCITED: 'EXCITED',
  DEAD: 'DEAD'
};

const LEVELS = ['predator', 'flock', 'individual', 'muscle', 'microscopic'];

// Transition rules: when each level should activate (NORMAL → EXCITED)
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

class BiologicalFSM {
  constructor(config = {}) {
    this.states = config.states || STATES;
    this.levels = config.levels || LEVELS;
    this.transitionRules = config.transitionRules || TRANSITION_RULES;
    this.levelStates = {};

    // Initialize all levels to NORMAL
    this.levels.forEach(level => {
      this.levelStates[level] = this.states.NORMAL;
    });
  }

  getState(levelId) {
    return this.levelStates[levelId];
  }

  getAllStates() {
    return { ...this.levelStates };
  }

  setState(levelId, newState) {
    this.levelStates[levelId] = newState;
  }

  // Evaluate all levels and transition if thresholds are met
  evaluateTransitions(dataValues) {
    this.levels.forEach(levelId => {
      const currentState = this.levelStates[levelId];

      // Can't transition from DEAD state
      if (currentState === this.states.DEAD) return;

      const rule = this.transitionRules[levelId];
      if (!rule) return;

      const shouldActivate = rule.shouldActivate(dataValues, levelId);

      // NORMAL → EXCITED
      if (currentState === this.states.NORMAL && shouldActivate) {
        this.setState(levelId, this.states.EXCITED);
      }
      // EXCITED → NORMAL (when threshold no longer met)
      else if (currentState === this.states.EXCITED && !shouldActivate) {
        this.setState(levelId, this.states.NORMAL);
      }
    });
  }

  // Force state change (for keyboard shortcuts)
  forceState(levelId, state) {
    this.levelStates[levelId] = state;
  }
}

// ============================================================================
// DEBUG CONFIGURATION
// ============================================================================

const DEBUG_CONFIG = {
  SHOW_FPS: true,
  SHOW_HISTORY: true,
  SHOW_LERP_RATES: true
};

// ============================================================================
// VIDEO SECTIONS CONFIGURATION
// ============================================================================

const videoSections = [
  {
    id: 'predator',
    title: 'Predator',
    subtitle: 'Bird of Prey',
    dataPoints: ['Hunger', 'Prey Proximity', 'Energy Available']
  },
  {
    id: 'flock',
    title: 'Flock',
    subtitle: 'Collective Behavior',
    dataPoints: ['Cohesion', 'Variance', 'Collective Energy']
  },
  {
    id: 'individual',
    title: 'Individual',
    subtitle: 'Single Bird',
    dataPoints: ['Fear Level', 'Heart Rate', 'Neighbor Proximity']
  },
  {
    id: 'muscle',
    title: 'Muscle',
    subtitle: 'Tissue Contraction',
    dataPoints: ['Electrical Activation', 'Force Production', 'Lactic Acid', 'Heat']
  },
  {
    id: 'microscopic',
    title: 'Microscopic',
    subtitle: 'Molecular Activity',
    dataPoints: ['ATP Consumption', 'Cross-bridge Attach/Detach', 'Calcium Ions']
  }
];

// ============================================================================
// SHAPE CONFIGURATIONS (SVG clip-paths)
// ============================================================================

const shapeConfigs = [
  {
    id: 'predator',
    clipPath: 'clip-shape1',
    style: { left: '66.511px', top: '75.203px', width: '1198.350px', height: '1538.933px' },
    dataPosition: { right: '20px', top: '100px' }
  },
  {
    id: 'flock',
    clipPath: 'clip-shape2',
    style: { left: '1112.338px', top: '75.203px', width: '934.026px', height: '1655.733px' },
    dataPosition: { right: '20px', top: '100px' }
  },
  {
    id: 'individual',
    clipPath: 'clip-shape3',
    style: { left: '66.511px', top: '1539.549px', width: '1783.151px', height: '850.347px' },
    dataPosition: { right: '20px', top: '100px' }
  },
  {
    id: 'muscle',
    clipPath: 'clip-shape4',
    style: { left: '66.511px', top: '2335.882px', width: '1381.924px', height: '1236.027px' },
    dataPosition: { right: '20px', top: '100px' }
  },
  {
    id: 'microscopic',
    clipPath: 'clip-shape5',
    style: { left: '875.418px', top: '1991.949px', width: '1170.946px', height: '1579.947px' },
    dataPosition: { right: '20px', top: '100px' }
  }
];

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

const App = () => {
  // State management
  const [dataValues, setDataValues] = useState({});
  const [levelStates, setLevelStates] = useState({});
  const [transitioningLevels, setTransitioningLevels] = useState({});
  const [debugMode, setDebugMode] = useState(false);
  const [fps, setFps] = useState(60);
  const [transitionHistory, setTransitionHistory] = useState([]);
  const [scale, setScale] = useState(1);

  // Refs for lerp system
  const targetValuesRef = useRef({});
  const lerpRatesRef = useRef({});
  const fsmRef = useRef(null);

  // Initialize FSM
  if (!fsmRef.current) {
    fsmRef.current = new BiologicalFSM({
      states: STATES,
      levels: LEVELS,
      transitionRules: TRANSITION_RULES
    });
  }
  const fsm = fsmRef.current;

  // Linear interpolation function
  const lerp = (start, end, t) => start + (end - start) * t;

  // Get video path based on state
  const getVideoPath = (levelId, state, isTransitioning) => {
    const stateFile = (state || STATES.NORMAL).toLowerCase();
    return `videos/${levelId}/${stateFile}.mp4`;
  };

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  useEffect(() => {
    // Initialize data values and lerp parameters
    const initialValues = {};
    const initialTargets = {};
    const initialRates = {};

    videoSections.forEach(section => {
      section.dataPoints.forEach(point => {
        const key = `${section.id}-${point}`;
        const randomValue = Math.random() * 100;
        initialValues[key] = randomValue.toFixed(1);
        initialTargets[key] = randomValue;
        // Random lerp rate between 0.02 and 0.3
        initialRates[key] = 0.02 + Math.random() * 0.28;
      });
    });

    setDataValues(initialValues);
    targetValuesRef.current = initialTargets;
    lerpRatesRef.current = initialRates;
    setLevelStates(fsm.getAllStates());
  }, []);

  // ============================================================================
  // RESPONSIVE SCALING
  // ============================================================================

  useEffect(() => {
    const calculateScale = () => {
      const containerWidth = 2112;
      const containerHeight = 3648;
      const scaleX = window.innerWidth / containerWidth;
      const scaleY = window.innerHeight / containerHeight;
      const newScale = Math.min(scaleX, scaleY);
      setScale(newScale);
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  // ============================================================================
  // TARGET VALUE GENERATION
  // ============================================================================

  useEffect(() => {
    const interval = setInterval(() => {
      videoSections.forEach(section => {
        section.dataPoints.forEach(point => {
          const key = `${section.id}-${point}`;
          // Generate new random target value
          targetValuesRef.current[key] = Math.random() * 100;
        });
      });
    }, 800); // Generate new targets every 800ms

    return () => clearInterval(interval);
  }, []);

  // ============================================================================
  // ANIMATION LOOP (60fps)
  // ============================================================================

  useEffect(() => {
    let animationFrameId;
    let evaluationCounter = 0;
    let lastFrameTime = performance.now();
    let frameCount = 0;
    let fpsUpdateTime = performance.now();

    const animate = () => {
      const currentTime = performance.now();
      frameCount++;

      // Update FPS every second
      if (currentTime - fpsUpdateTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        fpsUpdateTime = currentTime;
      }

      // Update data values with lerping
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

        // Evaluate transitions every 30 frames (~2 times per second at 60fps)
        evaluationCounter++;
        if (evaluationCounter >= 30) {
          fsm.evaluateTransitions(newValues);
          setLevelStates(fsm.getAllStates());
          evaluationCounter = 0;
        }

        return newValues;
      });

      lastFrameTime = currentTime;
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // ============================================================================
  // VIDEO PLAYBACK MANAGEMENT
  // ============================================================================

  useEffect(() => {
    // Manage video play/pause when states change for seamless transitions
    const videoElements = document.querySelectorAll('video');
    videoElements.forEach(video => {
      const opacity = parseFloat(window.getComputedStyle(video).opacity);
      if (opacity > 0) {
        // Visible video should be playing
        video.play().catch(err => console.warn('Video play failed:', err));
      } else {
        // Hidden videos should be paused to save resources
        video.pause();
      }
    });
  }, [levelStates]);

  // ============================================================================
  // KEYBOARD SHORTCUTS
  // ============================================================================

  useEffect(() => {
    const handleKeyPress = (e) => {
      // Toggle debug mode
      if (e.key === 'd' || e.key === 'D') {
        setDebugMode(prev => !prev);
      }

      // Force predator states (for testing)
      if (e.key === '1') {
        fsm.forceState('predator', STATES.NORMAL);
        setLevelStates(fsm.getAllStates());
      }
      if (e.key === '2') {
        fsm.forceState('predator', STATES.EXCITED);
        setLevelStates(fsm.getAllStates());
      }
      if (e.key === '3') {
        fsm.forceState('predator', STATES.DEAD);
        setLevelStates(fsm.getAllStates());
      }

      // Inject data spike (increase hunger)
      if (e.key === ' ') {
        e.preventDefault();
        targetValuesRef.current['predator-Hunger'] = 95 + Math.random() * 5;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div style={{
      margin: 0,
      padding: 0,
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: '#000',
      position: 'relative'
    }}>
      {/* SVG Clip Paths */}
      <svg style={{ position: 'absolute', top: '-999px', left: '-999px', width: 0, height: 0 }}>
        <defs>
          <clipPath id="clip-shape1">
            <path d="m 0,0 c -341.37,0 -341.37,0 -341.37,-599.28 0,-436.22 0.02,-554.92 184.56,-554.92 68.98,0 163.72,16.58 293.91,39.35 478.47,83.71 478.47,83.71 341.36,599.28 C 341.37,0 341.37,0 0,0"
              transform="matrix(1.3333333,0,0,-1.3333333,455.147,0)" />
          </clipPath>
          <clipPath id="clip-shape2">
            <path d="m 0,0 c -376.99,0 -376.99,0 -239.44,-517.22 137.55,-517.22 137.55,-517.22 370.31,-652.08 77.29,-43 130.32,-72.5 166.69,-72.5 79.45,0 79.43,140.67 79.43,588.69 C 376.99,0 376.99,0 0,0"
              transform="matrix(1.3333333,0,0,-1.3333333,431.0273,0)" />
          </clipPath>
          <clipPath id="clip-shape3">
            <path d="m 0,0 c -86.63,0 -208.17,-21.26 -430.28,-60.12 -490.64,-85.84 -490.64,-85.84 -490.64,-267.96 0,-182.12 0,-182.12 233.19,-261.43 87.26,-29.68 141.88,-48.25 200.89,-48.25 98.69,0 209.69,51.93 506.35,190.71 474.06,221.77 474.06,221.77 257.45,347.27 C 158.42,-31.1 104.73,0 0,0"
              transform="matrix(1.3333333,0,0,-1.3333333,1228.2249,0)" />
          </clipPath>
          <clipPath id="clip-shape4">
            <path d="m 0,0 c -82.77,0 -82.76,-98.57 -82.76,-443.81 0,-483.21 0,-483.21 573.01,-483.21 573.01,0 573.01,0 226.94,406.02 C 371.12,-114.98 371.12,-114.98 144.18,-37.8 79.38,-15.75 33.08,0 0,0"
              transform="matrix(1.3333333,0,0,-1.3333333,110.9666,0)" />
          </clipPath>
          <clipPath id="clip-shape5">
            <path d="m 0,0 c -71.5,0 -183.98,-52.62 -363.28,-136.5 -481.18,-225.1 -481.18,-225.1 -130.28,-636.78 350.9,-411.68 350.9,-411.68 490.15,-411.68 139.25,0 139.25,0 139.25,635.4 C 124.58,-149.19 120.39,0 0,0"
              transform="matrix(1.3333333,0,0,-1.3333333,989.462,0)" />
          </clipPath>
        </defs>
      </svg>

      {/* Main Container with organic shapes */}
      <div style={{
        margin: 0,
        padding: 0,
        width: '2112px',
        height: '3648px',
        position: 'relative',
        transform: `scale(${scale})`,
        transformOrigin: 'top left'
      }}>
        {shapeConfigs.map((config) => {
          const section = videoSections.find(s => s.id === config.id);
          const currentState = levelStates[section.id] || STATES.NORMAL;
          const transition = transitioningLevels[section.id];
          const isDead = currentState === STATES.DEAD;

          return (
            <div key={section.id} style={{
              position: 'absolute',
              ...config.style
            }}>
              {/* Preload all 3 videos per level, toggle visibility for seamless transitions */}
              {Object.values(STATES).map(state => {
                const videoPath = getVideoPath(section.id, state, false);
                const isVisible = state === currentState;
                const shouldLoop = !transition && state !== STATES.DEAD;

                return (
                  <video
                    key={`${section.id}-${state}`}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      clipPath: `url(#${config.clipPath})`,
                      filter: state === STATES.DEAD ? 'grayscale(100%) contrast(0.5) brightness(0.3)' : 'grayscale(100%) contrast(1.2)',
                      mixBlendMode: 'screen',
                      opacity: isVisible ? 1 : 0,
                      transition: 'opacity 0.3s ease-in-out',
                      pointerEvents: isVisible ? 'auto' : 'none'
                    }}
                    src={videoPath}
                    autoPlay={isVisible}
                    loop={shouldLoop}
                    muted
                    playsInline
                    preload="auto"
                  />
                );
              })}

              {/* Data overlay for each shape */}
              <div style={{
                position: 'absolute',
                ...config.dataPosition,
                backgroundColor: `rgba(0, 0, 0, ${tweaks.overlay.backgroundOpacity})`,
                padding: tweaks.overlay.padding,
                borderRadius: tweaks.overlay.borderRadius,
                minWidth: tweaks.overlay.minWidth,
                maxWidth: tweaks.overlay.maxWidth,
                zIndex: 10,
                color: tweaks.colors.valueColor,
                fontFamily: 'monospace',
                fontSize: '12px'
              }}>
                {debugMode && (
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: tweaks.fonts.sectionTitle, color: tweaks.colors.titleColor }}>{section.title}</div>
                    <div style={{ fontSize: tweaks.fonts.sectionSubtitle, color: tweaks.colors.subtitleColor }}>{section.subtitle}</div>
                    <div style={{
                      marginTop: '5px',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      display: 'inline-block',
                      backgroundColor: currentState === STATES.DEAD ? tweaks.stateBadges.dead.background :
                        currentState === STATES.EXCITED ? tweaks.stateBadges.excited.background : tweaks.stateBadges.normal.background,
                      color: currentState === STATES.DEAD ? tweaks.stateBadges.dead.text :
                        currentState === STATES.EXCITED ? tweaks.stateBadges.excited.text : tweaks.stateBadges.normal.text,
                      fontSize: tweaks.fonts.stateBadge
                    }}>
                      {transition ? '→ TRANSITION' : currentState}
                    </div>
                  </div>
                )}

                {/* Data points */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: tweaks.overlay.dataPointGap }}>
                  {section.dataPoints.map((dataPoint, dpIndex) => {
                    const key = `${section.id}-${dataPoint}`;
                    const value = dataValues[key] || '0.0';
                    const width = parseFloat(value);
                    const lerpRate = lerpRatesRef.current[key];
                    const targetValue = targetValuesRef.current[key];

                    return (
                      <div key={dpIndex} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {/* Data bar on its own line */}
                        <div style={{
                          width: '100%',
                          height: tweaks.bars.height,
                          backgroundColor: tweaks.bars.backgroundColor,
                          borderRadius: tweaks.bars.borderRadius,
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            height: '100%',
                            width: `${width}%`,
                            backgroundColor: isDead ? tweaks.bars.deadColor : tweaks.bars.fillColor,
                            transition: 'width 0.3s'
                          }} />
                        </div>

                        {/* Label on left, value on right */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <div style={{ fontSize: tweaks.fonts.dataPointLabel, color: tweaks.colors.labelColor, textTransform: 'uppercase' }}>
                            {dataPoint}
                            {debugMode && DEBUG_CONFIG.SHOW_LERP_RATES && lerpRate && (
                              <span style={{ color: tweaks.colors.lerpRateColor, marginLeft: '4px', fontSize: tweaks.fonts.lerpRate }}>
                                ({lerpRate.toFixed(2)})
                              </span>
                            )}
                          </div>
                          <span style={{
                            fontSize: tweaks.fonts.dataValue,
                            textAlign: 'right',
                            color: tweaks.colors.valueColor,
                            minWidth: tweaks.overlay.dataValueWidth,
                            display: 'inline-block'
                          }}>
                            {value}
                            {debugMode && DEBUG_CONFIG.SHOW_LERP_RATES && targetValue !== undefined && (
                              <span style={{ color: tweaks.colors.targetValueColor, fontSize: tweaks.fonts.targetValue }}>
                                →{targetValue.toFixed(0)}
                              </span>
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
              <span className={`font-mono font-bold ${fps >= 55 ? 'text-green-400' : fps >= 45 ? 'text-yellow-400' : fps >= 30 ? 'text-orange-400' : 'text-red-400'}`}>
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
        </div>
      )}

      {/* Instructions (only in debug mode) */}
      {debugMode && (
        <div className="fixed bottom-4 left-4 text-gray-700 text-xs space-y-1">
          <div>Press SPACE to activate predator | D for debug | ESC to exit</div>
          <div>Press 1: Reset to NORMAL | 2: All EXCITED | 3: Kill individual</div>
        </div>
      )}
    </div>
  );
};

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
