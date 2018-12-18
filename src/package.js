const { readJson } = require('fs-extra')
const npm = require('./npm')
const Version = require('./Version')

const PackageManager = {
  load: async (url) => {
    let packageJson
    try {
      packageJson = await readJson(url)
    }
    catch (e) {
      console.error(`Error during reading file: ${url}`)
      return new Error(e)
    }

    /**
     * Return severity:
     * 0 no
     * 1 patch: low
     * 2 minor: medium
     * 3 major: high
     *
     * @param current
     * @param latest
     * @return {number}
     */
    const returnSeverityIndice = (current, latest) => {
      console.log(current, ',,,', latest)
      current = new Version(current.replace(/[~^]/g, ''))
      latest = new Version(latest.replace(/[~^]/g, ''))

      if (current.major() === latest.major()) {
        if (current.minor() === latest.minor()) {
          if (current.patch() === latest.patch()) {
            return 0
          } else if (latest.patch() > current.patch()) {
            return 1
          }
        } else if (latest.minor() > current.minor()) {
          return 2
        }
      } else if (latest.major() > current.major()) {
        return 3
      }
      return 0
    }

    /**
     * Returns all dependencies
     * @returns {Object}
     */
    const getAllDependencies = () => {
      let dependencies = packageJson.dependencies
      if (packageJson.devDependencies && packageJson.devDependencies.length > 0) {
        dependencies = Object.assign(dependencies, packageJson.devDependencies)
      }
      return dependencies
    }

    const getVersionForDependency = (name) => {
      const dependencies = getAllDependencies()
      for (const dependency in dependencies) {
        if (dependency === name) {
          return dependencies[dependency]
        }
      }
    }

    /**
     *
     * @param {String[]} versions
     * @param {Boolean} stable
     * @returns {String}
     */
    const getLatestVersion = (versions, stable = true) => {
      const NON_STABLE_VERSION_PATTERN = /[0-9].[0-9].[0-9]-/
      let lastVersionIndex = versions.length - 1
      let lastVersion = versions[lastVersionIndex]

      if (stable && lastVersion.match(NON_STABLE_VERSION_PATTERN)) {
        // find the last version stable
        while (lastVersion.match(NON_STABLE_VERSION_PATTERN) && lastVersionIndex > 0) {
          lastVersionIndex--
          lastVersion = versions[lastVersionIndex]
        }
      }
      return lastVersion
    }

    return {
      /**
       * Returns the package.json content
       * @returns {String}
       */
      toJson: () => {
        return packageJson
      },
      getAllDependencies,
      /**
       * {
       *   "module1": {
       *     version: "1.2.3"
       *   },
       *   "module2": {
       *     version: "0.3.2"
       *   }
       * }
       * @returns {Promise<void>}
       */
      getLatestVersions: async () => {
        const list = Object.entries(getAllDependencies()).map((value) => npm.getVersions(value[0]))
        const allPackageFounded = await Promise.all(list)
        const latestVersions = Object.keys(allPackageFounded).map((key) => {
          const pack = allPackageFounded[key]
          const latestVersion = getLatestVersion(pack.versions)
          console.log('package: ', pack.name, ' >>> ', latestVersion)
          const currentVersion = getVersionForDependency(pack.name)
          return {
            name: pack.name,
            version: {
              latest: latestVersion,
              current: currentVersion
            },
            severity: returnSeverityIndice(currentVersion, latestVersion)
          }
        })
        return latestVersions
      }
    }
  }
}

module.exports = PackageManager
