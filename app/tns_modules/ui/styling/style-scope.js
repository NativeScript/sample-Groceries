var trace = require("trace");
var cssSelector = require("ui/styling/css-selector");
var cssParser = require("js-libs/reworkcss");
var visual_state_1 = require("ui/styling/visual-state");
var application = require("application");
var utils = require("utils/utils");
var types = require("utils/types");
var fs = require("file-system");
var file_access_module = require("file-system/file-system-access");
var fileAccess = new file_access_module.FileSystemAccess();
var pattern = /url\(('|")(.*?)\1\)/;
var StyleScope = (function () {
    function StyleScope() {
        this._statesByKey = {};
        this._viewIdToKey = {};
    }
    Object.defineProperty(StyleScope.prototype, "css", {
        get: function () {
            return this._css;
        },
        set: function (value) {
            this._css = value;
            this._cssFileName = undefined;
            this._cssSelectors = undefined;
            this._reset();
        },
        enumerable: true,
        configurable: true
    });
    StyleScope.prototype.addCss = function (cssString, cssFileName) {
        this._css = this._css ? this._css + cssString : cssString;
        this._cssFileName = cssFileName;
        this._reset();
        if (!this._cssSelectors) {
            this._cssSelectors = new Array();
        }
        var selectorsFromFile = StyleScope.createSelectorsFromCss(cssString, cssFileName);
        this._cssSelectors = StyleScope._joinCssSelectorsArrays([this._cssSelectors, selectorsFromFile]);
    };
    StyleScope.createSelectorsFromCss = function (css, cssFileName) {
        try {
            var pageCssSyntaxTree = css ? cssParser.parse(css, { source: cssFileName }) : null;
            var pageCssSelectors = new Array();
            if (pageCssSyntaxTree) {
                pageCssSelectors = StyleScope._joinCssSelectorsArrays([pageCssSelectors, StyleScope.createSelectorsFromImports(pageCssSyntaxTree)]);
                pageCssSelectors = StyleScope._joinCssSelectorsArrays([pageCssSelectors, StyleScope.createSelectorsFromSyntaxTree(pageCssSyntaxTree)]);
            }
            return pageCssSelectors;
        }
        catch (e) {
            trace.write("Css styling failed: " + e, trace.categories.Error, trace.messageType.error);
        }
    };
    StyleScope.createSelectorsFromImports = function (tree) {
        var selectors = new Array();
        if (!types.isNullOrUndefined(tree)) {
            var imports = tree["stylesheet"]["rules"].filter(function (r) { return r.type === "import"; });
            for (var i = 0; i < imports.length; i++) {
                var importItem = imports[i]["import"];
                var match = importItem && importItem.match(pattern);
                var url = match && match[2];
                if (!types.isNullOrUndefined(url)) {
                    if (utils.isFileOrResourcePath(url)) {
                        var fileName = types.isString(url) ? url.trim() : "";
                        if (fileName.indexOf("~/") === 0) {
                            fileName = fs.path.join(fs.knownFolders.currentApp().path, fileName.replace("~/", ""));
                        }
                        fileAccess.readText(fileName, function (result) {
                            selectors = StyleScope._joinCssSelectorsArrays([selectors, StyleScope.createSelectorsFromCss(result, fileName)]);
                        });
                    }
                }
            }
        }
        return selectors;
    };
    StyleScope.prototype.ensureSelectors = function () {
        if (!this._cssSelectors && (this._css || application.cssSelectorsCache)) {
            var applicationCssSelectors = application.cssSelectorsCache ? application.cssSelectorsCache : null;
            var pageCssSelectors = StyleScope.createSelectorsFromCss(this._css, this._cssFileName);
            this._cssSelectors = StyleScope._joinCssSelectorsArrays([applicationCssSelectors, pageCssSelectors]);
        }
    };
    StyleScope._joinCssSelectorsArrays = function (arrays) {
        var mergedResult = [];
        var i;
        for (i = 0; i < arrays.length; i++) {
            if (arrays[i]) {
                mergedResult.push.apply(mergedResult, arrays[i]);
            }
        }
        mergedResult.sort(function (a, b) { return a.specificity - b.specificity; });
        return mergedResult;
    };
    StyleScope.prototype.applySelectors = function (view) {
        if (!this._cssSelectors) {
            return;
        }
        view.style._beginUpdate();
        var i, selector, matchedStateSelectors = new Array();
        for (i = 0; i < this._cssSelectors.length; i++) {
            selector = this._cssSelectors[i];
            if (selector.matches(view)) {
                if (selector instanceof cssSelector.CssVisualStateSelector) {
                    matchedStateSelectors.push(selector);
                }
                else {
                    selector.apply(view);
                }
            }
        }
        if (matchedStateSelectors.length > 0) {
            var key = "";
            matchedStateSelectors.forEach(function (s) { return key += s.key + "|"; });
            this._viewIdToKey[view._domId] = key;
            if (!this._statesByKey[key]) {
                this._createVisualsStatesForSelectors(key, matchedStateSelectors);
            }
        }
        view.style._endUpdate();
    };
    StyleScope.prototype.getVisualStates = function (view) {
        var key = this._viewIdToKey[view._domId];
        if (key === undefined) {
            return undefined;
        }
        return this._statesByKey[key];
    };
    StyleScope.prototype._createVisualsStatesForSelectors = function (key, matchedStateSelectors) {
        var i, allStates = {}, stateSelector;
        this._statesByKey[key] = allStates;
        for (i = 0; i < matchedStateSelectors.length; i++) {
            stateSelector = matchedStateSelectors[i];
            var visualState = allStates[stateSelector.state];
            if (!visualState) {
                visualState = new visual_state_1.VisualState();
                allStates[stateSelector.state] = visualState;
            }
            stateSelector.eachSetter(function (property, value) {
                visualState.setters[property.name] = value;
            });
        }
    };
    StyleScope.createSelectorsFromSyntaxTree = function (ast) {
        var result = [];
        var rules = ast.stylesheet.rules;
        var rule;
        var filteredDeclarations;
        var i;
        var j;
        for (i = 0; i < rules.length; i++) {
            rule = rules[i];
            if (rule.type === "rule") {
                filteredDeclarations = rule.declarations.filter(function (val, i, arr) { return val.type === "declaration"; });
                for (j = 0; j < rule.selectors.length; j++) {
                    result.push(cssSelector.createSelector(rule.selectors[j], filteredDeclarations));
                }
            }
        }
        return result;
    };
    StyleScope.prototype._reset = function () {
        this._statesByKey = {};
        this._viewIdToKey = {};
    };
    return StyleScope;
})();
exports.StyleScope = StyleScope;
function applyInlineSyle(view, style) {
    try {
        var syntaxTree = cssParser.parse("local { " + style + " }", undefined);
        var filteredDeclarations = syntaxTree.stylesheet.rules[0].declarations.filter(function (val, i, arr) { return val.type === "declaration"; });
        cssSelector.applyInlineSyle(view, filteredDeclarations);
    }
    catch (ex) {
        trace.write("Applying local style failed: " + ex, trace.categories.Error, trace.messageType.error);
    }
}
exports.applyInlineSyle = applyInlineSyle;
