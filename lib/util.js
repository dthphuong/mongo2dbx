/* return date object */
exports.stringToDate = function (dateString) {
    return new Date(dateString);
}

exports.dateToString = function (myDate) {
    // convert Date to String
    var today = new Date(myDate);
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var hrs = today.getHours();
    var min = today.getMinutes();
    var sec = today.getSeconds();

    var yyyy = today.getFullYear();
    if(dd<10) dd='0'+dd; 
    if(mm<10) mm='0'+mm; 
    if(hrs<10) hrs='0'+hrs;
    if(min<10) min='0'+min;
    if(sec<10) sec='0'+sec;
    
    return yyyy + mm + dd + '-' + hrs + min + sec;
}
/* return if variable is empty or not. */
exports.empty = function(mixedVar) {
    var undef, key, i, len;
    var emptyValues = [undef, null, false, 0, '', '0'];
    for (i = 0, len = emptyValues.length; i < len; i++) {
        if (mixedVar === emptyValues[i]) {
        return true;
        }
    }
    if (typeof mixedVar === 'object') {
        for (key in mixedVar) {
            return false;
        }
        return true;
    }
    return false;
};