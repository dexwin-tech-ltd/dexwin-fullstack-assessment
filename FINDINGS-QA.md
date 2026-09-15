BUG REPORTS:

1. TITLE: Resizing layout causes content to overlap and become unreadable

SEVERITY: Minor(Cosmetic) because it hinders users with smaller screens like mobile phones to correctly view what is on the board and work.

STEPS TO REPRODUCE:
- Open TaskFlow frontend atport 5173(https://upgraded-invention-679p54xj75j25676-5173.app.github.dev/)
- Click on "Website Redesign"
- Right click in the page and click on Inspect, or Press F12 key
- Click on the toggle device toolbar button at the top left
- Click on Dimensions dropdown at the top and then choose any option in the "Mobile" section

EXPECTED
All contents in page should readjust to the new selected screen or view

ACTUAL
Text and buttons in the task board overlapped

EVIDENCE: 
BUG-1.png in EVIDENCE folder

WHO IS HURT: Users of the app who decide to log on to it on their mobile phones or smaller screens.

2. TITLE: Every user's password is exposed as plaintext in response body

SEVERITY: Blocker

STEPS TO REPRODUCE: 
- Open TaskFlow frontend atport 5173(https://upgraded-invention-679p54xj75j25676-5173.app.github.dev/)
- Right click in page and select inspect 
- Click on 'Network' tab at the top section of the developer tools
- Move to the 'Name' section and click on 'projects'
- Click on 'Response' tab on the right hand section

EXPECTED
No response body should display a password field

ACTUAL
Passwords of all user were displayed in plain readable text.

EVIDENCE
BUG-2a.png and BUG-2b in EVIDENCE folder

WHO IS HURT: All users of the system, this is because it is a security issue and any one with access to the url and a little knowledge can easily retrieve the password of users and use them for malicious gain.

3. TITLE: Switching projects does not refresh the task list

SEVERITY: Blocker, because the main purpose of the app is for users to access various tasks and work on them so if switching a tab does not refresh the tasks needed, it means the main purpose of the app cannot be achieved.

STEPS TO REPRODUCE: 
- Open TaskFlow frontend atport 5173(https://upgraded-invention-679p54xj75j25676-5173.app.github.dev/)
- Click on "Website Redesign" in the projects section
- Click on "Mobile App" in the projects section

EXPECTED:
Tasks on the board are supposed to be changed to from the Website redesign to the Mobile app tasks

ACTUAL:
Tasks did not refresh and remained same even when other Projects were clicked.

EVIDENCE:
BUG-3 in EVIDENCE folder

Who it hurts: All users of the platform who are to complete tasks.

4. TITLE: Task titles are blank on the board

SEVERITY: Major, this is because the task titles are what guide the users on the specific work they are supposed to be doing. Having it blank means users are going to be confused on what to work on when they click on a project

STEPS TO REPRODUCE: 
- Open TaskFlow frontend atport 5173(https://upgraded-invention-679p54xj75j25676-5173.app.github.dev/)
- Click on "Website Redesign" in the projects section

EXPECTED:
Tasks names are supposed to be dispalyed on the board for each task

ACTUAL:
Tasks names are blank even though the class element exists.

EVIDENCE:
BUG-4 in EVIDENCE folder

Who it hurts: Users of the platform.

RISK BASED TEST PLAN
What I'd Cover:
- I would check to make sure that passwords are no longer showing in response bodies
- I would make a regression test to check if the switching bug and task names are fixed
- I would cover the happy path which is to login>create projects> create tasks> complete tasks/reopen > verify that tasks are done
- Negative test on all API calls: these may include out of scope values, empty request bodies, wrong username and passwords.

What I'd Skip:
- I would skip performance and load testing using a tool like postman since this is a simple build and has only a few tasks and options.
- I would skip cosmetic issues as well

RELEASE GO/ NO-GO: This is a no-go because there is a serious security flaw in the app(Bug-2:Passwords being displayed in response body). It would have to worked on by developers so that the password field is removed and probably hashed if it is to remain.

SMOKE TEST IDEA
Go through the endpoints using methods in postman to login as a user, verify login and then create projects and tasks.

