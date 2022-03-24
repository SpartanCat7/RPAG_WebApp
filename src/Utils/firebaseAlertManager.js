import firebase from "./FirebaseConfig";

export const getAllAlerts = (setCompleteList) => {
    const firestore = firebase.firestore();
    //console.log("Adquiring full list of alerts");

    var alertRef = firestore.collection("Alerts");
    var jsonList = [];

    alertRef.get().then((querySnapshot) => {
        //console.log("List adquired");

        querySnapshot.forEach((doc) => {
            //console.log(doc.id, " => ", doc.data());
            var d = doc.data();

            jsonList.push({
                id: d.id,
                userId: d.userId,
                classId: d.classId,
                date: d.date.toDate(),
                latitude: d.latitude,
                longitude: d.longitude,
                geohash: d.geohash
            });
        });
        
        //setCompleteList(jsonList);
        getArchivedAlerts(setCompleteList, jsonList)
    }).catch((error) => {
        console.log("Error getting documents: ", error);
        return null;
    });
}

export const getArchivedAlerts = (setCompleteList, completeList) => {
    const firestore = firebase.firestore();
    //console.log("Adquiring full list of alerts");

    var alertRef = firestore.collection("Archived").doc("alerts").collection("Summaries");
    //var jsonList = [];

    alertRef.get().then((querySnapshot) => {
        //console.log("List adquired");

        querySnapshot.forEach((doc) => {
            //console.log(doc.id, " => ", doc.data());
            var d = doc.data();

            var alerts = JSON.parse(d.monthAlertData);
            alerts.forEach(alert => {
                completeList.push({
                    id: alert.id,
                    userId: alert.userId,
                    classId: alert.classId,
                    date: new Date(alert.date),
                    latitude: alert.latitude,
                    longitude: alert.longitude,
                    geohash: alert.geohash
                });
            });

            /*
            jsonList.push({
                id: d.id,
                userId: d.userId,
                classId: d.classId,
                date: d.date,
                latitude: d.latitude,
                longitude: d.longitude,
                geohash: d.geohash
            });
            */
        });

        setCompleteList(completeList)
        //console.log("Archived alerts:", jsonList);
        
        //setCompleteList(jsonList);
    }).catch((error) => {
        console.log("Error getting documents: ", error);
        return null;
    });
}

export const getVotesCountForAlert = (alertId, onCountFinished) => {
    const firestore = firebase.firestore();
    var votesRef = firestore.collection("Votes");
    //votesList = [];
    console.log("Getting votes for ", alertId)

    votesRef.where("alertId", "==", alertId)
        .get()
        .then((querySnapshot) => {
            var trueCount = 0;
            var falseCount = 0;

            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                //console.log(doc.id, " => ", doc.data());
                if (doc.data().voteTrue) {
                    trueCount += 1;
                } else {
                    falseCount += 1;
                }
            });

            //console.log("trueCount = " + trueCount);
            //console.log("falseCount = " + falseCount);

            onCountFinished(trueCount, falseCount);
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
}
