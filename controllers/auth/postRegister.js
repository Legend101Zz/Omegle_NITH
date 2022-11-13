const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const transporter= require("../../routes/nodemailer")
// const sgmail= require('@sendgrid/mail')
// const api_key= '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'

// sgmail.setApiKey(api_key)
//     const message = {
//       to: 'armaanshukla06@gmail.com',
//       from: '21bma009@nith.ac.in',
//       subject: "hello",
//       text: "hello",
//       html : '<h1>Hello</h1>'
//     }
//     sgmail.send(message)
//     .then(response=>{
//       console.log('Email sent')
//     }).catch(err=>{
//       console.log(err)
//     })
const Sib= require('sib-api-v3-sdk')
require('dotenv').config()
const client= Sib.ApiClient.instance
const apiKey = client.authentications['api-key']
apiKey.apiKey = process.env.API_KEY


const postRegister = async (req, res) => {
  try {
    const { username, mail, password } = req.body;

    console.log("user register request came");
    // check if user exists
    const userExists = await User.exists({ mail: mail.toLowerCase() });

    console.log(userExists);

    if (userExists) {
      return res.status(409).send("E-mail already in use.");
    }

    // encrypt password
    const encryptedPassword = await bcrypt.hash(password, 10);
    const tranEmailApi = new Sib.TransactionalEmailsApi()
    const sender = {
      email: '21bma009@nith.ac.in',
      name: 'Armaan',
  }
  const receivers = [
      {
          email: 'thearmaanshukla@gmail.com'
      },
  ]
  

    // create user document and save in database
    const user = await User.create({
      username,
      mail: mail.toLowerCase(),
      password: encryptedPassword,
    }).then(tranEmailApi
    .sendTransacEmail({
        sender,
        to: receivers,
        subject: 'Hello',
        textContent: `
        developer.
        `,
        htmlContent: `
        <h1>hey</h1>
        
                `,
    })
    .then(console.log)
    .catch(console.log))
    
   

    // create JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        mail,
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: "24h",
      }
    )
    // .then(result=>{
    //   transporter.sendMail({
    //   to: 'armaanshukla06@gmail.com' ,
    //   from: '21bma009@nith.ac.in',
    //   subject: 'Fuck you',
    //   html :' <h1>HEllo murgi</h1>'
    // });

    // }).catch(err=>{
    //   console.log(err)
    // })
    
    // sgmail.send(message)

    res.status(201).json({
      userDetails: {
        mail: user.mail,
        token: token,
        username: user.username,
      },
    })
    
  } catch (err) {
    return res.status(500).send("Error occured. Please try again");
  }
};

module.exports = postRegister;
