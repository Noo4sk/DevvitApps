import { Devvit } from '@devvit/public-api';
import { updateAutoModRule } from '../helper/AutoMod.js';
import { Remove } from '../helper/removePost.js';

export const MulitLinkForm = Devvit.createForm( (data) => (
    JSON.parse(data.NewFormJsonString)
),
  async (event, context) => { 
    console.log('Form Submmited.')
    let _items = []

    for(let x in event.values){
        if(event.values[x] === true){
            console.log(`_items.push(x): ${x}`)
            _items.push(x)
        }
    }

    if(_items.length > 0){
      await updateAutoModRule(context,  `~~NSBlackList`, _items)

    }

    await Remove(context)
  }
);

