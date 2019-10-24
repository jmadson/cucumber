var Parser = require('./parser')
var Compiler = require('./pickles/compiler')

var compiler = new Compiler()
var parser = new Parser()
parser.stopAtFirstError = false

function generateEvents(data, uri, types, language) {
  types = Object.assign({
    'source': true,
    'gherkin-document': true,
    'pickle': true
  }, types || {})

  result = []

  try {
    if (types['source']) {
      result.push({
        type: 'source',
        uri: uri,
        data: data,
        media: {
          encoding: 'utf-8',
          type: 'text/x.cucumber.gherkin+plain'
        }
      })
    }

    if (!types['gherkin-document'] && !types['pickle'])
      return result

    var gherkinDocument = parser.parse(data, language)

    if (types['gherkin-document']) {
      result.push({
        type: 'gherkin-document',
        uri: uri,
        document: gherkinDocument
      })
    }

    if (types['pickle']) {
      var pickles = compiler.compile(gherkinDocument)
      pickles.forEach(function (pickle) {
        result.push({
          type: 'pickle',
          uri: uri,
          pickle: pickle
        });
      });
    }
  } catch (err) {
    var errors = err.errors || [err]
    errors.forEach(function (error) {
      result.push({
        type: "attachment",
        source: {
          uri: uri,
          start: {
            line: error.location.line,
            column: error.location.column
          }
        },
        data: error.message,
        media: {
          encoding: "utf-8",
          type: "text/x.cucumber.stacktrace+plain"
        }
      })
    })
  }
  return result
}

module.exports = generateEvents
