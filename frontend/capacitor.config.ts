import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.otttv.app',
  appName: 'OTT TV',
  webDir: 'dist/frontend/browser/browser',
  server: {
    androidScheme: 'http',
    url: 'http://192.168.214.34',
    cleartext: true,
    hostname: '192.168.214.34',
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
    },
  },
};

export default config;
