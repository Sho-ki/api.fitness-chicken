Feature: Signin

  I want to signin on workput app


  Scenario: Signin successfully
    Given I have users:
     | email           | password |
     | user4@user.com  | 12345   |
    When I type an existed email in 'email'
    And I type a valid password in 'password'
    And I click on 'signin'
    Then I should see status code 200

  Scenario: Wrong password
    When I type an no-existed email in 'email'
    And I type an invalid password in 'password'
    And I click on 'signin'
    Then I should see status code 400

  