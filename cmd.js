#!/usr/bin/env node
const packageManager = require("./src/package")
const npm = require("./src/npm")

const app = async () => {
  const packageJson = await packageManager.load("./package.json")
  console.log(packageJson.toJson())

  const lastVersions = await packageJson.getLastVersions()
  // console.log("---lastVersions--- ", lastVersions)
}

app().then(() => {
  console.log("SUCCESS")
}).catch((e) => {
  console.error('ERROR : ', e)
})
