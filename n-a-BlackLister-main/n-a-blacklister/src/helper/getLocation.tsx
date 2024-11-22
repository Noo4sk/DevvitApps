import { Devvit, MenuItemOnPressEvent } from '@devvit/public-api';
import { eventLocation } from '../types/ILocationType.js';

export async function getLocation(event: MenuItemOnPressEvent, context: Devvit.Context): Promise<eventLocation | undefined> {
  let location: eventLocation = {} as eventLocation

  if (event.location === 'post') {
    location.type = 'post'
    location.location = await context.reddit.getPostById(event.targetId);

    return location

  } else if (event.location === 'comment') {
    location.type = 'comment'
    location.location = await context.reddit.getCommentById(event.targetId);

    return location
    
  }

  return undefined;
}

  