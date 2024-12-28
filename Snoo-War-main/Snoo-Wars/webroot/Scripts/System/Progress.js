class Progress {
    constructor(){
        this.mapId = "";
        this.startingPlayerX = 0;
        this.startingPlayerY = 0;
        this.startingPlayerDirection = "";
    }

    save(){
        console.groupCollapsed(`Saving Game To Redis`);
        window.playerState.progress.mapId = this.mapId;
        window.playerState.progress.direction = this.startingPlayerDirection;

        const jString = JSON.stringify(window.playerState);
        const ID = localStorage.getItem("playerId");
        
        Logging.logObject({
            name: 'Save: playerState',
            object: window.playerState, 
            extraItems: [
                `id: ${ID} `,
            ]
        })

        //Update Redis Now.
        window.parent?.postMessage({
            type: "updateRedis",
            data: {
                playerState: jString,
                id: ID,
            }
        }, '*');
        
        console.groupEnd();
    }

    load(){
        this.mapId = window.playerState.progress.mapId;
        this.startingPlayerX = window.playerState.progress.x;
        this.startingPlayerY = window.playerState.progress.t;
        this.startingPlayerDirection = window.playerState.progress.direction;
    }

}