exports.displayOutput=( bg, foreground, total )=> {

    console.log("called");
    const outputItem = document.getElementById( 'output' );
    outputItem.innerHTML = '';
    const bgElement = document.createElement('div')
    bgElement.setAttribute('id','bg');
    bgElement.innerHTML(`Background: ${bg}`)
    const foregroundElement = document.createElement('div')
    foregroundElement.setAttribute('id','foreground');
    foregroundElement.innerHTML(`Foreground: ${foreground}`)
    const totalElement = document.createElement('div')
    totalElement.setAttribute('id','total');
    totalElement.innerHTML(`Total: ${total}`)

    outputItem.appendChild(bgElement);
    outputItem.appendChild(foregroundElement);
    outputItem.appendChild(totalElement);
}
