let express = require("express");
let path = require("path");

let app = express();
let PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Reservations and Waitlist (DATA)
// ============================================================

const reservationList = [{
    name: "John Doe",
    phoneNumber: "012-345-6789",
    email: "abc@de.fg",
    id: "johndoe",
    isWaiting: false
}, {
    name: "Mary Sue",
    phoneNumber: "987-654-3210",
    email: "gfe@dc.ba",
    id: "marysue",
    isWaiting: true
}]

// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/reserve", function (req, res) {
    res.sendFile(path.join(__dirname, "reservation.html"));
});

app.get("/view/reservations", function (req, res) {
    res.sendFile(path.join(__dirname, "view.html"));
});

app.get("/view/reservations/:name", function (req, res) {
    res.sendFile(path.join(__dirname, "personalInfo.html"));
});

// Displays all reservations and the waitlist
app.get("/api/reservations", function (req, res) {
    return res.json(reservationList);
});

// Displays an individual reservation and their info
app.get("/api/reservations/:name", function (req, res) {
    let chosen = req.params.name;

    console.log(chosen);

    for (var i = 0; i < reservationList.length; i++) {
        if (chosen === reservationList[i].id) {
            return res.json(reservationList[i]);
        }
    }

    return res.json(false);
});

// Create New Characters - takes in JSON input
app.post("/api/reservations", function (req, res) {
    // req.body hosts is equal to the JSON post sent from the user
    // This works because of our body parsing middleware
    let newReservation = req.body;

    // Using a RegEx Pattern to remove spaces from newCharacter
    // You can read more about RegEx Patterns later https://www.regexbuddy.com/regex.html
    newReservation.id = newReservation.name.replace(/\s+/g, "").toLowerCase();

    // Checks that the ID is unique
    let isUnique = false;
    let idNum = 0;
    while (!isUnique) {
        tempID = newReservation.id;
        if (idNum > 0) tempID += idNum;
        let checkList = true;
        for (let i = 0; i < reservationList.length; i++) {
            if (reservationList[i].id === tempID) {
                checkList = false;
            }
        }
        if (checkList === true) {
            isUnique = true;
            newReservation.id = tempID;
        } else {
            idNum++;
        }
    }

    if (reservationList.length < 5) {
        newReservation.isWaiting = false;
    } else {
        newReservation.isWaiting = true;
    }
    reservationList.push(newReservation);

    res.json(newReservation);
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
