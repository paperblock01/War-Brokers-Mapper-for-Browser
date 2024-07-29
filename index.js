
let end = false;

function collapse(part, self) {
    let id = document.getElementById("add_" + part);
    let img = document.getElementById(self);
    if (id.style.display === "none") {
        id.style.display = "block";
        img.src = "./Assets/arrow_down_icon.png";
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

function remove(el,item) {
    // Make the button clickable again, allowing you to add the item
    item.disabled = false;
    el.remove();
}

function select(item, display) {
    selection = document.getElementById(item);
    show = document.getElementById(display);
    id = selection.value + "_select";

    // Disable the button that allowed you to add it
    selection.disabled = true;

    show.innerHTML += `<span id="${id}"><a>${selection.innerHTML}</a> <button onclick="remove(${id},${item})">X</button><span>`
}

// Display all the list names in the id of the div
function populate(base, list) {
    let id = base + "_list";
    let select = base + "_select"
    let modes = "";

    for (let i in list) {
        modes += `<button value="${list[i]}" id="${list[i]}" onclick="select(this.value,'${select}')">${i}</button>`
    }

    // First clear anything there before
    document.getElementById(id).innerHTML = "";

    document.getElementById(id).innerHTML = modes;
}

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
        selected.innerHTML = "";
        // Make all the mode buttons clickable if any were selected before
        for (let i=0; i<listed.length; i++) {
            listed[i].disabled = false;
        }

    } else if (game.options[game.selectedIndex].text == "Classic") {
        mode.style.pointerEvents = "auto";
        mode.style.backgroundColor = "white";
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

    wb_mapper("output");

}
function stop() {
    vars["finite"] = true;
}

populate("modes", Modes_long)
populate("maps", Classic_maps)
populate("regions", Classic_regions)

