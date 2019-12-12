<!--  -->

## Initial API DOCS

For keeping track of API endpoints

## GET all `Bugs`

```js
// get single bug with http://localhost:5000/api/bugs/:id
fetch("http://localhost:5000/api/bugs/", {
  method: "GET",
  headers: {
    "content-type": "application/json",
    authorization: "token"
  }
});
```

## POST - Create new bug

```js
fetch("http://localhost:5000/api/bugs/new", {
  method: "POST",
  headers: {
    authorization: "token",
    "content-type": "application/json"
  },
  body: {
    title: "this is a bug",
    body: "this is the body"
  }
});
```

## PATCH - Open/Close bug

returns the specific updated document

```
http://localhost:5000/api/bugs/:id/close
http://localhost:5000/api/bugs/:id/open
```

## PATCH - Add label

```js
fetch("http://localhost:5000/api/bugs/:id/labels", {
  method: "PATCH",
  headers: {
    "content-type": "application/json",
    authorization: "token"
  },
  body: {
    name: "enhancement",
    color: "#ffff00"
  }
});
```

## DELETE - Remove label

```js
fetch("http://localhost:5000/api/bugs/:id/labels/:name", {
  method: "DELETE",
  headers: {
    "content-type": "application/json",
    authorization: "token"
  },
  body: {
    name: "enhancement",
    color: "#ff0000"
  }
})
```
