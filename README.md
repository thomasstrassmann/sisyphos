# Sisyphos

When building a small SPA with (potentially) endless items of todos, I immediatley thought of the greek tale of Sisyphos, so I decided to call the App this way. This is a quick overview of all implemented features:

- Adding, editing, deleting a todo item
- Mark a todo as completed
- Filter the todo based on its status
- use localstorage to persist items after reloading
- implementation of drap and drop functionality with the help of a lib called react-dnd
- due dates and highlighting todos, when overdue
- basic resonsive design

The goal was to write clean and maintainable code, use best practices and avoid unnecessary repetition. It would have been possible to structure the code more granularly (e.g. move the crud functions to a separate file), but since each component consists of less than 150 lines of code anyway, I decided not to take this step.

## Time required

The conception, logo design, project setup, coding itself and the debugging, styling and testing took about 6 hours, 5 hours and 45 minutes to be exact.

## Notes

I decided to keep the styling and animations to a minimum, as a to-do app doesn't invite you to style too much, at least in my opinion.

The app was tested manually and fulfills all functional tests, furthermore compiled webpack without any hints / errors and there are no errors in the console either.

I have reduced the commits to a minimum due to the size of the project. For more complex projects, it would of course be appropriate to perform a commit after every functional feature and to apply best practice.
