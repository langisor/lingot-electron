import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  getFrequency: (audioBuffer: Float32Array) =>
    ipcRenderer.invoke('get-frequency', audioBuffer),
  onAudioUpdate: (callback: (data: any) => void) => {
    ipcRenderer.on('audio-update', (_event, data) => callback(data));
  },
});

declare global {
  interface Window {
    electronAPI: {
      getFrequency: (audioBuffer: Float32Array) => Promise<number | null>;
      onAudioUpdate: (callback: (data: any) => void) => void;
    };
  }
}
