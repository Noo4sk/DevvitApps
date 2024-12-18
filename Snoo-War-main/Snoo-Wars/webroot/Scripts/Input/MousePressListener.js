class MousePressListener {
    constructor({container}){
        // this.gameObject = gameObject;
        this.container = container;

        this.MouseClickFunction = function(event){
            const rect = this.canvas.getBoundingClientRect(); // canvas position relative to viewport
            let x = event.clientX - rect.left;
            let y = event.clientY - rect.top;
        
            let testX = event.clientX / 16;
            let testY = event.clientY / 16;
        
            window.MouseClick = {
                x: x,
                y: y,
            };
        
            let gridX = MouseClick.x / 16;
            let gridY = MouseClick.y / 16;
        
            console.group("Mouse Click");
            console.log(`[Test]: ${testX},${testY}`);
            console.log(`[World]: MouseClick at ${MouseClick.x},${MouseClick.y}`);
            console.log(`[Local]: MouseClick at ${gridX},${gridY}`);
            console.groupEnd("Mouse Click");
        }

        
        this.container.addEventListener(`mousedown`, this.MouseClickFunction);
    }

    unbind(){
        this.container.removeEventListener('mousedown', this.MouseClickFunction);
    }
}