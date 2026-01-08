const { useState, useEffect, useRef } = React;

const VideoInstallation = () => {
  const [predatorActive, setPredatorActive] = useState(false);
  const [dataValues, setDataValues] = useState({});

  const videoSections = [
    {
      id: 'predator',
      title: 'PREDATOR',
      subtitle: 'Bird of prey in high-tension waiting',
      videoPath: 'videos/predator.mp4',
      dataPoints: ['Hunger', 'Energy', 'Tilt/Orientation', 'Prey Proximity', 'Sensory Confidence', 'Success Probability']
    },
    {
      id: 'population',
      title: 'POPULATION',
      subtitle: 'Flock moving as one',
      videoPath: 'videos/flock.mp4',
      dataPoints: ['Collective Energy', 'Cohesion', 'Variance', 'Obstacles', 'Signal Propagation Delay']
    },
    {
      id: 'individual',
      title: 'INDIVIDUAL',
      subtitle: 'Single bird in flight',
      videoPath: 'videos/individual.mp4',
      dataPoints: ['Experience Level', 'Fear Level', 'Fatigue', 'Calories Expended', 'Neighbor Proximity', 'Reaction Latency', 'Survival Probability']
    },
    {
      id: 'organ',
      title: 'ORGAN',
      subtitle: 'Muscle contracting',
      videoPath: 'videos/muscle.mp4',
      dataPoints: ['Force Production', 'Electrical Activation', 'Intracellular Calcium', 'Stiffness', 'Lactic Acid', 'Heat']
    },
    {
      id: 'microscopic',
      title: 'MICROSCOPIC',
      subtitle: 'Molecular cross-bridge cycling',
      videoPath: 'videos/molecular.mp4',
      dataPoints: ['Cross-bridge Attach/Detach', 'ATP Consumption', 'Binding Probability', 'Molecular Fatigue', 'Thermal Noise']
    }
  ];

  // Simulate data updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newValues = {};
      videoSections.forEach(section => {
        section.dataPoints.forEach(point => {
          const key = `${section.id}-${point}`;
          newValues[key] = (Math.random() * 100).toFixed(1);
        });
      });
      setDataValues(newValues);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handlePredatorActivation = () => {
    setPredatorActive(true);
    setTimeout(() => setPredatorActive(false), 3000);
  };

  // Listen for keyboard shortcut (for testing) or hardware button
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        handlePredatorActivation();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="w-full h-screen bg-black text-white font-mono overflow-hidden">
      {/* Main Grid Container */}
      <div className="h-full flex flex-col p-3 gap-2">
        {videoSections.map((section, index) => (
          <div
            key={section.id}
            className={`flex-1 flex gap-3 border transition-all duration-300 ${predatorActive ? 'border-red-500 border-2' : 'border-gray-800'
              }`}
          >
            {/* Video Section */}
            <div className="flex-[2] bg-gray-900 relative overflow-hidden">
              {/* Video Element */}
              <video
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  filter: 'grayscale(100%) contrast(1.2)',
                  mixBlendMode: 'screen'
                }}
                src={section.videoPath}
                autoPlay
                loop
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
              <div className="absolute top-4 left-4 z-10 bg-black bg-opacity-50 px-3 py-2">
                <h2 className="text-xl font-bold tracking-wider">{section.title}</h2>
                <p className="text-xs text-gray-300 mt-1">{section.subtitle}</p>
              </div>

              {/* Video placeholder if file not found */}
              <div className="absolute inset-0 flex items-center justify-center text-gray-700 text-xs pointer-events-none">
                <div className="text-center">
                  <div className="text-sm mb-2">Place video file:</div>
                  <div className="font-mono">{section.videoPath}</div>
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

                  return (
                    <div key={dpIndex} className="flex items-center justify-between text-xs">
                      <span className="text-gray-400 uppercase tracking-wide text-[10px] flex-1 pr-2">
                        {dataPoint}
                      </span>
                      <div className="flex items-center gap-2 flex-1">
                        <div className="flex-1 h-1 bg-gray-800 relative overflow-hidden">
                          <div
                            className={`h-full bg-white transition-all duration-300 ${predatorActive ? 'bg-red-500' : 'bg-white'
                              }`}
                            style={{ width: `${width}%` }}
                          />
                        </div>
                        <span className="text-white font-mono w-12 text-right text-[11px]">
                          {value}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Predator Status Indicator */}
      {predatorActive && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-8 py-3 text-xl font-bold tracking-widest animate-pulse z-50">
          PREDATOR ACTIVE
        </div>
      )}

      {/* Instructions (hidden in production) */}
      <div className="fixed bottom-4 left-4 text-gray-700 text-xs">
        Press SPACE to activate predator (testing) | ESC to exit
      </div>
    </div>
  );
};

// Render the app
ReactDOM.render(<VideoInstallation />, document.getElementById('root'));
