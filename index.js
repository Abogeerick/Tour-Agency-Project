const destinations = [
  { id: 1, buttonId: "first-btn", packageId: "lamu-package" },
  { id: 2, buttonId: "second-btn", packageId: "diani-package" },
  { id: 3, buttonId: "third-btn", packageId: "amboseli-package" },
  { id: 4, buttonId: "fourth-btn", packageId: "watamu-package" },
  { id: 5, buttonId: "fifth-btn", packageId: "mara-package" },
  { id: 6, buttonId: "sixth-btn", packageId: "kenya-package" }
];

// Array to store shortlisted package IDs
let shortlistedPackages = [];

destinations.forEach((destination) => {
  const button = document.getElementById(destination.buttonId);

  button.addEventListener("click", function() {
    showPackages(destination.id, destination.packageId, button);
  });
});

function showPackages(id, packageId, button) {
  fetch(`http://localhost:3000/packages/${id}`)
    .then(function(response) {
      if (!response.ok) {
        throw new Error("Network response was not OK");
      }
      return response.json();
    })
    .then(function(showPackages) {
      let nameList = document.getElementById(packageId);

      const nameHeading = document.createElement("h3");
      nameHeading.textContent = `Title: ${showPackages.title}`;
      nameHeading.style.fontWeight = "bold";
      nameHeading.style.marginBottom = "10px";
      nameHeading.style.background = "white";
      nameHeading.style.color = "black";
      nameHeading.style.padding = "10px";

      const durationTime = document.createElement("p");
      durationTime.textContent = `Duration: ${showPackages.duration}`;
      durationTime.style.marginBottom = "5px";
      durationTime.style.background = "white";
      durationTime.style.color = "black";
      durationTime.style.padding = "5px";

      const vacationPrice = document.createElement("p");
      vacationPrice.textContent = `Price: ${showPackages.price}`;
      vacationPrice.style.marginBottom = "5px";
      vacationPrice.style.background = "white";
      vacationPrice.style.color = "black";
      vacationPrice.style.padding = "5px";

      const vacationDescription = document.createElement("p");
      vacationDescription.textContent = `Description: ${showPackages.description}`;
      vacationDescription.style.marginBottom = "5px";
      vacationDescription.style.background = "white";
      vacationDescription.style.color = "black";
      vacationDescription.style.padding = "5px";

      const vacationHighlights = document.createElement("p");
      vacationHighlights.textContent = `Highlights: ${showPackages.highlights.join(", ")}`;
      vacationHighlights.style.marginBottom = "5px";
      vacationHighlights.style.background = "white";
      vacationHighlights.style.color = "black";
      vacationHighlights.style.padding = "5px";

      const vacationIncluded = document.createElement("p");
      vacationIncluded.textContent = `Included: ${showPackages.included.join(", ")}`;
      vacationIncluded.style.marginBottom = "5px";
      vacationIncluded.style.background = "white";
      vacationIncluded.style.color = "black";
      vacationIncluded.style.padding = "5px";

      const vacationDates = document.createElement("p");
      vacationDates.textContent = `Departure Dates: ${showPackages.departureDates.join(", ")}`;
      vacationDates.style.marginBottom = "5px";
      vacationDates.style.background = "white";
      vacationDates.style.color = "black";
      vacationDates.style.padding = "5px";

      const shortlistedSection = document.getElementById("shortlisted-section");

      // Create a shortlist button for each package
      const shortlistButton = document.createElement("button");
      shortlistButton.textContent = "Shortlist";
      shortlistButton.style.background = "blue";
      shortlistButton.style.color = "white";
      shortlistButton.style.padding = "5px";
      shortlistButton.style.border = "none";
      shortlistButton.style.cursor = "pointer";

      // Event listener for the shortlist button
      shortlistButton.addEventListener("click", function() {
        // Check if the package is already in the shortlist
        const packageIndex = shortlistedPackages.indexOf(showPackages.id);
        if (packageIndex === -1) {
          // Add the package ID to the shortlist
          shortlistedPackages.push(showPackages.id);
          shortlistButton.textContent = "Remove from Shortlist";
          shortlistButton.style.background = "red";
          displayShortlistedPackages();
        } else {
          // Remove the package ID from the shortlist
          shortlistedPackages.splice(packageIndex, 1);
          shortlistButton.textContent = "Shortlist";
          shortlistButton.style.background = "blue";
          displayShortlistedPackages();
        }
      });

      // Append all the elements to the nameList container
      nameList.appendChild(nameHeading);
      nameList.appendChild(durationTime);
      nameList.appendChild(vacationPrice);
      nameList.appendChild(vacationDescription);
      nameList.appendChild(vacationHighlights);
      nameList.appendChild(vacationIncluded);
      nameList.appendChild(vacationDates);
      nameList.appendChild(shortlistButton);

      button.disabled = true;
    })
    .catch(function(error) {
      console.error("Error:", error);
      // You can handle the error here, such as displaying an error message
    });
}

// Function to display the shortlisted packages
function displayShortlistedPackages() {
  const shortlistedSection = document.getElementById("shortlisted-section");
  shortlistedSection.innerHTML = ""; // Clear the section

  if (shortlistedPackages.length > 0) {
    const heading = document.createElement("h3");
    heading.textContent = "Shortlisted Packages:";
    shortlistedSection.appendChild(heading);

    const list = document.createElement("ul");

    // Fetch the package data for each shortlisted package
    const promises = shortlistedPackages.map((packageId) => {
      return fetch(`http://localhost:3000/packages/${packageId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not OK");
          }
          return response.json();
        })
        .then((packageData) => {
          const listItem = document.createElement("li");
          listItem.textContent = `Package ID: ${packageData.id} - Title: ${packageData.title}`;
          list.appendChild(listItem);
        });
    });

    // Wait for all the promises to resolve
    Promise.all(promises)
      .then(() => {
        shortlistedSection.appendChild(list);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}
