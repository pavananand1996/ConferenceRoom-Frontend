import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbCalendar, NgbDateParserFormatter, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { ViewChild } from '@angular/core';
import { S } from '@angular/cdk/keycodes';
import { RestService } from '../services/rest.service';
import swal from 'sweetalert2'
import { Router } from '@angular/router';

export interface PeriodicElement {

  Date: string;
  Roomname: string;
  Agenda: string;
  StartTime: string;
  EndTime: string;
  Level: number;
  AttendeesCount: number;
  Action: any

}
var ELEMENT_DATA: PeriodicElement[] = []
@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})


export class StatusComponent implements OnInit {
  closeResult: string;
  historyData: any = [];
  history: boolean = false;
  displayedColumns: string[] = ['Date', 'Roomname', 'Agenda', 'StartTime', 'EndTime', 'Level', 'AttendeesCount', 'Action'];

  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  minDate: any;
  modelRef: NgbModalRef;
  id: any;
  loader: boolean = true;

  applyFilter(filterValue: string) {
    {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }


  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private modalService: NgbModal,
    private rest: RestService,
    private calendar: NgbCalendar,
    private _dateParser: NgbDateParserFormatter,
    private router: Router
  ) {
    ELEMENT_DATA = [];
    setTimeout(() => {
      this.loader = false;

    }, 1000);
    this.loader = true;
    let user = localStorage.getItem('userName')
    this.rest.history(user).subscribe((res) => {

      console.log("history", res.data);
      if (res.data.length != 0) {
        //console.log("insideS")
        this.history = true;
      }
      let history = [];
      history = res.data;
      history.forEach(element => {
        ELEMENT_DATA.push({
          'Date': element.Date,
          'Roomname': element.roomName,
          'Agenda': element.Agenda,
          'StartTime': element.startTime,
          'EndTime': element.endTime,
          'Level': element.floor,
          'AttendeesCount': element.attendees.length,
          'Action': element._id
        })
      });


      this.historyData = ELEMENT_DATA;
    })
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }



  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    let DateValue = this._dateParser.format(this.calendar.getToday());
    let trimmedDate = DateValue.split("-")
    this.minDate = trimmedDate[0] + '/' + trimmedDate[1] + '/' + trimmedDate[2]
    console.log(this.minDate)
  }

  delete() {
    this.rest.cancelBookings(this.id).subscribe((res) => {
      if (res) {
        this.modelRef.close();
        let user = localStorage.getItem('userName')
        this.rest.history(user).subscribe((res) => {

          console.log("history", res.data);
          if (res.data.length != 0) {
            //console.log("insideS")
            this.history = true;
          }
          let history = [];
          history = res.data;
          history.forEach(element => {
            ELEMENT_DATA.push({
              'Date': element.Date,
              'Roomname': element.roomName,
              'Agenda': element.Agenda,
              'StartTime': element.startTime,
              'EndTime': element.endTime,
              'Level': element.floor,
              'AttendeesCount': element.attendees.length,
              'Action': element._id
            })
          });


          this.historyData = ELEMENT_DATA;

          console.log("********************")
          this.router.navigateByUrl('/dashboard', { skipLocationChange: true }).then(() =>
            this.router.navigate(["/dashboard/history"]));
          //this.router.navigateByUrl("/dashboard/history");
        })
        swal.fire("", "Cancelled Successfully!", "success");

      } else {
        this.modelRef.close();
        swal.fire("", "Please try again.", "error")
      }
    })
  }

  openSm(contentConfirm, id) {
    console.log(id);
    this.id = id;
    this.modelRef = this.modalService.open(contentConfirm);

  }
  closeModal() {
    this.modelRef.close()
  }

}





