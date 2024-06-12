module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  overrides: [{
    'plugins': [
      ['module:react-native-dotenv', {
        moduleName: '@env',
      }],
      ['@babel/plugin-transform-private-methods', {
      'loose': true,
    }]
    ]
  }]
};


