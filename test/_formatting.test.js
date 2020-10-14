const { exec } = require('child_process');
const { join } = require('path');
const test = require('tape');

test('All files should be formatted', { timeout: 25000 }, async (t) => {
  let out = '';
  let err;

  try {
    out = await new Promise((resolve, reject) =>
      exec(
        `prettier --list-different '**/*.{js,json}'`,
        {
          cwd: join(__dirname, '..'),
          encoding: 'utf-8'
        },
        (err, stdout, stderr) => {
          let out = stdout + stderr;
          if (err && !out) {
            if (!out) {
              return reject(err);
            }
            out += err.message;
          }
          return resolve(out);
        }
      )
    );
  } catch (e) {
    err = e;
  }

  t.ifError(err, 'Formatter ran successfully.');
  t.isEqual(out.toString(), '');

  t.end();
});
