const prettierConfig = require('./.prettierrc.js');

module.exports = {
    "extends": ["plugin:@typescript-eslint/recommended","airbnb", "prettier", "prettier/react", "plugin:sonarjs/recommended", "plugin:compat/recommended", "plugin:promise/recommended"],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true,
            "modules": true,
            "legacyDecorators": true
        }
    },
    "plugins": [
        "@typescript-eslint", "react", "react-hooks", "prettier", "jsx-a11y", "import", "sonarjs", "optimize-regex", "promise"
    ],
    "env" : {
        "browser" : true,
        "node" : true,
        "jest" : true
    },
    "settings": {
        "import/parser": "babel-eslint",
        "import/ignore": [
            "node-modules", "plugins", ".(json|css|xml)$"
        ],
        "react": {
            "pragma": "React"
        },
        "polyfills": [
            "Object.entries",
            "Object.values",
            "Object.assign"
        ]
    },
    "globals" : {
        "jsdom_locationAssignParams": true,
        "jsdom_locationAssignHref": true,
        "react_disableWarnings": true,
        "react_enableWarnings": true
    },
    "rules" : {
        "prettier/prettier": ["error", prettierConfig],
        "import/extensions": 0, // Ложные ошибки через ВАРМ
        "optimize-regex/optimize-regex": 1,
        "react-hooks/rules-of-hooks": "error",
        "@typescript-eslint/ban-ts-ignore": 1, // смысла немного, на код ревью будет виден
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/member-delimiter-style": "off",
        "@typescript-eslint/no-var-requires": 0,
        "@typescript-eslint/interface-name-prefix": 0,
        "no-restricted-imports": [
            1,
            "lodash",
            "ramda"
        ],
        "no-restricted-globals": [2, "find"],
        "no-var": 0,
        "no-shadow": 0,
        "vars-on-top": 0,
        "consistent-return": 1,
        "no-unused-vars": [2, {
            "vars": "all", "args": "none", "varsIgnorePattern": "^React$", "ignoreRestSiblings": true
        }],
        "no-cond-assign": [1, "always"],
        "default-case": 1,
        "no-use-before-define": 1,
        "no-case-declarations": 1,
        "no-restricted-syntax": 1,
        "guard-for-in": "off",
        "no-continue": "off",
        "func-name-matching": 2, // включить был 1
        "prefer-template": 2, // включить был 1
        "no-useless-escape": 2, // включить был 1
        "global-require": 0,
        "class-methods-use-this": 1,
        "no-return-assign": 1,
        "no-plusplus": [1, {
            "allowForLoopAfterthoughts": true
        }],
        "no-restricted-properties": 2, // включить был 1
        "prefer-promise-reject-errors": [1, {
            "allowEmptyReject": false
        }],
        "one-var": [1, //может сломать код был 0
            "never"],
        "prefer-destructuring": 1,
        // "max-statements": [2, 15], // ломает код с хуками
        "max-depth": [1, 2],
        "complexity": [2, 20],
        "max-params": [1, 3],
        "max-nested-callbacks": [2, 4], // было 3, из-за хуков useMemo и useCallback ложно срабатывало
        "prefer-const": 1,
        "no-param-reassign": [
            1,
            {
                "props": false
            }
        ],
        "no-console": 1,
        "func-style": [2, "declaration", {
            "allowArrowFunctions": true
        }],
        "newline-after-var": [2, // возможен баг перед let
            "always"],
        "new-cap": [
            2, { "capIsNewExceptions": ["When", "Then", "Given", "Nothing", "T", "F"],
                "newIsCap": false
            }
        ],
        "no-unused-expressions": [2, {
            "allowShortCircuit": true,
            "allowTernary": true
        }],
        "no-underscore-dangle": [1, {
            "allow": ["_exception", "__html"]
        }],
        "jsx-a11y/img-has-alt": 0, // Ложные срабатывания был 0
        "jsx-a11y/aria-role": 1,
        "jsx-a11y/label-has-for": 1, // Включить был 0
        "jsx-a11y/html-has-lang": 1,
        "jsx-a11y/no-static-element-interactions": 1,
        "jsx-a11y/alt-text": 1,
        "jsx-a11y/iframe-has-title": 1,
        "jsx-a11y/no-autofocus": 1,
        "jsx-a11y/media-has-caption": 1,
        "jsx-a11y/no-noninteractive-tabindex": 1,
        "jsx-a11y/no-noninteractive-element-to-interactive-role": 1,
        "jsx-a11y/interactive-supports-focus": 1,
        "jsx-a11y/anchor-is-valid": 0,
        "jsx-a11y/click-events-have-key-events": 1,
        "jsx-a11y/mouse-events-have-key-events": 1,
        "jsx-a11y/label-has-associated-control": ["error", {
            "depth": 2
        }],
        "react/no-array-index-key": 1,
        "react/no-will-update-set-state": 2, // включить был 1
        "react/require-default-props": 0,
        "react/style-prop-object": 1, // включить был 0
        "react/prefer-stateless-function": [1, {
            "ignorePureComponents": true
        }],
        "react/state-in-constructor": [1, "never"],
        "react/no-this-in-sfc": 1, // может матчится на миксины был 0
        "react/default-props-match-prop-types": 1,
        "react/no-direct-mutation-state": 2,
        "react/jsx-key": 2,
        "react/destructuring-assignment": 0,
        "react/no-find-dom-node": 1,
        "react/require-optimization": [0, {
            "allowDecorators": ["pureRender", "connect"]
        }],
        "react/jsx-filename-extension": 0,
        "react/jsx-no-target-blank": 2,
        "react/no-children-prop": 2, // был сломан, был 1
        "react/forbid-prop-types": [2, {
            "forbid": ["any"]
        }],
        "react/prop-types": 0, // Ложный вызов на :React.FC<{}>
        "react/display-name": [0, { // ложное срабатываение с react.memo
            "ignoreTranspilerName": false
        }],
        "react/no-multi-comp": [1, {
            "ignoreStateless": true
        }],
        "react/button-has-type": 1, // может не видеть type через переменную
        "react/no-unused-prop-types": 1,
        "react/no-deprecated": 2, // был 1, нужно 2
        "react/sort-comp": [2, {
            "order": [
                "static-methods",
                "mixins",
                "displayName",
                "actions",
                "contextTypes",
                "childContextTypes",
                "propTypes",
                "defaultProps",
                "pure",
                "statics",
                "state",
                "constructor",
                "getDefaultProps",
                "getInitialState",
                "getChildContext",
                "getStoresState",
                "componentWillMount",
                "componentDidMount",
                "componentWillReceiveProps",
                "shouldComponentUpdate",
                "componentWillUpdate",
                "componentDidUpdate",
                "componentWillUnmount",
                "/^component.+$/",
                "/^get.+$/",
                "/^on.+$/",
                "/^handle.+$/",
                "everything-else",
                "/^render.+$/",
                "render"
            ]
        }],
        "react/no-access-state-in-setstate": 1, // аффектит все setState был 0
        "import/no-commonjs": 0, // убрать, когда можно будет поставить typed-css-modules-webpack-plugin
        "import/no-unresolved": [0, {
            "commonjs": true,
            "amd": false
        }], // отключил, был 2
        "import/named": 2,
        "import/namespace": 2,
        "import/default": 2,
        "import/order": 1, // может сломать код. был 0
        "import/prefer-default-export": 1,
        "import/newline-after-import": 1, // был баг был 0
        "import/no-webpack-loader-syntax": 1,
        "import/first": 1,
        "import/no-dynamic-require": 1,
        "import/no-deprecated": 1,
        "import/no-extraneous-dependencies": 0,
        "no-empty": ["error", {
            "allowEmptyCatch": true
        }],
        "curly" : [2, "all"],
        "yoda": ["error", "never", {
            "exceptRange": true
        }],
        "comma-dangle" : ["warn", {
            "arrays": "only-multiline",
            "objects": "only-multiline",
            "imports": "only-multiline",
            "exports": "only-multiline",
            "functions": "never"
        }],
        "sonarjs/cognitive-complexity": 0, // ломает код конструктора таблиц

        // с сберпроекта
        "react/no-unescaped-entities": 0,
        "react/jsx-no-undef": 1,
        "react/jsx-uses-vars": 1,
        "react/react-in-jsx-scope": [1],
        // "comma-dangle" : [2, "only-multiline"],
        "no-constant-condition" : 2,
        "no-control-regex" : 2,
        "no-debugger" : 1,
        "no-dupe-args" : 2,
        "no-dupe-keys" : 2,
        "no-duplicate-case" : 2,
        "no-empty-character-class" : 2,
        "no-ex-assign" : 2,
        "no-extra-boolean-cast" : 1,
        "no-extra-parens" : [2, "functions"],
        "no-extra-semi" : 2,
        "no-func-assign" : 2,
        "no-inner-declarations" : [2, "functions"],
        "no-invalid-regexp" : 2,
        "no-irregular-whitespace" : 2,
        "no-negated-in-lhs" : 2,
        "no-obj-calls" : 2,
        "no-regex-spaces" : 2,
        "no-sparse-arrays" : 2,
        "no-trailing-spaces" : 0,
        "no-unreachable" : 1,
        "use-isnan" : 2,
        "valid-jsdoc" : [1, {
            "requireReturn" : false
        }
        ],
        "valid-typeof" : 2,

        "accessor-pairs" : 2,
        "block-scoped-var" : 1,
        "no-alert" : 2,
        "no-caller" : 2,
        "no-div-regex" : 2,
        "no-labels" : 2,
        "no-eval" : 2,
        "no-extend-native" : 2,
        "no-extra-bind" : 2,
        "no-fallthrough" : 2,
        "no-floating-decimal" : 2,
        "no-implied-eval" : 2,
        "no-iterator" : 2,
        "no-lone-blocks" : 2,
        "no-loop-func" : 2,
        "no-native-reassign" : 2,
        "no-new-func" : 2,
        "no-new-wrappers" : 1,
        "no-new" : 1,
        "no-octal-escape" : 2,
        "no-octal" : 2,
        "no-proto" : 2,
        "no-redeclare" : 1,
        "no-script-url" : 2,
        "no-self-compare" : 2,
        "no-sequences" : 2,
        "no-void" : 2,
        "no-multiple-empty-lines": [2, {"max": 1}],
        "no-warning-comments" : 1,
        "no-with" : 2,
        "radix" : 2,
        "wrap-iife" : [2, "any"],
        "strict" : [2, "function"],
        "no-catch-shadow" : 2,
        "no-delete-var" : 2,
        "no-label-var" : 2,
        "no-shadow-restricted-names" : 2,
        "no-undef-init" : 2,
        "no-undef" : 2,
        "brace-style" : [2, "1tbs", {
            "allowSingleLine" : true
        }
        ],
        "camelcase" : 0,
        "consistent-this" : 1,
        "linebreak-style" : 0,
//		"max-len" : [2, 120],
        "new-parens" : 2,
        "no-array-constructor" : 2,
        "no-lonely-if" : 1,
        "no-mixed-spaces-and-tabs" : [2, "smart-tabs"],
        "no-nested-ternary" : 0,
        "no-new-object" : 2,
        "no-spaced-func" : 2,
        "jsx-quotes" : ["error","prefer-double"],
        "quotes" : ["error", "single"],
        "quote-props" : [2, "as-needed", {
            "keywords" : true,
            "unnecessary" : false
        }
        ],
        "semi-spacing" : [1, {
            "before" : false,
            "after" : true
        }
        ],
        "semi" : 2,
        "keyword-spacing" : 2,
        "space-infix-ops" : 2,
        "space-unary-ops" : [
            2, {
                "words" : true,
                "nonwords" : false
            }
        ],
        "dot-notation" : [
            0, {
                "allowKeywords" : false
            }
        ]
    }
};
