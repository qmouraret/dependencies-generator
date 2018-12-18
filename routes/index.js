const express = require('express')
const router = express.Router()
const packageManager = require('../src/package')

/* GET home page. */
router.get('/', async function (req, res, next) {
  const data = { title: 'Express' }
  const packageJson = await packageManager.load("./package.json")
  console.log('Processing: ', packageJson)
  data.latestVersions = await packageJson.getLatestVersions()
  res.render('index', data)
})

module.exports = router
