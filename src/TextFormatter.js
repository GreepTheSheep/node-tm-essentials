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
     * @param {{disableLinks?: boolean, lightBackground?: boolean}} [options]
     * @returns {string}
     */
    static formatAnsi(input, options = {}) {
        let output = "",
            bold = false,
            italic = false,
            uppercase = false,
            colored = false,
            link = null;

        let normalized = input.replace(/\$l(?!\[)([^$]+)\$l/gi, "$l[$1]$1$l");

        let split = normalized.split(this.deformatRegex).filter((i) => i && i != "$");

        split.forEach((part) => {
            let res = this.#tokenToAnsi(part, { bold, italic, uppercase, colored, link, options });
            output += res.output;
            bold = res.bold;
            italic = res.italic;
            uppercase = res.uppercase;
            colored = res.colored;
            link = res.link;
        });

        if (link) output += "\x1B]8;;\x1B\\";

        output += this.AnsiDefault;

        return output;
    }

    /**
     * Convert a text formatting token to ANSI escape codes
     * @param {string} input
     * @param {{bold: boolean, italic: boolean, uppercase: boolean, colored: boolean, link: ?string, options: {disableLinks?: boolean, lightBackground?: boolean}}} state
     * @returns {{output: string, bold: boolean, italic: boolean, uppercase: boolean, colored: boolean, link: ?string}}
     * @private
     */
    static #tokenToAnsi(input, state) {
        let output = "",
            bold = state.bold,
            italic = state.italic,
            uppercase = state.uppercase,
            colored = state.colored,
            link = state.link,
            options = state.options,
            code = input.toLowerCase();

        if (code == "$o") {
            if (!bold) output += "\x1B[1m";
            bold = true;
        } else if (code == "$i") {
            if (!italic) output += "\x1B[3m";
            italic = true;
        } else if (code == "$t") {
            uppercase = true;
        } else if (code == "$w" || code == "$n" || code == "$m") {
            // no ANSI equivalent, dropped from the output
        } else if (code == "$g") {
            if (colored) output += "\x1B[39m";
            colored = false;
        } else if (code == "$z") {
            if (link) output += "\x1B]8;;\x1B\\";
            if (bold || italic || colored) output += this.AnsiDefault;
            bold = false;
            italic = false;
            uppercase = false;
            colored = false;
            link = null;
        } else if (input.match(/^\$[lh]\[.*?\]$/i)) {
            if (!options.disableLinks) {
                if (link) output += "\x1B]8;;\x1B\\";
                let url = input.substring(input.indexOf("[") + 1, input.lastIndexOf("]"));
                output += "\x1B]8;;" + url + "\x1B\\";
                link = url;
            }
        } else if (code == "$l") {
            if (link) output += "\x1B]8;;\x1B\\";
            link = null;
        } else if (input.startsWith("$") && input.match(this.colorRegex)) {
            let hexColor = input.split("$").join("").padEnd(3, "0");
            if (options.lightBackground) hexColor = this.#invertLight(hexColor);
            let colorInt16 = parseInt(hexColor, 16),
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

        return { output, bold, italic, uppercase, colored, link };
    }

    /**
     * Darken a light color for a light background
     * @param {string} hexColor
     * @returns {string}
     * @private
     */
    static #invertLight(hexColor) {
        const r = parseInt(hexColor[0], 16) * 17,
            g = parseInt(hexColor[1], 16) * 17,
            b = parseInt(hexColor[2], 16) * 17,
            grey = (r + g + b) / 3;

        if (grey > 160) {
            const upper = 255 + 74;
            const nr = Math.min(15, Math.floor((upper - r) / 17)),
                ng = Math.min(15, Math.floor((upper - g) / 17)),
                nb = Math.min(15, Math.floor((upper - b) / 17));
            return nr.toString(16) + ng.toString(16) + nb.toString(16);
        }
        return hexColor;
    }
}

module.exports = TextFormatter;