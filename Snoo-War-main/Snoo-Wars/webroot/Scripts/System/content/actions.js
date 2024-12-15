window.Actions = {
    damage1: {
        name: "Whomp!",
        description: "Body Slam!",
        success: [
            { type: "textMessage", text: "{CASTER} use's {ACTION} on {TARGET}"},
            { type: "animation", animation: "leap"},
            { type: "stateChange", damage: 10},
        ]
    },
    TestStatus: {
        name: "Testing Status",
        description: "Testing this",
        targetType: "friendly",
        success: [
            { type: "textMessage", text: "{CASTER} uses {ACTION}"},
            { type: "stateChange", status: null},
        ]
    },

    // ITEMS
    item_recoveryStatus: {
        name: "Remove Status",
        description: "remove Status",
        targetType: "friendly",
        success: [
            { type: "textMessage", text: "{CASTER} uses a {ACTION}"},
            { type: "stateChange", status: null},
        ]
    },

    // ITEMS
    item_recoverHp: {
        name: "Health Pot",
        description: "recover Small Amount of hp",
        targetType: "friendly",
        success: [
            { type: "textMessage", text: "{CASTER} uses a {ACTION}"},
            { type: "stateChange", recovery: 10},
        ]
    }
}