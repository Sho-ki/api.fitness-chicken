Feature: Signup
  I want to signup on workout app

  Scenario: Signup successfully
    Given I make users:
     | email           | password |
     | user10@user.com  | 12345   |
    When I type my email in 'email'
    And I type my password in 'password'
    And I click on 'signup'
    Then I should see status code 201

  Scenario: 'email' duplicate error
    Given I use existed users:
     | email           | password |
     | user10@user.com  | 12345   |
    When I type my email in 'email'
    And I type my password in 'password'
    And I click on 'signup'
    Then I should see status code 500
   

 

  