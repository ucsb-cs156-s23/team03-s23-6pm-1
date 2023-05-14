Bring over backend crud files for Model2 from team02

Throughout this issue, `Model2` is whatever the second model (in addition to `Model2` was in team02.  You may want to search and replace `Model2` with your class name and `model2` with your class name (lowercase) before adding this issue to your project.

# Acceptance Criteria:

- [ ] The `@Entity` class called Model2.java has been copied from the team02 repo to the team03 repo and committed.
- [ ] The `@Repository` class called `Model2Repository.java` has been copied from the team02 repo to the team03 repo and committed.  (Note that the file should be `Model2Repository.java`; the team02 instrutions erronously called it `Model2.java`; if you called it `Model2.java` please update the name now)
- [ ] The `@Repository` class called `Model2Repository.java` has been copied from the team02 repo to the team03 repo and committed.  (Note that the file should be `Model2Repository.java`; the team02 instrutions erronously called it `Model2.java`; if you called it `Model2.java` please update the name now)
- [ ] The controller file `Model2Controller.java` is copied from team02 to team03
- [ ] The controller tests file `Model2ControllerTests.java` is copied from team02 to team03

- [ ] You can see the `model2s` table when you do these steps:
      1. Connect to postgres command line with 
         ```
         dokku postgres:connect team03-qa-db
         ```
      2. Enter `\dt` at the prompt. You should see
         `model2s` listed in the table.
      3. Use `\q` to quit

- [ ] The backend POST,GET,PUT,DELETE endpoints for `Restauarant` all work properly in Swagger.

