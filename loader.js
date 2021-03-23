/* File: loader
 * Description: Loads the game client logic from local or remotes sources. 
 */

// Code Mode Identifiers
const CODE_MODE = "CODE_MODE";                              // localStorage Identifier
const CODE_MODE_SWITCH = "CODE_MODE_SWITCH";                // LoaderEventManager Event Identifier

// Code Modes
const CODE_MODE_NONE = "CODE_MODE_NONE";                    // Only allow movement
const CODE_MODE_CLICK_ATTACK = "CODE_MODE_CLICK_ATTACK";    // Attack a target after selecting it
const CODE_MODE_AUTO_ATTACK = "CODE_MODE_AUTO_ATTACK";      // Attack the closest nearby enemy
const CODE_MODE_VSCODE = "CODE_MODE_VSCODE";                // Sync code with vscode
const CODE_MODE_API = "CODE_MODE_API";                      // Pull code from api (if changes exist)

// Text Constants
const EXCEPTION_CODE_MODE_SWITCH_FAILED = "Failed to switch code mode!";

const LoaderEventManager = {
    subscriber: [],
    subscribe: function(callback) {
        this.subscriber.push(callback);
    },
    unsubscribe: function(callback) {
        this.subscriber.remove(callback);
    },
    unsubscribeAll: function() {
        this.subscriber = [];
    },
    triggerEvent: function(name) {
        this.subscriber.forEach(callback => {
            callback(name)
        });
    }
};

function switchCodeMode(mode)
{
    // Notify all event subscribers about the code mode switch
    LoaderEventManager.triggerEvent(CODE_MODE_SWITCH);

    // Discard all old event subscribers
    LoaderEventManager.unsubscribeAll();

    // Deselect current target
    change_target(null);

    // Load the new source code
    loadSpecificCode(mode);

    log("[CM]: " + mode);
    localStorage.setItem(CODE_MODE, mode);
}
//map_key("P","snippet","switchCodeMode();");

map_key("F8",{name:"pure_eval",code:`(() => {
    let codeMode = localStorage.getItem("CODE_MODE");
    let loaderMenuButton = document.getElementById("loader_menu_button");
    let loaderDialog = document.getElementById("loader_dialog");

    /* Delete custom GUI elements (for easier refreshing) */
    if (loaderMenuButton) {
        loaderMenuButton.remove();
    }
    if (loaderDialog) {
        loaderDialog.remove();
    }

    /* LOADER dialog button: None */
    let loaderDialogButtonNone = document.createElement("div");
    loaderDialogButtonNone.innerHTML = "None";
    loaderDialogButtonNone.className = "gamebutton";
    loaderDialogButtonNone.style = "margin: 2px;width:75%;";
    loaderDialogButtonNone.setAttribute("onclick", "code_eval('switchCodeMode(CODE_MODE_NONE);');");

    /* LOADER dialog button: ClickAttack */
    let loaderDialogButtonClickAttack = document.createElement("div");
    loaderDialogButtonClickAttack.innerHTML = "Click-Attack";
    loaderDialogButtonClickAttack.className = "gamebutton";
    loaderDialogButtonClickAttack.style = "margin: 2px;width:75%;";
    loaderDialogButtonClickAttack.setAttribute("onclick", "code_eval('switchCodeMode(CODE_MODE_CLICK_ATTACK)');");

    /* LOADER dialog button: AutoAttack */
    let loaderDialogButtonAutoAttack = document.createElement("div");
    loaderDialogButtonAutoAttack.innerHTML = "Auto-Attack";
    loaderDialogButtonAutoAttack.className = "gamebutton";
    loaderDialogButtonAutoAttack.style = "margin: 2px;width:75%;";
    loaderDialogButtonAutoAttack.setAttribute("onclick", "code_eval('switchCodeMode(CODE_MODE_AUTO_ATTACK);');");

    /* LOADER dialog button: VSCode */
    let loaderDialogButtonVSCode = document.createElement("div");
    loaderDialogButtonVSCode.innerHTML = "VSCode";
    loaderDialogButtonVSCode.className = "gamebutton";
    loaderDialogButtonVSCode.style = "margin: 2px;width:75%;";
    loaderDialogButtonVSCode.setAttribute("onclick", "code_eval('switchCodeMode(CODE_MODE_VSCODE);');");

    /* LOADER dialog button: API */
    let loaderDialogButtonAPI = document.createElement("div");
    loaderDialogButtonAPI.innerHTML = "API";
    loaderDialogButtonAPI.className = "gamebutton";
    loaderDialogButtonAPI.style = "margin: 2px;width:75%;";
    loaderDialogButtonAPI.setAttribute("onclick", "code_eval('switchCodeMode(CODE_MODE_API);');");

    /* Loader dialog grid */
    let loaderDialogGrid = document.createElement("table");
    let row1 = loaderDialogGrid.insertRow();
    let row1Col0 = row1.insertCell();
    row1Col0.innerHTML = "<p style='font-size:24px;font-style:normal;margin:0px;'>Generic:</p>";
    let row1Col1 = row1.insertCell();
    row1Col1.appendChild(loaderDialogButtonNone);
    let row2 = loaderDialogGrid.insertRow();
    let row2Col0 = row2.insertCell();
    row2Col0.innerHTML = "<p style='font-size:24px;font-style:normal;margin:0px;'>Combat:</p>";
    let row2Col1 = row2.insertCell();
    row2Col1.appendChild(loaderDialogButtonClickAttack);
    let row2Col2 = row2.insertCell();
    row2Col2.appendChild(loaderDialogButtonAutoAttack);
    let row3 = loaderDialogGrid.insertRow();
    let row3Col0 = row3.insertCell();
    row3Col0.innerHTML = "<p style='font-size:24px;font-style:normal;margin:0px;'>Remote:</p>";
    let row3Col1 = row3.insertCell();
    row3Col1.appendChild(loaderDialogButtonVSCode);
    let row3Col2 = row3.insertCell();
    row3Col2.appendChild(loaderDialogButtonAPI);

    /* Create the LOADER dialog */
    loaderDialog = document.createElement("div");
    loaderDialog.id = "loader_dialog";
    loaderDialog.innerHTML = "<p>Test</p>";
    loaderDialog.style = "text-align: left";
    loaderDialog.innerHTML = "<h1 style='margin:0px;font-size:42px;'>LOADER</h1><h2 style='margin:0px;'>Code Modes</h2><hr style='margin-top:0px;'>" + loaderDialogGrid.outerHTML + "<p style='margin-bottom:0px;'>v1.0.0, 2021-03-23</p>";
    document.loaderDialog = loaderDialog.outerHTML;

    /* Create the LOADER menu button */
    let gamebuttons = document.getElementById("toprightcorner");
    loaderMenuButton = document.createElement("div");
    loaderMenuButton.id = "loader_menu_button";
    loaderMenuButton.className = "gamebutton promode";
    loaderMenuButton.innerHTML = "LOADER";
    loaderMenuButton.setAttribute("onclick", "show_modal(document.loaderDialog);");
    gamebuttons.insertBefore(loaderMenuButton, gamebuttons.childNodes[2]);

    code_eval("log('Reloaded LOADER')");
})();
`,skin:G.skills.snippet.skin,keycode:119});

function loadSpecificCode(mode)
{
    switch (mode) {
        case CODE_MODE_NONE:
            // Just do nothing at all
            break;
        case CODE_MODE_CLICK_ATTACK:
            loadCharacterBehaviourClickAttack();
            break;
        case CODE_MODE_AUTO_ATTACK:
            loadCharacterBehaviourAutoAttack();
            break; 
        case CODE_MODE_VSCODE:
            // Load the code from an active vscode Live server instance
            //createLoaderMenu();
            // TODO
            break;
        case CODE_MODE_API:
            // Load the code from the adventure-land-server API
            //destroyLoaderMenu();
            // TODO
            break;
        default:
            throw EXCEPTION_CODE_MODE_SWITCH_FAILED;
    }
}

function loadCharacterBehaviourClickAttack()
{
    let intervalId = setInterval(function(){
        loot();
    
        if(character.rip || is_moving(character)) return;
    
        let target = get_targeted_monster();
    
        if(target) {
            if (target) {
                change_target(target);
            } else {
                set_message("No monster selected!");
                return;
            }
    
            if(!is_in_range(target))
            {
                move(
                    character.x+(target.x-character.x)/2,
                    character.y+(target.y-character.y)/2
                );
            } else if(can_attack(target) && !is_on_cooldown("attack")) {
                set_message("Attacking");
                attack(target);
            }
        }
        
        
    
    },250);

    let healIntervalId = setInterval(function(){   
        if (character.mp < character.max_mp - 100) {
            if (!is_on_cooldown('regen_mp')) {
                use_skill('regen_mp');
            }
        }
        if (character.hp < character.max_hp - 50) {
            if (!is_on_cooldown('regen_hp')) {
                use_skill('regen_hp');
            }
        }
    },1750);

    LoaderEventManager.subscribe((name) => {
        if (name === CODE_MODE_SWITCH) {
            clearInterval(intervalId);
            clearInterval(healIntervalId);
        }
    });
}

function loadCharacterBehaviourAutoAttack()
{
    let intervalId = setInterval(function(){   
        loot();

        // If player is healable:
        if ((character.mp < character.max_mp - 100) || (character.hp < character.max_hp - 50)) {
            // If player is not being targeted by enemies: wait
            if (get_nearest_monster({target:character}) === null) {
                return;
            }
        }
    
        if(character.rip || is_moving(character)) return;
    
        var target = get_targeted_monster();
        if(!target)
        {
            // Select the nearest monster attacking the player
            target = get_nearest_monster({target:character});
            if (!target) {
                // If no monster attacks the player just pick any
                target = get_nearest_monster();
            }

            // If target has been found
            if (target) {
                // If too far away: do nothing
                if ((abs(target.x-character.x) > 200) || (abs(target.y-character.y) > 200)) {
                    set_message("Too far away");
                    return;
                // Otherwise: change to target
                } else {
                    change_target(target);
                }
            // If no target has been found: do nothing
            } else {
                set_message("No Monsters nearby");
                return;
            }
        }
        
        if(!is_in_range(target)) {
            move(
                character.x+(target.x-character.x)/2,
                character.y+(target.y-character.y)/2
                );
        } else if(can_attack(target) && !is_on_cooldown("attack")) {
            set_message("Auto-Attacking");
            attack(target);
        }
    
    },250);

    let healIntervalId = setInterval(function(){   
        if (character.mp < character.max_mp - 100) {
            if (!is_on_cooldown('regen_mp')) {
                use_skill('regen_mp');
            }
        }
        if (character.hp < character.max_hp - 50) {
            if (!is_on_cooldown('regen_hp')) {
                use_skill('regen_hp');
            }
        }
    },1750);

    LoaderEventManager.subscribe((name) => {
        if (name === CODE_MODE_SWITCH) {
            clearInterval(intervalId);
            clearInterval(healIntervalId);
        }
    });
}