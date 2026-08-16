const formatAnsi = require('./formatAnsi'),
    formatHtml = require('./formatHtml');

class TextFormatter {

    // Credits to @ThaumicTom for the deformat regex

    /**
     * Regex to match all the formatting codes
     * @type {RegExp}
     */
    static formatCodesRegex = /(\$(?:(\$)|[0-9a-f]{2,3}|[lh]\[.*?\]|.))/gi;

    /**
     * Regex to match all the color formatting codes
     * @type {RegExp}
     */
    static colorCodesRegex = /\$[0-9a-f]{1,3}/gi;

    /**
     * Deformat the text
     * @param {string} input
     * @returns {string}
     */
    static deformat(input) {
        return input.replace(this.formatCodesRegex, "$2");
    }

    /**
     * Format the text to ANSI escape codes
     * @param {string} input
     * @param {formatAnsiOptions} [options]
     * @returns {string}
     */
    static formatAnsi = (input, options = {}) => formatAnsi(this, input, options);

    /**
     * Format the text into HTML format
     * @param {string} input
     * @param {{disableLinks?: boolean, lightBackground?: boolean, linkTarget?: string}} [options]
     * @returns {string}
     */
    static formatHtml = (input, options = {}) => formatHtml(input, options);
}

module.exports = TextFormatter;

/**
 * @typedef formatAnsiOptions
 * @type {object}
 * @property {?boolean} disableLinks Disable links
 * @property {?boolean} disableColor Disable colors
 * @property {?boolean} lightBackground Optimize for light backgrounds
 * @property {?"4bit"|"8bit"|"24bit"} colorDepth The color depth. If omitted, 24bit is used
 */
