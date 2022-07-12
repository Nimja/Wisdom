// Add timestamps to logs.
var log = console.log;

console.log = function () {
    let d = new Date();
    // Get date in format yyyy-mm-dd - Without depending on ISO date (which is UTC timezone).
    let date = [
        d.getFullYear(),
        ('0' + (d.getMonth() + 1)).slice(-2),
        ('0' + d.getDate()).slice(-2)
    ].join('-');
    // Get time in expected format, but without the timezone.
    let time = d.toTimeString().split(' ')[0];
    log.apply(console, [date, time, '-'].concat([...arguments]));
};