# Video Installation App

Interactive video installation displaying 5 levels of biological systems with autonomous state transitions and live data visualization.

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

**Option 1: Development Mode** (Recommended for development)
```bash
npm run dev
```
This enables:
- Hot reloading (auto-refresh on file changes)
- DevTools automatically open
- Best for iterating on the installation

**Option 2: Quick Test Run**
```bash
npm start
```

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

### Keyboard Shortcuts
- **SPACE BAR** - Inject data spike (simulates hunger increase for testing autonomous behavior)
- **D** - Toggle debug mode (shows FPS, states, transition history, lerp rates)
- **1** - Force predator to EXCITED state (testing only)
- **2** - Force predator to DEAD state (testing only)
- **3** - Force predator to NORMAL state (testing only)
- **ESC** - Exit fullscreen and quit app

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

## 🔧 Customization

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
├── main.js              # Electron main process
├── package.json         # App configuration
├── src/
│   ├── index.html      # Main HTML entry point
│   ├── app.jsx         # Complete React app with BiologicalFSM
│   └── videos/         # Video files organized by level/state
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
└── README.md           # This file
```

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

**App won't start?**
- Make sure you ran `npm install` first
- Try deleting `node_modules/` and running `npm install` again
- Check that all video folders exist

**Performance issues?**
- Compress your videos (aim for 1920x1080 or less)
- Close other applications
- Use a dedicated computer for the installation
- Check FPS in debug mode (press D)

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

### Video Playback
- Videos preload and loop seamlessly within each state
- State changes trigger immediate video swap
- Grayscale filter and contrast applied via CSS
- Organic shapes created with SVG clip-path masks

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
- No coding needed for basic use!
- For visual tweaks, this README explains what to change
- The standalone built app can run on any computer without Node.js
- Perfect for gallery installations - just double-click and go!
- Use debug mode (D key) during setup to understand system behavior
- Turn off debug mode before exhibition opens
- The system creates emergent behavior - each showing will be unique!

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

---

**Need help?** Look for comments in `src/app.jsx` - they explain what each part does!
