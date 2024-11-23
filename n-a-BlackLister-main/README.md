# Page For n-a-Blacklister setup [ NAME PENDING ] 
![Devvit 0.11.3](https://github.com/Noo4sk/DevvitApps/blob/main/Badge/Devvit_0.11.3.svg)

[ **Please Make sure to Have a backup of your Auto-Mod In case any problems come happen!**]


## Install

## Add Prefix
- Add [ ~~NSBlackList ] to your AutoMod Domain Blocking Rule
```

    #~~NSBlackList
    # A URL Black List create by NOO-ASK
    type: submission
    domain+body+title: []
    action: remove
    action_reason: "A {{kind}} with a link to a banned domain [{{match}}]"
    message: "Your {{kind}} was removed because we don't allow links to {{match}}."

```

## Enjoy


## **NOTICES
- As of right now n-a-Blacklister can only Read urls with-in the Body and Title of a comment or post.
    - n-a-Blacklister *can* read the url of a post but this feature is expermental and breaks often.
