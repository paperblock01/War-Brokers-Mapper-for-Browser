 x = "";

fetch("https://store1.warbrokers.io/295//server_list.php?location=USA")
  .then(res => {
    if (res.ok) {
      console.log("Fetch Request SUCCESS");
    } else {
      console.log("Fetch Request FAILED");
    }
    return res.text();
  })
  .then(data => {
    if (data === "0") {
      console.log("[ERROR]: Unknown region!");
      process.exit(1)
    }

    console.log(data);
    x = data
  })

  document.getElementById("x").innerHTML = x;
