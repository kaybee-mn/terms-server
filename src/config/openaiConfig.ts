const {Configuration, OpenAIApi} = require('openai');
require('dotenv').config();

const configuratioin = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuratioin);
export default openai;