# Welcome To CrossPost-Auth

[![Devvit 0.11.1](https://raw.githubusercontent.com/CNC-Flare/CrossPost-Auth/301bfb9b37a264646d887223913fd640ada20c89/Assets/Badge/1_Devvit-0-11-1.svg)](https://developers.reddit.com/docs/)

**Features:**  
- Remove CrossPost from subreddit if user is not in the approved List.  
- Issues Strikes to users who keep trying to CrossPost with out permision  
- basic spam control, users cannot CrossPost the same post within a time frame [IE. Hour, Day, Ect...]

---  

### [Install Guide](https://github.com/CNC-Flare/CrossPost-Auth/blob/main/Install%20Guid.md)

---  
## Crosspost-Auth: Defualt Settings  
- Uses Reddit Wiki To House A List of Users Allowed to Cross-Post:  
    - crosspost-auth

- ID of the Subreddit Removal Reasons | If None Leave Blank:  
    - Removal Reason for unauthorized CrossPosting: Empty.  
    - Removal Reason for CrossPosting same content too often: Empty.
  
- Time frame for which Same Cross Post must wait for posting again:  
    - Hourly  
  
- Number of Strikes that a users can have before being Banned:
    - 3 Strikes

- Number of Days that a users will be ban due to cross-posting:
    - 1 day

- Database to use for the auth app: **Setting Cannot be Changed**
    - WIKI
---- 
## **Subreddit Menu Items**
### **Crosspost-Auth | Send Bug/Help Message: MOD ONLY**  
by clicking on

- SubReddit Setting  

---- 
### **Crosspost-Auth | Add User: MOD ONLY**  
by clicking on

- SubReddit Setting  

---- 
### **Crosspost-Auth | Remove User: MOD ONLY**  
by clicking on

- SubReddit Setting  

----  
### **Get Subreddit Removal Reasons ID (SRRR ID): MOD ONLY**  
by navagating to Subreddit setting ( Next to mod Tools)

- Crosspost-Auth | Get Removal Reasons
    1) Crosspost-Auth will mod mail the mod who had wanted to see the reasons.
    2) Ids can be copied to https://developers.reddit.com/r/*Your Subreddit*/apps/crosspost-auth. 

## **Comment/Post Menu Items**  
### **Request to allow Cross-poster: All**  
by clicking on  

- Comment/post Menu

---- 
### **Crosspost-Auth | Add Cross-post Auth: MOD ONLY**  
by clicking on

- Comment/post Menu

----  
### **Crosspost-Auth | Add Strike: MOD ONLY**  
by clicking on

- Comment/post Menu

----
### **Crosspost-Auth | Check User's Strikes: MOD ONLY**  
by clicking on

- Comment/post Menu

----
### **Crosspost-Auth | Remove Users Strikes: MOD ONLY**  
by clicking on

- Comment/post Menu

----

