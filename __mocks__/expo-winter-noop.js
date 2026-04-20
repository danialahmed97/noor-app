// Noop mock for Expo's winter runtime modules that cause Jest 30 compatibility issues
module.exports = {};
module.exports.ImportMetaRegistry = {};
module.exports.installGlobal = function () {};
module.exports.installFormDataPatch = function () {};
