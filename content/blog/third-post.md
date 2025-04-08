---
title: Third Post on the Same Day
date: 2023-01-15T18:12:05Z
author: Alex Johnson
tags: [example, time, sequencing]
excerpt: Another post to demonstrate time-based sequencing
---

# Third Post on the Same Day

This is yet another post published on January 15, 2023, but at a different time than the previous posts.

## Time-Based Sorting

With our enhanced date handling, this post will appear before the other January 15 posts in the collection listing because:

1. It has a later timestamp (18:12:05)
2. The system sorts by the full datetime, not just the date
3. This ensures the most recent content appears first

## ISO 8601 Date Format

We're using the ISO 8601 date format, which looks like:

\`\`\`
YYYY-MM-DDThh:mm:ssZ
\`\`\`

Where:
- YYYY is the year
- MM is the month
- DD is the day
- T separates the date and time portions
- hh is the hour (24-hour format)
- mm is the minute
- ss is the second
- Z indicates UTC time (you can also use +00:00 format for timezone offsets)

This is a standardized format that's widely supported and unambiguous.
