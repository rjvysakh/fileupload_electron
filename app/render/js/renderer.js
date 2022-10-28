const dragDrop = require( 'drag-drop' );
const { ipcRenderer } = require( 'electron' );



// local dependencies
const dom = require( './dom' );
const outputDom = require('./dom')

/*****************************/

// get list of files from the `main` process
ipcRenderer.invoke( 'app:get-files' ).then( ( files = [] ) => {
    dom.displayFiles( files );
} );

// handle file delete event
ipcRenderer.on( 'app:delete-file', ( event, filename ) => {
    document.getElementById( filename ).remove();
} );

/*****************************/

// add files drop listener
dragDrop( '#uploader', ( files ) => {
    const _files = files.map( file => {
        return {
            name: file.name,
            path: file.path,
        };
    } );

    // send file(s) add event to the `main` process
    ipcRenderer.invoke( 'app:on-file-add', _files ).then( () => {
        ipcRenderer.invoke( 'app:get-files' ).then( ( files = [] ) => {
            dom.displayFiles( files );
        } );
    } );
} );

// open filesystem dialog
window.openDialog = () => {
    ipcRenderer.invoke( 'app:on-fs-dialog-open' ).then( () => {
        ipcRenderer.invoke( 'app:get-files' ).then( ( files = [] ) => {
            dom.displayFiles( files );
        } );
    } );
}

window.runPython = () => {
    ipcRenderer.invoke( 'app:on-run-python' );
}