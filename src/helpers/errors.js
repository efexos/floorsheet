module.exports = class Err extends Error {
  constructor(code, name, message) {
    super(message);
    this.code = code;
    this.name = name;
  }
}