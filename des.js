PUT http:mdmdemowin:9080/com.ibm.mdm.server.ws.restful/resources/MDMWSRESTful
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
                "InquiryType": "getProcessingPurpose",
                "InquiryParam": {
                    "tcrmParam": [{
                        "@name": "ProcPurpId",
                        "$": "728153040827580997"
                    }, {
                        "@name": "InquiryLevel",
                        "$": "0"
                    }]
                }
            }
        }
    }