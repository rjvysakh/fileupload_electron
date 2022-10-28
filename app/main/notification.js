const { Notification } = require( 'electron' );

// display files added notification
exports.filesAdded = ( size ) => {
    const notif = new Notification( {
        title: 'Files added',
        body: `${ size } file(s) has been successfully added.`
    } );

    notif.show();
};


exports.removeFile = ( ) => {
    const notif = new Notification( {
        title: 'Error',
        body: `Only one file can be used at once`
    } );

    notif.show();
};

exports.wrongFormat = (  ) => {
    const notif = new Notification( {
        title: 'Not Supported',
        body: `Only video files supported.`
    } );

    notif.show();
};
