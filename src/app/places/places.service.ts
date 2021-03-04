import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { delay, map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Place } from './place.model';

// [
//   new Place(
//     'p1',
//     'Kuala Lumpur',
//     'Heart of Malaysia',
//     'https://png.pngtree.com/png-clipart/20190619/original/pngtree-hand-painted-anime-food-material-japanese-food-pork-cutlet-curry-rice-png-image_4019838.jpg',
//     15.9,
//     new Date('2019-01-01'),
//     new Date('2019-12-31'),
//     'abc'
//   ),
//   new Place(
//     'p2',
//     'Petaling Jaya',
//     'Heart of Selangor',
//     'https://png.pngtree.com/png-clipart/20190619/original/pngtree-hand-painted-anime-food-material-japanese-food-pork-cutlet-curry-rice-png-image_4019838.jpg',
//     13.33,
//     new Date('2019-01-01'),
//     new Date('2019-12-31'),
//     'abc'
//   ),
//   new Place(
//     'p3',
//     'Sri Hartamas',
//     'Lots of classy food!',
//     'https://png.pngtree.com/png-clipart/20190619/original/pngtree-hand-painted-anime-food-material-japanese-food-pork-cutlet-curry-rice-png-image_4019838.jpg',
//     190.0,
//     new Date('2019-01-01'),
//     new Date('2019-12-31'),
//     'abc'
//   ),
// ]

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  desc: string;
  imgUrl: string;
  price: number;
  title: string;
  userId: string;
}

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([]);

  constructor(private authService: AuthService, private http: HttpClient) {}

  get places() {
    return this._places.asObservable();
  }

  fetchPlaces() {
    return this.http
      .get<{ [key: string]: PlaceData }>(
        'https://ionicangularbookingapp-default-rtdb.firebaseio.com/offered-places.json'
      )
      .pipe(
        map((response) => {
          const places = [];
          for (const key in response) {
            if (response.hasOwnProperty(key)) {
              places.push(
                new Place(
                  key,
                  response[key].title,
                  response[key].desc,
                  response[key].imgUrl,
                  response[key].price,
                  new Date(response[key].availableFrom),
                  new Date(response[key].availableTo),
                  response[key].userId
                )
              );
            }
          }
          return places;
        }),
        tap((places) => {
          this._places.next(places);
        })
      );
  }

  getPlace(id: string) {
    return this.http.get<PlaceData>(
      `https://ionicangularbookingapp-default-rtdb.firebaseio.com/offered-places/${id}.json`
    ).pipe(
      map(response => {
        return new Place(
          id,
          response.title,
          response.desc,
          response.imgUrl,
          response.price,
          new Date(response.availableFrom),
          new Date(response.availableTo),
          response.userId,
        );
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
        switchMap((response) => {
          generatedId = response.name;
          return this.places;
        }),
        take(1),
        tap((places) => {
          newPlace.id = generatedId;
          this._places.next(places.concat(newPlace));
        })
      );
  }

  udpatePlace(placeId: string, title: string, desc: string) {
    let updatedPlaces: Place[];
    return this.places.pipe(
      take(1),
      switchMap((places) => {
        const updatedPlaceIndex = places.findIndex((pl) => pl.id === placeId);
        updatedPlaces = [...places];
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
        return this.http.put(
          `https://ionicangularbookingapp-default-rtdb.firebaseio.com/offered-places/${placeId}.json`,
          { ...updatedPlaces[updatedPlaceIndex], id: null }
        );
      }),
      tap(() => {
        this._places.next(updatedPlaces);
      })
    );
  }
}
