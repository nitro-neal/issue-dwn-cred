// In global.d.ts
export {}; // Ensure this is a module

declare global {
  interface Window {
    ReactNativeWebView: {
      postMessage: (message: any) => void;
    };
  }
}
