import { Devvit } from "@devvit/public-api";

const HelpForm = Devvit.createForm(() => ({
    title: 'Help Form',
    description: "Please Tell Us how we can Help!",
    fields: [
        {
            type: 'select',
            name: 'Category',
            label: 'Category of your problem?',
            options: [
                { label: 'Critical', value: 'critical' },
                { label: 'Bug', value: 'bug' },
                { label: 'Suggestions', value: 'suggestions' }       
            ],
            defaultValue: ['bug'],
            required: true
        },
        {
            type: 'group',
            label: 'INFO',
            fields: [
                {   
                    type: 'string',
                    name: 'Name',
                    label: 'Whats Your Name?',
                    placeholder: "Name",
                    required: true

                },
                {   
                    type: 'paragraph',
                    name: 'description',
                    label: 'Brief description of your suggestion or problem',
                    required: true
                },
            ]
        },
    ],
    acceptLabel: 'Submit',
    cancelLabel: 'No',
  }),
  async (event, context) => {
    const subredditInfo = await context.reddit.getSubredditInfoById(context.subredditId)
    if(subredditInfo === undefined){
        context.ui.showToast(`[ERROR: ${SendBugORHelpMessage.name}] subredditInfo undefined.`)
        return
    }
    const subredditInfoName = subredditInfo.name
    if(subredditInfoName === undefined){
        context.ui.showToast(`[ERROR: ${SendBugORHelpMessage.name}] subredditInfoName undefined.`)
        return
    }
    const subredditInfoId = subredditInfo.id
    if(subredditInfoId === undefined){
        context.ui.showToast(`[ERROR: ${SendBugORHelpMessage.name}] subredditInfoId undefined.`)
        return
    }

    const _userId = context.userId?.toString()
    let _user

    if(_userId != undefined){
        _user = await context.reddit.getUserById(_userId)
    }

    let message = (
`#### Hello im ${event.values['Name']} from ${subredditInfoName}.  

---

**Category:**  ${event.values['Category']}  
  
**Description:**  

${event.values['description']}  


---`)

    context.reddit.modMail.createModInboxConversation({
        bodyMarkdown: message,
        subject: `${subredditInfoName} | ${event.values['Category']} Support Needed.`,
        subredditId: subredditInfoId,
    });

  }
);

function SendBugORHelpMessage(){
    //========================================= Get Removal Reason List =============================================================================
    Devvit.addMenuItem({
        label: 'Send a Bug/Help Message',
        description: 'Need help? | n-a-BlackLister',
        location: 'subreddit', // accepts 'post', 'comment', 'subreddit', or a combination as an array
        onPress: async (_, context) => {
            context.ui.showForm(HelpForm);
        },
    });
}

export default SendBugORHelpMessage