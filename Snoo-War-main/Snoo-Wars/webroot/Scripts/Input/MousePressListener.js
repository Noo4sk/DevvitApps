class MousePressListener {
    constructor(){
        this.touchStart = function(event) {
           console.log(event.touches);
        }

        document.addEventListener('touchstart', this.touchStart);
    }

    unbind(){
        document.removeEventListener('touchstart', this.touchStart);
        // document.removeEventListener('mouseup', this.keyUpFunction);
    }
}