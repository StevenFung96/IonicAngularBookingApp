import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([
    new Place(
      'p1',
      'Kuala Lumpur',
      'Heart of Malaysia',
      'https://png.pngtree.com/png-clipart/20190619/original/pngtree-hand-painted-anime-food-material-japanese-food-pork-cutlet-curry-rice-png-image_4019838.jpg',
      15.9,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'abc'
    ),
    new Place(
      'p2',
      'Petaling Jaya',
      'Heart of Selangor',
      'https://png.pngtree.com/png-clipart/20190619/original/pngtree-hand-painted-anime-food-material-japanese-food-pork-cutlet-curry-rice-png-image_4019838.jpg',
      13.33,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'abc'
    ),
    new Place(
      'p3',
      'Sri Hartamas',
      'Lots of classy food!',
      'https://png.pngtree.com/png-clipart/20190619/original/pngtree-hand-painted-anime-food-material-japanese-food-pork-cutlet-curry-rice-png-image_4019838.jpg',
      190.0,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'abc'
    ),
  ]);

  get places() {
    return this._places.asObservable();
  }

  getPlace(id: string) {
    return this.places.pipe(
      take(1),
      map((places) => {
        return { ...places.find((p) => p.id === id) };
      })
    );
  }

  addPlace(
    title: string,
    desc: string,
    price: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    const newPlace = new Place(
      Math.random().toString(),
      title,
      desc,
      'https://png.pngtree.com/png-clipart/20190619/original/pngtree-hand-painted-anime-food-material-japanese-food-pork-cutlet-curry-rice-png-image_4019838.jpg',
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );
    this.places.pipe(take(1)).subscribe((places) => {
      this._places.next(places.concat(newPlace));
    });
  }

  constructor(private authService: AuthService) {}
}
