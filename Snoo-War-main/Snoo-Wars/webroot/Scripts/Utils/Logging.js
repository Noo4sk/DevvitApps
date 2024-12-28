const Logging = {
    //current: `${newDate.toLocaleDateString()} ${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}`,


    logObject({className,name, object, extraItems}) {
        let newDate = new Date(Date.now())
        let current = `${newDate.toLocaleDateString()} ${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}`

        console.groupCollapsed(`[ ${current} ]: ${name}`);
        if(className){
            console.log(`::${className}`);
        }
        if(extraItems){
            extraItems.forEach(item => {
                console.log(`[ ${current} ]: ${item}`);
            });
        }

        console.dir(object)
        console.groupEnd();
    },
    
    log(str){
        let newDate = new Date(Date.now());
        let current = `${newDate.toLocaleDateString()} ${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}`;
    
        console.log(`[ ${current} ]:\n${str}`);
    },

    mulitLog(strings = ['']){
        const newDate = new Date(Date.now());
        const current = `${newDate.toLocaleDateString()} ${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}`;
    
        if(strings.length > 1){
            const mulitLine = strings.join('\n');
            console.log(`[ ${current} ]:\n${mulitLine}`);

            // strings.forEach(item => {
            //     console.log(`[ ${current} ]:\n${item}`);
            // });
        } else {
            console.log(`[ ${current} ]:\n${strings[0]}`);
        }
    }
} 