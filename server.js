const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const csv = require('csvtojson');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(
  'mongodb+srv://abc123:abc123!@cluster0-depbt.mongodb.net/data-grid?retryWrites=true&w=majority'
);

const schema = new mongoose.Schema(
  { values: mongoose.Schema.Types.Mixed },
  { strict: false }
);
const logSchema = new mongoose.Schema({
  message: String,
  timestamp: { type: Date, default: Date.now },
});

const LogModel = mongoose.model('LogModel', logSchema);
schema.pre('findOneAndUpdate', function (next) {
  console.log(this._update);
  const message = `Updated value at row ${this._update.row}, col ${this._update.col}`;
  LogModel.create({ message });
  next();
});
const Data = mongoose.model('Data', schema);

app.get('/data', async (req, res) => {
  const data = await Data.find({}).select([
    '-__v',
    '-updatedAt',
    '-row',
    '-col',
  ]);
  res.send(data);
});
app.get('/history', async (req, res) => {
  const data = await LogModel.aggregate([
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$timestamp' },
        },
        count: { $sum: 1 },
        messages: { $push: "$$ROOT" },
      },
    },
  ]);
  res.send(data);
});

app.put('/data/:id', async (req, res) => {
  const { id } = req.params;
  const { field, value, row, col } = req.body;
  const data = await Data.findById(id);
  const oldValue = data[field];
  data[field] = value;
  data.dateModified = new Date();
  await Data.findByIdAndUpdate(id, {
    [field]: value,
    updatedAt: new Date(),
    row,
    col,
  });
  res.send({ oldValue, newValue: value });
});

app.post('/upload', async (req, res) => {
  const { file } = req.body;
  const jsonArray = await csv().fromString(file);
  console.log(jsonArray);
  await Data.deleteMany({});
  await Data.insertMany(jsonArray);
  res.send({ message: 'File uploaded successfully' });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
