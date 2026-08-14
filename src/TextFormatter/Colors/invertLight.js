/**
 * Darken a light color for a light background
 * @param {string} hexColor
 * @returns {string}
 */
module.exports = (hexColor) => {
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
};