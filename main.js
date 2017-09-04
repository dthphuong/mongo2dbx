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

// Dropbox oauth
var dbx = new Dropbox({ accessToken: 'TOKEN_HERE' });

new CronJob('00 00 */1 * * *', function() { //every hours
// new CronJob('00 */1 * * * *', function() { //every minutes
    // Init variable
    dbOptions = config.dbOptions;

    // Upload before backup file
    var beforeFile = fs.readFileSync('backup.tmp');
    if (beforeFile != '') {
        if (fs.existsSync('./backup/' + beforeFile)) {
            console.log('start upload');
            fs.readFile('./backup/' + beforeFile, function(err, content) {
                dbx.filesUpload({
                    contents: content,
                    path: '/backup/database/' + beforeFile,
                    mode: { '.tag': 'add' },
                    autorename: true,
                    mute: false
                }).then(function(response) {
                    console.log('upload success')
                }).catch(function(error) {
                    console.log(error)
                })
            });
        } else {
            console.log('File `' + beforeFile + '` is not exist')
        }
    } else {
        console.log('The first time run this system');
    }

    console.log('Do backup . . . ', new Date());
    //Do backup
    if (dbOptions.autoBackup == true) {
        var date = new Date();
        var beforeDate, oldBackupFile, oldBackupPath;
        currentDate = util.stringToDate(date); // Current date
        var newBackupFile = util.dateToString(currentDate); // currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
        var newBackupPath = dbOptions.autoBackupPath + 'mongodump-' + newBackupFile; // New backup path for current backup process
        // check for remove old backup after keeping # of days given in configuration
        if (dbOptions.removeOldBackup == true) {
            beforeDate = _.clone(currentDate);
            beforeDate.setDate(beforeDate.getDate() - dbOptions.keepLastDaysBackup); // Substract number of days to keep backup and remove old backup
            oldBackupFile = beforeDate.getFullYear() + '-' + (beforeDate.getMonth() + 1) + '-' + beforeDate.getDate();
            oldBackupPath = dbOptions.autoBackupPath + 'mongodump-' + oldBackupFile; // old backup(after keeping # of days)
        }

        // var cmd = 'mongodump --host ' + dbOptions.host + ' --port ' + dbOptions.port + ' --db ' + dbOptions.database + ' --username ' + dbOptions.user + ' --password ' + dbOptions.pass + ' --out ' + newBackupPath; // Command for mongodb dump process
        // var cmd = 'mongodump --host ' + dbOptions.host + ' --port ' + dbOptions.port + ' --out ' + newBackupPath; // Command for mongodb dump process
        var cmd = 'mongodump --host ' + dbOptions.host + ' --port ' + dbOptions.port + ' --archive=./backup/' + newBackupFile + '.gz --gzip'; // Command for mongodb dump process
      
        exec(cmd, function (error, stdout, stderr) {
            if (util.empty(error)) {
                // check for remove old backup after keeping # of days given in configuration
                if (dbOptions.removeOldBackup == true) {
                    if (fs.existsSync(oldBackupPath)) {
                        exec("rm -rf " + oldBackupPath, function (err) { });
                    }
                }
            }

            fs.writeFileSync('backup.tmp', newBackupFile + '.gz');
        })
    }
}, null, true, 'Asia/Ho_Chi_Minh');