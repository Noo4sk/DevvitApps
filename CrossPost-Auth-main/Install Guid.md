# Installing Guide
---
Add Crosspost-Auth To the subreddit
- Crosspost-Auth will auto adds **all the mods and the apps that are listed as Mods**, to help jump start Posting. Mods might need to add some high karma Users to the list to encourage crossposting more.

---
### Saved Respones
*** Optional

If these are left blank Crosspost-Auth will post its own reason. 

Adding to subreddit Saved Respones
- Un-apporved Cross-Post: Not in Approved list
- Cross-posting Same Content: if cross-post was made withing the last (hour, day, week, ect...)
- Subreddit was Ban from crossposting: Subreddit is not allowed to cross post to this reddit

Clicking Get Saved Response from the subreddit menu. 
- this will mod mail the user asking for the Subreddit Response

Once Messaged The Ids of the Saved Responses should be added to the users settings 
- https://developers.reddit.com/r/your_subreddit/apps/crosspost-auth

---
### Auto-Mod not Cross-Compatible (yet)
At this time using both might conflict with eachother. its Reocommended to removal only the cross-post items from the auto-mod

---
### Settings
- Time frame for which Same Cross Post must wait for posting again.
    - can be changed From Hourly to [ Daily, Weekly, Monthly, Yearly ]

- Number of Strikes that a users can have before being Banned
    - Can be any number, 3 is recommended

- Number of Days that a users will be ban due to cross-posting.
    - Can be any number, 1 - 90 days is recommended

--- 

## Subreddit Auto Auth 
- The Amount of Combined Karma A user needs To be Approved [Post Karma + Comment Karma]
    - Can be any number, 500 total karma is recommended

- The Age of the Account *IN DAYS* needed To be Approved
    - Can be any number, 30 - 90 days is recommended
