var utilityService = {
    guIdGenarator: function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    },
    getAnonPrivateKey: function () {
        var privateKey = 'Y<5l58ylS!W;1oY72XR4Pu5Ic0OfTmy1dyLx2l7-T=k2Q,|W 2ZLatfs]&Z12XrM';
        return privateKey;
    },
    getPrivateKey: function () {
        var privateKey = 'U59-60&!GA80@4T3i0u1X0~63w9-99i494k7L1"21492328J=`[W14s9=5X1<}do';
        return privateKey;
    },
    getDbConfig: function () {
        var dbConifg = {
            url: "mongodb://127.0.0.1:27017",
            database: '8836d0ce-d3c9-407b-bf72-4fce8d501244'
        }
        return dbConifg;
    },
    getOrigin: function () {
        var origin = "http://localhost:4200";
        return origin;
    },
    getPort: function () {
        var port = "4000"
        return port;
    },
    getSmsServiceToken: function(){
        var smsServiceToken = "8b0b4f86543d97efabce675a5801612d";
        return smsServiceToken;
    }
}

module.exports = utilityService;