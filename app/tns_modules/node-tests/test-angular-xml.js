var chai_1 = require("chai");
var xml = require('xml');
describe("angular xml parser", function () {
    var last_element = null;
    var last_attrs = null;
    var parser = null;
    beforeEach(function () {
        parser = new xml.XmlParser(function (event) {
            switch (event.eventType) {
                case xml.ParserEventType.StartElement:
                    last_element = event.elementName;
                    last_attrs = event.attributes;
                    break;
            }
        });
        parser.angularSyntax = true;
    });
    it("parses [property] binding", function () {
        parser.parse("<TextField [text]='somevar' />");
        chai_1.assert.equal('TextField', last_element);
        chai_1.assert.equal(last_attrs['[text]'], 'somevar');
    });
    it("parses (event) binding", function () {
        parser.parse("<TextField (tap)='onTap(blah)' />");
        chai_1.assert.equal('TextField', last_element);
        chai_1.assert.equal(last_attrs['(tap)'], 'onTap(blah)');
    });
    it("parses (^event) binding", function () {
        parser.parse("<TextField (^tap)='onTap(blah)' />");
        chai_1.assert.equal('TextField', last_element);
        chai_1.assert.equal(last_attrs['(^tap)'], 'onTap(blah)');
    });
    it("parses #id attribute", function () {
        parser.parse("<TextField #firstName />");
        chai_1.assert.equal('TextField', last_element);
        chai_1.assert.equal(last_attrs['#firstName'], '');
    });
    it("parses #id attribute followed by another", function () {
        parser.parse("<TextField #firstName text='Name' />");
        chai_1.assert.equal('TextField', last_element);
        chai_1.assert.equal(last_attrs['#firstName'], '');
        chai_1.assert.equal(last_attrs['text'], 'Name');
    });
    it("detects equals without value", function () {
        parser.parse("<TextField brokenTag= />");
        chai_1.assert.isFalse(last_attrs);
    });
    it("detects no equals with quoted value", function () {
        parser.parse("<TextField noEquals 'value' />");
        chai_1.assert.isFalse(last_attrs);
    });
    it("detects unclosed tag after no value attribute", function () {
        parser.parse("<TextField #myId");
        chai_1.assert.isFalse(last_attrs);
    });
    it("rejects angular properties if syntax disabled", function () {
        parser.angularSyntax = false;
        parser.parse("<TextField [text]='somevalue' />");
        chai_1.assert.isFalse(last_attrs);
    });
});
