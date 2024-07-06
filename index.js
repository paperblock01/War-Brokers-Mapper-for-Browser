async function get_server_data(region) {
  const res = await fetch(`https://store1.warbrokers.io/295//server_list.php?location=${region}`);

  if (res.ok) {
    console.log("Fetch Request SUCCESS");
    const data = await res.text();

    if (data === "0") {
      console.error("[ERROR]: Unknown region!");
      throw new Error("Unknown region!");
    }

    // Return an organized array of each data value
    return data.split(`,${region},`);
  } else {
    console.error("Fetch Request FAILED");
    throw new Error("Fetch request failed");
  }
}

// Usage
x = get_server_data('USA').then(data => console.log(data)).catch(error => console.error(error))

console.log(x);
