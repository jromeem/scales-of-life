/**
 * TWEAKS.JSX
 *
 * Visual configuration file for easy tweaking of the installation.
 * Adjust values here without diving into the main app code.
 */

const TWEAKS = {
  // Data overlay font sizes
  fonts: {
    // Data point labels (e.g., "HUNGER", "PREY PROXIMITY")
    dataPointLabel: '9px',

    // Data value numbers (e.g., "85.2", "42.1")
    dataValue: '10px',

    // Section title (e.g., "Predator")
    sectionTitle: '14px',

    // Section subtitle (e.g., "Bird of Prey")
    sectionSubtitle: '10px',

    // State badge (e.g., "EXCITED", "NORMAL")
    stateBadge: '10px',

    // Lerp rate display (shown in debug mode)
    lerpRate: '8px',

    // Target value arrow (shown in debug mode)
    targetValue: '8px'
  },

  // Data overlay styling
  overlay: {
    // Background opacity (0-1)
    backgroundOpacity: 0.8,

    // Padding around data overlay
    padding: '20px',

    // Border radius
    borderRadius: '8px',

    // Maximum width of overlay
    maxWidth: '300px',

    // Gap between data points
    dataPointGap: '8px'
  },

  // Data bar styling
  bars: {
    // Height of data bars
    height: '4px',

    // Border radius of bars
    borderRadius: '2px',

    // Bar background color (empty state)
    backgroundColor: '#333',

    // Bar fill color (normal state)
    fillColor: '#fff',

    // Bar fill color (dead state)
    deadColor: '#666'
  },

  // Colors
  colors: {
    // Data point label text
    labelColor: '#999',

    // Data value text
    valueColor: '#fff',

    // Section title text
    titleColor: '#fff',

    // Section subtitle text
    subtitleColor: '#999',

    // Lerp rate text (debug mode)
    lerpRateColor: '#666',

    // Target value text (debug mode)
    targetValueColor: '#eab308'
  },

  // State badge colors
  stateBadges: {
    normal: {
      background: '#2563eb',
      text: '#fff'
    },
    excited: {
      background: '#dc2626',
      text: '#fff'
    },
    dead: {
      background: '#666',
      text: '#999'
    }
  }
};

// Export for use in app.jsx
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TWEAKS;
}
