**Only for Learning Purpose**

Hey Guys!

This is a sample application on Javascript on Frontend and NodeJS on Backend that demonstrate add and remove data in JSON Filesystem, Mysql database and Mongodb cloud database system.


>How to run the app using Filesystem:-

- Clone the repository to your local setup.

- Go to server folder through cmd and execute the command <node test.js> to run the local NodeJS server for demonstrating Filesystem.

- Go to the config.js and set isDBProfile as false.

- Make sure CORS is configured on your browser and if not then download the extension for it and run.

- Go to UI folder and simply run index.html


>How to run the app using Mysql database system:-

- Make sure you have Mysql server installed and running on your system.

- Clone the repository to your local setup.

- Execute the command <npm install> into the root folder.

- Open testdb.js and configure Mysql connection's configurations like host, user, port and password.

- Go to server folder through cmd and execute the command <node testdb.js> to run the local NodeJS server for demonstrating Mysql DBMS.

- Go to the config.js and set isDBProfile as true.

- Make sure CORS is configured on your browser and if not then download the extension for it and run.

- Go to UI folder and simply run index.html


>How to run the app using Mongodb cloud database system:-

- Create an account and cluster in www.Mongodb.com.

- Configure user and provide your system's IP address to the Database Access.

- Clone the repository to your local setup.

- Execute the command <npm install> into the root folder.

- Open testmongodb.js and copy paste mongourl that you can get from cluster>connect>connect your application>NodeJS in mongodb cloud account.

- Go to server folder through cmd and execute the command <node testmongodb.js> to run the local NodeJS server for demonstrating Mongodb DBMS.

- Go to the config.js and set isDBProfile as true.

- Make sure CORS is configured on your browser and if not then download the extension for it and run.

- Go to UI folder and simply run index.html