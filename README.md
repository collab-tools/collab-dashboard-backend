# collab-dashboard-backend

This project hosts the API endpoints that collab-dashboard-v2 requires.

## Prerequisites
1. Collab
2. NodeJS

## Installation
1. [Install](https://github.com/collab-tools/collab/wiki/Set-Up-Developer-Environment) the Collab project
2. Type 'npm install' in the command line

## Usage
1. Keep the backend server running by typing 'npm start' in the command line
2. Open a new command line, and navigate to `collab-tools/collab-dashboard-frontend`
3. Type 'npm install' in `collab-tools/collab-dashboard-frontend` command line if you have not set up the [Collab Dashboard Frontend](https://github.com/collab-tools/collab-dashboard-frontend) project
4. Otherwise, type `npm run development` in `collab-tools/collab-dashboard-frontend` command line

## Create Admin User
```bash
# (Assuming your developer_key is set to 12341234 in config/local-dev.json)
$ curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -d 'devKey=12341234&username=admin&password=admin&name=admin&isAdmin=1' "http://localhost:5000/api/admin"
```


Listen 9000

<VirtualHost *:9000>
        ServerName nuscollab.comp.nus.edu.sg
        DocumentRoot "/home/sadm/NUSCollab/collab-dashboard/public/dist/app"

        ProxyPreserveHost On
        ProxyRequests Off
        ProxyPass /api http://localhost:4000/api
        ProxyPassReverse /api http://localhost:4000/api

        Alias "/assets" "/home/sadm/NUSCollab/collab-dashboard/public/dist/assets"
        Alias "/libs" "/home/sadm/NUSCollab/collab-dashboard/public/dist/libs"

        RewriteEngine on
        RewriteRule   ^/app/(.+)$  / [R]

        <Directory /home/sadm/NUSCollab/collab-dashboard/public/dist>
                Require all granted
                <IfModule dir_module>
                        DirectoryIndex index.html index.php app/index.html
                </IfModule>
        </Directory>
</VirtualHost>


<VirtualHost *:80>
        ServerName nuscollab.comp.nus.edu.sg
        DocumentRoot "/var/www/"
        ProxyPreserveHost On
        ProxyRequests Off
        ProxyPass / http://localhost:8080/
        ProxyPassReverse / http://localhost:8080/

        RewriteEngine On
        RewriteCond %{HTTP:X-Forwarded-Protocol} !https
        RewriteRule ^.*$ https://%{SERVER_NAME}%{REQUEST_URI}
</VirtualHost>

http://nuscollab.comp.nus.edu.sg

ssh sadm@nuscollab-i.comp.nus.edu.sg
dcscristadmcollab

sudo systemctl restart httpd

sudo firewall-cmd --permanent --add-port=8080/tcp
sudo firewall-cmd --reload

sudo chcon -Rt httpd_sys_content_t public_html/

sudo chmod a+x $HOME

sudo netstat -tnlp