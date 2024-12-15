class PlayerState {
    constructor(config){
        let {id, username, state} = config
        
        if(state === undefined){
        }

        this.snoo = {
            [id]: state.playerState.snoo[id]
        } || {};
        this.lineup = [];
        this.items = [];
        this.heldActions = [];
        this.storyFlags = {};

        if(state.playerState.heldActions.length <= 0){
            this.heldActions.push('damage1');
        } else {
            state.playerState.heldActions.forEach(item => {
                this.heldActions.push(item);
            });
        }

        if(state.playerState.lineup.length <= 0){
            this.lineup.push(id);
        } else {
            state.playerState.lineup.forEach(item => {
                console.log(item);
                this.lineup.push(item);
            });
        }

        if(state.playerState.items.length > 0){
            state.playerState.items.forEach(item => {
                console.log(item);
                this.items.push(item);
            });
        }

        window.Snoo = {...Snoo, [id]:{
            name: username,
            snooImage: this.snoo[id].snooImage,
            actions: this.heldActions
        }}

        console.log(`Snoo: ${JSON.stringify(window.Snoo)}`);
    }
}    