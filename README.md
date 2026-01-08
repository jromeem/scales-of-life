# Video Installation App

Interactive video installation displaying 5 levels of biological systems with live data visualization.

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
   - Place your 5 video files in the `src/videos/` folder
   - Name them exactly as follows:
     - `predator.mp4` - Bird of prey footage
     - `flock.mp4` - Flock of birds footage
     - `individual.mp4` - Single bird footage
     - `muscle.mp4` - Muscle contraction footage
     - `molecular.mp4` - Molecular/microscopic footage
   
   ⚠️ **Important**: Videos must be `.mp4` format and should be optimized for performance!

### Running the Installation

**Option 1: Quick Test Run**
```bash
npm start
```

**Option 2: Build a Standalone App** (Recommended for installations)

For Mac:
```bash
npm run build:mac
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

- **SPACE BAR** - Activate predator (for testing)
- **ESC** - Exit fullscreen and quit app
- **Physical Button** - Wire up your hardware button (see Hardware Integration section)

## 🎨 Customization

### Adjusting Layout
Open `src/app.jsx` and modify:
- `gap-2` and `gap-3` values to change spacing
- `p-3` values to change padding
- `text-xl`, `text-xs` to change text sizes

### Changing Colors
- Border color when predator is active: Look for `border-red-500`
- Background colors: Look for `bg-black`, `bg-gray-900`, etc.

### Video Effects
In the `<video>` element, adjust:
- `filter: 'grayscale(100%) contrast(1.2)'` - Change contrast value
- Remove grayscale if you want color videos

## 🔧 Hardware Integration

### Connecting a Physical Button

The app is set up to accept input from:
1. **Keyboard** (SPACE) - for testing
2. **Arduino/Raspberry Pi** - via serial communication
3. **GPIO pins** - direct hardware integration
4. **USB HID device** - custom button controller

#### Arduino Example:
```cpp
// Arduino code to send button press
void setup() {
  Serial.begin(9600);
  pinMode(2, INPUT_PULLUP); // Button on pin 2
}

void loop() {
  if (digitalRead(2) == LOW) {
    Serial.println("ACTIVATE");
    delay(500); // Debounce
  }
}
```

To integrate with Electron, modify `main.js` to listen to serial port.

### Using a Mouse Click (Disguised Button)
If your "button" is actually a mouse click on a hidden sensor:
- The app already responds to clicks
- You can wire a physical button to simulate mouse clicks
- Or use touch-sensitive surfaces with USB touch controllers

## 📁 File Structure

```
video-installation-app/
├── main.js              # Electron main process
├── package.json         # App configuration
├── src/
│   ├── index.html      # Main HTML file
│   ├── app.jsx         # React app (your installation)
│   └── videos/         # Place your video files here!
│       ├── predator.mp4
│       ├── flock.mp4
│       ├── individual.mp4
│       ├── muscle.mp4
│       └── molecular.mp4
└── README.md           # This file
```

## 🎯 For Installation Day

1. **Pre-show**:
   - Test all videos are loading
   - Test the physical button
   - Set the computer to never sleep
   - Hide the mouse cursor (already done in code)
   - Close all other applications

2. **During show**:
   - Run the built standalone app (not `npm start`)
   - The app runs fullscreen automatically
   - Press ESC to exit if needed

3. **Loop/Restart**:
   - The app runs continuously
   - Videos loop automatically
   - If you need to restart, just close and reopen

## 🐛 Troubleshooting

**Videos not showing?**
- Check that video files are in `src/videos/` folder
- Make sure they're named exactly right (lowercase, .mp4)
- Try converting to H.264 codec if videos won't play

**App won't start?**
- Make sure you ran `npm install` first
- Try deleting `node_modules/` and running `npm install` again

**Performance issues?**
- Compress your videos (aim for 1920x1080 or less)
- Close other applications
- Use a dedicated computer for the installation

**Fullscreen issues?**
- App auto-opens in fullscreen
- If it doesn't, edit `main.js` and check `fullscreen: true`

## 📝 Notes

- The data values currently update randomly to simulate the system
- To connect to real biological data, you'll need to modify the `useEffect` hook in `app.jsx`
- The grainy visual effect is applied as a CSS filter overlay
- All styling uses Tailwind CSS classes for easy customization

## 💡 Tips for Your Artist Friend

- The app is designed to "just work" once videos are added
- No coding needed for basic use!
- For visual tweaks, the README explains what to change
- The standalone built app can run on any computer without Node.js
- Perfect for gallery installations - just double-click and go!

---

**Need help?** Look for comments in the code files - they explain what each part does!
