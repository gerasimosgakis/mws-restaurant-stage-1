const submitButton = document.getElementById('submit')
const rating = 0;
let id = 0;
window.onload = () => {
    if (id == 0) {
        id = getParameterByName('id');
    }
    console.log(id);
    fillBreadcrumb();
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

function reviewSubmit() {
    console.log('IN Review submit');

    // function reviewSubmit() {
    //     fetch('http://localhost:1337/reviews', {
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         method: 'POST',
    //         body: JSON.stringify({
    //             "restaurant_id": parseInt(getParameterByName('id')),
    //             "name": document.getElementById('name').value,
    //             "createdAt": new Date(),
    //             "updatedAt": new Date(),
    //             "rating": this.rating || 0,
    //             "comments": document.getElementById('comment').value
    //         })
    //     })
    //     .then((data) => {
    //         // window.confirm("sometext");
    //         //console.log('Request succeeded with JSON response', data);
    //         navigator.serviceWorker.controller.postMessage({action: 'formSubmitted'});
    //         console.log(navigator.serviceWorker);
    //     })
    //     .then(() => {
    //         window.location.href = '/restaurant.html?id='+getParameterByName('id');
    //     //     //modal.style.display = "block";
    //     //     window.location.href = '/restaurant.html?id='+getParameterByName('id');
    //     })
    //     .catch(function (error) {
    //         console.log('Request failed', error);
    //     });
    // }

    fetch('http://localhost:1337/reviews/', {
        headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    "restaurant_id": parseInt(getParameterByName('id')),
                    "name": document.getElementById('name').value,
                    "createdAt": new Date(),
                    "updatedAt": new Date(),
                    "rating": this.rating || 0,
                    "comments": document.getElementById('comment').value
                })
    })
    //fetch(myRequest)
    .then(function(response) {
        //return data.json();
        //console.log('SUBMITTED');
        // console.log('DATA', data.json());
        // DBHelper.openDatabase().then(function(db) {
        //     let tx = db.transaction('reviews', 'readwrite');
        //     let store = tx.objectStore('reviews');
        //     store.add(data);
        //     console.log('UKUKHIUKHKU');
            // return Promise.all(
            //     store.add(data)
            // ).catch(function(error) {
            //   tx.abort();
            //   console.log(error);
            // }).then(function() {
            //   console.log('All items added successfully');
            // });
          //});
        // window.confirm("sometext");
        console.log('Request succeeded with JSON response', response);
        
        //navigator.serviceWorker.controller.postMessage({action: 'formSubmitted'});
        console.log(navigator.serviceWorker);
        return response.json();
    })
    .then((dataJSON) => {
        console.log('DATA', dataJSON);
        navigator.serviceWorker.controller.postMessage({action: dataJSON});
        DBHelper.openDatabase().then(function(db) {
            let tx = db.transaction('reviews', 'readwrite');
            let store = tx.objectStore('reviews');
            store.add(dataJSON);
            console.log('UKUKHIUKHKU');
        })
    })
    .then(() => {
        console.log('redirect');
        window.location.href = "/restaurant.html?id="+parseInt(getParameterByName('id'));
    })
    // .then((res) => {
    //     //window.location.href = "/restaurant.html?id="+parseInt(getParameterByName('id'));
    //     console.log(res);
    //     DBHelper.addReviews().then(() => {
    //         console.log('now called reviews');
    //     });
    // //     //modal.style.display = "block";
    // //     window.location.href = '/restaurant.html?id='+getParameterByName('id');
    // })
    .catch(function (error) {
        console.log('Request failed', error);
        const tempObj = {
            "restaurant_id": parseInt(getParameterByName('id')),
            "name": document.getElementById('name').value,
            "createdAt": new Date(),
            "updatedAt": new Date(),
            "rating": this.rating || 0,
            "comments": document.getElementById('comment').value
        };
        console.log(tempObj);
        DBHelper.openDatabase().then(function(db) {
            let tx = db.transaction('reviews', 'readwrite');
            let store = tx.objectStore('reviews');
            store.add(tempObj);
            console.log('UKUKHIUKHKU');
        })
        window.location.href = "/restaurant.html?id="+parseInt(getParameterByName('id'));
    });
}

function select() {
    let id = event.srcElement.id;
    switch (id) {
        case 'star1':
            if (this.rating === 1 && document.getElementById('star1').className.includes('star-checked')) {
                document.getElementById('star1').className = 'fa fa-star';
                this.rating = 0;
            }
            else {
                for (let i=1; i<=5; i++){
                    document.getElementById('star'+i).className = 'fa fa-star';
                }
                document.getElementById('star1').className += ' star-checked';
                this.rating = 1;
            }
            break;
        case 'star2':
            for (let i=1; i<=5; i++){
                document.getElementById('star'+i).className = 'fa fa-star';
            }
            this.rating = 2;
            for (let i=1; i<=2; i++){
                document.getElementById('star'+i).className += ' star-checked';
            }
            break;
        case 'star3':
            for (let i=1; i<=5; i++){
                document.getElementById('star'+i).className = 'fa fa-star';
            }
            this.rating = 3;
            for (let i=1; i<=3; i++){
                document.getElementById('star'+i).className += ' star-checked';
            }
            break;
        case 'star4':
            for (let i=1; i<=5; i++){
                document.getElementById('star'+i).className = 'fa fa-star';
            }
            this.rating = 4;
            for (let i=1; i<=4; i++){
                document.getElementById('star'+i).className += ' star-checked';
            }
            break;
        case 'star5':
            for (let i=1; i<=5; i++){
                document.getElementById('star'+i).className = 'fa fa-star';
            }
            this.rating = 5;
            for (let i=1; i<=5; i++){
                document.getElementById('star'+i).className += ' star-checked';
            }
            break;
        default:
            for (let i=1; i<=5; i++){
                document.getElementById('star'+i).className = 'fa fa-star';
            }
    }
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = () => {
    const breadcrumb = document.getElementById('breadcrumb');
    const a = document.createElement('a');
    a.innerHTML = getParameterByName('name');
    a.setAttribute('href', '/restaurant.html?id='+getParameterByName('id'));
    const li = document.createElement('li');
    li.appendChild(a);
    li.setAttribute('tabindex', '0');
    breadcrumb.appendChild(li);
}

// Modal

// Get the modal
var modal = document.getElementById('myModal');

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}


// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}