import { Component } from '@angular/core';
import { first } from 'rxjs';
import { ApiService } from 'src/app/service/api.service';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  partyList?: any[]
  page = 1
  pageSize = 5
  isDeleting:boolean = false

  constructor(private authService: AuthService, private api: ApiService) { }

  ngOnInit() {
    this.api.getAll()
    .subscribe(list => this.partyList = list);
  }

  deleteParty(id: any) {
    const party = this.partyList!.find(x => x.id === id);
    party.isDeleting = true;
  this.api.delete(id)
  .pipe(first())
  .subscribe(() => this.partyList = this.partyList!.filter(x => x.id !== id));
  }

}
