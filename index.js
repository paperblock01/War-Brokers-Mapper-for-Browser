function loadparas() {
    const query = new URLSearchParams(window.location.search);
    const game = query.get("game");
    const alert = query.get("alert");
    const player = query.get("players");
    const mode = query.get("modes");
    const map = query.get("maps");
    const region = query.get("regions");

    const game_select = document.getElementById("game");

    // Game Mode
    if (game != null) {
        if (game.toLowerCase() == "classic") {
            game_select.selectedIndex = 0;
        } else if (game.toLowerCase() == "4v4") {
            game_select.selectedIndex = 1;
            if_4v4("game","add_modes","modes_select","modes_list")
        } else {
            console.error("Unknown game '" + game + "'")
        }
    }

    // Alert
    if (alert != null) {
        if (alert.toLowerCase() == "true") {
            document.getElementById("alert").checked = true;
        } else if (alert.toLowerCase() == "false") {
            document.getElementById("alert").checked = false;
        } else {
            console.error("Unknown parameter '" + alert + "'");
        }
    }

    // Players
    if (player != null) {
        let sign = player.slice(0,1);
        let players = player.slice(1,player.length);
        // Sign
        if (sign.toLowerCase() == "g") {
            document.getElementById("sign").selectedIndex = 0;
        } else if (sign.toLowerCase() == "l") {
            document.getElementById("sign").selectedIndex = 1;
        } else {
            console.error("Unknown sign '" + sign + "'");
        }
        // Num
        if (!isNaN(parseInt(players))) {
            if (parseInt(players) <= 16 && parseInt(players) >= 1) {
                document.getElementById("players").selectedIndex = parseInt(players) - 1;
            } else {
                console.error("'" + players + "' is out of range.")
            }
        } else {
            console.error("Unknown number '" + players + "'." )
        }

    }

    // Mode
    if (mode != null && game_select.selectedIndex != 1) {
        modes = mode.split(",");
        for (let i in modes) {
            let select = document.getElementById(modes[i]);
            if (select != null) {
              select.click();
            }
        }
    }

    // Map
    if (map != null) {
        maps = map.split(",");
        for (let i in maps) {
            let select = document.getElementById(maps[i]);
            if (select != null) {
                select.click();
            }
        }
    }

    // Region
    if (region != null) {
        regions = region.split(",");
        for (let i in regions) {
            let select = document.getElementById(regions[i].toUpperCase());
            if (select != null) {
                select.click();
            }
        }
    }
}

function setup(gameid, alertid, signid, playerid) {
    let game = document.getElementById(gameid);
    let alert = document.getElementById(alertid);
    let sign = document.getElementById(signid);
    let player = document.getElementById(playerid);

    game.selectedIndex = 0;
    alert.checked = true;
    sign.selectedIndex = 0;
    player.selectedIndex = 0;
}

function collapse(part, self) {
    // Part describes the index of the part
    let parts = ["modes", "maps", "regions"];
    let img_parts = ["mode", "map", "reg"];

    let id = document.getElementById("add_" + parts[part]);
    let img = document.getElementById(self);

    // Remove the selected part from the parts array
    parts.splice(part, 1);
    img_parts.splice(part, 1);

    if (id.style.display === "none") {
        id.style.display = "block";
        img.src = "./Assets/arrow_down_icon.png";

        // Collapse the other dropdowns
        for (let i=0; i<parts.length; i++) {
            document.getElementById("add_" + parts[i]).style.display = "none";
            document.getElementById(img_parts[i] + "_img").src = "./Assets/arrow_up_icon.png"
        }

    } else {
        id.style.display = "none";
        img.src = "./Assets/arrow_up_icon.png";
    }
}

function search(value, list) {
    let input = document.getElementById(value).value.toLowerCase();
    let terms = document.getElementById(list);
    let button = terms.getElementsByTagName("button");
    // Loop through the items for each list of modes, maps, or regions
    for (let i=0; i<button.length; i++) {
        item = button[i].textContent.toLowerCase();
        if (item.indexOf(input) > -1) {
            button[i].style.display = "";
        } else {
            button[i].style.display = "none";
        }
    }

}

function clearsearch(input) {
    document.getElementById(input).value = "";
}

function remove(el,item, base) {
    let selection = item.innerHTML;
    let all = document.getElementById("all_" + base);
    let preview = ", " + all.textContent;

    // Make the button clickable again, allowing you to add the item
    item.disabled = false;
    // Remove the selected item from the list
    el.remove();

    // Remove the selection from the preview
    preview = preview.replace(", " + selection, "");

    // If the comma and space are still there, remove them
    if (preview[0] == ",") {
        preview = preview.slice(2);
    }

    // If nothing remains
    if (preview == "") {
        preview = "All"
    }

    all.textContent = preview;

}

function select(item, display, base) {
    let selection = document.getElementById(item);
    let show = document.getElementById(display);
    let id = selection.value + "_select";
    let all = document.getElementById("all_" + base);
    let preview = all.textContent;

    // If the preview contains "All", set it to ""
    if (preview == "All") {
        preview = selection.innerHTML;
    } else {
        preview += ", " + selection.innerHTML;
    }

    all.textContent = preview;


    // Disable the button that allowed you to add it
    selection.disabled = true;

    // Add what was selected to the base_select div
    show.innerHTML += `<span id="${id}"><a>${selection.innerHTML}</a> <button onclick="remove(${id},${item},'${base}')">X</button>&nbsp;&nbsp;<span>`
}

function populate(base, list) {
    let id = base + "_list";
    let select = base + "_select"
    let modes = "";

    for (let i in list) {
        modes += `<button value="${list[i]}" id="${list[i]}" onclick="select(this.value,'${select}','${base}')">${i}</button>`
    }

    // First clear anything there before
    document.getElementById(id).innerHTML = "";

    document.getElementById(id).innerHTML = modes;
}
// Messy ass function that is quite unreuseable. Good luck figureing it out me in the future.
function if_4v4(id, add, select, list) {
    let game = document.getElementById(id);
    let mode = document.getElementById("mode");
    let modes = document.getElementById(add)
    let selected = document.getElementById(select);
    let listed = document.getElementById(list).getElementsByTagName('*');

    if (game.options[game.selectedIndex].text == "4v4") {
        mode.style.pointerEvents = "none";
        mode.style.backgroundColor = "gray";
        modes.style.display = "none";
        document.getElementById("mode_img").src = "./Assets/arrow_up_icon.png"
        document.getElementById("all_modes").textContent = "All";
        document.getElementById("all_maps").textContent = "All";
        document.getElementById("all_regions").textContent = "All";

        // Remove all the selected things
        selected.innerHTML = "";
        document.getElementById("maps_select").innerHTML = "";
        document.getElementById("regions_select").innerHTML = "";

        // Change the spawn for 4v4
        populate("maps", Fourv4_maps)
        populate("regions", Fourv4_regions)

        // Make all the mode buttons clickable if any were selected before
        for (let i=0; i<listed.length; i++) {
            listed[i].disabled = false;
        }

    } else if (game.options[game.selectedIndex].text == "Classic") {
        mode.style.pointerEvents = "auto";
        mode.style.backgroundColor = "white";

        // Change the spawn for Classic
        populate("maps", Classic_maps)
        populate("regions", Classic_regions)
    }

}

function pre_data(gameid, alertid, signid, playersid) {
    let game = document.getElementById(gameid);
    let alert = document.getElementById(alertid);
    let sign = document.getElementById(signid);
    let players = document.getElementById(playersid);

    let select_game = game.options[game.selectedIndex].text;
    let select_alert = alert.checked;
    let select_sign = sign.options[sign.selectedIndex].text
    let select_players = players.options[players.selectedIndex].text

    if (select_sign == "Greater") {
        select_sign = true;
    } else if (select_sign == "Less") {
        select_sign = false;
    }

    vars["playalert"] = select_alert;
    vars["game"] = select_game;
    vars["players"] = [select_sign, parseInt(select_players)];
}

function collect_data(id) {
    // This is returned as the data to be used in the wb_mapper script
    let data = "";

    let list = document.getElementById(id);
    let button = list.getElementsByTagName("button");

    // Loop through each button and determine which are disabled.
    for (let i=0; i<button.length; i++) {
        // If the button is disabled
        if (button[i].disabled) {
            // Add the button's value to the data string
            data += button[i].value + ",";
        }
    }

    data = data.slice(0, -1);
    return data;
}

function save_config() {
    let game = document.getElementById("game");
    let alert = document.getElementById("alert").checked;
    let sign = document.getElementById("sign").selectedIndex;
    let players = document.getElementById("players").selectedIndex;
    let modes = collect_data("modes_list");
    let maps = collect_data("maps_list");
    let regions = collect_data("regions_list");

    if (sign == 0) {
        sign = "G";
    } else {
        sign = "L";
    }

    let params = window.location.href.split("?")[0] + "?game=" + game[game.selectedIndex].value + "&alert=" + alert + "&players=" + sign + (players + 1).toString();

    if (modes != "") {
        params += "&modes=" + modes;
    }

    if (maps != "") {
        params += "&maps=" + maps;
    }
    if (regions != "") {
        params += "&regions=" + regions;
    }

    return params
}

function show_config() {
    let popup = document.getElementById("popup");
    let link = document.getElementById("saved_config");

    link.textContent = save_config();
    link.href = save_config();
    popup.style.display = "block";
}

function close_config() {
    document.getElementById("popup").style.display = "none";
}

function start() {

    pre_data('game', 'alert', 'sign', 'players')

    vars["mode"] = collect_data("modes_list")
    vars["map"] = collect_data("maps_list")
    vars["location"] = collect_data("regions_list")

    wb_mapper("output");
    document.getElementById("output").innerHTML = "";
    document.getElementById("status").innerHTML = "Mapping, please wait...";

}

function stop() {
    vars["stop"] = true;
    console.log("Stopping...");
    document.getElementById("status").innerHTML = "Stopping..."
}

// Change the title of the webpage
document.addEventListener('visibilitychange', function(e) {
    if (!document.hidden) {
        document.title = "War Brokers Mapper";
    }
});

setup('game','alert','sign','players')
populate("modes", Modes_long)
populate("maps", Classic_maps)
populate("regions", Classic_regions)

loadparas();

