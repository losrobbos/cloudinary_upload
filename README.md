# Cloudinary upload demo (minimal)

This shows an upload demo with Express.js

Before starting the app:

Make sure you are signed up to Cloudinary. 

Copy the .env.sample file and create a .env file from it.
Replace the sample cloudinary URL with YOUR cloudinary URL from the cloudinary dashboard after login to cloudinary.

## Start the App

```
npm install
npm run dev
```

## Test the upload

In Browser open: http://localhost:5000/upload

Click button "Pick file".

Choose an image or video file from your filesystem and click upload button.
(Important: in case you upload a video the file must be less that 10MB)

If cloudinary ENV is setup correctly, you should get 
a success JSON response with the URL to the uploaded file and some other info.

Click the URL and check if your file is stored in cloudinary.

In case it is a video the video should directly play in the browser.

Enjoyyyy!

```