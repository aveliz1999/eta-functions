# eta-functions
Firebase functions for the ETA backend functionality

The callable https function handles the backend updating of distance and time for ETAs through Firebase Functions

### Install Instructions
* Follow steps 1 to 3 of https://firebase.google.com/docs/functions/get-started to initialize your firebase functions directory
* `git clone https://github.com/aveliz1999/eta-functions` to download this repository
* Replace the files in your functions directory with those provided in this repository
* Get a google cloud API key with access to the [Distance Matrix API](https://developers.google.com/maps/documentation/distance-matrix/start)
* `firebase functions:config:set distanceapi.key="YOUR API KEY HERE"` to set the environment variable so the firebase function can access the Distance Matrix API
* `firebase deploy --only functions` to deploy the function and dependencies
