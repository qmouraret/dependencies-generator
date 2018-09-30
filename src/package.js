const { readJson } = require("fs-extra")
const npm = require("./npm")

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

    /**
     *
     * @param {String[]} versions
     * @returns {String}
     */
    const getLastVersionStable = (versions) => {
      return versions[versions.length - 1]
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
      getLastVersions: async () => {
        const list = Object.entries(getAllDependencies()).map((value) => npm.getVersions(value[0]))
        const allPackageFounded = await Promise.all(list)
        //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> versions : ", versions)
        Object.keys(allPackageFounded).map((key) => {
          const pack = allPackageFounded[key]
          const lastVersionStable = getLastVersionStable(pack.versions)
          console.log("package: ", pack.name, " >>> ", lastVersionStable)

        })

        // return Promise.all(list).then((versions) => {
        //   console.log('resolved : ', versions)
        // }).catch((e) => {
        //   console.error("Error during recovery versions. ", e)
        // })

        // const versions = await npm.getVersions("express")
        // console.log(">>>>>> versions: ", versions) // .stdout.toString().trim())
      }
    }
  }
}

module.exports = PackageManager
