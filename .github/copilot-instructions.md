<!-- Use this file to provide workspace-specific custom instructions to Copilot -->

## Project: Lingot Electron - Web-based Musical Instrument Tuner

This is an Electron + React TypeScript port of LINGOT, a GPL-licensed musical instrument tuner.

### Project Successfully Initialized ✓

**Build Status:**
- TypeScript Compilation: ✓ Clean
- React (Vite) Build: ✓ Successful  
- Electron Main Process: ✓ Builds correctly
- All dependencies: ✓ Installed

### Key Features
- Electron desktop application
- React + TypeScript frontend
- Web Audio API for frequency detection
- Real-time FFT analysis
- Multiple instrument tuning presets
- Beautiful dark theme UI
- Spectrum visualization
- Tuning gauge display

### Project Structure
```
lingot-electron/
├── src/
│   ├── main/              # Electron main process
│   ├── renderer/          # React UI (renderer process)
│   │   ├── App.tsx
│   │   ├── TuningGauge.tsx
│   │   ├── TuningSelector.tsx
│   │   ├── SpectrumVisualization.tsx
│   │   └── styles/
│   ├── preload/           # IPC security bridge
│   ├── utils/             # Audio FFT, tuning presets
│   └── styles/            # Global styles
├── dist/                  # Compiled output
├── package.json
├── tsconfig.json
├── vite.config.ts
├── electron-builder.yml
├── index.html
└── README.md
```

### Development Commands

**Start Development:**
```bash
npm run dev
```
Starts Vite dev server + Electron with hot reload

**Type Checking:**
```bash
npm run type-check
```
Run TypeScript compiler without emitting files

**Build Production:**
```bash
npm run build
```
Builds both React frontend and Electron main process

**Package Application:**
```bash
npm run package
```
Creates platform-specific installers using electron-builder

### Technology Stack
- **Electron** ^27.0.0 - Desktop framework
- **React** ^18.2.0 - UI framework  
- **TypeScript** ^5.3.0 - Type safety
- **Vite** ^5.0.0 - Build tool
- **Web Audio API** - Real-time audio processing

### Audio Processing
- FFT-based frequency detection (4096 sample window)
- Real-time frequency estimation
- Note recognition (standard A4 = 440 Hz)
- Cent calculation for tuning precision

### Supported Instruments
- Standard Guitar (6-string)
- Bass (4-string)
- Violin
- Ukulele
- Drop D tuning
- Open G tuning

### Next Steps for Development

1. **Testing**: Implement unit tests for audio processing
2. **UI Enhancements**: Add more visual feedback and presets
3. **Audio Features**: 
   - Frequency smoothing algorithms
   - Custom scale/temperament support
   - Multiple audio backend options
4. **Performance**: Optimize FFT calculations
5. **Packaging**: Generate installers for all platforms

### Troubleshooting

**Microphone access denied:**
- Check browser/OS microphone permissions
- Use application settings to grant permissions

**No frequency detected:**
- Ensure good audio input level
- Check microphone is not muted
- Try different audio input device

**Build errors:**
- Run `npm install` to ensure all dependencies are present
- Clear `node_modules` and `dist` folders if needed
- Run `npm run type-check` to identify type issues

