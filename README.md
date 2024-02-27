# imnd-ajax

Component for working with ajax requests. It works with get and post requests.

Usage:
```
import ajax from 'imnd-ajax';
```

POST request:
```
  ajax
    .post(
      url,
      {
        [url params]
      }
    )
    .then(data => {
      if (data.success) {
        ...
      }
    });
```
GET request:
```
    ajax
      .get(
        url,
        {
          [url params]
        },
        'html'
      )
      .then(data => {
          ...
      });
```
