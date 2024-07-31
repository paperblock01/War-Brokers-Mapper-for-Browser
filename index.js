function setup(gameid, alertid, infiniteid, signid, playerid) {
    let game = document.getElementById(gameid);
    let alert = document.getElementById(alertid);
    let infinite = document.getElementById(infiniteid);
    let sign = document.getElementById(signid);
    let player = document.getElementById(playerid);

    game.selectedIndex = 0;
    alert.checked = true;
    infinite.checked = false;
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

function pre_data(gameid, alertid, infiniteid, signid, playersid) {
    let game = document.getElementById(gameid);
    let alert = document.getElementById(alertid);
    let infinite = document.getElementById(infiniteid);
    let sign = document.getElementById(signid);
    let players = document.getElementById(playersid);

    let select_game = game.options[game.selectedIndex].text;
    let select_alert = alert.checked;
    let select_infinite = infinite.checked;
    let select_sign = sign.options[sign.selectedIndex].text
    let select_players = players.options[players.selectedIndex].text

    if (select_sign == "Greater") {
        select_sign = true;
    } else if (select_sign == "Less") {
        select_sign = false;
    }

    vars["playalert"] = select_alert;
    vars["finite"] = !select_infinite
    vars["game"] = select_game;
    vars["players"] = [select_sign, parseInt(select_players)];
}

function collect_data(id) {
    // This is returned as the data to be used in the wb_mapper script
    let data = "";

    let list = document.getElementById(id);
    let button = list.getElementsByTagName("button");

    let count = 0;
    // Loop through each button and determine which are disabled.
    for (let i=0; i<button.length; i++) {
        // If the button is disabled
        if (button[i].disabled) {
            // Add the button's value to the data string
            data += button[i].value + ",";

            count += 1;
        }
    }

    if (data == "" || count == button.length) {
        return "";
    } else {
        data = data.slice(0, -1);
        return data;
    }
}

function start() {

    pre_data('game', 'alert', 'infinite', 'sign', 'players')

    vars["mode"] = collect_data("modes_list")
    vars["map"] = collect_data("maps_list")
    vars["location"] = collect_data("regions_list")
    console.log(vars)
    wb_mapper("output");
    document.getElementById("output").innerHTML = "";
    document.getElementById("status").innerHTML = "Mapping, please wait...";

}

function stop() {
    vars["stop"] = true;
    console.log("Stopping...");
    document.getElementById("status").innerHTML = "Stopping..."
}

document.addEventListener('visibilitychange', function(e) {
    let inactive = !document.hidden;
    if (inactive) {
        document.title = "War Brokers Mapper";
    }
});

setup('game','alert','infinite','sign','players')
populate("modes", Modes_long)
populate("maps", Classic_maps)
populate("regions", Classic_regions)

