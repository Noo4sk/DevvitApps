class Person extends GameObject {
    constructor(config){
        super(config);

        this.moveingProgressRemaining = 0;
        this.isStanding = false;
        this.intentPosition = null;

        this.isPlayerControlled = config.isPlayerControlled || false;
        this.directionUpdate = {
            "up": ['y', -1],
            "down": ['y', 1],
            "left": ['x', -1],
            "right": ['x', 1],
        }

        this.standBehaviorTimeout;
    }

    update(state){
        if(this.moveingProgressRemaining > 0){
            this.updatePosition();

        } else {

            if(!state.map.isCutscenePlaying && this.isPlayerControlled && state.arrow){
                this.startBehavior(state, {
                    type: "walk",
                    direction: state.arrow
                });
            }

            this.updateSprite(state);
        }
    }

    /**
    * @param {any} state - state of the object.
    * @param {object} behavior - an object with type and direction for a behavior.
    */
    startBehavior(state, behavior){
        if(!this.isMounted){
            return;
        }

        this.direction = behavior.direction;

        if (behavior.type === "walk"){
            if(state.map.isSpaceTaken(this.x, this.y, this.direction)){
                
                behavior.retry && setTimeout(() => {
                   this.startBehavior(state, behavior);
                }, 10);
                return;
            }

            // Setting Next space
            this.moveingProgressRemaining = 16;

            // intent
            const intentPosition = utils.nextPosition(this.x, this.y, this.direction);
            this.intentPosition = [
                intentPosition.x,
                intentPosition.y,
            ];

            window.playerState.progress.x = intentPosition.x;
            window.playerState.progress.y = intentPosition.y;

            this.updateSprite(state);
        }

        if(behavior.type === "stand"){
            this.isStanding = true;

            if(this.standBehaviorTimeout){
                clearTimeout(this.standBehaviorTimeout);
            }

            this.standBehaviorTimeout = setTimeout(() => {

                EventUtils.emitEvent("PersonStandComplete", {
                    whoId: this.id,
                });

                this.isStanding = false;

            }, behavior.time);
        }
    }

    /**
    * @param function - update the position of the Person
    */
    updatePosition(){
        const [property, value] = this.directionUpdate[this.direction];
        this[property] += value;

        // remove Progress
        this.moveingProgressRemaining -= 1;

        if (this.moveingProgressRemaining === 0){

            // Finnished walking.             
            this.intentPosition = null;
            EventUtils.emitEvent("PersonWalkingComplete", {
                whoId: this.id,
            });
        }
    }

    /**
    * @param {object} state - state object with sprite Info. [ Function Updates Person Sprite ]
    */
    updateSprite(){
        if(this.moveingProgressRemaining > 0){
            this.sprite.setAnimation("walk-"+this.direction);
            return;
        }
        this.sprite.setAnimation("idle-"+this.direction);

    }
}