## Full text search based on [InvertedIndex](https://en.wikipedia.org/wiki/Inverted_index) and ordinary approach.


## Summary

## This project has CRUD operation on Contact data.
#### Each contact has firstName, lastName and phoneNumber.


MongoDB is used to store contact data and Redis to store InvertedIndex. On each CRUD operation, the InvertedIndex gets updated.

The Important part of this project is how to fetch data. There are two methods to get contact data based on InvertedIndex or Ordinary approach.

In the ordinary method, it loops over all contact data and returns all matched records.

With InvertedIndex, first lowercase each contact data(like firstName) and split them by " " then add all prefixes of each member of this array that has more than or equal to 3 lengths as key to Redis Set which their values are their ContactIDs.

When a query comes in, first lowercase query and split that by " " then Intersect all sets which have these keys. The result is all contact that has words that start with query words.

### Below is the comparison between these two methods' performance

![comparison](https://github.com/alinowrouzii/contact-list/tree/master/md/comparison.png)

As you see above at first, it creates 1000 contacts that take 13.3 seconds (13.3 ms per request).

Then it requests 1000 times with the InvertedIndex approach that takes 12.6 seconds (12.6 ms per request).
And finally, it tests the ordinary method that takes 44.1 seconds (44.1 ms per request).

The InvertedIndex method is nearly 3.5 faster than ordinary search.



### How to run API

At first, dependencies should be installed by:
```
npm i
```
Then activate MongoDB by:
```
mongod
```

Then you can run the API by:
```
npm run dev
```
Also to test API run:
```
npm run test
```
### API documentation is available at [localhost:5000/api-docs](http://localhost:5000/api-docs)

### Note: To run API, Redis-Server and MongoDB must be installed before. Also .env.test file should be renamed to .env.

