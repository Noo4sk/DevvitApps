class PlayerState {
    constructor(config){
        let {userPlayerState, id} = config

        this.snoo = { 
            [id]: userPlayerState.snoo[id] 
        } || {};
        this.lineup = userPlayerState.lineup.length <= 0 ? [id] : userPlayerState.lineup;
        this.items = [];
        this.storyFlags = {};
        this.battleWon = userPlayerState.battleWon || 0;
        this.money = userPlayerState.money || 0;
        this.progress = userPlayerState.progress || {};

        if(Object.keys(userPlayerState.storyFlags).length > 0){
            Object.keys(userPlayerState.storyFlags).forEach(key => {
                this.storyFlags = {
                    ...this.storyFlags, 
                    [key]: userPlayerState.storyFlags[key]
                }
            });
        }

        if(userPlayerState.items.length > 0){
            userPlayerState.items.forEach(item => {
                console.log(item);
                this.items.push(item);
            });
        }

        console.groupCollapsed(`Player Init`);
        console.dir(this);
        console.groupEnd();
    }
}    