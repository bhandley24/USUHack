
var apiRequests = require('./apiRequests')

exports.handler = function(event, context, callback) {
    var intentType = null
    if (event.request && event.request.intent && event.request.intent.name) {
        intentType = event.request.intent.name
        var requestOptions = apiRequests.getOptions(apiRequests.getIntentURL(intentType))
        apiRequests.get(requestOptions, function(response) {
            console.log(intentType, response)
            
            var responseText = "";
            switch(intentType) {
                case 'ToDoIntent':
                    if (response) {
                        response.forEach(function(element) {
                            if (element.enrollments[0] && element.enrollments[0].computed_current_score) {
                                responseText = responseText + " Your grade in " + element.name + " is " + element.enrollments[0].computed_current_score;                                
                            }
                        })
                    } else {
                        responseText = "Grades response check failed"
                    }
                    break;
                case 'GradesIntent':
                    if (response) {
                        response.forEach(function(element) {
                            if (element.enrollments[0] && element.enrollments[0].computed_current_score) {
                                responseText = responseText + " Your grade in " + apiRequests.gradeParser(element.name) + " is " + element.enrollments[0].computed_current_score;                                
                            }
                        })
                    } else {
                        responseText = "Grades response check failed"
                    }
                    break;
                case 'CoursesIntent':
                    if (response) {
                        response.forEach(function(element) {
                            responseText = responseText + " " + element.name + " ";
                        })
                    } else {
                        responseText = "Courses response check failed"
                    }
                    break;
                case 'ActivitySummaryIntent':
                    if (response) {
                        response.forEach(function(element) {
                            responseText = responseText + " You have " + element.count + " " + element.type + "s " + element.unread_count + " unread.";
                        })
                    } else {
                        responseText = "Activity summary response check failed"
                    }
                    break;
                case 'RecentActivityIntent':
                    if (response) {
                        response = response.slice(-5)
                        responseText = "Your activity is: "
                        response.forEach(function(element) {
                            responseText = responseText + " New  " + element.type + " " + element.title
                        })
                    } else {
                        responseText = "Activity summary response check failed"
                    }
                    break;
                case 'InboxIntent':
                    if (response) {
                        response = response.slice(-5)
                        responseText = "You have " + response.length + " messages"
                        response.forEach(function(element) {
                            responseText = " " + responseText + element.subject + " from " + element.participants[0].name
                        })
                    }
                    break;
            }
            callback(null, apiRequests.getAlexaText(responseText));
        })
    } 
    else {
        callback(null, apiRequests.getAlexaText("Intent not found"))
        console.log('Intent not found')
    }
}
