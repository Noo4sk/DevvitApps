const EventUtils = {
    emitEvent(name, detail){
        // finnished walk.
        const event = new CustomEvent(name, {
            detail
        });
        document.dispatchEvent(event);
    },
}