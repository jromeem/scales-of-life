/**
 * TWEAKS.JSX
 *
 * Visual configuration file for easy tweaking of the installation.
 * Adjust values here without diving into the main app code.
 */

const TWEAKS = {
  // Typography settings
  typography: {
    // Google Fonts import URL
    // Example: 'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap'
    // Leave empty string '' to use default monospace font
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Inconsolata:wght@200..900&display=swap',

    // Font family to use (must match the font imported above)
    // Example: '"Roboto Mono", monospace'
    // Leave as 'monospace' for default
    fontFamily: 'Inconsolata'
  },

  // Data overlay font sizes
  fonts: {
    // Data point labels (e.g., "HUNGER", "PREY PROXIMITY")
    dataPointLabel: '40px',

    // Data value numbers (e.g., "85.2", "42.1")
    dataValue: '40px',

    // Section title (e.g., "Predator")
    sectionTitle: '40px',

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
    backgroundOpacity: 0.0,

    // Padding around data overlay
    padding: '20px',

    // Border radius
    borderRadius: '8px',

    // Minimum width of overlay
    minWidth: '300px',

    // Maximum width of overlay
    maxWidth: '1000px',

    // Gap between data points
    dataPointGap: '50px',

    // Fixed width for data values to prevent layout shift
    dataValueWidth: '60px'
  },

  // Data bar styling
  bars: {
    // Select bar style: 'filled', 'outlined', 'minimal', 'segmented', 'gradient', 'dashed'
    style: 'filled',

    // Height of data bars
    height: '10px',

    // Border radius of bars
    borderRadius: '10px',

    // Bar background color (empty state)
    backgroundColor: '#333',

    // Bar fill color (normal state)
    fillColor: '#aaa',

    // Bar fill color (dead state)
    deadColor: '#666',

    // Outline/border thickness (for 'outlined' and 'minimal' styles)
    borderWidth: '2px',

    // Number of segments (for 'segmented' style)
    segmentCount: 20,

    // Segment gap (for 'segmented' style)
    segmentGap: '2px'
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
