//npmimport { getSession } from 'next-auth/react';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    return res.status(200).json({ message: `Hello ` });
}