const express = require("express");
const Replicate = require("replicate");
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
require("dotenv").config();

const app = express();
app.use(cors(corsOptions))

const port = process.env.PORT || 3000;

const replicate = new Replicate({
  auth: process.env.REPLICATE_AUTH,
});

function generateRandomUserAgent() {
    const coolBotVersions = ["0.0", "1.0", "2.0", "2.5"];
    const genericLibraryVersions = ["0.0", "1.0", "1.5", "2.0"];
    const coolBotNames = ["CoolBot", "AwesomeBot", "SuperBot", "MegaBot"];
    const exampleDomains = ["bread.com", "womp.net", "val.org", "test.com", "test.net", "test.org"];

    const randomCoolBotName = coolBotNames[Math.floor(Math.random() * coolBotNames.length)];
    const randomExampleDomain = exampleDomains[Math.floor(Math.random() * exampleDomains.length)];
    
    const userAgent = `${randomCoolBotName}/${coolBotVersions[Math.floor(Math.random() * coolBotVersions.length)]} (https://${randomExampleDomain}/coolbot/; coolbot@example.org) generic-library/${genericLibraryVersions[Math.floor(Math.random() * genericLibraryVersions.length)]}`;
    return userAgent;
}

app.use(express.json());

app.post("/generateAlt", async (req, res) => {
  const { image } = req.body;

  if (!image) {
    return res.status(400).json({ error: "Image URL is required" });
  }

  let cnt = 0
  while(cnt != 5){
    cnt = cnt + 1;
    try {
        let output = await replicate.run(
            "salesforce/blip:2e1dddc8621f72155f24cf2e0adbde548458d3cab9f00c0139eea840d0ac4746",
            {
                input: {
                image: image,
                },
                headers: {
                "User-Agent": generateRandomUserAgent()
                },
            }
        );
        output = output.replace(/^Caption:\s*/, '');
        return res.json(output);
    } catch (error) {
        console.error("Error:", error);
        if(cnt<5) continue;
        return res.status(500).json({ error: "Internal server error" });
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
