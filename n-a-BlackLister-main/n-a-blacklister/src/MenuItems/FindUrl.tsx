import { Comment, Devvit, MenuItemOnPressEvent, Post } from '@devvit/public-api';
import { getAutoModRule, rulingList, updateAutoModRule } from '../helper/AutoMod.js';
import { isValidLink } from '../helper/isValidURL.js';
import { MulitLinkForm } from '../Forms/MulitLinkSubmit.js';
import { getLocation } from '../helper/getLocation.js';
import { Remove } from '../helper/removePost.js';
import { nsLogger } from '../Logging/Logger.js';
import { createValidLinksFormObject } from '../helper/FormValidLinksObj.js';


// Function to Find All Links Within Post Body.
async function findUrls(event: MenuItemOnPressEvent, context: Devvit.Context) {
    
  // Array of Valid Links
    let contextType: Post | Comment | undefined
  
    // Check Location
    const eventLocation = await getLocation(event, context);  
    if(eventLocation === undefined){
      nsLogger(`[ERROR: 00A2] eventLocation undefined.`, findUrls.name)
      context.ui.showToast(`[ERROR: 00A2] eventLocation undefined.`)
      return;
    }

    // ========= Check if Comment or Post ============
    if(eventLocation.type === "comment"){
      nsLogger(`eventLocation.type of type Comment`, findUrls.name)

      contextType = eventLocation.location as Comment
  
    } else if (eventLocation.type === "post"){
      nsLogger(`eventLocation.type of type Post`, findUrls.name)

      contextType = eventLocation.location as Post
  
    }

    // save Event Location
    nsLogger(`eventLocationID Set`, findUrls.name)
    context.redis.set('eventLocationID', JSON.stringify(eventLocation))

    // ===============================================

    // Check if context Type is Undefined | TODO: ADD PROPER CHECK AND ERROR WARNING
    if(contextType === undefined){
      nsLogger(`[ERROR: 00A3] autoModRuling undefined.`, findUrls.name)
      context.ui.showToast(`[ERROR: 00A3] contextType undefined.`)
      return;
    }


    let ContextBody = contextType.body
    if(ContextBody === undefined){
      nsLogger(`[ERROR: 00A4] autoModRuling undefined.`, findUrls.name)
      context.ui.showToast(`[ERROR: 00A4] ContextBody undefined.`)
      return;
    }

    // check if autoModRuling is not undefined.
    const autoModRuling = await context.redis.get('autoModRuling')
    if(autoModRuling === undefined){
      nsLogger(`[ERROR: 00A5] autoModRuling undefined.`, findUrls.name)

      context.ui.showToast(`[ERROR: 00A5] autoModRuling undefined.`)
      return;
    }

    // get auto mod ruling
    nsLogger(`Rulings Object Created`, findUrls.name)
    const Rulings: rulingList = JSON.parse(autoModRuling) as rulingList

    // ======================== Check if Post Has a Body =====================
    if(ContextBody.length > 0){  
      nsLogger(`[1] ContextBody.length Grater then 0`, findUrls.name)

      // Find and Split Links Using Regex
      const linkList = ContextBody.split(/(?<=\()(.*?)(?=\))/g)
      const validLinks = isValidLink(context, linkList)

      nsLogger(`[1] Valid Links Found: ${validLinks.list}`, findUrls.name)

      // ======================== Check if validLinks is not empty =====================
      if(validLinks.list.length > 0){
        nsLogger(`[1] validLinks.list.length Grater then 0`, findUrls.name)


        // ======================== Check if validLinks is Grater then 1 =====================
        if(validLinks.list.length > 1){
          nsLogger(`[1] validLinks.list.length Grater then 1`, findUrls.name)

          // Create new Object Form
          let NewFormJsonString = await createValidLinksFormObject(
            Rulings, 
            [
              'test', 
              ['boolean']
            ],
            validLinks.list,

          );

          // Show the Object Form
          context.ui.showForm(MulitLinkForm, { NewFormJsonString });
          
        } else {
          nsLogger(`[1] validLinks.list.length Less then 1`, findUrls.name)

          // if block is true show a diffrent toast
          if (validLinks.blocked){
            context.ui.showToast(`${JSON.stringify(validLinks.unblockable, null, 1)} are Unblockable Urls.`)
            
            // making sure the items was not in the list already
            if(!Rulings.domainRuling[Rulings.domainTitle].includes(validLinks.list[0])){
              context.ui.showToast(`${validLinks} Was Banned, Removing the ${eventLocation.type}`)
              
              // item was not in the list update automod
              await updateAutoModRule(context,  `~~NSBlackList`, validLinks.list)

            } else {
              context.ui.showToast(`${validLinks} Already Banned, Removing the ${eventLocation.type}`)
  
            }
            
          } else {
              nsLogger(`[1] One link Found, No Form Made`, findUrls.name)

              if(!Rulings.domainRuling[Rulings.domainTitle].includes(validLinks.list[0])){
                // item was not in the list update automod
                await updateAutoModRule(context,  `~~NSBlackList`, validLinks.list)
                context.ui.showToast(`${validLinks.list} Was Banned, Removing the ${eventLocation.type}`)

              } else {
                context.ui.showToast(`${validLinks.list} Already Banned, Removing the ${eventLocation.type}`)
              }
          }

          // remove the post.
          await Remove(context)
        }

      } else {
        nsLogger(`[1] validLinks.list.length Less then 0`, findUrls.name)

        context.ui.showToast(`${validLinks.unblockable.length > 0 ? `[ ${validLinks.unblockable} ] cannot be blocked`: `No Links Found` }`)  

      }

    // ======================== Body was empty Check Other Areas =====================
    } else {
      nsLogger(`[2] contextType.body is Empty`, findUrls.name)


      // ======================== if eventLocation.type === "post" Check the title =====================
      if(eventLocation.type === "post"){
        //context.ui.showToast(`${eventLocation.type} contains No Body. Checking Title for links\n`)

        // get the post Object
        let eventPost: Post = contextType as Post

        // Check for Links
        let checktitle = eventPost.title.split(/(?<=\()(.*?)(?=\))/g)

        const validLinksTitle = isValidLink(context, checktitle)
        nsLogger(`[2] Found Url: ${validLinksTitle.list}`, findUrls.name)

        if(validLinksTitle.list.length > 0){
          nsLogger(`[2] validLinksTitle.list.length Grater then 0`, findUrls.name)

          // ======================== Check if validLinks is Grater then 1 =====================
          if(validLinksTitle.list.length > 1){
            nsLogger(`[2] validLinksTitle.list.length Grater Then 1`, findUrls.name)

            // Create new Object Form
            let NewFormJsonString = await createValidLinksFormObject(Rulings, ['test', ['boolean']], validLinksTitle.list)

            // Show the Object Form
            context.ui.showForm(MulitLinkForm, { NewFormJsonString });
            
          } else {
            nsLogger(`[2] One link Found, No Form Made`, findUrls.name)
            if(!Rulings.domainRuling[Rulings.domainTitle].includes(validLinksTitle.list[0])){
              context.ui.showToast(`${validLinksTitle.list} Was Banned, Removing the ${eventLocation.type}`)
              
              // item was not in the list update automod
              await updateAutoModRule(context,  `~~NSBlackList`, validLinksTitle.list)

            } else {
              context.ui.showToast(`${validLinksTitle.list} Already Banned, Removing the ${eventLocation.type}`)
            }
            
          }

          await Remove(context)

        } else {
          console.log(`Post URL: ${contextType.url}`)

          //context.ui.showToast(`${eventLocation.type} Title Contains No links Checking Post URL.\n`)
          nsLogger(`[2] validLinks.list.length Less then 0`, findUrls.name)
          const validLinksURL= isValidLink(context, [contextType.url])

          if(validLinksURL.unblockable.length > 0){
            context.ui.showToast(`[ ${validLinksURL.unblockable} ] cannot be blocked`);

            return
          } 
        }
      } else {
        nsLogger(`[3] eventLocation.type typeOf "Comment"`, findUrls.name)

      }
    }
}

export async function find_Url(){
  Devvit.addMenuItem({
    label: 'Blacklist Link And Remove',
    location: ['post', 'comment'],
    forUserType: 'moderator', // accepts 'post', 'comment', 'subreddit', or a combination as an array
    onPress: async (event, context) => {
      const eventLocationID = context.redis.get('eventLocationID')
      if(eventLocationID === undefined){
        console.log(`eventLocationID => Undefinded`)
        context.redis.set('eventLocationID', '')
      }

      console.log(`---------------------------------------------`)

      // get The YAML RULING from
      const Rulings: rulingList = await getAutoModRule(context) as rulingList

      if (Rulings.index != -1){
        await context.redis.set('autoModRuling', JSON.stringify(Rulings))
        await context.redis.del('validLinks')
  
        await findUrls(event, context)

      } else {
        context.ui.showToast(`Prefix is missing from AutoMod`)

      }

      console.log(`---------------------------------------------`)

    },
  });
}