# QUICK START - For Non-Technical Users

## What You Need
- A Mac or Windows computer
- 5 video files (MP4 format)
- 15 minutes

## Step-by-Step (Super Simple!)

### 1️⃣ Install Node.js (One Time Only)
1. Go to: https://nodejs.org
2. Click the big green button "Download"
3. Open the downloaded file and follow the installation wizard
4. Restart your computer
5. ✅ Done! You never have to do this again.

### 2️⃣ Set Up the App (One Time Only)

**Mac Users:**
1. Open the folder "video-installation-app"
2. Double-click the file `setup.sh`
   - If it doesn't work, right-click → "Open With" → "Terminal"
3. Wait for it to finish
4. ✅ Done!

**Windows Users:**
1. Open the folder "video-installation-app"
2. Double-click the file `setup.bat`
3. Wait for it to finish
4. ✅ Done!

### 3️⃣ Add Your Videos
1. Open the folder: `src/videos/`
2. Copy your 5 video files into this folder
3. Rename them to exactly these names:
   - `predator.mp4`
   - `flock.mp4`
   - `individual.mp4`
   - `muscle.mp4`
   - `molecular.mp4`
4. ✅ Done!

### 4️⃣ Test It

**Mac:**
1. Open Terminal
2. Type: `cd ` (with a space after cd)
3. Drag the "video-installation-app" folder into Terminal
4. Press Enter
5. Type: `npm start`
6. Press Enter
7. The app will open fullscreen!

**Windows:**
1. Open Command Prompt
2. Type: `cd ` (with a space after cd)
3. Type or paste the full path to "video-installation-app"
4. Press Enter
5. Type: `npm start`
6. Press Enter
7. The app will open fullscreen!

**To close the app:** Press ESC

### 5️⃣ Create a Standalone App (For Your Exhibition)

This creates an app you can just double-click to open - no terminal needed!

**Mac:**
```
npm run build:mac
```

**Windows:**
```
npm run build:win
```

The app will be in a new folder called `dist/`

You can copy this app to any computer and just double-click it!

## Common Problems

**"Node.js not found"**
- You need to install Node.js first (see Step 1)
- Make sure you restarted your computer after installing

**"Videos not showing"**
- Check the video files are named exactly right (lowercase!)
- Check they're .mp4 files
- Try playing them in VLC or QuickTime first

**"App won't start"**
- Make sure you ran setup first
- Try running setup again

**"I don't know how to use Terminal/Command Prompt"**
- Mac: Press Cmd+Space, type "Terminal", press Enter
- Windows: Press Windows key, type "cmd", press Enter

## Quick Controls

- **SPACEBAR** = Activate the predator (for testing)
- **ESC** = Exit the app
- **Your physical button** = Will work once you wire it up!

## For Exhibition Day

1. Run the standalone app (from the `dist/` folder)
2. Don't close it during the exhibition
3. The videos loop forever
4. Press ESC if you need to exit

---

**Still confused?** Watch the README.md file - it has more detailed instructions!
