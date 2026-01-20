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
    dataPointLabel: '18px',
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
    labelBarGap: '30px',
    labelWidth: '530px',
  },
  bars: {
    style: 'segmented',
    width: '200px',
    height: '11px',
    borderRadius: '0px',
    backgroundColor: '#333',
    fillColor: '#aaa',
    deadColor: '#666',
    borderWidth: '1px',
    segmentCount: 22,
    segmentGap: '2px',
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
      right: '657px',
      top: '1199px',
    },
    flock: {
      right: '20px',
      top: '1302px',
    },
    individual: {
      right: '1248px',
      top: '283px',
    },
    muscle: {
      right: '876px',
      top: '741px',
    },
    microscopic: {
      right: '30px',
      top: '1326px',
    },
  },
};

// Export for use in app.jsx
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TWEAKS;
}
