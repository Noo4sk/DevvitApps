import jsYaml from "js-yaml";
import yaml from "yaml";
import yamlObject from "../types/Iyaml_JS.js";
import { Devvit, WikiPage } from '@devvit/public-api';
import { isEmptyYAML } from "./isEmptyYAML.js";
import { nsLogger } from "../Logging/Logger.js";

export type yamlDomain = {
    [domain: string]: string[],
}
  

export type rulingList = {
    ruleList: string[],
    rule: yamlObject | any,
    index: number,

    domainTitle: string
    domainRuling: yamlDomain
}

async function updateAutoModRule(context: Devvit.Context, rulePrefix: String, itemToAdd: string[]){
    const subredditId = context.subredditId

    // If subredditId is undefined Leave. | TODO: ERROR CHECK LET USER KNOW
    if(subredditId === undefined){
        context.ui.showToast(`[ERROR: 00A10] subredditId undefined.`)
        nsLogger(`[ERROR: 00A10] subredditId undefined.`, updateAutoModRule.name)
        return undefined;
    }
    
    let subRedditInfo = await context.reddit.getSubredditInfoById(subredditId)
    // If subRedditInfo is undefined Leave. | TODO: ERROR CHECK LET USER KNOW
    if(subRedditInfo === undefined){
        context.ui.showToast(`[ERROR: 00A11] subRedditInfo undefined.`)
        nsLogger(`[ERROR: 00A11] subRedditInfo undefined.`, updateAutoModRule.name)

        return undefined;
    }

    // Try to get the _wikiPage Object
    try {

        // get subreddit wiki
        const _wikiPage = await context.reddit.getWikiPage(subRedditInfo.name!, '/config/automoderator')
        //const _TestwikiPage = await context.reddit.getWikiPage(subRedditInfo.name!, '/test_world')

        // Pull saved ruling from redis
        const redis_rulingList = await context.redis.get('autoModRuling')
        if(redis_rulingList === undefined){
            context.ui.showToast(`[ERROR: 00A12] redis_rulingList undefined.`)
            nsLogger(`[ERROR: 00A12] redis_rulingList undefined.`, updateAutoModRule.name)
            return
        }

        // converting the rule to rulingList Object
        let rulingList: rulingList = JSON.parse(redis_rulingList) as rulingList;        
        if ( isEmptyYAML( JSON.stringify(rulingList.rule) ) ){    
            nsLogger(`rulingList.rule isEmpty`, updateAutoModRule.name)
        }

        if (rulingList.ruleList === undefined){
            nsLogger(`ruleList is undefined or empty? No Rules Found?`, updateAutoModRule.name)
            return undefined;
        }

        let yamlObj = yaml.parse(yaml.stringify(rulingList.rule))
        nsLogger(`yamlObj:\n\n${yaml.stringify(yamlObj)}`, updateAutoModRule.name)

        // add content to yaml Object
        for(let value of itemToAdd){
            if(!rulingList.domainRuling[rulingList.domainTitle].includes(value)){
                nsLogger(`rulingList.rule !! contain ${value}\n`, updateAutoModRule.name)
                
                for(let [key, yVal] of Object.entries(yamlObj)){
                    console.log(`testYaml[${rulingList.domainTitle}] ~ ${rulingList.domainTitle}  === ${key}`)

                    if(rulingList.domainTitle === key){
                        let test = yamlObj[key] as string[]
                        test.push(value)
                        nsLogger(`yamlObj[${key}] = ${value}`, updateAutoModRule.name)
                        break;
                    }

                }
            }
        }
        nsLogger(`yamlObj:\n\n${yaml.stringify(yamlObj)}`, updateAutoModRule.name)
        rulingList.rule = yamlObj as yamlObject


        if (rulingList.index === -1){
            nsLogger(`rulingList.index === -1: ${rulingList.rule}\n`, updateAutoModRule.name)

            
        } else {

            rulingList.ruleList[rulingList.index] = (`\n\n#~~NSBlackList\n${jsYaml.dump(rulingList.rule, {flowLevel: 1})}\n`)

        }
            
        const compleate = rulingList.ruleList.join('---')

        nsLogger(`updated: AutoMod`, updateAutoModRule.name)
        await _wikiPage.update(compleate, "Adding to BlackList")

    } catch (error) {
        if(error instanceof Error){
            console.log(`AutoMod.tsx [Func => updateAutoModRule]:\nType: [${error.name}]\nMessage: ${error.message}`)

        }else{
            console.log(`AutoMod.tsx [Func => updateAutoModRule]:\n${error}`)
        }
    }
}



async function createRulingList(_wikiPage: WikiPage, rulePrefix: String): Promise<rulingList> {
    let setRulingList: rulingList = {
        index: -1,
        rule: {} as yamlObject,
        ruleList: [],

        domainTitle: '',
        domainRuling: {},
    }
    const newAutoMod = [] as string[]
    
    // Split the wiki content by --- 
    const _wikiPageContent = _wikiPage.content.split(/---/g)

    // Remove any empty
    let WikiContentFiliter = _wikiPageContent.filter(str => str.trim() !== "");
    let yamlRule;

    // search for Prefix
    for(let item in WikiContentFiliter){
        // check item for the prefix
        if(WikiContentFiliter[item].includes(`#${rulePrefix}`)){

            // if found save the index that it was found in.
            const index = WikiContentFiliter.indexOf(WikiContentFiliter[item])
            setRulingList.index = index

            nsLogger(`Found Prefix Rule[${index}]:\n${WikiContentFiliter[item]}`, createRulingList.name)

            yamlRule = jsYaml.load(WikiContentFiliter[item]) as yamlObject
        
            if (yamlRule != null || yamlRule != undefined){
                nsLogger(`Yaml Rule Found`, createRulingList.name)
                let yamlString = yaml.stringify(yamlRule)

                if(!isEmptyYAML(yamlString)){
                    nsLogger(`Yaml Rule Not Empty`, createRulingList.name)

                    setRulingList.rule = yamlRule

                    for (let [key, value] of Object.entries(yamlRule)){
                        if(key.includes('domain') || key.includes('Domain')){
                            
                            setRulingList.domainTitle = key
                            nsLogger(`setRulingList.domainTitle = ${key}`, createRulingList.name)

                            setRulingList.domainRuling[key] = value as string[]
                            nsLogger(`setRulingList.domainRuling[${key}] = ${JSON.stringify(setRulingList.domainRuling[key])}`, createRulingList.name)
                            break;
                        }
                    }
                } else {
                    nsLogger(`Yaml Rule is Empty?`, createRulingList.name)
                }
            }
            

        } else{
            newAutoMod.push(WikiContentFiliter[item])
        }
    }

    if(setRulingList.index === -1){
        nsLogger(`rulingList.index = -1 NO Prefix found?`, createRulingList.name)
    }

    setRulingList.ruleList = newAutoMod

    return setRulingList
}


async function getAutoModRule(context: Devvit.Context): Promise<rulingList>{
    nsLogger(`getAutoModRule`, getAutoModRule.name)

    let getRulingList: rulingList = {
        index: -1,
        rule: {} as yamlObject,
        ruleList: [],

        domainTitle: '',
        domainRuling: {}
    } as rulingList

    let subredditId = context.subredditId
    if(subredditId === undefined){
        console.log(`subredditId is undefined`)
        return getRulingList;
    }

    let subRedditInfo = await context.reddit.getSubredditInfoById(subredditId)
    if(subRedditInfo === undefined){
        console.log(`subRedditInfo is undefined`)
        return getRulingList;
    }

    // Try to get the _wikiPage Object
    try {
    
        // get subreddit wiki
        const _wikiPage = await context.reddit.getWikiPage(subRedditInfo.name!, '/config/automoderator')
    
        getRulingList = await createRulingList(_wikiPage, `~~NSBlackList`) as rulingList
        //nsLogger(`getRulingList: ${JSON.stringify(getRulingList, null, 2)}`, getAutoModRule.name)

    } catch (error) {
        if(error instanceof Error){getRulingList
            console.log(`AutoMod.tsx [Func => getAutoModRule]:\n[${error.name}]\nMessage: ${error.message}`)

        }else{
            console.log(`AutoMod.tsx [Func => getAutoModRule]:\n${error}`)
        }
    }

    return getRulingList
}

export { getAutoModRule, updateAutoModRule }