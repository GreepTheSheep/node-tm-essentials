/* eslint-disable no-undef */
const assert = require('assert'),
    tmessentials = require('../');

describe("Text Formatting", function(){
    it("should deformat text", function(){
        assert.equal("Hello World!", tmessentials.TextFormatter.deformat("$f08Hello$z$s $5f8$w$oWorld$z$w!"));
        assert.equal("small bold text", tmessentials.TextFormatter.deformat("$0f0$nsmall$z$s $5f0$wbold$z $539text"));
    });
});