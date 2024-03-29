# College Event Manager
*COP4710 - Database Systems*

## Description
College Event Manager is a website that aims to solve the challenges of keeping up-to-date with events hosted by most universities around campus and off-campus. The website provides a centralized platform for college students to manage, organize and attend all types of events such as social, fundraising, tech talks, and more. Instead of students having to manually search each university's website, College Event Manager aggregates all university events, both official and unofficial, in one place. This saves students the hassle of missing out on events and gives them the opportunity to explore various events around campus. Additionally, the website provides a feature to track weekly events, ensuring that students never miss out on any exciting activities happening on their campus.

## Tech Stack
- [EJS](https://ejs.co/) - Embedded JavaScript templating
- [Bootstrap](http://github.com/twbs/bootstrap/) - Front-end framework for websites
- [node.js](https://nodejs.org/en/) - Server-side JavaScript runtime
- [XAMPP](https://www.apachefriends.org/) - Local web development environment
- [Express](http://expressjs.com) - Node.js web application framework
- [MySQL](http://mysql.com/) - Relational database management system
- [jQuery](http://jquery.com) - JavaScript library for DOM manipulation

## Installation
Install Google Chrome and XAMPP
- Link to Website: [Google Chrome](https://www.google.com/chrome/dr/download/)
- Link to Website: [XAMPP](https://sourceforge.net/projects/xampp/)

Install Node
- sudo apt-get update
- sudo apt install nodejs
- sudo apt install npm

Install Nodemon
- sudo npm install -g nodemon

Update Node
- sudo npm cache clean -f
- sudo npm install -g n
- sudo n stable

Download "CEWDB.sql" file from "CollegeEventWebsite" folder
- *Recommended to save on desktop*

Download "CollegeEventWebsite" Project Folder
- *Recommended to save on desktop*

Run "CollegeEventWebsite" Project
- Open XAMPP
- Go to "Manage Servers" tab
- Click "Start" on "MySQL Database" and "Apache Web Server"
- Go back to "Welcome" tab
- Click "Open Application Folder"
- Upload "CEWDB.sql" file to "phpMyAdmin" folder
- Go to "http://localhost/phpmyadmin/index.php?route=/import"
- Upload "CEWDB.sql" file under "File to import:"
- *Open Ubuntu (Linux) / Terminal (MacOS)*
- cd [YourFileDirectory]
- sudo npm install
- sudo npm start
- Go to "http://localhost:3000/" on Google Chrome

## Contributors
Front-End - [Ethan Adkins](https://github.com/EthanAdkins)
<br> Back-End - [Kevin Alfonso](https://github.com/Kooven47)
<br> Front-End - [Pam Kitsuwan](https://github.com/sspamss)
