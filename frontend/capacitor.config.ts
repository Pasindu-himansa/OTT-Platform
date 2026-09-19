import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.otttv.app',
  appName: 'OTT TV',
  webDir: 'dist/frontend/browser/browser',
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
