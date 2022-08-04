class TextFormatter {

    // Credits to @ThaumicTom for the deformat regex

    /**
     * Regex to match all the formatting codes
     * @type {RegExp}
     * @private
     */
    static deformatRegex = /(\$(?:(\$)|[0-9a-f]{2,3}|[lh]\[.*?\]|.))/gi;

    /**
     * Regex to match all the color formatting codes
     * @type {RegExp}
     * @private
     */
    static colorRegex = /\$[0-9a-f]{1,3}/gi;

    /**
     * Ansi default color
     * @type {string}
     * @private
     */
    static AnsiDefault = "\x1B[39m\x1B[22m";

    /**
     * Deformat the text
     * @param {string} input
     * @returns {string}
     */
    static deformat(input) {
        return input.replace(this.deformatRegex, "$2");
    }

    /**
     * Format the text color with ANSI escape codes
     * @param {string} input
     * @returns {string}
     */
    static formatAnsi(input) {
        let output = "";

        let split = input.split(this.deformatRegex).filter((i) => i && i != "$");

        split.forEach((part) => {
            output += this.colorToAnsi(part);
        });

        output += this.AnsiDefault;

        return output;
    }

    /**
     * Convert a color string to ANSI escape codes
     * @param {string} input
     * @returns {string}
     * @private
     */
    static colorToAnsi(input) {
        if (!input.startsWith("$")) return input;
        if (input.endsWith("z")) return this.AnsiDefault;

        if (input.match(this.colorRegex)) {
            let colorInt16 = parseInt(input.split("$").join(""), 16),
                r = 0x11 * ((colorInt16 & 0xF00) >> 8),
                g = 0x11 * ((colorInt16 & 0x0F0) >> 4),
                b = 0x11 * ((colorInt16 & 0x00F) >> 0);

            return "\x1B[38;2;" + r + ";" + g + ";" + b + "m";
        }
        return input;
    }
}

module.exports = TextFormatter;