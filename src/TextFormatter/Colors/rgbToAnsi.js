const ansi16 = [
    [0, 0, 0],
    [128, 0, 0],
    [0, 128, 0],
    [128, 128, 0],
    [0, 0, 128],
    [128, 0, 128],
    [0, 128, 128],
    [192, 192, 192],
    [128, 128, 128],
    [255, 0, 0],
    [0, 255, 0],
    [255, 255, 0],
    [0, 0, 255],
    [255, 0, 255],
    [0, 255, 255],
    [255, 255, 255]
];

/**
 * Convert an RGB color to an ANSI escape code for the given color depth
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @param {"4bit"|"8bit"|"24bit"} [depth]
 * @returns {string}
 */
module.exports = (r, g, b, depth = "24bit") => {
    if (depth == "4bit") {
        let best = 0,
            bestDist = Infinity;
        for (let i = 0; i < ansi16.length; i++) {
            let dr = r - ansi16[i][0],
                dg = g - ansi16[i][1],
                db = b - ansi16[i][2],
                dist = dr * dr + dg * dg + db * db;
            if (dist < bestDist) {
                bestDist = dist;
                best = i;
            }
        }
        return "\x1B[" + (best < 8 ? 30 + best : 90 + best - 8) + "m";
    } else if (depth == "8bit") {
        let index;
        if (r == g && g == b) {
            if (r < 8) {
                index = 16;
            } else if (r > 248) {
                index = 231;
            } else {
                index = Math.round(((r - 8) / 247) * 24) + 232;
            }
        } else {
            let ri = Math.round(r / 255 * 5),
                gi = Math.round(g / 255 * 5),
                bi = Math.round(b / 255 * 5);
            index = 16 + 36 * ri + 6 * gi + bi;
        }
        return "\x1B[38;5;" + index + "m";
    }
    return "\x1B[38;2;" + r + ";" + g + ";" + b + "m";
};
