
/**
 * @file This file defines the API endpoint for running whitehat penetration tests.
 * This API is designed to be used by enterprise customers to test the security of their systems.
 *
 * @see /tests/security/penetration-testing.ts
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

type Data = {
  success: boolean;
  message: string;
  results?: any;
};

// TODO: Add authentication and authorization to this endpoint.
// This endpoint should only be accessible to authenticated enterprise customers.

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    try {
      // Run the playwright tests with a JSON reporter
      const { stdout } = await execPromise('npx playwright test tests/security/penetration-testing.ts --reporter json');

      // The JSON reporter outputs the results to stdout.
      const results = JSON.parse(stdout);

      res.status(200).json({ success: true, message: 'Penetration tests completed.', results });

    } catch (error: any) {
      console.error(error);
      // If the tests fail, playwright will exit with a non-zero exit code.
      // The error object will contain the stdout from the test run, which includes the JSON report.
      // We can parse this to get the results.
      let results;
      try {
        results = JSON.parse(error.stdout);
      } catch (e) {
        results = error.stdout;
      }
      res.status(500).json({ success: false, message: 'Failed to run penetration tests.', results });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
