// The data.
const locations = [
    
    {
        businessId: '123',
        name: 'first name',
        coordinates: [33.45566129678, -112.3955963552],
        rating: 1
    },
    
    {
        businessId: '234',
        name: 'second name',
        coordinates: [33.5221425, -112.0184007],
        rating: 1
    },
    
    {
        businessId: '345',
        name: 'third name',
        coordinates: [33.6548146, -112.1885676],
        rating: 1
    },
    
    {
        businessId: '456',
        name: 'fourth name',
        coordinates: [33.600071, -111.977371],
        rating: 1

    },
    
    {
        businessId: '567',
        name: 'fifth name',
        coordinates: [34.600071, -110.977371],
        rating: 1
    },
    
    {
        businessId: '678',
        name: 'sixth name',
        coordinates: [33.800071, -111.997371],
        rating: 1
    }
];

 // Create icons using the two .svg files.
    const redIcon = L.icon({
    iconUrl: 'red-marker.svg',
    iconSize:     [30, 50], 
    iconAnchor:   [15, 50],  
    popupAnchor:  [0, -30] 
});
    
    const blackIcon = L.icon({
    iconUrl: 'black-marker.svg',
    iconSize:     [30, 50], 
    iconAnchor:   [15, 50],  
    popupAnchor:  [0, -30] 
});

//Instantiate the map.
var map = L.map('mapContainer').setView([33.448376, -112.074036], 8);
            
// Add a base map from carto.com. Things you add are called layers.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <ahref="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let ratedList = []; // This array holds the ids of the already rated locations.

let markers =[]; //This array holds the markers.

// Add a marker to each location.
locations.forEach((location) => {
    
    // Create a marker.
    let marker = L.marker(location.coordinates, {icon:blackIcon});
    // Create a pop-up.
    const popup = L.popup(className="popUp").setContent(createPopUp(location, marker));
    // Bind the pop-up to the marker.
    marker.bindPopup(popup);
    // Add the marker to the markers array.
    markers.push(marker);
    
    // Create the popup div function.
    function createPopUp(location, marker) {

        let popUpDiv = document.createElement('div');
        popUpDiv.className = 'createdPopUp';
        
        let infoList = document.createElement('ul');
        infoList.className = 'popList';
        
        let name = location.name;
        let nameLine = document.createElement('li');
        nameLine.appendChild(document.createTextNode('Name: ' + name));
        infoList.appendChild(nameLine);
        
        popUpDiv.appendChild(infoList);
        
        let rateItButton = document.createElement('button');
        rateItButton.className = 'popButton';
        rateItButton.appendChild(document.createTextNode('Rate It'));
        
        popUpDiv.appendChild(rateItButton);

        rateItButton.addEventListener('click', (e) => {
            const popUpBtn = e.target;
             // Change the marker.    
            marker.setIcon(redIcon);
            // If a ratingElement was already created for the location,
            // grab the element from the DOM and scroll it into view.
            if(ratedList.some(rating => rating === location.businessId))
            {
                const ratingDiv = document.getElementById(location.businessId);
                ratingDiv.scrollIntoView();
                ratingDiv.focus(); 
            }
            else
            { 
                // Create a new RatingElement object.
                ratedList.push(location.businessId);
                const ratingElement = new RatingElement(location, marker, popUpBtn);
            }
        });
       return popUpDiv;
    } // End of createPopUp
});// End of loop.

// Add the markers array to the map.
const markersLayer = L.layerGroup(markers);
markersLayer.addTo(map);  



// ************************ Classes *********************************

// Stars class. This class is used to display the stars rating system.
class Stars{

    constructor(location)
    {
        this.location = location;
    }
   
    createElement()
    {
        //Create the div that contains the stars rating.
       const container = document.createElement('div');
       container.className = 'stars';
       container.id = `stars${this.location.businessId}`;

       let star1 = document.createElement('span');
       star1.className = 'star';
       star1.classList.add('rated');
       star1.innerHTML = '&#9733';
       container.appendChild(star1);
       
       let star2 = document.createElement('span');
       star2.className = 'star';
       star2.innerHTML = '&#9733';
       container.appendChild(star2);
       
       let star3 = document.createElement('span');
       star3.className = 'star';
       star3.innerHTML = '&#9733';
       container.appendChild(star3);
       
       let star4 = document.createElement('span');
       star4.className = 'star';
       star4.innerHTML = '&#9733';
       container.appendChild(star4);
       
       let star5 = document.createElement('span');
       star5.className = 'star';
       star5.innerHTML = '&#9733';
       container.appendChild(star5);

        return container;
    }

}// End of class Stars.


// RatingElement class. This class is used to create an element that displays a rating's information.
class RatingElement{

    constructor(location, marker, popUpBtn)
    {
        this.location = location;
        this.popUpBtn = popUpBtn;
        this.marker = marker;
        this.createElement();
    }
    createElement()
    {
           // Change the text in the pop-up button.
           this.popUpBtn.innerText = 'Check Rating';
           
           const rateItDiv = document.createElement('section');
           rateItDiv.className = 'createdRating';
           rateItDiv.id = this.location.businessId;
           rateItDiv.setAttribute('tabindex', 0);
           
           // Put the new rating section into the DOM.
            //Grab the DOM static ratings div container.
           const ratingContainer = document.getElementById('ratContainer');
           
           // Put the created section into the DOM.
           ratingContainer.appendChild(rateItDiv);
           
           const ratingInfo = document.createElement('ul');
           ratingInfo.className = 'ratingList';
           rateItDiv.appendChild(ratingInfo);
           
           const name = document.createElement('li')
           name.appendChild(document.createTextNode(`Name: ${this.location.name}`));
           ratingInfo.appendChild(name);

           // Add a Stars element. Add the event listeners to each star.
           const starsElement = new Stars(this.location);
            rateItDiv.appendChild(starsElement.createElement());
            // Get the stars div with an id of this.location.businessId and put its children in an array.
            const starsHTMLCollection = document.getElementById(`stars${this.location.businessId}`).children;
            const stars = Array.prototype.slice.call(starsHTMLCollection);
            const  starClicked = (e) =>
            {
                 const clickedStar = e.currentTarget;
                 const index = stars.findIndex(star => star === clickedStar);
                 this.location.rating = index+1;
                 stars.forEach((star, i) => i <= index ? star.classList.add('rated'): star.classList.remove('rated'));
            }
            stars.forEach((star) => star.addEventListener('click', starClicked));


            // Create the delete button.
            const removeBtn = document.createElement('button');
            removeBtn.className = 'removeRatingButton';
            removeBtn.id = 'removeBtnId';
            removeBtn.appendChild(document.createTextNode('Delete Rating'));
            rateItDiv.appendChild(removeBtn);
            removeBtn.addEventListener('click', (e) =>{
                this.marker.setIcon(blackIcon);
                // Get the button's parent element, which in this case is rateItDiv.
                const rated = e.target.parentElement;
                // Get the button's parent element of parent element, which in this case is the static DOM element with the id displayRatings.
                const display = document.getElementById('ratContainer');
                // Update the ratings array and pop-up's rate it button after delete.
                ratedList = ratedList.filter(rating => rating !== this.location.businessId);
                // Change the pop-up button back.
                this.popUpBtn.innerText = 'Rate It';
                // Reset the location's rating value back to one.
                this.location.rating = 1;
                // Remove the child rated of display.
                display.removeChild(rated);
            });
    }
}// End of class RatingElement


// ************************************ End of classes *************************************************





   
   

