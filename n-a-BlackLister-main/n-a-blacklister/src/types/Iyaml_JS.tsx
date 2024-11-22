interface yamlObject {
  type: string,
  action: string,
  action_reason: string,

  title: string,
  priority: number,
  subreddit: string,

  reports: number,

  is_top_level: boolean,
  moderators_exempt: boolean,
  set_nsfw: boolean,

  body: string,
  body_shorter_than: number,

  author: {
    name: string[],
    post_karma: string,
    account_age: string,
    flair_css_class: string,
    set_flair: string[],
    overwrite_flair: boolean,
    contributor_quality: string,
  },
  crosspost_author: {}
  crosspost_subreddit:{
    name: string[]
  },
  parent_submission: string,

  comment: string,
  comment_locked: boolean,
  comment_stickied: boolean,

  message_subject: string,
  message: string,

  modmail: string,
  modmail_subject: string,
  
}

export default yamlObject