import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places: Place[] = [
    new Place(
      'p1',
      'Kuala Lumpur',
      'Heart of Malaysia',
      'https://png.pngtree.com/png-clipart/20190619/original/pngtree-hand-painted-anime-food-material-japanese-food-pork-cutlet-curry-rice-png-image_4019838.jpg',
      15.90
    ),
    new Place(
      'p2',
      'Petaling Jaya',
      'Heart of Selangor',
      'https://png.pngtree.com/png-clipart/20190619/original/pngtree-hand-painted-anime-food-material-japanese-food-pork-cutlet-curry-rice-png-image_4019838.jpg',
      13.33
    ),
    new Place(
      'p3',
      'Sri Hartamas',
      'Lots of classy food!',
      'https://png.pngtree.com/png-clipart/20190619/original/pngtree-hand-painted-anime-food-material-japanese-food-pork-cutlet-curry-rice-png-image_4019838.jpg',
      190.00
    ),
  ];

  get places() {
    return [...this._places];
  }

  getPlace(id: string) {
    return {...this._places.find(p => p.id === id)};
  }

  constructor() {}
}
