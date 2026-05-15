# Code Signing

This project uses Electron Builder's built-in macOS and Windows signing support. Do not commit certificates, passwords, or `electron-builder.env`.

## GitHub Secrets

Add these repository secrets for signed CI releases:

| Secret | Used for |
| --- | --- |
| `MAC_CSC_LINK` | Base64-encoded macOS Developer ID Application `.p12` |
| `MAC_CSC_KEY_PASSWORD` | Password for the macOS `.p12` |
| `WIN_CSC_LINK` | Base64-encoded Windows Authenticode `.pfx` |
| `WIN_CSC_KEY_PASSWORD` | Password for the Windows `.pfx` |
| `APPLE_API_KEY` | App Store Connect API private key content for notarization |
| `APPLE_API_KEY_ID` | App Store Connect API key ID |
| `APPLE_API_ISSUER` | App Store Connect issuer ID |

Instead of the Apple API key trio, you can use:

| Secret | Used for |
| --- | --- |
| `APPLE_ID` | Apple Developer account email |
| `APPLE_APP_SPECIFIC_PASSWORD` | App-specific password, not the Apple ID password |
| `APPLE_TEAM_ID` | Apple Developer Team ID |

## Encoding Certificates

Encode certificates before adding them as GitHub Secrets:

```bash
base64 -w 0 DeveloperIDApplication.p12 > mac-cert-base64.txt
base64 -w 0 windows-code-signing.pfx > win-cert-base64.txt
```

On macOS, use:

```bash
base64 -i DeveloperIDApplication.p12 -o mac-cert-base64.txt
base64 -i windows-code-signing.pfx -o win-cert-base64.txt
```

## Local Signed Build

Copy the example file and fill in local values:

```bash
cp electron-builder.env.example electron-builder.env
npm run package:local
```

Electron Builder reads `electron-builder.env` automatically.

## Release Build

After secrets are configured, push a version tag:

```bash
git tag v1.0.0
git push origin v1.0.0
```

The release workflow builds all three platforms and publishes assets to a draft GitHub Release.
