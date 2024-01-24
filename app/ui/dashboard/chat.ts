// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  const referer = req.headers.referer || req.headers.referrer; // get the referer from the request headers

  if (!referer || referer !== process.env.OPEN_API_KEY) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  
  try {
    const body = req.body;
    const url = 'https://api.openai.com/v1/chat/completions';
    const headers = {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    };

    const response = await axios.post(url, body, { headers: headers });

    res.status(200).json(response.data);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
