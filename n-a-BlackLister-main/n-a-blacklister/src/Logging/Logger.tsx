export function nsLogger(str: any, className?: string){
    let newDate: Date = new Date(Date.now())
    let current = `${newDate.toLocaleDateString()} ${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}`

    if(className){
        console.log(`[ ${current} | ${className} ]: ${str}`)

    } else {
        console.log(`[ ${current} ]: ${str}`)

    }
}


// export function nsLoggerError(errType: errorType, str: any, className?: string){
//     let newDate: Date = new Date(Date.now())
//     let current = `${newDate.toLocaleDateString()} ${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}`
//     let message = '';

//     if(className){
//         message = `[ ${current} | ${className} ]: ${str}`;

//     } else {
//         message = `[ ${current} ]: ${str}`;
//     }

//     errType.value
//     switch (errorType) {
//         case 'throw': //
            
//             break;
//         case 'warning': //
        
//             break;

//         case 'throw': //
        
//             break;
//     }

// }