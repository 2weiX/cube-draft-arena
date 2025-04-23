
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.a7619e11b5574661ada883930a4d89d7',
  appName: 'a-cube-draft',
  webDir: 'dist',
  server: {
    url: 'https://a7619e11-b557-4661-ada8-83930a4d89d7.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
    }
  }
};

export default config;

