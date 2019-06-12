import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { ViewChild } from '@angular/core';
import { S } from '@angular/cdk/keycodes';


@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {
  closeResult: string;
  displayedColumns: string[] = ['Id', 'Date', 'Roomname', 'Agenda', 'Time', 'Level'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  applyFilter(filterValue: string) {
    {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }


  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private modalService: NgbModal) { }

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

  }

}
export interface PeriodicElement {
  Id: number;
  Date: string;
  Roomname: string;
  Agenda: string;
  Time: string;
  Level: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { Id: 1, Date: '10/05/2019', Roomname: 'conference 1', Agenda: 'agenda1', Time: '07:30pm', Level: 0 },
  { Id: 2, Date: '15/02/2018', Roomname: 'conference 2', Agenda: 'agenda2', Time: '09:30am', Level: 1 },
  { Id: 3, Date: '30/05/2018', Roomname: 'conference 3', Agenda: 'agenda3', Time: '10:30am', Level: 2 },
  { Id: 4, Date: '25/01/2019', Roomname: 'conference 4', Agenda: 'agenda4', Time: '12:30pm', Level: 0 },
  { Id: 5, Date: '10/02/2019', Roomname: 'conference 5', Agenda: 'agenda5', Time: '06:30pm', Level: 1 },
  { Id: 6, Date: '06/03/2019', Roomname: 'conference 6', Agenda: 'agenda6', Time: '10:30pm', Level: 2 },
  { Id: 7, Date: '15/04/2019', Roomname: 'conference 7', Agenda: 'agenda7', Time: '12:30pm', Level: 0 },
  { Id: 8, Date: '07/05/2019', Roomname: 'conference 8', Agenda: 'agenda8', Time: '08:30pm', Level: 1 },



];




