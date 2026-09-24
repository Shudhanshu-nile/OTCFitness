module.exports = {
  // Only our own fonts are linked here. The react-native-vector-icons pod
  // already ships its TTFs as iOS resources, and Android picks them up via
  // `fonts.gradle` (applied in android/app/build.gradle) — listing them here
  // as well makes Xcode fail with "Multiple commands produce ... .ttf".
  assets: ['./src/assets/fonts'],
};
