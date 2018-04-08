module.exports = {
    "parserOptions": {

        /**
         * We are using es2017 because we are using async/await in our controllers
         */
        "ecmaVersion": 2017,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "rules": {
        "semi": 2
    }
};