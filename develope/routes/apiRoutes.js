// Linking the noteContents in db to this routes.
var noteContents = require("../db/noteContents");

//Create promise-based versions of functions using node style callbacks
const fs = require("fs");
const util = require("util");
const writeFileAsync = util.promisify(fs.writeFile);

// Create a route
module.exports = function (app) {
  //Display all notes
  app.get("/api/notes", function (req, res) {
    res.json(noteContents);
  });

  //Create new posts
  app.post("/api/notes", function (req, res) {
    // noteContents.push(req.body);
    // res.json(noteContents);

    let newNote = req.body;

    // check to find last id in our notes json file, and assign the note to one greater than that id
    let lastId = noteContents[noteContents.length - 1]["id"];
    let newId = lastId + 1;
    newNote["id"] = newId;

    console.log("Req.body:", req.body);
    noteContents.push(newNote);

    // write to the noteContents.json file as well
    writeFileAsync("./db/noteContents.json", JSON.stringify(noteContents)).then(
      function () {
        console.log("noteContents.json has been updated!");
      }
    );

    res.json(newNote);
  });

  // Delete a post
  app.delete("/api/notes/:id", function (req, res) {
    // let chosen = req.params.id;
    // console.log(chosen);

    console.log("Req.params:", req.params);
    let chosenId = parseInt(req.params.id);
    console.log(chosenId);

    for (let i = 0; i < noteContents.length; i++) {
      if (chosenId === noteContents[i].id) {
        // delete noteContents[i];
        noteContents.splice(i, 1);

        let noteJSON = JSON.stringify(noteContents, null, 2);

        writeFileAsync("./db/noteContents.json", noteJSON).then(function () {
          console.log("Chosen note has been deleted!");
        });
      }
    }
    res.json(noteContents);
    // data = data.filter(function(res) {
    //     return noteContent.item.replace(/ /g, '-') !== req.params.id;
  });
};

//---------------------------------------------------------
// parseInt(string, radix);
// The parseInt function converts its first argument to a string, parses that string, then returns an integer or NaN.
// console.log(Math.floor(Math.random() * 20));
// console.log(parseInt("007")); --> 7
// console.log(parseInt("t007")); --> NaN

//---------------------------------------------------------
// splice() :
/* <p id="demo"></p>
<script>
var fruits = ["Banana", "Orange", "Apple", "Mango"];
document.getElementById("demo").innerHTML = fruits;
function myFunction() {
  fruits.splice(2, 0, "Lemon", "Kiwi");
  document.getElementById("demo").innerHTML = fruits;
}
</script> 
===>   Banana,Orange,Lemon,Kiwi,Apple,Mango*/
