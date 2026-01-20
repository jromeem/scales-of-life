/**
 * CONTROL PANEL JS
 *
 * Handles the UI interactions for the tweaks control panel
 * and communicates with the main window via IPC
 */

const { ipcRenderer } = require('electron');

// Store current tweaks state
let currentTweaks = {};

// Initialize control panel
async function init() {
  // Request current tweaks from main process
  currentTweaks = await ipcRenderer.invoke('get-tweaks');

  // Populate all form fields with current values
  populateFormFields(currentTweaks);

  // Set up event listeners
  setupEventListeners();
}

// Populate form fields with tweak values
function populateFormFields(tweaks) {
  // Typography
  setValue('typography.googleFontsUrl', tweaks.typography.googleFontsUrl);
  setValue('typography.fontFamily', tweaks.typography.fontFamily);

  // Fonts (ranges with px values)
  setRangeValue('fonts.dataPointLabel', tweaks.fonts.dataPointLabel);
  setRangeValue('fonts.dataValue', tweaks.fonts.dataValue);
  setRangeValue('fonts.sectionTitle', tweaks.fonts.sectionTitle);
  setRangeValue('fonts.sectionSubtitle', tweaks.fonts.sectionSubtitle);
  setRangeValue('fonts.stateBadge', tweaks.fonts.stateBadge);

  // Overlay
  setRangeValue('overlay.backgroundOpacity', tweaks.overlay.backgroundOpacity, false);
  setRangeValue('overlay.padding', tweaks.overlay.padding);
  setRangeValue('overlay.borderRadius', tweaks.overlay.borderRadius);
  setRangeValue('overlay.minWidth', tweaks.overlay.minWidth);
  setRangeValue('overlay.maxWidth', tweaks.overlay.maxWidth);
  setRangeValue('overlay.dataPointGap', tweaks.overlay.dataPointGap);
  setRangeValue('overlay.labelBarGap', tweaks.overlay.labelBarGap);
  setRangeValue('overlay.labelWidth', tweaks.overlay.labelWidth);

  // Bars
  setValue('bars.style', tweaks.bars.style);
  setValue('bars.width', tweaks.bars.width);
  setRangeValue('bars.height', tweaks.bars.height);
  setRangeValue('bars.borderRadius', tweaks.bars.borderRadius);
  setRangeValue('bars.borderWidth', tweaks.bars.borderWidth);
  setRangeValue('bars.segmentCount', tweaks.bars.segmentCount, false);
  setRangeValue('bars.segmentGap', tweaks.bars.segmentGap);

  // Colors
  setColorValue('colors.labelColor', tweaks.colors.labelColor);
  setColorValue('colors.valueColor', tweaks.colors.valueColor);
  setColorValue('colors.titleColor', tweaks.colors.titleColor);
  setColorValue('colors.subtitleColor', tweaks.colors.subtitleColor);
  setColorValue('bars.backgroundColor', tweaks.bars.backgroundColor);
  setColorValue('bars.fillColor', tweaks.bars.fillColor);
  setColorValue('bars.deadColor', tweaks.bars.deadColor);
}

// Helper: Set value for text/select inputs
function setValue(path, value) {
  const el = document.getElementById(path);
  if (el) el.value = value;
}

// Helper: Set range value and display
function setRangeValue(path, value, addPx = true) {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  const el = document.getElementById(path);
  const display = document.getElementById(`${path}-display`);

  if (el) el.value = numValue;
  if (display) display.textContent = addPx ? `${numValue}px` : numValue;
}

// Helper: Set color value (both picker and text)
function setColorValue(path, value) {
  const colorPicker = document.getElementById(path);
  const textInput = document.getElementById(`${path}-text`);

  if (colorPicker) colorPicker.value = value;
  if (textInput) textInput.value = value;
}

// Set up all event listeners
function setupEventListeners() {
  // Typography text inputs
  addTextListener('typography.googleFontsUrl', 'typography', 'googleFontsUrl');
  addTextListener('typography.fontFamily', 'typography', 'fontFamily');

  // Font size ranges
  addRangeListener('fonts.dataPointLabel', 'fonts', 'dataPointLabel', true);
  addRangeListener('fonts.dataValue', 'fonts', 'dataValue', true);
  addRangeListener('fonts.sectionTitle', 'fonts', 'sectionTitle', true);
  addRangeListener('fonts.sectionSubtitle', 'fonts', 'sectionSubtitle', true);
  addRangeListener('fonts.stateBadge', 'fonts', 'stateBadge', true);

  // Overlay ranges
  addRangeListener('overlay.backgroundOpacity', 'overlay', 'backgroundOpacity', false);
  addRangeListener('overlay.padding', 'overlay', 'padding', true);
  addRangeListener('overlay.borderRadius', 'overlay', 'borderRadius', true);
  addRangeListener('overlay.minWidth', 'overlay', 'minWidth', true);
  addRangeListener('overlay.maxWidth', 'overlay', 'maxWidth', true);
  addRangeListener('overlay.dataPointGap', 'overlay', 'dataPointGap', true);
  addRangeListener('overlay.labelBarGap', 'overlay', 'labelBarGap', true);
  addRangeListener('overlay.labelWidth', 'overlay', 'labelWidth', true);

  // Bar select/text
  addSelectListener('bars.style', 'bars', 'style');
  addTextListener('bars.width', 'bars', 'width');

  // Bar ranges
  addRangeListener('bars.height', 'bars', 'height', true);
  addRangeListener('bars.borderRadius', 'bars', 'borderRadius', true);
  addRangeListener('bars.borderWidth', 'bars', 'borderWidth', true);
  addRangeListener('bars.segmentCount', 'bars', 'segmentCount', false);
  addRangeListener('bars.segmentGap', 'bars', 'segmentGap', true);

  // Colors
  addColorListener('colors.labelColor', 'colors', 'labelColor');
  addColorListener('colors.valueColor', 'colors', 'valueColor');
  addColorListener('colors.titleColor', 'colors', 'titleColor');
  addColorListener('colors.subtitleColor', 'colors', 'subtitleColor');
  addColorListener('bars.backgroundColor', 'bars', 'backgroundColor');
  addColorListener('bars.fillColor', 'bars', 'fillColor');
  addColorListener('bars.deadColor', 'bars', 'deadColor');

  // Button listeners
  document.getElementById('save-btn').addEventListener('click', handleSave);
  document.getElementById('reset-btn').addEventListener('click', handleReset);
}

// Add text input listener
function addTextListener(id, section, key) {
  const el = document.getElementById(id);
  if (!el) return;

  el.addEventListener('input', (e) => {
    updateTweak(section, key, e.target.value);
  });
}

// Add select listener
function addSelectListener(id, section, key) {
  const el = document.getElementById(id);
  if (!el) return;

  el.addEventListener('change', (e) => {
    updateTweak(section, key, e.target.value);
  });
}

// Add range listener
function addRangeListener(id, section, key, addPx) {
  const el = document.getElementById(id);
  const display = document.getElementById(`${id}-display`);
  if (!el) return;

  el.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    const finalValue = addPx ? `${value}px` : value;

    if (display) {
      display.textContent = addPx ? `${value}px` : value;
    }

    updateTweak(section, key, finalValue);
  });
}

// Add color listener (both picker and text)
function addColorListener(id, section, key) {
  const colorPicker = document.getElementById(id);
  const textInput = document.getElementById(`${id}-text`);

  if (colorPicker) {
    colorPicker.addEventListener('input', (e) => {
      if (textInput) textInput.value = e.target.value;
      updateTweak(section, key, e.target.value);
    });
  }

  if (textInput) {
    textInput.addEventListener('input', (e) => {
      if (colorPicker) colorPicker.value = e.target.value;
      updateTweak(section, key, e.target.value);
    });
  }
}

// Update a tweak value and send to main window
function updateTweak(section, key, value) {
  // Update local state
  if (!currentTweaks[section]) {
    currentTweaks[section] = {};
  }
  currentTweaks[section][key] = value;

  // Send update to main window via IPC
  ipcRenderer.send('update-tweaks', currentTweaks);
}

// Handle save button
async function handleSave() {
  try {
    await ipcRenderer.invoke('save-tweaks', currentTweaks);
    alert('✅ Tweaks saved to tweaks.jsx!');
  } catch (error) {
    alert('❌ Error saving tweaks: ' + error.message);
  }
}

// Handle reset button
async function handleReset() {
  if (confirm('Reset all tweaks to current file values?')) {
    currentTweaks = await ipcRenderer.invoke('get-tweaks');
    populateFormFields(currentTweaks);
    ipcRenderer.send('update-tweaks', currentTweaks);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
