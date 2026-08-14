/* eslint-disable no-undef */
const assert = require('assert'),
    tmessentials = require('../src/index');

describe("Text Formatting", function(){
    it("should deformat text", function(){
        assert.equal("Hello World!", tmessentials.TextFormatter.deformat("$f08Hello$z$s $5f8$w$oWorld$z$w!"));
        assert.equal("small bold text", tmessentials.TextFormatter.deformat("$0f0$nsmall$z$s $5f0$wbold$z $539text"));
    });

    it("should format text with ANSI escape codes", function(){
        assert.equal(
            "\u001b[38;2;255;255;0mHello \u001b[38;2;0;255;255mWorld\u001b[38;2;255;255;255m! \u001b[38;2;0;0;0mI'm \u001b[38;2;255;255;255ma \u001b[38;2;0;0;255mBlue \u001b[38;2;255;0;0mRed \u001b[38;2;0;255;0mGreen \u001b[39m\u001b[22mText \u001b[38;2;255;255;0m$wWide\u001b[39m\u001b[22m",
            tmessentials.TextFormatter.formatAnsi("$ff0Hello $0ffWorld$fff! $000I'm $fffa $00fBlue $f00Red $0f0Green $zText $ff0$wWide")
        );

        assert.equal(
            "$w$o\u001b[38;2;255;0;0mT\u001b[38;2;221;0;17mM\u001b[38;2;204;17;51mU\u001b[38;2;170;17;68m.\u001b[38;2;136;17;85mK\u001b[38;2;119;34;119mr\u001b[38;2;85;34;136ma\u001b[38;2;51;34;153mz\u001b[38;2;34;51;187my\u001b[38;2;0;51;204mC\u001b[38;2;0;51;204mo\u001b[38;2;0;68;187ml\u001b[38;2;0;85;153mo\u001b[38;2;0;102;136mr\u001b[38;2;0;119;119ms\u001b[38;2;0;136;85m \u001b[38;2;0;153;68mv\u001b[38;2;0;170;51m0\u001b[38;2;0;187;17m.\u001b[38;2;0;204;0m1\u001b[39m\u001b[22m",
            tmessentials.TextFormatter.formatAnsi("$w$o$F00T$D01M$C13U$A14.$815K$727r$528a$329z$23By$03CC$03Co$04Bl$059o$068r$077s$085 $094v$0A30$0B1.$0C01")
        );
    });

    it("should format text to HTML", function(){
        assert.equal("foo", tmessentials.TextFormatter.formatHtml("foo"));
        assert.equal('<span style="font-weight:bold;">tag</span>', tmessentials.TextFormatter.formatHtml("$otag"));
        assert.equal("hi there", tmessentials.TextFormatter.formatHtml("$uhi there"));
        assert.equal('<span style="color: #ff0000;">Red</span>', tmessentials.TextFormatter.formatHtml("$f00Red"));
        assert.equal('<span style="color: #ff0000;">Red</span>', tmessentials.TextFormatter.formatHtml("$fRed"));
    });

    it("should format links to HTML", function(){
        assert.equal(
            '<a href="http://maniaplanet.com">trackmania.com</a>',
            tmessentials.TextFormatter.formatHtml("$l[http://maniaplanet.com]trackmania.com$l")
        );
        assert.equal(
            '<a href="http://maniaplanet.com">http://maniaplanet.com</a>',
            tmessentials.TextFormatter.formatHtml("$lhttp://maniaplanet.com$l")
        );
        assert.equal(
            '<a href="http://maniaplanet.com">http://maniaplanet.com</a>',
            tmessentials.TextFormatter.formatHtml("$lhttp://maniaplanet.com")
        );
        assert.equal("", tmessentials.TextFormatter.formatHtml("$l[www.clan-nuitblanche.org]$fff$l"));
        assert.equal(
            '<a href="http://maniaplanet.com">maniaplanet</a>',
            tmessentials.TextFormatter.formatHtml("$l[maniaplanet.com]maniaplanet$l")
        );
        assert.equal(
            '<a href="https://maniaplanet.com">maniaplanet</a>',
            tmessentials.TextFormatter.formatHtml("$l[https://maniaplanet.com]maniaplanet$l")
        );
        assert.equal(
            '<a href="http://maniaplanet.com" target="_blank">maniaplanet</a>',
            tmessentials.TextFormatter.formatHtml("$l[maniaplanet.com]maniaplanet$l", { linkTarget: "_blank" })
        );
        assert.equal(
            '<a href="maniaplanet://#manialink=maniaflash">ManiaFlash</a>',
            tmessentials.TextFormatter.formatHtml("$h[maniaflash]ManiaFlash$h")
        );
    });

    it("should format text to HTML with options", function(){
        assert.equal("maniaplanet.com", tmessentials.TextFormatter.formatHtml("$lmaniaplanet.com", { disableLinks: true }));
        assert.equal("Maniaplanet", tmessentials.TextFormatter.formatHtml("$l[maniaplanet.com]Maniaplanet", { disableLinks: true }));
        assert.equal('<span style="color: #444444;">Text</span>', tmessentials.TextFormatter.formatHtml("$fffText", { lightBackground: true }));
    });

    it("should format text with ANSI escape codes + deformat", function(){
        assert.equal(
            "\u001b[38;2;255;255;0mHello \u001b[38;2;0;255;255mWorld\u001b[38;2;255;255;255m! \u001b[38;2;0;0;0mI'm \u001b[38;2;255;255;255ma \u001b[38;2;0;0;255mBlue \u001b[38;2;255;0;0mRed \u001b[38;2;0;255;0mGreen \u001b[39m\u001b[22mText \u001b[38;2;255;255;0mWide\u001b[39m\u001b[22m",
            tmessentials.TextFormatter.deformat(
                tmessentials.TextFormatter.formatAnsi("$ff0Hello $0ffWorld$fff! $000I'm $fffa $00fBlue $f00Red $0f0Green $zText $ff0$wWide")
            )
        );

        assert.equal(
            "\u001b[38;2;255;0;0mT\u001b[38;2;221;0;17mM\u001b[38;2;204;17;51mU\u001b[38;2;170;17;68m.\u001b[38;2;136;17;85mK\u001b[38;2;119;34;119mr\u001b[38;2;85;34;136ma\u001b[38;2;51;34;153mz\u001b[38;2;34;51;187my\u001b[38;2;0;51;204mC\u001b[38;2;0;51;204mo\u001b[38;2;0;68;187ml\u001b[38;2;0;85;153mo\u001b[38;2;0;102;136mr\u001b[38;2;0;119;119ms\u001b[38;2;0;136;85m \u001b[38;2;0;153;68mv\u001b[38;2;0;170;51m0\u001b[38;2;0;187;17m.\u001b[38;2;0;204;0m1\u001b[39m\u001b[22m",
            tmessentials.TextFormatter.deformat(
                tmessentials.TextFormatter.formatAnsi("$w$o$F00T$D01M$C13U$A14.$815K$727r$528a$329z$23By$03CC$03Co$04Bl$059o$068r$077s$085 $094v$0A30$0B1.$0C01")
            )
        );
    });
});