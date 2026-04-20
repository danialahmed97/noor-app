// In-memory AsyncStorage mock for Jest (CommonJS to avoid transform issues)
const store = {};

const AsyncStorage = {
  getItem: jest.fn((key) => Promise.resolve(store[key] !== undefined ? store[key] : null)),
  setItem: jest.fn((key, value) => {
    store[key] = value;
    return Promise.resolve();
  }),
  removeItem: jest.fn((key) => {
    delete store[key];
    return Promise.resolve();
  }),
  clear: jest.fn(() => {
    Object.keys(store).forEach((k) => delete store[k]);
    return Promise.resolve();
  }),
  getAllKeys: jest.fn(() => Promise.resolve(Object.keys(store))),
  multiGet: jest.fn((keys) =>
    Promise.resolve(keys.map((k) => [k, store[k] !== undefined ? store[k] : null]))
  ),
  multiSet: jest.fn((pairs) => {
    pairs.forEach(([k, v]) => { store[k] = v; });
    return Promise.resolve();
  }),
  multiRemove: jest.fn((keys) => {
    keys.forEach((k) => delete store[k]);
    return Promise.resolve();
  }),
  _reset() {
    Object.keys(store).forEach((k) => delete store[k]);
    jest.clearAllMocks();
    // Re-bind the mock implementations after clearAllMocks
    AsyncStorage.getItem.mockImplementation((key) =>
      Promise.resolve(store[key] !== undefined ? store[key] : null)
    );
    AsyncStorage.setItem.mockImplementation((key, value) => {
      store[key] = value;
      return Promise.resolve();
    });
    AsyncStorage.removeItem.mockImplementation((key) => {
      delete store[key];
      return Promise.resolve();
    });
    AsyncStorage.clear.mockImplementation(() => {
      Object.keys(store).forEach((k) => delete store[k]);
      return Promise.resolve();
    });
    AsyncStorage.getAllKeys.mockImplementation(() => Promise.resolve(Object.keys(store)));
    AsyncStorage.multiGet.mockImplementation((keys) =>
      Promise.resolve(keys.map((k) => [k, store[k] !== undefined ? store[k] : null]))
    );
    AsyncStorage.multiSet.mockImplementation((pairs) => {
      pairs.forEach(([k, v]) => { store[k] = v; });
      return Promise.resolve();
    });
    AsyncStorage.multiRemove.mockImplementation((keys) => {
      keys.forEach((k) => delete store[k]);
      return Promise.resolve();
    });
  },
};

module.exports = AsyncStorage;
module.exports.default = AsyncStorage;
