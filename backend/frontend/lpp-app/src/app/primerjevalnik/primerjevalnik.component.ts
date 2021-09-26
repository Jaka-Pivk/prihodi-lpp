import {Component, OnInit} from '@angular/core';
import {ApiService} from '../api.service';
import {Article} from "./article";
import {DataService} from "./data.service";
import {StationCode} from "../stationCode";

@Component({
  selector: 'app-primerjevalnik',
  templateUrl: './primerjevalnik.component.html',
  styleUrls: ['./primerjevalnik.component.css']
})
export class PrimerjevalnikComponent implements OnInit {
  datas = new Article();
  sationCode = new StationCode();
  arr = null
  title = null
  arrivalsMinutes = []
  displayNumber = null

  constructor(private service: ApiService, private dataService: DataService) {
    navigator.geolocation.getCurrentPosition(data => this.update(data),
      function (error) {
        if (error.code == error.PERMISSION_DENIED)
          console.log("you denied me :-(");
      });
    this.doCalculations()
  }

  doCalculations() {
    this.dataService.sharedMessage.subscribe(message => {
      this.arr = message.split(" ")
      if (this.arr.length > 2) {
        this.retriveData(this.arr)
      }
    })
  }

  retriveData(data) {
    this.sationCode = data[1]
    this.arrivalsMinutes = []
    this.service.arrivalOnSpecificStation(this.sationCode).subscribe(message => {
      message.data.arrivals.forEach(el => {
        let tmpName = el.route_name.replace(/\D/g, '');
        this.displayNumber = data[0]
        if (tmpName === data[0]) {
          this.title = el.stations.arrival
          this.arrivalsMinutes.push(el.eta_min)
        }
      })
    })

  }

  update(data: any) {
    let lat = data.coords.latitude
    let lon = data.coords.longitude
    this.datas.lat = lat
    this.datas.lon = lon
    this.service.addPosition(this.datas).subscribe(res => {
      console.log(res)
    })
  }

  ngOnInit(): void {
  }
}
