import {
  Component,
  OnInit,
  OnChanges,
  OnDestroy,
  Input,
  Output,
  ViewChild,
  EventEmitter,
  ElementRef
} from '@angular/core';
import {fromEvent, Observable, Subscription, timer} from 'rxjs';
import {debounceTime, throttleTime} from 'rxjs/operators';
import {ApiService} from '../api.service';
import {Article} from '../primerjevalnik/article';
import {DataService} from "../primerjevalnik/data.service";

@Component({
  selector: 'app-horizontal-scroller',
  templateUrl: './horizontal-scroller.component.html',
  styleUrls: ['./horizontal-scroller.component.css']
})
export class HorizontalScrollerComponent implements OnInit {
  @Input()
  result$: Observable<any>;

  @ViewChild('horizontalScrollElem', {static: true})
  horizontalScrollElem: ElementRef | null = null;

  enablePrev = false;
  enableNext = false;
  private scrollObserver: Subscription | null = null;

  dataSource = null;
  arrivalsArr = null;


  bdf = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  min = []
  colors = ['#E10000', '#074DEF', '#12EF07']

  constructor(private apiservice: ApiService, private dataService: DataService) {
    this.apiservice.getStations().subscribe(data => {
      this.dataSource = data.data;
    })
    this.setArrivals()
  }

  setArrivals() {
    this.apiservice.arrivalOnStation().subscribe(bb => {
        this.arrivalsArr = bb
      console.log(this.arrivalsArr)
      }
    )
  }

  prepareMinutes(arg1, arg2, arg3) {
    this.dataService.nextMessage(arg1+" "+arg2+ " "+arg3)
  }

// tslint:disable-next-line:typedef
  ngOnInit() {
    if (this.horizontalScrollElem) {
      const horizontalScrollElem = this.horizontalScrollElem
      this.scrollObserver = fromEvent(
        horizontalScrollElem.nativeElement,
        'scroll',
      )
        .pipe(debounceTime(100), throttleTime(100))
        .subscribe(_ => {
          this.updateNavigationBtnStatus(horizontalScrollElem
            .nativeElement as HTMLElement);
        });
    }
  }

// tslint:disable-next-line:typedef use-lifecycle-interface
  ngOnChanges() {
    timer(100).subscribe(() => {
      if (this.horizontalScrollElem) {
        this.updateNavigationBtnStatus(this.horizontalScrollElem
          .nativeElement as HTMLElement);
      }
    });
  }

// tslint:disable-next-line:typedef use-lifecycle-interface
  ngOnDestroy() {
    if (this.scrollObserver) {
      this.scrollObserver.unsubscribe();
      this.scrollObserver = null;
    }
  }

// tslint:disable-next-line:typedef
  showPrev() {
    if (this.horizontalScrollElem) {
      if (this.horizontalScrollElem) {
        const clientWidth = (this.horizontalScrollElem.nativeElement.clientWidth * 0.24)
        this.horizontalScrollElem.nativeElement.scrollTo({
          left: this.horizontalScrollElem.nativeElement.scrollLeft - clientWidth,
          behavior: 'smooth',
        });
      }
    }
  }

// tslint:disable-next-line:typedef
  showNext() {
    if (this.horizontalScrollElem) {
      if (this.horizontalScrollElem) {
        const clientWidth = (this.horizontalScrollElem.nativeElement.clientWidth * 0.24)
        this.horizontalScrollElem.nativeElement.scrollTo({
          left: this.horizontalScrollElem.nativeElement.scrollLeft + clientWidth,
          behavior: 'smooth',
        });
      }
    }
  }

// tslint:disable-next-line:typedef
  private

  updateNavigationBtnStatus(elem
                              :
                              HTMLElement
  ) {
    this.enablePrev = true
    this.enableNext = true
    if (elem.scrollLeft === 0) {
      this.enablePrev = false;
    }
    if (elem.scrollWidth === elem.clientWidth + elem.scrollLeft) {
      this.enableNext = false;
    }
  }
}
