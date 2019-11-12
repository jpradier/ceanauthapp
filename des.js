PUT http: //mdmdemowin:9080/com.ibm.mdm.server.ws.restful/resources/MDMWSRESTful
    Content - Type: application / json
Accept: application / json
Authorization: Basic bWRtYWRtaW46bWRtYWRtaW4 =

    {
        "TCRMService": {
            "@schemaLocation": "http://www.ibm.com/mdm/schema MDMDomains.xsd",
            "RequestControl": {
                "requestID": 1000,
                "DWLControl": {
                    "requesterName": "cusadmin",
                    "requesterLocale": "100",
                    "requesterTimeZone": "UTC"
                }
            },
            "TCRMInquiry": {
                "InquiryType": "getAllConsentByParty",
                "InquiryParam": {
                    "tcrmParam": [{
                        "@name": "ConsentOwnerId",
                        "$": "882853040695875849"
                    }, {
                        "@name": "InquiryLevel",
                        "$": "0"
                    }, {
                        "@name": "Filter",
                        "$": ""
                    }]
                }
            }
        }
    }