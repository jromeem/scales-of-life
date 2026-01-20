# Video Installation App

Interactive video installation displaying 5 levels of biological systems with autonomous state transitions and live data visualization.

## ✨ What's New

### Live Control Panel (Development Mode)
- **Real-time styling controls** - Adjust all visuals without editing code
- **6 customizable bar styles** - filled, outlined, minimal, segmented, gradient, dashed
- **Interactive positioning** - Click and use WASD/arrows to position overlays precisely
- **Google Fonts integration** - Paste any Google Fonts URL for custom typography
- **Negative gap support** - Overlap data points for compact layouts
- **Instant preview** - Changes apply immediately to main window
- **Save to file** - Persist your tweaks to `tweaks.jsx`
- **Zero production bloat** - Control panel only runs in dev mode

### Seamless Video Transitions
- **No more blank flashes!** All 3 video states preloaded simultaneously
- **Smooth crossfade** - 0.3s opacity transitions between states
- **Optimized for Mac mini 2018** - Smart memory management (15 videos, ~3GB total)

## 🎨 Concept

This installation visualizes biological systems across five scales, each operating as an autonomous entity that responds to its own data thresholds and influences other levels through data coupling:

- **Predator** - Bird of prey (activates when Hunger > 80)
- **Flock** - Collective bird behavior (activates when Cohesion < 50 AND Variance > 50)
- **Individual** - Single bird (activates when Fear > 40)
- **Muscle** - Tissue contraction (activates when Electrical Activity > 60)
- **Microscopic** - Molecular/cellular processes (activates when ATP > 70)

Each level autonomously monitors its data and transitions between states (NORMAL → EXCITED → DEAD), creating an emergent ecosystem where biological scales influence each other.

## 🚀 Quick Start (For Artists - No Coding Required!)

### First Time Setup

1. **Install Node.js**
   - Go to https://nodejs.org
   - Download and install the LTS (Long Term Support) version
   - Restart your computer after installation

2. **Install the App**
   - Open Terminal (Mac) or Command Prompt (Windows)
   - Navigate to this folder:
     ```bash
     cd path/to/video-installation-app
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Wait for it to finish (this might take a few minutes)

3. **Add Your Videos**
   - Create folder structure in `src/videos/`:
     ```
     src/videos/
     ├── predator/
     │   ├── normal.mp4
     │   ├── excited.mp4
     │   └── dead.mp4
     ├── flock/
     │   ├── normal.mp4
     │   ├── excited.mp4
     │   └── dead.mp4
     ├── individual/
     │   ├── normal.mp4
     │   ├── excited.mp4
     │   └── dead.mp4
     ├── muscle/
     │   ├── normal.mp4
     │   ├── excited.mp4
     │   └── dead.mp4
     └── microscopic/
         ├── normal.mp4
         ├── excited.mp4
         └── dead.mp4
     ```

   ⚠️ **Important**:
   - Videos must be `.mp4` format and optimized for performance
   - Each level needs 3 videos representing its states
   - Name files exactly as shown (lowercase)

### Running the Installation

**Option 1: Development Mode with Control Panel** (Recommended for development)
```bash
npm run dev
```
This enables:
- Hot reloading (auto-refresh on file changes)
- DevTools automatically open
- **Live Control Panel** for real-time styling adjustments (see Control Panel section)
- Best for iterating on the installation

**Option 2: Production Mode** (For installations)
```bash
npm start
```
This runs without the control panel - optimized for performance.

**Option 3: Build a Standalone App** (Recommended for installations)

For Mac (Universal - Intel & Apple Silicon):
```bash
npm run build:mac
```

For Mac mini 2018 (Intel x64 only - optimized):
```bash
npm run build:mac-mini
```

For Windows:
```bash
npm run build:win
```

For Linux:
```bash
npm run build:linux
```

The built app will be in the `dist/` folder. You can copy this to any computer and just double-click to run!

## 🎮 Controls

### Keyboard Shortcuts (Main Window)
- **SPACE BAR** - Inject data spike (simulates hunger increase for testing autonomous behavior)
- **D** - Toggle debug mode (shows FPS, states, transition history, lerp rates)
- **1** - Force predator to EXCITED state (testing only)
- **2** - Force predator to DEAD state (testing only)
- **3** - Force predator to NORMAL state (testing only)
- **ESC** - Exit fullscreen and quit app

### Positioning Mode Shortcuts (When Active)
- **Arrow Keys / WASD** - Move overlay (1px precision)
- **Shift + Arrow Keys / WASD** - Move overlay (10px steps)
- **Enter / Space** - Confirm position
- **Escape** - Cancel positioning

### Physical Button Integration
- Wire up your hardware button to inject data spikes (see Hardware Integration section)

## 🧬 How the Autonomous System Works

### State Machine Architecture

The app uses a **Biological Finite State Machine (BiologicalFSM)** class that manages autonomous behavior:

1. **Autonomous Monitoring**: Each biological level continuously monitors its own data values at 60fps
2. **Threshold-Based Transitions**: When data crosses defined thresholds, levels autonomously transition states
3. **Data Coupling**: Excited states influence other levels' data, creating cascading effects
4. **Smooth Interpolation**: All data values lerp (smoothly transition) to targets at individual rates

### Transition Rules

Each level has specific conditions for activation:

- **Predator**: `Hunger > 80` → EXCITED
- **Flock**: `Cohesion < 50 AND Variance > 50` → EXCITED
- **Individual**: `Fear > 40` → EXCITED
- **Muscle**: `Electrical Activity > 60` → EXCITED
- **Microscopic**: `ATP > 70` → EXCITED

### Data Coupling Examples

When a level enters EXCITED state, it influences other levels:

- **Predator EXCITED** → Increases Flock's "Collective Energy" (+15)
- **Flock EXCITED** → Increases Individual's "Social Pressure" (+20)
- **Individual EXCITED** → Increases Muscle's "Neural Input" (+25)
- **Muscle EXCITED** → Increases Microscopic's "Metabolic Rate" (+30)
- **Microscopic EXCITED** → Increases Predator's "Energy Available" (+10)

This creates a circular ecosystem where activity propagates through biological scales.

### Data Lerping (Smooth Transitions)

Each data point has an individual lerp rate (0.02 - 0.3) that controls how quickly it reaches target values:
- **Slow lerp** (0.02-0.05): Creates gradual, organic changes
- **Fast lerp** (0.2-0.3): Creates immediate, reactive changes
- Rates are randomized on startup for natural variation
- Target values update every 800ms with random fluctuations

## 🎨 Visual Design

### Organic Layout

The installation uses **SVG clip-paths** to create organic, flowing shapes instead of a rigid grid:

- Base container: 2112 × 3648 pixels (aspect ratio preserved)
- Responsive scaling maintains aspect ratio across all viewport sizes
- Five unique organic shapes positioned absolutely
- Videos masked by SVG paths for artistic presentation

### Visual Effects

- **Grayscale filter** with contrast adjustment
- **State-based borders**:
  - NORMAL: No border
  - EXCITED: Red border (4px)
  - DEAD: Gray border (4px)
- **Data overlays** positioned within each shape
- **Debug panel** in top-right (toggle with D key)

## 🎨 Live Control Panel (Development Mode)

### What is it?

The **Live Control Panel** is a separate window that opens in development mode, allowing you to adjust all visual styling in real-time without editing code. Changes apply instantly to the main window, and you can save them to persist your tweaks.

**Important**: The control panel only runs in development mode (`npm run dev`). It has zero performance impact in production mode.

### Opening the Control Panel

```bash
npm run dev
```

Two windows will open:
1. **Main Window** - Your installation display
2. **Control Panel** - Live styling controls

### Features

#### 1. Typography Controls
- **Google Fonts URL** - Paste any Google Fonts URL to change the typeface
- **Font Family** - Specify the font family name

Example:
```
Google Fonts URL: https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap
Font Family: Roboto
```

#### 2. Font Size Controls
Adjust sizes for all text elements using sliders:
- Data Point Labels
- Data Values
- Section Titles
- Section Subtitles
- State Badges
- Lerp Rate Display
- Target Value Display

#### 3. Overlay Layout Controls
- **Background Opacity** - Adjust overlay transparency (0.0 = transparent, 1.0 = opaque)
- **Padding** - Inner spacing around overlay content
- **Border Radius** - Rounded corners for overlays
- **Min/Max Width** - Control overlay dimensions
- **Data Point Gap** - Spacing between data points (supports **negative values** for overlapping)
- **Label-Bar Gap** - Horizontal space between labels and status bars
- **Label Width** - Fixed width for data labels

#### 4. Status Bar Styles

Choose from **6 different bar styles** to match your artistic vision:

- **Filled** - Solid filled bar
- **Outlined** - Hollow border with fill
- **Minimal** - Simple line indicator
- **Segmented** - Divided into discrete segments (customize count and gap)
- **Gradient** - Smooth gradient fill
- **Dashed** - Dashed line pattern

Configure bar properties:
- Width (use 'auto' or px value like '200px')
- Height
- Border radius
- Border width
- Background color
- Fill color
- Dead state color

For **Segmented** style:
- **Segment Count** - Number of segments (5-50)
- **Segment Gap** - Space between segments (0-20px)

#### 5. Color Controls

Adjust all colors using color pickers or hex input:
- Label color
- Value color
- Title color
- Subtitle color
- Lerp rate color
- Target value color
- Bar background
- Bar fill color
- Bar dead color

Each color has both:
- **Color picker** - Visual selection
- **Hex input** - Precise color codes

#### 6. Interactive Overlay Positioning

Position each overlay precisely using keyboard controls:

1. **Click** a positioning button (e.g., "📍 Position Predator Overlay")
2. The overlay will **glow blue** in the main window
3. **Use keyboard** to move:
   - Arrow Keys / WASD: Move 1px
   - Shift + Arrow Keys / WASD: Move 10px
4. **Confirm** with Enter/Space, or **Cancel** with Escape

Live position display shows current coordinates (e.g., `right: 657px, top: 1199px`).

### Saving Your Changes

Once you're happy with your adjustments:

1. Click **💾 Save to File** button
2. Your changes are written to `src/tweaks.jsx`
3. Changes persist across sessions
4. Production builds use these saved values

### Resetting Changes

Click **🔄 Reset** to reload values from the `tweaks.jsx` file and discard unsaved changes.

### How It Works Technically

- **IPC Communication** - Control panel communicates with main window via Electron's Inter-Process Communication
- **Real-time Updates** - Changes apply instantly (no refresh needed)
- **File Persistence** - Save button writes formatted JavaScript to `tweaks.jsx`
- **Zero Production Bloat** - Control panel files are completely ignored in production mode

## 🔧 Manual Customization (Advanced)

If you prefer to edit configuration files directly, you can modify `src/tweaks.jsx`:

```javascript
const TWEAKS = {
  typography: {
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Inconsolata:wght@200..900&display=swap',
    fontFamily: 'Inconsolata',
  },
  fonts: {
    dataPointLabel: '18px',
    dataValue: '40px',
    sectionTitle: '30px',
    // ... etc
  },
  overlay: {
    backgroundOpacity: 0,
    padding: '20px',
    dataPointGap: '-2px',  // Negative values supported!
    labelBarGap: '30px',
    labelWidth: '530px',
  },
  bars: {
    style: 'segmented',  // filled, outlined, minimal, segmented, gradient, dashed
    width: '200px',
    height: '11px',
    borderRadius: '0px',
    backgroundColor: '#333',
    fillColor: '#aaa',
    segmentCount: 22,
    segmentGap: '2px',
  },
  colors: {
    labelColor: '#999',
    valueColor: '#fff',
    titleColor: '#fff',
    subtitleColor: '#999',
  },
  overlayPositions: {
    predator: { right: '657px', top: '1199px' },
    flock: { right: '20px', top: '1302px' },
    individual: { right: '1248px', top: '283px' },
    muscle: { right: '876px', top: '741px' },
    microscopic: { right: '30px', top: '1326px' },
  },
};
```

Changes to `tweaks.jsx` require a reload (in dev mode, files auto-reload on save).

### Adjusting Transition Thresholds

Open `src/app.jsx` and find `TRANSITION_RULES` (around line 212):

```javascript
const TRANSITION_RULES = {
  predator: {
    shouldActivate: (dataValues, levelId) => {
      const hunger = parseFloat(dataValues[`${levelId}-Hunger`]) || 0;
      return hunger > 80;  // Change this threshold
    }
  },
  // ... modify other levels
};
```

### Modifying Data Coupling

Find `COUPLING_RULES` (around line 270):

```javascript
const COUPLING_RULES = {
  predator: [
    {
      targetLevel: 'flock',
      targetDataPoint: 'Collective Energy',
      influence: 15,  // Change influence amount
      mode: 'add',    // or 'multiply'
      condition: (sourceState) => sourceState === STATES.EXCITED
    }
  ],
  // ... add more coupling rules
};
```

### Adjusting Lerp Rates

In `src/app.jsx`, find the lerp initialization (around line 480):

```javascript
const randomRate = 0.02 + Math.random() * 0.28;  // Range: 0.02 to 0.3
```

Change the range for different transition speeds:
- Slower: `0.01 + Math.random() * 0.04` (very gradual)
- Faster: `0.1 + Math.random() * 0.4` (very reactive)

### Changing Layout

Shape positions are defined in `shapeConfigs` (around line 691):

```javascript
const shapeConfigs = [
  {
    id: 'predator',
    clipPath: 'clip-shape1',
    style: {
      left: '66.511px',
      top: '75.203px',
      width: '1198.350px',
      height: '1538.933px'
    },
    dataPosition: { right: '20px', top: '100px' }
  },
  // ... modify positions/sizes
];
```

### Video Effects

In the video render function, adjust filters:

```javascript
style={{
  filter: 'grayscale(100%) contrast(1.2)',  // Modify contrast
  // Remove grayscale(100%) for color videos
}}
```

## 🔧 Hardware Integration

### Connecting a Physical Button

The app accepts input from:
1. **Keyboard** (SPACE) - for testing
2. **Arduino/Raspberry Pi** - via serial communication
3. **GPIO pins** - direct hardware integration
4. **USB HID device** - custom button controller

#### Arduino Example:
```cpp
// Arduino code to send data spike signal
void setup() {
  Serial.begin(9600);
  pinMode(2, INPUT_PULLUP); // Button on pin 2
}

void loop() {
  if (digitalRead(2) == LOW) {
    Serial.println("SPIKE");  // Triggers hunger increase
    delay(500); // Debounce
  }
}
```

To integrate with Electron, modify `main.js` to listen to serial port and send IPC message to renderer.

### Using a Mouse Click (Disguised Button)
If your "button" is actually a mouse click on a hidden sensor:
- The app already responds to clicks
- You can wire a physical button to simulate mouse clicks
- Or use touch-sensitive surfaces with USB touch controllers

## 🐛 Debug Mode

Press **D** to toggle debug mode, which displays:

### FPS Counter
- **Green** (55-60 fps): Excellent performance
- **Yellow** (45-54 fps): Good performance
- **Orange** (30-44 fps): Degraded performance
- **Red** (<30 fps): Poor performance

### State Display
Shows current state of each biological level:
- NORMAL (white)
- EXCITED (red)
- DEAD (gray)

### Transition History
Logs the last 10 state transitions with timestamps:
```
[12:34:56] predator: NORMAL → EXCITED (Hunger: 85.2)
[12:34:58] flock: NORMAL → EXCITED (Cohesion: 42.1, Variance: 67.8)
```

### Lerp Rates
Shows individual interpolation rate for each data point next to its value.

## 📁 File Structure

```
video-installation-app/
├── main.js                    # Electron main process (IPC handlers, window management)
├── package.json               # App configuration
├── src/
│   ├── index.html            # Main HTML entry point
│   ├── app.jsx               # Complete React app with BiologicalFSM
│   ├── tweaks.jsx            # Visual configuration file (editable via control panel)
│   ├── control-panel.html    # Control panel UI (dev mode only)
│   ├── control-panel.js      # Control panel logic (dev mode only)
│   └── videos/               # Video files organized by level/state
│       ├── predator/
│       │   ├── normal.mp4
│       │   ├── excited.mp4
│       │   └── dead.mp4
│       ├── flock/
│       │   ├── normal.mp4
│       │   ├── excited.mp4
│       │   └── dead.mp4
│       ├── individual/
│       │   ├── normal.mp4
│       │   ├── excited.mp4
│       │   └── dead.mp4
│       ├── muscle/
│       │   ├── normal.mp4
│       │   ├── excited.mp4
│       │   └── dead.mp4
│       └── microscopic/
│           ├── normal.mp4
│           ├── excited.mp4
│           └── dead.mp4
└── README.md                 # This file
```

### File Descriptions

**Main Application Files**:
- `main.js` - Electron main process, manages windows and IPC communication
- `src/app.jsx` - Complete React app with BiologicalFSM, video rendering, overlay system
- `src/index.html` - Entry point HTML, loads Babel standalone and React
- `src/tweaks.jsx` - Configuration file for all visual styling

**Control Panel Files (Dev Mode Only)**:
- `src/control-panel.html` - UI for live styling controls
- `src/control-panel.js` - Form interactions and IPC communication with main window

## 🎯 For Installation Day (Mac mini 2018 Setup)

### Recommended Hardware
The app is optimized for:
- **Mac mini 2018** (Intel Core i3-8100B, Intel UHD Graphics 630, 8GB RAM)
- macOS Sonoma 14.5 or later
- Dedicated display for installation

### Installation Setup

1. **Build the DMG**:
   ```bash
   npm run build:mac-mini
   ```
   This creates an optimized `.dmg` file in the `dist/` folder specifically for Intel Mac mini (x64 only, smaller file size).

2. **Transfer to Mac mini**:
   - Copy the `.dmg` file to the Mac mini
   - Double-click to mount
   - Drag "Video Installation" to Applications folder
   - Eject the DMG

3. **Mac mini System Settings**:
   - **Energy Saver**: Set display sleep to "Never"
   - **Screen Saver**: Disable screen saver
   - **System Updates**: Disable automatic updates during exhibition
   - **Do Not Disturb**: Enable to prevent notifications
   - **Login Items**: Add the app to auto-start on login (optional)

### Pre-Show Checklist

1. **Test the Installation**:
   - Launch "Video Installation" from Applications
   - Test all videos are loading for each state
   - Test autonomous transitions (watch hunger climb, see predator activate)
   - Test data coupling (watch how one level influences others)
   - Test the physical button (injects hunger spike)
   - Turn off debug mode (press D if visible)

2. **Performance Monitoring**:
   - Enable debug mode (D key) to check FPS
   - Should maintain 55-60 FPS (green) on Mac mini
   - If FPS drops below 45, check video file sizes

3. **System Optimization**:
   - Close all other applications
   - Disconnect from internet if not needed
   - Disable Bluetooth if not used
   - Hide the Dock (already done in code)
   - Hide the mouse cursor (already done in code)

### During Show

1. **Running the Installation**:
   - Launch the built app from Applications
   - App automatically prevents display sleep
   - System operates autonomously - no intervention needed
   - Press ESC to exit if needed

2. **Performance Notes**:
   - The app is optimized for Mac mini's Intel UHD 630 graphics
   - Hardware acceleration enabled for smooth video playback
   - Sleep prevention built-in (no manual energy settings needed)
   - Background throttling disabled for consistent performance

### Loop/Restart

- The app runs continuously indefinitely
- Videos loop automatically within each state
- States transition based on data thresholds
- If you need to restart, just close and reopen
- Power loss recovery: Add to Login Items for auto-start

## 🐛 Troubleshooting

**Videos not showing?**
- Check that video files are in correct folder structure (`src/videos/[level]/[state].mp4`)
- Make sure they're named exactly right (lowercase, .mp4)
- Try converting to H.264 codec if videos won't play
- Check browser console for loading errors (press D, then F12)
- **Note**: All 3 state videos are preloaded for seamless transitions

**App won't start?**
- Make sure you ran `npm install` first
- Try deleting `node_modules/` and running `npm install` again
- Check that all video folders exist

**Control Panel not showing?**
- Make sure you're running `npm run dev` (not `npm start`)
- Control panel only appears in development mode
- Check that `NODE_ENV=development` is set
- Look for "🎨 Control Panel opened for styling tweaks" in console

**Performance issues?**
- Compress your videos (aim for 1920x1080 or less, 200MB max per video)
- Close other applications
- Use a dedicated computer for the installation
- Check FPS in debug mode (press D)
- With 15 preloaded videos, ensure each is under 200MB

**Overlays in wrong position?**
- Use the control panel's positioning buttons (dev mode)
- Click positioning button, use Arrow Keys/WASD to adjust
- Confirm with Enter/Space, save changes
- Or manually edit `overlayPositions` in `src/tweaks.jsx`

**Bar styles not applying?**
- Check `bars.style` in `tweaks.jsx` matches one of: filled, outlined, minimal, segmented, gradient, dashed
- For segmented style, ensure `segmentCount` and `segmentGap` are set
- Reload app after manual tweaks.jsx edits

**States not transitioning?**
- Enable debug mode (press D) to see current data values
- Check transition history to see if thresholds are being met
- Verify data values are reaching threshold levels
- Press SPACE to inject hunger spike and test system

**Layout looks wrong?**
- App uses responsive scaling to maintain 2112:3648 aspect ratio
- Resize window to see scaling adjust
- Check that SVG clip-paths are loading (view source)

**Fullscreen issues?**
- App auto-opens in fullscreen
- If it doesn't, edit `main.js` and check `fullscreen: true`

## 📝 Technical Notes

### Data Generation
- Data values update via smooth interpolation (lerp) at 60fps
- Target values regenerate every 800ms with random fluctuations
- Each data point has individual lerp rate (0.02 - 0.3)
- Coupling rules apply when evaluating transitions (every 30 frames)

### FSM Evaluation
- Transition rules checked every 30 frames (~2x per second at 60fps)
- Prevents excessive state flickering
- Allows data to stabilize before re-evaluation

### Video Playback & Seamless Transitions
- **All 3 video states preloaded** simultaneously per level (15 videos total)
- Eliminates blank flash during state transitions
- State changes use **opacity crossfade** (0.3s) instead of src swapping
- Only visible video plays at any time (optimized for Mac mini 2018)
- Videos loop seamlessly within each state
- Grayscale filter and contrast applied via CSS
- Organic shapes created with SVG clip-path masks

**Memory optimization**:
- Recommended: 200MB per video × 15 videos = ~3GB total
- Safe for Mac mini 2018 (8GB RAM, Intel UHD 630)
- Use 1920×1080, H.264, 4-5 Mbps, 3-5 min duration

### Responsive Design
- Base container: 2112 × 3648 pixels
- Dynamic scaling: `Math.min(scaleX, scaleY)` to fit viewport
- Maintains aspect ratio across all screen sizes
- Resize listener updates scale on window resize

### Event Architecture
- FSM uses subscriber pattern for state change notifications
- React state updates trigger re-renders
- requestAnimationFrame drives 60fps animation loop
- Keyboard events handled at component level

## 💡 Tips for Artists

- The app is designed to run autonomously once videos are added
- **No coding needed!** Use the Control Panel (`npm run dev`) for all visual adjustments
- **Live feedback**: Changes apply instantly - see what looks good in real-time
- **6 bar styles** to choose from - experiment to match your artistic vision
- **Positioning mode**: Click, use WASD/arrows to perfectly position overlays
- **Negative gaps**: Overlap data points for compact layouts
- **Custom fonts**: Paste any Google Fonts URL for unique typography
- The standalone built app can run on any computer without Node.js
- Perfect for gallery installations - just double-click and go!
- Use debug mode (D key) during setup to understand system behavior
- Turn off debug mode before exhibition opens
- The system creates emergent behavior - each showing will be unique!
- **Control panel bloat-free**: Production builds are optimized - zero overhead from dev tools

## 🔬 Extending the System

### Adding New States

In `src/app.jsx`, modify the `STATES` object:

```javascript
const STATES = {
  NORMAL: 'NORMAL',
  EXCITED: 'EXCITED',
  DEAD: 'DEAD',
  HIBERNATING: 'HIBERNATING'  // New state
};
```

Add corresponding videos and transition rules.

### Adding New Biological Levels

1. Add new level configuration to `videoSections` array
2. Add SVG clip-path in the SVG defs section
3. Add shape config to `shapeConfigs` array
4. Define transition rules in `TRANSITION_RULES`
5. Define coupling rules in `COUPLING_RULES`
6. Create video folder: `src/videos/[new-level]/`

### Connecting Real Biological Data

Replace the random data generation in the lerp animation loop with real data sources:

```javascript
// Example: Replace random targets with sensor data
fetch('/api/sensor-data')
  .then(res => res.json())
  .then(data => {
    targetValuesRef.current[`predator-Hunger`] = data.hungerLevel;
    // ... map other sensor values
  });
```

## 🚀 Quick Reference

### Common Workflows

**Setting up for the first time:**
1. `npm install` - Install dependencies
2. Add videos to `src/videos/[level]/[state].mp4`
3. `npm run dev` - Open with control panel
4. Use control panel to adjust styling
5. Click "💾 Save to File" when happy
6. `npm run build:mac-mini` - Create production build

**Adjusting visual styling:**
1. `npm run dev` - Launch with control panel
2. Adjust sliders, colors, fonts in control panel
3. See changes instantly in main window
4. Click "💾 Save to File" to persist changes

**Positioning overlays:**
1. `npm run dev` - Launch with control panel
2. Click positioning button (e.g., "📍 Position Predator Overlay")
3. Use Arrow Keys or WASD to move (Shift for 10px steps)
4. Press Enter/Space to confirm
5. Click "💾 Save to File" to persist positions

**Changing bar style:**
1. Open control panel (`npm run dev`)
2. Find "Bars" section
3. Select style from dropdown (filled, outlined, minimal, segmented, gradient, dashed)
4. For segmented: adjust segment count and gap sliders
5. Click "💾 Save to File"

**Trying different fonts:**
1. Visit https://fonts.google.com
2. Select a font, click "Get font", then "Get embed code"
3. Copy the `@import` URL
4. Open control panel (`npm run dev`)
5. Paste URL in "Google Fonts URL" field
6. Enter font family name in "Font Family" field
7. Click "💾 Save to File"

**Running for exhibition:**
1. Build: `npm run build:mac-mini`
2. Copy `.dmg` from `dist/` folder to Mac mini
3. Install app to Applications
4. Launch from Applications (no control panel, optimized performance)
5. Press ESC to exit when needed

### Keyboard Shortcuts Cheat Sheet

**Main Window:**
- `SPACE` - Inject data spike
- `D` - Toggle debug mode
- `1/2/3` - Force predator states (testing)
- `ESC` - Quit app

**Positioning Mode (when active):**
- `Arrow Keys / WASD` - Move 1px
- `Shift + Arrow Keys / WASD` - Move 10px
- `Enter / Space` - Confirm
- `Escape` - Cancel

---

**Need help?** Look for comments in `src/app.jsx` - they explain what each part does!
