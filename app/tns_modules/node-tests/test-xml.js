var chai_1 = require("chai");
var xml = require('xml');
describe("xml parser", function () {
    var last_element = null;
    var last_attrs = null;
    var last_data = null;
    var parser = null;
    beforeEach(function () {
        parser = new xml.XmlParser(function (event) {
            switch (event.eventType) {
                case xml.ParserEventType.StartElement:
                    last_element = event.elementName;
                    last_attrs = event.attributes;
                    break;
                case xml.ParserEventType.Text:
                    last_data = event.data;
                    break;
            }
        });
    });
    it("handles whitespace around attribute =", function () {
        parser.parse("<TextField text = \n 'hello' />");
        chai_1.assert.equal('TextField', last_element);
        chai_1.assert.equal('hello', last_attrs['text']);
    });
    it("resolves entities", function () {
        parser.parse("<element>&lt;&gt;&quot;&amp;&apos;</element>");
        chai_1.assert.equal("<>\"&'", last_data);
    });
});
