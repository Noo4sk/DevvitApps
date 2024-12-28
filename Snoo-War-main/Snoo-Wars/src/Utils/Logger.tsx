export function nsLogger(str: any, className?: string){
    let newDate: Date = new Date(Date.now())
    let current = `${newDate.toLocaleDateString()} ${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}`

    if(className){
        console.log(`[ ${current} | ${className} ]: ${str}`)

    } else {
        console.log(`[ ${current} ]: ${str}`)

    }
}