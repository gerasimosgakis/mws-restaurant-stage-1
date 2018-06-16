let restaurant;
let reviews = [];
var map;
const reviewButton = document.getElementById('reviewButton');
window.onload = () => {
  fetchReviewsFromURL((error, reviews) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      console.log('hi');
    }
  });
}

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
}

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant);
    return;
  }
  const id = getParameterByName('id');
  console.log(id);
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL';
    callback(error, null);
  } else {
    DBHelper.openDatabase().then(db => {
      var tx = db.transaction('restaurants', 'readonly');
      var store = tx.objectStore('restaurants');
      return store.get(parseInt(id));
      }).then(restaurant => {
        self.restaurant = restaurant;
        if (!restaurant) {
          console.error(error);
          return;
        }
        fillRestaurantHTML();
        callback(null, restaurant);
      })
  }
}

/**
 * Get current reviews from page URL.
 */
fetchReviewsFromURL = (callback) => {
  if (self.reviews) { // restaurant already fetched!
    callback(null, self.reviews);
    return;
  }
  const id = getParameterByName('id');
  console.log(id);
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL';
    callback(error, null);
  } else {
    DBHelper.openDatabase().then(db => {
      var tx = db.transaction('reviews', 'readonly');
      var store = tx.objectStore('reviews');
      var index = store.index('restaurant_id');
      return index.openCursor()  //get(parseInt(id));
      }).then(function show(cursor) {
        if(!cursor) {return;}
        if (cursor.key === parseInt(id)) {
          reviews.push(cursor.value);
        }
        return cursor.continue().then(show)
      }).then(() => {
        console.log(reviews);
        fillReviewsHTML();
        callback(null, reviews);
      })
      
      // .then(reviews => {
      //   self.reviews = reviews;
      //   if (!reviews) {
      //     console.error(error);
      //     return;
      //   }
      //   fillReviewsHTML();
      //   callback(null, reviews);
      // })
  }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;
  address.setAttribute('tabindex', '0');

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img';
  image.alt = restaurant.name + " restaurant's cover photo";
  image.setAttribute('tabindex', '0');

  // If screen width is smaller than 400px the small photo is loaded
  if (window.innerWidth <= 400) {
    image.src = DBHelper.imageUrlForRestaurantSmall(restaurant);
  }
  //if the screen width is between 400 and 1600 the medium photo is more than good
  else if (window.innerWidth > 400 && window.innerWidth <= 1600) {
    image.src = DBHelper.imageUrlForRestaurantMedium(restaurant);
  }
  //other wise for really wide screens we load the large photo
  else {
    image.src = DBHelper.imageUrlForRestaurantLarge(restaurant);
  }

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;
  cuisine.setAttribute('tabindex', '0');

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  //fillReviewsHTML();
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');
    row.setAttribute('tabindex', '0');

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = () => {
  console.log('hi', reviews);
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h3');
  title.setAttribute('tabindex', '0');

  title.innerHTML = 'Reviews';
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');
  const name = document.createElement('p');
  name.setAttribute('tabindex', '0');
  name.innerHTML = review.name;
  li.appendChild(name);

  const date = document.createElement('p');
  /* Convert date to a nice format */
  const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
  ];
  var niceDate = new Date(review.updatedAt);
  var theyear = niceDate.getFullYear();
  var themonth = monthNames[niceDate.getMonth()];
  var thetoday = niceDate.getDate();
  date.innerHTML = thetoday + ' ' + themonth + ', ' + theyear;
  date.setAttribute('tabindex', '0');
  li.appendChild(date);

  const rating = document.createElement('p');
  rating.innerHTML = `Rating: ${review.rating}`;
  rating.setAttribute('tabindex', '0');
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  comments.setAttribute('tabindex', '0');
  li.appendChild(comments);

  return li;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  li.setAttribute('tabindex', '0');
  breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url) {
    url = window.location.href;
  }
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results) {
    return null;
  }
  if (!results[2]) {
    return '';
  }
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

/**
 * Open review form page with id parameter = current restaurant.
 */
openPage = function() {
  location.href = "/reviewForm.html?id="+getParameterByName('id')+"#?name="+self.restaurant.name;
}
