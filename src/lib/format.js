const formatters = {
  hash(hashString, len = 12) {
    return hashString.substr(0, len);
  },

  containerNames(names) {
    return names
      .map(n => n.substr(1))
      .filter(n => (n.match(/\//) || []).length === 0)
      .join(', ');
  }
};

export default formatters;
