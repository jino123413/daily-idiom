import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'daily-idiom',
  web: {
    host: '0.0.0.0',
    port: 3030,
    commands: {
      dev: 'rsbuild dev',
      build: 'rsbuild build',
    },
  },
  permissions: [],
  outdir: 'dist',
  brand: {
    displayName: '오늘의 사자성어',
    icon: 'https://raw.githubusercontent.com/jino123413/app-logos/master/daily-idiom.png',
    primaryColor: '#B91C1C',
    bridgeColorMode: 'basic',
  },
  webViewProps: {
    type: 'partner',
  },
});
