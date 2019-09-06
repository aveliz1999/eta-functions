const functions = require('firebase-functions');
const HttpsError = functions.https.HttpsError;
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const axios = require('axios');

/**
 * Update the time and distance of an ETA with a specified id
 *
 * @type {HttpsFunction & Runnable<any>}
 */
exports.updateETA = functions.https.onCall(async (data, context) => {
	const id = data.id;
	try{
		const doc = await db.collection('etas').doc(id).get();

		if(!doc.exists) {
			throw HttpsError('not-found', 'No ETA found with that ID')
		}

		const {location, target} = doc.data();
		const distanceQuery = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${location.latitude},${location.longitude}&destinations=${target.latitude},${target.longitude}&key=${functions.config().distanceapi.key}&departure_time=now&units=imperial&avoid=tolls`

		const result = (await axios.get(distanceQuery)).data;
		if(!result || result.status !== 'OK') {
			throw HttpsError('internal', 'An error occurred while retrieving the ETA data.')
		}
		const {duration_in_traffic: time, distance} = result.rows[0].elements[0];

		await db.collection('etas').doc(id).update({
			eta: {
				time: time.text,
				distance: distance.text
			}
		});

		return {
			time: time.text,
			distance: distance.text
		}
	}
	catch(err) {
		if(err instanceof HttpsError) {
			throw err;
		}
		throw HttpsError('internal', 'An error occurred while updating the ETA.');
	}
});
