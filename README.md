# Phone Directory App

### Installation

* Clone this project.

> git clone https://github.com/Solid129/phone-directory-service

* Install dependencies of the project

> npm install

* Set environment variables of `PORT`, `JWT_SIGNATURE`, `MONGO_DB_URL`
* Run the project using

> npm start

## Introduction

* Phone directory server to store, get and update contacts with JWT based username & password authentication.

### User

* User model contains username, password and the current token for authorization.
* Password is hashed before storing. 
Model for User:

```javascript
{
    username: String,
    password: String,
    token: String | null
}
```

### Contact

* All CRUD operations requests require authorization.
* Contact log is stored for every view and update activity.
* Contact log is used to fetch total views of a contact and per-day views of the last 7 days. 
Model for Contact:

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

Model for Contact Log:

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
