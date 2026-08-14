// Credits to @magnetik for the original HTML parser

const invertLight = require('./Colors/invertLight'),
    styleColored = 0x1000,
    styleItalic = 0x2000,
    styleBold = 0x4000,
    styleShadowed = 0x8000,
    styleWide = 0x20000,
    styleNarrow = 0x40000;

/**
 * Format the text into HTML format
 * @param {string} input
 * @param {{disableLinks?: boolean, lightBackground?: boolean, linkTarget?: string}} [options]
 * @returns {string}
 */
module.exports = (input, options = {}) => {
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
                style ^= styleItalic;
                break;
            case "o":
                style ^= styleBold;
                break;
            case "s":
                style ^= styleShadowed;
                break;
            case "w":
                style |= styleWide;
                style &= ~styleNarrow;
                break;
            case "n":
                style |= styleNarrow;
                style &= ~styleWide;
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
                style &= ~(styleNarrow | styleWide);
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
                    color = invertLight(color);
                }
                style &= ~0xfff;
                style |= styleColored | (parseInt(color, 16) & 0xfff);
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

    return tokens.map((token) => tokenToHtml(token)).join("");
};

/**
 * Convert a token to HTML
 * @param {{type?: string, style?: number, text?: string, manialink?: boolean, link?: string}} token
 * @returns {string}
 */
function tokenToHtml(token) {
    if (token.type === "link") {
        return linkToHtml(token);
    }
    if (token.type === "linkEnd") {
        return "</a>";
    }
    const styleStack = [];
    if (token.style) {
        if (token.style & styleColored) {
            let color = colorRgb12to24(token.style & 0xfff).toString(16);
            if (color.length === 1) {
                color = "00000" + color;
            } else if (color.length === 2) {
                color = "0000" + color;
            } else if (color.length === 4) {
                color = "00" + color;
            }
            styleStack.push(`color: #${color};`);
        }
        if (token.style & styleItalic) {
            styleStack.push("font-style:italic;");
        }
        if (token.style & styleBold) {
            styleStack.push("font-weight:bold;");
        }
        if (token.style & styleShadowed) {
            styleStack.push("text-shadow:1px 1px 1px rgba(0, 0, 0, 0.5);");
        }
        if (token.style & styleWide) {
            styleStack.push("letter-spacing:.1em;font-size:105%;");
        } else if (token.style & styleNarrow) {
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
 */
function linkToHtml(token) {
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
 */
function colorRgb12to24(color) {
    return (color & 0xf00) * 0x1100 + (color & 0xf0) * 0x110 + (color & 0xf) * 0x11;
}