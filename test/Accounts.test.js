/* eslint-disable no-undef */
const assert = require('assert'),
    tmessentials = require('../');

describe("Accounts", function(){
    it("should convert account id to login", function(){
        assert.equal("Jtmn3kBnSSadky_mLNhp_A", tmessentials.Accounts.toLogin("26d9a7de-4067-4926-9d93-2fe62cd869fc"));
        assert.equal("0jcqCKihRsuX-yOhYdha0A", tmessentials.Accounts.toLogin("d2372a08-a8a1-46cb-97fb-23a161d85ad0"));
    });

    it("should convert login to account id", function(){
        assert.equal("26d9a7de-4067-4926-9d93-2fe62cd869fc", tmessentials.Accounts.toAccountId("Jtmn3kBnSSadky_mLNhp_A"));
        assert.equal("afe7e1c1-7086-48f7-bde9-a7e320647510", tmessentials.Accounts.toAccountId("r-fhwXCGSPe96afjIGR1EA"));
    });
});