import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef, NgbDateParserFormatter, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { NgbDateFRParserFormatt } from '../Dateparserformat';
import swal from 'sweetalert2'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { $ } from 'protractor';
import { DataService } from '../services/data.service';
import { RestService } from '../services/rest.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatt }]
})
export class BookingsComponent implements OnInit {
  visible = true;
  validForm: boolean = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  // attendees: any = [
  //   { name: 'satya@miraclesoft.com' },
  //   { name: 'manogya@miraclesoft.com' },
  //   { name: 'hema@miraclesoft.com' },
  // ];
  attendees: any = [];
  slotShow: boolean = false;
  noRooms: boolean = false;
  modelRef: NgbModalRef;
  modalData: any;
  modelDate: any;
  sTime: any;
  timeZoneValue: any = '';
  agenda: any;
  slotsForm: FormGroup
  conferenceRoooms: any = [];
  floorValue: any;
  minDate: any;
  infoData: any;
  location: any;
  startTime: any;
  endTime: any;
  sMedridian: any;
  eMedridian: any;
  roomName: any;
  constructor(private modalService: NgbModal,
    private _dateParser: NgbDateParserFormatter,
    private calendar: NgbCalendar,
    private formBuilder: FormBuilder,
    private _dataService: DataService,
    private rest: RestService) {
    this.slotsForm = this.formBuilder.group({
      modelDate: ['', Validators.required],
      timeZoneValue: ['', Validators.required],
      meridianValue: ['AM', Validators.required],
      sTime: ['', Validators.required],
      floorValue: ['', Validators.required],
      endMeridianValue: ['AM', Validators.required],
      eTime: ['', Validators.required],
      Location: ['', Validators.required]
    })
  }
  closeResult: string;
  ngOnInit() {
    console.log(this.calendar.getToday())
    this.minDate = this.calendar.getToday();
    // this._dataService.myData().subscribe()
  }





  open(content, roomId) {
    console.log(roomId);
    this.roomName = roomId
    this.modelRef = this.modalService.open(content, { centered: true });
    for (let i = 0; i < this.conferenceRoooms.length; i++) {
      if (roomId == this.conferenceRoooms[i].roomName) {
        this.modalData = this.conferenceRoooms[i]
      }
    }
    console.log('data', this.modalData)
  }

  openInfo(contentInfo, roomId) {
    console.log("roomId", roomId)
    this.roomName = roomId
    this.modelRef = this.modalService.open(contentInfo, { centered: true });
    for (let i = 0; i < this.conferenceRoooms.length; i++) {
      if (roomId == this.conferenceRoooms[i].roomName) {
        this.infoData = this.conferenceRoooms[i]
      }
    }
    console.log('data', this.infoData)
    if (this.infoData) {
      var samp = this.infoData.facilities[0]
      console.log(JSON.stringify(samp))
    }
  }

  closeModal() {
    this.modelRef.close()
  }
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.attendees.push({ name: value.trim() });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(attendee: any): void {
    const index = this.attendees.indexOf(attendee);

    if (index >= 0) {
      this.attendees.splice(index, 1);
    }
  }

  showSlots() {
    console.log('function called', this.slotsForm.value)
    let slots = this.slotsForm.value;
    let date = this.modelDate.year + '/' + this.modelDate.month + '/' + this.modelDate.day;
    var stime = this.startTime
    var hours = Number(stime.match(/^(\d+)/)[1]);
    var minutes = Number(stime.match(/:(\d+)/)[1]);
    var AMPM = this.sMedridian;
    if (AMPM == "PM" && hours < 12) hours = hours + 12;
    if (AMPM == "AM" && hours == 12) hours = hours - 12;
    var sHours = hours.toString();
    var sMinutes = minutes.toString();
    if (hours < 10) sHours = "0" + sHours;
    if (minutes < 10) sMinutes = "0" + sMinutes;
    console.log(sHours + ":" + sMinutes);
    this.startTime = sHours + ":" + sMinutes;
    //end time 

    var etime = this.endTime
    var ehours = Number(etime.match(/^(\d+)/)[1]);
    var eminutes = Number(etime.match(/:(\d+)/)[1]);
    var eAMPM = this.eMedridian;
    if (eAMPM == "PM" && ehours < 12) ehours = ehours + 12;
    if (eAMPM == "AM" && ehours == 12) ehours = ehours - 12;
    var eHours = ehours.toString();
    var eMinutes = minutes.toString();
    if (ehours < 10) eHours = "0" + eHours;
    if (eminutes < 10) eMinutes = "0" + eMinutes;
    console.log(eHours + ":" + eMinutes);
    this.endTime = eHours + ":" + eMinutes;


    let obj = {
      'hostName': localStorage.getItem('userName'),
      'roomName': this.roomName,
      'hostEmail': localStorage.getItem('email'),
      'Date': date,
      'location': this.location,
      'floor': this.floorValue,
      'timeZone': this.timeZoneValue,
      'startTime': this.startTime,
      'endTime': this.endTime
    }
    console.log("boj", obj);
    this.rest.searchSlots(obj).subscribe((result) => {
      if (result.status) {
        console.log(result.rooms)
        this.conferenceRoooms = result.rooms
        if (result.rooms.length != 0) {
          this.slotShow = true;
          this.noRooms = false;
        } else {
          this.slotShow = false;
          this.noRooms = true;
        }
      }
    })
    // this.slotShow = !this.slotShow
  }

  saveConfRoomData() {
    console.log('attendees', this.attendees, this.agenda)
    let date = this.modelDate.year + '/' + this.modelDate.month + '/' + this.modelDate.day;
    var stime = this.startTime
    var hours = Number(stime.match(/^(\d+)/)[1]);
    var minutes = Number(stime.match(/:(\d+)/)[1]);
    var AMPM = this.sMedridian;
    if (AMPM == "PM" && hours < 12) hours = hours + 12;
    if (AMPM == "AM" && hours == 12) hours = hours - 12;
    var sHours = hours.toString();
    var sMinutes = minutes.toString();
    if (hours < 10) sHours = "0" + sHours;
    if (minutes < 10) sMinutes = "0" + sMinutes;
    console.log(sHours + ":" + sMinutes);
    this.startTime = sHours + ":" + sMinutes;
    //end time 

    var etime = this.endTime
    var ehours = Number(etime.match(/^(\d+)/)[1]);
    var eminutes = Number(etime.match(/:(\d+)/)[1]);
    var eAMPM = this.eMedridian;
    if (eAMPM == "PM" && ehours < 12) ehours = ehours + 12;
    if (eAMPM == "AM" && ehours == 12) ehours = ehours - 12;
    var eHours = ehours.toString();
    var eMinutes = minutes.toString();
    if (ehours < 10) eHours = "0" + eHours;
    if (eminutes < 10) eMinutes = "0" + eMinutes;
    console.log(eHours + ":" + eMinutes);
    this.endTime = eHours + ":" + eMinutes;

    let data = {
      'hostName': localStorage.getItem('userName'),
      'roomName': this.roomName,
      'hostEmail': localStorage.getItem('email'),
      'attendees': this.attendees,
      'Agenda': this.agenda,
      'Date': date,
      'location': this.location,
      'floor': this.floorValue,
      'timeZone': this.timeZoneValue,
      'startTime': this.startTime,
      'endTime': this.endTime
    }
    console.log("request", data)
    this.modelRef.close();
    this.rest.booking(data).subscribe((res) => {
      if (res.status) {
        swal.fire("", "Conference Room Boooked Successfully!", "success")
      } else {
        swal.fire("", "Please try again.", "error")
      }

    })

  }

  selectTimezone($event) {
    console.log('-->', $event.target.value);
    this.timeZoneValue = $event.target.value
  }

  selectFloor($event) {
    console.log('-->', $event.target.value);
    this.floorValue = $event.target.value
  }

  selectLocation($event) {
    console.log('-->', $event.target.value);
    this.location = $event.target.value;
  }

  Meridian(event, state) {
    if (state == 'start') {
      this.sMedridian = event.target.value;
    } else {
      this.eMedridian = event.target.value;
    }
  }
  //addedcode

  enterdTime(event, state) {
    console.log("enterdtiem", event.target.value);
    if (state == 'start') {
      this.startTime = event.target.value;
    } else {
      this.endTime = event.target.value;
    }

    var f = event.target.value;
    if (f.length == 1 && f > 1) {
      console.log('loop1')
      //  alert("0"+f);
      f = "0" + f;
    }
    if (f.length == 2) {
      console.log('loop2')
      var s = f.substring(1, 2);
      //  alert(s);
      if (s == ":" || s == " ") {
        console.log('loop3')
        event.target.value = "0" + f.substring(0, 1) + ":";
      }
      else {
        console.log('loop4')
        event.target.value = f + ":";
      }
    }
    else {
      console.log('loop5')
      event.target.value = f;
    }

  }
  validate() {
    alert("checking")
  }
}

