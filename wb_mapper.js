

async function fetch_server_data(region) {
  try {
    const response = await fetch("https://store1.warbrokers.io/295//server_list.php?location="+region);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    // Return the raw server data
    return response.text().then(data => data.split(","+region+","));
  }
  catch (error) {
    console.error(error);
  }
}

function set_data(game,players,mode,map,location) {
  // list for the finalized data
  let data = [];

  // Store the mode
  modes = mode;

// Game
  // If a game that is not classic or 4v4 is selected
  if (game.toLowerCase() != "classic" && game.toLowerCase() != "4v4") {
    console.error("Unknown game selected!");
  }

  // Variable to store which regions depending on the mode played
  let game_regions;

  // If the game is classic, add all the classic locations
  if (game.toLowerCase() == "classic") {
    game_regions = classic;
  }
  // Add all the 4v4 locations
  else if (game.toLowerCase() == "4v4") {
    game_regions = fourvfour;
    // Unselect any modes
    modes = "";
  }

  // Add the game to the data
  data.push(game.toLowerCase());


// Players
  // Add the player list to data
  data.push(players);

// Mode
  // Makes an array of each selected mode in an ordered manner
  let striped_mode = mode.toLowerCase().split(" ").join("").split(",");

  // If no mode is selected
  if (modes == "") {
    data.push("all");
  }
  // If the inputted modes exist as keys in the Modes object
  else if (striped_mode.every(key => Modes.hasOwnProperty(key))) {
    // Match each mode with its number from the modes list
    for (let i = 0; i < striped_mode.length; i++) {
      // Change the string to the matching number in the striped_mode list
      striped_mode[i] = Modes[striped_mode[i]];
    }

    // Add the new striped_mode list to data
    data.push(striped_mode);
  }
  else {
    console.error("[ERROR]: Unknown mode selected!");
  }

// Map
  // Makes an ordered list of selected maps
  let striped_map = map.toLowerCase().split(" ").join("").split(",");

  // If no map is selected
  if (map == "") {
    data.push("all");
  }
  // If the inputted maps exist as keys in the Maps object
  else if (striped_map.every(key => Maps.hasOwnProperty(key))) {
    // Match each map to its number from the maps list
    for (let i = 0; i < striped_map.length; i++) {
      // Change the string to the matching number in the striped_map list
      striped_map[i] = Maps[striped_map[i]];
    }

    // Add the new striped_map list to data
    data.push(striped_map);
  }
  else {
    console.error("[ERROR]: Unknown map selected!");
  }

// Location
  // If no location is selected
  if (location == "") {
    // Add the regions based on the game selected
    data.push(game_regions);
  }
  // If certain locations are set
  else if (location != "") {
    // Orders the string of locations
    let striped_location = location.toUpperCase().split(" ").join("").split(",");

    // If all the inputted regions are actual regions in the selected game region
    if (striped_location.every(key => game_regions.includes(key))) {
      data.push(striped_location);
    }
  }
  else {
    console.error ("[ERROR]: Unknown regions selected! Check set game.");
  }

  return data;
}

function player_check(server_data, set_data) {
  // The index of the sign. True is >=. False is <=.
  const sign = set_data[1][0];
  // The index for the set number of players
  const num = parseInt(set_data[1][1]);

  if (num == 0) {
    console.error("[ERROR]: Number of players cannot Be zero!");
  }

  let players = [];
  // Sort the server data into their own arrays. Ignoring the first string.
  for (let i = 1; i < server_data.length; i++) {
    // Split the server data into values
    x = server_data[i].split(",");
    // The number of players is the third value
    players.push(parseInt(x[2]));
  }

  // Array describing if a server matches the player criteria
  let check = [];

  // Loop through the players in each server
  for (let i=0; i<players.length; i++) {
    // If there are no players in the server, skip
    if (players[i] == 0) {
      check.push(0);
      continue;
    }
    // If sign is true and players in the server is >= num
    else if (sign && players[i] >= num) {
      check.push(1);
    }
    // If sign is false and players in the server is <= num
    else if (!sign && players[i] <= num) {
      check.push(1);
    }
    // If the server does not match the player criteria, add a 0
    else {
      check.push(0);
    }
  }

  return check;
}

function mode_check(server_data, set_data) {
    // Index for the array of wanted game modes
    const wanted = set_data[2];

    // If all maps are allowed
    if (wanted == "all") {
        return true;
    }

    // Array for the server's current modes
    let modes = [];
    // Sort the server data into their own arrays. Ignoring the first string
    for (let i=1; i<server_data.length; i++) {
      // Split the server data into values
      x = server_data[i].split(",");
      // The game mode data is the second value
      modes.push(parseInt(x[1]));
    }

    // Array describing if a server matches the mode criteria
    let check = [];

    // Loop through the mode on each server
    for (let i=0; i<modes.length; i++) {
      // If the mode on the server is in the list of wanted modes
      if (wanted.includes(modes[i]))
        check.push(1);
      else {
        check.push(0);
      }
    }

    return check
}

function map_check(server_data, set_data) {
  // Index for the array of wanted maps
  const wanted = set_data[3];

  // If all maps are allowed
  if (wanted == "all") {
    return true;
  }

  let maps = [];
  // Sort the server data into their own arrays. Ignoring the first string.
  for (let i=1; i<server_data.length; i++) {
    // Split the server data into values
    x = server_data[i].split(",");
    // The map data is the fourth value
    maps.push(parseInt(x[3]));
  }

  // Array describing if a server matches the map criteria
  let check = [];
  // Loop through the maps on each server
  for (let i=0; i<maps.length; i++) {
    // If the map on the server is in the list of wanted maps
    if (wanted.includes(maps[i])) {
      check.push(1);
    }
    else {
      check.push(0);
    }
  }
  return check;
}

function output(server_data, index, location) {
  // Skip the first data value in server_data
  const data = server_data[index+1].split(",");
  // Information about the server
  let player = parseInt(data[2]);
  let mode = parseInt(data[1]);
  let map = parseInt(data[3]);

  // Find the name of the mode on the server
  for (let i in Modes_long) {
    // If the mode on the server matches one of the predefined modes
    if (mode = Modes_long[i]) {
      mode = i.toUpperCase();
      break;
    }
    else {
      continue;
    }
  }

  // Find the name of the map on the server
  for (let j in Maps) {
    if (map == Maps[j]) {
      map = j.toUpperCase();
      break;
    }
    else {
      continue;
    }
  }

  return `${location} : ${mode} : ${map} (${data[2]}) : ${player} / 16 players\n`
}

function game_check(server_data, set_data, region) {
  // check is a variable that is set to True when a match is found
  let check = 0;
  // Stores the string that describes each server that matches
  let str_output = "";

  // The matches of players, modes, and maps in the server
  player = player_check(server_data,set_data)
  mode = mode_check(server_data,set_data)
  map = map_check(server_data,set_data)

  // If mode or map are not set to anything (they are set to true)
  // Set them to an array of 1's equal in length to the player array
  if (mode == true) {
    mode = new Array(player.length).fill(1);
  }
  if (map == true) {
    map = new Array(player.length).fill(1);
  }

  for (let j=0; j<player.length; j++) {
    // If all values in the check list are 1 and true
    if (player[j] && mode[j] && map[j]) {
      str_output += output(server_data, j, region);
      // Add a 1 for a server that matches
      check += 1;
    }
    // Otherwise check the next server
    else {
      continue
    }
  }
  // Return the number of servers that match and the output string
  return [check, str_output];
}

// Set delay that delays the program
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function wb_mapper(id) {
(async () => {
  try {
    settings = set_data(vars["game"],vars["players"],vars["mode"],vars["map"],vars["location"]);
    while (true) {
      // Number of servers that match
      let check = 0;
      // Stores the string that outputs information about the matching servers
      let str_output = "";

      // Loop through all the set regions from settings
      for (let i=0; i<settings[4].length; i++) {
        // Gets server data for the current region
        const server_data = await fetch_server_data(settings[4][i]);
        const wb_map = game_check(server_data, settings, settings[4][i]);

        // Add the number of matching servers to the check variable
        check += wb_map[0];
        // Add the output string
        str_output += wb_map[1];
      }

      // Add part about matches
      str_output += "- Found " + check + " match" + (check == 1? "!" : "es!\n")

      // If more then 0 servers match
      if (check) {
        document.getElementById(id).textContent = str_output;
      }

      // If playalert is set, play the sound
      if (vars["playalert"]) {

      }

      // If finite is set, break the loop
      if (vars["finite"]) {
        break;
      }

      // Wait 30 seconds so the server isn't pinged forever
      await delay(30000)

    }
  } catch (error) {
    // Handle errors here if necessary
    console.error('Error in fetchData:', error);
  }

})();
}



wb_mapper();





