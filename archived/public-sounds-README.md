# Emergency Alert Sounds

This directory contains audio files for emergency notifications in the White Cross Healthcare Platform.

## Required Files

### emergency-alert.mp3
**Status**: MISSING - Placeholder needed
**Used by**: `/src/components/communications/EmergencyAlert.tsx:46`

**Requirements**:
- Duration: 2-3 seconds
- Format: MP3 (browser-compatible)
- Volume: Moderate (not jarring)
- Tone: Urgent but professional
- Healthcare-appropriate (no sirens or alarms that could cause panic)

**Recommended sound characteristics**:
- Rising tone or chime sequence
- Clear and attention-getting
- Distinct from other notification sounds
- Accessible for hearing-impaired users (use visual indicators too)

**Sources for sound files**:
1. **Free sound libraries**:
   - https://freesound.org/ (CC0 licensed sounds)
   - https://mixkit.co/free-sound-effects/ (Free for commercial use)
   - https://www.zapsplat.com/ (Free with attribution)

2. **Professional sound design**:
   - Commission custom sound from audio designer
   - Ensure HIPAA compliance (no PHI in audio)

3. **Suggested search terms**:
   - "notification chime"
   - "alert tone professional"
   - "medical alert sound"
   - "urgent notification"

## Implementation Note

Until the actual audio file is added, the `EmergencyAlert` component will attempt to play this file and fail gracefully. The emergency alert will still display visually with the browser's built-in Notification API.

## File Specifications

- File name: `emergency-alert.mp3`
- Max size: 50KB recommended
- Sample rate: 44.1 kHz or 48 kHz
- Bitrate: 128 kbps recommended
- Channels: Stereo or Mono

## Testing

After adding the audio file:
1. Navigate to Emergency Alert component
2. Trigger an emergency alert
3. Verify sound plays on desktop and mobile browsers
4. Test volume levels are appropriate
5. Ensure sound works with user's notification permissions

## Accessibility

The emergency alert sound should:
- Work in conjunction with visual indicators
- Support browser notification sounds
- Be distinct from other application sounds
- Have a corresponding visual alert for hearing-impaired users
