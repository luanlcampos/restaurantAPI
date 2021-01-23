# restaurantAPI

[Heroku link](https://dry-lowlands-75857.herokuapp.com/)

## Get All Restaurants Route

```http
GET http://localhost:8080/api/restaurants?page=1&perPage=5&borough=Bronx
```
https://dry-lowlands-75857.herokuapp.com/api/restaurants?page=1&perPage=5&borough=Bronx

## Get Restaurant By ID
```http
GET http://localhost:8080/api/restaurants/<restaurant_id>
```
https://dry-lowlands-75857.herokuapp.com/api/restaurants/<restaurant_id>

## Add A New Restaurant Through POST Request

Using some API tester platform, run the following command:

```http
POST http://localhost:8080/api/restaurants
Content-Type: application/json

{
​    "address": {
​      "coord": [43.757781395479874, -79.40500633525815],
​      "building": "105",
​      "street": "Harrison Garden Blvd",
​      "zipcode": "M2N0C3"
​    },
​    "borough": "North York",
​    "cuisine": "Brazilian",
​    "grades": [
​    {
​    "date": "2014-06-21T00:00:00.000Z",
​    "grade": "A",
​    "score": 5
​    }
​    ],
​    "name": "Luna Br",
​    "restaurant_id": 12345678
}
```



## Update Restaurant Through PUT Request

Using some API tester platform, run the following command:

``` http
PUT http://localhost:8080/api/restaurants/600b1d6fb9aae9465325481c
Content-Type: application/json

{
    "borough": "Some Data",
    "name": "Some Data"
}
```



## Delete Restaurant Through DELETE Request

Using some API tester platform, run the following command:

``` http
DELETE http://localhost:8080/api/restaurants/<_id>
```





