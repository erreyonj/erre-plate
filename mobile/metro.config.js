const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, {
  input: "./global.css",
  // Expo SDK 55 / Metro (RN 0.83.x) changed the internal bundler API that
  // react-native-css-interop uses for virtual module injection. This forces
  // the CSS to be written directly to disk before Metro transforms anything,
  // which bypasses the virtual module mechanism entirely.
  forceWriteFileSystem: true,
});
