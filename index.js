// Polyfill to support ES3 (IE6)
require('./polyfills/index.js')

function trimTrailingChars(s, string) {
    return s.replace(RegExp("(" + string + "){2,}", "g"), string);
}
var defaultNormalizeForm = "NFC"
var acceptedRemove = ['non-printable-ascii', 'punctuation', 'whitespace'];

/**
 * Check if the given string is a valid palindrome
 *
 * @param {*} str String to check, it's not a valid string, the function will try to convert it, or will throws an exception
 * @param {Object} [options={
 *     exception: false, // Inform the function to throw exceptions or not
 *     normalize: false, // Inform the function to normalize string or not
 *     normalizeForm: "NFC", // The form being used to normalize string (if normalize === true), must be one of ["NFC", "NFD", "NFKC", "NFKD"], otherwise a exception will be thrown or the normalization will be omitted
 *     trim: "none", // Trim mode: support [none, start (trim left), end (trim right), both]
 *     trimTrailing: undefined, // Trim trailing string, can be string or array of string, otherwise a exception will be thrown or the function wil convert it to a string
 *     caseSensitive: true, // Indicate the case sensitivity of the function
 *     remove: [], // Remove some kind of char from the string, supported: "non-printable-ascii", "punctuation", "whitespace"
 * }]
 * @param {Boolean} debug debug_mode
 * @return {Boolean} - True if it is a valid palindrome that match out options, otherwise False
 */
function isPalindrome(str, options = {
    exception: false,
    asciiOnly: true,
    normalize: false,
    normalizeForm: defaultNormalizeForm,
    trim: "none",
    trimTrailing: undefined,
    caseSensitive: true,
    remove: [],
}, debug = false) {
    // coverage ignore next line
    if (debug) console.log("String before modification:", str);

    // coverage ignore next line
    if (debug) console.log("Options:", options);

    // Perform string checking, string modification based on options -----------

    // Checking the first argument
    if (typeof str !== 'string' && options.exception === true) throw TypeError("First argument must be a string");
    else str = String(str);

    // Normalize string
    if (options.normalize === true) {
        try {
            str = str.normalize(options.normalizeForm);

            // coverage ignore next line
            if (debug) console.log("Normalized in form of " + (options.normalizeForm || defaultNormalizeForm) + ":", str);
        }
        catch (e) {
            if (options.exception === true) throw e;
        }
    }

    // Remove

    if (!options.remove) options.remove = [];

    if (typeof options.remove !== 'string' && !Array.isArray(options.remove)) {
        if (options.exception === true) {
            throw new RangeError("remove must be a string or an array of strings of accepted mode " + acceptedRemove, );
        } else {
            options.remove = [String(options.remove)];
        }
    } else if (typeof options.remove === 'string') options.remove = [options.remove];

    if (options.remove.some(i => !acceptedRemove.includes(i))) {
        throw new RangeError("remove must be a string or an array of strings of accepted mode " + acceptedRemove);
    }

    for (var i = 0; i < options.remove.length; i++) {
        switch (options.remove[i]) {
            case acceptedRemove[0]: // non-printable-ascii
                str = str.replace(/[^\x20-\x7E]/g, '');
                break;
            case acceptedRemove[1]: // punctuation
                str = str.replace(/[~`!@#$%^&*(){}\[\];:"'<,.>?\/\\|_+=-]/g,"");
                break;
            case acceptedRemove[2]: // whitespace
                str = str.replace(/\s/g, "");
                break;
            default:
        }
    }

    // Transform string to lower case if necessary
    if (options.caseSensitive !== true) str = str.toLowerCase();

    // Trim string
    switch (options.trim) {
        case "start":
            str = str.trimStart();
            break;
        case "end":
            str = str.trimEnd();
            break;
        case "both":
            str = str.trim();
            break;
        default:
    }

    if (options.trimTrailing !== undefined) {
        if (typeof options.trimTrailing !== 'string' || (Array.isArray(options.trimTrailing) && options.trimTrailing.some(i => typeof i !== 'string'))) {
            if (options.exception === true) {
                throw new RangeError("trimTrailing must be a string or an array of strings");
            } else {
                if (Array.isArray(options.trimTrailing)) options.trimTrailing = options.trimTrailing.map(i => String(i));
                else options.trimTrailing = String(options.trimTrailing);
            }
        }

        if (typeof options.trimTrailing === 'string')
            str = trimTrailingChars(str, options.trimTrailing);
        else
            for (var i = 0; i < options.trimTrailing.length; i++) {
                // coverage ignore next line
                if (debug) console.log("trim with", options.trimTrailing[i])
                str = trimTrailingChars(str, options.trimTrailing[i]);
            }
    }

    // END Perform string checking, string modification based on options -------

    // coverage ignore next line
    if (debug) console.log("String after modification:", str);

    if ([0,1].includes(str.length)) return true;

    var len = Math.floor(str.length / 2);
    for (var i = 0; i < len; i++) {
        if (str[i] !== str[str.length - i - 1])
        return false;
    }

    return true;
}

module.exports = isPalindrome;
