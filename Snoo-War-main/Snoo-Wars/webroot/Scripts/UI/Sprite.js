class Sprite {
    constructor(config){

        // Sprite
        this.image = new Image();
        this.image.src = config.src; 
        this.image.onload = () => {
            this.isLoaded = true;
        }

        // Aniamtion
        this.animations = config.animations || { 
            'idle-up':    [ [0, 3] ],
            'idle-down':  [ [0, 2] ],
            'idle-right': [ [0, 1] ],
            'idle-left':  [ [0, 0] ],

            'walk-up':     [ [0, 3], [1, 3], [2, 3], [3, 3] ],
            'walk-down':   [ [0, 2], [1, 2], [2, 2], [3, 2] ],
            'walk-right':  [ [0, 1], [1, 1], [2, 1], [3, 1] ],
            'walk-left':   [ [0, 0], [1, 0], [2, 0], [3, 0] ],
        };
        
        this.currentAnimation = "idle-right"; // config.currentAnimation || 'idle-Down';
        this.currentAnimationFrame = 0;

        this.animationFrameLimit = config.animationFrameLimit || 6; // frame per game frame;
        this.animationFrameProgress = this.animationFrameLimit;

        this.gameObject = config.gameObject;
    }

    get frame(){
        return this.animations[this.currentAnimation][this.currentAnimationFrame];
    }

    setAnimation(key){
        if (this.currentAnimation !== key){
            this.currentAnimation = key;
            this.currentAnimationFrame = 0;
            this.animationFrameProgress = this.animationFrameLimit;
        }
    }

    updateAniamtionProgress(){
        if(this.animationFrameProgress > 0){
            this.animationFrameProgress -= 1;
            return;
        }

        this.animationFrameProgress = this.animationFrameLimit;
        this.currentAnimationFrame += 1;

        if(this.frame === undefined){
            this.currentAnimationFrame = 0;
        }
    }

    draw(ctx, cameraPerson){
        const x = this.gameObject.x - 8 + utils.withGrid(10.5) - cameraPerson.x;
        const y = this.gameObject.y - 12 + utils.withGrid(6) - cameraPerson.y;

        const [frameX, frameY] = this.frame;

        this.isLoaded && ctx.drawImage( this.image,
            frameX * 32, frameY * 32,
            32, 32,
            x, y,
            32, 32
        )

        this.updateAniamtionProgress();
    }
}