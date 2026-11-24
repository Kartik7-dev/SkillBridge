/**
 * Official Jitsi Meet External API loader and helper
 * Documentation: https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-iframe/
 */

const JITSI_SCRIPT_URL = 'https://meet.jit.si/external_api.js';
const JITSI_SCRIPT_ID = 'jitsi-meet-external-api-script';

let jitsiScriptPromise = null;

export function loadJitsiScript() {
  if (typeof window !== 'undefined' && window.JitsiMeetExternalAPI) {
    return Promise.resolve(window.JitsiMeetExternalAPI);
  }

  if (jitsiScriptPromise) {
    return jitsiScriptPromise;
  }

  jitsiScriptPromise = new Promise((resolve, reject) => {
    // Check if script already exists in document
    const existing = document.getElementById(JITSI_SCRIPT_ID);
    if (existing) {
      if (window.JitsiMeetExternalAPI) {
        resolve(window.JitsiMeetExternalAPI);
      } else {
        existing.addEventListener('load', () => resolve(window.JitsiMeetExternalAPI));
        existing.addEventListener('error', () => reject(new Error('Failed to load Jitsi API script')));
      }
      return;
    }

    const script = document.createElement('script');
    script.id = JITSI_SCRIPT_ID;
    script.src = JITSI_SCRIPT_URL;
    script.async = true;

    script.onload = () => {
      if (window.JitsiMeetExternalAPI) {
        resolve(window.JitsiMeetExternalAPI);
      } else {
        reject(new Error('JitsiMeetExternalAPI not found on window object after loading script'));
      }
    };

    script.onerror = () => {
      jitsiScriptPromise = null;
      reject(new Error('Could not connect to meet.jit.si. Please check your network connection and retry.'));
    };

    document.body.appendChild(script);
  });

  return jitsiScriptPromise;
}
