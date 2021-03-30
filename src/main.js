/* File: loader
 * Description: Loads the game client logic from local or remotes sources. 
 *
 * import("https://cors.taco.open0x20.de/?url=https://raw.githubusercontent.com/open0x20/adventure-land-client/master/combat/in_simple_team.js");
 */

// Code Mode Identifiers
const CODE_MODE = "CODE_MODE";                              // localStorage Identifier
const CODE_MODE_SWITCH = "CODE_MODE_SWITCH";                // Loader Event Identifier

// Code Modes
const CODE_MODE_NONE = "CODE_MODE_NONE";
const CODE_MODE_CLICK_ATTACK = "CODE_MODE_CLICK_ATTACK";
const CODE_MODE_AUTO_ATTACK = "CODE_MODE_AUTO_ATTACK";
const CODE_MODE_LOCAL = "CODE_MODE_LOCAL";
const CODE_MODE_REMOTE = "CODE_MODE_REMOTE";

// Text Constants
const EXCEPTION_CODE_MODE_SWITCH_FAILED = "Failed to switch code mode!";

const Loader = {
    /* Event Management Stuff */
    subscribers: [],
    subscribe: function(callback) {
        this.subscribers.push(callback);
    },
    unsubscribe: function(callback) {
        this.subscribers.remove(callback);
    },
    unsubscribeAll: function() {
        this.subscribers = [];
    },
    triggerEvent: function(name) {
        this.subscribers.forEach(callback => {
            callback(name)
        });
    },

    /* Script Helper Stuff */
    globalIntervalIds: [],
    globalCharacterEventIds: [],
    appendIntervalId: function(id) {
        this.globalIntervalIds.push(id);
    },
    appendCharacterEventId: function(id) {
        this.globalCharacterEventIds.push(id);
    },
    clearGlobalIntervals: function(id) {
        this.globalIntervalIds.forEach((id) => {
            clearInterval(id);
        });
        this.globalIntervalIds = [];
    },
    clearGlobalCharacterEvents: function() {
        this.globalCharacterEventIds.forEach((id) => {
            var listenerIdx = character.listeners.indexOf(character.listeners.find(function(curr) {
                if (curr.id === id)
                    return true;
            }));
            character.listeners.splice(listenerIdx);
        });
        this.globalCharacterEventIds = [];
    }
};

function switchCodeMode(mode)
{
    // Notify all event subscribers about the code mode switch
    Loader.triggerEvent(CODE_MODE_SWITCH);

    // Clear all globally registered intervals/events
    Loader.clearGlobalIntervals();
    Loader.clearGlobalCharacterEvents();

    // Discard all old event subscribers
    Loader.unsubscribeAll();

    // Deselect current target
    change_target(null);

    // Load new source
    loadSpecificCode(mode);

    log("[LD]: " + mode);
    localStorage.setItem(CODE_MODE, mode);
}

function loadSpecificCode(mode)
{
    let url = "";
    var scriptLocal = {};
    var scriptRemote = {};

    switch (mode) {
        case CODE_MODE_NONE:
            // Just do nothing at all
            break;
        case CODE_MODE_CLICK_ATTACK:
            // Switch to click-attack behaviour
            (new OnClickAttackBehaviour()).engage();
            break;
        case CODE_MODE_AUTO_ATTACK:
            // Switch to auto-attacking behaviour
            (new AutoAttackBehaviour()).engage();
            break; 
        case CODE_MODE_LOCAL:
            // Load code from a local source
            url = localStorage.getItem("loader_local_import_url");
            if (url) {
                scriptLocal = document.getElementById("loader_local_script");
                if (scriptLocal) {
                    scriptLocal.remove();
                }
                var scriptLocal = document.createElement("script");
                scriptLocal.id = "loader_local_script";
                scriptLocal.src = url;
                document.getElementById("code").appendChild(scriptLocal);
            }
            break;
        case CODE_MODE_REMOTE:
            // Load code from a remote source
            url = localStorage.getItem("loader_remote_import_url");
            if (url) {
                scriptRemote = document.getElementById("loader_remote_script");
                if (scriptRemote) {
                    scriptRemote.remove();
                }
                var scriptRemote = document.createElement("script");
                scriptRemote.id = "loader_remote_script";
                scriptRemote.src = url;
                document.getElementById("code").appendChild(scriptRemote);
            }
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
    Loader.appendIntervalId(intervalId);

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
    Loader.appendIntervalId(healIntervalId);
}