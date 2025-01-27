class SubmissionMenu {
    constructor({caster, enemy, onComplete, items}){
        this.caster = caster;
        this.enemy = enemy;
        this.onComplete = onComplete;

        let quantityMap = {};
        items.forEach(item => {
            if(item.team === caster.team){

                let existing = quantityMap[item.actionId];

                if(existing){
                    existing.quantity += 1;

                } else {
                    quantityMap[item.actionId] = {
                        actionId: item.actionId,
                        quantity: 1,
                        instanceId: item.instanceId,
                    }
                }
            }
        });

        this.items = Object.values(quantityMap);
    }

    decide(){
        //console.dir(this.caster);

        // TODO: AI Logic for Players
        this.menuSubmit(Actions[ this.caster.heldActions[0] ]);
    }

    getPages(){
        const backOption = {
            label: "Back",
            description: "Return to previous page",
            handler: () => {
                this.keyboardMenu.setButton( this.getPages().root)
            }
        }

        return {
            root: [
                {
                    label: "Attack",
                    description: "Your Attacks..",
                    handler: () => {
                        // DO SOMETHING
                        this.keyboardMenu.setButton( this.getPages().Attack)
                    }
                },
                {
                    label: "Items",
                    description: "Items That you Can Use",
                    handler: () => {
                        // DO SOMETHING
                        this.keyboardMenu.setButton( this.getPages().Items)

                    }
               },
               {
                    label: "Run",
                    description: "Their IS no Running",
                    disabled: true,
                    handler: () => {
                        // DO SOMETHING 
                    }
               }
            ],
            Attack: [
                ...this.caster.heldActions.map(key => {
                    const action = Actions[key];
                    return {
                        label: action.name,
                        description: action.description,
                        handler: () => {
                            this.menuSubmit(action);
                        }
                    }
                }),
                backOption
            ],
            Items: [
                ...this.items.map(item => {
                    const action = Actions[item.actionId];
                    return {
                        label: action.name,
                        description: action.description,
                        right: () => {
                            return "x" + item.quantity;
                        },
                        handler: () => {
                            this.menuSubmit(action, item.instanceId);
                        }
                    }
                }),
                backOption,
            ],
        }
    }

    menuSubmit(action, instanceId=null){
        
        this.keyboardMenu?.dispose();
        
        this.onComplete({
            action,
            target: action.targetType === 'friendly' ? this.caster : this.enemy,
            instanceId
        });
    }

    showMenu(container){
        this.keyboardMenu = new KeyBoardMenu();
        this.keyboardMenu.init(container);

        this.keyboardMenu.setButton(this.getPages().root);
    }

    init(container){

        if(!this.caster.isPlayerControlled){
            this.decide();
        
        } else {

            this.showMenu(container);
        }

    }
}