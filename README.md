# File Archiver CLI Tool

A Node.js CLI tool to archive multiple files into a single `.zip` or `.tar` archive.

## Usage


npm install -g ./  # Install globally from the project root

archiver <output_file> <file1> <file2> ...

archiver -t <tar_type> <output_file> <file1> <file2> ...


*   `output_file`: The name of the output archive file (e.g., `archive.zip` or `archive.tar`).
*   `file1`, `file2`, ...: The files to include in the archive.
*   `-t`: Specify the tar type. Options: `gzip`, `bzip2`, `xz`.

## Example


archiver myarchive.zip file1.txt file2.js
archiver -t gzip myarchive.tar.gz file1.txt file2.js


## Development

1.  Clone the repository.
2.  `npm install`
3.  `npm run build`
4.  `npm link` (to install globally for testing)

## License

MIT