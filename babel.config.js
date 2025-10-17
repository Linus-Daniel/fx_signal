module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-nullish-coalescing-operator',
    'nativewind/babel',
    'react-native-reanimated/plugin',
  ],
};
