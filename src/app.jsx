const { useState, useEffect, useRef } = React;
const { ipcRenderer } = require('electron');

// ============================================================================
// TWEAKS CONFIGURATION
// ============================================================================

// Import TWEAKS from tweaks.jsx (loaded first in index.html) - used as initial state
const initialTweaks = typeof TWEAKS !== 'undefined' ? TWEAKS : {
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
  CALM: 'CALM',
  EXCITED: 'EXCITED',
  RECOVERING: 'RECOVERING'
};

const LEVELS = ['predator', 'flock', 'heart', 'swarm', 'myosin'];

// ============================================================================
// DEBUG CONFIGURATION
// ============================================================================

const DEBUG_CONFIG = {
  SHOW_FPS: true,
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
    dataPoints: ['Blood Sugar', 'Speed', 'Reation Time', 'Sensory Confidence', 'Success Probability', 'Time to Strike'],
    scale: 'meter'
  },
  {
    id: 'flock',
    title: 'Flock',
    subtitle: 'Collective Behavior',
    dataPoints: ['Group Kinetic Energy', 'Mean Inter-Individual Distance', 'Directional Alignment Variance', 'Obstacle Avoidance', 'Response Latency'],
    scale: 'meter'
  },
  {
    id: 'heart',
    title: 'Heart',
    subtitle: 'Heart Cells',
    dataPoints: ['Metabolic Flux', 'Functional Output', 'Activation Timing', 'Mechanical Compliance', 'Structural Alignment', 'Signal Fidelity'],
    scale: 'cm'
  },
  {
    id: 'swarm',
    title: 'Swarm',
    subtitle: 'Microtubule Swarms',
    dataPoints: ['Force Production', 'Control Signal', 'Stiffness', 'Entropy'],
    scale: 'μm'
  },
  {
    id: 'myosin',
    title: 'Myosin',
    subtitle: 'Myosin Motors',
    dataPoints: ['Cross-bridge Turnover', 'ATP Consumption', 'Extent of Reaction', 'Molecular Fatigue', 'External Load', 'Activation'],
    scale: 'nm'
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
    id: 'heart',
    clipPath: 'clip-shape3',
    style: { left: '66.511px', top: '1539.549px', width: '1783.151px', height: '850.347px' },
    dataPosition: { right: '20px', top: '100px' }
  },
  {
    id: 'swarm',
    clipPath: 'clip-shape5',
    style: { left: '875.418px', top: '1991.949px', width: '1170.946px', height: '1579.947px' },
    dataPosition: { right: '20px', top: '100px' }
  },
  {
    id: 'myosin',
    clipPath: 'clip-shape4',
    style: { left: '66.511px', top: '2335.882px', width: '1381.924px', height: '1236.027px' },
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
  const [debugMode, setDebugMode] = useState(false);
  const [fps, setFps] = useState(60);
  const [scale, setScale] = useState(1);
  const [tweaks, setTweaks] = useState(initialTweaks);
  const [positioningMode, setPositioningMode] = useState(null); // Which overlay is being positioned

  // Refs for lerp system
  const targetValuesRef = useRef({});
  const lerpRatesRef = useRef({});

  // Linear interpolation function
  const lerp = (start, end, t) => start + (end - start) * t;

  // Get video path based on state
  const getVideoPath = (levelId, state) => {
    const stateFile = (state || STATES.CALM).toLowerCase();
    return `videos/${levelId}/${stateFile}.mp4`;
  };

  // Render bar based on selected style
  const renderBar = (width, isRecovering) => {
    const fillColor = isRecovering ? tweaks.bars.recoveringColor : tweaks.bars.fillColor;
    const bgColor = tweaks.bars.backgroundColor;
    const barHeight = tweaks.bars.height;
    const borderRadius = tweaks.bars.borderRadius;
    const borderWidth = tweaks.bars.borderWidth;

    switch (tweaks.bars.style) {
      case 'filled':
        // Style 1: Classic filled bar
        return (
          <div style={{
            width: '100%',
            height: barHeight,
            backgroundColor: bgColor,
            borderRadius: borderRadius,
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${width}%`,
              backgroundColor: fillColor,
              transition: 'width 0.3s'
            }} />
          </div>
        );

      case 'outlined':
        // Style 2: Outlined bar with border
        return (
          <div style={{
            width: '100%',
            height: barHeight,
            border: `${borderWidth} solid ${fillColor}`,
            borderRadius: borderRadius,
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${width}%`,
              backgroundColor: fillColor,
              transition: 'width 0.3s',
              opacity: 0.3
            }} />
          </div>
        );

      case 'minimal':
        // Style 3: Minimal line with no background
        return (
          <div style={{
            width: '100%',
            height: barHeight,
            position: 'relative',
            borderRadius: borderRadius
          }}>
            <div style={{
              height: '100%',
              width: `${width}%`,
              backgroundColor: fillColor,
              borderRadius: borderRadius,
              transition: 'width 0.3s'
            }} />
          </div>
        );

      case 'segmented':
        // Style 4: Segmented/quantized bar
        const segmentCount = tweaks.bars.segmentCount;
        const segmentGap = tweaks.bars.segmentGap;
        const filledSegments = Math.round((width / 100) * segmentCount);

        return (
          <div style={{
            width: '100%',
            height: barHeight,
            display: 'flex',
            gap: segmentGap,
            alignItems: 'center'
          }}>
            {Array.from({ length: segmentCount }).map((_, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: '100%',
                  backgroundColor: i < filledSegments ? fillColor : bgColor,
                  borderRadius: '2px',
                  transition: 'background-color 0.1s'
                }}
              />
            ))}
          </div>
        );

      case 'gradient':
        // Style 5: Gradient fade effect
        return (
          <div style={{
            width: '100%',
            height: barHeight,
            backgroundColor: bgColor,
            borderRadius: borderRadius,
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${width}%`,
              background: `linear-gradient(to right, ${fillColor}, ${fillColor}88)`,
              transition: 'width 0.3s'
            }} />
          </div>
        );

      case 'dashed':
        // Style 6: Dashed/striped pattern
        return (
          <div style={{
            width: '100%',
            height: barHeight,
            backgroundColor: bgColor,
            borderRadius: borderRadius,
            overflow: 'hidden',
            position: 'relative'
          }}>
            <div style={{
              height: '100%',
              width: `${width}%`,
              background: `repeating-linear-gradient(
                90deg,
                ${fillColor} 0px,
                ${fillColor} 8px,
                transparent 8px,
                transparent 12px
              )`,
              transition: 'width 0.3s'
            }} />
          </div>
        );

      default:
        return renderBar.call(this, width, isDead);
    }
  };

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  useEffect(() => {
    // Initialize data values and lerp parameters
    const initialValues = {};
    const initialTargets = {};
    const initialRates = {};
    const initialStates = {};

    videoSections.forEach(section => {
      section.dataPoints.forEach(point => {
        const key = `${section.id}-${point}`;
        const randomValue = Math.random() * 100;
        initialValues[key] = randomValue.toFixed(1);
        initialTargets[key] = randomValue;
        // Random lerp rate between 0.02 and 0.3
        initialRates[key] = 0.02 + Math.random() * 0.28;
      });
      // Initialize all levels to CALM state
      initialStates[section.id] = STATES.CALM;
    });

    setDataValues(initialValues);
    targetValuesRef.current = initialTargets;
    lerpRatesRef.current = initialRates;
    setLevelStates(initialStates);
  }, []);

  // ============================================================================
  // LIVE TWEAKS UPDATES (from control panel)
  // ============================================================================

  useEffect(() => {
    // Listen for tweak updates from control panel
    const handleTweaksUpdate = (event, newTweaks) => {
      console.log('🎨 Tweaks updated from control panel');
      setTweaks(newTweaks);
    };

    ipcRenderer.on('tweaks-updated', handleTweaksUpdate);

    return () => {
      ipcRenderer.removeListener('tweaks-updated', handleTweaksUpdate);
    };
  }, []);

  // ============================================================================
  // OVERLAY POSITIONING MODE
  // ============================================================================

  useEffect(() => {
    // Listen for positioning mode start/stop
    const handleStartPositioning = (event, levelId) => {
      setPositioningMode(levelId);

      // Highlight the active overlay
      const overlay = document.querySelector(`.data-overlay-${levelId}`);
      if (overlay) {
        overlay.style.boxShadow = '0 0 20px 5px #0066ff';
      }
    };

    const handleStopPositioning = (event, { confirmed }) => {
      // Remove highlight
      if (positioningMode) {
        const overlay = document.querySelector(`.data-overlay-${positioningMode}`);
        if (overlay) {
          overlay.style.boxShadow = 'none';
        }
      }

      setPositioningMode(null);
    };

    ipcRenderer.on('start-positioning', handleStartPositioning);
    ipcRenderer.on('stop-positioning', handleStopPositioning);

    return () => {
      ipcRenderer.removeListener('start-positioning', handleStartPositioning);
      ipcRenderer.removeListener('stop-positioning', handleStopPositioning);
    };
  }, [positioningMode]);

  // Keyboard controls for positioning
  useEffect(() => {
    if (!positioningMode) return;

    const handleKeyDown = (e) => {
      // Movement speed (pixels)
      const step = e.shiftKey ? 10 : 1;

      let handled = false;
      const currentPos = tweaks.overlayPositions?.[positioningMode] || { right: '20px', top: '100px' };
      const newPos = { ...currentPos };

      // Parse current values
      const parseValue = (val) => parseInt(val) || 0;
      const top = parseValue(currentPos.top);
      const bottom = parseValue(currentPos.bottom);
      const left = parseValue(currentPos.left);
      const right = parseValue(currentPos.right);

      // Arrow keys / WASD
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        if (currentPos.top !== undefined) newPos.top = `${Math.max(0, top - step)}px`;
        else if (currentPos.bottom !== undefined) newPos.bottom = `${bottom + step}px`;
        handled = true;
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        if (currentPos.top !== undefined) newPos.top = `${top + step}px`;
        else if (currentPos.bottom !== undefined) newPos.bottom = `${Math.max(0, bottom - step)}px`;
        handled = true;
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        if (currentPos.left !== undefined) newPos.left = `${Math.max(0, left - step)}px`;
        else if (currentPos.right !== undefined) newPos.right = `${right + step}px`;
        handled = true;
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        if (currentPos.left !== undefined) newPos.left = `${left + step}px`;
        else if (currentPos.right !== undefined) newPos.right = `${Math.max(0, right - step)}px`;
        handled = true;
      }

      if (handled) {
        e.preventDefault();

        // Update tweaks with new position
        setTweaks(prev => ({
          ...prev,
          overlayPositions: {
            ...prev.overlayPositions,
            [positioningMode]: newPos
          }
        }));

        // Send position update back to control panel
        ipcRenderer.send('position-update', { levelId: positioningMode, position: newPos });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [positioningMode, tweaks]);

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

        return newValues;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);


  // ============================================================================
  // VIDEO PLAYBACK MANAGEMENT
  // ============================================================================

  useEffect(() => {
    // Manual loop implementation without seeking (avoids network requests)
    const handleVideoEnded = (e) => {
      const video = e.target;
      // When video ends, just play again - browser will restart from beginning
      // without triggering a seek event
      video.play().catch(err => console.warn('Loop play failed:', err));
    };

    // Attach ended event listeners to all videos
    const videoElements = document.querySelectorAll('video[data-video-id]');
    videoElements.forEach(video => {
      video.addEventListener('ended', handleVideoEnded);
    });

    // Cleanup
    return () => {
      videoElements.forEach(video => {
        video.removeEventListener('ended', handleVideoEnded);
      });
    };
  }, []);

  useEffect(() => {
    // When state changes, play the visible video and pause hidden ones
    videoSections.forEach(section => {
      const currentState = levelStates[section.id];

      Object.values(STATES).forEach(state => {
        const videoElement = document.querySelector(`video[data-video-id="${section.id}-${state}"]`);
        if (videoElement) {
          if (state === currentState) {
            // This video should be visible and playing
            // CRITICAL: Never seek! Just play from wherever it is
            videoElement.play().catch(err => console.warn('Play failed:', err));
          } else {
            // This video should be hidden and paused
            videoElement.pause();
            // CRITICAL: Never seek paused videos - keeps them buffered without network requests
          }
        }
      });
    });
  }, [levelStates]);

  // ============================================================================
  // GAMEPAD/ARCADE BUTTON SUPPORT
  // ============================================================================

  useEffect(() => {
    let previousButtonStates = {};
    let buttonPressTime = {};
    let lastTriggerTime = 0;
    let animationId = null;
    let isPolling = false;

    const COOLDOWN_MS = 1000; // 1 second cooldown between triggers
    const MIN_PRESS_DURATION_MS = 50; // Button must be pressed for at least 50ms
    const ANALOG_THRESHOLD = 0.5; // Analog button threshold

    const checkGamepadInput = () => {
      const gamepads = navigator.getGamepads();
      const currentTime = performance.now();

      for (let i = 0; i < gamepads.length; i++) {
        const gamepad = gamepads[i];
        if (!gamepad) continue;

        // Check Button 0 - your blue arcade button
        const button0 = gamepad.buttons[0];
        const buttonKey = `${i}-0`;

        // Check if button is pressed (handle both digital and analog buttons)
        const isPressed = button0.pressed || button0.value > ANALOG_THRESHOLD;

        if (isPressed) {
          // Button is currently pressed
          if (!previousButtonStates[buttonKey]) {
            // New press detected - record the time
            buttonPressTime[buttonKey] = currentTime;
            previousButtonStates[buttonKey] = true;
          }
        } else {
          // Button is released
          if (previousButtonStates[buttonKey]) {
            // Button was just released - check if it was a valid press
            const pressDuration = currentTime - buttonPressTime[buttonKey];
            const timeSinceLastTrigger = currentTime - lastTriggerTime;

            // Only trigger if:
            // 1. Press duration is long enough (filters noise)
            // 2. Enough time has passed since last trigger (cooldown)
            if (pressDuration >= MIN_PRESS_DURATION_MS && timeSinceLastTrigger >= COOLDOWN_MS) {
              triggerStateSequence();
              lastTriggerTime = currentTime;
            }
          }
          previousButtonStates[buttonKey] = false;
          buttonPressTime[buttonKey] = 0;
        }
      }

      if (isPolling) {
        animationId = requestAnimationFrame(checkGamepadInput);
      }
    };

    // Event handlers for gamepad connection
    const handleGamepadConnected = (e) => {
      if (!isPolling) {
        isPolling = true;
        animationId = requestAnimationFrame(checkGamepadInput);
      }
    };

    const handleGamepadDisconnected = (e) => {
      // Check if any gamepads are still connected
      const gamepads = navigator.getGamepads();
      const hasGamepads = Array.from(gamepads).some(gp => gp !== null);

      if (!hasGamepads && isPolling) {
        isPolling = false;
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
      }
    };

    // Add event listeners
    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);

    // Check if gamepad is already connected (in case user already pressed a button)
    const existingGamepads = navigator.getGamepads();
    const hasExistingGamepads = Array.from(existingGamepads).some(gp => gp !== null);
    if (hasExistingGamepads) {
      isPolling = true;
      animationId = requestAnimationFrame(checkGamepadInput);
    }

    // Cleanup
    return () => {
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
      window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
      isPolling = false;
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [levelStates]);

  // ============================================================================
  // KEYBOARD SHORTCUTS
  // ============================================================================

  // Helper function to trigger the state sequence
  const triggerStateSequence = () => {
    // Check if all levels are in CALM state
    const allCalm = Object.values(levelStates).every(state => state === STATES.CALM);

    if (allCalm) {
      // Transition all levels to EXCITED
      const newStates = {};
      LEVELS.forEach(level => {
        newStates[level] = STATES.EXCITED;
      });
      setLevelStates(newStates);

      // After 10 seconds, transition to RECOVERING
      setTimeout(() => {
        const recoveringStates = {};
        LEVELS.forEach(level => {
          recoveringStates[level] = STATES.RECOVERING;
        });
        setLevelStates(recoveringStates);

        // After another 10 seconds, return to CALM
        setTimeout(() => {
          const calmStates = {};
          LEVELS.forEach(level => {
            calmStates[level] = STATES.CALM;
          });
          setLevelStates(calmStates);
        }, 10000);
      }, 10000);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      // Toggle debug mode
      if (e.key === 'd' || e.key === 'D') {
        setDebugMode(prev => !prev);
      }

      // Spacebar: Trigger state sequence for all levels (CALM → EXCITED → RECOVERING → CALM)
      if (e.key === ' ') {
        e.preventDefault();
        triggerStateSequence();
      }

      // Debug: Force states (for testing)
      if (e.key === '1') {
        setLevelStates(prev => ({ ...prev, predator: STATES.CALM }));
      }
      if (e.key === '2') {
        setLevelStates(prev => ({ ...prev, predator: STATES.EXCITED }));
      }
      if (e.key === '3') {
        setLevelStates(prev => ({ ...prev, heart: STATES.RECOVERING }));
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [levelStates]);

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
      {/* Google Fonts Import */}
      {tweaks.typography.googleFontsUrl && (
        <style>
          {`@import url('${tweaks.typography.googleFontsUrl}');`}
        </style>
      )}

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
        transform: `scale(${scale * 1.04})`,
        transformOrigin: 'top left',
        left: '-17px',
        top: '-15px'
      }}>
        {shapeConfigs.map((config) => {
          const section = videoSections.find(s => s.id === config.id);
          const currentState = levelStates[section.id] || STATES.CALM;
          const isRecovering = currentState === STATES.RECOVERING;

          return (
            <div key={section.id} style={{
              position: 'absolute',
              ...config.style
            }}>
              {/* Load all videos but only play visible one */}
              {Object.values(STATES).map(state => {
                const videoPath = getVideoPath(section.id, state);
                const isVisible = state === currentState;

                return (
                  <video
                    key={`${section.id}-${state}`}
                    data-video-id={`${section.id}-${state}`}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      clipPath: `url(#${config.clipPath})`,
                      filter: 'grayscale(100%) contrast(1.2)',
                      mixBlendMode: 'screen',
                      opacity: isVisible ? 1 : 0,
                      transition: 'opacity 0.3s ease-in-out',
                      pointerEvents: isVisible ? 'auto' : 'none'
                    }}
                    src={videoPath}
                    muted
                    playsInline
                    preload="auto"
                  />
                );
              })}

              {/* Data overlay for each shape */}
              <div
                className={`data-overlay-${section.id}`}
                style={{
                  position: 'absolute',
                  ...(tweaks.overlayPositions && tweaks.overlayPositions[section.id] ? tweaks.overlayPositions[section.id] : config.dataPosition),
                  backgroundColor: `rgba(0, 0, 0, ${tweaks.overlay.backgroundOpacity})`,
                  padding: tweaks.overlay.padding,
                  borderRadius: tweaks.overlay.borderRadius,
                  minWidth: tweaks.overlay.minWidth,
                  maxWidth: tweaks.overlay.maxWidth,
                  zIndex: 10,
                  color: tweaks.colors.valueColor,
                  fontFamily: tweaks.typography.fontFamily,
                  fontSize: '12px',
                  transition: 'box-shadow 0.3s'
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
                      backgroundColor: currentState === STATES.RECOVERING ? tweaks.stateBadges.recovering.background :
                        currentState === STATES.EXCITED ? tweaks.stateBadges.excited.background : tweaks.stateBadges.calm.background,
                      color: currentState === STATES.RECOVERING ? tweaks.stateBadges.recovering.text :
                        currentState === STATES.EXCITED ? tweaks.stateBadges.excited.text : tweaks.stateBadges.calm.text,
                      fontSize: tweaks.fonts.stateBadge
                    }}>
                      {currentState}
                    </div>
                  </div>
                )}

                {/* Data points */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: parseFloat(tweaks.overlay.dataPointGap) >= 0 ? tweaks.overlay.dataPointGap : '0px' }}>
                  {section.dataPoints.map((dataPoint, dpIndex) => {
                    const key = `${section.id}-${dataPoint}`;
                    const value = dataValues[key] || '0.0';
                    const width = parseFloat(value);
                    const lerpRate = lerpRatesRef.current[key];
                    const targetValue = targetValuesRef.current[key];

                    // Handle negative gap with margin instead of gap property
                    const gapValue = parseFloat(tweaks.overlay.dataPointGap);
                    const itemMargin = gapValue < 0 && dpIndex > 0 ? `${gapValue}px` : '0px';

                    return (
                      <div key={dpIndex} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: tweaks.overlay.labelBarGap,
                        marginTop: itemMargin
                      }}>
                        {/* Label (right-aligned) */}
                        <div style={{
                          width: tweaks.overlay.labelWidth,
                          textAlign: 'right',
                          fontSize: tweaks.fonts.dataPointLabel,
                          color: tweaks.colors.labelColor,
                          flexShrink: 0
                        }}>
                          {dataPoint}
                          {debugMode && DEBUG_CONFIG.SHOW_LERP_RATES && lerpRate && (
                            <span style={{ color: tweaks.colors.lerpRateColor, marginLeft: '4px', fontSize: tweaks.fonts.lerpRate }}>
                              ({lerpRate.toFixed(2)})
                            </span>
                          )}
                        </div>

                        {/* Bar (left-aligned, grows to fill space) */}
                        <div style={{
                          flex: tweaks.bars.width === 'auto' ? 1 : 'none',
                          width: tweaks.bars.width === 'auto' ? 'auto' : tweaks.bars.width,
                          minWidth: tweaks.bars.width === 'auto' ? '200px' : 'auto'
                        }}>
                          {renderBar(width, isRecovering)}
                        </div>

                        {/* Debug: Show value if debug mode is on */}
                        {debugMode && DEBUG_CONFIG.SHOW_LERP_RATES && (
                          <span style={{
                            fontSize: tweaks.fonts.dataValue,
                            color: tweaks.colors.valueColor,
                            marginLeft: '10px'
                          }}>
                            {value}
                            {targetValue !== undefined && (
                              <span style={{ color: tweaks.colors.targetValueColor, fontSize: tweaks.fonts.targetValue }}>
                                →{targetValue.toFixed(0)}
                              </span>
                            )}
                          </span>
                        )}
                      </div>
                    );
                  })}

                  {/* Scale text - aligned with data labels */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: tweaks.overlay.labelBarGap,
                    marginTop: '12px'
                  }}>
                    {/* Scale label (right-aligned, same width as data labels) */}
                    <div style={{
                      width: tweaks.overlay.labelWidth,
                      textAlign: 'right',
                      fontSize: tweaks.fonts.dataPointLabel,
                      color: tweaks.colors.labelColor,
                      flexShrink: 0
                    }}>
                      [Scale: {section.scale}]
                    </div>
                  </div>
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
                <span className={`px-2 py-0.5 rounded ${state === STATES.RECOVERING ? 'bg-gray-700 text-gray-400' :
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
          <div>Press SPACE to trigger sequence (CALM → EXCITED → RECOVERING → CALM)</div>
          <div>Press D for debug | ESC to exit</div>
          <div>Debug: 1: Predator CALM | 2: Predator EXCITED | 3: Heart RECOVERING</div>
        </div>
      )}
    </div>
  );
};

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
