#Development server

Run ng serve for a dev server. Navigate to http://localhost:4200/. The application will automatically reload if you change any of the source files.

#How to use

First off all you need to run backend from API folder. Then you should set your database connection in "ConnectionStrings", which is located in appsettings.json file in API folder. After adding migration and updating database you can run ng serve. To register an admin simply create user with username admin, every other created user wll be created as regular users.

#Build

Run ng build to build the project. The build artifacts will be stored in the dist/ directory.

#Running unit tests

I'm not familiar with unit testing but i tried to add some unit tests to the project. Run ng test to run them.

#Additional information about project

I was applying to this company several months ago and I was working on the same task. This time I was working mostly on implementing proper access with different authentification roles and implementing like/dislike system. I tried to make proper data structures for new feature this time although I did not rework old data structures so they may seem flawed.
