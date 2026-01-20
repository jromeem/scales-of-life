/**
 * TWEAKS.JSX
 *
 * Visual configuration file for easy tweaking of the installation.
 * Adjust values here without diving into the main app code.
 */

const TWEAKS = {
  typography: {
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Inconsolata:wght@200..900&display=swap',
    fontFamily: 'Inconsolata',
  },
  fonts: {
    dataPointLabel: '40px',
    dataValue: '40px',
    sectionTitle: '30px',
    sectionSubtitle: '10px',
    stateBadge: '10px',
    lerpRate: '8px',
    targetValue: '8px',
  },
  overlay: {
    backgroundOpacity: 0,
    padding: '20px',
    borderRadius: '0px',
    minWidth: '100px',
    maxWidth: '2000px',
    dataPointGap: '0px',
    labelBarGap: '80px',
    labelWidth: '530px',
  },
  bars: {
    style: 'segmented',
    width: '400px',
    height: '32px',
    borderRadius: '0px',
    backgroundColor: '#333',
    fillColor: '#aaa',
    deadColor: '#666',
    borderWidth: '2px',
    segmentCount: 19,
    segmentGap: '7px',
  },
  colors: {
    labelColor: '#999',
    valueColor: '#fff',
    titleColor: '#fff',
    subtitleColor: '#999',
    lerpRateColor: '#666',
    targetValueColor: '#eab308',
  },
  stateBadges: {
    normal: {
      background: '#2563eb',
      text: '#fff',
    },
    excited: {
      background: '#dc2626',
      text: '#fff',
    },
    dead: {
      background: '#666',
      text: '#999',
    },
  },
  overlayPositions: {
    predator: {
      right: '20px',
      top: '100px',
    },
    flock: {
      right: '20px',
      top: '100px',
    },
    individual: {
      right: '20px',
      top: '100px',
    },
    muscle: {
      right: '20px',
      top: '100px',
    },
    microscopic: {
      right: '20px',
      top: '100px',
    },
  },
};

// Export for use in app.jsx
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TWEAKS;
}
