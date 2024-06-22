import express from "express";
import db from "./db.js";
import cors from "cors";
import bodyParser from "body-parser";
import { appendToJsonArray } from "./jsonwrite.js";

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  db.all(`SELECT * FROM land_survey`, (err, rows) => {
    if (err) {
      console.error(err.message);
      return res
        .status(500)
        .json({ error: "Error fetching data from land_survey table" });
    }
    const responseData = [];

    rows.forEach((row) => {
      db.all(
        `SELECT * FROM species_data WHERE land_survey_id = ?`,
        [row.id],
        (err, comDataRows) => {
          if (err) {
            console.error(err.message);
            return res
              .status(500)
              .json({ error: "Error fetching species_data" });
          }

          responseData.push({
            ...row,
            comData: comDataRows,
          });
          if (responseData.length === rows.length) {
            res.status(200).json(responseData);
          }
        }
      );
    });
  });
});

app.post("/json", (req, res) => {
  const data = req.body;
  appendToJsonArray(data);
  console.log(data);

  res.send(data);
});

app.post("/", (req, res) => {
  const formData = req.body;
  db.run(
    `INSERT INTO land_survey 
     (jilla, gabisha, ban_ko_nam, plot_number, plot_ko_prakar, plot_ko_size, 
      miti, mohada, akshyansha, desantar, uchai, bhiralopan, ban_ko_prakar, 
      mato_ko_rang, mukhya_prajati, mato_ko_banawat) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      formData.jilla,
      formData.gabisha,
      formData.ban_ko_nam,
      formData.plot_number,
      formData.plot_ko_prakar,
      formData.plot_ko_size,
      formData.miti,
      formData.mohada,
      formData.akshyansha,
      formData.desantar,
      formData.uchai,
      formData.bhiralopan,
      formData.ban_ko_prakar,
      formData.mato_ko_rang,
      formData.mukhya_prajati,
      formData.mato_ko_banawat,
    ],
    function (err) {
      if (err) {
        console.error(err.message);
        return res
          .status(500)
          .json({ error: "Error inserting into land_survey table" });
      }

      const landSurveyId = this.lastID;
      formData.comData.forEach((item) => {
        db.run(
          `INSERT INTO species_data 
           (land_survey_id, staniya, naam, cluster, tilar, uchai, taja, sukeko) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            landSurveyId,
            item.staniya || null,
            item.naam || null,
            item.cluster || null,
            item.tilar || null,
            item.uchai || null,
            item.taja || null,
            item.sukeko || null,
          ],
          function (err) {
            if (err) {
              console.error(err.message);
              return res
                .status(500)
                .json({ error: "Error inserting into species_data table" });
            }
          }
        );
      });

      res.status(200).json({ message: "Form data inserted successfully" });
    }
  );
});

app.listen(4000, () => {
  console.log("Listening on port 4000");
});
