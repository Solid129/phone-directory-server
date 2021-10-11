# Phone Directory App

### Commands to Run

* Clone this project.
* Install dependencies of the project

> npm i

* Set environment variables of `PORT`, `JWT_SIGNATURE`, `MONGO_DB_URL`
* Run the project using

> npm start


## Introduction

  + Phone directory service to post, get and update contacts.
  + username and password to authenticate for adding, getting or updating contacts.

### User

* User model with username and password also containing current token for authorization.
* password is hashed before storing

Model used for User is:

```javascript
{
    username: String,
    password: String,
    token: String | null
}
```

### Contact

* All CRUD operations request requires authorization.
* Contact log is stored for every `view` and `update` activity.
* Contact log is used to fetch total views of contact and last seven days per day views.
Model used for Contact is:

```javascript
{
    user: String,
    firstName: String,
    middleName: String | null,
    lastName: String,
    email: String | null,
    mobileNumber: String | null,
    landlineNumber: String | null,
    photo: String | null,
    notes: String | null,
    createdAt: Date,
    updatedAt: Date
}
```

Model used for Contact Log is:

```javascript
{
    userId: String,
    contactId: String,
    activity: String,
    dateInNumber: Number,
    createdAt: Date,
    updatedAt: Date
}
```
