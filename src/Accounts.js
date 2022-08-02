class Accounts {

    /**
     * Transform a player login to its account uuid. Returns null if the login is invalid.
     * @param {string} login
     * @returns {string|null}
     */
    static toAccountId(login) {
        if (login.length != 22) return null;

        var bytes = atob(login
            .replace(/-/g, '+')
            .replace(/_/g, '/')
        );

        var ret = '';
        for (var i = 0; i < bytes.length; i++) {
            if (i == 4 || i == 6 || i == 8 || i == 10) {
                ret += '-';
            }
            ret += bytes.charCodeAt(i).toString(16);
        }
        return ret;
    }

    /**
     * Transform a player account uuid to its login.
     * @param {string} accountId
     * @returns {string}
     */
    static toLogin(accountId) {
        var chars = accountId.replace(/-/g, '');

        var bytes = '';
        for (var i = 0; i < chars.length; i += 2) {
            var hex = chars.substr(i, 2);
            var dec = parseInt(hex, 16);
            var byte = String.fromCharCode(dec);
            bytes += byte;
        }

        return btoa(bytes)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    }
}

module.exports = Accounts;