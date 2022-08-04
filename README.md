# Trackmania Essentials (for Node.js)

[![npm](https://img.shields.io/npm/v/tm-essentials?logo=npm&style=for-the-badge)](https://npmjs.com/tm-essentials)
[![GitHub release](https://img.shields.io/github/v/release/GreepTheSheep/node-tm-essentials?logo=github&style=for-the-badge)](https://github.com/GreepTheSheep/node-tm-essentials/releases/latest)

[![Unit Tests](https://github.com/GreepTheSheep/node-tm-essentials/actions/workflows/test.yml/badge.svg)](https://github.com/GreepTheSheep/node-tm-essentials/actions/workflows/test.yml)

A light-weight library that provides formatting features for Trackmania games.

## Installation

### Node.js
```bash
npm install tm-essentials
```

Then you can retrieve the library with:
```js
const TMEssentials = require('tm-essentials');
```

### Browser
```html
<script src="https://unpkg.com/tm-essentials"></script>
```

Then you can retrieve the library from the global variable `TMEssentials`

## Text formatting

`TextFormatter.deformat()`

```js
let formatted = "$F00T$D01M$C13U$A14.$815K$727r$528a$329z$23By$03CC$03Co$04Bl$059o$068r$077s$085 $094v$0A30$0B1.$0C01";
let deformatted = TextFormatter.deformat(formatted);
console.log(deformatted);

// Output: TMU.KrazyColors v0.1
```

`TextFormatter.formatAnsi()`

Will parse the color formatting and convert it to ANSI escape codes. Works best on console output.

```js
let formatted = "$F00T$D01M$C13U$A14.$815K$727r$528a$329z$23By$03CC$03Co$04Bl$059o$068r$077s$085 $094v$0A30$0B1.$0C01";
let ansiFormat = TextFormatter.formatAnsi(formatted);
console.log(deformatted);
```

This will not deformat basic formatting codes, but you can combine them with `TextFormatter.deformat()` to get the original text.

```js
let formatted = "$F00T$D01M$C13U$A14.$815K$727r$528a$329z$23By$03CC$03Co$04Bl$059o$068r$077s$085 $094v$0A30$0B1.$0C01";
let ansiFormat = TextFormatter.deformat(TextFormatter.formatAnsi(formatted));
console.log(deformatted);
```

## Time formatting

`Time.time` - Total milliseconds as integer value.

`Time.toTmString()`

```js
Time.fromMilliseconds(1337).toTmString(); // "0:01.337"
Time.fromMilliseconds(1337).toTmString(true); // Will use hundredths as output: "0:01.33"

Time.fromSeconds(13.37).toTmString(); // "0:13.370"
Time.fromMinutes(13.37).toTmString(); // "13:37.000"
Time.fromHours(13.37).toTmString(); // "13:37:00.000"

Time.noTime.toTmString(); // "-:--.---"
```

## Accounts formatting

`Accounts.toAccountId()`

```js
Accounts.toAccountId("Jtmn3kBnSSadky_mLNhp_A") // "26d9a7de-4067-4926-9d93-2fe62cd869fc"
```

`Accounts.toLogin()`

```js
Accounts.toLogin("26d9a7de-4067-4926-9d93-2fe62cd869fc") // "Jtmn3kBnSSadky_mLNhp_A"
```

---
# Contributions
<div align="center">

![Alt](https://repobeats.axiom.co/api/embed/59ff028ea5e4dff7d2dba03d499552a6f8c445d5.svg "Repobeats analytics image")

</div>