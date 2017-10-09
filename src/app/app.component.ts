import { Component, OnInit } from '@angular/core';
import { JsonServiceService } from './services/json-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  imageSrc = 'https://steamcommunity-a.akamaihd.net/economy/image/';
  dragData;
  // User1
  listItemsUser1;
  itemsCounterUser1;
  paginationCounterUser1;
  currentPaginationUser1 = 1;
  // User2
  listItemsUser2;
  itemsCounterUser2;
  paginationCounterUser2;
  currentPaginationUser2 = 1;

  constructor(private jsonServiceService: JsonServiceService) {
    this.jsonServiceService.getUser1JSON().subscribe(data => {
      this.listItemsUser1 = data.items;
      this.emptyCellFillerUser1();
    }, error => console.log(error)
    );
    this.jsonServiceService.getUser2JSON().subscribe(data => {
      this.listItemsUser2 = data.items;
      this.emptyCellFillerUser2();
    }, error => {
      this.listItemsUser2 = [];
      this.listItemsUser2.push('empty');
      this.emptyCellFillerUser2();
      this.jsonServiceService.createFileJSON(this.listItemsUser2);
      console.log(error);
    }
    );
  }

  ngOnInit() {

  }

  emptyCellFillerUser1() {
    this.itemsCounterUser1 = this.listItemsUser1.length;
    if (this.itemsCounterUser1 !== 0) {
      this.paginationCounterUser1 = Math.ceil(this.itemsCounterUser1 / 6);
    } else {
      this.paginationCounterUser1 = 1;
    }
    if (this.itemsCounterUser1 < this.paginationCounterUser1 * 6) {
      for (let i = this.itemsCounterUser1; i < this.paginationCounterUser1 * 6; i++ , this.itemsCounterUser1++) {
        this.listItemsUser1.push('empty');
      }
    }
  }

  emptyCellFillerUser2() {
    this.itemsCounterUser2 = this.listItemsUser2.length;
    if (this.itemsCounterUser2 !== 0) {
      this.paginationCounterUser2 = Math.ceil(this.itemsCounterUser2 / 6);
    } else {
      this.paginationCounterUser2 = 1;
    }
    if (this.itemsCounterUser2 < this.paginationCounterUser2 * 6) {
      for (let j = this.itemsCounterUser2; j < this.paginationCounterUser2 * 6; j++ , this.itemsCounterUser2++) {
        this.listItemsUser2.push('empty');
      }
    }
  }

  findCategory(data) {
    const index1 = data.indexOf('(');
    const index2 = data.indexOf(')');
    return data.substring(index1 + 1, index2);
  }

  paginationPlusUser1() {
    if (this.currentPaginationUser1 < this.paginationCounterUser1) {
      this.currentPaginationUser1++;
    }
  }

  paginationMinusUser1() {
    if (this.currentPaginationUser1 > 1) {
      this.currentPaginationUser1--;
    }
  }

  paginationPlusUser2() {
    if (this.currentPaginationUser2 < this.paginationCounterUser2) {
      this.currentPaginationUser2++;
    }
  }

  paginationMinusUser2() {
    if (this.currentPaginationUser2 > 1) {
      this.currentPaginationUser2--;
    }
  }

  allowDropUser(event, user) {
    if (!this.compareData(user)) {
      event.preventDefault();
    }
  }

  compareData(user) {
    const dragUser = this.dragData.substring(this.dragData.indexOf('User'), 6);
    return user === dragUser;
  }

  drag(event) {
    this.dragData = event.target.id;
    event.dataTransfer.setData('text', event.target.id);
  }

  dropUser(event) {
    const data = event.dataTransfer.getData('text');
    if (data.indexOf('User1') > 0) {
      const id = data.substring(0, data.indexOf('User1', ''));
      this.emptyCellCleaner(this.listItemsUser2);
      this.emptyCellCleaner(this.listItemsUser1);
      this.listItemsUser2.push(this.listItemsUser1[id]);
      this.listItemsUser1.splice(id, 1);
      this.emptyCellFillerUser1();
      this.emptyCellFillerUser2();
      if (this.currentPaginationUser1 > this.paginationCounterUser1) {
        this.currentPaginationUser1 = this.paginationCounterUser1;
      }
    } else if (data.indexOf('User2') > 0) {
      const id = data.substring(0, data.indexOf('User2', ''));
      this.emptyCellCleaner(this.listItemsUser1);
      this.emptyCellCleaner(this.listItemsUser2);
      this.listItemsUser1.push(this.listItemsUser2[id]);
      this.listItemsUser2.splice(id, 1);
      this.emptyCellFillerUser2();
      this.emptyCellFillerUser1();
      if (this.currentPaginationUser2 > this.paginationCounterUser2) {
        this.currentPaginationUser2 = this.paginationCounterUser2;
      }
    }
  }

  emptyCellCleaner(list) {
    for (let k = 0; k < list.length; k++) {
      if (list[k] === 'empty') {
        list.splice(k, 1);
        k--;
      }
    }
  }

  save() {
    this.emptyCellCleaner(this.listItemsUser1);
    this.emptyCellCleaner(this.listItemsUser2);
    this.jsonServiceService.postJSON(this.listItemsUser1, this.listItemsUser2).subscribe(
      data => console.log(data),
      error => console.log(error)
    );
    this.emptyCellFillerUser1();
    this.emptyCellFillerUser2();
  }
}
