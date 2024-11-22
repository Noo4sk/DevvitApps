import { Devvit } from '@devvit/public-api';
import { find_Url } from './MenuItems/FindUrl.js';
import SendBugORHelpMessage from './extra/SendBugORHelpMessage.js';

Devvit.configure({
  redis: true,
  redditAPI: true,
  //http: true,
});

Devvit.addMenuItem({
  label: 'Noo-Ask TESTING',
  description: 'Dev Testing!',
  location: ['comment', 'post'],
  onPress: async (event, context) => {
    if(context.userId === "t2_10mbxhnt40"){
      console.log(`Admin Access`)
      

    } else {
      context.ui.showToast(`Only Dev(Admin) May use this feature.`)
    }
  },
});


find_Url()
SendBugORHelpMessage()

export default Devvit;
