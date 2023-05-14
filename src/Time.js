class Time {
    /**
     * Trackmania Time formatters.
     * @param {number|null} time Time in milliseconds
     */
    constructor(time) {
        /**
         * Time in milliseconds
         * @type {number|null}
         */
        this.time = time;
    }

    /**
     * Output the time in the format "hh:mm:ss.ms"
     * @param {boolean} useHundreds If true, return the time in the hundreds of milliseconds
     * @returns {string}
     */
    toTmString(useHundreds = false) {
        let output = "";
        if (this.time == null) {
            output = "-:--.---";
        } else {
            if (Math.sign(this.time) == -1) output += "-";
            this.time = Math.abs(this.time);

            let ms = this.time % 1000,
                s = Math.floor(this.time / 1000) % 60,
                m = Math.floor(this.time / 60000) % 60,
                h = Math.floor(this.time / 3600000);

            if (ms < 10) ms = "00" + ms;
            else if (ms < 100) ms = "0" + ms;

            if (h > 0) output += Math.floor(h) + ":";
            output += Math.floor(m).toString().padStart(m < 10 ? 1 : 2, '0') + ":";
            output += Math.floor(s).toString().padStart(2, '0') + ".";
            output += Math.floor(ms).toString().padStart(3, '0');
        }

        if (useHundreds) output = output.substring(0, output.length - 1);

        return output;
    }
}

class TimeSpan {
    /**
     * Returns the {@link Time} class with a null value.
     * @returns {Time} {@link Time}
     */
    static noTime = new Time(null);

    /**
     * Returns the {@link Time} class with a value in milliseconds.
     * @param {number} ms
     * @returns {Time} {@link Time}
     */
    static fromMilliseconds(ms) {
        return new Time(ms);
    }

    /**
     * Returns the {@link Time} class with a value in seconds. All numbers after the decimal point are parsed as milliseconds.
     * @param {number} s
     * @returns {Time} {@link Time}
     */
    static fromSeconds(s) {
        return new Time(s * 1000);
    }

    /**
     * Returns the {@link Time} class with a value in minutes. All numbers after the decimal point are parsed as seconds.
     * @param {Number} m
     * @returns {Time} {@link Time}
     */
    static fromMinutes(m) {
        let numberAfterDecimal = 0;
        if (!Number.isInteger(m)) numberAfterDecimal = m.toString().split('.')[1].length;

        let minutes = Math.floor(m),
            seconds = Number(((m - minutes) * Math.pow(10, numberAfterDecimal)).toFixed(0));
        return new Time(seconds * 1000 + minutes * 60000);
    }

    /**
     * Returns the {@link Time} class with a value in hours. All numbers after the decimal point are parsed as minutes.
     * @param {Number} h
     * @returns {Time} {@link Time}
     */
    static fromHours(h) {
        let numberAfterDecimal = 0;
        if (!Number.isInteger(h)) numberAfterDecimal = h.toString().split('.')[1].length;

        let hours = Math.floor(h),
            minutes = Number(((h - hours) * Math.pow(10, numberAfterDecimal)).toFixed(0));
        return new Time(minutes * 60000 + hours * 3600000);
    }
}

module.exports = TimeSpan;
