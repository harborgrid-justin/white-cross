self.__BUILD_MANIFEST = {
  "__rewrites": {
    "afterFiles": [],
    "beforeFiles": [
      {
        "has": [
          {
            "type": "header",
            "key": "next-url",
            "value": "/appointments(?:/.*)?"
          }
        ],
        "source": "/appointments/:nxtIid",
        "destination": "/appointments/(.):nxtIid"
      },
      {
        "has": [
          {
            "type": "header",
            "key": "next-url",
            "value": "/students(?:/.*)?"
          }
        ],
        "source": "/students/:nxtIid",
        "destination": "/students/(.):nxtIid"
      }
    ],
    "fallback": []
  },
  "sortedPages": [
    "/_app",
    "/_error"
  ]
};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()