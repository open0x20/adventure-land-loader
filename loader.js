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

function switchCodeMode()
{
    let mode = localStorage.getItem(CODE_MODE);
    let newMode = "";

    switch (mode) {
        case CODE_MODE_NONE:
            newMode = CODE_MODE_CLICK_ATTACK;
            break;
        case CODE_MODE_CLICK_ATTACK:
            newMode = CODE_MODE_AUTO_ATTACK;
            break;
        case CODE_MODE_AUTO_ATTACK:
            newMode = CODE_MODE_VSCODE;
            break;    
        case CODE_MODE_VSCODE:
            newMode = CODE_MODE_API;
            break;
        case CODE_MODE_API:
            newMode = CODE_MODE_NONE;
            break;
        default:
            newMode = CODE_MODE_NONE;
    }

    // Notify all event subscribers about the code mode switch
    LoaderEventManager.triggerEvent(CODE_MODE_SWITCH);

    // Discard all old event subscribers
    LoaderEventManager.unsubscribeAll();

    // Deselect current target
    change_target(null);

    // Load the new source code
    loadSpecificCode(newMode);

    log("[CM]: " + newMode);
    localStorage.setItem(CODE_MODE, newMode);
}
map_key("P","snippet","switchCodeMode();");

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
            // TODO
            break;
        case CODE_MODE_API:
            // Load the code from the adventure-land-server API
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
            } else if(can_attack(target)) {
                set_message("Attacking");
                attack(target);
            }
        }
        
        
    
    },250);

    LoaderEventManager.subscribe((name) => {
        if (name === CODE_MODE_SWITCH) {
            clearInterval(intervalId);
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
        } else if(can_attack(target)) {
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