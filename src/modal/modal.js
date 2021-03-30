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
`,skin:G.skills.snippet.skin,keycode:119});