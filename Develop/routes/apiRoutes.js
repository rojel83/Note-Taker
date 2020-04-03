// link to note content between db and apiRoutes
const noteContents = require("../db/noteConntents");

// creating promise base version of functions using note callbacks

const fs = require("fs");
const util = require("util");
const writeFileAsync = util.promisify(fs.writeFile);

//creating route
module.exports = function(app) {
  //displaying notes
  app.get("/api/note", function(req, res) {
    res.json(noteContents);
  });

  //creating new posts
  app.post("/api/note", function(req, res) {
    let newNote = req.body;
    //search last id and assign note to greater tha id
    let lastId = noteContents[noteContents.length - 1]["id"];
    let newId = lastId + 1;
    newNote["id"] = newId;
    console.log("Req.body", req.body);
    noteContents.push(newNote);

    //write to the noteContents.json file

    writeFileAsync("/db/noteContents.json", JSON.stringify(noteContents)).then(
      function() {
        console.log("noteConntents.json as been updated!");
      }
    );

    res.json(newNote);
  });
  //deleting post
  app.delete("/api/notes/:id", function(req, res) {
    console.log("Req.params:", req.params);
    let chosenId = parseInt(req.params.id);
    console.log(chosenId);

    for (let i = 0; i < noteContents.length; i++) {
      if (choseId === noteContents[i].id) {
        //delete noteContent
        noteContents.splice(i, 1);

        let noteJSON = JSON.stringify(noteContents, null, 2);

        writeFileAsync("./db/noteContents.json", noteJSON).then(function() {
          console.log("chosen note has been deleted");
        });
      }
    }
    res.json(noteContents);
  });
};
//==================================================================
