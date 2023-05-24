# Django and React based project

## Quizzicalc is an education inspired project

This app aims to create a convenient way for students & tutors to make quizzes for simple algebraic problems, while making it engaging for the students using symbolic computational libraries.

*Sympy is responsible for question generation logic

*Django the web framework used to provide a python based environment for sympy to run in

*React is responsible for handling the front end 

## Walkthrough of set up

### **1. Setting up Python virtual environment**

Virtual environments are self-contained directories that contains a specific ver. of Python and its own set of installed packages (so your different projects' dependency versions dont conflict with each other) First install `virtualenvwrapper` (useful extension to make working with venv easy):

```
pip install virtualenvwrapper-win (for windows) / pip install virtualenvwrapper
mkvirtualenv project_name
```

As you are automatically inside the new virtual env (or you can use workon "project_name" to double confirm), download the relevant dependencies by doing pip install requirements.txt from the root folder.
**From now on all packages should be installed inside virtual environment**.
