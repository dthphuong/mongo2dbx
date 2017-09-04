var dbOptions =  {
    user: '<username>',
    pass: '<password>',
    host: 'localhost',
    port: 27017,
    database: '<databaseName>',
    autoBackup: true, 
    removeOldBackup: false,
    keepLastDaysBackup: 2,
    autoBackupPath: './backup/' // i.e. /var/database-backup/
};

exports.dbOptions = dbOptions;