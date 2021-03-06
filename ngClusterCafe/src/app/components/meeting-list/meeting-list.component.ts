import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/models/category';
import { Meeting } from 'src/app/models/meeting';
import { Store } from 'src/app/models/store';
import { User } from 'src/app/models/user';
import { CategoryService } from 'src/app/services/category.service';
import { MeetingService } from 'src/app/services/meeting.service';
import { StoreService } from 'src/app/services/store.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-meeting-list',
  templateUrl: './meeting-list.component.html',
  styleUrls: ['./meeting-list.component.css']
})
export class MeetingListComponent implements OnInit {
  meetings: Meeting[] = [];
  selected: Meeting = null;
  categories: Category[] = [];
  currentUser: User = null;
  admin: boolean = false;
  addNewMeeting = false;
  editMeeting = false;
  newMeeting: Meeting = new Meeting();
  editedMeeting: Meeting = null;
  stores: Store[] = [];
  searchCategory: Category = null;

  constructor(
    private meetingService: MeetingService,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private userService: UserService,
    private storeService: StoreService
  ) { }

  ngOnInit(): void {
    this.initialLoad();
  }

  // Methods
  buttonFill(category: Category) {
    let classToReturn: string = "btn ";
    if (category === this.searchCategory) {
      classToReturn = classToReturn.concat("btn-primary");
    } else if (category === null) {
      classToReturn = classToReturn.concat("btn-outline-info");
    } else {
      classToReturn = classToReturn.concat("btn-outline-primary");
    }
    return classToReturn;
  }

  setCategory(category: Category) {
    this.searchCategory = category;
  }

  removeCategory() {
    this.searchCategory = null;
  }


  numberOfAttendees(meeting: Meeting): number {
    if (meeting.attendees) {
      return meeting.attendees.length;
    }
    return -1;
  }

  displayMeeting(meeting: Meeting) {
    this.selected = meeting;
  }

  displayAll() {
    this.selected = null;
  }

  flagMeeting(meeting: Meeting) {
    meeting.flagged = true;
    this.updateMeeting(meeting);
  }

  unflagMeeting(meeting: Meeting) {
    meeting.flagged = false;
    this.updateMeeting(meeting);
  }

  setEditMeeting() {
    this.editMeeting = true;
    this.editedMeeting = Object.assign<Meeting, Meeting>(new Meeting(), this.selected);
  }

  cancelAddMeeting() {
    this.newMeeting = new Meeting();
    this.addNewMeeting = false;
  }

  sendUpdatedMeeting() {
    this.updateMeeting(this.editedMeeting, true);
  }

  cancelUpdateMeeting() {
    this.editedMeeting = null;
  }

  checkIfAttending(meeting: Meeting): boolean {
    console.log("****** in checkIfAttending:")
    console.log(this.currentUser);
    console.log(meeting);
    for (let index = 0; index < meeting.attendees.length; index++) {
      const user = meeting.attendees[index];
      if (user.id === this.currentUser.id) {
        return true;
      }
    }
    // if (meeting.attendees.indexOf(this.currentUser) > -1) {
    //   return true;
    // }
    return false;
  }

  attendMeeting(meeting: Meeting, show: boolean = false) {
    console.log("attendMeeting....")
    meeting.attendees.push(this.currentUser);
    console.log("list of attendees: " + meeting.attendees);
    this.updateMeeting(meeting, show);
  }

  unAttendMeeting(meeting: Meeting, show: boolean = false) {
    let i = -1;
    for (let index = 0; index < meeting.attendees.length; index++) {
      const user = meeting.attendees[index];
      if (user.id === this.currentUser.id) {
        i = index;
      }
    }
    if (i > -1) {
      meeting.attendees.splice(i, 1);
      console.log("Inside unAttendMeeting ********")
      console.log(meeting);
      this.updateMeeting(meeting, show);
    }
  }

  // Sending Data
  addMeeting() {
    this.meetingService.create(this.newMeeting).subscribe(
      data => {
        this.addNewMeeting = false;
        this.selected = this.newMeeting;
        this.reloadMeetings();
        this.newMeeting = new Meeting();
      },
      err => {
        console.error('Error creating Meeting: ' + err);
        this.addNewMeeting = false;
        this.reloadMeetings();
        this.newMeeting = new Meeting();
      }
    )
  }

  updateMeeting(meeting: Meeting, display:boolean = false) {
    this.meetingService.update(meeting).subscribe(
      data => {
        if (display) {
          this.selected = data;
          this.editMeeting = false;
        }
        this.initialLoad();
      },
      err => {
        console.error('Error updating meeting: ' + err)
      }
    );
  }

  deleteMeeting(meeting: Meeting) {
    this.meetingService.delete(meeting.id).subscribe(
      data => {
        this.reloadMeetings();
        this.selected = null;
      },
      err => {
        console.error('Error deleting meeting: ' + err)
      }
    );
  }

  // HELPERS
  initialLoad() {
    this.reloadMeetings();
    this.reloadCategories();
    this.reloadCurrentUser();
    this.reloadStores();
  }

  reloadMeetings() {
    this.meetingService.index().subscribe(
      data => {
        this.meetings = data
      },
      err => {
        console.error('Error loading meetings: ' + err)
      }
    );
  }

  reloadCategories() {
    this.categoryService.index().subscribe(
      data => {this.categories = data},
      err => {console.error('Error loading categories: ' + err)}
    );
  }

  reloadCurrentUser() {
    this.userService.retrieveLoggedIn().subscribe(
      data => {
        this.currentUser = data;
        this.checkForAdmin();
      },
      err => {console.error('Error loading current user: ' + err)}
    );
  }

  reloadStores() {
    this.storeService.index().subscribe(
      data => {
        this.stores = data
      },
      err => {console.error('Error loading stores: ' + err)}
    )
  }

  checkForAdmin() {
    if (this.currentUser.role === 'admin') {
      this.admin = true;
    } else {
      this.admin = false;
    }
  }

}
