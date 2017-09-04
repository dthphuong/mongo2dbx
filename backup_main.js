var fs = require('fs');
const zlib = require('zlib');
var async = require('async');
var _ = require('lodash');
var exec = require('child_process').exec;
var CronJob = require('cron').CronJob;
var Cron = require('./mongodb_backup.js');
var Dropbox = require('dropbox');
var targz = require('node-tar.gz');
var util = require('./lib/util');
var config = require('./config');

// new CronJob('00 00 */1 * * *', function() {
new CronJob('00 */1 * * * *', function() {
    // Init variable
    dbOptions = config.dbOptions;

    console.log('Do backup . . . ', new Date());
    //Do backup
    if (dbOptions.autoBackup == true) {
        var date = new Date();
        var beforeDate, oldBackupDir, oldBackupPath;
        currentDate = util.stringToDate(date); // Current date
        var newBackupDir = util.dateToString(currentDate); // currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
        var newBackupPath = dbOptions.autoBackupPath + 'mongodump-' + newBackupDir; // New backup path for current backup process
        // check for remove old backup after keeping # of days given in configuration
        if (dbOptions.removeOldBackup == true) {
            beforeDate = _.clone(currentDate);
            beforeDate.setDate(beforeDate.getDate() - dbOptions.keepLastDaysBackup); // Substract number of days to keep backup and remove old backup
            oldBackupDir = beforeDate.getFullYear() + '-' + (beforeDate.getMonth() + 1) + '-' + beforeDate.getDate();
            oldBackupPath = dbOptions.autoBackupPath + 'mongodump-' + oldBackupDir; // old backup(after keeping # of days)
        }

        // var cmd = 'mongodump --host ' + dbOptions.host + ' --port ' + dbOptions.port + ' --db ' + dbOptions.database + ' --username ' + dbOptions.user + ' --password ' + dbOptions.pass + ' --out ' + newBackupPath; // Command for mongodb dump process
        var cmd = 'mongodump --host ' + dbOptions.host + ' --port ' + dbOptions.port + ' --out ' + newBackupPath; // Command for mongodb dump process

        // async.waterfall([
        //     function(callback) {
        //         exec(cmd, function (error, stdout, stderr) {
        //             if (util.empty(error)) {
        //                 // check for remove old backup after keeping # of days given in configuration
        //               if (dbOptions.removeOldBackup == true) {
        //                     if (fs.existsSync(oldBackupPath)) {
        //                         exec("rm -rf " + oldBackupPath, function (err) { });
        //                     }
        //                 }
        //             }
        //         });
        //         callback(null, null);
        //     },
        //     function(param, callback) {
        //         const gzip = zlib.createGzip();
        //         const inp = fs.createReadStream(newBackupPath);
        //         const out = fs.createWriteStream(dbOptions.autoBackupPath + 'mongodump-' + newBackupDir + '.gz');
                
        //         inp.pipe(gzip).pipe(out);
        //         callback(null, null);
        //     }
        // ],function(err, param) {

        // })
        exec(cmd, function (error, stdout, stderr) {
            if (util.empty(error)) {
                
                // check for remove old backup after keeping # of days given in configuration
                if (dbOptions.removeOldBackup == true) {
                    if (fs.existsSync(oldBackupPath)) {
                        exec("rm -rf " + oldBackupPath, function (err) { });
                    }
                }
            }
        });
    }
}, null, true, 'Asia/Ho_Chi_Minh');