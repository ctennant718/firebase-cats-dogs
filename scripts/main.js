const pets ={};
let petNames =[];

function formatData(data) {
  if (!data) {
    throw new Error(`No data provided to formatData. Received ${data}`);
  }
  const { dogs, cats } = data;
  return [
    {
      label: "Dogs",
      value: dogs,
    },
    {
      label: "Cats",
      value: cats,
    },
  ];
}

function drawGraph(data, mountNodeSelector = "#chart svg") {
  console.log("drawGraph data", data);

  nv.addGraph(function () {
    var chart = nv.models
      .pieChart()
      .x((d) => d.label)
      .y((d) => d.value)
      .showLabels(true)

    d3.select(mountNodeSelector)
      .datum(data)
      .transition()
      .duration(350)
      .call(chart);

    return chart;
  });
}

const firebaseConfig = {
  apiKey: "AIzaSyD5931mAxkXZhf22xNifauF7xg_9ZKV_go",
  authDomain: "catsvsdogs-d9193.firebaseapp.com",
  projectId: "catsvsdogs-d9193",
  storageBucket: "catsvsdogs-d9193.appspot.com",
  messagingSenderId: "596243837204",
  appId: "1:596243837204:web:ebae875f8c6d115df2d201",
  measurementId: "G-QFW8LR25FN"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const petsCollectionRef = db.collection("pets");

petsCollectionRef.get().then((snapshot) => {
  snapshot.forEach((childSnapshot) => {
    const { id } = childSnapshot;
    petNames.push(id);
    const { value } = childSnapshot.data();
    console.log("value", value);
    pets[id] = value;
  });
});

petsCollectionRef.onSnapshot((snapshot) => {
  snapshot.docChanges().forEach(function (change) {
    console.log("change", change);
    if (change.type === "added") {
      console.log("New tutorial: ", change.doc.data());
    }
    if (change.type === "modified") {
      console.log("Modified tutorial: ", change.doc.data());
    }
    if (change.type === "removed") {
      console.log("Removed tutorial: ", change.doc.data());
    }
    pets[change.doc.id] = change.doc.data().value;
  });

  drawGraph(formatData(pets));
});

async function incrementField(field) {
  if (typeof field !== "string" || !petNames.includes(field))
    throw new Error(
      `Received ${field} for a pet. Expected one of: ${petNames.join()}`
    );

  try {
    await petsCollectionRef.doc(field).update({
      value: pets[field] + 1,
    });
    console.log("Document successfully updated!");
  } catch (error) {
    // The document probably doesn't exist.
    console.error("Error updating document: ", error);
  }
}

const dogButton = document.getElementById("dogs");
const catButton = document.getElementById("cats");


// Event Listeners
dogButton.addEventListener("click", () => {
  console.log("A vote for dogs");
  incrementField("dogs");
});
catButton.addEventListener("click", () => {
  console.log("A vote for cats");
  incrementField("cats");
});
// sadButton.addEventListener("click", () => {
//   console.log("making sad");
//   incrementField("sad");
// });
