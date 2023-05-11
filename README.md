# ContaCam SFTP Sync

Sync your local ContaCam camera folders into your remote server using SFTP

## Requirements

* Must have Node.js >= 16


## Install

    git clone https://github.com/kosinix/contacam-sftp-sync.git
    cd contacam-sftp-sync
    npm install

## Usage

Add a `config.json` and edit content:


    {
        "connection":{
            "host": "174.41.158.11",
            "port": "22",
            "username": "ubuntu",
            "privateKey": "C:/path/to/ssh/putty/keys/ssh-gsu-web.ppk"
        },
        "remoteDir": "/home/ubuntu/videos",
        "localDir": "C:/ContaCam",
        "cameraNames": [
            "CyberTrack H3"
        ]
    }

Change privateKey to password if you are using username and password.


And run in command line

    node index.js