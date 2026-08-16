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
            "\u001b[38;2;255;255;0mHello \u001b[38;2;0;255;255mWorld\u001b[38;2;255;255;255m! \u001b[38;2;0;0;0mI'm \u001b[38;2;255;255;255ma \u001b[38;2;0;0;255mBlue \u001b[38;2;255;0;0mRed \u001b[38;2;0;255;0mGreen \u001b[39m\u001b[22m\u001b[23mText \u001b[38;2;255;255;0mWide\u001b[39m\u001b[22m\u001b[23m",
            tmessentials.TextFormatter.formatAnsi("$ff0Hello $0ffWorld$fff! $000I'm $fffa $00fBlue $f00Red $0f0Green $zText $ff0$wWide")
        );

        assert.equal(
            "\u001b[1m\u001b[38;2;255;0;0mT\u001b[38;2;221;0;17mM\u001b[38;2;204;17;51mU\u001b[38;2;170;17;68m.\u001b[38;2;136;17;85mK\u001b[38;2;119;34;119mr\u001b[38;2;85;34;136ma\u001b[38;2;51;34;153mz\u001b[38;2;34;51;187my\u001b[38;2;0;51;204mC\u001b[38;2;0;51;204mo\u001b[38;2;0;68;187ml\u001b[38;2;0;85;153mo\u001b[38;2;0;102;136mr\u001b[38;2;0;119;119ms\u001b[38;2;0;136;85m \u001b[38;2;0;153;68mv\u001b[38;2;0;170;51m0\u001b[38;2;0;187;17m.\u001b[38;2;0;204;0m1\u001b[39m\u001b[22m\u001b[23m",
            tmessentials.TextFormatter.formatAnsi("$w$o$F00T$D01M$C13U$A14.$815K$727r$528a$329z$23By$03CC$03Co$04Bl$059o$068r$077s$085 $094v$0A30$0B1.$0C01")
        );
    });

    it("should format short color codes with ANSI escape codes", function(){
        assert.equal(
            "\u001b[38;2;255;0;0mRed \u001b[38;2;0;255;0mGreen \u001b[38;2;0;0;255mBlue \u001b[38;2;255;255;0mYellow \u001b[38;2;255;0;0mRed\u001b[39m\u001b[22m\u001b[23m",
            tmessentials.TextFormatter.formatAnsi("$fRed $0fGreen $00fBlue $ffYellow $f0Red")
        );
    });

    it("should format bold and italic text with ANSI escape codes", function(){
        assert.equal(
            "\u001b[1mBold \u001b[3mBold Italic\u001b[39m\u001b[22m\u001b[23m Normal\u001b[39m\u001b[22m\u001b[23m",
            tmessentials.TextFormatter.formatAnsi("$oBold $iBold Italic$z Normal")
        );
    });

    it("should format forced uppercase text with ANSI escape codes", function(){
        assert.equal(
            "\u001b[38;2;255;255;0mHELLO\u001b[39m\u001b[22m\u001b[23m world\u001b[39m\u001b[22m\u001b[23m",
            tmessentials.TextFormatter.formatAnsi("$ff0$tHello$z world")
        );
    });

    it("should drop width formatting codes from ANSI output", function(){
        assert.equal(
            "WideNormal\u001b[39m\u001b[22m\u001b[23m",
            tmessentials.TextFormatter.formatAnsi("$wWide$mNormal")
        );
    });

    it("should support uppercase variants of the formatting codes", function(){
        assert.equal(
            "\u001b[1mBold \u001b[3mBold Italic\u001b[39m\u001b[22m\u001b[23m Normal\u001b[39m\u001b[22m\u001b[23m",
            tmessentials.TextFormatter.formatAnsi("$OBold $IBold Italic$Z Normal")
        );

        assert.equal(
            "\u001b[38;2;255;0;0mRed HELLO\u001b[39mGREEN\u001b[39m\u001b[22m\u001b[23m",
            tmessentials.TextFormatter.formatAnsi("$F00Red $W$THeLLo$M$Ggreen")
        );

        assert.equal(
            "\u001b]8;;https://trackmania.com/\u001b\\Trackmania\u001b]8;;\u001b\\\u001b[39m\u001b[22m\u001b[23m",
            tmessentials.TextFormatter.formatAnsi("$L[https://trackmania.com/]Trackmania$L")
        );
    });

    it("should reset the color but keep the style on $g", function(){
        assert.equal(
            "\u001b[1m\u001b[38;2;255;0;0mRed \u001b[39mstill bold\u001b[39m\u001b[22m\u001b[23m",
            tmessentials.TextFormatter.formatAnsi("$o$f00Red $gstill bold")
        );
    });

    it("should format short links with OSC 8 hyperlinks", function(){
        assert.equal(
            "\u001b]8;;https://trackmania.com/\u001b\\https://trackmania.com/\u001b]8;;\u001b\\\u001b[39m\u001b[22m\u001b[23m",
            tmessentials.TextFormatter.formatAnsi("$lhttps://trackmania.com/$l")
        );
    });

    it("should format explicit links with OSC 8 hyperlinks", function(){
        assert.equal(
            "\u001b]8;;https://trackmania.com/\u001b\\Trackmania\u001b]8;;\u001b\\\u001b[39m\u001b[22m\u001b[23m",
            tmessentials.TextFormatter.formatAnsi("$l[https://trackmania.com/]Trackmania$l")
        );
    });

    it("should format manialinks with OSC 8 hyperlinks", function(){
        assert.equal(
            "\u001b]8;;manialink:example\u001b\\Menu\u001b]8;;\u001b\\\u001b[39m\u001b[22m\u001b[23m",
            tmessentials.TextFormatter.formatAnsi("$l[manialink:example]Menu$l")
        );
    });

    it("should keep the color inside a link and close it on $z", function(){
        assert.equal(
            "\u001b[38;2;255;0;0m\u001b]8;;https://trackmania.com/\u001b\\Red\u001b]8;;\u001b\\\u001b[39m\u001b[22m\u001b[23m\u001b[39m\u001b[22m\u001b[23m",
            tmessentials.TextFormatter.formatAnsi("$f00$l[https://trackmania.com/]Red$z")
        );
    });

    it("should disable OSC 8 hyperlinks with the disableLinks option", function(){
        assert.equal(
            "Trackmania\u001b[39m\u001b[22m\u001b[23m",
            tmessentials.TextFormatter.formatAnsi("$l[https://trackmania.com/]Trackmania$l", { disableLinks: true })
        );

        assert.equal(
            "https://trackmania.com/\u001b[39m\u001b[22m\u001b[23m",
            tmessentials.TextFormatter.formatAnsi("$lhttps://trackmania.com/$l", { disableLinks: true })
        );
    });

    it("should darken light colors on light backgrounds", function(){
        assert.equal(
            "\u001b[38;2;68;68;255mHello\u001b[39m\u001b[22m\u001b[23m",
            tmessentials.TextFormatter.formatAnsi("$ff0Hello", { lightBackground: true })
        );

        assert.equal(
            "\u001b[38;2;0;0;0mBlack\u001b[39m\u001b[22m\u001b[23m",
            tmessentials.TextFormatter.formatAnsi("$000Black", { lightBackground: true })
        );
    });

    it("should format colors with 8-bit ANSI escape codes", function(){
        assert.equal(
            "\u001b[38;5;226mHello \u001b[38;5;51mWorld\u001b[38;5;231m! \u001b[38;5;16mI'm \u001b[38;5;231ma \u001b[38;5;21mBlue \u001b[38;5;196mRed \u001b[38;5;46mGreen \u001b[39m\u001b[22m\u001b[23mText \u001b[38;5;226mWide\u001b[39m\u001b[22m\u001b[23m",
            tmessentials.TextFormatter.formatAnsi("$ff0Hello $0ffWorld$fff! $000I'm $fffa $00fBlue $f00Red $0f0Green $zText $ff0$wWide", { colorDepth: "8bit" })
        );
    });

    it("should format colors with 4-bit ANSI escape codes", function(){
        assert.equal(
            "\u001b[93mHello \u001b[96mWorld\u001b[97m! \u001b[30mI'm \u001b[97ma \u001b[94mBlue \u001b[91mRed \u001b[92mGreen \u001b[39m\u001b[22m\u001b[23mText \u001b[93mWide\u001b[39m\u001b[22m\u001b[23m",
            tmessentials.TextFormatter.formatAnsi("$ff0Hello $0ffWorld$fff! $000I'm $fffa $00fBlue $f00Red $0f0Green $zText $ff0$wWide", { colorDepth: "4bit" })
        );
    });

    it("should drop colors but keep the style with the disableColor option", function(){
        assert.equal(
            "Hello \u001b[1mBold\u001b[22m\u001b[23m",
            tmessentials.TextFormatter.formatAnsi("$ff0Hello $oBold", { disableColor: true })
        );

        assert.equal(
            "\u001b[1mBold\u001b[22m\u001b[23m Normal\u001b[22m\u001b[23m",
            tmessentials.TextFormatter.formatAnsi("$o$ff0Bold$z Normal", { disableColor: true })
        );
    });

    it("should format text with ANSI escape codes + deformat", function(){
        assert.equal(
            "\u001b[38;2;255;255;0mHello \u001b[38;2;0;255;255mWorld\u001b[38;2;255;255;255m! \u001b[38;2;0;0;0mI'm \u001b[38;2;255;255;255ma \u001b[38;2;0;0;255mBlue \u001b[38;2;255;0;0mRed \u001b[38;2;0;255;0mGreen \u001b[39m\u001b[22m\u001b[23mText \u001b[38;2;255;255;0mWide\u001b[39m\u001b[22m\u001b[23m",
            tmessentials.TextFormatter.deformat(
                tmessentials.TextFormatter.formatAnsi("$ff0Hello $0ffWorld$fff! $000I'm $fffa $00fBlue $f00Red $0f0Green $zText $ff0$wWide")
            )
        );

        assert.equal(
            "\u001b[1m\u001b[38;2;255;0;0mT\u001b[38;2;221;0;17mM\u001b[38;2;204;17;51mU\u001b[38;2;170;17;68m.\u001b[38;2;136;17;85mK\u001b[38;2;119;34;119mr\u001b[38;2;85;34;136ma\u001b[38;2;51;34;153mz\u001b[38;2;34;51;187my\u001b[38;2;0;51;204mC\u001b[38;2;0;51;204mo\u001b[38;2;0;68;187ml\u001b[38;2;0;85;153mo\u001b[38;2;0;102;136mr\u001b[38;2;0;119;119ms\u001b[38;2;0;136;85m \u001b[38;2;0;153;68mv\u001b[38;2;0;170;51m0\u001b[38;2;0;187;17m.\u001b[38;2;0;204;0m1\u001b[39m\u001b[22m\u001b[23m",
            tmessentials.TextFormatter.deformat(
                tmessentials.TextFormatter.formatAnsi("$w$o$F00T$D01M$C13U$A14.$815K$727r$528a$329z$23By$03CC$03Co$04Bl$059o$068r$077s$085 $094v$0A30$0B1.$0C01")
            )
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
});