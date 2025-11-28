import mongoose from 'mongoose'
const Schema = new mongoose.Schema({
  title: String,
  date: { type: Date, default: Date.now },
  geojson: Object,
  score: Number,
  mode: String,
  thumbnail: String
})
export default mongoose.model('RouteHistory', Schema)
