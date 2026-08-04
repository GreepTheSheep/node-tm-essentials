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

    it("should convert a set of real logins to account ids and back", function(){
        const cases = {
            "Ci0bwEqqQ3Sy2z1WG9qxyQ": "0a2d1bc0-4aaa-4374-b2db-3d561bdab1c9",
            "BiC3-GdBTzaUQxlcSw-qbQ": "0620b7f8-6741-4f36-9443-195c4b0faa6d",
            "W2ZNWNzVQV6z3hXuNgRMRg": "5b664d58-dcd5-415e-b3de-15ee36044c46",
            "QnYsgoh-TjiJMb1Kv6d2qQ": "42762c82-887e-4e38-8931-bd4abfa776a9",
            "c5jutptORLinoaIUmVWscA": "7398eeb6-9b4e-44b8-a7a1-a2149955ac70",
            "pTuyJG9STcCN_11BiU3t0Q": "a53bb224-6f52-4dc0-8dff-5d41894dedd1",
        };
        for (const [login, accountId] of Object.entries(cases)) {
            assert.equal(accountId, tmessentials.Accounts.toAccountId(login));
            assert.equal(login, tmessentials.Accounts.toLogin(accountId));
        }
    });

    it("should round-trip account ids with low bytes", function(){
        assert.equal("00010203-0405-0607-0809-0a0b0c0d0e0f", tmessentials.Accounts.toAccountId(tmessentials.Accounts.toLogin("00010203-0405-0607-0809-0a0b0c0d0e0f")));
        assert.equal("5b664d58-dcd5-415e-b3de-15ee36044c46", tmessentials.Accounts.toAccountId(tmessentials.Accounts.toLogin("5b664d58-dcd5-415e-b3de-15ee36044c46")));
    });

    it("should round-trip a set of real logins to logins", function(){
        const logins = [
            "Ci0bwEqqQ3Sy2z1WG9qxyQ",
            "BiC3-GdBTzaUQxlcSw-qbQ",
            "W2ZNWNzVQV6z3hXuNgRMRg",
            "QnYsgoh-TjiJMb1Kv6d2qQ",
            "c5jutptORLinoaIUmVWscA",
            "pTuyJG9STcCN_11BiU3t0Q",
        ];
        for (const login of logins) {
            assert.equal(login, tmessentials.Accounts.toLogin(tmessentials.Accounts.toAccountId(login)));
        }
    });
});