import { Comment, Devvit, Post } from '@devvit/public-api';
import { eventLocation } from '../types/ILocationType.js';
import { nsLogger } from '../Logging/Logger.js';

export async function Remove(context: Devvit.Context){
    const subredditName = context.subredditName
    let eventPost: Post | Comment | undefined

    if(subredditName === undefined){
        console.log(`removePost: [Remove] => subredditName is undefined`)
        nsLogger(`subredditName is undefined`, Remove.name)

        return
    }
  
    const readContext = await context.redis.get('eventLocationID')
    if(readContext === undefined){
        nsLogger(`readContext is undefined`, Remove.name)
        return; 
    }

    const eventContext: eventLocation =  JSON.parse(readContext) as eventLocation
    nsLogger(`EventContext: ${eventContext.type}`, Remove.name)

    if(eventContext.type === "comment"){
        nsLogger(`eventLocation.type of type Comment`, Remove.name)

        eventPost = await context.reddit.getCommentById(eventContext.location.id)

    
    } else if (eventContext.type === "post"){
        nsLogger(`eventLocation.type of type Post`, Remove.name)

        eventPost = await context.reddit.getPostById(eventContext.location.id)

    }
    if(eventPost != undefined){
        eventPost.remove(false).then( _ => {
            nsLogger(`[ ${eventPost.id} ] ~ Removed.`, Remove.name)
            eventPost.addRemovalNote({
            reasonId: '',
            modNote: "Removed Due To Link",
            });
        });
    }
}