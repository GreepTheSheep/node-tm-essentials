const invertLight = require('./Colors/invertLight'),
    rgbToAnsi = require('./Colors/rgbToAnsi'),
    ansiDefault = "\x1B[39m\x1B[22m\x1B[23m",
    ansiStyleReset = "\x1B[22m\x1B[23m";

/**
 * Format the text with ANSI escape codes
 * @param {import('./index')} textFormatter
 * @param {string} input
 * @param {formatAnsiOptions} [options]
 * @returns {string}
 */
module.exports = (textFormatter, input, options = {}) => {
    let output = "",
        bold = false,
        italic = false,
        uppercase = false,
        colored = false,
        link = null;

    let normalized = input.replace(/\$l(?!\[)([^$]+)\$l/gi, "$l[$1]$1$l");

    let split = normalized.split(textFormatter.formatCodesRegex).filter((i) => i && i != "$");

    split.forEach((part) => {
        let res = tokenToAnsi(textFormatter, part, { bold, italic, uppercase, colored, link, options });
        output += res.output;
        bold = res.bold;
        italic = res.italic;
        uppercase = res.uppercase;
        colored = res.colored;
        link = res.link;
    });

    if (link) output += "\x1B]8;;\x1B\\";

    output += options.disableColor ? ansiStyleReset : ansiDefault;

    return output;
};

/**
 * Convert a text formatting token to ANSI escape codes
 * @param {import('./index')} textFormatter
 * @param {string} input
 * @param {formatAnsiOptions} options
 * @param {{bold: boolean, italic: boolean, uppercase: boolean, colored: boolean, link: ?string}} state
 * @returns {{output: string, bold: boolean, italic: boolean, uppercase: boolean, colored: boolean, link: ?string}}
 */
function tokenToAnsi(textFormatter, input, state) {
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
        if (bold || italic || colored) output += options.disableColor ? ansiStyleReset : ansiDefault;
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
    } else if (input.startsWith("$") && input.match(textFormatter.colorCodesRegex)) {
        if (options.disableColor) return { output, bold, italic, uppercase, colored, link };
        let hexColor = input.split("$").join("").padEnd(3, "0");
        if (options.lightBackground) hexColor = invertLight(hexColor);
        let colorInt16 = parseInt(hexColor, 16),
            r = 0x11 * ((colorInt16 & 0xF00) >> 8),
            g = 0x11 * ((colorInt16 & 0x0F0) >> 4),
            b = 0x11 * ((colorInt16 & 0x00F) >> 0);

        output += rgbToAnsi(r, g, b, options.colorDepth);
        colored = true;
    } else if (input.startsWith("$")) {
        output += input;
    } else {
        output += uppercase ? input.toUpperCase() : input;
    }

    return { output, bold, italic, uppercase, colored, link };
}