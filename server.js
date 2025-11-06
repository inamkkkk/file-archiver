#!/usr/bin/env node

const { program } = require('commander');
const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

program
  .version('1.0.0')
  .description('A CLI tool to archive files into a zip or tar archive.')
  .arguments('<output_file> [files...]')
  .option('-t, --tar <type>', 'Specify tar type (gzip, bzip2, xz)')
  .parse(process.argv);

const outputFile = program.args[0];
const files = program.args.slice(1);
const tarType = program.opts().tar;

if (!outputFile || files.length === 0) {
  program.help();
}

async function archiveFiles(outputFile, files, tarType) {
  const output = fs.createWriteStream(outputFile);
  let archive;

  if (outputFile.endsWith('.zip')) {
    archive = archiver('zip', { zlib: { level: 9 } });
  } else if (outputFile.endsWith('.tar') || outputFile.endsWith('.tar.gz') || outputFile.endsWith('.tgz') || outputFile.endsWith('.tar.bz2') || outputFile.endsWith('.tar.xz')) {
    let format = 'tar';
    let options = {};

    if (tarType === 'gzip' || outputFile.endsWith('.tar.gz') || outputFile.endsWith('.tgz')) {
      options = { gzip: true, gzipOptions: { level: 9 } };
    } else if (tarType === 'bzip2' || outputFile.endsWith('.tar.bz2')) {
      format = 'tar';
      options = { bzip2: true };
    } else if (tarType === 'xz' || outputFile.endsWith('.tar.xz')) {
      format = 'tar';
      options = { xz: true };
    }

    archive = archiver(format, options);
  } else {
    console.error('Unsupported archive format.  Use .zip, .tar, .tar.gz, .tgz, .tar.bz2, or .tar.xz');
    process.exit(1);
  }

  archive.on('error', function(err) {
    console.error('Archive error:', err);
    process.exit(1);
  });

  output.on('close', function() {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
  });

  archive.pipe(output);

  for (const file of files) {
    try {
      const stats = await fs.promises.stat(file);

      if (stats.isFile()) {
        archive.file(file, { name: path.basename(file) });
      } else if (stats.isDirectory()) {
        archive.directory(file, path.basename(file));
      } else {
        console.warn(`Skipping ${file}: Not a file or directory.`);
      }
    } catch (err) {
      console.error(`Error processing ${file}:`, err.message);
      process.exit(1);
    }
  }

  archive.finalize();
}

archiveFiles(outputFile, files, tarType);
