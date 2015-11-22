'use strict'

class Utils {

    /**
    * Converts the given input from time format ISO-8601 to seconds
    * @param {string} input The ISO-8601 formatted time
    * @return {integer}
    */
    static ISO8601ToSeconds(input) {
        let reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
        let hours = 0, minutes = 0, seconds = 0, totalseconds;

        if (reptms.test(input)) {
            let matches = reptms.exec(input);
            if (matches[1]) hours = Number(matches[1]);
            if (matches[2]) minutes = Number(matches[2]);
            if (matches[3]) seconds = Number(matches[3]);
            totalseconds = hours * 3600  + minutes * 60 + seconds;
        }

        return totalseconds;
    }
}

export default Utils;