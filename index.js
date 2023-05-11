let fs = require('fs');
let path = require('path');
let Client = require('ssh2-sftp-client');
let sftp = new Client();

const folderDive = (dir, files = []) => {
    // Get files only and return file names
    let objects = fs.readdirSync(dir, { withFileTypes: true })

    let dirs = objects.filter((dirent) => {
        return dirent.isDirectory()
    }).map(dirent => dirent.name).map(fileName => {
        return path.join(dir, fileName)
    })

    let _files = objects.filter((dirent) => {
        return dirent.isFile()
    }).map(dirent => dirent.name).map(fileName => {
        return path.join(dir, fileName)
    })

    for (x = 0; x < dirs.length; x++) {
        let subFiles = folderDive(dirs[x])
        _files = _files.concat(subFiles)
    }

    return _files
}

    ; (async () => {
        try {
            if(!fs.existsSync('./config.json')){
                throw new Error('Please create file named config.json and place your settings. See README.md')
            }
            let config = fs.readFileSync('./config.json')
            config = JSON.parse(config)
            if(config?.connection?.privateKey){
                config.connection.privateKey = fs.readFileSync(config.connection.privateKey)
            }

            const DIR_HOME = config?.localDir
            const CAMERA_NAMES = config?.cameraNames

            await sftp.connect(config.connection);

            for (x = 0; x < CAMERA_NAMES.length; x++) {
                const IN_DIR = path.join(DIR_HOME, CAMERA_NAMES[x])

                let sources = folderDive(IN_DIR)
                sources = sources.map((f) => {
                    f = f.replace(/\\/g, '/')
                    return f
                })
                // Get only 
                sources = sources.filter(fileName => {
                    let ext = path.extname(fileName);
                    ext = ext.split('.').pop().toLowerCase();
                    return ext === 'mp4'
                })

                let destins = sources.map((f) => {
                    f = f.replace(DIR_HOME.replace(/\\/g, '/'), config.remoteDir)
                    return f
                })

                for (let y = 0; y < sources.length; y++) {
                    const remoteDir = path.dirname(destins[y])
                    await sftp.mkdir(remoteDir, true);
                    await sftp.fastPut(sources[y], destins[y]);
                    console.log(y, sources[y], destins[y])

                }
            }


        } catch (e) {
            console.error(e);
        } finally {
            await sftp.end();
        }
    })()


