const { contextBridge, ipcRenderer } = require("electron");
const config = require("./data/store");
const { keyMap } = require("./data/keyboardMap");

contextBridge.exposeInMainWorld("electronAPI", {
  // Renderer to main functions
  muteProcesses: (muteGame, muteVoice, status) =>
    ipcRenderer.send("mute-processes", muteGame, muteVoice, status),
  registerNewHotkey: (configKey, newKey) =>
    ipcRenderer.send("register-new-hotkey", configKey, newKey),
  getKeyboardMap() {
    return ipcRenderer.sendSync("get-keyboard-map");
  },
  getValbilityVersion() {
    return ipcRenderer.sendSync("get-app-version");
  },
  closeOrMinimizeApp: (functionality) =>
    ipcRenderer.send("close-or-minizmize-app", functionality),
  openURL: (url) => ipcRenderer.send("open-url", url),
  resetConfigToDefault: () => ipcRenderer.send("reset-config-to-default"),
  pressVoiceKey: (action) => ipcRenderer.send("press-voice-key", action),

  // Electron-store config default IPC model
  config: {
    get(key) {
      return ipcRenderer.sendSync("config-get", key);
    },
    set(property, value) {
      ipcRenderer.send("config-set", property, value);
    },
  },

  // Main to renderer functions
  toggleVoice: (status) => ipcRenderer.on("toggle-voice", status),
  updateStatusStyle: (text, color) =>
    ipcRenderer.on("update-status-style", text, color),
  updateKeybindText: (keyValue, keyFunctionality) =>
    ipcRenderer.on("update-keybind-text", keyValue, keyFunctionality),
});

window.addEventListener("DOMContentLoaded", () => {
  const muteGameElement = document.getElementById("mute-game-checkbox");
  const muteVoiceElement = document.getElementById("mute-voice-checkbox");
  const thresholdSlider = document.getElementById("threshold-slider");
  const toggleVoiceKey = document.getElementById("toggle-voice-key");
  const toggleGameKey = document.getElementById("toggle-game-key");
  const voiceHotkey = document.getElementById("voice-key");

  muteGameElement.checked = config.get("is-game-muted");
  muteVoiceElement.checked = config.get("is-voice-muted");
  thresholdSlider.value = config.get("voice-activity-threshold");
  toggleVoiceKey.value = keyMap[config.get("toggle-voice-keybind")];
  toggleGameKey.value = keyMap[config.get("toggle-game-keybind")];
  voiceHotkey.value = keyMap[config.get("valorant-voice-keybind")];
});
