amr-duration

---

Calculate amr duration，require node >= 6.0

## Install

```
npm install amr-duration --save
```

## Usage

```javascript
  const amrDuration = require('amr-duration');
  
  // callback
  amrDuration('voice.amr', (err, duration) => {
    if (err) {
      console.log(err.message);
      return;
    }
    
    console.log(`You file is ${duration} millisecond long`);
  });
  
  // Promise
  armDuration('voice.amr')
    .then((duration) => {
      console.log(`You file is ${duration} millisecond long`);
    })
    .catch((err) => {
      console.log(err.message);
    });
```

## API

### armDuration(amr, callback)

#### amr 

Type: String|Buffer|Stream

Path of the file or amr content

### callback(err, duration)

Type: function

Callback to be called once duration(ms) is calculated

### return

Type: Promise

Always return a Promise when call armDuration
