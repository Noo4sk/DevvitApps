class KeyPressListener {

    /**
     * 
     * @param {Array} keys 
     * @callbacks callback 
     */
    constructor(keycode, callback){
        let keyNotInUse = true;

        this.keyDownFunction = function(event) {
            if(event.code === keycode){
                if(keyNotInUse){
                    keyNotInUse = false; 
                    callback();
                }        
            }
        }

        this.keyUpFunction = function(event) {
            if(event.code === keycode){
                keyNotInUse = true;
            }
        }

        document.addEventListener('keydown', this.keyDownFunction);
        document.addEventListener('keyup', this.keyUpFunction);
    }

    unbind(){
        document.removeEventListener('keydown', this.keyDownFunction);
        document.removeEventListener('keyup', this.keyUpFunction);
    }
}