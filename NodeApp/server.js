const express = require("express");
const approuter = require("@sap/approuter");
const ar = approuter();
const app = express();
const { XssecPassportStrategy, XsuaaService } = require("@sap/xssec");
const PORT = process.env.PORT || 8082;
debugger;

const xssec = require('@sap/xssec');
// const JWTStrategy = require('@sap/xssec').JWTStrategy;

const passport = require('passport');
const { JWTStrategy } = require('@sap/xssec');   

const xsenv = require('@sap/xsenv');
// const xsenvObjXSUAA = xsenv.getServices({ uaa : { tag:'xsuaa' }});

// Load service credentials
debugger;
const services = xsenv.getServices({
    xsuaa: {
      name: 'sfd-xsuaa'
    }
  });
  passport.use(new JWTStrategy(services.xsuaa));
const credentials = {

        "tenantmode": services.xsuaa.tenantid,
        "sburl": services.xsuaa.sburl,
        "subaccountid": services.xsuaa.subaccountid,
        "credential-type": services.xsuaa.credential,
        "clientid": services.xsuaa.clientid,
        "xsappname": services.xsuaa.xsappname,
        "clientsecret": services.xsuaa.clientsecret,
        "serviceInstanceId": services.xsuaa.serviceInstanceId,
        "url": services.xsuaa.url,
        "uaadomain": services.xsuaa.uaadomain,
        "verificationkey": services.xsuaa.verificationkey,
        "apiurl": services.xsuaa.apiurl,
        "identityzone": services.xsuaa.identityzone,
        "identityzoneid": services.xsuaa.identityzoneid,
        "tenantid": services.xsuaa.tenantid,
        "zoneid": services.xsuaa.zoneid 
};
//new change - 21.07.2024
const authService = new XsuaaService(credentials) 
passport.use(new XssecPassportStrategy(authService));
//new change - 21.07.2024

app.use(passport.initialize());
app.use(passport.authenticate('JWT', { session: false }));

// Example API endpoint
app.get('/api', (req, res) => {  
    debugger;      
    const loggedInUser = req.user;
    if (loggedInUser) {
        const email = loggedInUser.email || loggedInUser.ext_attr?.email || loggedInUser.userName;
        res.json({ message: `Hello ${email}, welcome to the Node.js backend!` });
      } else {
        res.status(401).json({ message: "User is not authenticated" });
      }    
    
});

app.use("/", express.static("webapp/"));

app.get("/index.html",(req,res) => {
    res.sendFile(__dirname + '/../webapp/index.html')
}); 
debugger;
app.get("/", (req, res, next) => {
    console.log("Root endpoint hit");
    res.send("Welcome to TVS Next")
}); 

app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
});