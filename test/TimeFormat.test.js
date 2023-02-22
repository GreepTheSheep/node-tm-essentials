/* eslint-disable no-undef */
const assert = require('assert'),
    tmessentials = require('../');

describe("Time Formatting", function(){
    it("should convert time to string", function(){
        assert.equal("-0:01.337", tmessentials.Time.fromMilliseconds(-1337).toTmString());
        assert.equal("0:01.337", tmessentials.Time.fromMilliseconds(1337).toTmString());
        assert.equal("0:13.370", tmessentials.Time.fromSeconds(13.370).toTmString());
        assert.equal("13:37.00", tmessentials.Time.fromMinutes(13.37).toTmString(true));
        assert.equal("13:37:00.000", tmessentials.Time.fromHours(13.37).toTmString());
        assert.equal("-:--.---", tmessentials.Time.noTime.toTmString());
    });

    it("should convert time to milliseconds", function(){
        assert.equal(1337, tmessentials.Time.fromMilliseconds(1337).time);
        assert.equal(13370, tmessentials.Time.fromSeconds(13.37).time);
        assert.equal(817000, tmessentials.Time.fromMinutes(13.37).time);
        assert.equal(49020000, tmessentials.Time.fromHours(13.37).time);
        assert.equal(null, tmessentials.Time.noTime.time);
    });
});
