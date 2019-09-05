import * as fs from 'fs';

function readFiles(dirname: string, fileType: string, onFileContent: (filename: string, content: string) => void, onError: (error: NodeJS.ErrnoException) => void) {
    fs.readdir(dirname, (err, filenames) => {
        if (err) {
            onError(err);
            return;
        }
        filenames.forEach(filename => {
            if (filename.endsWith(fileType)) {
                console.log(`reading file: ${filename}`)
                fs.readFile(dirname + filename, 'utf-8', function (err, content) {
                    if (err) {
                        onError(err);
                        return;
                    }
                    onFileContent(filename, content);
                });
            }
        });
    });
}

var data: {[id: string]: string} = {};
readFiles('inputs/', '.ppm', function (filename, content) {
    data[filename] = content;
}, function (err) {
    throw err;
});
