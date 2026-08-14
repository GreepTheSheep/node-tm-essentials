# Trackmania Essentials (for Node.js)

[![GitHub release](https://img.shields.io/github/v/release/GreepTheSheep/node-tm-essentials?label=GitHub%20Release&logo=github&style=for-the-badge)](https://github.com/GreepTheSheep/node-tm-essentials/releases/latest)

[![npm](https://img.shields.io/npm/v/tm-essentials?logo=npm&style=for-the-badge)](https://npmjs.com/tm-essentials) [![NPM Size](https://img.shields.io/bundlephobia/min/tm-essentials?label=Package%20Size&logo=npm&style=for-the-badge&color=darkgreen)](https://npmjs.com/tm-essentials)

[![Unit Tests](https://github.com/GreepTheSheep/node-tm-essentials/actions/workflows/test.yml/badge.svg)](https://github.com/GreepTheSheep/node-tm-essentials/actions/workflows/test.yml)

A light-weight library that provides formatting features for Trackmania games.

# Installation

## Node.js
```bash
npm install tm-essentials
```

Then you can retrieve the library with:
```js
const TMEssentials = require('tm-essentials');
```

## Browser
```html
<script src="https://unpkg.com/tm-essentials"></script>
```

Then you can retrieve the library from the global variable `TMEssentials`

# Methods & properties

## Text formatting

### `TextFormatter.formatCodesRegex`

RegExp to match all the formatting codes

### `TextFormatter.colorCodesRegex`

RegExp to match all the color formatting codes

### `TextFormatter.deformat()`

Deformat the text

```js
let formatted = "$F00T$D01M$C13U$A14.$815K$727r$528a$329z$23By$03CC$03Co$04Bl$059o$068r$077s$085 $094v$0A30$0B1.$0C01";
let deformatted = TextFormatter.deformat(formatted);
console.log(deformatted);

// Output: TMU.KrazyColors v0.1
```

### `TextFormatter.formatAnsi()`

Will parse the color formatting and convert it to ANSI escape codes. Works best on console output.

```js
let formatted = "$l[https://kc.jfreu.com/]$F00T$D01M$C13U$A14.$815K$727r$528a$329z$23By$03CC$03Co$04Bl$059o$068r$077s$085$l $094v$0A30$0B1.$0C01";
let ansiFormat = TextFormatter.formatAnsi(formatted);
console.log(ansiFormat);
```

You can also pass some options in it:

- `disableLinks`: will disable links to external sites (false by default)
- `lightBackground`: adapt color to be visible on light backgrounds (false by default)

```js
let formatted = "$l[https://kc.jfreu.com/]$F00T$D01M$C13U$A14.$815K$727r$528a$329z$23By$03CC$03Co$04Bl$059o$068r$077s$085$l $094v$0A30$0B1.$0C01";
let ansiFormat = TextFormatter.formatAnsi(formatted, {
  disableLinks: true,
  lightBackground: true
});
console.log(ansiFormat);
```

### `TextFormatter.formatHtml()`

This is a port of the original [Maniaplanet style parser](https://github.com/maniaplanet/maniaplanet-style-js-parser) written in pure JS. *Copyright © 2012 - 2026 Nadeo & Baptiste Lafontaine*

```js
let formatted = "$l[https://kc.jfreu.com]$F00T$D01M$C13U$A14.$815K$727r$528a$329z$23By$03CC$03Co$04Bl$059o$068r$077s$085$l $094v$0A30$0B1.$0C01";
let htmlFormat = TextFormatter.formatHtml(formatted);
document.querySelector("#result").innerHTML = htmlFormat;
```

You can also pass some options in it:

- `disableLinks`: will disable links to external sites (false by default)
- `lightBackground`: adapt color to be visible on light backgrounds (false by default)
- `linkTarget`: add a `target` attribute into links

```js
let formatted = "$l[https://kc.jfreu.com]$F00T$D01M$C13U$A14.$815K$727r$528a$329z$23By$03CC$03Co$04Bl$059o$068r$077s$085$l $094v$0A30$0B1.$0C01";
let htmlFormat = TextFormatter.formatHtml(formatted, {
  disableLinks: true,
  lightBackground: true
});
document.querySelector("#result").innerHTML = htmlFormat;
```

```js
let formatted = "$l[https://greep.fr]Open this link to a new tab$l with the target attribute";
let htmlFormat = TextFormatter.formatHtml(formatted, {
  linkTarget: "_blank"
});
document.querySelector("#result").innerHTML = htmlFormat;
```

## Time formatting

```js
Time.fromMilliseconds(1337).toTmString(); // "0:01.337"
Time.fromMilliseconds(1337).toTmString(true); // Will use hundredths as output: "0:01.33"

Time.fromSeconds(13.37).toTmString(); // "0:13.370"
Time.fromMinutes(13.37).toTmString(); // "13:37.000"
Time.fromHours(13.37).toTmString(); // "13:37:00.000"

Time.noTime.toTmString(); // "-:--.---"
```

### TimeSpan

TimeSpan will return a [`Time` class](#time-class) when one of `noTime` property or thoses methods is used:

- `Time.noTime`
- `Time.fromMilliseconds()`
- `Time.fromSeconds()`
- `Time.fromMinutes()`
- `Time.fromHours()`

### Time class

`Time.time` - Total milliseconds as integer value.

`Time.toTmString()` - Outputs the time to a formatted Trackmania-like string

## Accounts formatting

### `Accounts.toAccountId()`

```js
Accounts.toAccountId("Jtmn3kBnSSadky_mLNhp_A") // "26d9a7de-4067-4926-9d93-2fe62cd869fc"
```

### `Accounts.toLogin()`

```js
Accounts.toLogin("26d9a7de-4067-4926-9d93-2fe62cd869fc") // "Jtmn3kBnSSadky_mLNhp_A"
```

---
# Contributions
<div align="center">

![Alt](https://repobeats.axiom.co/api/embed/59ff028ea5e4dff7d2dba03d499552a6f8c445d5.svg "Repobeats analytics image")

</div>