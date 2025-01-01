class Shorten {
  constructor(firebase, warns = true) {
    if (!firebase) {
      throw new Error('Hoped to find a definition for "firebase". (11)');
    }

    if (warns != false && warns != true) warns = false;
    if (warns === true) {
      console.log("Shorten-Firebase v2.0.0 inicializado. (1)");
    }

    this.database = firebase.database();
  }

  async set(ref, value) {
    if (!ref || !value || typeof value !== "object") {
      throw new Error(
        "Hoped to find a reference and an value [object] (12). Check the documentation."
      );
    }

    this.database.ref(ref).update(value);
  }

  async update(ref, value) {
    this.set(ref, value);
  }

  async add(ref, value, newValue) {
    if (
      !ref ||
      !value ||
      !newValue ||
      typeof ref !== "string" ||
      typeof value !== "string" ||
      typeof newValue !== "number"
    ) {
      throw new Error(
        "Hoped to find a reference, a property and a value (13). Check the documentation."
      );
    }
    this.database
      .ref(ref)
      .once("value")
      .then(async (snapshot) => {
        if (snapshot.exists()) {
          let oldValue = snapshot.val()[value] ? snapshot.val()[value] : 0;
          let data = {
            [value]: oldValue + newValue,
          };
          this.database.ref(ref).update(data);
        } else {
          let data = {
            [value]: newValue,
          };
          this.database.ref(ref).update(data);
        }
      });
  }

  async delete(ref) {
    if (!ref || typeof ref !== "string") {
      throw new Error(
        "Hoped to find a reference (14). Check the documentation."
      );
    }
    this.database.ref(ref).remove();
  }

  async erase(i = false) {
    if (i === true) {
      this.delete("/");
    } else {
      throw new Error("Need aprovation.");
    }
  }

  async get(ref) {
    if (!ref || typeof ref !== "string") {
      throw new Error(
        "Hoped to find a reference (14). Check the documentation."
      );
    }
    var data = null;
    await this.database
      .ref(ref)
      .once("value")
      .then((snapshot) => {
        if (snapshot.val() && snapshot.val()) {
          data = snapshot.val();
        } else {
          data = null;
        }
      });

    return Promise.resolve(data).then((value) => value);
  }

  async getAllData() {
    var data = null;
    await this.database
      .ref("/")
      .once("value")
      .then((snapshot) => {
        if (snapshot.val() && snapshot.val()) {
          data = snapshot.val();
        } else {
          data = null;
        }
      });

    return Promise.resolve(data).then((value) => value);
  }

  async search(ref, property) {
    if (
      !ref ||
      (!property && typeof ref !== "string" && typeof property !== "string")
    ) {
      throw new Error(
        "Hoped to find a reference (14). Check the documentation."
      );
    }
    var data = null;
    await this.database
      .ref(ref)
      .once("value")
      .then((snapshot) => {
        if (snapshot.val() && snapshot.val()[property]) {
          data = snapshot.val()[property];
        } else {
          data = null;
        }
      });
    return Promise.resolve(data).then((value) => value);
  }

  async latency() {
    let time = Date.now();
    return Math.round(
      await this.database
        .ref("shorten-firebase")
        .once("value")
        .then(() => Date.now() - time)
    );
  }

  async ping() {
    this.latency();
  }
}

document.getElementById("theme").addEventListener("click", () => {
  let el = document.querySelectorAll("#theme i")[0];

  if (el.classList.contains("fa-moon")) {
    setTheme("Light");
  } else if (el.classList.contains("fa-sun")) {
    setTheme("Dark");
  }
});

function setTheme(theme) {
  const el = document.querySelectorAll("#theme i")[0];

  if (theme == "Dark") {
    localStorage.setItem("Tema", theme);
    el.classList.remove("fa-sun");
    el.classList.add("fa-moon");
    el.style = "left: 20%; transform: translateX(-20%);";

    try {
      document.getElementById("logo").src = "/assets/logo/dark-logo.png";

      document.getElementById("brain").src = "/assets/boxies/dark-brain.png";
      document.getElementById("paper").src = "/assets/boxies/dark-paper.png";
      document.getElementById("book").src = "/assets/boxies/dark-book.png";
    } catch (err) {
      console.info("Não está na página inicial.", err);
    }

    document.documentElement.style.setProperty("--color", "#f2f2f2");
    document.documentElement.style.setProperty("--background", "#011447");
  }
  if (theme == "Light") {
    localStorage.setItem("Tema", theme);
    el.classList.add("fa-sun");
    el.classList.remove("fa-moon");
    el.style = "left: 80%; transform: translateX(-80%);";

    try {
      document.getElementById("logo").src = "/assets/logo/light-logo.png";

      document.getElementById("brain").src = "/assets/boxies/light-brain.png";
      document.getElementById("paper").src = "/assets/boxies/light-paper.png";
      document.getElementById("book").src = "/assets/boxies/light-book.png";
    } catch (err) {
      console.info("Não está na página inicial.", err);
    }

    document.documentElement.style.setProperty("--color", "#011447");
    document.documentElement.style.setProperty("--background", "#f2f2f2");
  }
}

function loadTheme() {
  if (localStorage.getItem("Tema") == "") {
    setTheme("Dark");
  } else {
    setTheme(localStorage.getItem("Tema"));
  }
}

const firebaseConfig = {
  apiKey: "AIzaSyDxdU3XdrX76KRO8Kjyy-5KDaEO-GoO2gU",
  authDomain: "expotec-19e9d.firebaseapp.com",
  projectId: "expotec-19e9d",
  storageBucket: "expotec-19e9d.appspot.com",
  messagingSenderId: "906554343353",
  appId: "1:906554343353:web:a97f769e044b0e1ae18068",
};

firebase.initializeApp(firebaseConfig);
const database = new Shorten(firebase, false);

async function road(arrayList = [{ text: "Olá!" }]) {
  var element = document.getElementById("myDiagramDiv");
  if (element) {
    element.remove();

    var newElement = document.createElement("div");
    newElement.id = "myDiagramDiv";

    var parentElement = document.getElementById("enem-page");
    parentElement.appendChild(newElement);
  }

  var $ = go.GraphObject.make;

  var diagram = $(go.Diagram, "myDiagramDiv", {
    initialContentAlignment: go.Spot.Center,
    "undoManager.isEnabled": true,
    layout: $(go.TreeLayout, {
      angle: 0,
      layerSpacing: 80,
      alternateAlignment: go.TreeLayout.AlternateAlignmentStart,
      alternateNodeIndent: 20,
      alternateNodeIndentPastParent: 1,
      alternateNodeSpacing: 10,
    }),
  });

  diagram.nodeTemplate = $(
    go.Node,
    "Auto",
    {
      maxSize: new go.Size(140, NaN),
      click: function (e, node) {
        if (node.data.link) {
          window.open(node.data.link, "_blank");
        } else if (node.data.checked !== undefined) {
          // Adiciona o checkbox somente para elementos com a propriedade checked
          diagram.startTransaction("toggle checkbox");
          diagram.model.setDataProperty(
            node.data,
            "checked",
            !node.data.checked
          );
          diagram.commitTransaction("toggle checkbox");
        }
      },
    },
    $(
      go.Shape,
      "RoundedRectangle",
      {
        fill: "lightblue",
        cursor: "pointer",
        fromSpot: go.Spot.Right,
        toSpot: go.Spot.Left,
      },
      new go.Binding("figure", "shape", function (shape) {
        if (shape === "circle") {
          return "Circle";
        } else {
          return "RoundedRectangle";
        }
      }),
      new go.Binding("desiredSize", "shape", function (shape) {
        return shape === "circle" ? new go.Size(20, 20) : null; // Defina o tamanho desejado para o círculo
      })
    ),
    $(
      go.TextBlock,
      {
        margin: 10,
      },
      new go.Binding("text", "text")
    )
  );

  diagram.linkTemplate = $(
    go.Link,
    {
      routing: go.Link.Orthogonal,
      corner: 5,
    },
    $(go.Shape, {
      strokeWidth: 3,
      stroke: "#555",
    })
  );

  switch (arrayList) {
    case "portugues":
      arrayList = await database.get("materias/portugues");
      break;
    case "matematica":
      arrayList = await database.get("materias/matematica");
      break;
    case "biologia":
      arrayList = await database.get("materias/biologia");
      break;
    case "espanhol":
      arrayList = await database.get("materias/espanhol");
      break;
    case "ingles":
      arrayList = await database.get("materias/ingles");
      break;
    case "fisica":
      arrayList = await database.get("materias/fisica");
      break;
    case "historia":
      arrayList = await database.get("materias/historia");
      break;
    case "geografia":
      arrayList = await database.get("materias/geografia");
      break;
    case "quimica":
      arrayList = await database.get("materias/quimica");
      break;
  }

  diagram.model = new go.TreeModel(arrayList);

  var node = diagram.findNodeForKey(1);
  if (node !== null) {
    var nodeBounds = node.actualBounds;
    diagram.commandHandler.scrollToPart(node);
    diagram.position = new go.Point(
      -nodeBounds.x + (diagram.viewportBounds.width - nodeBounds.width) / 2,
      -nodeBounds.y + (diagram.viewportBounds.height - nodeBounds.height) / 2
    );

    var nodeT = diagram.findNodeForKey(1);
    var nodeBoundsT = nodeT.actualBounds;

    if (nodeBounds === nodeBoundsT) {
      diagram.centerRect(nodeBounds);
    }
  }

  diagram.addDiagramListener("ObjectSingleClicked", function (e) {
    var clickedPart = e.subject;
    if (clickedPart.data) {
      var nodeKey = clickedPart.data.key;
      if (nodeKey) {
        var nodeData = diagram.model.findNodeDataForKey(nodeKey);
        if (nodeData && nodeData.link) {
          window.open(nodeData.link, "_blank");
        }
      }
    }
  });
}

const btnNav = document.querySelector(".nav-bar");

function toggleMenu() {
    let nav = document.querySelector("#list-container");
    
    if (nav.classList.contains("active")) {
      nav.classList.toggle("active");
      document.querySelector("body").style.overflowY = "auto";
      document.querySelector('.linha2').style.rotate = '0deg';
      document.querySelector('.linha3').style.rotate = '0deg';
      document.querySelector('.linha1').style.display = 'block';
      document.querySelector('.linha3').style.top = '0';
      document.querySelector('.linha2').style = '';
    } else {
        nav.classList.toggle("active");
        document.querySelector('.linha2').style.rotate = '135deg';
        document.querySelector('.linha2').style.position = 'absolute';
        document.querySelector('.linha3').style.top = '1rem';
        document.querySelector('.linha3').style.rotate = '-135deg';
        document.querySelector('.linha1').style.display = 'none';
    document.querySelector("body").style.overflowY = "hidden";
  }
}

btnNav.addEventListener("click", toggleMenu);

try {
    var navbar = document.querySelector("header");
    var navbarHeight = window.getComputedStyle(navbar).height;

    document.getElementById(
        "list-container"
    ).style.height = `calc(100vh - ${heightHeader})`;
} catch (e) {
    console.log("Não está na página inicial.");
}

