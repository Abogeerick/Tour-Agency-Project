document.addEventListener("DOMContentLoaded", function() {
  const destinations = [
    { id: 1, buttonId: "first-btn", packageId: "lamu-package" },
    { id: 2, buttonId: "second-btn", packageId: "diani-package" },
    { id: 3, buttonId: "third-btn", packageId: "amboseli-package" },
    { id: 4, buttonId: "fourth-btn", packageId: "watamu-package" },
    { id: 5, buttonId: "fifth-btn", packageId: "mara-package" },
    { id: 6, buttonId: "sixth-btn", packageId: "kenya-package" }
  ];

  let shortlistedPackages = [];

  destinations.forEach((destination) => {
    const button = document.getElementById(destination.buttonId);

    button.addEventListener("click", function() {
      showPackages(destination.id, destination.packageId, button);
    });
  });

  function showPackages(id, packageId, button) {
    fetch(`http://localhost:3000/packages/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not OK");
        }
        return response.json();
      })
      .then(showPackages => {
        let nameList = document.getElementById(packageId);

        const nameHeading = createAndStyleElement("h3", `Title: ${showPackages.title}`);
        const durationTime = createAndStyleElement("p", `Duration: ${showPackages.duration}`);
        const vacationPrice = createAndStyleElement("p", `Price: ${showPackages.price}`);
        const vacationDescription = createAndStyleElement("p", `Description: ${showPackages.description}`);
        const vacationHighlights = createAndStyleElement("p", `Highlights: ${showPackages.highlights.join(", ")}`);
        const vacationIncluded = createAndStyleElement("p", `Included: ${showPackages.included.join(", ")}`);
        const vacationDates = createAndStyleElement("p", `Departure Dates: ${showPackages.departureDates.join(", ")}`);

       
        const shortlistButton = createAndStyleElement("button", "Shortlist");
        shortlistButton.style.background = "purple";  
        shortlistButton.addEventListener("click", function() {
          const packageIndex = shortlistedPackages.indexOf(showPackages.id);
          if (packageIndex === -1) {
            shortlistedPackages.push(showPackages.id);
            shortlistButton.textContent = "Remove from Shortlist";
            shortlistButton.style.background = "red";
            displayShortlistedPackages();
          } else {
            shortlistedPackages.splice(packageIndex, 1);
            shortlistButton.textContent = "Shortlist";
            shortlistButton.style.background = "blue";
            displayShortlistedPackages();
          }
        });

        appendElements(nameList, [nameHeading, durationTime, vacationPrice, vacationDescription, vacationHighlights, vacationIncluded, vacationDates, shortlistButton]);

        button.disabled = true;
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }

  function createAndStyleElement(tagName, textContent) {
    const element = document.createElement(tagName);
    element.textContent = textContent;
    element.style = "margin-bottom: 5px; background: white; color: black; padding: 5px;";
    return element;
  }

  function appendElements(parentElement, elements) {
    elements.forEach(element => {
      parentElement.appendChild(element);
    });
  }

  function displayShortlistedPackages() {
    let shortlistedSection = document.getElementById("shortlisted-section");
    shortlistedSection.innerHTML = "";

    if (shortlistedPackages.length > 0) {
      const heading = document.createElement("h3");
      heading.textContent = "Shortlisted Packages:";
      shortlistedSection.appendChild(heading);

      const list = document.createElement("ul");

      const promises = shortlistedPackages.map(packageId => {
        return fetch(`http://localhost:3000/packages/${packageId}`)
          .then(response => {
            return response.json();
          })
          .then(packageData => {
            const listItem = document.createElement("li");
            listItem.textContent = `Title: ${packageData.title}`;
            list.appendChild(listItem);
          });
      });

      Promise.all(promises)
        .then(() => {
          shortlistedSection.appendChild(list);
        })
        .catch(error => {
          console.error("Error:", error);
        });
    }
  }
});
