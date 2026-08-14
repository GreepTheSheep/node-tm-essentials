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
            output += this.#colorToAnsi(part);
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
    static #colorToAnsi(input) {
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

    /**
     * Colored Style bit flag
     * @type {number}
     * @private
     */
    static #StyleColored = 0x1000;

    /**
     * Italic Style bit flag
     * @type {number}
     * @private
     */
    static #StyleItalic = 0x2000;

    /**
     * Bold Style bit flag
     * @type {number}
     * @private
     */
    static #StyleBold = 0x4000;

    /**
     * Shadowed Style bit flag
     * @type {number}
     * @private
     */
    static #StyleShadowed = 0x8000;

    /**
     * Wide Style bit flag
     * @type {number}
     * @private
     */
    static #StyleWide = 0x20000;

    /**
     * Narrow Style bit flag
     * @type {number}
     * @private
     */
    static #StyleNarrow = 0x40000;

    /**
     * Format the text into HTML format
     * @param {string} input
     * @param {{disableLinks?: boolean, lightBackground?: boolean, linkTarget?: string}} [options]
     * @returns {string}
     */
    static formatHtml(input, options = {}) {
        let isCode = false,
            isQuickLink = false,
            isPrettyLink = false,
            color = null;

        let style = 0,
            tokens = [],
            styleStack = [],
            nextToken = { style: 0, text: "" },
            nextLinkToken = null,
            linkLevel = 0;

        const endLink = () => {
            if (nextToken.text !== "") {
                tokens.push(nextToken);
                nextToken = { style, text: "" };
                tokens.push({ type: "linkEnd" });
            } else if (tokens[tokens.length - 1] === nextLinkToken) {
                tokens.pop();
            } else {
                tokens.push({ type: "linkEnd" });
            }

            nextLinkToken = null;
            isQuickLink = false;
            isPrettyLink = false;
        };

        const endText = (force = false) => {
            if (force || style !== nextToken.style) {
                if (nextToken.text !== "") {
                    tokens.push(nextToken);
                    nextToken = { style, text: "" };
                } else {
                    nextToken.style = style;
                }
            }
        };

        for (const c of input) {
            if (isCode) {
                const tok = c.toLowerCase();
                switch (tok) {
                case "i":
                    style ^= this.#StyleItalic;
                    break;
                case "o":
                    style ^= this.#StyleBold;
                    break;
                case "s":
                    style ^= this.#StyleShadowed;
                    break;
                case "w":
                    style |= this.#StyleWide;
                    style &= ~this.#StyleNarrow;
                    break;
                case "n":
                    style |= this.#StyleNarrow;
                    style &= ~this.#StyleWide;
                    break;
                case "l":
                case "h":
                case "p":
                    if (nextLinkToken) {
                        endLink();
                    } else {
                        endText(true);
                        nextLinkToken = { type: "link", manialink: tok === "h", link: "", target: options.linkTarget };
                        if (!options.disableLinks) {
                            tokens.push(nextLinkToken);
                        }
                        isQuickLink = true;
                        isPrettyLink = true;
                        linkLevel = styleStack.length;
                    }
                    break;
                case "z":
                    style = styleStack.length === 0 ? 0 : styleStack[styleStack.length - 1];
                    if (nextLinkToken) {
                        endLink();
                    }
                    break;
                case "m":
                    style &= ~(this.#StyleNarrow | this.#StyleWide);
                    break;
                case "g":
                    style &= styleStack.length === 0 ? ~0x1fff : (styleStack[styleStack.length - 1] | ~0x1fff);
                    break;
                case "<":
                    styleStack.push(style);
                    break;
                case ">":
                    if (styleStack.length !== 0) {
                        style = styleStack.pop();
                        if (nextLinkToken && linkLevel > styleStack.length) {
                            endLink();
                        }
                    }
                    break;
                case "$":
                    nextToken.text += "$";
                    break;
                default:
                    if (/[a-f0-9]/i.test(c)) {
                        color = c;
                    }
                }
                endText();
                isCode = false;
            } else if (c === "$") {
                isCode = true;
                if (isQuickLink && isPrettyLink) {
                    isPrettyLink = false;
                }
            } else if (color) {
                let endColor = false,
                    addChar = false;

                if (/[a-f0-9]/i.test(c)) {
                    color += c.replace(/[^a-f0-9]/gi, "0");
                    endColor = color.length === 3;
                } else {
                    color += "0".repeat(3 - color.length);
                    endColor = true;
                    addChar = true;
                }

                if (endColor) {
                    if (options.lightBackground) {
                        color = this.#invertLight(color);
                    }
                    style &= ~0xfff;
                    style |= this.#StyleColored | (parseInt(color, 16) & 0xfff);
                    endText();
                    color = null;

                    if (addChar) {
                        nextToken.text += c;
                    }
                }
            } else if (isQuickLink && isPrettyLink) {
                if (c === "[") {
                    isQuickLink = false;
                } else {
                    isPrettyLink = false;
                    nextToken.text += c;
                    nextLinkToken.link += c;
                }
            } else if (isPrettyLink) {
                if (c === "]") {
                    isPrettyLink = false;
                } else {
                    nextLinkToken.link += c;
                }
            } else {
                nextToken.text += c;
                if (isQuickLink) {
                    nextLinkToken.link += c;
                }
            }
        }

        if (nextToken.text !== "") {
            tokens.push(nextToken);
        }

        if (nextLinkToken && !options.disableLinks) {
            tokens.push({ type: "linkEnd" });
        }

        return tokens.map((token) => this.#tokenToHtml(token)).join("");
    }

    /**
     * Convert a token to HTML
     * @param {{type?: string, style?: number, text?: string, manialink?: boolean, link?: string}} token
     * @returns {string}
     * @private
     */
    static #tokenToHtml(token) {
        if (token.type === "link") {
            return this.#linkToHtml(token);
        }
        if (token.type === "linkEnd") {
            return "</a>";
        }
        const styleStack = [];
        if (token.style) {
            if (token.style & this.#StyleColored) {
                let color = this.#colorRgb12to24(token.style & 0xfff).toString(16);
                if (color.length === 1) {
                    color = "00000" + color;
                } else if (color.length === 2) {
                    color = "0000" + color;
                } else if (color.length === 4) {
                    color = "00" + color;
                }
                styleStack.push(`color: #${color};`);
            }
            if (token.style & this.#StyleItalic) {
                styleStack.push("font-style:italic;");
            }
            if (token.style & this.#StyleBold) {
                styleStack.push("font-weight:bold;");
            }
            if (token.style & this.#StyleShadowed) {
                styleStack.push("text-shadow:1px 1px 1px rgba(0, 0, 0, 0.5);");
            }
            if (token.style & this.#StyleWide) {
                styleStack.push("letter-spacing:.1em;font-size:105%;");
            } else if (token.style & this.#StyleNarrow) {
                styleStack.push("letter-spacing:-.1em;font-size:95%;");
            }
            return `<span style="${styleStack.join(" ")}">${token.text}</span>`;
        }
        return token.text;
    }

    /**
     * Convert a link token to HTML
     * @param {{manialink: boolean, link: string, target?: string}} token
     * @returns {string}
     * @private
     */
    static #linkToHtml(token) {
        if (token.manialink && !/^maniaplanet:/i.test(token.link)) {
            token.link = "maniaplanet://#manialink=" + token.link;
        }
        if (!token.manialink && !/^https?:/i.test(token.link)) {
            token.link = "http://" + token.link;
        }
        return `<a href="${token.link}"${token.target ? ` target="${token.target}"` : ""}>`;
    }

    /**
     * Convert a 12 bit color to a 24 bit color
     * @param {number} color
     * @returns {number}
     * @private
     */
    static #colorRgb12to24(color) {
        return (color & 0xf00) * 0x1100 + (color & 0xf0) * 0x110 + (color & 0xf) * 0x11;
    }

    /**
     * Invert a light color
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