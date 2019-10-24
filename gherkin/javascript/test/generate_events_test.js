var assert = require('assert');
var Gherkin = require('..');

describe('generateEvents', function () {

  it("parses feature even when the Array prototype has been modified", function () {
    Array.prototype.omgwtf = function () {
      // noop
    };

    var source = "Feature: Hello\n" +
      "  Scenario: World\n" +
      "    Given a step";

    var types = {
      'pickle': true,
      'source': false,
      'gherkin-document': false
    };

    var output = Gherkin.generateEvents(source, "", types, undefined);

    assert.deepEqual(output, [
      {
        pickle: {
          language: 'en',
          locations: [
            {
              column: 3,
              line: 2
            }
          ],
          name: 'World',
          steps: [
            {
              arguments: [],
              locations: [
                {
                  column: 11,
                  line: 3
                }
              ],
              text: 'a step'
            }
          ],
          tags: []
        },
        type: 'pickle',
        uri: ''
      }
    ])

  });

});
