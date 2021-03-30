
map_key("F8",{name:"pure_eval",code:`(() => {
    let codeMode = localStorage.getItem("CODE_MODE");
    let loaderMenuButton = document.getElementById("loader_menu_button");
    let loaderDialog = document.getElementById("loader_dialog");

    /**
     * Additional styling
     */
    let styling = document.getElementById("loader_additional_styling");
    if (!styling) {
        styling = document.createElement("style");
        styling.id = "loader_additional_styling";
        styling.innerHTML = ".whiteborderhover:hover {border:4px solid white;} .whitehover:hover {color:white;} .colorgray {color:gray;}";
        document.getElementsByTagName("html")[0].appendChild(styling);
    }

    /** 
     * Delete custom GUI elements (for easier refreshing)
     */
    if (loaderMenuButton) {
        loaderMenuButton.remove();
    }
    if (loaderDialog) {
        loaderDialog.remove();
    }

    /* LOADER dialog button: None */
    let loaderDialogButtonNone = document.createElement("div");
    loaderDialogButtonNone.innerHTML = "None";
    loaderDialogButtonNone.className = "gamebutton whiteborderhover";
    loaderDialogButtonNone.style = "margin: 2px;width:72%;";
    loaderDialogButtonNone.setAttribute("onclick", "code_eval('switchCodeMode(CODE_MODE_NONE);');");

    /* LOADER dialog button: ClickAttack */
    let loaderDialogButtonClickAttack = document.createElement("div");
    loaderDialogButtonClickAttack.innerHTML = "Click-Attack";
    loaderDialogButtonClickAttack.className = "gamebutton whiteborderhover";
    loaderDialogButtonClickAttack.style = "margin: 2px;width:72%;";
    loaderDialogButtonClickAttack.setAttribute("onclick", "code_eval('switchCodeMode(CODE_MODE_CLICK_ATTACK)');");

    /* LOADER dialog button: AutoAttack */
    let loaderDialogButtonAutoAttack = document.createElement("div");
    loaderDialogButtonAutoAttack.innerHTML = "Auto-Attack";
    loaderDialogButtonAutoAttack.className = "gamebutton whiteborderhover";
    loaderDialogButtonAutoAttack.style = "margin: 2px;width:72%;";
    loaderDialogButtonAutoAttack.setAttribute("onclick", "code_eval('switchCodeMode(CODE_MODE_AUTO_ATTACK);');");

    /* LOADER dialog button: Local */
    let loaderDialogButtonLocal = document.createElement("div");
    loaderDialogButtonLocal.innerHTML = "Local";
    loaderDialogButtonLocal.className = "gamebutton whiteborderhover";
    loaderDialogButtonLocal.style = "margin: 2px;width:72%;";
    loaderDialogButtonLocal.setAttribute("onclick", "code_eval('switchCodeMode(CODE_MODE_VSCODE);');");

    /* LOADER dialog button: Remote */
    let loaderDialogButtonRemote = document.createElement("div");
    loaderDialogButtonRemote.innerHTML = "Remote";
    loaderDialogButtonRemote.className = "gamebutton whiteborderhover";
    loaderDialogButtonRemote.style = "margin: 2px;width:72%;";
    loaderDialogButtonRemote.setAttribute("onclick", "code_eval('switchCodeMode(CODE_MODE_API);');");

    /* LOADER dialog button: SET Local */
    let loaderDialogButtonSetLocal = document.createElement("div");
    loaderDialogButtonSetLocal.innerHTML = "SET";
    loaderDialogButtonSetLocal.className = "colorgray gamebutton whitehover";
    loaderDialogButtonSetLocal.style = "height:0px;border:none;margin-left:16px;";
    loaderDialogButtonSetLocal.setAttribute("onclick", "localStorage.setItem('loader_local_import_url', document.getElementById('loader_local_import_input').value) || code_eval('switchCodeMode(CODE_MODE_LOCAL);')");

    /* LOADER dialog button: SET Remote */
    let loaderDialogButtonSetRemote = document.createElement("div");
    loaderDialogButtonSetRemote.innerHTML = "SET";
    loaderDialogButtonSetRemote.className = "colorgray gamebutton whitehover";
    loaderDialogButtonSetRemote.style = "height:0px;border:none;margin-left:16px;";
    loaderDialogButtonSetRemote.setAttribute("onclick", "localStorage.setItem('loader_remote_import_url', document.getElementById('loader_remote_import_input').value) || code_eval('switchCodeMode(CODE_MODE_REMOTE);')");

    /* LOADER dialog button: Add Merchant Buttons */
    let loaderDialogButtonAddMerchantButton = document.createElement("div");
    loaderDialogButtonAddMerchantButton.innerHTML = "Add Merchant Buttons";
    loaderDialogButtonAddMerchantButton.className = "gamebutton whiteborderhover";
    loaderDialogButtonAddMerchantButton.style = "margin: 2px;";
    loaderDialogButtonAddMerchantButton.setAttribute("onclick", "code_eval('addMerchantButtons()');");


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
    row3Col0.innerHTML = "<p style='font-size:24px;font-style:normal;margin:0px;'>Source:</p>";
    let row3Col1 = row3.insertCell();
    row3Col1.appendChild(loaderDialogButtonLocal);
    let row3Col2 = row3.insertCell();
    row3Col2.appendChild(loaderDialogButtonRemote);

    /* Create the LOADER dialog / TITLE */
    loaderDialog = document.createElement("div");
    loaderDialog.id = "loader_dialog";
    loaderDialog.innerHTML = "<p>Test</p>";
    loaderDialog.style = "text-align: left";
    loaderDialog.innerHTML =  "<h1 style='margin:0px;font-size:42px;'>LOADER</h1>";
    loaderDialog.innerHTML += "<h2 style='margin:0px;'>Code Modes</h2>";
    loaderDialog.innerHTML += "<hr style='margin-top:0px;'>"
    loaderDialog.innerHTML += loaderDialogGrid.outerHTML;

    /* TITLE: Sources */
    loaderDialog.innerHTML += "<h2 style='margin:0px;'>Sources</h2>";
    loaderDialog.innerHTML += "<hr style='margin-top:0px;'>";

    let loader_dialog_local_input_html = "";
    loader_dialog_local_input_html += "<div style=''>";
    loader_dialog_local_input_html += "<p style='font-size:24px;margin-bottom:2px;margin-top:2px;'>Import local script (file/http/https):</p>";
    loader_dialog_local_input_html += "<div style='display:inline-block;background:black;color:gray;padding:2px;border:4px solid gray;'>";
    loader_dialog_local_input_html += "<input id='loader_local_import_input' class='codeui' placeholder='file://...' style='font-family:Pixel;color:white;background:transparent;border:none;font-size:28px;margin-left:4px;padding:0px;width:500px;height:44px'/>";
    loader_dialog_local_input_html += loaderDialogButtonSetLocal.outerHTML;
    loader_dialog_local_input_html += "</div>";
    loader_dialog_local_input_html += "</div>";
    loaderDialog.innerHTML += loader_dialog_local_input_html;

    let loader_dialog_remote_input_html = "";
    loader_dialog_remote_input_html += "<div style=''>";
    loader_dialog_remote_input_html += "<p style='font-size:24px;margin-bottom:2px;margin-top:2px;'>Import remote script (https):</p>";
    loader_dialog_remote_input_html += "<div style='display:inline-block;background:black;color:gray;padding:2px;border:4px solid gray;'>";
    loader_dialog_remote_input_html += "<input id='loader_remote_import_input' class='codeui' placeholder='https://...' style='font-family:Pixel;color:white;background:transparent;border:none;font-size:28px;margin-left:4px;padding:0px;width:500px;height:44px'/>";
    loader_dialog_remote_input_html += loaderDialogButtonSetRemote.outerHTML;
    loader_dialog_remote_input_html += "</div>";
    loader_dialog_remote_input_html += "</div>";
    loaderDialog.innerHTML += loader_dialog_remote_input_html;

    /* TITLE: Additional */
    loaderDialog.innerHTML += "<h2 style='margin:0px;'>Additional</h2>";
    loaderDialog.innerHTML += "<hr style='margin-top:0px;'>"; loaderDialogButtonAddMerchantButton
    loaderDialog.innerHTML += "<div style=''>";
    loaderDialog.innerHTML += loaderDialogButtonAddMerchantButton.outerHTML;
    loaderDialog.innerHTML += "</div>";

    /* Version */
    loaderDialog.innerHTML += "<p style='margin-bottom:0px;'>v1.0.0, 2021-03-23</p>"
    document.loaderDialog = loaderDialog.outerHTML;

    /* Create the LOADER menu button */
    let gamebuttons = document.getElementById("toprightcorner");
    loaderMenuButton = document.createElement("div");
    loaderMenuButton.id = "loader_menu_button";
    loaderMenuButton.className = "gamebutton promode";
    loaderMenuButton.innerHTML = "LOADER";
    loaderMenuButton.setAttribute("onclick", "show_modal(document.loaderDialog); (document.getElementById('loader_local_import_input').value = localStorage.getItem('loader_local_import_url')); (document.getElementById('loader_remote_import_input').value = localStorage.getItem('loader_remote_import_url'))");
    gamebuttons.insertBefore(loaderMenuButton, gamebuttons.childNodes[2]);

    code_eval("log('Reloaded LOADER')");
})();
`,skin:G.skills.snippet.skin,keycode:119});function addMerchantButtons()
{
    add_bottom_button('giveToMerchant1', 'Give 1', () => {
        send_item('TacoMerchant', 41, 1);
        setTimeout(() => {
            if (character.items[41] === null) {
                swap(40, 41);
                swap(39, 40);
                swap(38, 39);
                swap(37, 38);
                swap(36, 37);
                swap(35, 36);
            }
        }, 150);
    });
    add_bottom_button('giveToMerchant10', 'Give 10', () => {
        send_item('TacoMerchant', 41, 10);
        if (character.items[41] !== null) {
            setTimeout(() => {
                if (character.items[41] === null) {
                    swap(40, 41);
                    swap(39, 40);
                    swap(38, 39);
                    swap(37, 38);
                    swap(36, 37);
                    swap(35, 36);
                }
            }, 150);
        }
    });
}/**
 * Chains attacks with setTimeout() and the attack cooldown.
 * The chain stops after a new target or no target has been selected.
 */
function loader_base_attack_chain(targetId)
{
    let target = get_targeted_monster();

    if (!target) {
        return;
    }

    // If targets changed stop this loop
    if (target.id !== targetId) {
        return;
    }

    let timeout = (parent.next_skill['attack'] - new Date()) + character.ping * 0.95;
    if (timeout < 0) {
        timeout = 0;
    }

    if (timeout === 0) {
        if (is_in_range(target, 'attack')) {
            attack(target).then( 
                function(data) {
                    // attack succeeded
                    reduce_cooldown('attack', character.ping*0.95);
                },
                function(data) {
                    // attack failed
                    log('failed to attack: ' + targetId + ' (' + data.reason + ')');
                }
            );
    
            timeout = 1000 / character.frequency;
        } else {
            timeout = 100;
        }
    }

    setTimeout(function() {
        loader_base_attack_chain(targetId);
    }, timeout);
}function loader_base_calc_remaining_range_distance(cx, cy, tx, ty, range)
{
    let distance_full = Math.sqrt(Math.pow(cx - tx,2) + Math.pow(cy - ty,2))
    let distance_needed = distance_full - range;
    let alpha = Math.asin(abs((ty - cy)) / distance_full) * 180 / Math.PI;
    let xoff = (distance_needed * Math.sin((180 - 90 - alpha) * Math.PI / 180)) / Math.sin(90 * Math.PI / 180);
    let yoff = Math.sqrt(Math.pow(xoff, 2) - 2 * xoff * distance_needed * Math.cos(alpha * Math.PI / 180) + Math.pow(distance_needed, 2));

    if (tx < cx) xoff *= -1;
    if (ty < cy) yoff *= -1;

    return {
        xoff:xoff,
        yoff:yoff
    };
}/**
 * args:
 *  - interval: interval in milliseconds (default: 1000)
 */
function loader_loops_healing_loop(args)
{
    let interval = (args.interval ? args.interval : 1000);

    let id = setInterval(function() {
        
        if (character.mp < character.max_mp - 100) {
            if (!is_on_cooldown('regen_mp')) {
                use_skill('regen_mp');
                return;
            }
        } else if ((character.mp < character.max_mp - 400)) {
            use_skill('use_mp');
            return;
        }
        
        if (character.hp > character.max_hp - 450) {
            if (!is_on_cooldown('regen_hp')) {
                use_skill('regen_hp');
                return;
            }
        } else if ((character.hp < character.max_hp - 500)) {
            use_skill('use_hp');
            return;
        }

    }, interval);
    Loader.appendIntervalId(id);
}/**
 * Selects a target closest to the player. 
 * 
 * args:
 *  - interval: interval in milliseconds (default: 1000)
 *  - onTargetFoundCallback: A callback that will be called when a new target has been found (with arguments: target.id)
 *  - monsterTypeLimit: A string (e.g.: "goo") that limits the targeted monsters to given type
 *  - rangeLimit: Search range limit in pixels (default: 200)
 */
function loader_loops_targeting_loop(args)
{
    let interval = (args.interval ? args.interval : 1000);
    let rangeLimit = (args.rangeLimit ? args.rangeLimit : 200);

    let id = setInterval(function() {
        // If we already have a selected target: skip this interval
        if (get_targeted_monster()) return;

        // Select the nearest monster attacking the player
        let target = get_nearest_monster({target:character});


        // If no monster attacks the player just pick the closest or the closest of type monsterNameFilter
        if (!target) {
            if (args.monsterTypeLimit) {
                target = get_nearest_monster({type:args.monsterTypeLimit});
            } else {
                target = get_nearest_monster();
            }
        }

        // If we found a suitable target
        if (target) {
            // If target is too far away: skip this interval
            if ((abs(target.x-character.x) > rangeLimit) || (abs(target.y-character.y) > rangeLimit)) {
                return;
            }

            change_target(target);

            // If a callback has been supplied: call it
            if (args.onTargetFoundCallback) {
                setTimeout(function() {
                    args.onTargetFoundCallback(target.id)
                }, character.ping * 0.95);
                // The character target may not be updated immediately, that's why we wait a bit
            }
        }
    }, interval);
    Loader.appendIntervalId(id);
}/**
 * 
 * args:
 *  - interval: interval in milliseconds (default: 1000)
 */
function loader_loops_move_into_range(args)
{
    let interval = (args.interval ? args.interval : 1000);

    let id = setInterval(function(){   
        loot();

        if(character.rip || is_moving(character)) return;
    
        var target = get_targeted_monster();
        if(target) {
            if(!is_in_range(target)) {
                let travel = loader_base_calc_remaining_range_distance(character.x, character.y, target.x, target.y, character.range);
                
                move(
                    character.x + travel.xoff,
                    character.y + travel.yoff
                );
            }
        }
    }, interval);
    Loader.appendIntervalId(id);
}class AutoAttackBehaviour
{
    engage()
    {
        loader_loops_targeting_loop({
            interval: 1000,
            onTargetFoundCallback: loader_base_attack_chain,
            monsterTypeLimit: 'goo',
            rangeLimit: 200
        });

        loader_loops_healing_loop({
            interval: 500
        });

        loader_loops_move_into_range({
            interval: 200
        });
    }
}/* File: loader
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

    log("[CM]: " + mode);
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
            loadCharacterBehaviourClickAttack();
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