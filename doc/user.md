# User API Spec 

## Register User

Endpoint: POST /api/users

Request Body : 

```json
{
    "username": "nafhan",
    "password": "rahasia",
    "name": "Ghifari Nafhan"
}
```

Response Body (Success): 

```json
{
    "data": {
      "username": "nafhan",
        "name": "Ghifari Nafhan"
    }
}
```

Response Body (Error): 

```json
{
    "errors": "Username already registered"
}
```

## Login User

Endpoint: POST /api/users/login

Request Body :

```json
{
    "username": "nafhan",
    "password": "rahasia"
}
```

Response Body (Success):

```json
{
    "data": {
      "username": "nafhan",
      "name": "Ghifari Nafhan",
      "token": "session_id_generated"
    }
}
```

Response Body (Error):

```json
{
    "errors": "Username or password is wrong"
}
```

## Get User

Endpoint: GET /api/users/current

Headers:
- Authorization: token

Response Body (Success):

```json
{
    "data": {
      "username": "nafhan",
      "name": "Ghifari Nafhan",
      "token": "session_id_generated"
    }
}
```

Response Body (Error):

```json
{
    "errors": "Unauthorized"
}
```

## Update User

Endpoint: PATCH /api/users/current

Headers:
- Authorization: token

Request Body :

```json
{
    "password": "rahasia", //optional
    "name": "Ghifari Nafhan" //optional
}
```

Response Body (Success):

```json
{
    "data": {
      "username": "nafhan",
        "name": "Ghifari Nafhan"
    }
}
```

## Logout User

Endpoint: DELETE /api/users/current

Headers:
- Authorization: token

Request Body :



Response Body (Success):

```json
{
    "data": true
}
```

