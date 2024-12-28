class Inventory {
    constructor(){
        this.inventory = [];
    }

    createElement(){
        this.inventoryElement = document.createElement('div');
        this.inventoryElement.classList.add('Inventory');

    }

    close(){

    }

    init(container){
        this.createElement();

        container.appendChild(this.inventoryElement);
    }

    add(item){
        this.inventory.push({
            ...this.inventory,
            item
        })
    }

    remove(item){
        this.inventory.forEach( slot => {
            console.log(slot);
        });
    }

}