# Faketube-client
How to run the web server:
in the server repository README i described how to init the mongo database so the server will work with it, make sure you do that also.
1.clone the repository
2.in the project open terminal and write "npm i" to download all the Dependencies.
3.still in the terminal write "npm run build", after that a folder named build will appear.
4.copy all the things under the new build folder and paste them under the public folder in the server project, make sure to delete all the                         duplicates files/folders and just the new ones that you copied will be there.
5.in the server terminal type "npm i".
6.still in the terminal in the server project type "nodemon .\server.js\".
7.open browser and go to "http://localhost:880/".
8.enjoy the website.


Work process:
first we took the code from the react app and adjust what we need to prepare it to get information from the server.
At the same time we worked on the server to handle all requests. first we divided the server to MVC structure
and started handling the login logic, then the user and videos requests.
Then we start to combine the server model to extract information from the mongoDB.
