import { CapacitorConfig } from '@capacitor/cli';
import { networkInterfaces } from 'os';

// The app loads from nginx on this machine, so it needs the LAN IP.
// Auto-detected on `cap sync`; override with MOBILE_HOST=192.168.x.x if it picks wrong.
function detectLanIp(): string {
  const skip = /vethernet|wsl|virtualbox|vmware|docker|loopback/i;
  const candidates: { name: string; address: string }[] = [];
  for (const [name, addrs] of Object.entries(networkInterfaces())) {
    if (skip.test(name)) continue;
    for (const a of addrs ?? []) {
      if (a.family === 'IPv4' && !a.internal) candidates.push({ name, address: a.address });
    }
  }
  const pick = candidates.find((c) => /wi-?fi|wlan/i.test(c.name)) ?? candidates[0];
  if (!pick) throw new Error('No LAN IP found. Set MOBILE_HOST=192.168.x.x');
  return pick.address;
}

const host = process.env['MOBILE_HOST'] || detectLanIp();
console.log(`[capacitor] Mobile app will load from http://${host}`);

const config: CapacitorConfig = {
  appId: 'com.otttv.app',
  appName: 'StreamVault',
  webDir: 'dist/frontend/browser/browser',
  server: {
    androidScheme: 'http',
    url: `http://${host}`,
    cleartext: true,
    hostname: host,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#060610',
      showSpinner: false,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#060610',
      overlaysWebView: false,
    },
  },
};

export default config;
