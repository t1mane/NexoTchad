const { getDefaultConfig } = require("@expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname); // Corrected __dirmane to __dirname
defaultConfig.resolver.assetExts.push("cjs");

module.exports = defaultConfig;
