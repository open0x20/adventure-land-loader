/* File: loader
 * Description: Loads the game client logic from local or remotes sources. 
 */

// Code Mode Identifiers
const CODE_MODE = "CODE_MODE";                              // localStorage Identifier
const CODE_MODE_SWITCH = "CODE_MODE_SWITCH";                // LoaderEventManager Event Identifier

// Code Modes
const CODE_MODE_NONE = "CODE_MODE_NONE";
const CODE_MODE_CLICK_ATTACK = "CODE_MODE_CLICK_ATTACK";
const CODE_MODE_AUTO_ATTACK = "CODE_MODE_AUTO_ATTACK";
const CODE_MODE_LOCAL = "CODE_MODE_LOCAL";
const CODE_MODE_REMOTE = "CODE_MODE_REMOTE";

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

    // Load new source
    loadSpecificCode(mode);

    log("[CM]: " + mode);
    localStorage.setItem(CODE_MODE, mode);
}

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
    loaderDialogButtonNone.style = "margin: 2px;width:75%;";
    loaderDialogButtonNone.setAttribute("onclick", "code_eval('switchCodeMode(CODE_MODE_NONE);');");

    /* LOADER dialog button: ClickAttack */
    let loaderDialogButtonClickAttack = document.createElement("div");
    loaderDialogButtonClickAttack.innerHTML = "Click-Attack";
    loaderDialogButtonClickAttack.className = "gamebutton whiteborderhover";
    loaderDialogButtonClickAttack.style = "margin: 2px;width:75%;";
    loaderDialogButtonClickAttack.setAttribute("onclick", "code_eval('switchCodeMode(CODE_MODE_CLICK_ATTACK)');");

    /* LOADER dialog button: AutoAttack */
    let loaderDialogButtonAutoAttack = document.createElement("div");
    loaderDialogButtonAutoAttack.innerHTML = "Auto-Attack";
    loaderDialogButtonAutoAttack.className = "gamebutton whiteborderhover";
    loaderDialogButtonAutoAttack.style = "margin: 2px;width:75%;";
    loaderDialogButtonAutoAttack.setAttribute("onclick", "code_eval('switchCodeMode(CODE_MODE_AUTO_ATTACK);');");

    /* LOADER dialog button: Local */
    let loaderDialogButtonLocal = document.createElement("div");
    loaderDialogButtonLocal.innerHTML = "Local";
    loaderDialogButtonLocal.className = "gamebutton whiteborderhover";
    loaderDialogButtonLocal.style = "margin: 2px;width:75%;";
    loaderDialogButtonLocal.setAttribute("onclick", "code_eval('switchCodeMode(CODE_MODE_VSCODE);');");

    /* LOADER dialog button: Remote */
    let loaderDialogButtonRemote = document.createElement("div");
    loaderDialogButtonRemote.innerHTML = "Remote";
    loaderDialogButtonRemote.className = "gamebutton whiteborderhover";
    loaderDialogButtonRemote.style = "margin: 2px;width:75%;";
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

    /* Create the LOADER dialog */
    loaderDialog = document.createElement("div");
    loaderDialog.id = "loader_dialog";
    loaderDialog.innerHTML = "<p>Test</p>";
    loaderDialog.style = "text-align: left";
    loaderDialog.innerHTML =  "<h1 style='margin:0px;font-size:42px;'>LOADER</h1>";
    loaderDialog.innerHTML += "<h2 style='margin:0px;'>Code Modes</h2>";
    loaderDialog.innerHTML += "<hr style='margin-top:0px;'>"
    loaderDialog.innerHTML += loaderDialogGrid.outerHTML;

    loaderDialog.innerHTML += "<h2 style='margin:0px;'>Sources</h2>";
    loaderDialog.innerHTML += "<hr style='margin-top:0px;'>"

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
`,skin:G.skills.snippet.skin,keycode:119});

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
            loadCharacterBehaviourAutoAttack();
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

/**
 * import("https://cors.taco.open0x20.de/?url=https://raw.githubusercontent.com/open0x20/adventure-land-client/master/combat/in_simple_team.js");
 */