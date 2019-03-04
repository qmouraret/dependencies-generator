const util = require('util')
const exec = util.promisify(require('child_process').exec)

const CMD_NPM_VIEW = 'npm view ? --json'
const CMD_NPM_LIST = 'npm list --depth=0 --json'

const formatCommand = (command, ...arguments) => {
  // TODO : implement the behavior arguments[0] must replace first ?, arguments[1] must replace second ?, etc.
  return command.replace('?', arguments[0])
}

const npm = {
  /**
   * Returns the versions for a specific module
   * @param {string} packageName
   * @returns {String[]}
   */
  getVersions: async (packageName) => {
    try {
      const { stdout, stderr } = await exec(formatCommand(CMD_NPM_VIEW, packageName))
      // console.log(">>>>>>> stdout: ", stdout)
      console.log('>>>>>>> stderr: ', stderr)
      // const result = JSON.parse(await exec(formatCommand(CMD_NPM_VIEW, packageName)))
      return JSON.parse(stdout)
    } catch (e) {
      console.error('Error during check of \'', packageName, '\', ', e)
      return null
    }
  },
  /**
   * Returns a list of dependencies in json format, indicating the current installed versions
   * @return {Promise<{}>}
   */
  list: async () => {
    try {
      const { stdout, stderr } = await exec(formatCommand(CMD_NPM_LIST))
      console.log('>>>>>>> stdout: ', stdout)
      console.log('>>>>>>> stderr: ', stderr)
      // const result = JSON.parse(await exec(formatCommand(CMD_NPM_VIEW, packageName)))
      return JSON.parse(stdout)
    } catch (e) {
      console.error('Error during the recovering of the list of installed package, ', e)
      return null
    }
  }
}

module.exports = npm
