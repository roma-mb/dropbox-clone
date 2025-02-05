export default class Utils {
    static getTimeByMiliseconds(milliseconds) {
        const timeSeconds = (milliseconds / 1000);
        const seconds = parseInt(timeSeconds % 60);
        const minutes = parseInt((timeSeconds / 60) % 60);
        const hours = parseInt((timeSeconds / 60) / 60);

        return {
            timeSeconds,
            seconds,
            minutes,
            hours
        };
    }

    static formatTimeLeft(hours, minutes, seconds) {
        if(hours) {
            return `${hours} hours, ${minutes} minutes and ${seconds} seconds`;
        }

        if(minutes) {
            return `${minutes} minutes and ${seconds} seconds`;
        }

        if(seconds) {
            return `${seconds} seconds`;
        }

        return '0';
    }
}
