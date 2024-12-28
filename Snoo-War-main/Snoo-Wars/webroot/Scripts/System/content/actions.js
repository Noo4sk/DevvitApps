window.Actions = { 
//================= Abilitys =================================================
    whomp: {
        name: "Whomp!",
        description: "Body Slam!",
        targetType: "",
        success: [
            { type: "textMessage", text: "{CASTER} use's {ACTION} on {TARGET}"},
            { type: "animation", animation: "leap"},
            { type: "stateChange", damage: 10},
            { type: "animation", animation: "floatNumber"},
        ]
    }, 

    defend: {
        name: "defend",
        description: "Take less damage the next attack",
        targetType: "",
        success: [
            { type: "textMessage", text: "{CASTER} {ACTION} for the next Attack."},
            { type: "stateChange", defence: 10},
        ]
    },
//================= STATUS =================================================
    TestStatus: {
        name: "Testing Status",
        description: "Testing this",
        targetType: "friendly",
        success: [
            { type: "textMessage", text: "{CASTER} uses {ACTION}"},
            { type: "stateChange", status: null},
        ]
    },

//================= Recovery STATUS =================================================
    item_recoveryStatus: {
        name: "Remove Status",
        description: "remove Status",
        targetType: "friendly",
        success: [
            { type: "textMessage", text: "{CASTER} uses a {ACTION}"},
            { type: "stateChange", status: null},
        ]
    },

//================= Recovery Health =================================================
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