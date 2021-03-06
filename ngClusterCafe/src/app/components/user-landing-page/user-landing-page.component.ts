import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Place } from 'src/app/models/place';
import { Post } from 'src/app/models/post';
import { PostComment } from 'src/app/models/postComment';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-user-landing-page',
  templateUrl: './user-landing-page.component.html',
  styleUrls: ['./user-landing-page.component.css'],
})
export class UserLandingPageComponent implements OnInit {
  // For longitude west, give in negative, for East, give in positive number.
  // lat = 40.7127753;
  // lng = -74.0059728;
  // loading: Boolean = true;
  user: User = new User;
  currentUser: User = null;
  postComments: PostComment[] = [];
  posts: Post[] = [];
  admin: boolean = false;
  selected = null;
  editedComment: PostComment = null;
  editPost = null;

  // neighbourhoodPlaces: Array<Place> = [];
  // constructor(private sanitizer: DomSanitizer) {
    // this.neighbourhoodPlaces = new Array<Place>();
  // }
  constructor(
    private postService: PostService,
  private route: ActivatedRoute,
  private router: Router,
  private userService: UserService,

  ){

  }

  ngOnInit(): void {
    // this.fetchNeighbourhood();
    // this.initMap();
    let postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.postService.show(postId).subscribe(
        post => {
          this.selected = post;
        },
        fail => {
          console.error('PostListComponent.ngOnInit(): post retrieve failed');
          console.error(fail);
          this.router.navigateByUrl('notFound');
        }
      )
    };
    this.reload();
    this.loadCurrentUser();


  }

  loadCurrentUser() {
    this.userService.retrieveLoggedIn().subscribe(
      data => {
        this.currentUser = data
        this.checkForAdmin();
      },
      err => {console.error('Error loading current user: ' + err)}
    );
  }
  checkForAdmin() {
    if (this.currentUser.role === 'admin') {
      this.admin = true;
    } else {
      this.admin = false;
    }
  }
  reload() {
    this.postService.index().subscribe(
      data => {this.posts = data},
      err => {console.error('Error: ' + err)}
    );
  }
  displayPost(post) {
    this.selected = post;
    this.reloadComments();
      }

  reloadComments(){
    this.postService.getCommentsForPost(this.selected.id).subscribe(
      data => {this.postComments = data},
      err => {console.error('Error loading comments for this post' + err)}
      );
    }
    displayTable(): void {
      this.selected = null;
    }
    flagComment(comment: PostComment) {
      comment.flagged = true;
      this.editComment(comment);
    }

    deleteComment(comment: PostComment) {
      this.postService.deleteCommentForPost(comment.post.id, comment.id).subscribe(
        data => {
          this.reloadComments();
        },
        err => {
          console.error('Error deleting comment: ' + err);
        }
      );
    }
    editComment(comment: PostComment) {
      this.postService.editCommentForPost(comment.post.id, comment.id, comment).subscribe(
        data => {
          this.editedComment = null;
          this.reloadComments();
        },
        err => {
          console.error('Error editing comment: ' + err);
        }
      );
    }
    flagPost(post: Post) {
      post.flagged = true;
      this.updatePost(post, false);
    }

    unflagPost(post: Post) {
      post.flagged = false;
      this.updatePost(post, false);
    }
    updatePost(editedPost: Post, displayPost = true): void {
      this.postService.update(editedPost).subscribe(
        data => {
          if(displayPost) {
            this.selected = editedPost;
          }
            this.editPost = null;
            this.reload();
        },
        err => {
          console.error('Error: ' + err);
        }
      );
    }
    unflagPostComment(comment: PostComment) {
      comment.flagged = false;
      this.postService.editCommentForPost(comment.post.id, comment.id, comment).subscribe(
        data => {
          this.loadFlaggedPostComments();
        },
        err => {
          console.error('Error in unflagPostComment()')
          console.error('Error unflagging postComment for admin' + err)
        }
      );
    }
    deletePostComment(comment: PostComment) {
      this.postService.deleteCommentForPost(comment.post.id, comment.id).subscribe(
        data => {
          this.loadFlaggedPostComments();
        },
        err => {
          console.error('Error in deletePostComment()')
          console.error('Error deleting postComment for admin' + err)
        }
      );
    }
    loadFlaggedPostComments() {
      this.postService.indexFlaggedComments().subscribe(
        data => {
          this.postComments = data
        },
        err => {
          console.error('Error in loadFlaggedPostComments()')
          console.error('Error loading flagged comments for admin' + err)
        }
      )
    }
    deletePost(id: number): void {
      this.postService.delete(id).subscribe(
        data => {
          this.selected = null;
          this.reload();
        },
        err => {
          console.error('Error: ' + err);
        }
      );
    }
//   getUserPosts(){
// this.user.
//   }

  // fetchNeighbourhood = () => {
  //   let map;
  //   let neighbourhoodService;
  //   const loc = new google.maps.LatLng(this.lat, this.lng);

  //   map = new google.maps.Map(document.getElementById('map'), {
  //     center: loc,
  //     zoom: 15,
  //   });

  //   const neighbourhoodRequest = {
  //     location: loc,
  //     radius: '1500',
  //     type: ['neighborhood', 'art_gallery', 'museum', 'zoo'],
  //   };

  //   neighbourhoodService = new google.maps.places.PlacesService(map);
  //   neighbourhoodService.nearbySearch(
  //     neighbourhoodRequest,
  //     this.neighbourhoodCallback.bind(this)
  //   );
  // };
  // neighbourhoodCallback = (results, status) => {
  //   let count = 0;
  //   results.forEach((element) => {
  //     if (element.photos && count < 8) {
  //       count++;
  //       const newDest: Place = {
  //         placeName: element.name,
  //         placePhoto: element.photos ? element.photos[0].getUrl() : undefined,
  //       };
  //       this.neighbourhoodPlaces.push(newDest);
  //     }
  //   });
  // };

  // pos;
  // map;
  // bounds;
  // infoWindow;
  // currentInfoWindow;
  // service;
  // infoPane;
  // initMap() {
  //   // Initialize variables
  //   this.bounds = new google.maps.LatLngBounds();
  //   this.infoWindow = new google.maps.InfoWindow();
  //   this.currentInfoWindow = this.infoWindow;
  //   /* standard sidebar panel */
  //   this.infoPane = document.getElementById('panel');
  //   // Browser HTML5 geolocation attempt
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         this.pos = {
  //           lat: position.coords.latitude,
  //           lng: position.coords.longitude,
  //         };

  //         map: google.maps.Map;
  //         this.map = new google.maps.Map(document.getElementById('map'), {
  //           center: this.pos,
  //           zoom: 15,
  //         });
  //         this.bounds.extend(this.pos);
  //         this.infoWindow.setPosition(this.pos);
  //         this.infoWindow.setContent('Location found.');
  //         this.infoWindow.open(this.map);
  //         this.map.setCenter(this.pos);
  //         // Call Places Nearby Search on user's location
  //         this.getNearbyPlaces(this.pos);
  //       },
  //       () => {
  //         // Browser supports geolocation, but user has denied permission
  //         this.handleLocationError(true, this.infoWindow);
  //       }
  //     );
  //   } else {
  //     // Browser doesn't support geolocation
  //     this.handleLocationError(false, this.infoWindow);
  //   }
  // }
  // Handle a geolocation error
  // handleLocationError(browserHasGeolocation, infoWindow) {
  //   // Set default location to Sydney, Australia
  //   this.pos = { lat: -33.856, lng: 151.215 };
  //   this.map = new google.maps.Map(document.getElementById('map'), {
  //     center: this.pos,
  //     zoom: 15,
  //   });
  //   // Display an InfoWindow at the map center
  //   infoWindow.setPosition(this.pos);
  //   infoWindow.setContent(
  //     browserHasGeolocation
  //       ? 'Geolocation permissions denied. Using default location.'
  //       : "Error: Your browser doesn't support geolocation."
  //   );
  //   infoWindow.open(this.map);
  //   this.currentInfoWindow = infoWindow;
  //   // Call Places Nearby Search on the default location
  //   this.getNearbyPlaces(this.pos);
  // }

  // createMarkers(places) {
  // }

  // Perform a Places Nearby Search Request
  // getNearbyPlaces(position) {
  //   let request = {
  //     location: position,
  //     rankBy: google.maps.places.RankBy.DISTANCE,
  //     keyword: 'sushi',
  //   };
  //   this.service = new google.maps.places.PlacesService(this.map);
  //   this.service.nearbySearch(request,(results, status) => {
  //     if (status == google.maps.places.PlacesServiceStatus.OK) {
  //       var places = results;
  //       places.forEach((place) => {
  //         let marker = new google.maps.Marker({
  //           position: place.geometry.location,
  //           map: this.map,
  //           title: place.name,
  //         });
  //         /* Click listener on map markers */
  //         // Add click listener to each marker
  //         google.maps.event.addListener(marker, 'click', () => {
  //           let request = {
  //             placeId: place.place_id,
  //             fields: [
  //               'name',
  //               'formatted_address',
  //               'geometry',
  //               'rating',
  //               'website',
  //               'photos',
  //             ],
  //           };
  //           /* Only fetches location details on user
  //              click in order to minimize API rate limits */
  //           this.service.getDetails(request, (placeResult, status) => {
  //             this.showDetails(placeResult, marker, status);
  //           });
  //         });
  //         // Adjust the map bounds to include the location of this marker
  //         this.bounds.extend(place.geometry.location);
  //       });
  //       /* Once all the markers have been placed, adjust the bounds of the map to
  //        * show all the markers within the visible area. */
  //       this.map.fitBounds(this.bounds);
  //     }
  //   });
  // }
  // Handle the results (up to 20) of the Nearby Search

  // Set markers at the location of each place result

  /* Show place details in an info window */
  // Builds an InfoWindow to display details above the marker
  // showDetails(placeResult, marker, status) {
  //   if (status == google.maps.places.PlacesServiceStatus.OK) {
  //     let placeInfowindow = new google.maps.InfoWindow();
  //     let rating = 'None';
  //     if (placeResult.rating) rating = placeResult.rating;
  //     placeInfowindow.setContent(
  //       '<div><strong>' +
  //         placeResult.name +
  //         '</strong><br>' +
  //         'Rating: ' +
  //         rating +
  //         '</div>'
  //     );
  //     placeInfowindow.open(marker.map, marker);
  //     this.currentInfoWindow.close();
  //     this.currentInfoWindow = placeInfowindow;
  //     this.showPanel(placeResult);
  //   } else {
  //     console.log('showDetails failed: ' + status);
  //   }
  // }
  /* Load place details in a sidebar */
  // Displays place details in a sidebar
  // showPanel(placeResult) {
  //   // If infoPane is already open, close it
  //   if (this.infoPane.classList.contains('open')) {
  //     this.infoPane.classList.remove('open');
  //   }
  //   // Clear the previous details
  //   while (this.infoPane.lastChild) {
  //     this.infoPane.removeChild(this.infoPane.lastChild);
  //   }
  //   /* Display a Place Photo with the Place Details */
  //   // Add the primary photo, if there is one
  //   if (placeResult.photos) {
  //     let firstPhoto = placeResult.photos[0];
  //     let photo = document.createElement('img');
  //     photo.classList.add('hero');
  //     photo.src = firstPhoto.getUrl();
  //     this.infoPane.appendChild(photo);
  //   }
  //   // Add place details with text formatting
  //   let name = document.createElement('h1');
  //   name.classList.add('place');
  //   name.textContent = placeResult.name;
  //   this.infoPane.appendChild(name);
  //   if (placeResult.rating) {
  //     let rating = document.createElement('p');
  //     rating.classList.add('details');
  //     rating.textContent = `Rating: ${placeResult.rating} \u272e`;
  //     this.infoPane.appendChild(rating);
  //   }
  //   let address = document.createElement('p');
  //   address.classList.add('details');
  //   address.textContent = placeResult.formatted_address;
  //   this.infoPane.appendChild(address);
  //   if (placeResult.website) {
  //     let websitePara = document.createElement('p');
  //     let websiteLink = document.createElement('a');
  //     let websiteUrl = document.createTextNode(placeResult.website);
  //     websiteLink.appendChild(websiteUrl);
  //     websiteLink.title = placeResult.website;
  //     websiteLink.href = placeResult.website;
  //     websitePara.appendChild(websiteLink);
  //     this.infoPane.appendChild(websitePara);
  //   }
  //   // Open the infoPane
  //   this.infoPane.classList.add('open');
  // }



}
