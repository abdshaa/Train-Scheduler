$(document).ready(function() {
  var config = {
    apiKey: "AIzaSyD_Yfnhtp4ygoHwtd_9eonyG1HOH_Ci05w",
    authDomain: "train-scheduler1111.firebaseapp.com",
    databaseURL: "https://train-scheduler1111.firebaseio.com",
    projectId: "train-scheduler1111",
    storageBucket: "",
    messagingSenderId: "1091253142491",
    appId: "1:1091253142491:web:f8c0bab32347e5f4441dfe"
  };
  firebase.initializeApp(config);

  // A variable to reference the database.
  var database = firebase.database();

  // Variables for the onClick event
  var name;
  var destination;
  var firstTrain;
  var frequency = 0;

  $("#add-train").on("click", function() {
    event.preventDefault();
    // Storing and retreiving new train data
    name = $("#train-name")
      .val()
      .trim();
    destination = $("#destination")
      .val()
      .trim();
    firstTrain = $("#first-train")
      .val()
      .trim();
    frequency = $("#frequency")
      .val()
      .trim();

    // Pushing to database
    database.ref().push({
      name: name,
      destination: destination,
      firstTrain: firstTrain,
      frequency: frequency,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
  });

  database.ref().on("child_added", function(childSnapshot) {
    var nextArr;
    var minAway;
    // Chang year so first train comes before now
    var firstTrainNew = moment(
      childSnapshot.val().firstTrain,
      "hh:mm"
    ).subtract(1, "years");
    // Difference between the current and firstTrain
    var diffTime = moment().diff(moment(firstTrainNew), "minutes");
    var remainder = diffTime % childSnapshot.val().frequency;
    // Minutes until next train
    var minAway = childSnapshot.val().frequency - remainder;
    // Next train time
    var nextTrain = moment().add(minAway, "minutes");
    nextTrain = moment(nextTrain).format("hh:mm");

    $("#add-row").append(
      "<tr><td>" +
        childSnapshot.val().name +
        "</td><td>" +
        childSnapshot.val().destination +
        "</td><td>" +
        childSnapshot.val().frequency +
        "</td><td>" +
        nextTrain +
        "</td><td>" +
        minAway +
        "</td></tr>"
    );
  });

  database
    .ref()
    .orderByChild("dateAdded")
    .limitToLast(1)
    .on("child_added", function(snapshot) {
      // Change the HTML to reflect
      $("#name-display").html(snapshot.val().name);
      $("#email-display").html(snapshot.val().email);
      $("#age-display").html(snapshot.val().age);
      $("#comment-display").html(snapshot.val().comment);
    });
});
