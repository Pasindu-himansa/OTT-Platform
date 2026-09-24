import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.otttv.app',
  appName: 'StreamVault',
  webDir: 'dist/frontend/browser/browser',
  server: {
    androidScheme: 'http',
    url: 'http://192.168.41.34',
    cleartext: true,
    hostname: '192.168.41.34',
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
