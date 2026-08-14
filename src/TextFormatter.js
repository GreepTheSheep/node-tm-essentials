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
     * Ansi default color and style
     * @type {string}
     * @private
     */
    static AnsiDefault = "\x1B[39m\x1B[22m\x1B[23m";

    /**
     * Deformat the text
     * @param {string} input
     * @returns {string}
     */
    static deformat(input) {
        return input.replace(this.deformatRegex, "$2");
    }

    /**
     * Format the text with ANSI escape codes
     * @param {string} input
     * @returns {string}
     */
    static formatAnsi(input) {
        let output = "",
            bold = false,
            italic = false,
            uppercase = false,
            colored = false;

        let split = input.split(this.deformatRegex).filter((i) => i && i != "$");

        split.forEach((part) => {
            let res = this.#tokenToAnsi(part, { bold, italic, uppercase, colored });
            output += res.output;
            bold = res.bold;
            italic = res.italic;
            uppercase = res.uppercase;
            colored = res.colored;
        });

        output += this.AnsiDefault;

        return output;
    }

    /**
     * Convert a text formatting token to ANSI escape codes
     * @param {string} input
     * @param {{bold: boolean, italic: boolean, uppercase: boolean, colored: boolean}} state
     * @returns {{output: string, bold: boolean, italic: boolean, uppercase: boolean, colored: boolean}}
     * @private
     */
    static #tokenToAnsi(input, state) {
        let output = "",
            bold = state.bold,
            italic = state.italic,
            uppercase = state.uppercase,
            colored = state.colored;

        if (input == "$o") {
            if (!bold) output += "\x1B[1m";
            bold = true;
        } else if (input == "$i") {
            if (!italic) output += "\x1B[3m";
            italic = true;
        } else if (input == "$t") {
            uppercase = true;
        } else if (input == "$w" || input == "$n" || input == "$m") {
            // no ANSI equivalent, dropped from the output
        } else if (input == "$g") {
            if (colored) output += "\x1B[39m";
            colored = false;
        } else if (input == "$z") {
            if (bold || italic || colored) output += this.AnsiDefault;
            bold = false;
            italic = false;
            uppercase = false;
            colored = false;
        } else if (input.startsWith("$") && input.match(this.colorRegex)) {
            let colorInt16 = parseInt(input.split("$").join("").padEnd(3, "0"), 16),
                r = 0x11 * ((colorInt16 & 0xF00) >> 8),
                g = 0x11 * ((colorInt16 & 0x0F0) >> 4),
                b = 0x11 * ((colorInt16 & 0x00F) >> 0);

            output += "\x1B[38;2;" + r + ";" + g + ";" + b + "m";
            colored = true;
        } else if (input.startsWith("$")) {
            output += input;
        } else {
            output += uppercase ? input.toUpperCase() : input;
        }

        return { output, bold, italic, uppercase, colored };
    }
}

module.exports = TextFormatter;