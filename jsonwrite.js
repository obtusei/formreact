import * as fs from "fs";
const path = "./data.json"; // Path to your JSON file
export const appendToJsonArray = (newData) => {
  // Step 1: Read the existing JSON file
  fs.readFile(path, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the file:", err);
      return;
    }

    let jsonArray;

    try {
      // Step 2: Parse the JSON data
      jsonArray = JSON.parse(data);
    } catch (parseErr) {
      console.error("Error parsing JSON data:", parseErr);
      return;
    }

    // Step 3: Append the new data to the array
    jsonArray.push(newData);

    // Step 4: Write the updated array back to the JSON file
    fs.writeFile(
      path,
      JSON.stringify(jsonArray, null, 2),
      "utf8",
      (writeErr) => {
        if (writeErr) {
          console.error("Error writing to the file:", writeErr);
          return;
        }
        console.log("Data successfully appended to the JSON file.");
      }
    );
  });
};
