// important: CLOUDINARY env variable must be present BEFORE cloduinary package is imported!
import "./config.js";
import express from "express";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

// explicit config of API creds is ONLY necessary
// if we have no CLOUDINARY_URL in env and
// env is loaded AFER cloudinary package
// cloudinary.config({
//   cloud_name: "your cloudname",
//   api_key: "your apikey",
//   api_secret: "your api-secret",
// });

const storage = multer.memoryStorage(); // store received files in memory
const upload = multer({ storage }); // create upload middleware

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World! <a href='/upload'>Upload Form</a>");
});

// FRONTEND - Upload Form (binary => multipart/form-data)

app.get("/upload", (req, res) => {
  const btnStyle =
    "cursor: pointer; padding: 10px; background: purple; color: white; font-size: 2rem; border-radius: 10px;";
  let strForm = `
    <form method="post" action="/upload" enctype="multipart/form-data" >
      <label for="img" style="${btnStyle}">Pick file</label>
      <input type="hidden" name="token" value="ey12345" />
      <input id="img" style="display:none;" type="file" name="image" />
      <div style="margin-top: 30px;">
        <button type="submit">Send chosen file</button>
      </div>
    </form>
  `;
  res.send(strForm);
});

app.post("/upload", upload.single("image"), async (req, res, next) => {
  console.log("Body: ", req.body);
  console.log("File: ", req.file);

  // let base64Obj = convertBufferToString(req.file);

  // => following might give buffer ? it does, but not a full data uri with the correct exension!
  // let base64StrBinary = req.file.buffer.toString() => useless, will give non encoded, binary string
  let base64EncodedStr = req.file.buffer.toString("base64");
  const base64DataUri = `data:${req.file.mimetype};base64,${base64EncodedStr}`;
  console.log(base64DataUri.slice(0, 40));
  // return res.json({
  // message: "Uploaded!",
  // "Str length": base64DataUri.length,
  // "Obj length": base64Obj.content.length
  // });

  // return res.json({
  //   message: "Received upload, yay!",
  //   base64Uri: base64Obj.content,
  //   base64Str,
  // })

  // upload to cloudinary!
  try {
    // const imageData = await cloudinary.uploader.upload(base64Obj.content);
    const uploadOptions = req.file.mimetype.includes("video")
      ? { resource_type: "video" }
      : {};
    const imageData = await cloudinary.uploader.upload(
      base64DataUri,
      uploadOptions
    );
    console.log(imageData);
    res.json({
      body: req.body,
      message: "Upload succeeded!",
      url: imageData.url,
      url_secure: imageData.secure_url,
    });
  } catch (err) {
    console.log("[ERROR]:", err);
    res.status(400).json({
      error: "Upload failed",
    });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Example app listening on http://localhost:5000");
});

//Run app, then load http://localhost:5000 in a browser to see the output.
