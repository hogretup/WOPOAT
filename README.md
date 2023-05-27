# Django and React based project

## Quizzicalc is an education inspired project

This app aims to create a convenient way for students & tutors to make quizzes for simple algebraic problems, while making it engaging for the students using symbolic computational libraries.

*Sympy is responsible for question generation logic

*React is responsible for handling the front end 

## Walkthrough of set up

Clone this repository onto your computer.

### **1. Setting up Python virtual environment**

First install `virtualenvwrapper` (useful extension to make working with venv easy):

```
pip install virtualenvwrapper-win (for windows) / pip install virtualenvwrapper
mkvirtualenv project_name
pip install requirements.txt
```

As you are automatically inside the new virtual env (or you can use workon "project_name" to double confirm), download the relevant dependencies by doing pip install requirements.txt from the root folder.
**From now on all packages should be installed inside virtual environment**.

### **2. Downloading relevant dependencies for React and building it**

Ensure that you have node.js downloaded on your computer. (we used v18.16.0 as of development)
Now we will download the relevant dependencies to compile the React component

```
cd frontend
npm install
npm run build
```

npm run builds will create the relevant build directory with the production build of our app for Django to run

### **3. Running the Django project**

Now that everything is prepared, run this command within the root folder (ie exit the frontend folder if you are still inside)

```
python manage.py runserver
```

Quizzicalc should now be hosted on your local host
Happy quizzing!
