const VERSION_REGEX = /^(\d+)\.(\d+)\.(\d+)/
const MAJOR = 1
const MINOR = 2
const PATCH = 3

/**
 * A simple class to manage versions
 */
class Version {
  constructor (version) {
    this.version = version.trim()
  }

  /**
   * Compare two versions
   * returns positive number if this > version
   * returns negative number if this < version
   * returns 0 if this === version
   * @param {Version} version
   */
  compare (version) {
    return (this.major() - version.major()) || (this.minor() - version.minor()) || (this.patch() - version.patch())
  }

  /**
   * Returns the major number
   * @return {number}
   */
  major () {
    return this.extractFromVersion(MAJOR)
  }

  /**
   * Returns the minor number
   * @return {number}
   */
  minor () {
    return this.extractFromVersion(MINOR)
  }

  /**
   * Returns the patch number
   * @return {number}
   */
  patch () {
    return this.extractFromVersion(PATCH)
  }

  toString () {
    return this.version
  }

  toPatch () {
    return `${this.major()}.${this.minor()}.${this.patch()}`
  }

  /**
   * Return a part of the version (major, minor, patch)
   * @param {string} part the part choiced
   * @param {number} fallback
   * @return {number}
   */
  extractFromVersion (part, fallback = 0) {
    const matchData = this.version.match(VERSION_REGEX)
    if (matchData) {
      return parseInt(matchData[part])
    }
    return fallback
  }
}

module.exports = Version
