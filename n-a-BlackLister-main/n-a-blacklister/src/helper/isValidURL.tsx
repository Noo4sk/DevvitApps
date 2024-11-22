import { Devvit } from "@devvit/public-api";
import { unblockable } from "../extra/Unblockable_Sites.js";
import { nsLogger } from "../Logging/Logger.js";

type validURL = {
    hostName: string,
    isValid: boolean
}
  
type isValid = {
    list: string[],
    unblockable: string[]

    blocked: boolean,
}

export function isValidLink(context: Devvit.Context, link: string[]): isValid {
    const validLinks = {
        blocked: false,
        list: [],
        unblockable: []
        
    } as isValid

    // For each item if valid URL add to validLinks Array.
    link.forEach( item => {
        const val = isValidURl(item)

        if(val.isValid){
            if(!validLinks.list.includes(val.hostName)){
                nsLogger(`${val.hostName} Added To List`, isValidLink.name)
                validLinks.list.push(val.hostName)
            }
        }
    });

    // List of links that are not blockable
    for(let item of unblockable){
        if(validLinks.list.includes(item)){
            validLinks.unblockable.push(item)
            let index = validLinks.list.indexOf(item)
            nsLogger(`Unblockable Url: ${item}. Removing from validLinks list`, isValidLink.name)

            validLinks.list.splice(index, 1)
            validLinks.blocked = true;
        }
    }

    
    return validLinks
    //await context.redis.set('validLinks', JSON.stringify(validLinks))
}

export function isValidURl(item: string): validURL{
    let valid: validURL = {
        hostName: '',
        isValid:false
    }
    try {
        let link = new URL(item);

        valid.hostName = link.hostname.toString();
        valid.isValid = true;

        return valid;

    } catch (error) {

        return valid;

    }
}