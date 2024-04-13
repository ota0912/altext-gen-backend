# Alt Text Generator Backend

The backend of Altext is built on Express.js and interacts with the [Replicate API for BLIP](https://replicate.com/salesforce/blip) to generate alt text for images.

### Routes

- `/healthcheck` (GET)
- `/generateAlt` (POST) 
    - Request body: `{"image":"<image URL>"}`