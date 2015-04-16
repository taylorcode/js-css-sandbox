
window.jsCss = {};

jsCss.replacePseudo = (function() {

    function findInIndexedObj(obj, value) {
        for (var key in obj) {
            if (obj[key] === value) {
                return key;
            }
        }
    }

    function addCSSRule(sheet, selector, rules, index) {
        if ('insertRule' in sheet) {
            sheet.insertRule(selector + '{' + rules + '}', index);
        } else if ('addRule' in sheet) {
            sheet.addRule(selector, rules, index);
        }
    }

    function deleteCSSRule(sheet, deleteIndex) {
        var deleteRuleMethodName = sheet.deleteRule ? 'delete' : 'remove';
        sheet[deleteRuleMethodName + 'Rule'](deleteIndex);
    }

    return function(initialClass, replacementClass) {

        document.styleSheets.forEach(function (styleSheet) {

            var cssRules = styleSheet.cssRules || styleSheet.rules;

            cssRules.forEach(function (rule, ruleIndex) {

                var st = rule.selectorText,
                    selections;

                if (!st) return;

                selections = st.split(',');

                selections.forEach(function (selection) {
                    var deleteIndex, re, modifiedSelector

                    if (selection.split(':' + initialClass).length <= 1)  return;

                    deleteIndex = findInIndexedObj(styleSheet.rules, rule);

                    deleteCSSRule(styleSheet, deleteIndex);

                    re = new RegExp(initialClass, 'g');

                    modifiedSelector = rule.selectorText.replace(re, replacementClass);

                    addCSSRule(styleSheet, modifiedSelector, rule.cssText.split('{')[1].slice(0, -1), deleteIndex);

                });

            });

        });
    }
})();

// actually replace the events on mobile
(function () {
    
    function isTouchDevice () {
        return 'ontouchstart' in window // works on most browsers 
            || 'onmsgesturechange' in window; // works on ie10
    };
    
    if(isTouchDevice()) {
        alert('asdasd');
        jsCss.replacePseudo('hover', 'active');
    }

})();

