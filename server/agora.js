const AgoraRTC = require('agora-rtc-sdk');

const appId = '<YOUR_AGORA_APP_ID>';

const client = AgoraRTC.createClient({ codec: 'h264', mode: 'rtc' });