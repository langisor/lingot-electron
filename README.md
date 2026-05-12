# Lingot Tuner - Electron Web App

A modern web-based port of LINGOT, a free and accurate musical instrument tuner, built with Electron, React, and TypeScript.

## Features

- 🎸 **Real-time Frequency Detection** - Uses Web Audio API for accurate pitch detection
- 📊 **Visual Tuning Gauge** - Analog gauge display showing tuning accuracy
- 🎼 **Multiple Tuning Presets** - Support for Guitar, Bass, Violin, Ukulele, and more
- 🎨 **Modern UI** - Beautiful dark theme with real-time feedback
- 🔊 **Spectrum Visualization** - Visual representation of detected frequencies
- 💻 **Cross-platform** - Works on Windows, macOS, and Linux

## Requirements

- Node.js 16+ and npm
- A microphone/line-in input
- Supported browser audio (Chrome, Firefox, Safari, Edge)

## Installation

```bash
# Clone the repository
git clone https://github.com/langisor/lingot-electron.git
cd lingot-electron

# Install dependencies
npm install
```

## Development

```bash
# Start development server with hot reload
npm run dev

# Type checking
npm run type-check
```

## Building

```bash
# Build for production
npm run build

# Package the application
npm run package
```

## Project Structure

```
lingot-electron/
├── src/
│   ├── main/              # Electron main process
│   ├── renderer/          # React UI components
│   │   ├── components/    # React components
│   │   ├── styles/        # CSS files
│   │   └── main.tsx       # React entry point
│   ├── preload/           # IPC bridge
│   └── utils/             # Audio processing, tunings
├── package.json
├── tsconfig.json
├── vite.config.ts         # Vite configuration
├── electron-builder.yml   # Electron builder config
└── index.html             # HTML template
```

## How It Works

1. **Audio Input**: The app requests microphone access via Web Audio API
2. **Frequency Detection**: FFT (Fast Fourier Transform) analysis identifies the dominant frequency
3. **Note Recognition**: Detected frequency is converted to the nearest musical note
4. **Visual Feedback**: Gauge shows how far off the note is in cents (hundredths of a semitone)

## Technology Stack

- **Electron** - Desktop application framework
- **React** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool
- **Web Audio API** - Real-time audio processing

## License

GPL v2 (matching the original LINGOT project)

## Credits

Based on [LINGOT](https://www.nongnu.org/lingot/) by Ibán García González.

## Troubleshooting

### Microphone not working
- Check browser permissions in system settings
- Ensure no other application is using the microphone
- Try a different audio input device

### Low frequency detection accuracy
- Keep your instrument steady
- Ensure good audio input level
- Avoid background noise

## Development Notes

- The preload script is compiled to `src/preload.ts` for security
- React components use functional components with hooks
- Audio processing is handled in the renderer process via Web Audio API
- Electron's context isolation is enabled for security
