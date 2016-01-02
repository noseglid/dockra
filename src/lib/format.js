const formatters = {
  hash(hashString, len = 12) {
    return hashString.substr(0, len);
  },

  containerName(name) {
    return name.match(/^\//) ? name.substr(1) : name;
  }
};

export default formatters;
