class Progress {
    constructor(){
        this.mapId = "spawn";
        this.startingPlayerX = 0;
        this.startingPlayerY = 0;
        this.startingPlayerDirection = "down";

        this.saveFileKey = "SnooWars_001";
    }

    save(){
        window.localStorage.setItem(this.saveFileKey, JSON.stringify({
            mapId: this.mapId,
            startingPlayerX: this.startingPlayerX,
            startingPlayerY: this.startingPlayerY,
            startingPlayerDirection: this.startingPlayerDirection,

            playerState: {
                Snoo: playerState.snoo,
                lineup: playerState.lineup,
                items: playerState.items,
                storyFlags: playerState.storyFlags
            }
        }));
    }

    getSaveFile(){
        const file = window.localStorage.getItem(this.saveFileKey);
        return file ? JSON.parse(file) : null;
    }

    load(){
        const file = this.getSaveFile();
        if (file) {
            this.mapId = file.mapId;
            this.startingPlayerX = file.x;
            this.startingPlayerY = file.y;
            this.startingPlayerDirection = file.direction;
        
            Object.keys(file.playerState).forEach(key => {
                playerState[key] = file.playerState[key];
            });
        }
    }
}