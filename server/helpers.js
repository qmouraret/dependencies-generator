const Version = require('../src/Version')
const helpers = {
  register: (hbs) => {

    const select = (list, current) => {
      console.log('>>>>>> list: ', list, ', current: ', current)
      const options = list
        .sort((a, b) => {
          return (new Version(b)).compare(new Version(a))
        })
        .map((item) => {
          let selected = ''
          if (item === current) {
            selected = 'selected="selected"'
          }
          return `<option ${selected}>${item}</option>`
        })
      return `<select onclick="onChoiceVersion(this, '${current}')">${options.join('')}</select>`
    }

    hbs.registerHelper('select', select)
  }
}

module.exports = helpers