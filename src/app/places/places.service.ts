import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { delay, map, switchMap, take, tap } from 'rxjs/operators';
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

  constructor(private authService: AuthService, private http: HttpClient) {}

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
    let generatedId: string;
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
    return this.http
      .post<{ name: string }>(
        'https://ionicangularbookingapp-default-rtdb.firebaseio.com/offered-places.json',
        {
          ...newPlace,
          id: null,
        }
      )
      .pipe(
        switchMap(response => {
          generatedId = response.name;
          return this.places;
        }),
        take(1),
        tap(places => {
          newPlace.id = generatedId;
          this._places.next(places.concat(newPlace));
        })
      );
  }

  udpatePlace(placeId: string, title: string, desc: string) {
    return this.places.pipe(
      take(1),
      delay(1000),
      tap((places) => {
        const updatedPlaceIndex = places.findIndex((pl) => pl.id === placeId);
        const updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          desc,
          oldPlace.imgUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId
        );
        this._places.next(updatedPlaces);
      })
    );
  }
}
